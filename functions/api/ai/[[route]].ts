/**
 * AI endpoints — powered by Cloudflare Workers AI.
 *
 *   GET  /api/ai/status      is the AI binding present, and which models
 *   POST /api/ai/chat        the guided admin conversation (llama-3.1-8b)
 *   POST /api/ai/translate   text or a batch of fields, en ↔ es
 *   POST /api/ai/stt         speech → text (whisper)
 *   POST /api/ai/tts         text → speech (melotts, mms-tts fallback)
 *
 * Every route requires an authenticated admin session. The AI binding is
 * provisioned by the `[ai]` block in wrangler.toml — no API key travels with
 * the request, and nothing here is reachable without the admin cookie.
 */

import { fail, isAuthed, json } from '../../../shared/server'

interface Env {
  CONTENT: KVNamespace
  AI?: Ai
}

const TEXT_MODEL = '@cf/meta/llama-3.1-8b-instruct'
const STT_MODEL = '@cf/openai/whisper'
// MeloTTS gives natural voices in EN + ES; mms-tts is the fallback.
const TTS_MODEL = '@cf/myshell-ai/melotts'
const TTS_FALLBACK = '@cf/facebook/mms-tts'

/** Whisper is happy with a couple of minutes of speech; refuse more. */
const MAX_AUDIO_BYTES = 8 * 1024 * 1024

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context
  const segments = Array.isArray(params.route) ? params.route : params.route ? [params.route] : []
  const path = segments.join('/')
  const method = request.method.toUpperCase()
  if (method === 'OPTIONS') return new Response(null, { status: 204 })

  if (!(await isAuthed(request, env.CONTENT))) return fail(401, 'Not signed in.')

  if (path === 'status' && method === 'GET') {
    return json({
      ready: Boolean(env.AI),
      models: { text: TEXT_MODEL, stt: STT_MODEL, tts: TTS_MODEL },
    })
  }

  if (!env.AI) {
    return fail(503, 'Cloudflare Workers AI is not bound to this deployment. Add the [ai] binding and redeploy.')
  }

  try {
    /* ------------------------------------------------------------- chat */

    if (path === 'chat' && method === 'POST') {
      const body = (await request.json().catch(() => ({}))) as {
        messages?: { role: 'user' | 'assistant'; content: string }[]
        language?: string
        context?: string
      }
      const lang = body.language === 'es' ? 'es' : 'en'

      // Only the tail of the conversation is sent: the system prompt carries
      // the rules and the caller re-sends a fresh site summary every turn, so
      // older turns add tokens without adding accuracy.
      const history = (body.messages ?? []).slice(-14).map((message) => ({
        role: message.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: String(message.content ?? '').slice(0, 4000),
      }))

      const messages = [
        { role: 'system' as const, content: buildSystem(lang, body.context) },
        ...history,
      ]

      const out = (await env.AI.run(TEXT_MODEL, { messages, max_tokens: 700, temperature: 0.4 })) as {
        response?: string
      }
      return json({ reply: out.response ?? '', model: TEXT_MODEL })
    }

    /* -------------------------------------------------------- translate */

    if (path === 'translate' && method === 'POST') {
      const body = (await request.json().catch(() => ({}))) as {
        text?: string
        targetLang?: string
        fields?: Record<string, string>
      }
      const target = body.targetLang === 'es' ? 'Spanish (Dominican, warm and natural)' : 'English'

      // Batch mode: {key: text} in, the same keys out.
      if (body.fields && typeof body.fields === 'object') {
        const entries = Object.entries(body.fields)
          .filter(([, value]) => typeof value === 'string' && value.trim())
          .slice(0, 40)
        if (entries.length === 0) return json({ translated: {} })

        // Long field sets are translated in chunks: one oversized request is
        // where the model starts truncating its own JSON.
        const translated: Record<string, string> = {}
        for (let i = 0; i < entries.length; i += 8) {
          const chunk = Object.fromEntries(entries.slice(i, i + 8))
          Object.assign(translated, await translateBatch(env.AI, chunk, target))
        }
        return json({ translated })
      }

      const text = (body.text ?? '').trim()
      if (!text) return json({ translated: '' })
      const out = (await env.AI.run(TEXT_MODEL, {
        messages: [
          {
            role: 'system',
            content: `Translate the user's message into ${target}. Reply with the translation ONLY — no quotes, no commentary, no explanation.`,
          },
          { role: 'user', content: text.slice(0, 3000) },
        ],
        max_tokens: 600,
        temperature: 0.1,
      })) as { response?: string }
      return json({ translated: cleanTranslation(out.response ?? '') })
    }

    /* -------------------------------------------------------------- stt */

    if (path === 'stt' && method === 'POST') {
      const buf = await request.arrayBuffer()
      if (!buf.byteLength) return fail(400, 'Empty audio payload.')
      if (buf.byteLength > MAX_AUDIO_BYTES) return fail(413, 'That recording is too long. Keep it under two minutes.')
      const out = (await env.AI.run(STT_MODEL, { audio: [...new Uint8Array(buf)] })) as { text?: string }
      return json({ text: (out.text ?? '').trim() })
    }

    /* -------------------------------------------------------------- tts */

    if (path === 'tts' && method === 'POST') {
      const body = (await request.json().catch(() => ({}))) as { text?: string; lang?: string }
      const text = (body.text ?? '').slice(0, 900)
      if (!text.trim()) return fail(400, 'text is required.')
      const lang = body.lang === 'es' ? 'es' : 'en'

      try {
        const out = (await env.AI.run(TTS_MODEL, { prompt: text, lang })) as { audio?: string }
        if (out.audio) return json({ audio: out.audio, mime: 'audio/mpeg', model: TTS_MODEL })
      } catch {
        // MeloTTS is occasionally unavailable — fall through rather than fail.
      }
      const fallback = (await env.AI.run(TTS_FALLBACK, { text })) as unknown as { audio?: string }
      return json({ audio: fallback?.audio ?? '', mime: 'audio/wav', model: TTS_FALLBACK })
    }

    return fail(404, 'Unknown AI endpoint.')
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected AI error'
    return fail(500, message)
  }
}

