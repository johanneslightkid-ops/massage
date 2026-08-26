import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MessageCircle } from 'lucide-react'
import { useContent } from '@/lib/content-store'
import { useMobileNav } from './mobile-nav'
import { whatsappLink } from '@/lib/utils'

/** Always-available WhatsApp button. Hidden inside the admin, where it is noise. */
export function WhatsAppFab() {
  const { content } = useContent()
  const { override } = useMobileNav()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (override) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={whatsappLink(content.site)}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Chat with us on WhatsApp"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: 'spring', stiffness: 340, damping: 24 }}
          className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom,0px)+5.6rem)] z-50 grid size-14 place-items-center rounded-full bg-[#25D366] text-[#062e17] shadow-lift lg:right-8 lg:bottom-8 lg:size-16"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-25" />
          <MessageCircle className="relative size-6 lg:size-7" strokeWidth={2.3} />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
