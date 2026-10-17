import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Languages, Loader2, PenLine, RefreshCw, Sparkles, Wand2 } from 'lucide-react'
import type { BlogPost, SiteContent } from '@shared/types'
import { api } from '@/lib/api'
import { mirrorCollection, useAutoTranslate } from '@/lib/auto-translate'
import { Markdown, readingMinutes } from '@/lib/markdown'
import { useLanguage } from '@/lib/translations/LanguageProvider'
import { getLanguageDisplayName } from '@/lib/translations'
import { cn, slugify, sortByOrder } from '@/lib/utils'

/**
 * The AI writer for the blog.
 *
 * The owner gives it a topic in a sentence — "what to do if you get sunburnt
 * before your massage" — and Workers AI drafts a whole article in the voice
 * of the business: title, summary, category, tags and a Markdown body. She
 * reads it, edits anything she likes right here, and saves it as a draft or
 * publishes it. With auto-translate on, the same save writes the article into
 * every other language too, each with its own readable URL.
 *
 * Nothing reaches the public site until the owner presses save.
 */

type Tone = 'warm' | 'practical' | 'playful' | 'luxurious'
type Length = 'short' | 'medium' | 'long'

interface Draft {
  title: string
  excerpt: string
  category: string
  tags: string[]
  body: string
}

const field =
  'w-full rounded-2xl border border-ocean-900/12 bg-white/80 px-4 py-3 text-[0.95rem] text-ocean-950 outline-none transition-colors placeholder:text-ocean-800/45 focus:border-lagoon-400'

