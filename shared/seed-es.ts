/**
 * Spanish translation of the seed content.
 *
 * Structure mirrors `seedContent` from ./seed.ts exactly (same ids/order).
 * Anything left untranslated intentionally (WhatsApp number, prices, URLs)
 * is imported straight from the English seed.
 */

import { seedContent as en } from './seed'
import type { SiteContent } from './types'

export const seedContentEs: SiteContent = {
  site: {
    ...en.site,
    tagline: 'Masaje en la playa, en tu hotel y en nuestro estudio de Bávaro',
    heroKicker: 'Bienvenida al paraíso',
    heroTitle: 'Descansa. Respira.',
    heroHighlight: 'Deja que el Caribe te cuide.',
    heroSubtitle:
      'Un pequeño estudio dirigido por mujeres en Los Corales / El Cortecito. Masaje profesional en la playa, en tu habitación de hotel o aquí con nosotras — con aceites naturales y manos que conocen la isla.',
    heroCtaPrimary: 'Reserva tu sesión',
    heroCtaSecondary: 'Ver tratamientos',

    ownerRole: 'Fundadora & Terapeuta principal',
    ownerQuote:
      'Cuidamos a mujeres, hombres y parejas por igual — con calma, sin prisas y respetando siempre tu espacio.',
    ownerStory:
      'Después de diez años trabajando en spas de resorts, abrí Ola Serena para ofrecer a los visitantes un masaje real, honesto y cercano — sin las prisas de un hotel grande. Todo nuestro equipo son mujeres locales, formadas en técnica sueca, tejido profundo y terapias caribeñas tradicionales.',

    whatsappGreeting:
      'Hola Ola Serena, me gustaría reservar un masaje en Bávaro. ¿Podríais confirmarme disponibilidad?',
    phoneDisplay: '+1 (809) 555-1234',

    addressLine: 'Calle Los Corales, Local 4',
    neighborhood: 'El Cortecito',
    city: 'Bávaro · Punta Cana',

    hours: [
      { label: 'Lunes a sábado', value: '09:00 – 21:00 (última reserva 19:30)' },
      { label: 'Domingo',        value: '10:00 – 18:00' },
      { label: 'Festivos',       value: 'Bajo cita previa por WhatsApp' },
    ],
    languages: ['Español', 'English', 'Deutsch', 'Français'],

    announcementText:
      'Nuevo: masaje en pareja al atardecer en la playa — reserva 24h antes.',

    hotelSurcharge:
      'Servicio en hotel: recargo de US$15 por terapeuta (cubre desplazamiento y camilla).',
    beachNote:
      'Masaje en la playa: llevamos toldo, camilla, música suave y toallas limpias.',
    cancellationPolicy:
      'Cancelación gratuita hasta 4 horas antes. Después, se cobra el 50% de la sesión reservada.',
  },

  services: en.services.map((s) => {
    const map: Record<string, Partial<typeof s>> = {
      'signature-relax': {
        name: 'Relax de la firma',
        tagline: 'Nuestro masaje más pedido',
        description:
          'Un masaje sueco lento con aceite tibio de coco. Presión media, respiración profunda, hombros y espalda como foco principal.',
        benefits: ['Libera la tensión del vuelo', 'Reduce el estrés', 'Mejora el sueño', 'Aroma tropical natural'],
      },
      'deep-tissue': {
        name: 'Tejido profundo',
        tagline: 'Para nudos persistentes y tensión de oficina',
        description:
          'Presión firme y trabajo focalizado en trapecio, lumbar y piernas. Ideal si pasas mucho tiempo sentada o entrenas fuerte.',
        benefits: ['Deshace nudos crónicos', 'Alivia la ciática', 'Mejora la postura', 'Recupera piernas cansadas'],
      },
      'lomi-lomi': {
        name: 'Lomi Lomi caribeño',
        tagline: 'Movimiento fluido, como olas',
        description:
          'Técnica hawaiana adaptada al Caribe: antebrazos largos, ritmo constante, aceite de coco y monoi. Muy relajante.',
        benefits: ['Sensación de ligereza', 'Circulación', 'Piel nutrida', 'Estado meditativo'],
      },
      'coconut-hot-stone': {
        name: 'Piedras calientes con coco',
        tagline: 'Calor volcánico que derrite la tensión',
        description:
          'Piedras de basalto pulido a 55°C combinadas con aceite de coco. El calor abre los músculos antes del trabajo manual.',
        benefits: ['Alivia rigidez profunda', 'Calor terapéutico', 'Muy indicado tras el aire acondicionado', 'Relajación total'],
      },
      'four-hands': {
        name: 'Cuatro manos',
        tagline: 'Dos terapeutas, una sola experiencia',
        description:
          'Dos de nuestras terapeutas trabajan sincronizadas — imposible de reproducir en casa. La forma más rápida de soltar todo.',
        benefits: ['Doble efecto relajante', 'Experiencia de lujo', 'Ideal cumpleaños o aniversarios'],
      },
      'prenatal': {
        name: 'Prenatal',
        tagline: 'Cuidado especializado para futuras mamás',
        description:
          'A partir del segundo trimestre. Camilla con hueco abdominal o postura lateral con cojines. Aceites 100% seguros.',
        benefits: ['Alivia lumbares', 'Reduce hinchazón de piernas', 'Sueño más profundo', 'Momento de calma'],
      },
      'reflexology': {
        name: 'Reflexología de pies',
        tagline: 'Alivio rápido para pies cansados de caminar',
        description:
          'Trabajo focalizado en puntos reflejos del pie. Perfecto después de un día largo de excursión o playa.',
        benefits: ['Descansa los pies', 'Estimula la circulación', 'Sensación general de bienestar'],
      },
      'couples-sunset': {
        name: 'Pareja al atardecer',
        tagline: 'Dos camillas en la arena, luz dorada',
        description:
          'Masaje simultáneo para dos personas en la playa mientras se pone el sol. Copa de bienvenida y aromaterapia incluida.',
        benefits: ['Momento romántico', 'Perfecto para lunas de miel', 'Fotos preciosas', 'Experiencia inolvidable'],
      },
    }
    const patch = map[s.slug]
    return { ...s, ...(patch ?? {}) }
  }),

  venues: en.venues.map((v) => {
    const map: Record<string, Partial<typeof v>> = {
      'studio':      { name: 'En nuestro estudio', subtitle: 'El Cortecito, Los Corales', description: 'Sala privada con aire acondicionado, música suave y ducha después de tu sesión.', note: 'A 3 minutos caminando de la playa.' },
      'hotel':       { name: 'En tu hotel',        subtitle: 'Todos los resorts de Bávaro',  description: 'Vamos a tu habitación con camilla profesional, sábanas limpias y música. Solo necesitas espacio.', note: 'Recargo US$15 por terapeuta.' },
      'beach':       { name: 'En la playa',        subtitle: 'Playa Los Corales / El Cortecito', description: 'Bajo toldo con vista al mar. Escucharás las olas de fondo. Sábanas limpias en cada sesión.', note: 'Solo con reserva anticipada.' },
      'villa':       { name: 'En tu villa',        subtitle: 'Cap Cana · Cocotal · alrededores', description: 'Viajamos hasta tu villa con todo el material necesario. Ideal para grupos.', note: 'Consultar recargo según distancia.' },
    }
    const patch = map[v.id]
    return { ...v, ...(patch ?? {}) }
  }),

  team: en.team.map((t) => {
    const map: Record<string, Partial<typeof t>> = {
      'sofia':   { role: 'Fundadora & Terapeuta principal', bio: 'Diez años de experiencia entre spas de resort y estudios independientes. Especialista en tejido profundo y descarga postural.', specialties: ['Tejido profundo', 'Prenatal', 'Descarga cervical'], languages: ['Español', 'English'], years: '10 años' },
      'lucia':  { role: 'Terapeuta senior',                  bio: 'Formada en Santo Domingo y certificada en Lomi Lomi. Sus manos tienen fama en todo El Cortecito.', specialties: ['Lomi Lomi', 'Relax profundo', 'Aromaterapia'], languages: ['Español', 'English'], years: '7 años' },
      'valentina':{ role: 'Terapeuta',                      bio: 'Reflexóloga formada en la escuela de medicina china de Punta Cana. Adora los pies cansados de excursión.', specialties: ['Reflexología', 'Piedras calientes'], languages: ['Español'], years: '4 años' },
      'ana':    { role: 'Terapeuta',                         bio: 'Especialista en masaje deportivo. Antes trabajaba con jugadores de golf del Cap Cana.', specialties: ['Deportivo', 'Tejido profundo'], languages: ['Español', 'English'], years: '5 años' },
    }
    const patch = map[t.id]
    return { ...t, ...(patch ?? {}) }
  }),

  benefits: en.benefits.map((b) => {
    const map: Record<string, Partial<typeof b>> = {
      'relax':   { title: 'Suelta el estrés del viaje', description: 'Los vuelos largos y las excursiones cansan. Media hora aquí lo cambia todo.' },
      'sleep':   { title: 'Duerme mejor esta noche',    description: 'Un masaje al atardecer prepara tu cuerpo para el descanso profundo.' },
      'pain':    { title: 'Alivia dolores concretos',    description: 'Trabajamos zonas específicas: cuello, lumbares, piernas, pies.' },
      'skin':    { title: 'Piel nutrida por el trópico', description: 'Aceites naturales de coco y monoi hidratan tu piel castigada por el sol.' },
      'romance': { title: 'Un plan romántico distinto',  description: 'Reserva la sesión de pareja en la playa al atardecer. Un recuerdo para siempre.' },
      'local':   { title: 'Manos locales, no cadenas',   description: 'Todo nuestro equipo es dominicano y vive en Bávaro. Tu dinero se queda en la comunidad.' },
    }
    const patch = map[b.id]
    return { ...b, ...(patch ?? {}) }
  }),

  discover: en.discover.map((d) => ({
    ...d,
    // Category translation applied at UI layer; we still translate blurb & tip.
    blurb: es_translate_blurb(d.id, d.blurb),
    tip:   es_translate_tip(d.id, d.tip),
  })),

  testimonials: en.testimonials.map((t) => ({
    ...t,
    quote: es_translate_quote(t.id, t.quote),
  })),

  faqs: en.faqs.map((f) => {
    const map: Record<string, Partial<typeof f>> = {
      'q-price': { question: '¿Cuánto cuesta un masaje?', answer: 'Los precios empiezan en US$45 por 30 minutos y US$70 por una hora. Cada tratamiento tiene sus propias duraciones y tarifas en la página de Tratamientos.' },
      'q-hotel': { question: '¿Vienen a mi hotel?',       answer: 'Sí. Vamos a cualquier resort de Bávaro y Punta Cana. Hay un pequeño recargo de US$15 por terapeuta que cubre el desplazamiento y el material.' },
      'q-couple':{ question: '¿Se puede reservar en pareja?', answer: 'Por supuesto. Podemos hacerlo en tu habitación, en la villa o en la playa al atardecer con dos camillas simultáneas.' },
      'q-pay':   { question: '¿Cómo se paga?',            answer: 'Aceptamos efectivo (US$ o RD$), tarjeta a través de Stripe, transferencias Banco Popular / Banco Azul y PayPal.' },
      'q-tip':   { question: '¿Se acostumbra dejar propina?', answer: 'No es obligatoria pero se agradece — habitualmente entre un 10% y un 20% según lo que hayas disfrutado la sesión.' },
      'q-cancel':{ question: '¿Cuál es la política de cancelación?', answer: 'Puedes cancelar sin coste hasta 4 horas antes. Después se cobra el 50% de la sesión reservada.' },
    }
    const patch = map[f.id]
    return { ...f, ...(patch ?? {}) }
  }),

  packages: en.packages.map((p) => {
    const map: Record<string, Partial<typeof p>> = {
      'honeymoon': { name: 'Escapada de luna de miel', description: 'Dos sesiones de 60 minutos + cena romántica en la playa al atardecer.', badge: 'Más pedido', duration: 'Tarde completa' },
      'jetlag':    { name: 'Anti jet-lag',              description: 'Sesión de 90 minutos el día de tu llegada — dormirás como un bebé.',       badge: 'Recién llegados', duration: '90 minutos' },
      'week':      { name: 'Semana de bienestar',       description: 'Tres sesiones distribuidas a lo largo de tu estancia. Precio total con descuento.', badge: 'Ahorra 15%', duration: 'Tres visitas' },
    }
    const patch = map[p.id]
    return { ...p, ...(patch ?? {}) }
  }),

  payments: en.payments.map((p) => {
    const map: Record<string, Partial<typeof p>> = {
      'cash':          { name: 'Efectivo',              description: 'US$ o pesos dominicanos. Ideal para masajes en la playa.' },
      'stripe':        { name: 'Tarjeta (Stripe)',      description: 'Visa, Mastercard y AMEX. Enlace seguro enviado por WhatsApp.' },
      'banco-popular': { name: 'Banco Popular / Azul',  description: 'Transferencia local en pesos dominicanos.' },
      'paypal':        { name: 'PayPal',                description: 'Envía a nuestro correo — confirmación inmediata.' },
    }
    const patch = map[p.id]
    return { ...p, ...(patch ?? {}) }
  }),

  gallery: en.gallery.map((g) => ({ ...g, caption: es_translate_caption(g.id, g.caption) })),
}

