/**
 * AI endpoints — powered by Cloudflare Workers AI.
 *
 *   GET  /api/ai/status      is the AI binding present, and which models
 *   POST /api/ai/chat        the guided admin conversation (llama-3.1-8b)
 *   POST /api/ai/translate   text or a batch of fields, en ↔ es
 *                            (`long: true` for whole articles, chunked by paragraph)
 *   POST /api/ai/blog        drafts a blog post (llama-3.3-70b, 8b fallback)
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
// Long-form writing needs the bigger model: the 8B one loses the thread of an
// article after a few paragraphs. It stays the fallback if the 70B is busy.
const WRITER_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast'
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
      models: { text: TEXT_MODEL, writer: WRITER_MODEL, stt: STT_MODEL, tts: TTS_MODEL },
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

      // Long mode: a whole article. Split on blank lines into ~1,400-character
      // chunks so no single call is long enough for the model to start
      // summarising instead of translating, and keep the Markdown marks.
      if ((body as { long?: boolean }).long) {
        const chunks: string[] = []
        let current = ''
        for (const paragraph of text.slice(0, 24_000).split(/\n{2,}/)) {
          if (current && current.length + paragraph.length > 1400) {
            chunks.push(current)
            current = ''
          }
          current = current ? `${current}\n\n${paragraph}` : paragraph
        }
        if (current) chunks.push(current)

        const out: string[] = []
        for (const chunk of chunks) out.push(await translateLong(env.AI, chunk, target))
        return json({ translated: out.join('\n\n') })
      }

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

    /* ------------------------------------------------------------- blog */

    if (path === 'blog' && method === 'POST') {
      const body = (await request.json().catch(() => ({}))) as {
        topic?: string
        keywords?: string
        tone?: string
        length?: string
        language?: string
        category?: string
        brand?: string
        area?: string
        services?: string[]
      }
      const topic = (body.topic ?? '').trim().slice(0, 600)
      if (!topic) return fail(400, 'Tell the writer what the article is about.')

      const draft = await writeBlog(env.AI, {
        topic,
        keywords: (body.keywords ?? '').slice(0, 300),
        tone: (body.tone ?? 'warm').slice(0, 40),
        length: body.length === 'short' ? 'short' : body.length === 'long' ? 'long' : 'medium',
        lang: body.language === 'es' ? 'es' : 'en',
        category: (body.category ?? '').slice(0, 60),
        brand: (body.brand ?? 'the studio').slice(0, 80),
        area: (body.area ?? 'Bávaro, Punta Cana').slice(0, 120),
        services: (body.services ?? []).slice(0, 14).map((name) => String(name).slice(0, 60)),
      })
      if (!draft) return fail(502, 'The writer did not return a usable draft. Try again, or rephrase the topic.')
      return json(draft)
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

async function translateLong(ai: Ai, text: string, target: string): Promise<string> {
  const messages = [
    {
      role: 'system',
      content:
        `Translate the user's article excerpt into ${target}. It is Markdown: keep every "## ", "### ", "- ", "> ", ` +
        `"**", "*" and [link](url) exactly where they are, and keep the blank lines between paragraphs. ` +
        `Keep brand names, place names, prices and numbers unchanged. Translate everything else, completely — never summarise. ` +
        `Reply with the translation only.`,
    },
    { role: 'user', content: text },
  ]
  for (const model of [WRITER_MODEL, TEXT_MODEL]) {
    try {
      const out = (await ai.run(model as Parameters<Ai['run']>[0], { messages, max_tokens: 1800, temperature: 0.15 } as never)) as {
        response?: string
      }
      const value = cleanTranslation(out.response ?? '')
      if (value) return value
    } catch {
      // Try the next model.
    }
  }
  return text
}

interface BlogBrief {
  topic: string
  keywords: string
  tone: string
  length: 'short' | 'medium' | 'long'
  lang: 'en' | 'es'
  category: string
  brand: string
  area: string
  services: string[]
}

export interface BlogDraft {
  title: string
  excerpt: string
  category: string
  tags: string[]
  body: string
  model: string
}

/**
 * Drafts one article. The model writes a small labelled header and then the
 * body as Markdown — a format it gets right far more often than a JSON object
 * with a long string inside, which it tends to break with an unescaped quote.
 */
async function writeBlog(ai: Ai, brief: BlogBrief): Promise<BlogDraft | null> {
  const words = brief.length === 'short' ? '300 to 400' : brief.length === 'long' ? '900 to 1100' : '550 to 700'
  const language = brief.lang === 'es' ? 'Spanish (Dominican, warm and natural, using "tú")' : 'English'

  const system =
    `You write the blog for ${brief.brand}, a small women-run mobile massage business that visits guests in their hotel room, villa or terrace in ${brief.area}, Dominican Republic. ` +
    `Readers are tourists on holiday, often reading on a phone. Write in ${language}.\n\n` +
    `VOICE: ${brief.tone}, plain, specific and kind. Practical advice a local therapist would really give. Never salesy, never medical claims, no invented prices, no invented reviews, no invented people.\n` +
    (brief.services.length ? `TREATMENTS WE OFFER (mention only if relevant): ${brief.services.join(', ')}.\n` : '') +
    `LENGTH: ${words} words in the body.\n\n` +
    `FORMAT — reply with exactly this, nothing before or after:\n` +
    `TITLE: <a warm, specific title, max 80 characters>\n` +
    `EXCERPT: <one or two sentences that make someone want to read it, max 220 characters>\n` +
    `CATEGORY: <one or two words>\n` +
    `TAGS: <three to five short tags, comma separated>\n` +
    `---\n` +
    `<the article body in Markdown: short paragraphs separated by blank lines, two to four "## " subheadings, ` +
    `at most one "- " list, at most one "> " quote. Do not repeat the title. End with a gentle line inviting readers to message us on WhatsApp.>`

  const user =
    `Write an article about: ${brief.topic}` +
    (brief.keywords ? `\nWork in these phrases naturally: ${brief.keywords}` : '') +
    (brief.category ? `\nCategory: ${brief.category}` : '')

  for (const model of [WRITER_MODEL, TEXT_MODEL]) {
    try {
      const out = (await ai.run(model as Parameters<Ai['run']>[0], {
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        max_tokens: brief.length === 'long' ? 2400 : 1600,
        temperature: 0.7,
      } as never)) as { response?: string }
      const draft = parseDraft(out.response ?? '', brief)
      if (draft) return { ...draft, model }
    } catch {
      // Try the next model.
    }
  }
  return null
}

function parseDraft(raw: string, brief: BlogBrief): Omit<BlogDraft, 'model'> | null {
  const text = raw.replace(/^```(?:markdown|md)?\s*|\s*```$/g, '').trim()
  const field = (name: string) => {
    const match = text.match(new RegExp(`^\\**${name}\\**\\s*:\\s*(.+)$`, 'im'))
    return match ? match[1].replace(/^["“]|["”]$/g, '').trim() : ''
  }
  const split = text.search(/^-{3,}\s*$/m)
  let body = split >= 0 ? text.slice(split).replace(/^-{3,}\s*/, '') : ''
  if (!body) {
    // No separator: take everything after the last header line.
    body = text
      .split('\n')
      .filter((line) => !/^\**(TITLE|EXCERPT|CATEGORY|TAGS)\**\s*:/i.test(line.trim()))
      .join('\n')
  }
  body = body.trim()
  const title = field('TITLE')
  if (!title || body.length < 200) return null
  return {
    title: title.slice(0, 120),
    excerpt: (field('EXCERPT') || body.replace(/[#>*_-]/g, '').slice(0, 200)).slice(0, 280),
    category: (field('CATEGORY') || brief.category || (brief.lang === 'es' ? 'Bienestar' : 'Wellbeing')).slice(0, 40),
    tags: field('TAGS')
      .split(/[,;]/)
      .map((tag) => tag.replace(/^#/, '').trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 6),
    body,
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
