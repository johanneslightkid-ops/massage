import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  Check,
  ImagePlus,
  Loader2,
  Mic,
  Power,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import type { SiteContent } from '@shared/types'
import { useLanguage } from '@/lib/translations/LanguageProvider'
import { getLanguageDisplayName } from '@/lib/translations'
import { useAssistant } from '@/lib/assistant'
import type { AssistantAction } from '@/lib/assistant'
import { cn } from '@/lib/utils'

/** Turns a confirmed-pending action into one line the owner can actually judge. */
function describe(action: AssistantAction): string {
  switch (action.kind) {
    case 'set_setting':
      return `${action.field} → ${action.value}`
    case 'create':
      return `+ ${action.collection}: ${Object.entries(action.fields)
        .map(([key, value]) => `${key} = ${JSON.stringify(value)}`)
        .join('\n')}`
    case 'update':
      return `${action.collection} · ${action.id}\n${Object.entries(action.fields)
        .map(([key, value]) => `${key} = ${JSON.stringify(value)}`)
        .join('\n')}`
    case 'delete':
      return `− ${action.collection}: ${action.id}`
    default:
      return ''
  }
}

export function AssistantPanel({
  content,
  onApplied,
  onJump,
}: {
  content: SiteContent
  onApplied: () => Promise<void>
  onJump: (section: string) => void
}) {
  const { t, language } = useLanguage()
  const assistant = useAssistant({ content, language, t, onApplied })
  const [draft, setDraft] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [assistant.messages, assistant.thinking, assistant.pending])

  const busy = assistant.thinking || assistant.transcribing || assistant.applying

  function submit() {
    const text = draft.trim()
    if (!text) return
    setDraft('')
    void assistant.send(text)
  }

  return (
    <div>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ocean-950">{t('ai.title')}</h1>
          <p className="mt-1.5 max-w-xl text-[0.92rem] leading-relaxed text-ocean-800/65">{t('ai.lead')}</p>
        </div>
      </header>

      {/*
        One unmistakable toggle. Off it is an invitation; on it is a live,
        breathing control that says out loud that the microphone is available
        and the conversation is running.
      */}
      <button
        type="button"
        onClick={assistant.live ? assistant.finish : assistant.start}
        aria-pressed={assistant.live}
        className={cn(
          'group relative mt-7 flex w-full items-center gap-4 overflow-hidden rounded-5xl p-5 text-left shadow-lift transition-all duration-500 sm:p-6',
          assistant.live
            ? 'bg-gradient-to-br from-flamingo-600 via-coral-500 to-sun-500 text-white'
            : 'bg-gradient-to-br from-sky-700 via-lagoon-600 to-palm-600 text-sand-50',
        )}
      >
        <span
          className={cn(
            'grid size-14 shrink-0 place-items-center rounded-[46%_54%_50%_50%/52%_46%_54%_48%] bg-white/20 backdrop-blur-sm transition-transform duration-500',
            assistant.live ? 'animate-breathe' : 'group-hover:scale-105',
          )}
        >
          {assistant.live ? <Power className="size-6" /> : <Sparkles className="size-6" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-xl leading-tight sm:text-2xl">
            {assistant.live ? t('ai.finish') : t('ai.start')}
          </span>
          <span className="mt-1 flex items-center gap-2 text-[0.82rem] font-semibold tracking-wide text-white/85 uppercase">
            <span
              className={cn(
                'size-2 rounded-full',
                assistant.live ? 'animate-pulse bg-white' : 'bg-white/60',
              )}
            />
            {assistant.live ? t('ai.live') : t('ai.idle')}
          </span>
        </span>
      </button>

      {assistant.error && (
        <p className="mt-4 rounded-3xl bg-coral-100 p-4 text-[0.88rem] text-coral-600">{assistant.error}</p>
      )}

      {/* ------------------------------------------------------ transcript */}
      <AnimatePresence initial={false}>
        {assistant.live && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-5 overflow-hidden rounded-5xl border border-white/70 bg-white/90 shadow-soft"
          >
            <div className="flex items-center justify-between gap-3 border-b border-sky-900/8 px-5 py-3">
              <p className="text-[0.7rem] font-bold tracking-[0.18em] text-lagoon-700 uppercase">
                {t('ai.section_label')} · {getLanguageDisplayName(language)}
              </p>
              <button
                type="button"
                onClick={() => {
                  assistant.stopSpeaking()
                  assistant.setMuted(!assistant.muted)
                }}
                aria-label={assistant.muted ? t('ai.unmute') : t('ai.mute')}
                className="grid size-9 place-items-center rounded-full border border-sky-900/10 text-ocean-800/60 transition-colors hover:bg-sky-50 hover:text-ocean-950"
              >
                {assistant.muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>
            </div>

            <div className="max-h-[26rem] space-y-3 overflow-y-auto p-5">
              {assistant.messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] px-4 py-3 text-[0.92rem] leading-relaxed',
                      message.role === 'user'
                        ? 'rounded-[1.4rem_1.4rem_0.4rem_1.4rem] bg-gradient-to-br from-sky-700 to-lagoon-600 text-sand-50'
                        : 'rounded-[1.4rem_1.4rem_1.4rem_0.4rem] bg-sky-50 text-ocean-950 ring-1 ring-sky-200/70',
                    )}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}

              {busy && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-[1.4rem_1.4rem_1.4rem_0.4rem] bg-sky-50 px-4 py-3 text-[0.9rem] text-ocean-800/60 ring-1 ring-sky-200/70">
                    <Loader2 className="size-4 animate-spin" />
                    {assistant.transcribing
                      ? t('ai.transcribing')
                      : assistant.applying
                        ? t('ai.translating')
                        : t('ai.thinking')}
                  </div>
                </div>
              )}

              {/* --------------------------------------- confirm a change */}
              {assistant.pending && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-4xl border border-sun-400/60 bg-sun-100 p-4"
                >
                  <p className="text-[0.7rem] font-bold tracking-[0.18em] text-sun-700 uppercase">
                    {t('ai.review')}
                  </p>
                  <pre className="mt-2 text-[0.82rem] leading-relaxed whitespace-pre-wrap text-ocean-900">
                    {describe(assistant.pending)}
                  </pre>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={assistant.applying}
                      onClick={() => assistant.pending && void assistant.apply(assistant.pending)}
                      className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-palm-600 to-lagoon-600 px-5 text-[0.85rem] font-bold text-white disabled:opacity-60"
                    >
                      {assistant.applying ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                      {t('ai.confirm')}
                    </button>
                    <button
                      type="button"
                      onClick={assistant.reject}
                      className="inline-flex h-10 items-center gap-2 rounded-full border border-ocean-900/15 px-5 text-[0.85rem] font-semibold text-ocean-800/70 hover:text-ocean-950"
                    >
                      <X className="size-4" />
                      {t('ai.reject')}
                    </button>
                  </div>
                </motion.div>
              )}

              <div ref={endRef} />
            </div>

            {/* ------------------------------------------------- mic + input */}
            <div className="border-t border-sky-900/8 bg-sky-50/60 p-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => void assistant.startListening()}
                  aria-label={assistant.listening ? t('ai.mic_on') : t('ai.mic_off')}
                  aria-pressed={assistant.listening}
                  className={cn(
                    'relative grid size-13 shrink-0 place-items-center rounded-full shadow-soft transition-all duration-300',
                    assistant.listening
                      ? 'scale-105 bg-gradient-to-br from-flamingo-600 to-coral-500 text-white'
                      : 'bg-gradient-to-br from-sky-700 to-lagoon-600 text-white hover:scale-105',
                  )}
                >
                  {assistant.listening && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-flamingo-500 opacity-40" />
                  )}
                  <Mic className="relative size-5" />
                </button>

                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault()
                      submit()
                    }
                  }}
                  placeholder={t('ai.input_placeholder')}
                  className="h-12 min-w-0 flex-1 rounded-full border border-sky-900/12 bg-white px-5 text-[0.92rem] text-ocean-950 placeholder:text-ocean-800/40 focus:border-lagoon-400 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={submit}
                  disabled={!draft.trim() || busy}
                  aria-label={t('ai.send')}
                  className="grid size-12 shrink-0 place-items-center rounded-full bg-ocean-950 text-sand-50 transition-colors hover:bg-ocean-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="size-4.5" />
                </button>
              </div>

              <p className="mt-2.5 text-center text-[0.74rem] font-semibold tracking-wide text-ocean-800/50 uppercase">
                {assistant.listening ? t('ai.listening') : t('ai.tap_mic')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------- what was changed */}
      {assistant.changes.length > 0 && (
        <div className="mt-6 rounded-5xl border border-white/70 bg-white/90 p-6 shadow-soft">
          <h2 className="font-display text-xl text-ocean-950">{t('ai.changes_title')}</h2>
          <ul className="mt-4 space-y-2 text-[0.9rem]">
            {assistant.changes.map((change) => (
              <li key={change.id} className="flex items-start gap-2.5 text-ocean-800/80">
                <Check className="mt-0.5 size-4 shrink-0 text-palm-600" />
                <span>
                  {change.summary}
                  {change.translated && (
                    <span className="ml-2 rounded-full bg-palm-100 px-2 py-0.5 text-[0.7rem] font-semibold text-palm-700">
                      {getLanguageDisplayName(assistant.alternate)}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* --------------------------------- the hands-on list, at the end */}
      {(assistant.finished || !assistant.live) && (
        <div className="mt-6 rounded-5xl border border-sun-400/50 bg-gradient-to-br from-sun-100 to-flamingo-100 p-6 shadow-soft">
          <h2 className="flex items-center gap-2 font-display text-xl text-ocean-950">
            <ImagePlus className="size-5 text-sun-700" />
            {t('ai.manual_title')}
          </h2>
          {assistant.finished && (
            <p className="mt-2 text-[0.9rem] leading-relaxed text-ocean-800/75">{t('ai.closing')}</p>
          )}

          {assistant.manualSteps.length === 0 ? (
            <p className="mt-4 text-[0.9rem] text-ocean-800/70">{t('ai.manual_none')}</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {assistant.manualSteps.slice(0, 12).map((step) => (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => step.section && onJump(step.section)}
                    className="w-full rounded-2xl bg-white/70 px-4 py-2.5 text-left text-[0.9rem] text-ocean-800/85 transition-colors hover:bg-white"
                  >
                    → {t('ai.manual_photo', { name: step.label, section: step.section ?? '' })}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
