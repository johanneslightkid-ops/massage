/**
 * The blog's Markdown dialect, as plain data — no React — so the Worker can
 * use it too (it renders article text into the HTML for crawlers that do not
 * run JavaScript). The React renderer lives in `src/lib/markdown.tsx`.
 */

export type Block =
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

