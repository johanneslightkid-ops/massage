import { AnimatePresence, motion } from 'motion/react'
import { Check, Loader2 } from 'lucide-react'

export function SaveBar({
  dirty,
  saving,
  status,
  onSave,
  onDiscard,
}: {
  dirty: boolean
  saving: boolean
  status: string | null
  onSave: () => void
  onDiscard: () => void
}) {
  return (
    <AnimatePresence>
      {(dirty || status) && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+5.6rem)] z-40 px-4 lg:bottom-6 lg:left-72"
        >
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 rounded-full bg-ocean-950 py-2.5 pr-2.5 pl-6 shadow-lift">
            <p className="text-[0.88rem] font-medium text-sand-100">
              {status ? (
                <span className="flex items-center gap-2 text-seafoam-300">
                  <Check className="size-4" />
                  {status}
                </span>
              ) : (
                'Unsaved changes'
              )}
            </p>
            {dirty && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onDiscard}
                  className="h-10 rounded-full px-4 text-[0.85rem] font-semibold text-sand-200/70 hover:text-sand-50"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={onSave}
                  disabled={saving}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-seafoam-300 px-5 text-[0.85rem] font-bold text-ocean-950 disabled:opacity-60"
                >
                  {saving && <Loader2 className="size-4 animate-spin" />}
                  Save changes
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
