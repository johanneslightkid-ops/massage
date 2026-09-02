import type { CollectionSchema, Field, SettingsGroup } from './schema.ts'
import { collectionSchemas, settingsGroups } from './schema.ts'

/**
 * Spanish overlay for the admin forms.
 *
 * `shared/schema.ts` carries the English wording; this file mirrors it. Entries
 * are addressed by a stable id:
 *
 *   `services`               → the collection itself
 *   `services.name`          → one field inside it
 *   `settings.brand`         → a settings group
 *   `settings.brand.tagline` → one field inside that group
 *
 * `options` matters as much as `label`: a `select` stores its option string
 * straight into the content, and the Spanish KV document holds Spanish
 * categories. Translating the option list keeps the two in step — without it
 * the admin would show a Spanish treatment as "Signature" and quietly rewrite
 * its category on the next save.
 */
export interface SchemaTranslation {
  label?: string
  help?: string
  placeholder?: string
  description?: string
  singular?: string
  /** Only for `select`, whose chosen option is what gets stored. */
  options?: string[]
  /**
   * Only for `tags`. The stored values stay canonical in every language — the
   * matcher depends on that — so translation touches the labels alone.
   */
  optionLabels?: string[]
}

export const schemaEs: Record<string, SchemaTranslation> = {
  /* ------------------------------------------------------ settings groups */
  'settings.brand': {
    label: 'Marca y portada',
    description: 'La primera pantalla que ve cada visitante.',
  },
  'settings.brand.brandName': { label: 'Nombre del negocio' },
  'settings.brand.brandMark': { label: 'Línea bajo el nombre' },
  'settings.brand.tagline': { label: 'Lema' },
  'settings.brand.heroKicker': { label: 'Línea pequeña sobre el título' },
  'settings.brand.heroTitle': { label: 'Título de la portada' },
  'settings.brand.heroHighlight': {
    label: 'Título — palabras destacadas',
    help: 'Se muestran en la tipografía manuscrita de acento.',
  },
  'settings.brand.heroSubtitle': { label: 'Párrafo de la portada' },
  'settings.brand.heroImage': { label: 'Foto de portada' },
  'settings.brand.heroCtaPrimary': { label: 'Texto del botón principal' },
  'settings.brand.heroCtaSecondary': { label: 'Texto del botón secundario' },
  'settings.brand.announcementEnabled': { label: 'Mostrar la barra de aviso' },
  'settings.brand.announcementText': { label: 'Texto del aviso' },

  'settings.contact': {
    label: 'Contacto y WhatsApp',
    description: 'Cómo te encuentran. El número de WhatsApp activa todos los botones del sitio.',
  },
  'settings.contact.whatsapp': {
    label: 'Número de WhatsApp',
    help: 'Solo dígitos, con código de país y sin + ni espacios. Ejemplo: 18095550123',
  },
  'settings.contact.whatsappGreeting': { label: 'Mensaje de WhatsApp ya escrito' },
  'settings.contact.phoneDisplay': { label: 'Teléfono tal como se muestra' },
  'settings.contact.email': { label: 'Correo electrónico' },
  'settings.contact.instagram': { label: 'Enlace de Instagram' },
  'settings.contact.facebook': { label: 'Enlace de Facebook' },
  'settings.contact.tiktok': { label: 'Enlace de TikTok' },

  'settings.location': {
    label: 'Ubicación y horarios',
    description: 'Dónde estás y cuándo trabajas.',
  },
  'settings.location.addressLine': { label: 'Calle / dirección' },
  'settings.location.neighborhood': { label: 'Barrio' },
  'settings.location.city': { label: 'Ciudad / zona' },
  'settings.location.mapUrl': { label: 'Enlace de Google Maps' },
  'settings.location.mapEmbedUrl': {
    label: 'URL para incrustar Google Maps',
    help: 'Opcional. En Google Maps → Compartir → Insertar un mapa → copia la URL del src.',
  },
  'settings.location.hours': {
    label: 'Horario de apertura',
    help: 'La columna izquierda es la etiqueta; la derecha, las horas.',
  },
  'settings.location.languages': { label: 'Idiomas que hablan' },

  'settings.owner': {
    label: 'Historia de la propietaria',
    description: 'La parte personal — esto es lo que hace que un negocio pequeño lo parezca.',
  },
  'settings.owner.ownerName': { label: 'Nombre de la propietaria' },
  'settings.owner.ownerRole': { label: 'Cargo' },
  'settings.owner.ownerQuote': { label: 'Frase destacada' },
  'settings.owner.ownerStory': { label: 'Historia' },
  'settings.owner.ownerPhoto': { label: 'Foto de la propietaria' },

  'settings.policy': {
    label: 'Política de reservas',
    description: 'La letra pequeña que te ahorra mensajes de WhatsApp.',
  },
  'settings.policy.currency': {
    label: 'Código de moneda',
    help: 'Se usa para mostrar los precios, por ejemplo USD.',
  },
  'settings.policy.hotelSurcharge': { label: 'Nota sobre el recargo por desplazamiento' },
  'settings.policy.beachNote': { label: 'Nota sobre los masajes en la playa' },
  'settings.policy.cancellationPolicy': { label: 'Política de cancelación' },

  /* --------------------------------------------------------- collections */
  services: {
    label: 'Tratamientos',
    singular: 'tratamiento',
    description: 'Cada masaje que ofreces, con duraciones y precios.',
  },
  'services.name': { label: 'Nombre' },
  'services.slug': {
    label: 'Slug',
    help: 'Se usa en la URL. En minúsculas y con guiones en lugar de espacios.',
  },
  'services.tagline': { label: 'Frase de una línea' },
  'services.description': { label: 'Descripción' },
  'services.benefits': {
    label: 'Beneficios',
    help: 'Se muestran como marcas de verificación en la tarjeta.',
  },
  'services.durations': { label: 'Duraciones y precios' },
  'services.category': {
    label: 'Categoría',
    options: ['Signature', 'Terapéutico', 'En pareja', 'Piel'],
  },
  'services.icon': { label: 'Icono' },
  'services.image': {
    label: 'Foto',
    help: 'Sube una foto o pega un enlace. Si lo dejas vacío dibujamos la ilustración tropical.',
  },
  'services.featured': { label: 'Mostrar en la página de inicio' },
  'services.popular': { label: 'Marcar como popular' },
  'services.order': { label: 'Orden', help: 'Los números más bajos aparecen primero.' },

  packages: {
    label: 'Paquetes',
    singular: 'paquete',
    description: 'Paquetes y ocasiones — lunas de miel, grupos, varios días.',
  },
  'packages.name': { label: 'Nombre' },
  'packages.badge': {
    label: 'Etiqueta',
    help: 'Etiqueta pequeña en la tarjeta, por ejemplo «Mejor valor».',
  },
  'packages.description': { label: 'Descripción' },
  'packages.includes': { label: 'Qué incluye' },
  'packages.price': { label: 'Precio' },
  'packages.duration': { label: 'Línea de duración' },
  'packages.order': { label: 'Orden', help: 'Los números más bajos aparecen primero.' },

  venues: {
    label: 'Dónde trabajamos',
    singular: 'lugar',
    description: 'Estudio, playa y visitas a hoteles.',
  },
  'venues.name': { label: 'Nombre' },
  'venues.subtitle': { label: 'Subtítulo' },
  'venues.description': { label: 'Descripción' },
  'venues.note': { label: 'Nota en letra pequeña' },
  'venues.icon': { label: 'Icono' },
  'venues.order': { label: 'Orden', help: 'Los números más bajos aparecen primero.' },

  team: {
    label: 'Equipo',
    singular: 'terapeuta',
    description: 'Tú y tus terapeutas.',
  },
  'team.name': { label: 'Nombre' },
  'team.role': { label: 'Cargo / especialidad' },
  'team.bio': { label: 'Biografía breve' },
  'team.specialties': { label: 'Especialidades' },
  'team.languages': { label: 'Idiomas' },
  'team.years': { label: 'Experiencia', placeholder: '7 años' },
  'team.photo': { label: 'Foto' },
  'team.accent': { label: 'Color de la tarjeta' },
  'team.order': { label: 'Orden', help: 'Los números más bajos aparecen primero.' },

  benefits: {
    label: 'Por qué un masaje aquí',
    singular: 'beneficio',
    description: 'Las razones por las que alguien de vacaciones debería reservar.',
  },
  'benefits.title': { label: 'Título' },
  'benefits.description': { label: 'Descripción' },
  'benefits.icon': { label: 'Icono' },
  'benefits.order': { label: 'Orden', help: 'Los números más bajos aparecen primero.' },

  discover: {
    label: 'Descubre Bávaro',
    singular: 'lugar o consejo',
    description: 'Tu guía local — playas, comida, excursiones y consejos prácticos.',
  },
  'discover.name': { label: 'Nombre' },
  'discover.category': {
    label: 'Categoría',
    options: [
      'Playa',
      'Comida y bebida',
      'Vida nocturna',
      'Excursión',
      'Compras',
      'Esenciales',
      'Transporte',
    ],
  },
  'discover.blurb': { label: 'Descripción' },
  'discover.tip': { label: 'Consejo de local' },
  'discover.walkMinutes': {
    label: 'Minutos a pie desde el estudio',
    help: '0 oculta el tiempo a pie (útil para excursiones).',
  },
  'discover.priceLevel': { label: 'Nivel de precio', options: ['Gratis', '$', '$$', '$$$', '—'] },
  'discover.mapUrl': { label: 'Enlace de Google Maps' },
  'discover.tags': { label: 'Etiquetas' },
  'discover.image': {
    label: 'Foto',
    help: 'Sube una foto o pega un enlace. Si lo dejas vacío dibujamos la ilustración tropical.',
  },
  'discover.order': { label: 'Orden', help: 'Los números más bajos aparecen primero.' },

  testimonials: {
    label: 'Reseñas',
    singular: 'reseña',
    description: 'Lo que dijeron después.',
  },
  'testimonials.name': { label: 'Nombre' },
  'testimonials.country': { label: 'País' },
  'testimonials.quote': { label: 'Reseña' },
  'testimonials.rating': { label: 'Estrellas', help: 'Del 1 al 5.' },
  'testimonials.service': { label: 'Tratamiento reservado' },
  'testimonials.stayedAt': { label: 'Dónde se alojaron' },
  'testimonials.order': { label: 'Orden', help: 'Los números más bajos aparecen primero.' },

  faqs: {
    label: 'Preguntas frecuentes',
    singular: 'pregunta',
    description: 'Respóndela aquí una vez en lugar de cuarenta veces por WhatsApp.',
  },
  'faqs.question': { label: 'Pregunta' },
  'faqs.answer': { label: 'Respuesta' },
  'faqs.order': { label: 'Orden', help: 'Los números más bajos aparecen primero.' },

  payments: {
    label: 'Formas de pago',
    singular: 'forma de pago',
    description: 'Stripe, Azul del Banco Popular, PayPal y efectivo.',
  },
  'payments.name': { label: 'Nombre' },
  'payments.description': { label: 'Descripción' },
  'payments.icon': { label: 'Icono' },
  'payments.url': {
    label: 'Enlace de pago',
    help: 'Opcional. Un enlace de pago de Stripe, un PayPal.me o una URL de Azul.',
  },
  'payments.enabled': { label: 'Mostrar en el sitio' },
  'payments.order': { label: 'Orden', help: 'Los números más bajos aparecen primero.' },

  gallery: {
    label: 'Galería',
    singular: 'foto',
    description: 'Fotos del estudio, del montaje en la playa y del equipo.',
  },
  'gallery.caption': { label: 'Pie de foto' },
  'gallery.image': {
    label: 'Foto',
    help: 'Sube una foto o pega un enlace. Si lo dejas vacío dibujamos la ilustración tropical.',
  },
  'gallery.order': { label: 'Orden', help: 'Los números más bajos aparecen primero.' },

  /* --------------------------------------------------------- journeys */
  journeys: {
    label: 'Experiencias',
    singular: 'Experiencia',
    description:
      'La capa de conserjería. La huésped nos cuenta qué tipo de día está teniendo y le sugerimos una de estas. Cada experiencia apunta a los masajes reales que la hacen posible.',
  },
  'journeys.name': { label: 'Nombre' },
  'journeys.slug': { label: 'Slug', help: 'Se usa en la URL. Minúsculas y guiones en vez de espacios.' },
  'journeys.tagline': { label: 'Frase de una línea' },
  'journeys.description': { label: 'Descripción' },
  'journeys.recommendedServiceIds': {
    label: 'Masajes que la componen',
    help: 'El primero manda. Elige los masajes que una terapeuta daría de verdad.',
  },
  'journeys.alternativeServiceIds': {
    label: 'Alternativas igual de buenas',
    help: 'Se ofrecen cuando la huésped pide ver otra opción.',
  },
  'journeys.guestTags': {
    label: 'Para qué tipo de día sirve',
    help: 'Las respuestas a la primera pregunta que deberían mostrar esta experiencia.',
    optionLabels: [
      'Acaba de llegar',
      'Vino de una aventura',
      'Quiere desconectar',
      'Sabe dónde le duele',
      'Está celebrando',
      'Viene acompañada',
      'La quiere suave',
      'Está embarazada',
      'No sabe',
    ],
  },
  'journeys.occasionTags': {
    label: 'Ocasiones',
    optionLabels: [
      'Luna de miel',
      'Aniversario',
      'Cumpleaños',
      'Noche especial',
      'Celebración',
      'Pareja',
      'Amigas',
      'Familia',
      'Viaja sola',
      'Primer masaje',
    ],
  },
  'journeys.timingTags': {
    label: 'Momento',
    optionLabels: [
      'Día de llegada',
      'Mañana',
      'Tarde',
      'Hora dorada',
      'Noche',
      'Antes de dormir',
      'Después de una excursión',
      'A lo largo de varios días',
    ],
  },
  'journeys.venueTags': {
    label: 'Dónde funciona',
    help: 'Deja todas las casillas vacías si funciona en cualquier lado.',
    optionLabels: ['Nuestro estudio', 'En la playa', 'Hotel o villa'],
  },
  'journeys.focusTags': {
    label: 'Zona del cuerpo',
    optionLabels: ['Cuerpo completo', 'Espalda, cuello y hombros', 'Piernas y pies', 'Cabeza y cuero cabelludo', 'Piel'],
  },
  'journeys.intensity': {
    label: 'Cómo se siente',
    options: ['gentle', 'relaxing', 'balanced', 'firm'],
  },
  'journeys.durationMinutes': {
    label: 'Duraciones que ofrece (minutos)',
    help: 'Solo números, por ejemplo 60 y 90. Tienen que existir en el masaje de arriba.',
  },
  'journeys.whyItFits': {
    label: 'Por qué encaja',
    help: 'De dos a cuatro razones cortas, escritas como se las dirías en voz alta.',
  },
  'journeys.whatToExpect': {
    label: 'Qué vamos a hacer',
    help: 'En lenguaje sencillo. Aquí es donde se nombra la técnica profesional.',
  },
  'journeys.safetyFlags': {
    label: 'Autorizada para',
    help: 'Marca embarazo solo si una terapeuta con formación da esta experiencia. Sin esa marca nunca se le sugiere a una huésped embarazada.',
    optionLabels: ['Embarazo (terapeuta con formación)'],
  },
  'journeys.avoidTags': {
    label: 'Nunca sugerir si la huésped dijo',
    optionLabels: [
      'Que está embarazada',
      'Cirugía reciente',
      'Una lesión reciente',
      'Anticoagulantes',
      'Fiebre o se siente mal',
      'Hinchazón sin explicación',
      'Quemadura de sol',
      'Que ha estado bebiendo',
    ],
  },
  'journeys.badge': { label: 'Etiqueta', help: 'Texto pequeño en la tarjeta, por ejemplo "El más pedido".' },
  'journeys.image': { label: 'Foto' },
  'journeys.featured': { label: 'Mostrar como acceso rápido en la portada' },
  'journeys.order': { label: 'Orden' },

}