export function BlogWriter({ content, onSaved }: { content: SiteContent; onSaved: () => Promise<void> }) {
  const { t, language } = useLanguage()
  const autoTranslate = useAutoTranslate()

  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [tone, setTone] = useState<Tone>('warm')
  const [length, setLength] = useState<Length>('medium')
  const [publish, setPublish] = useState(false)
  const [translate, setTranslate] = useState(autoTranslate.enabled)

  const [draft, setDraft] = useState<Draft | null>(null)
  const [model, setModel] = useState('')
  const [preview, setPreview] = useState(true)
  const [busy, setBusy] = useState<'writing' | 'saving' | 'translating' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)

  const site = content.site
  const ideas = [t('writer.idea1'), t('writer.idea2'), t('writer.idea3'), t('writer.idea4')]

  async function write() {
    if (!topic.trim()) return
    setBusy('writing')
    setError(null)
    setDone(null)
    try {
      const result = await api.aiBlog({
        topic,
        keywords,
        tone,
        length,
        language,
        brand: site.brandName,
        area: [site.neighborhood, site.city].filter(Boolean).join(', '),
        services: sortByOrder(content.services).map((service) => service.name),
      })
      setDraft({
        title: result.title,
        excerpt: result.excerpt,
        category: result.category,
        tags: result.tags,
        body: result.body,
      })
      setModel(result.model)
      setPreview(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('writer.error'))
    } finally {
      setBusy(null)
    }
  }

  async function save() {
    if (!draft) return
    setBusy('saving')
    setError(null)
    try {
      const current = await api.adminContent(language)
      const before = (current.posts ?? []) as BlogPost[]
      const nextOrder = Math.max(0, ...before.map((post) => Number(post.order ?? 0))) + 1
      const baseSlug = slugify(draft.title) || `post-${Date.now().toString(36)}`
      const taken = new Set(before.map((post) => post.slug))
      const slug = taken.has(baseSlug) ? `${baseSlug}-${Date.now().toString(36).slice(-4)}` : baseSlug

      const post: BlogPost = {
        id: `post-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
        slug,
        title: draft.title.trim(),
        excerpt: draft.excerpt.trim(),
        body: draft.body.trim(),
        category: draft.category.trim(),
        tags: draft.tags,
        coverImage: '',
        author: site.brandName,
        publishedAt: new Date().toISOString().slice(0, 10),
        readMinutes: readingMinutes(draft.body),
        published: publish,
        featured: false,
        order: nextOrder,
      }
      const after = [...before, post]
      await api.saveCollection('posts', after, language)

      let note = publish ? t('writer.published') : t('writer.saved_draft')
      if (translate) {
        setBusy('translating')
        try {
          const mirrored = await mirrorCollection(
            'posts',
            before as unknown as Record<string, unknown>[],
            after as unknown as Record<string, unknown>[],
            language,
          )
          if (mirrored.languages.length) {
            note += ` ${t('writer.translated_into', { languages: mirrored.languages.map(getLanguageDisplayName).join(', ') })}`
          }
        } catch (cause) {
          setError(t('admin.translate_failed', { reason: cause instanceof Error ? cause.message : '' }))
        }
      }

      await onSaved()
      setDone(note)
      setDraft(null)
      setTopic('')
      setKeywords('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('admin.save_error'))
    } finally {
      setBusy(null)
    }
  }

  return (
    <section className="relative mb-10 overflow-hidden rounded-[2.5rem_1.25rem_2.5rem_1.25rem] bg-gradient-to-br from-flamingo-100 via-white/90 to-sky-100 p-6 shadow-soft ring-1 ring-white/70 sm:p-8">
      <div aria-hidden="true" className="larimar absolute inset-y-0 left-0 w-2.5" />
      <header className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-[46%_54%_50%_50%/52%_46%_54%_48%] bg-gradient-to-br from-flamingo-500 to-sun-400 text-pearl shadow-soft">
          <Wand2 className="size-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl text-ocean-950">{t('writer.title')}</h2>
          <p className="mt-1 max-w-xl text-[0.9rem] leading-relaxed text-ocean-800/85">{t('writer.lead')}</p>
        </div>
      </header>

      {!draft && (
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[0.8rem] font-bold text-ocean-900">{t('writer.topic')}</span>
            <textarea
              rows={2}
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder={t('writer.topic_placeholder')}
              className={field}
            />
          </label>

          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
            {ideas.map((idea) => (
              <button
                key={idea}
                type="button"
                onClick={() => setTopic(idea)}
                className="shrink-0 rounded-full border border-flamingo-300/70 bg-white/70 px-3.5 py-1.5 text-[0.78rem] font-semibold text-flamingo-800 transition-colors hover:bg-flamingo-100"
              >
                <Sparkles className="mr-1 inline size-3" />
                {idea}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block sm:col-span-3">
              <span className="mb-1.5 block text-[0.8rem] font-bold text-ocean-900">{t('writer.keywords')}</span>
              <input
                value={keywords}
                onChange={(event) => setKeywords(event.target.value)}
                placeholder={t('writer.keywords_placeholder')}
                className={field}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[0.8rem] font-bold text-ocean-900">{t('writer.tone')}</span>
              <select value={tone} onChange={(event) => setTone(event.target.value as Tone)} className={field}>
                {(['warm', 'practical', 'playful', 'luxurious'] as Tone[]).map((value) => (
                  <option key={value} value={value}>
                    {t(`writer.tone.${value}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[0.8rem] font-bold text-ocean-900">{t('writer.length')}</span>
              <select value={length} onChange={(event) => setLength(event.target.value as Length)} className={field}>
                {(['short', 'medium', 'long'] as Length[]).map((value) => (
                  <option key={value} value={value}>
                    {t(`writer.length.${value}`)}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <button
                type="button"
                onClick={write}
                disabled={!topic.trim() || busy !== null}
                className="sheen-hover inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-flamingo-600 to-sun-500 px-6 text-[0.92rem] font-bold text-pearl shadow-soft transition-all hover:brightness-110 disabled:opacity-50"
              >
                {busy === 'writing' ? <Loader2 className="size-4 animate-spin" /> : <PenLine className="size-4" />}
                {busy === 'writing' ? t('writer.writing') : t('writer.write')}
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {draft && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[0.78rem] font-semibold text-ocean-800/75">
                {t('writer.draft_in', { language: getLanguageDisplayName(language) })}
                {model && <span className="ml-2 opacity-70">· {model.split('/').pop()}</span>}
              </p>
              <div className="inline-flex rounded-full border border-ocean-900/12 bg-white/70 p-1">
                {[true, false].map((value) => (
                  <button
                    key={String(value)}
                    type="button"
                    onClick={() => setPreview(value)}
                    className={cn(
                      'rounded-full px-3.5 py-1.5 text-[0.75rem] font-bold transition-all',
                      preview === value ? 'bg-gradient-to-r from-sky-700 to-lagoon-600 text-sand-50' : 'text-ocean-800/80',
                    )}
                  >
                    {value ? t('writer.preview') : t('writer.edit')}
                  </button>
                ))}
              </div>
            </div>

            <input
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              className={cn(field, 'font-display text-xl')}
              aria-label={t('writer.field_title')}
            />
            <textarea
              rows={2}
              value={draft.excerpt}
              onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })}
              className={field}
              aria-label={t('writer.field_excerpt')}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={draft.category}
                onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                className={field}
                aria-label={t('writer.field_category')}
              />
              <input
                value={draft.tags.join(', ')}
                onChange={(event) =>
                  setDraft({ ...draft, tags: event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean) })
                }
                className={field}
                aria-label={t('writer.field_tags')}
              />
            </div>

            {preview ? (
              <div className="max-h-[28rem] overflow-y-auto rounded-3xl bg-white/85 p-6 ring-1 ring-ocean-900/8">
                <Markdown source={draft.body} className="prose-tropical text-[0.98rem]" />
              </div>
            ) : (
              <textarea
                rows={16}
                value={draft.body}
                onChange={(event) => setDraft({ ...draft, body: event.target.value })}
                className={cn(field, 'font-mono text-[0.85rem] leading-relaxed')}
                aria-label={t('writer.field_body')}
              />
            )}

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-[0.88rem] font-semibold text-ocean-900">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={publish} onChange={(event) => setPublish(event.target.checked)} className="size-4 accent-flamingo-600" />
                {t('writer.publish_now')}
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={translate}
                  onChange={(event) => setTranslate(event.target.checked)}
                  className="size-4 accent-lagoon-600"
                />
                <Languages className="size-4 text-lagoon-700" />
                {t('writer.translate_all')}
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={save}
                disabled={busy !== null || !draft.title.trim() || !draft.body.trim()}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-sky-700 to-lagoon-600 px-6 text-[0.9rem] font-bold text-sand-50 shadow-soft transition-all hover:brightness-110 disabled:opacity-50"
              >
                {busy === 'saving' || busy === 'translating' ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4" />
                )}
                {busy === 'translating' ? t('admin.translating') : publish ? t('writer.save_publish') : t('writer.save_draft')}
              </button>
              <button
                type="button"
                onClick={write}
                disabled={busy !== null}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-ocean-900/12 bg-white/70 px-5 text-[0.88rem] font-semibold text-ocean-900 transition-colors hover:bg-white disabled:opacity-50"
              >
                {busy === 'writing' ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                {t('writer.again')}
              </button>
              <button
                type="button"
                onClick={() => setDraft(null)}
                disabled={busy !== null}
                className="h-12 rounded-full px-4 text-[0.88rem] font-semibold text-coral-600"
              >
                {t('action.discard')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-4 text-[0.86rem] font-medium text-coral-600">{error}</p>}
      {done && (
        <p className="mt-4 flex items-center gap-2 text-[0.88rem] font-semibold text-palm-800">
          <Check className="size-4" />
          {done}
        </p>
      )}
    </section>
  )
}
