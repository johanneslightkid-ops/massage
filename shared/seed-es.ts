import { journeysEs } from './journeys-es.ts'
import type { SiteContent } from './types'

/**
 * Spanish starting content for the Massage Playero site.
 * Kept structurally identical to seed.ts so both languages share the same
 * records, IDs, ordering, prices and editable content model.
 */
export const seedContentEs: SiteContent = {
  journeys: journeysEs,
  site: {
    brandName: 'Massage Playero',
    brandMark: 'Masajes & Spa de Playa · Bávaro',
    tagline:
      'Masajes sin prisas en Los Corales — en nuestro estudio, sobre la arena o en tu habitación.',

    heroKicker: 'Los Corales · El Cortecito · Playa de Bávaro',
    heroTitle: 'Baja el ritmo',
    heroHighlight: 'al tiempo caribeño',
    heroSubtitle:
      'Un pequeño estudio de masajes dirigido por mujeres, a dos minutos de la arena en Los Corales. También vamos a tu silla de playa o a tu habitación de hotel — con nuestra propia camilla, aceites y música.',
    heroImage: '',
    heroCtaPrimary: 'Reserva por WhatsApp',
    heroCtaSecondary: 'Ver tratamientos y precios',

    ownerName: 'Yaritza Mercedes',
    ownerRole: 'Propietaria y terapeuta principal',
    ownerQuote: 'Un buen masaje debería sentirse como si el mar se hubiera metido en tus hombros.',
    ownerStory:
      'Crecí en Higüey y llevo catorce años trabajando con mis manos — primero en los grandes spas de resorts de Bávaro y después por mi cuenta. En 2019 abrí este pequeño estudio detrás del camino de la playa de Los Corales para que los visitantes pudieran recibir un trabajo de calidad de resort sin precios de resort, y para que mi equipo pudiera cobrar justamente. Hoy somos cinco terapeutas. Todas somos dominicanas, todas estamos certificadas y todavía nos hace ilusión cuando alguien se queda dormido sobre la camilla.',
    ownerPhoto: '',

    whatsapp: '18095550123',
    whatsappGreeting:
      'Hola, encontré Massage Playero en internet y me gustaría reservar un masaje.',
    phoneDisplay: '+1 809 555 0123',
    email: 'hola@olaserena.do',

    addressLine: 'Calle Los Corales, detrás del camino de la playa',
    neighborhood: 'Los Corales / El Cortecito',
    city: 'Bávaro, Punta Cana',
    mapUrl: 'https://maps.google.com/?q=Los+Corales+Bavaro+Punta+Cana',
    mapEmbedUrl: '',

    hours: [
      { label: 'Lunes – sábado', value: '9:00 – 21:00' },
      { label: 'Domingo', value: '10:00 – 19:00' },
      { label: 'Visitas a hoteles y playa', value: 'Hasta las 22:00, última reserva 20:30' },
    ],
    languages: ['Español', 'English', 'Deutsch (básico)', 'Français (básico)', 'Русский (básico)'],

    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    tiktok: '',

    announcementEnabled: true,
    announcementText:
      'Normalmente podemos atender el mismo día — escríbenos por WhatsApp y respondemos en minutos.',

    currency: 'USD',
    hotelSurcharge:
      'Visitas a hoteles y villas: +$10 dentro de Bávaro / El Cortecito, +$20 para Cap Cana, Uvero Alto y Punta Cana Village.',
    beachNote:
      'Los masajes en la playa se realizan bajo nuestro toldo en Playa Los Corales — toallas, sábanas y música incluidas.',
    cancellationPolicy:
      'Los planes cambian durante las vacaciones. Cancela o cambia tu cita sin coste hasta 3 horas antes.',
  },

  venues: [
    {
      id: 'venue-studio',
      name: 'Nuestro estudio en Los Corales',
      subtitle: 'A dos minutos de la arena',
      description:
        'Una sala fresca y tranquila detrás del camino de la playa — aire acondicionado, ducha privada y té de hierbas después. La opción más cómoda si quieres un trabajo profundo o una sesión más larga.',
      icon: 'home',
      note: 'Agua filtrada y té gratis · zona privada para cambiarte · aceptamos tarjetas',
      order: 1,
    },
    {
      id: 'venue-beach',
      name: 'En la playa',
      subtitle: 'Los Corales y El Cortecito',
      description:
        'Montamos un toldo con una camilla profesional directamente sobre la arena, para que escuches el mar durante toda la sesión. Ideal por la mañana o durante la hora dorada antes del atardecer.',
      icon: 'palm',
      note: 'Los horarios de amanecer y atardecer se llenan primero — reserva con un día de antelación si puedes',
      order: 2,
    },
    {
      id: 'venue-hotel',
      name: 'Tu hotel o villa',
      subtitle: 'En habitación, en todo Bávaro y Punta Cana',
      description:
        'Llegamos con camilla plegable, sábanas limpias, aceites y un pequeño altavoz. Funciona en habitaciones de resort, Airbnbs y villas — las parejas pueden recibir el masaje lado a lado en la misma habitación.',
      icon: 'bed',
      note: 'Dinos el nombre del resort y el edificio al reservar para facilitar el acceso por recepción',
      order: 3,
    },
  ],

  services: [
    {
      id: 'svc-relax',
      name: 'Masaje Relajante de Cuerpo Completo',
      slug: 'full-body-relaxing',
      tagline: 'El clásico — de la cabeza a los pies, lento y cálido',
      description:
        'Largos movimientos suecos y fluidos por todo el cuerpo con aceite tibio de coco o almendra. La presión va de suave a media; el objetivo es apagar el sistema nervioso después de un día de viaje o de una semana larga.',
      benefits: [
        'Libera la tensión del viaje y del vuelo',
        'Ayuda a dormir toda la noche',
        'Calma la piel tirante y castigada por el sol',
      ],
      durations: [
        { minutes: 60, price: 50 },
        { minutes: 90, price: 70 },
      ],
      category: 'Signature',
      icon: 'wave',
      image: '',
      featured: true,
      popular: true,
      order: 1,
    },
    {
      id: 'svc-deep',
      name: 'Tejido Profundo y Deportivo',
      slug: 'deep-tissue',
      tagline: 'Para los nudos que trajiste de casa',
      description:
        'Trabajo firme y focalizado sobre las capas profundas del músculo — antebrazos, codos y presión lenta y sostenida justo donde señalas. Preguntamos constantemente por la presión; debe sentirse como alivio, nunca como una lucha.',
      benefits: [
        'Libera nudos de cuello, hombros y zona lumbar',
        'Ideal después de surf, pádel o gimnasio',
        'Recupera el rango de movimiento',
      ],
      durations: [
        { minutes: 60, price: 60 },
        { minutes: 90, price: 80 },
      ],
      category: 'Terapéutico',
      icon: 'spark',
      image: '',
      featured: true,
      popular: true,
      order: 2,
    },
    {
      id: 'svc-stone',
      name: 'Masaje con Piedras Calientes',
      slug: 'hot-stone',
      tagline: 'Basalto volcánico caliente a lo largo de la columna',
      description:
        'Piedras lisas y calientes colocadas en la espalda y utilizadas como extensión de nuestras manos. El calor abre el músculo antes de que presionemos, permitiendo que la tensión profunda se libere sin molestias.',
      benefits: [
        'Calor profundo sin necesidad de presión intensa',
        'Maravilloso después de viajar desde climas fríos',
        'Muy reconfortante antes de dormir',
      ],
      durations: [
        { minutes: 60, price: 65 },
        { minutes: 90, price: 85 },
      ],
      category: 'Signature',
      icon: 'sun',
      image: '',
      featured: true,
      popular: false,
      order: 3,
    },
    {
      id: 'svc-aroma',
      name: 'Ritual de Coco y Aromaterapia',
      slug: 'aromatherapy',
      tagline: 'Aceites de la isla, elegidos según cómo te sientas',
      description:
        'Eliges la mezcla cuando llegamos — mandarina y vetiver para relajarte, menta y eucalipto para despertarte o simplemente aceite de coco tibio prensado aquí en la isla. Trabajo corporal suave con tiempo extra para cuero cabelludo y pies.',
      benefits: [
        'Elige tu propio aroma',
        'Deja la piel suave después del sol y la sal',
        'Final largo para cuero cabelludo y pies',
      ],
      durations: [
        { minutes: 60, price: 55 },
        { minutes: 90, price: 75 },
      ],
      category: 'Signature',
      icon: 'leaf',
      image: '',
      featured: true,
      popular: false,
      order: 4,
    },
    {
      id: 'svc-couples',
      name: 'Masaje en Pareja',
      slug: 'couples',
      tagline: 'Dos terapeutas, dos camillas, lado a lado',
      description:
        'Dos de nosotras llegamos juntas y trabajamos al mismo tiempo, en la misma habitación o bajo el mismo toldo de playa. Es lo que más hacemos para lunas de miel y aniversarios — terminamos con agua con gas y un plato de fruta.',
      benefits: [
        'La misma habitación y la misma hora',
        'Perfecto para lunas de miel',
        'Cada persona elige su propia presión',
      ],
      durations: [
        { minutes: 60, price: 95 },
        { minutes: 90, price: 135 },
      ],
      category: 'En pareja',
      icon: 'heart',
      image: '',
      featured: true,
      popular: true,
      order: 5,
    },
    {
      id: 'svc-fourhands',
      name: 'Masaje a Cuatro Manos',
      slug: 'four-hands',
      tagline: 'Dos terapeutas, un cuerpo muy afortunado',
      description:
        'Dos terapeutas trabajan en ritmo sincronizado sobre una sola persona. El cerebro deja de intentar seguirlo después de unos noventa segundos — exactamente ese es el objetivo. Nuestra experiencia más indulgente.',
      benefits: [
        'El doble de trabajo en la misma hora',
        'Desconexión profundamente relajante',
        'Un tratamiento realmente especial',
      ],
      durations: [
        { minutes: 60, price: 95 },
        { minutes: 90, price: 130 },
      ],
      category: 'En pareja',
      icon: 'spark',
      image: '',
      featured: false,
      popular: false,
      order: 6,
    },
    {
      id: 'svc-back',
      name: 'Espalda, Cuello y Hombros',
      slug: 'back-neck-shoulders',
      tagline: 'Corto, directo y justo donde duele',
      description:
        'Todo el tiempo se dedica a donde realmente lo necesitas. Ideal entre excursiones, después de un vuelo largo o como reinicio rápido antes de cenar.',
      benefits: [
        'Cabe en cualquier tarde',
        'Enfocado en la tensión de oficina y viaje',
        'Sin aceite en el pelo si lo prefieres',
      ],
      durations: [
        { minutes: 30, price: 35 },
        { minutes: 45, price: 45 },
      ],
      category: 'Terapéutico',
      icon: 'spark',
      image: '',
      featured: false,
      popular: true,
      order: 7,
    },
    {
      id: 'svc-reflex',
      name: 'Reflexología de Pies',
      slug: 'reflexology',
      tagline: 'Para pies que caminaron todo Bávaro',
      description:
        'Trabajo de puntos de presión en plantas, arcos y pantorrillas, terminando con bálsamo refrescante de menta. La arena caliente, las chanclas y los días de excursión castigan los pies — esto los recupera.',
      benefits: [
        'Alivia pies hinchados y cansados',
        'Mejora la circulación después de vuelos',
        'Puede hacerse completamente vestido',
      ],
      durations: [
        { minutes: 30, price: 30 },
        { minutes: 45, price: 40 },
      ],
      category: 'Terapéutico',
      icon: 'leaf',
      image: '',
      featured: false,
      popular: false,
      order: 8,
    },
    {
      id: 'svc-lymph',
      name: 'Drenaje Linfático',
      slug: 'lymphatic-drainage',
      tagline: 'Ligero, rítmico y descongestionante',
      description:
        'Movimientos muy suaves y rítmicos que siguen las vías linfáticas para ayudar a movilizar el líquido retenido. Popular después de vuelos largos, durante el embarazo avanzado y como parte de una recuperación postoperatoria.',
      benefits: [
        'Reduce la hinchazón y la sensación de pesadez',
        'Lo suficientemente suave para el uso diario',
        'Ideal después de vuelos y en recuperación',
      ],
      durations: [
        { minutes: 60, price: 65 },
        { minutes: 90, price: 90 },
      ],
      category: 'Terapéutico',
      icon: 'wave',
      image: '',
      featured: false,
      popular: false,
      order: 9,
    },
    {
      id: 'svc-reductive',
      name: 'Masaje Reductivo y Anticelulítico',
      slug: 'reductive',
      tagline: 'El clásico dominicano — firme y enérgico',
      description:
        'Amasamientos fuertes, herramientas de madera y percusión rápida sobre caderas, piernas y abdomen, tal como se realiza en salones de todo el país. Es firme por diseño — dinos tu límite y nos quedaremos por debajo.',
      benefits: [
        'Estimula y da energía',
        'A menudo se reserva en cursos de 5 sesiones',
        'Combina muy bien con drenaje',
      ],
      durations: [
        { minutes: 45, price: 55 },
        { minutes: 60, price: 65 },
      ],
      category: 'Terapéutico',
      icon: 'spark',
      image: '',
      featured: false,
      popular: false,
      order: 10,
    },
    {
      id: 'svc-prenatal',
      name: 'Masaje Prenatal',
      slug: 'prenatal',
      tagline: 'De lado, con cojines y completamente seguro',
      description:
        'Trabajo durante el segundo y tercer trimestre realizado de lado con cojines corporales, enfocado en zona lumbar, caderas y tobillos hinchados. Dos de nuestras terapeutas cuentan con certificación prenatal específica.',
      benefits: [
        'Alivia la carga de lumbares y caderas',
        'Ayuda con pies y tobillos hinchados',
        'Terapeutas con certificación prenatal',
      ],
      durations: [{ minutes: 60, price: 60 }],
      category: 'Terapéutico',
      icon: 'heart',
      image: '',
      featured: false,
      popular: false,
      order: 11,
    },
    {
      id: 'svc-aftersun',
      name: 'Ritual de Aloe After-Sun',
      slug: 'after-sun',
      tagline: 'Para cuando el Caribe te recibió con demasiado sol',
      description:
        'Aloe fresco de producción local, pepino y toallas frías aplicados con movimientos ligerísimos — sin presión profunda. Llévatelo a tu habitación la noche en que te pasaste con el sol.',
      benefits: [
        'Enfría y calma la piel quemada',
        'Sin presión, extremadamente suave',
        'Rehidrata después del sol y la sal',
      ],
      durations: [{ minutes: 45, price: 50 }],
      category: 'Piel',
      icon: 'sun',
      image: '',
      featured: false,
      popular: false,
      order: 12,
    },
    {
      id: 'svc-scrub',
      name: 'Exfoliación Corporal de Coco y Café',
      slug: 'body-scrub',
      tagline: 'Exfoliación, ducha y después una hora completa de masaje',
      description:
        'Café dominicano molido, azúcar cruda y aceite de coco aplicados sobre todo el cuerpo, luego se enjuaga y terminamos con sesenta minutos de masaje relajante sobre una piel completamente renovada. Noventa minutos en total.',
      benefits: [
        'Piel como el primer día de vacaciones',
        'Exfoliación más una hora completa de masaje',
        'Elaborado con café y cacao locales',
      ],
      durations: [{ minutes: 90, price: 85 }],
      category: 'Piel',
      icon: 'leaf',
      image: '',
      featured: false,
      popular: false,
      order: 13,
    },
  ],

  packages: [
    {
      id: 'pkg-honeymoon',
      name: 'Atardecer de Luna de Miel',
      description:
        'Dos terapeutas, dos camillas bajo nuestro toldo en Playa Los Corales mientras la luz se vuelve dorada, seguido de agua con gas fría y fruta local.',
      includes: [
        '90 min de masaje en pareja en la playa',
        'Horario de atardecer reservado para ustedes',
        'Pétalos de flores y plato de fruta',
        'Foto del montaje si quieren',
      ],
      price: 160,
      duration: '90 min · para dos',
      badge: 'Más solicitado',
      order: 1,
    },
    {
      id: 'pkg-week',
      name: 'La Semana Completa',
      description:
        'Cuatro sesiones durante tu estancia, combinadas como quieras — tejido profundo después de la excursión, relajante antes del vuelo de regreso.',
      includes: [
        '4 × sesiones de 60 min',
        'Combina los tratamientos que quieras',
        'La misma terapeuta cada vez si lo prefieres',
        'Ahorra $40 frente a precios individuales',
      ],
      price: 170,
      duration: '4 × 60 min',
      badge: 'Mejor valor',
      order: 2,
    },
    {
      id: 'pkg-arrival',
      name: 'Reset de Llegada',
      description:
        'La opción para reservar la noche que aterrizas. Drenaje linfático para la hinchazón del vuelo y después reflexología para los pies, en tu habitación.',
      includes: [
        '60 min de drenaje linfático',
        '30 min de reflexología de pies',
        'En tu habitación de hotel',
        'Horarios tardíos hasta las 22:00',
      ],
      price: 85,
      duration: '90 min · en habitación',
      badge: 'Día uno',
      order: 3,
    },
    {
      id: 'pkg-bride',
      name: 'Grupo de Novias',
      description:
        'Hasta cinco personas reciben masaje durante la misma tarde en tu villa o suite del resort — llevamos suficientes terapeutas para que nadie espere demasiado.',
      includes: [
        'Hasta 5 personas',
        '60 min por persona',
        'Llevamos 2–3 terapeutas',
        'Villa, suite o playa',
      ],
      price: 240,
      duration: 'Medio día · grupos',
      badge: 'Grupos',
      order: 4,
    },
  ],

  team: [
    {
      id: 'team-yaritza',
      name: 'Yaritza',
      role: 'Propietaria · tejido profundo y piedras calientes',
      bio:
        'Catorce años trabajando con las manos, cinco de ellos en los mayores spas de resorts de esta costa. Lee una espalda en unos treinta segundos y es a quien debes pedir si realmente algo te duele.',
      specialties: ['Tejido profundo', 'Piedras calientes', 'Recuperación deportiva'],
      languages: ['Español', 'English'],
      years: '14 años',
      photo: '',
      accent: 'ocean',
      order: 1,
    },
    {
      id: 'team-massiel',
      name: 'Massiel',
      role: 'Relajación y aromaterapia',
      bio:
        'Las manos más lentas y suaves del equipo. Los clientes se quedan dormidos sobre su camilla constantemente, algo que ella considera el mayor cumplido posible.',
      specialties: ['Relajación', 'Aromaterapia', 'After-sun'],
      languages: ['Español', 'English'],
      years: '7 años',
      photo: '',
      accent: 'coral',
      order: 2,
    },
    {
      id: 'team-carolina',
      name: 'Carolina',
      role: 'Prenatal y drenaje linfático',
      bio:
        'Certificada en prenatal y drenaje postoperatorio. Infinitamente paciente y la persona que enviamos cuando alguien está nervioso ante la idea de que un desconocido lo toque.',
      specialties: ['Prenatal', 'Drenaje linfático', 'Reflexología'],
      languages: ['Español', 'English', 'Français'],
      years: '6 años',
      photo: '',
      accent: 'palm',
      order: 3,
    },
    {
      id: 'team-anyi',
      name: 'Anyi',
      role: 'Reductivo y anticelulítico',
      bio:
        'Fuerte. De verdad fuerte. Pídele el masaje reductivo dominicano y agárrate — los clientes habituales reservan cinco sesiones con ella de una vez.',
      specialties: ['Reductivo', 'Anticelulítico', 'Tejido profundo'],
      languages: ['Español', 'English (básico)'],
      years: '5 años',
      photo: '',
      accent: 'sun',
      order: 4,
    },
    {
      id: 'team-dahiana',
      name: 'Dahiana',
      role: 'Sesiones en playa y cuatro manos',
      bio:
        'La que lleva el toldo hasta la arena antes del amanecer. Le encanta trabajar en la playa, los grupos grandes y ser una de las dos manos de una sesión a cuatro manos.',
      specialties: ['Masaje en playa', 'Cuatro manos', 'Relajación'],
      languages: ['Español', 'English', 'Deutsch (básico)'],
      years: '4 años',
      photo: '',
      accent: 'seafoam',
      order: 5,
    },
  ],

  benefits: [
    {
      id: 'ben-flight',
      title: 'Deshazte del vuelo',
      description:
        'Ocho horas sentado dejan las caderas bloqueadas y los tobillos llenos de líquido. Una sesión la noche de llegada hace que el segundo día de vacaciones realmente empiece como el segundo día.',
      icon: 'plane',
      order: 1,
    },
    {
      id: 'ben-sleep',
      title: 'Duerme a pesar del calor',
      description:
        'Las primeras noches en el trópico pueden ser inquietas — nuevo horario, aire acondicionado, demasiado sol. Un masaje al atardecer lleva tu sistema nervioso al descanso y la noche se vuelve tranquila.',
      icon: 'moon',
      order: 2,
    },
    {
      id: 'ben-sun',
      title: 'Rescata la piel demasiado bronceada',
      description:
        'El sol del Caribe es más fuerte de lo que parece con la brisa del mar. Aloe fresco, pepino y un toque muy ligero calman el error de haberte pasado con el sol.',
      icon: 'sun',
      order: 3,
    },
    {
      id: 'ben-excursion',
      title: 'Recupérate entre excursiones',
      description:
        'Saona, buggies, catamaranes, Hoyo Azul — los días de aventura castigan hombros y pantorrillas. Reserva el masaje esa misma noche y mañana puedes volver a salir.',
      icon: 'compass',
      order: 4,
    },
    {
      id: 'ben-local',
      title: 'Dinero que se queda en la isla',
      description:
        'Recibes un trabajo de calidad de resort por aproximadamente la mitad del precio del spa de un resort, y cinco mujeres dominicanas cobran directamente por ello. Sin intermediarios, sin comisiones.',
      icon: 'heart',
      order: 5,
    },
    {
      id: 'ben-nomove',
      title: 'Tú no tienes que moverte',
      description:
        'Silla de playa, habitación de hotel o terraza de villa — nosotras llevamos la camilla, las sábanas, los aceites y la música. Tu único trabajo es estar tumbado.',
      icon: 'palm',
      order: 6,
    },
  ],

  discover: [
    {
      id: 'dsc-loscorales',
      name: 'Playa Los Corales',
      category: 'Playa',
      blurb:
        'La franja de arena justo delante de nuestra puerta. Menos gente que en las playas de los resorts, chiringuitos cada pocos cientos de metros y un arrecife poco profundo cerca de la orilla.',
      tip:
        'Camina hacia la izquierda en dirección a El Cortecito para encontrar la zona más animada; hacia la derecha está la parte tranquila donde las palmeras se inclinan sobre el agua.',
      walkMinutes: 2,
      priceLevel: 'Gratis',
      mapUrl: 'https://maps.google.com/?q=Playa+Los+Corales+Bavaro',
      image: '',
      tags: ['Nadar', 'Amanecer', 'Chiringuitos'],
      order: 1,
    },
    {
      id: 'dsc-cortecito',
      name: 'Pueblo de playa El Cortecito',
      category: 'Playa',
      blurb:
        'El antiguo rincón pesquero de Bávaro — barcas de madera en la arena, puestos de souvenirs y una de las zonas más auténticas de toda esta costa.',
      tip:
        'Los precios de los puestos son ofertas iniciales. Sonríe, ofrece aproximadamente la mitad y llega a un punto intermedio — es algo normal y amistoso.',
      walkMinutes: 8,
      priceLevel: 'Gratis',
      mapUrl: 'https://maps.google.com/?q=El+Cortecito+Bavaro',
      image: '',
      tags: ['Souvenirs', 'Barcos de pesca', 'Gente'],
      order: 2,
    },
    {
      id: 'dsc-capitancook',
      name: 'Capitán Cook',
      category: 'Comida y bebida',
      blurb:
        'Una institución de El Cortecito. Eliges tu pescado o langosta del hielo, lo asan sobre carbón y comes descalzo con la mesa directamente sobre la arena.',
      tip:
        'El marisco se cobra por peso — pide que pesen tu elección delante de ti para evitar sorpresas en la cuenta.',
      walkMinutes: 9,
      priceLevel: '$$$',
      mapUrl: 'https://maps.google.com/?q=Capitan+Cook+El+Cortecito',
      image: '',
      tags: ['Marisco', 'Sobre la arena', 'Atardecer'],
      order: 3,
    },
    {
      id: 'dsc-soles',
      name: 'Soles Chill Out Bar',
      category: 'Comida y bebida',
      blurb:
        'Pufs en la arena, buenos cócteles y un DJ que sabe leer el momento. Nuestro propio lugar después del trabajo cuando terminamos tarde.',
      tip: 'Ve al atardecer y quédate para la música en vivo que suele empezar alrededor de las nueve.',
      walkMinutes: 4,
      priceLevel: '$$',
      mapUrl: 'https://maps.google.com/?q=Soles+Chill+Out+Bar+Los+Corales',
      image: '',
      tags: ['Cócteles', 'Música en vivo', 'Atardecer'],
      order: 4,
    },
    {
      id: 'dsc-loscoralesstrip',
      name: 'La calle de restaurantes de Los Corales',
      category: 'Comida y bebida',
      blurb:
        'Una calle caminable llena de cocinas independientes — italiana, parrilla argentina, sushi, tacos y cocina dominicana. Donde todos cenan la noche que escapan del buffet.',
      tip:
        'Se llena después de las 19:00 en temporada alta. Baja a las 18:30, mira tres menús y después elige.',
      walkMinutes: 5,
      priceLevel: '$$',
      mapUrl: 'https://maps.google.com/?q=Los+Corales+restaurants+Bavaro',
      image: '',
      tags: ['Cena', 'Caminable', 'Variedad'],
      order: 5,
    },
    {
      id: 'dsc-comedor',
      name: 'Un comedor dominicano',
      category: 'Comida y bebida',
      blurb:
        'Los pequeños comedores locales que sirven la bandera — arroz, habichuelas, carne guisada, ensalada y plátano frito — por unos pocos cientos de pesos. Esto es lo que realmente se come en la isla al mediodía.',
      tip:
        'Ve antes de las 13:30, cuando todo está fresco. Pide "la bandera con pollo guisado" y no puedes equivocarte.',
      walkMinutes: 10,
      priceLevel: '$',
      mapUrl: 'https://maps.google.com/?q=comedor+Bavaro+Punta+Cana',
      image: '',
      tags: ['Comida local', 'Barato', 'Almuerzo'],
      order: 6,
    },
    {
      id: 'dsc-saona',
      name: 'Isla Saona',
      category: 'Excursión',
      blurb:
        'La isla de postal — catamarán de ida, lancha rápida de vuelta y una parada en la piscina natural donde las estrellas de mar quedan en agua hasta la cintura. La excursión que casi todo el mundo hace.',
      tip:
        'Es un día completo de unas 12 horas y el barco se pone ruidoso. Reserva el masaje para la noche después, no para la mañana anterior.',
      walkMinutes: 0,
      priceLevel: '$$$',
      mapUrl: 'https://maps.google.com/?q=Isla+Saona',
      image: '',
      tags: ['Día completo', 'Catamarán', 'Icónica'],
      order: 7,
    },
    {
      id: 'dsc-hoyoazul',
      name: 'Hoyo Azul & Scape Park',
      category: 'Excursión',
      blurb:
        'Un cenote de un turquesa increíble al pie de un acantilado en Cap Cana, al que se llega por un corto sendero selvático. Añade tirolinas y cuevas si quieres pasar allí todo el día.',
      tip:
        'La primera entrada de la mañana te permite encontrar el agua casi para ti solo y obtener fotografías mucho mejores.',
      walkMinutes: 0,
      priceLevel: '$$$',
      mapUrl: 'https://maps.google.com/?q=Hoyo+Azul+Scape+Park+Cap+Cana',
      image: '',
      tags: ['Cenote', 'Medio día', 'Nadar'],
      order: 8,
    },
    {
      id: 'dsc-macao',
      name: 'Playa Macao',
      category: 'Excursión',
      blurb:
        'Veinticinco minutos al norte, más salvaje y vacía, con verdaderas olas del Atlántico y la mejor escuela de surf para principiantes de esta costa. Puestos de pescado frito justo detrás de la arena.',
      tip:
        'La corriente aquí es realmente fuerte — nada donde esté la escuela de surf, no en los extremos vacíos.',
      walkMinutes: 0,
      priceLevel: '$$',
      mapUrl: 'https://maps.google.com/?q=Playa+Macao+Punta+Cana',
      image: '',
      tags: ['Surf', 'Playa salvaje', 'Medio día'],
      order: 9,
    },
    {
      id: 'dsc-snorkel',
      name: 'El arrecife frente a Los Corales',
      category: 'Excursión',
      blurb:
        'No necesitas una excursión en barco para hacer snorkel aquí. El arrecife está a poca distancia nadando desde la orilla frente a Los Corales, con peces loro, sargentos mayores y alguna raya de vez en cuando.',
      tip:
        'Ve temprano — el agua está más clara antes de que suba el viento alrededor de las once. Lleva protector solar apto para arrecifes.',
      walkMinutes: 3,
      priceLevel: 'Gratis',
      mapUrl: 'https://maps.google.com/?q=Los+Corales+reef+snorkeling',
      image: '',
      tags: ['Snorkel', 'Gratis', 'Mañana'],
      order: 10,
    },
    {
      id: 'dsc-cocobongo',
      name: 'Coco Bongo',
      category: 'Vida nocturna',
      blurb:
        'No es tanto una discoteca como un circo de tres horas — acróbatas en cables, tributos, cañones de confeti y barra libre. En el centro de Punta Cana y completamente imparable.',
      tip:
        'Las puertas abren alrededor de las 22:00 pero el espectáculo crece después de medianoche. La entrada incluye bebidas, así que toma un taxi.',
      walkMinutes: 0,
      priceLevel: '$$$',
      mapUrl: 'https://maps.google.com/?q=Coco+Bongo+Punta+Cana',
      image: '',
      tags: ['Espectáculo', 'Barra libre', 'Noche'],
      order: 11,
    },
    {
      id: 'dsc-imagine',
      name: 'Imagine Punta Cana',
      category: 'Vida nocturna',
      blurb:
        'Una discoteca construida dentro de un sistema natural de cuevas, con música diferente en cada caverna. Extraña y completamente genial.',
      tip:
        'Los miércoles y sábados son las noches grandes. El código de vestimenta es elegante — no hay ropa de playa en la entrada.',
      walkMinutes: 0,
      priceLevel: '$$$',
      mapUrl: 'https://maps.google.com/?q=Imagine+Punta+Cana',
      image: '',
      tags: ['Club', 'Cuevas', 'Noche'],
      order: 12,
    },
    {
      id: 'dsc-palmareal',
      name: 'Palma Real Shopping Village',
      category: 'Compras',
      blurb:
        'El centro comercial grande más cercano — farmacia, supermercado, puros, ron, ámbar y larimar, cine y zona de comidas. Hay transporte gratuito desde la mayoría de resorts.',
      tip:
        'El larimar solo se extrae en República Dominicana. Cómpralo aquí en una tienda certificada en lugar de a un vendedor de playa.',
      walkMinutes: 0,
      priceLevel: '$$',
      mapUrl: 'https://maps.google.com/?q=Palma+Real+Shopping+Village',
      image: '',
      tags: ['Souvenirs', 'Farmacia', 'Aire acondicionado'],
      order: 13,
    },
    {
      id: 'dsc-supermarket',
      name: 'Supermercado en Los Corales',
      category: 'Esenciales',
      blurb:
        'Agua, ron, café, protector solar y fruta a precios locales, a cinco minutos de la playa — una fracción de lo que cuesta la misma botella en la tienda del resort.',
      tip:
        'Compra las botellas grandes de agua de 5 litros. Nunca bebas agua del grifo y evita el hielo de los puestos callejeros.',
      walkMinutes: 5,
      priceLevel: '$',
      mapUrl: 'https://maps.google.com/?q=supermercado+Los+Corales+Bavaro',
      image: '',
      tags: ['Agua', 'Snacks', 'Barato'],
      order: 14,
    },
    {
      id: 'dsc-pharmacy',
      name: 'Farmacia y clínica',
      category: 'Esenciales',
      blurb:
        'Las farmacias aquí son excelentes y mucho más baratas que en casa — after-sun, pastillas para el mareo, repelente de mosquitos y muchos medicamentos de venta libre.',
      tip:
        'Para algo más serio, las clínicas privadas de Bávaro son rápidas y hablan inglés. Guarda el número de tu seguro de viaje en el teléfono.',
      walkMinutes: 6,
      priceLevel: '$',
      mapUrl: 'https://maps.google.com/?q=farmacia+Bavaro+Los+Corales',
      image: '',
      tags: ['Salud', 'After-sun', 'Repelente'],
      order: 15,
    },
    {
      id: 'dsc-money',
      name: 'Efectivo, tarjetas y propinas',
      category: 'Esenciales',
      blurb:
        'Los dólares estadounidenses se aceptan casi en todas partes, pero obtienes mejor cambio pagando en pesos. Las tarjetas funcionan en restaurantes y tiendas; vendedores de playa y motoconchos suelen trabajar solo en efectivo.',
      tip:
        'Saca dinero de un cajero dentro de un centro comercial o banco, no de una máquina aislada en la calle. El 10% es una propina normal y apreciada.',
      walkMinutes: 5,
      priceLevel: '—',
      mapUrl: 'https://maps.google.com/?q=Banco+Popular+Bavaro',
      image: '',
      tags: ['Dinero', 'Cajero', 'Propinas'],
      order: 16,
    },
    {
      id: 'dsc-transport',
      name: 'Moverse por Bávaro',
      category: 'Transporte',
      blurb:
        'Uber funciona en Punta Cana y es la opción más económica. Los motoconchos son los más rápidos para trayectos cortos. Los taxis de resort son cómodos, pero cobran en dólares.',
      tip:
        'Acuerda el precio antes de subir a cualquier taxi o motoconcho. Pregunta primero en tu hotel cuánto debería costar.',
      walkMinutes: 0,
      priceLevel: '$',
      mapUrl: 'https://maps.google.com/?q=Bavaro+Punta+Cana',
      image: '',
      tags: ['Uber', 'Taxi', 'Motoconcho'],
      order: 17,
    },
    {
      id: 'dsc-sargassum',
      name: 'Sargazo y horarios de sol',
      category: 'Esenciales',
      blurb:
        'El sargazo llega a esta costa sobre todo entre mayo y agosto; los equipos limpian las playas principales cada mañana. Los rayos UV son muy fuertes entre las 11:00 y las 15:00 incluso con nubes.',
      tip:
        'Nada temprano, busca sombra al mediodía y reserva tu masaje en la playa para la hora dorada en lugar del mediodía.',
      walkMinutes: 0,
      priceLevel: '—',
      mapUrl: '',
      image: '',
      tags: ['Clima', 'Seguridad solar', 'Planificación'],
      order: 18,
    },
  ],

  testimonials: [
    {
      id: 'tst-1',
      name: 'Hannah & Tom',
      country: 'Reino Unido',
      quote:
        'Reservamos el masaje en pareja al atardecer durante nuestra luna de miel y terminó siendo de lo que más hablamos del viaje. Dos terapeutas, un toldo sobre la arena y el cielo poniéndose rosa. Valió cada dólar.',
      rating: 5,
      service: 'Masaje en Pareja',
      stayedAt: 'Los Corales',
      order: 1,
    },
    {
      id: 'tst-2',
      name: 'Markus',
      country: 'Alemania',
      quote:
        'Nach dem Flug hatte ich einen komplett blockierten Nacken. Yaritza wusste genau, wo sie arbeiten musste. Am nächsten Morgen war wieder alles frei. Klare Empfehlung.',
      rating: 5,
      service: 'Tejido Profundo',
      stayedAt: 'Hotel en Bávaro',
      order: 2,
    },
    {
      id: 'tst-3',
      name: 'Sophie',
      country: 'Canadá',
      quote:
        'Vinieron a mi habitación a las 8pm después de la excursión a Saona, trajeron todo y fueron completamente profesionales de principio a fin. Como mujer viajando sola me sentí totalmente cómoda.',
      rating: 5,
      service: 'Masaje Relajante de Cuerpo Completo',
      stayedAt: 'Resort, Bávaro',
      order: 3,
    },
    {
      id: 'tst-4',
      name: 'Familia Restrepo',
      country: 'Colombia',
      quote:
        'Reservamos para cuatro personas por WhatsApp y respondieron en cinco minutos. Puntuales, amables y con muy buenas manos. Volvimos tres veces en una semana.',
      rating: 5,
      service: 'Reductivo y Relajante',
      stayedAt: 'Villa, Cocotal',
      order: 4,
    },
    {
      id: 'tst-5',
      name: 'Elena',
      country: 'España',
      quote:
        'Estaba embarazada de siete meses y Carolina lo hizo todo de lado, con cojines y con muchísimo cuidado. Dormí de un tirón por primera vez en el viaje.',
      rating: 5,
      service: 'Prenatal',
      stayedAt: 'El Cortecito',
      order: 5,
    },
    {
      id: 'tst-6',
      name: 'Dave',
      country: 'Estados Unidos',
      quote:
        'La mitad del precio del spa del resort y sinceramente mejor. El estudio es pequeño y sencillo pero impecablemente limpio, y el masaje fue de verdad. Volví dos veces.',
      rating: 5,
      service: 'Piedras Calientes',
      stayedAt: 'Punta Cana',
      order: 6,
    },
  ],

  faqs: [
    {
      id: 'faq-book',
      question: '¿Cómo puedo reservar?',
      answer:
        'WhatsApp es lo más rápido — normalmente respondemos en pocos minutos entre las 9:00 y las 21:00. Envíanos tus fechas, cuántas personas son y si quieres el estudio, la playa o tu habitación. También puedes usar el formulario de reserva de la web; abre WhatsApp con toda la información ya preparada.',
      order: 1,
    },
    {
      id: 'faq-hotel',
      question: '¿De verdad pueden venir a mi habitación de hotel?',
      answer:
        'Sí — visitamos resorts, hoteles, Airbnbs y villas en Bávaro, El Cortecito, Cap Cana, Cocotal, Uvero Alto y Punta Cana Village. Llevamos una camilla plegable, sábanas limpias, aceites, toallas y un pequeño altavoz. Solo dinos el nombre del resort y tu edificio o número de habitación para que recepción nos deje pasar sin problemas.',
      order: 2,
    },
    {
      id: 'faq-pay',
      question: '¿Cómo puedo pagar?',
      answer:
        'En efectivo en dólares estadounidenses o pesos dominicanos, con tarjeta en el estudio o por internet antes de nuestra llegada — enviamos un enlace de Stripe o PayPal por WhatsApp. También aceptamos transferencias locales y pagos con tarjeta mediante Banco Popular / Azul. Lo que te resulte más cómodo.',
      order: 3,
    },
    {
      id: 'faq-safe',
      question: '¿Es un servicio de masaje legítimo y profesional?',
      answer:
        'Completamente. Es un negocio de masaje terapéutico atendido por mujeres y formado íntegramente por terapeutas dominicanas certificadas. Ofrecemos únicamente masajes terapéuticos y de relajación. Se utiliza siempre una correcta cobertura corporal y tu comodidad y privacidad se respetan sin excepción.',
      order: 4,
    },
    {
      id: 'faq-notice',
      question: '¿Con cuánta antelación debería reservar?',
      answer:
        'Las citas para el mismo día suelen ser posibles, especialmente en el estudio. Para horarios de playa al atardecer, masajes en pareja y grupos, es mucho más seguro reservar con uno o dos días de antelación — esas horas son las primeras que se llenan en temporada alta.',
      order: 5,
    },
    {
      id: 'faq-bring',
      question: '¿Qué necesito preparar?',
      answer:
        'Nada. Para las visitas al hotel, solo deja un poco de espacio junto a la cama. Dúchate antes si has estado en el mar — la sal y la arena hacen que el trabajo con aceite sea más áspero sobre la piel. Después bebe agua e intenta no programar nada exigente durante una hora.',
      order: 6,
    },
    {
      id: 'faq-pressure',
      question: '¿Qué pasa si no me gusta la presión?',
      answer:
        'Dínoslo inmediatamente, en cualquier idioma y en cualquier momento. Aquí no hace falta ser educado — ajustamos la presión de inmediato. Una presión que toleras en lugar de disfrutar es un masaje que no funcionó.',
      order: 7,
    },
    {
      id: 'faq-group',
      question: '¿Pueden hacer grupos, bodas y despedidas de soltera?',
      answer:
        'Sí, y nos encantan. Para grupos llevamos dos o tres terapeutas para que nadie espere demasiado. Danos unos días de antelación para grupos de más de cuatro personas y dinos la villa o suite para que podamos organizar el montaje.',
      order: 8,
    },
  ],

  payments: [
    {
      id: 'pay-cash',
      name: 'Efectivo',
      description:
        'Dólares estadounidenses o pesos dominicanos, pagados después de la sesión. No tienes que preparar nada por adelantado.',
      icon: 'cash',
      url: '',
      enabled: true,
      order: 1,
    },
    {
      id: 'pay-stripe',
      name: 'Tarjeta mediante Stripe',
      description:
        'Visa, Mastercard y Amex. Te enviamos un enlace seguro de Stripe por WhatsApp — puedes pagar antes de que lleguemos o sobre la camilla.',
      icon: 'stripe',
      url: '',
      enabled: true,
      order: 2,
    },
    {
      id: 'pay-azul',
      name: 'Banco Popular · Azul',
      description:
        'Pagos con tarjeta y transferencias locales mediante Banco Popular Azul. La opción más sencilla si tienes una cuenta dominicana.',
      icon: 'bank',
      url: '',
      enabled: true,
      order: 3,
    },
    {
      id: 'pay-paypal',
      name: 'PayPal',
      description:
        'Envía el pago a nuestra dirección de PayPal o pídenos una solicitud de pago. Útil si prefieres no introducir los datos de tu tarjeta.',
      icon: 'paypal',
      url: '',
      enabled: true,
      order: 4,
    },
  ],

  gallery: [
    {
      id: 'gal-1',
      caption: 'Montaje al amanecer en la playa de Los Corales',
      image: '',
      order: 1,
    },
    {
      id: 'gal-2',
      caption: 'El estudio, cinco minutos antes de abrir',
      image: '',
      order: 2,
    },
    {
      id: 'gal-3',
      caption: 'Piedras calientes listas',
      image: '',
      order: 3,
    },
    {
      id: 'gal-4',
      caption: 'Hora dorada, dos camillas',
      image: '',
      order: 4,
    },
    {
      id: 'gal-5',
      caption: 'Aceite de coco prensado en la isla',
      image: '',
      order: 5,
    },
    {
      id: 'gal-6',
      caption: 'El camino desde nuestra puerta hasta la arena',
      image: '',
      order: 6,
    },
  ],
}
