/**
 * AI endpoints — powered by Cloudflare Workers AI (free tier).
 *
 *   POST /api/ai/chat        conversational admin helper (llama-3.1-8b)
 *   POST /api/ai/translate   plain-text translation (en ↔ es)
 *   POST /api/ai/tts         text → speech (melotts / mms-tts fallback)
 *   POST /api/ai/stt         speech → text (whisper)
 *
 * All routes require an authenticated admin session except when explicitly
 * marked. The AI binding is auto-provisioned by the [ai] block in
 * wrangler.toml — no keys, no billing (Workers AI free allocation).
 */

import { fail, isAuthed, json } from '../../../shared/server'

interface Env {
  CONTENT: KVNamespace
  AI?: Ai
}

const TEXT_MODEL  = '@cf/meta/llama-3.1-8b-instruct'
const STT_MODEL   = '@cf/openai/whisper'
// MeloTTS gives natural voices in EN + ES. Fallback to mms-tts if unavailable.
const TTS_MODEL   = '@cf/myshell-ai/melotts'
const TTS_FALLBACK = '@cf/facebook/mms-tts'

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context
  const segments = Array.isArray(params.route) ? params.route : params.route ? [params.route] : []
  const path = segments.join('/')
  const method = request.method.toUpperCase()
  if (method === 'OPTIONS') return new Response(null, { status: 204 })

  const authed = await isAuthed(request, env.CONTENT)
  if (!authed) return fail(401, 'Not signed in.')
  if (!env.AI) return fail(503, 'Cloudflare AI binding not available.')

  try {
    if (path === 'chat' && method === 'POST') {
      const body = (await request.json().catch(() => ({}))) as {
        messages?: { role: 'system' | 'user' | 'assistant'; content: string }[]
        language?: 'en' | 'es'
        systemHint?: string
      }
      const lang = body.language === 'es' ? 'es' : 'en'
      const system = buildSystem(lang, body.systemHint)
      const messages = [{ role: 'system' as const, content: system }, ...(body.messages ?? [])]
      const out = (await env.AI.run(TEXT_MODEL, { messages, max_tokens: 480 })) as { response?: string }
      return json({ reply: out.response ?? '', model: TEXT_MODEL })
    }

    if (path === 'translate' && method === 'POST') {
      const body = (await request.json().catch(() => ({}))) as {
        text?: string
        targetLang?: 'en' | 'es'
        fields?: Record<string, string>
      }
      const target = body.targetLang === 'es' ? 'Spanish' : 'English'

      if (body.fields && typeof body.fields === 'object') {
        // Batch mode: translate a JSON object of {key: text} → same keys.
        const entries = Object.entries(body.fields).filter(([, v]) => typeof v === 'string' && v.trim())
        const src = JSON.stringify(Object.fromEntries(entries))
        const out = (await env.AI.run(TEXT_MODEL, {
          messages: [
            { role: 'system', content: `You are a professional translator. Translate the string values of the following JSON object into ${target}. Preserve keys, structure, punctuation, product names and prices. Reply with valid JSON only.` },
            { role: 'user', content: src },
          ],
          max_tokens: 1024,
        })) as { response?: string }
        const raw = (out.response ?? '').trim()
        const jsonMatch = raw.match(/\{[\s\S]*\}/)
        let translated: Record<string, string> = {}
        if (jsonMatch) {
          try { translated = JSON.parse(jsonMatch[0]) } catch { translated = {} }
        }
        return json({ translated })
      }

      const text = (body.text ?? '').trim()
      if (!text) return json({ translated: '' })
      const out = (await env.AI.run(TEXT_MODEL, {
        messages: [
          { role: 'system', content: `Translate to ${target}. Reply with the translation ONLY, no commentary.` },
          { role: 'user', content: text },
        ],
        max_tokens: 512,
      })) as { response?: string }
      return json({ translated: (out.response ?? '').trim() })
    }

    if (path === 'stt' && method === 'POST') {
      const buf = await request.arrayBuffer()
      if (!buf.byteLength) return fail(400, 'Empty audio payload.')
      const out = (await env.AI.run(STT_MODEL, { audio: [...new Uint8Array(buf)] })) as { text?: string }
      return json({ text: out.text ?? '' })
    }

    if (path === 'tts' && method === 'POST') {
      const body = (await request.json().catch(() => ({}))) as { text?: string; lang?: 'en' | 'es' }
      const text = (body.text ?? '').slice(0, 900)
      if (!text.trim()) return fail(400, 'text is required.')
      const lang = body.lang === 'es' ? 'es' : 'en'
      // MeloTTS accepts a language hint; mms-tts uses model variant.
      try {
        const out = (await env.AI.run(TTS_MODEL, { prompt: text, lang })) as { audio?: string }
        if (out.audio) return json({ audio: out.audio, mime: 'audio/mpeg', model: TTS_MODEL })
      } catch (err) {
        // Fall through to the fallback below.
      }
      const fall = (await env.AI.run(TTS_FALLBACK, { text })) as unknown as { audio?: string }
      return json({ audio: fall?.audio ?? '', mime: 'audio/wav', model: TTS_FALLBACK })
    }

    return fail(404, 'Unknown AI endpoint.')
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected AI error'
    return fail(500, message)
  }
}

function buildSystem(lang: 'en' | 'es', hint?: string): string {
  const base =
    lang === 'es'
      ? `Eres el asistente de administración de un pequeño estudio de masajes tropical llamado Ola Serena en Bávaro, República Dominicana.

Ayudas a la propietaria (no técnica) a actualizar el sitio web mediante una conversación guiada, preguntando UNA cosa cada vez y confirmando antes de guardar.

Cuando el usuario quiera cambiar algo, responde con dos partes:
1) Un mensaje corto y amable en español (una o dos frases) preguntando o confirmando.
2) Al FINAL, un bloque JSON entre <action>…</action> con el cambio propuesto. Por ejemplo:
<action>{"kind":"update_setting","field":"whatsapp","value":"+1 809 555 1234"}</action>
<action>{"kind":"add_treatment","name":"Masaje aromático","description":"..."}</action>
<action>{"kind":"none"}</action>

Nunca inventes precios o teléfonos. Si te falta algo, pregúntalo primero.`
      : `You are the admin assistant for a small tropical massage studio called Ola Serena in Bávaro, Dominican Republic.

You help the (non-technical) owner update the website through a guided conversation — asking ONE thing at a time and confirming before saving.

When the user wants to change something, reply with two parts:
1) A short friendly message in English (one or two sentences) asking or confirming.
2) At the END, an action block between <action>…</action> with the proposed change. For example:
<action>{"kind":"update_setting","field":"whatsapp","value":"+1 809 555 1234"}</action>
<action>{"kind":"add_treatment","name":"Aromatic massage","description":"..."}</action>
<action>{"kind":"none"}</action>

Never invent prices or phone numbers. If you are missing information, ask for it first.`

  return hint ? `${base}\n\nExtra context: ${hint}` : base
}
