import { seedContent } from '../../../shared/seed';
import type { SiteContent, CollectionKey } from '../../../shared/types';

interface Env {
  CONTENT: KVNamespace;
  AI?: Ai;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;
  const segments = Array.isArray(params.route) ? params.route : params.route ? [params.route] : [];
  const path = segments.join('/');
  const method = request.method.toUpperCase();

  if (method === 'OPTIONS') return new Response(null, { status: 204 });

  try {
    // AI Processing endpoint - uses Cloudflare Workers AI
    if (path === 'process' && method === 'POST') {
      const body = await request.json().catch(() => ({})) as { 
        input?: string; 
        language?: 'en' | 'es';
        context?: string;
      };

      const userInput = body.input || '';
      const userLang = body.language || 'en';
      
      if (!userInput.trim()) {
        return json({ 
          response: userLang === 'es' 
            ? 'Por favor, dime qué te gustaría hacer.' 
            : 'Please tell me what you would like to do.',
        });
      }

      // Check if we have access to Cloudflare AI
      if (!env.AI) {
        // Fallback: Return a simulated response
        return json(simulateAIResponse(userInput, userLang));
      }

      // Use Cloudflare Workers AI (@cf/meta/llama-3-8b-instruct)
      const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
        messages: [
          { role: 'system', content: getSystemPrompt(userLang) },
          { role: 'user', content: userInput },
        ],
        max_tokens: 512,
      });

      const responseText = (aiResponse as { response?: string }).response || '';
      
      // Parse the response for any actions
      const action = parseActionFromResponse(responseText, userLang);

      return json({
        response: responseText,
        action,
      });
    }

    // Translation endpoint
    if (path === 'translate' && method === 'POST') {
      const body = await request.json().catch(() => ({})) as {
        text?: string;
        targetLang?: 'en' | 'es';
      };

      const text = body.text || '';
      const targetLang = body.targetLang || 'en';

      if (!text.trim()) {
        return json({ translated: '' });
      }

      // If we have Cloudflare AI, use it for translation
      if (env.AI) {
        const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
          messages: [
            { 
              role: 'system', 
              content: `You are a professional translator. Translate the following text to ${targetLang === 'es' ? 'Spanish' : 'English'}. Only output the translation, nothing else.` 
            },
            { role: 'user', content: text },
          ],
          max_tokens: 256,
        });

        const translated = (aiResponse as { response?: string }).response || text;
        return json({ translated });
      }

      // Fallback: Simple mock translation
      return json({ translated: text });
    }

    return json({ error: 'Unknown endpoint' }, { status: 404 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return json({ error: message }, { status: 500 });
  }
};

function getSystemPrompt(lang: 'en' | 'es'): string {
  return lang === 'es'
    ? `Eres un asistente de IA para administrar un sitio web de spa/masajes. Puedes ayudar a:\n1. Crear, actualizar o eliminar tratamientos, miembros del equipo, lugares, reseñas, etc.\n2. Traducir contenido al español o inglés\n3. Actualizar la configuración del sitio (nombre, WhatsApp, mapa, horas, etc.)\n\nResponde de manera concisa y amigable.`
    : `You are an AI assistant for managing a spa/massage website. You can help to:\n1. Create, update, or delete treatments, team members, places, reviews, etc.\n2. Translate content to Spanish or English\n3. Update site settings (name, WhatsApp, map, hours, etc.)\n\nRespond concisely and friendly.`;
}

function simulateAIResponse(input: string, lang: 'en' | 'es'): { response: string; action?: unknown } {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('map') || lowerInput.includes('location') || lowerInput.includes('google maps')) {
    return {
      response: lang === 'es'
        ? 'Para configurar el mapa de Google, ve a Configuración del Sitio → Ubicación y Horas.'
        : 'To set up Google Maps, go to Site Settings → Location & Hours.',
      action: { type: 'settings', section: 'location' },
    };
  }
  
  return {
    response: lang === 'es'
      ? '¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?'
      : 'Hello! I\'m your AI assistant. How can I help you today?',
  };
}

function parseActionFromResponse(response: string): unknown | undefined {
  try {
    const jsonMatch = response.match(/\{[^}]*"action"[^}]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.action;
    }
  } catch {
    // Ignore parsing errors
  }
  return undefined;
}

function json(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { ...init?.headers, 'Content-Type': 'application/json' },
  });
}
