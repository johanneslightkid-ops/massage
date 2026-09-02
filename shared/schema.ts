import {
  FOCUS_TAGS,
  INTENSITY_TAGS,
  MOMENT_TAGS,
  OCCASION_TAGS,
  TIMING_TAGS,
  VENUE_TAGS,
  CONCERN_TAGS,
  PRENATAL_SAFE,
} from './journey-tags.ts'
import type { CollectionKey } from './types'

/**
 * Field descriptors. The admin renders every form from these, so adding a
 * property to the content model only means adding a line here.
 */
export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'money'
  | 'boolean'
  | 'list'
  | 'image'
  | 'select'
  | 'durations'
  | 'pairs'
  | 'url'
  | 'color'
  | 'tags'
  | 'refs'

export interface Field {
  key: string
  label: string
  type: FieldType
  help?: string
  /**
   * For `select`, the human-readable choices — the chosen one is what gets
   * stored, so these are translated by `schema-i18n.ts`.
   *
   * For `tags` and `refs` these are *canonical keys* and must never be
   * translated: the matcher reads them identically in both languages. Their
   * display text comes from `optionLabels` instead.
   */
  options?: string[]
  /**
   * Labels shown for `options`, positionally. Only `tags` uses this, and it is
   * the half `schema-i18n.ts` translates — so the owner reads "Recién
   * llegada" while the stored value stays `just-arrived`.
   */
  optionLabels?: string[]
  /** For `refs`: which collection the ids point at. */
  refCollection?: CollectionKey
  placeholder?: string
  rows?: number
  full?: boolean
}

export interface CollectionSchema {
  key: CollectionKey
  label: string
  singular: string
  icon: string
  titleField: string
  subtitleField: string
  description: string
  fields: Field[]
}

export interface SettingsGroup {
  key: string
  label: string
  icon: string
  description: string
  fields: Field[]
}

const orderField: Field = {
  key: 'order',
  label: 'Order',
  type: 'number',
  help: 'Lower numbers appear first.',
}

const imageField: Field = {
  key: 'image',
  label: 'Photo',
  type: 'image',
  help: 'Upload a photo or paste a link. Leave it empty and we draw the tropical artwork instead.',
  full: true,
}

export const settingsGroups: SettingsGroup[] = [
  {
    key: 'brand',
    label: 'Brand & hero',
    icon: 'sparkles',
    description: 'The first screen every guest sees.',
    fields: [
      { key: 'brandName', label: 'Business name', type: 'text' },
      { key: 'brandMark', label: 'Sub-line under the name', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'textarea', rows: 2, full: true },
      { key: 'heroKicker', label: 'Hero kicker (small line above title)', type: 'text', full: true },
      { key: 'heroTitle', label: 'Hero title', type: 'text' },
      { key: 'heroHighlight', label: 'Hero title — highlighted words', type: 'text', help: 'Rendered in the script accent typeface.' },
      { key: 'heroSubtitle', label: 'Hero paragraph', type: 'textarea', rows: 3, full: true },
      { key: 'heroImage', label: 'Hero photo', type: 'image', full: true },
      { key: 'heroCtaPrimary', label: 'Primary button label', type: 'text' },
      { key: 'heroCtaSecondary', label: 'Secondary button label', type: 'text' },
      { key: 'announcementEnabled', label: 'Show announcement bar', type: 'boolean' },
      { key: 'announcementText', label: 'Announcement text', type: 'textarea', rows: 2, full: true },
    ],
  },
  {
    key: 'contact',
    label: 'Contact & WhatsApp',
    icon: 'message',
    description: 'How guests reach you. The WhatsApp number powers every button on the site.',
    fields: [
      {
        key: 'whatsapp',
        label: 'WhatsApp number',
        type: 'text',
        placeholder: '18095550123',
        help: 'Digits only, with country code and no + or spaces. Example: 18095550123',
      },
      { key: 'whatsappGreeting', label: 'Pre-filled WhatsApp message', type: 'textarea', rows: 2, full: true },
      { key: 'phoneDisplay', label: 'Phone number as displayed', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'instagram', label: 'Instagram URL', type: 'url' },
      { key: 'facebook', label: 'Facebook URL', type: 'url' },
      { key: 'tiktok', label: 'TikTok URL', type: 'url' },
    ],
  },
  {
    key: 'location',
    label: 'Location & hours',
    icon: 'pin',
    description: 'Where you are and when you work.',
    fields: [
      { key: 'addressLine', label: 'Street / address line', type: 'text', full: true },
      { key: 'neighborhood', label: 'Neighbourhood', type: 'text' },
      { key: 'city', label: 'City / area', type: 'text' },
      { key: 'mapUrl', label: 'Google Maps link', type: 'url', full: true },
      { key: 'mapEmbedUrl', label: 'Google Maps embed URL', type: 'url', full: true, help: 'Optional. From Google Maps → Share → Embed a map → copy the src URL.' },
      { key: 'hours', label: 'Opening hours', type: 'pairs', full: true, help: 'Left column is the label, right column the times.' },
      { key: 'languages', label: 'Languages spoken', type: 'list', full: true },
    ],
  },
  {
    key: 'owner',
    label: 'Owner story',
    icon: 'heart',
    description: 'The personal section — this is what makes a small business feel like one.',
    fields: [
      { key: 'ownerName', label: 'Owner name', type: 'text' },
      { key: 'ownerRole', label: 'Owner role', type: 'text' },
      { key: 'ownerQuote', label: 'Pull quote', type: 'textarea', rows: 2, full: true },
      { key: 'ownerStory', label: 'Story', type: 'textarea', rows: 6, full: true },
      { key: 'ownerPhoto', label: 'Owner photo', type: 'image', full: true },
    ],
  },
  {
    key: 'policy',
    label: 'Booking policy',
    icon: 'info',
    description: 'The small print that saves you WhatsApp messages.',
    fields: [
      { key: 'currency', label: 'Currency code', type: 'text', help: 'Used for price display, e.g. USD.' },
      { key: 'hotelSurcharge', label: 'Travel / hotel surcharge note', type: 'textarea', rows: 2, full: true },
      { key: 'beachNote', label: 'Beach session note', type: 'textarea', rows: 2, full: true },
      { key: 'cancellationPolicy', label: 'Cancellation policy', type: 'textarea', rows: 2, full: true },
    ],
  },
]

