import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { parseBlocks } from '@shared/markdown'

export { readingMinutes, stripMarkdown } from '@shared/markdown'

/**
 * The blog's Markdown, and nothing more.
 *
 * Post bodies are written by the owner or by the AI writer, so the renderer
 * builds React nodes directly and never touches `innerHTML` — whatever the
 * model writes, it cannot inject a script. The dialect is the handful of
 * things a guest-facing article actually uses:
 *
 *   ## heading   ### subheading   - list item   1. list item   > quote
 *   **bold**     *italic*         [text](https://…)
 *
 * Paragraphs are separated by a blank line.
 */

/** Inline marks: **bold**, *italic*, [link](url). Unknown syntax stays as text. */
export function renderInline(text: string, keyPrefix = 'i'): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\))/g
  let last = 0
  let match: RegExpExecArray | null
  let n = 0

  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index))
    const key = `${keyPrefix}-${n++}`
    // Emphasis can wrap a link — "**[Couples Massage](/treatments)**" — so
    // its content is rendered again rather than printed as raw text.
    if (match[2]) nodes.push(<strong key={key}>{renderInline(match[2], key)}</strong>)
    else if (match[3]) nodes.push(<em key={key}>{renderInline(match[3], key)}</em>)
    else if (match[4]) {
      const href = match[5]
      // Only real links: no javascript:, no data:.
      const safe = /^(https?:\/\/|\/|mailto:|tel:|#)/i.test(href)
      // Links into the site stay in the app; they are also the internal
      // links search engines follow from one article to the booking pages.
      nodes.push(
        !safe ? (
          match[4]
        ) : href.startsWith('/') ? (
          <Link key={key} to={href}>
            {match[4]}
          </Link>
        ) : (
          <a key={key} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer noopener">
            {match[4]}
          </a>
        ),
      )
    }
    last = match.index + match[0].length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

export function Markdown({ source, className }: { source: string; className?: string }) {
  const blocks = parseBlocks(source)
  return (
    <div className={className}>
      {blocks.map((block, index) => {
        const key = `b-${index}`
        switch (block.kind) {
          case 'h2':
            return <h2 key={key}>{renderInline(block.text, key)}</h2>
          case 'h3':
            return <h3 key={key}>{renderInline(block.text, key)}</h3>
          case 'quote':
            return <blockquote key={key}>{renderInline(block.text, key)}</blockquote>
          case 'ul':
            return (
              <ul key={key}>
                {block.items.map((item, i) => (
                  <li key={i}>{renderInline(item, `${key}-${i}`)}</li>
                ))}
              </ul>
            )
          case 'ol':
            return (
              <ol key={key}>
                {block.items.map((item, i) => (
                  <li key={i}>{renderInline(item, `${key}-${i}`)}</li>
                ))}
              </ol>
            )
          default:
            return <p key={key}>{renderInline(block.text, key)}</p>
        }
      })}
    </div>
  )
}