// ---------- small helpers (fallback pass-through if id not found) ----------
function es_translate_blurb(id: string, en: string): string {
  const map: Record<string, string> = {
    'sunset-playa-corales':  'Uno de los mejores atardeceres accesibles caminando desde El Cortecito. Bares sencillos con música suave.',
    'jellyfish-lounge':      'Bar sobre la arena con hamacas y cocteles frescos. Perfecto después del masaje.',
    'huracan-bavaro':        'Cocina caribeña honesta con vista al mar. Reserva por WhatsApp los fines de semana.',
    'coco-loco':             'Puestos de fruta fresca, agua de coco y pescado a la parrilla justo detrás de la playa.',
    'chapel-boda':           'Capilla blanca junto al mar, muy fotografiada. Se puede visitar cuando no hay boda en curso.',
    'palma-real':            'Centro comercial cercano — supermercado, farmacia y ATM en el mismo edificio.',
    'macao-beach':           'Playa salvaje a 15 min en coche. Menos gente, mejor arena. Llévate agua y sombrero.',
    'hoyo-azul':             'Cenote turquesa dentro del parque ecológico Scape Park. Excursión de medio día.',
  }
  return map[id] ?? en
}

function es_translate_tip(id: string, en: string): string {
  const map: Record<string, string> = {
    'sunset-playa-corales': 'Llega a las 17:45 para asegurarte una hamaca junto al mar.',
    'jellyfish-lounge':     'Piscolabis 2×1 de 16h a 18h.',
    'huracan-bavaro':       'El pescado del día en salsa de coco es imprescindible.',
    'coco-loco':            'Regatea con simpatía — los precios de turista bajan un 30%.',
    'chapel-boda':          'Los domingos por la mañana suele estar vacía y las fotos son mejores.',
    'palma-real':           'Cambia dólares dentro del banco, no en la calle.',
    'macao-beach':          'Contrata solo el taxi de ida y vuelve caminando por Uvero Alto.',
    'hoyo-azul':            'Reserva la primera entrada del día — el agua está más clara.',
  }
  return map[id] ?? en
}

function es_translate_quote(id: string, en: string): string {
  const map: Record<string, string> = {
    't-anna':    'La mejor experiencia de nuestro viaje. Sofía tiene unas manos mágicas.',
    't-marcus':  'Sesión en la playa al atardecer inolvidable. Repetiremos el año que viene sin duda.',
    't-elena':   'Hicieron un masaje prenatal con muchísimo cuidado. Salí flotando.',
    't-david':   'Después de tres días de golf, mis piernas volvieron a la vida.',
    't-family':  'Reservamos tres sesiones para toda la familia. Precio justo y equipo súper amable.',
  }
  return map[id] ?? en
}

function es_translate_caption(id: string, en: string): string {
  const map: Record<string, string> = {
    'g-1': 'Sala del estudio con luz natural',
    'g-2': 'Camilla en la playa al atardecer',
    'g-3': 'Aceites naturales y aromaterapia',
    'g-4': 'Ambiente relajado, música suave',
  }
  return map[id] ?? en
}
