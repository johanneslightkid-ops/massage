import type { ReactNode } from 'react'

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

type Block =
  | { kind: 'h2' | 'h3' | 'p' | 'quote'; text: string }
  | { kind: 'ul' | 'ol'; items: string[] }

export function parseBlocks(source: string): Block[] {
  const blocks: Block[] = []
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  let paragraph: string[] = []
  let list: { kind: 'ul' | 'ol'; items: string[] } | null = null

  const flush = () => {
    if (paragraph.length) blocks.push({ kind: 'p', text: paragraph.join(' ') })
    paragraph = []
    if (list) blocks.push(list)
    list = null
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      flush()
      continue
    }
    const heading = line.match(/^(#{2,3})\s+(.*)$/)
    if (heading) {
      flush()
      blocks.push({ kind: heading[1].length === 2 ? 'h2' : 'h3', text: heading[2] })
      continue
    }
    // A single "#" heading is treated as h2: the page already has its h1.
    if (/^#\s+/.test(line)) {
      flush()
      blocks.push({ kind: 'h2', text: line.replace(/^#\s+/, '') })
      continue
    }
    if (line.startsWith('>')) {
      flush()
      blocks.push({ kind: 'quote', text: line.replace(/^>\s?/, '') })
      continue
    }
    const bullet = line.match(/^[-*•]\s+(.*)$/)
    const numbered = line.match(/^\d+[.)]\s+(.*)$/)
    if (bullet || numbered) {
      const kind = bullet ? 'ul' : 'ol'
      if (paragraph.length) {
        blocks.push({ kind: 'p', text: paragraph.join(' ') })
        paragraph = []
      }
      if (!list || list.kind !== kind) {
        if (list) blocks.push(list)
        list = { kind, items: [] }
      }
      list.items.push((bullet ?? numbered)![1])
      continue
    }
    if (list) {
      blocks.push(list)
      list = null
    }
    paragraph.push(line)
  }
  flush()
  return blocks
}

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
    if (match[2]) nodes.push(<strong key={key}>{match[2]}</strong>)
    else if (match[3]) nodes.push(<em key={key}>{match[3]}</em>)
    else if (match[4]) {
      const href = match[5]
      // Only real links: no javascript:, no data:.
      const safe = /^(https?:\/\/|\/|mailto:|tel:|#)/i.test(href)
      nodes.push(
        safe ? (
          <a key={key} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer noopener">
            {match[4]}
          </a>
        ) : (
          match[4]
        ),
      )
    }
    last = match.index + match[0].length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

/** Plain text, for excerpts, meta descriptions and reading-time counts. */
export function stripMarkdown(source: string): string {
  return source
    .replace(/^#{1,3}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*•]\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

export function readingMinutes(source: string): number {
  return Math.max(1, Math.round(stripMarkdown(source).split(' ').length / 200))
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
