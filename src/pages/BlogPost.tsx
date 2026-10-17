import { useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'motion/react'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { useContent } from '@/lib/content-store'
import { useLanguage } from '@/lib/translations/LanguageProvider'
import { useJsonLd, useSeo } from '@/lib/seo'
import { Markdown } from '@/lib/markdown'
import { whatsappLink } from '@/lib/utils'
import { PostCard, PostMeta, publishedPosts } from '@/components/blog/BlogCards'
import { SceneImage } from '@/components/art/Decor'
import { TainoBand, TainoSpiral } from '@/components/art/Taino'
import { Container, Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { NotFound } from './NotFound'

export function BlogPost() {
  const { slug = '' } = useParams()
  const { content, loading } = useContent()
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const site = content.site

  const posts = publishedPosts(content.posts)
  const post = posts.find((entry) => entry.slug === slug)

  /*
   * Slugs are per-language. When the reader switches language on an article,
   * the same post (same id) has a different slug in the other document — so
   * follow it there instead of showing a 404.
   */
  const lastId = useRef<string | null>(null)
  useEffect(() => {
    if (post) {
      lastId.current = post.id
      return
    }
    const twin = lastId.current ? posts.find((entry) => entry.id === lastId.current) : undefined
    if (twin) navigate(`/blog/${twin.slug}`, { replace: true })
  }, [post, posts, navigate])

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })

  useSeo({
    path: `/blog/${slug}`,
    title: post ? `${post.title} · ${site.brandName}` : site.brandName,
    description: post?.excerpt ?? '',
    noindex: !post,
  })
  useJsonLd(
    post
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.publishedAt,
            dateModified: post.publishedAt,
            inLanguage: language === 'es' ? 'es-DO' : 'en-US',
            mainEntityOfPage: typeof window === 'undefined' ? undefined : window.location.href.split('?')[0],
            articleSection: post.category,
            wordCount: post.body.split(/\s+/).length,
            author: { '@type': 'Organization', name: post.author || site.brandName },
            publisher: { '@type': 'Organization', name: site.brandName },
            keywords: post.tags.join(', '),
            ...(post.coverImage ? { image: post.coverImage } : {}),
          },
        ]
      : [],
  )

  if (!post) return loading ? null : <NotFound />

  const related = posts.filter((entry) => entry.id !== post.id).slice(0, 2)

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-flamingo-500 via-sun-500 to-lagoon-500"
      />

      <article>
        <header className="relative overflow-hidden wash-sunrise pt-12 pb-10 sm:pt-20">
          <TainoSpiral className="animate-spiral pointer-events-none absolute -top-10 -right-10 size-56 text-flamingo-400/25" strokeWidth={1.2} />
          <Container className="relative max-w-3xl">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[0.85rem] font-semibold text-lagoon-800 hover:text-lagoon-600"
            >
              <ArrowLeft className="size-4" />
              {t('blog.back')}
            </Link>
            <PostMeta post={post} className="mt-6 text-ocean-800/80" />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="display-wonk mt-5 text-[2.5rem] text-ocean-950 sm:text-6xl"
            >
              {post.title}
            </motion.h1>
            <p className="mt-6 text-[1.1rem] leading-relaxed text-ocean-800/90 sm:text-xl">{post.excerpt}</p>
          </Container>
        </header>

        <Container className="max-w-4xl">
          <Reveal>
            <div className="relative -mt-2 aspect-16/8 overflow-hidden rounded-[2.75rem_1.25rem_2.75rem_1.25rem] shadow-lift">
              <SceneImage src={post.coverImage} seed={post.id} alt={post.title} />
            </div>
          </Reveal>
        </Container>

        <Section className="py-12 sm:py-16">
          <Container className="max-w-2xl">
            <Markdown source={post.body} className="prose-tropical" />

            {post.tags.length > 0 && (
              <ul className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag} className="rounded-full bg-sky-100 px-3 py-1.5 text-[0.78rem] font-semibold text-sky-900">
                    #{tag}
                  </li>
                ))}
              </ul>
            )}

            <TainoBand className="mt-12 text-flamingo-400/50" />

            <div className="mt-10 flex flex-col items-start gap-4 rounded-[2rem] bg-gradient-to-br from-seafoam-100 to-flamingo-100 p-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-display text-xl text-ocean-950">{t('blog.cta')}</p>
              <a
                href={whatsappLink(site, `${site.whatsappGreeting} — ${post.title}`)}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-[#25D366] px-6 font-bold text-[#062e17] shadow-soft"
              >
                <MessageCircle className="size-4.5" strokeWidth={2.4} />
                {t('action.whatsapp')}
              </a>
            </div>
          </Container>
        </Section>
      </article>

      {related.length > 0 && (
        <Section className="pb-20">
          <Container>
            <h2 className="display-wonk text-3xl text-ocean-950 sm:text-4xl">{t('blog.more')}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {related.map((entry, index) => (
                <Reveal key={entry.id} delay={index * 0.08} className="h-full">
                  <PostCard post={entry} index={index} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  )
}
