import { Cloudflare } from 'cloudflare';

// Check if we have API credentials
const apiKey = process.env.CLOUDFLARE_API_TOKEN || process.env.CF_API_TOKEN;
const email = process.env.CLOUDFLARE_EMAIL || process.env.CF_EMAIL;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || process.env.CF_ACCOUNT_ID;

if (!apiKey) {
  console.log("❌ No Cloudflare API credentials found in environment variables.");
  console.log("\n📝 To list KV namespaces, you need to set one of these:");
  console.log("   - CLOUDFLARE_API_TOKEN (recommended)");
  console.log("   - CF_API_TOKEN");
  console.log("\n🔑 You can create an API token at: https://dash.cloudflare.com/profile/api-tokens");
  console.log("\n💡 Alternatively, if you have wrangler configured locally, you can run:");
  console.log("   npx wrangler kv namespace list");
  process.exit(0);
}

const cf = new Cloudflare({
  apiKey: apiKey,
  email: email || undefined,
});

try {
  console.log("🔍 Fetching KV namespaces...\n");
  const namespaces = await cf.kv.namespaces.list();
  
  if (namespaces.length === 0) {
    console.log("✅ No KV namespaces found in your Cloudflare account.");
  } else {
    console.log("📦 Found KV Namespaces:\n");
    console.log("┌─────────────────────────────────────────────────────────────┐");
    console.log("│ ID                                 │ Title                  │");
    console.log("├────────────────────────────────────┼────────────────────────┤");
    
    namespaces.forEach(ns => {
      const id = ns.id.padEnd(34);
      const title = (ns.title || 'Untitled').padEnd(22);
      console.log(`│ ${id} │ ${title} │`);
    });
    
    console.log("└────────────────────────────────────┴────────────────────────┘");
    console.log(`\n✅ Total: ${namespaces.length} namespace(s)`);
  }
} catch (error) {
  console.error("❌ Error fetching KV namespaces:", error.message);
  if (error.message.includes('authentication')) {
    console.log("\n💡 Your API token may be invalid or expired.");
  }
}