export const collectionSchemas: CollectionSchema[] = [
  {
    key: 'services',
    label: 'Treatments',
    singular: 'Treatment',
    icon: 'sparkles',
    titleField: 'name',
    subtitleField: 'tagline',
    description: 'Every massage you offer, with durations and prices.',
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'slug', label: 'Slug', type: 'text', help: 'Used in the URL. Lowercase, dashes instead of spaces.' },
      { key: 'tagline', label: 'One-line tagline', type: 'text', full: true },
      { key: 'description', label: 'Description', type: 'textarea', rows: 4, full: true },
      { key: 'benefits', label: 'Benefits', type: 'list', full: true, help: 'Shown as ticks on the treatment card.' },
      { key: 'durations', label: 'Durations & prices', type: 'durations', full: true },
      { key: 'category', label: 'Category', type: 'select', options: ['Signature', 'Therapeutic', 'Together', 'Skin'] },
      {
        key: 'icon',
        label: 'Icon',
        type: 'select',
        options: ['wave', 'leaf', 'sun', 'spark', 'heart', 'palm', 'moon', 'shell'],
      },
      imageField,
      { key: 'featured', label: 'Show on the home page', type: 'boolean' },
      { key: 'popular', label: 'Mark as popular', type: 'boolean' },
      orderField,
    ],
  },
  {
    key: 'journeys',
    label: 'Journeys',
    singular: 'Journey',
    icon: 'compass',
    titleField: 'name',
    subtitleField: 'tagline',
    description:
      'The concierge layer. A guest tells us what kind of day they are having; we suggest one of these. Each journey points at the real treatments that deliver it.',
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'slug', label: 'Slug', type: 'text', help: 'Used in the URL. Lowercase, dashes instead of spaces.' },
      { key: 'tagline', label: 'One-line tagline', type: 'text', full: true },
      { key: 'description', label: 'Description', type: 'textarea', rows: 3, full: true },
      {
        key: 'recommendedServiceIds',
        label: 'Treatments this journey is',
        type: 'refs',
        refCollection: 'services',
        full: true,
        help: 'The first one leads. Pick the treatments a therapist would actually give.',
      },
      {
        key: 'alternativeServiceIds',
        label: 'Equally good alternatives',
        type: 'refs',
        refCollection: 'services',
        full: true,
        help: 'Offered when the guest asks to see another option.',
      },
      {
        key: 'guestTags',
        label: 'What kind of day it suits',
        type: 'tags',
        options: [...MOMENT_TAGS],
        optionLabels: [
          'Just arrived',
          'Had an adventure',
          'Wants to switch off',
          'Knows where it hurts',
          'Celebrating',
          'With someone',
          'Wants it gentle',
          'Expecting',
          'Not sure',
        ],
        full: true,
        help: 'The answers to the first question that should surface this journey.',
      },
      {
        key: 'occasionTags',
        label: 'Occasions',
        type: 'tags',
        options: [...OCCASION_TAGS],
        optionLabels: [
          'Honeymoon',
          'Anniversary',
          'Birthday',
          'Date night',
          'Celebration',
          'Couple',
          'Friends',
          'Family',
          'Travelling alone',
          'First massage',
        ],
        full: true,
      },
      {
        key: 'timingTags',
        label: 'Timing',
        type: 'tags',
        options: [...TIMING_TAGS],
        optionLabels: [
          'Arrival day',
          'Morning',
          'Afternoon',
          'Golden hour',
          'Evening',
          'Before sleep',
          'After an excursion',
          'Across several days',
        ],
        full: true,
      },
      {
        key: 'venueTags',
        label: 'Where it works',
        type: 'tags',
        options: [...VENUE_TAGS],
        optionLabels: ['Our studio', 'On the beach', 'Hotel or villa'],
        full: true,
        help: 'Leave every box empty if it works anywhere.',
      },
      {
        key: 'focusTags',
        label: 'Body focus',
        type: 'tags',
        options: [...FOCUS_TAGS],
        optionLabels: ['Full body', 'Back, neck & shoulders', 'Legs & feet', 'Head & scalp', 'Skin'],
        full: true,
      },
      { key: 'intensity', label: 'How it feels', type: 'select', options: [...INTENSITY_TAGS] },
      {
        key: 'durationMinutes',
        label: 'Lengths offered (minutes)',
        type: 'list',
        full: true,
        help: 'Numbers only, e.g. 60 and 90. These must exist on the treatment above.',
      },
      {
        key: 'whyItFits',
        label: 'Why it fits',
        type: 'list',
        full: true,
        help: 'Two to four short reasons, written the way you would say them out loud.',
      },
      {
        key: 'whatToExpect',
        label: 'What we will do',
        type: 'list',
        full: true,
        help: 'Plain language. This is where the professional technique gets named.',
      },
      {
        key: 'safetyFlags',
        label: 'Cleared for',
        type: 'tags',
        options: [PRENATAL_SAFE],
        optionLabels: ['Pregnancy (trained therapist)'],
        full: true,
        help: 'Only tick prenatal if an appropriately trained therapist gives this journey. Without it, it is never suggested to a guest who is expecting.',
      },
      {
        key: 'avoidTags',
        label: 'Never suggest when the guest has said',
        type: 'tags',
        options: [...CONCERN_TAGS],
        optionLabels: [
          'They are pregnant',
          'Recent surgery',
          'A fresh injury',
          'Blood thinners',
          'Fever or feeling ill',
          'Unexplained swelling',
          'Sunburn',
          'They have been drinking',
        ],
        full: true,
      },
      { key: 'badge', label: 'Badge', type: 'text', help: 'Small label on the card, e.g. "Most booked".' },
      imageField,
      { key: 'featured', label: 'Show as a quick path on the home page', type: 'boolean' },
      orderField,
    ],
  },
  {
    key: 'packages',
    label: 'Packages',
    singular: 'Package',
    icon: 'gift',
    titleField: 'name',
    subtitleField: 'duration',
    description: 'Bundles and occasions — honeymoons, groups, multi-day.',
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'badge', label: 'Badge', type: 'text', help: 'Small label on the card, e.g. "Best value".' },
      { key: 'description', label: 'Description', type: 'textarea', rows: 3, full: true },
      { key: 'includes', label: 'What is included', type: 'list', full: true },
      { key: 'price', label: 'Price', type: 'money' },
      { key: 'duration', label: 'Duration line', type: 'text' },
      orderField,
    ],
  },
  {
    key: 'venues',
    label: 'Where we work',
    singular: 'Location type',
    icon: 'pin',
    titleField: 'name',
    subtitleField: 'subtitle',
    description: 'Studio, beach and hotel visits.',
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea', rows: 3, full: true },
      { key: 'note', label: 'Small print note', type: 'textarea', rows: 2, full: true },
      { key: 'icon', label: 'Icon', type: 'select', options: ['home', 'palm', 'bed', 'wave', 'sun'] },
      orderField,
    ],
  },
  {
    key: 'team',
    label: 'Team',
    singular: 'Therapist',
    icon: 'users',
    titleField: 'name',
    subtitleField: 'role',
    description: 'You and your therapists.',
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'role', label: 'Role / speciality line', type: 'text' },
      { key: 'bio', label: 'Short bio', type: 'textarea', rows: 3, full: true },
      { key: 'specialties', label: 'Specialities', type: 'list', full: true },
      { key: 'languages', label: 'Languages', type: 'list', full: true },
      { key: 'years', label: 'Experience', type: 'text', placeholder: '7 years' },
      { key: 'photo', label: 'Photo', type: 'image', full: true },
      { key: 'accent', label: 'Card accent', type: 'select', options: ['ocean', 'coral', 'palm', 'sun', 'seafoam'] },
      orderField,
    ],
  },
  {
    key: 'benefits',
    label: 'Why massage here',
    singular: 'Benefit',
    icon: 'star',
    titleField: 'title',
    subtitleField: 'description',
    description: 'The reasons a holiday guest should book at all.',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea', rows: 3, full: true },
      {
        key: 'icon',
        label: 'Icon',
        type: 'select',
        options: ['plane', 'moon', 'sun', 'compass', 'heart', 'palm', 'wave', 'spark'],
      },
      orderField,
    ],
  },
  {
    key: 'discover',
    label: 'Discover Bávaro',
    singular: 'Place or tip',
    icon: 'compass',
    titleField: 'name',
    subtitleField: 'category',
    description: 'Your local guide — beaches, food, excursions and practical advice.',
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        options: ['Beach', 'Eat & Drink', 'Nightlife', 'Excursion', 'Shopping', 'Essentials', 'Getting around'],
      },
      { key: 'blurb', label: 'Description', type: 'textarea', rows: 3, full: true },
      { key: 'tip', label: 'Insider tip', type: 'textarea', rows: 2, full: true },
      { key: 'walkMinutes', label: 'Minutes on foot from the studio', type: 'number', help: '0 hides the walking time (use for excursions).' },
      { key: 'priceLevel', label: 'Price level', type: 'select', options: ['Free', '$', '$$', '$$$', '—'] },
      { key: 'mapUrl', label: 'Google Maps link', type: 'url', full: true },
      { key: 'tags', label: 'Tags', type: 'list', full: true },
      imageField,
      orderField,
    ],
  },
  {
    key: 'testimonials',
    label: 'Guest reviews',
    singular: 'Review',
    icon: 'quote',
    titleField: 'name',
    subtitleField: 'country',
    description: 'What guests said afterwards.',
    fields: [
      { key: 'name', label: 'Guest name', type: 'text' },
      { key: 'country', label: 'Country', type: 'text' },
      { key: 'quote', label: 'Review', type: 'textarea', rows: 4, full: true },
      { key: 'rating', label: 'Stars', type: 'number', help: '1 to 5.' },
      { key: 'service', label: 'Treatment booked', type: 'text' },
      { key: 'stayedAt', label: 'Where they stayed', type: 'text' },
      orderField,
    ],
  },
  {
    key: 'faqs',
    label: 'FAQ',
    singular: 'Question',
    icon: 'help',
    titleField: 'question',
    subtitleField: 'answer',
    description: 'Answer it here once instead of forty times on WhatsApp.',
    fields: [
      { key: 'question', label: 'Question', type: 'text', full: true },
      { key: 'answer', label: 'Answer', type: 'textarea', rows: 5, full: true },
      orderField,
    ],
  },
  {
    key: 'payments',
    label: 'Payment methods',
    singular: 'Payment method',
    icon: 'card',
    titleField: 'name',
    subtitleField: 'description',
    description: 'Stripe, Banco Popular Azul, PayPal and cash.',
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea', rows: 3, full: true },
      { key: 'icon', label: 'Icon', type: 'select', options: ['cash', 'stripe', 'bank', 'paypal', 'card'] },
      { key: 'url', label: 'Payment link', type: 'url', full: true, help: 'Optional. A Stripe payment link, PayPal.me link or Azul checkout URL.' },
      { key: 'enabled', label: 'Show on the site', type: 'boolean' },
      orderField,
    ],
  },
  {
    key: 'gallery',
    label: 'Gallery',
    singular: 'Photo',
    icon: 'image',
    titleField: 'caption',
    subtitleField: 'image',
    description: 'Photos of the studio, the beach setup and the team.',
    fields: [
      { key: 'caption', label: 'Caption', type: 'text', full: true },
      imageField,
      orderField,
    ],
  },
]

export const collectionByKey = Object.fromEntries(
  collectionSchemas.map((c) => [c.key, c]),
) as Record<CollectionKey, CollectionSchema>

/** Build an empty record for a collection, so "Add new" starts from a valid shape. */
export function blankRecord(schema: CollectionSchema, nextOrder: number): Record<string, unknown> {
  const record: Record<string, unknown> = {
    id: `${schema.key}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
  }
  for (const field of schema.fields) {
    switch (field.type) {
      case 'number':
      case 'money':
        record[field.key] = field.key === 'order' ? nextOrder : 0
        break
      case 'boolean':
        record[field.key] = false
        break
      case 'list':
      case 'tags':
      case 'refs':
        record[field.key] = []
        break
      case 'durations':
        record[field.key] = [{ minutes: 60, price: 50 }]
        break
      case 'pairs':
        record[field.key] = []
        break
      case 'select':
        record[field.key] = field.options?.[0] ?? ''
        break
      default:
        record[field.key] = ''
    }
  }
  return record
}