function overlay(lang: string, id: string): SchemaTranslation | undefined {
  return lang === 'es' ? schemaEs[id] : undefined
}

function localizeField(field: Field, lang: string, id: string): Field {
  const tr = overlay(lang, id)
  if (!tr) return field

  /*
   * `tags` and `refs` store canonical keys that both language documents share,
   * so their `options` are never translated — only the labels drawn over them.
   * Translating the values here would write Spanish tags into the Spanish
   * document and the matcher would stop recognising them.
   */
  const canonical = field.type === 'tags' || field.type === 'refs'

  return {
    ...field,
    label: tr.label ?? field.label,
    help: tr.help ?? field.help,
    placeholder: tr.placeholder ?? field.placeholder,
    options: canonical ? field.options : (tr.options ?? field.options),
    optionLabels: tr.optionLabels ?? field.optionLabels,
  }
}

/** The collection forms, with every label in the reader's language. */
export function localizedCollections(lang: string): CollectionSchema[] {
  if (lang !== 'es') return collectionSchemas
  return collectionSchemas.map((schema) => {
    const tr = overlay(lang, schema.key) ?? {}
    return {
      ...schema,
      label: tr.label ?? schema.label,
      singular: tr.singular ?? schema.singular,
      description: tr.description ?? schema.description,
      fields: schema.fields.map((field) => localizeField(field, lang, `${schema.key}.${field.key}`)),
    }
  })
}

/** The site-settings groups, with every label in the reader's language. */
export function localizedSettingsGroups(lang: string): SettingsGroup[] {
  if (lang !== 'es') return settingsGroups
  return settingsGroups.map((group) => {
    const tr = overlay(lang, `settings.${group.key}`) ?? {}
    return {
      ...group,
      label: tr.label ?? group.label,
      description: tr.description ?? group.description,
      fields: group.fields.map((field) =>
        localizeField(field, lang, `settings.${group.key}.${field.key}`),
      ),
    }
  })
}