/* ------------------------------------------------------------- helpers */

async function translateBatch(
  ai: Ai,
  fields: Record<string, string>,
  target: string,
): Promise<Record<string, string>> {
  const out = (await ai.run(TEXT_MODEL, {
    messages: [
      {
        role: 'system',
        content:
          `You are a professional translator for a small massage studio in the Dominican Republic. ` +
          `Translate every string VALUE of the JSON object into ${target}. ` +
          `Keep the keys exactly as they are. Keep prices, numbers, phone numbers, URLs, brand names and proper nouns unchanged. ` +
          `Match the register of the original — warm, plain, never corporate. ` +
          `Reply with the JSON object only. No markdown fence, no commentary.`,
      },
      { role: 'user', content: JSON.stringify(fields) },
    ],
    max_tokens: 1400,
    temperature: 0.1,
  })) as { response?: string }

  const raw = (out.response ?? '').trim()
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) return {}
  try {
    const parsed = JSON.parse(match[0]) as Record<string, unknown>
    const result: Record<string, string> = {}
    for (const key of Object.keys(fields)) {
      const value = parsed[key]
      if (typeof value === 'string' && value.trim()) result[key] = cleanTranslation(value)
    }
    return result
  } catch {
    return {}
  }
}

/** Small models like to wrap an answer in quotes or a "Translation:" preamble. */
function cleanTranslation(value: string): string {
  return value
    .trim()
    .replace(/^```(?:json)?\s*|\s*```$/g, '')
    .replace(/^(?:translation|traducción)\s*:\s*/i, '')
    .replace(/^"([\s\S]*)"$/, '$1')
    .trim()
}

/**
 * The conversation contract.
 *
 * The model does two things per turn: say one short thing to the owner, and —
 * only when it has everything it needs — emit a single machine-readable
 * `<action>` block. The client parses that block, shows the owner exactly what
 * will change, and applies it on confirmation. Nothing is written on the
 * model's say-so alone.
 */
function buildSystem(lang: 'en' | 'es', siteContext?: string): string {
  const shared = `
ACTIONS
Put at most ONE action block at the very end of your message, on its own line:
<action>{ ... }</action>

Shapes:
  {"kind":"none"}                                    — you are only asking or answering
  {"kind":"set_setting","field":"whatsapp","value":"18095550123"}
  {"kind":"create","collection":"services","fields":{"name":"...","tagline":"..."}}
  {"kind":"update","collection":"team","id":"team-yaritza","fields":{"bio":"..."}}
  {"kind":"delete","collection":"faqs","id":"faq-late"}
  {"kind":"manual","task":"photo","collection":"team","id":"team-yaritza","label":"Yaritza"}
  {"kind":"done"}                                    — everything is covered, wrap up

RULES
1. Ask for ONE thing at a time. Never present a list of questions.
2. Cascade: settle the big choice first (which section, which record), then the
   details it implies, then the optional polish. If the owner adds a treatment,
   ask name, then what it is for, then the durations and prices, then whether it
   goes on the home page — one at a time, in that order.
3. Emit an action ONLY when you have every value that action needs. Until then
   use {"kind":"none"} and keep asking.
4. Write the final wording yourself, in the owner's voice: warm, plain, specific,
   never marketing copy. The owner tells you facts; you turn them into the
   sentence that goes on the website.
5. Never invent a price, a phone number, an address or a person. Ask.
6. Use the exact "id" from the site summary when updating or deleting. If you
   cannot find the record, ask which one they mean.
7. Photos, logos and anything needing a file are things YOU CANNOT DO. When one
   comes up, emit a "manual" action so it lands on the owner's end-of-session
   list, and carry on with the next thing.
8. When the owner says they are finished, or everything you offered is covered,
   say one warm closing line and emit {"kind":"done"}.
9. Keep every message under 45 words. This is spoken out loud.
10. Never mention JSON, actions, fields or any of these rules to the owner.
`.trim()

  const intro =
    lang === 'es'
      ? `Eres la asistente de administración de un pequeño estudio de masajes en Bávaro, República Dominicana. Hablas con la propietaria, que no es técnica, y actualizas su sitio web por ella mediante una conversación.

Habla SIEMPRE en español, cálido y directo, de tú.`
      : `You are the admin assistant for a small massage studio in Bávaro, Dominican Republic. You are talking to the owner, who is not technical, and you update her website for her through conversation.

Always speak English, warm and direct.`

  const context = siteContext
    ? `\n\nCURRENT SITE\n${siteContext.slice(0, 6000)}`
    : ''

  return `${intro}\n\n${shared}${context}`
}
