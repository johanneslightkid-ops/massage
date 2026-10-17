import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react'
import type { BlogPost } from '@shared/types'
import { useContent } from '@/lib/content-store'
import { useLanguage } from '@/lib/translations/LanguageProvider'
import { cn } from '@/lib/utils'
import { SceneImage } from '@/components/art/Decor'
import { TainoSpiral } from '@/components/art/Taino'
import { Container, Section, SectionHead } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { Parallax } from '@/components/ui/Parallax'

/** Published posts, newest first. Drafts never leave the admin. */
export function publishedPosts(posts: BlogPost[] | undefined): BlogPost[] {
  return (posts ?? [])
    .filter((post) => post.published)
    .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || '') || a.order - b.order)
}

export function formatPostDate(iso: string, locale: string): string {
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
}

export function PostMeta({ post, className }: { post: BlogPost; className?: string }) {
  const { locale, t } = useLanguage()
  return (
    <p className={cn('flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.78rem] font-semibold', className)}>
      <span className="rounded-full bg-flamingo-100 px-2.5 py-1 text-[0.68rem] font-extrabold tracking-[0.14em] text-flamingo-800 uppercase">
        {post.category}
      </span>
      <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt, locale)}</time>
      <span className="inline-flex items-center gap-1">
        <Clock className="size-3.5" />
        {t('blog.read_minutes', { minutes: post.readMinutes || 3 })}
      </span>
    </p>
  )
}

export function PostCard({ post, large = false, index = 0 }: { post: BlogPost; large?: boolean; index?: number }) {
  const { t } = useLanguage()
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden border border-white/70 bg-white/80 shadow-soft ring-1 ring-sky-900/5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift',
        index % 2 ? 'rounded-[2.75rem_1.25rem_2.75rem_1.25rem]' : 'rounded-[1.25rem_2.75rem_1.25rem_2.75rem]',
        large && 'lg:flex-row',
      )}
    >
      <div className={cn('relative overflow-hidden', large ? 'aspect-16/10 lg:aspect-auto lg:w-[55%]' : 'aspect-16/10')}>
        <SceneImage
          src={post.coverImage}
          seed={post.id}
          alt={post.title}
          className="transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
        />
        <span className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-white/90 text-ocean-950 opacity-0 shadow-soft transition-all duration-500 group-hover:rotate-45 group-hover:opacity-100">
          <ArrowUpRight className="size-4.5" />
        </span>
      </div>
      <div className={cn('flex flex-1 flex-col p-6 sm:p-7', large && 'lg:justify-center lg:p-10')}>
        <PostMeta post={post} className="text-ocean-800/80" />
        <h3
          className={cn(
            'mt-4 font-display leading-[1.12] text-ocean-950 transition-colors group-hover:text-lagoon-800',
            large ? 'text-[1.7rem] sm:text-[2.2rem]' : 'text-[1.35rem]',
          )}
        >
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-ocean-800/85">{post.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[0.86rem] font-bold text-lagoon-800">
          {t('blog.read_more')}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

/** Chapter VI on the home page: the latest three posts. */
export function BlogTeaser() {
  const { content } = useContent()
  const { t } = useLanguage()
  const posts = publishedPosts(content.posts).slice(0, 3)
  if (posts.length === 0) return null
  const [lead, ...rest] = posts

  return (
    <Section className="overflow-hidden py-20 sm:py-28">
      <Parallax speed={-0.4} className="pointer-events-none absolute top-10 right-[8%] hidden lg:block">
        <TainoSpiral className="animate-spiral size-36 text-lagoon-500/25" strokeWidth={1.4} />
      </Parallax>
      <Container className="relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            chapter="VI"
            eyebrow={t('blog.eyebrow')}
            title={t('blog.title')}
            script={t('blog.script')}
            note={t('blog.note')}
          />
          <Reveal delay={0.15}>
            <Link
              to="/blog"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-ocean-900/15 bg-white/60 px-6 text-[0.9rem] font-semibold text-ocean-950 backdrop-blur-sm transition-colors hover:border-lagoon-400/60 hover:bg-white"
            >
              {t('blog.all')}
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.35fr_1fr] lg:gap-7">
          <Reveal from="right" className="h-full">
            <PostCard post={lead} index={0} />
          </Reveal>
          <div className="grid gap-5 lg:mt-16 lg:gap-7">
            {rest.map((post, index) => (
              <Reveal key={post.id} from="left" delay={0.08 * (index + 1)} className="h-full">
                <PostCard post={post} index={index + 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
