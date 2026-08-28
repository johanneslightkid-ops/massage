#!/usr/bin/env node

/**
 * Seed KV Namespace Script
 * 
 * Populates Cloudflare KV with initial site content and admin password.
 * 
 * Usage:
 *   node scripts/seed-kv.mjs              # Production (default)
 *   node scripts/seed-kv.mjs preview      # Preview environment
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';

// KV Namespace configuration
const CONFIG = {
  production: {
    namespaceId: '09e7faead934494c8e48ffb806f0ed3e',
    name: 'Production'
  },
  preview: {
    namespaceId: 'e21d3f61654b4a11986a7ac04da9f018',
    name: 'Preview'
  }
};

const KV_KEYS = {
  content: 'content:v1',
  password: 'auth:password'
};

/**
 * Generate PBKDF2 hash for admin password
 */
async function generatePasswordHash(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' },
    key,
    256
  );
  
  const toBase64 = (bytes) => {
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  };
  
  return `pbkdf2$150000$${toBase64(salt)}$${toBase64(new Uint8Array(bits))}`;
}

/**
 * Extract seed content from TypeScript file
 */
function extractSeedContent() {
  const content = readFileSync('./shared/seed.ts', 'utf-8');
  
  // Find the seedContent export
  const startMarker = 'export const seedContent = ';
  const startIndex = content.indexOf(startMarker);
  
  if (startIndex === -1) {
    throw new Error('Could not find seedContent export in shared/seed.ts');
  }
  
  // Extract everything after the marker
  let extracted = content.substring(startIndex + startMarker.length);
  
  // Find matching closing brace (simple approach - count braces)
  let braceCount = 0;
  let endIndex = 0;
  let inString = false;
  let escapeNext = false;
  
  for (let i = 0; i < extracted.length; i++) {
    const char = extracted[i];
    
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    
    if (char === "'" || char === '"') {
      inString = !inString;
      continue;
    }
    
    if (!inString) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      
      if (braceCount === 0) {
        endIndex = i + 1;
        break;
      }
    }
  }
  
  extracted = extracted.substring(0, endIndex).trim();
  
  // Remove TypeScript type annotations
  extracted = extracted
    .replace(/:\s*[A-Za-z_<>\[\]|,\s\(\)]+(?=[,:}\]])/g, '')
    .replace(/as\s+[A-Za-z_\[\]]+/g, '');
  
  try {
    // Safely evaluate the object
    const result = eval(`(${extracted})`);
    return result;
  } catch (error) {
    throw new Error(`Failed to parse seedContent: ${error.message}`);
  }
}

/**
 * Main seeding function
 */
async function seedKV(environment = 'production') {
  const config = CONFIG[environment];
  
  if (!config) {
    console.error(`❌ Unknown environment: ${environment}`);
    console.error('Valid environments: production, preview');
    process.exit(1);
  }
  
  console.log(`\n🌱 Seeding ${config.name} KV namespace...`);
  console.log(`   Namespace ID: ${config.namespaceId}\n`);
  
  try {
    // Get seed content
    console.log('📦 Loading seed content...');
    const seedContent = extractSeedContent();
    const contentJson = JSON.stringify(seedContent);
    
    // Generate password hash
    console.log('🔐 Generating password hash...');
    const passwordHash = await generatePasswordHash('massage');
    
    // Write content to temp files
    const contentFile = './.kv-content-temp.json';
    const passwordFile = './.kv-password-temp.txt';
    
    writeFileSync(contentFile, contentJson);
    writeFileSync(passwordFile, passwordHash);
    
    // Upload to KV using wrangler
    console.log('⬆️  Uploading content:v1...');
    execSync(
      `npx wrangler kv key put "${KV_KEYS.content}" --namespace-id=${config.namespaceId} --path="${contentFile}"`,
      { stdio: 'inherit' }
    );
    console.log('✅ Content saved');
    
    console.log('⬆️  Uploading auth:password...');
    execSync(
      `npx wrangler kv key put "${KV_KEYS.password}" --namespace-id=${config.namespaceId} --path="${passwordFile}"`,
      { stdio: 'inherit' }
    );
    console.log('✅ Password saved');
    
    // Cleanup temp files
    unlinkSync(contentFile);
    unlinkSync(passwordFile);
    
    console.log('\n✨ KV namespace seeded successfully!\n');
    console.log('📝 Admin Access:');
    console.log('   URL: https://your-site.com/admin');
    console.log('   Password: massage');
    console.log('\n⚠️  IMPORTANT: Change the default password after first login!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nMake sure you are logged in to Cloudflare:');
    console.error('   npx wrangler login\n');
    process.exit(1);
  }
}

// Run
const env = process.argv[2] || 'production';
seedKV(env);
