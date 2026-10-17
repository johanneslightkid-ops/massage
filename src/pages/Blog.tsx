import { useMemo, useState } from 'react'
import { useContent } from '@/lib/content-store'
import { useT } from '@/lib/translations/LanguageProvider'
import { useSeo } from '@/lib/seo'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/sections/PageHeader'
import { CtaBand } from '@/components/sections/blocks'
import { PostCard, publishedPosts } from '@/components/blog/BlogCards'
import { Container, Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'

export function Blog() {
  const { content } = useContent()
  const t = useT()
  const site = content.site
  const posts = useMemo(() => publishedPosts(content.posts), [content.posts])
  const categories = useMemo(() => [...new Set(posts.map((post) => post.category).filter(Boolean))], [posts])
  const [category, setCategory] = useState<string | null>(null)

  useSeo({
    path: '/blog',
    title: `${t('blog.page_title')} · ${site.brandName}`,
    description: t('blog.page_lead'),
  })

  const shown = category ? posts.filter((post) => post.category === category) : posts
  const featured = shown.find((post) => post.featured) ?? shown[0]
  const rest = shown.filter((post) => post !== featured)

  return (
    <>
      <PageHeader kicker={t('blog.eyebrow')} title={t('blog.page_title')} script={t('blog.page_script')} lead={t('blog.page_lead')}>
        {categories.length > 1 && (
          <div className="no-scrollbar -mx-5 mt-9 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
            {[null, ...categories].map((entry) => (
              <button
                key={entry ?? 'all'}
                type="button"
                onClick={() => setCategory(entry)}
                aria-pressed={category === entry}
                className={cn(
                  'shrink-0 rounded-full px-5 py-2.5 text-[0.85rem] font-semibold transition-all duration-300',
                  category === entry
                    ? 'bg-gradient-to-r from-flamingo-600 to-sun-500 text-pearl shadow-soft'
                    : 'border border-white/70 bg-white/70 text-ocean-900 backdrop-blur-sm hover:bg-white',
                )}
              >
                {entry ?? t('blog.all_topics')}
              </button>
            ))}
          </div>
        )}
      </PageHeader>

      <Section className="py-16 sm:py-24">
        <Container>
          {shown.length === 0 ? (
            <p className="rounded-4xl border border-dashed border-ocean-900/15 p-12 text-center text-ocean-800/80">
              {t('blog.empty')}
            </p>
          ) : (
            <>
              {featured && (
                <Reveal>
                  <PostCard post={featured} large />
                </Reveal>
              )}
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post, index) => (
                  <Reveal
                    key={post.id}
                    delay={Math.min(index * 0.06, 0.3)}
                    className={cn('h-full', index % 3 === 1 && 'lg:mt-12')}
                  >
                    <PostCard post={post} index={index + 1} />
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}
