/**
 * Categories are owner-editable free text, and each language has its own KV
 * document — so the same shelf is "Beach" in English and "Playa" in Spanish.
 *
 * Anything that has to *recognise* a category (the colour of a card badge, the
 * order the filter chips appear in) normalises the label to a canonical key
 * first. Unknown labels — the ones an owner types themselves — fall through
 * gracefully: they still show, they just sort last and get the neutral tone.
 */

export type SpotCategoryKey =
  | 'beach'
  | 'eat'
  | 'excursion'
  | 'nightlife'
  | 'shopping'
  | 'essentials'
  | 'transport'

/** Canonical order the Discover filter chips appear in. */
export const SPOT_CATEGORY_ORDER: SpotCategoryKey[] = [
  'beach',
  'eat',
  'excursion',
  'nightlife',
  'shopping',
  'essentials',
  'transport',
]

/** Every spelling we ship, in both languages, mapped to its canonical key. */
const SPOT_ALIASES: Record<string, SpotCategoryKey> = {
  // English (shared/seed.ts)
  beach: 'beach',
  'eat & drink': 'eat',
  'eat and drink': 'eat',
  excursion: 'excursion',
  nightlife: 'nightlife',
  shopping: 'shopping',
  essentials: 'essentials',
  'getting around': 'transport',
  // Spanish (shared/seed-es.ts)
  playa: 'beach',
  'comida y bebida': 'eat',
  'excursión': 'excursion',
  excursion_es: 'excursion',
  'vida nocturna': 'nightlife',
  compras: 'shopping',
  esenciales: 'essentials',
  transporte: 'transport',
  'cómo moverse': 'transport',
}

export type ServiceCategoryKey = 'signature' | 'therapeutic' | 'together' | 'skin'

const SERVICE_ALIASES: Record<string, ServiceCategoryKey> = {
  signature: 'signature',
  therapeutic: 'therapeutic',
  'terapéutico': 'therapeutic',
  terapeutico: 'therapeutic',
  together: 'together',
  'en pareja': 'together',
  skin: 'skin',
  piel: 'skin',
}

function normalise(value: string): string {
  return value.trim().toLowerCase()
}

export function spotCategoryKey(label: string): SpotCategoryKey | null {
  return SPOT_ALIASES[normalise(label)] ?? null
}

export function serviceCategoryKey(label: string): ServiceCategoryKey | null {
  return SERVICE_ALIASES[normalise(label)] ?? null
}

/**
 * Sorts the category labels found in the content into our canonical order,
 * keeping any label we do not recognise at the end in the order it appeared.
 */
export function orderSpotCategories(labels: string[]): string[] {
  const seen = new Map<string, string>()
  for (const label of labels) if (!seen.has(normalise(label))) seen.set(normalise(label), label)

  const known: string[] = []
  const unknown: string[] = []

  for (const label of seen.values()) {
    if (spotCategoryKey(label)) known.push(label)
    else unknown.push(label)
  }

  known.sort((a, b) => {
    const ai = SPOT_CATEGORY_ORDER.indexOf(spotCategoryKey(a) as SpotCategoryKey)
    const bi = SPOT_CATEGORY_ORDER.indexOf(spotCategoryKey(b) as SpotCategoryKey)
    return ai - bi
  })

  return [...known, ...unknown]
}

/** Card badge tones, keyed on the canonical category rather than the label. */
export const spotCategoryTone: Record<SpotCategoryKey, 'sky' | 'lagoon' | 'flamingo' | 'sun' | 'palm' | 'sand'> = {
  beach: 'lagoon',
  eat: 'flamingo',
  excursion: 'sun',
  nightlife: 'sky',
  shopping: 'palm',
  essentials: 'sky',
  transport: 'sand',
}
