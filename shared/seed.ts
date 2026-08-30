import type { SiteContent } from './types'

/**
 * Everything below is the starting content that gets written to KV the first
 * time the site boots. It is all editable at /admin — names, prices, photos and
 * the WhatsApp number are placeholders meant to be replaced by the owner.
 */
export const seedContent: SiteContent = {
  site: {
    brandName: 'Massage Playero',
    brandMark: 'Massage & Beach Spa · Bávaro',
    tagline: 'Unhurried massage in Los Corales — in our studio, on the sand, or in your room.',

    heroKicker: 'Los Corales · El Cortecito · Bávaro Beach',
    heroTitle: 'Slow down to',
    heroHighlight: 'island time',
    heroSubtitle:
      'A small women-run massage studio two minutes from the sand in Los Corales. We also come to your beach chair or your hotel room — with our own table, oils and music.',
    heroImage: '',
    heroCtaPrimary: 'Reserve on WhatsApp',
    heroCtaSecondary: 'See treatments & prices',

    ownerName: 'Yaritza Mercedes',
    ownerRole: 'Owner & lead therapist',
    ownerQuote: 'A good massage should feel like the sea got into your shoulders.',
    ownerStory:
      'I grew up in Higüey and have been working with my hands for fourteen years — first in the big resort spas along Bávaro, then on my own. In 2019 I opened this little studio behind the Los Corales beach path so guests could get resort-quality work without resort prices, and so my team could be paid properly. Today four therapists work with me. We are all Dominican, all certified, and we all still get excited when someone falls asleep on the table.',
    ownerPhoto: '',

    whatsapp: '18095550123',
    whatsappGreeting: 'Hola! I found you online and I would like to book a massage.',
    phoneDisplay: '+1 809 555 0123',
    email: 'hola@olaserena.do',

    addressLine: 'Calle Los Corales, behind the beach path',
    neighborhood: 'Los Corales / El Cortecito',
    city: 'Bávaro, Punta Cana',
    mapUrl: 'https://maps.google.com/?q=Los+Corales+Bavaro+Punta+Cana',
    mapEmbedUrl: '',

    hours: [
      { label: 'Monday – Saturday', value: '9:00 – 21:00' },
      { label: 'Sunday', value: '10:00 – 19:00' },
      { label: 'Hotel & beach visits', value: 'Until 22:00, last booking 20:30' },
    ],
    languages: ['Español', 'English', 'Deutsch (basic)', 'Français (basic)', 'Русский (basic)'],

    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    tiktok: '',

    announcementEnabled: true,
    announcementText: 'Same-day appointments are usually possible — message us on WhatsApp and we answer in minutes.',

    currency: 'USD',
    hotelSurcharge:
      'Hotel and villa visits: +$10 inside Bávaro / El Cortecito, +$20 for Cap Cana, Uvero Alto and Punta Cana Village.',
    beachNote:
      'Beach massages happen under our shade tent on Los Corales beach — towels, sheets and music included.',
    cancellationPolicy:
      'Plans change on holiday. Cancel or move your appointment free of charge up to 3 hours before.',
  },

  venues: [
    {
      id: 'venue-studio',
      name: 'Our studio in Los Corales',
      subtitle: 'Two minutes from the sand',
      description:
        'A cool, quiet room behind the beach path — air conditioning, private shower, herbal tea afterwards. The most comfortable option if you want deep work or a longer session.',
      icon: 'home',
      note: 'Free filtered water and tea · private changing area · card payments accepted',
      order: 1,
    },
    {
      id: 'venue-beach',
      name: 'On the beach',
      subtitle: 'Los Corales & El Cortecito',
      description:
        'We set up a shade tent with a proper table right on the sand, so you keep the sound of the water the whole time. Best in the morning or the golden hour before sunset.',
      icon: 'palm',
      note: 'Sunrise and sunset slots go first — book a day ahead if you can',
      order: 2,
    },
    {
      id: 'venue-hotel',
      name: 'Your hotel or villa',
      subtitle: 'In-room, all of Bávaro & Punta Cana',
      description:
        'We arrive with a folding table, fresh linens, oils and a small speaker. Works in resort rooms, Airbnbs and villas — couples can be done side by side in the same room.',
      icon: 'bed',
      note: 'Tell us the resort name and building when you book so we can pass reception smoothly',
      order: 3,
    },
  ],

  services: [
    {
      id: 'svc-relax',
      name: 'Full Body Relaxing Massage',
      slug: 'full-body-relaxing',
      tagline: 'The classic — head to toe, slow and warm',
      description:
        'Long, flowing Swedish strokes over the whole body with warm coconut or almond oil. Pressure stays gentle to medium; the goal is to switch your nervous system off after a travel day or a long week.',
      benefits: [
        'Melts travel and flight tension',
        'Helps you sleep through the night',
        'Calms sunburnt, tight skin',
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
      name: 'Deep Tissue & Sports',
      slug: 'deep-tissue',
      tagline: 'For knots that came with you from home',
      description:
        'Firm, focused work through the deeper layers of muscle — forearms, elbows and slow sustained pressure on the areas you point at. We check in on pressure constantly; it should feel like relief, never like fighting.',
      benefits: [
        'Releases neck, shoulder and lower-back knots',
        'Great after surfing, padel or the gym',
        'Restores range of movement',
      ],
      durations: [
        { minutes: 60, price: 60 },
        { minutes: 90, price: 80 },
      ],
      category: 'Therapeutic',
      icon: 'spark',
      image: '',
      featured: true,
      popular: true,
      order: 2,
    },
    {
      id: 'svc-stone',
      name: 'Hot Stone Massage',
      slug: 'hot-stone',
      tagline: 'Warm volcanic basalt along the spine',
      description:
        'Smooth heated stones are placed along the back and used as an extension of our hands. The heat opens the muscle before we ever press hard, so deep tension lets go without discomfort.',
      benefits: [
        'Deep warmth without deep pressure',
        'Wonderful for cold-weather travellers',
        'Very grounding before bed',
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
      name: 'Aromatherapy Coconut Ritual',
      slug: 'aromatherapy',
      tagline: 'Island oils, chosen by how you feel',
      description:
        'You pick the blend when we arrive — mandarin and vetiver to unwind, mint and eucalyptus to wake up, or plain warm coconut oil pressed here on the island. Gentle full-body work with extra time on scalp and feet.',
      benefits: [
        'Choose your own scent',
        'Leaves skin soft after sun and salt',
        'Long scalp and foot finish',
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
      name: 'Couples Massage',
      slug: 'couples',
      tagline: 'Two therapists, two tables, side by side',
      description:
        'Two of us arrive together and work at the same time, in the same room or under the same beach tent. The most-requested thing we do for honeymoons and anniversaries — finish with sparkling water and a fruit plate.',
      benefits: [
        'Same room, same hour',
        'Perfect for honeymoons',
        'Each person picks their own pressure',
      ],
      durations: [
        { minutes: 60, price: 95 },
        { minutes: 90, price: 135 },
      ],
      category: 'Together',
      icon: 'heart',
      image: '',
      featured: true,
      popular: true,
      order: 5,
    },
    {
      id: 'svc-fourhands',
      name: 'Four Hands Massage',
      slug: 'four-hands',
      tagline: 'Two therapists, one very lucky body',
      description:
        'Two therapists working in mirrored rhythm over one person. The brain gives up trying to track it after about ninety seconds — which is exactly the point. Our most indulgent hour.',
      benefits: [
        'Twice the work in the same hour',
        'Extraordinarily deep switch-off',
        'A real occasion treatment',
      ],
      durations: [
        { minutes: 60, price: 95 },
        { minutes: 90, price: 130 },
      ],
      category: 'Together',
      icon: 'spark',
      image: '',
      featured: false,
      popular: false,
      order: 6,
    },
    {
      id: 'svc-back',
      name: 'Back, Neck & Shoulders',
      slug: 'back-neck-shoulders',
      tagline: 'Short, targeted, straight to the point',
      description:
        'All the time spent where it actually hurts. Ideal between excursions, after a long flight, or as a quick reset before dinner.',
      benefits: [
        'Fits into any afternoon',
        'Focused on desk and travel tension',
        'No oil in the hair if you ask',
      ],
      durations: [
        { minutes: 30, price: 35 },
        { minutes: 45, price: 45 },
      ],
      category: 'Therapeutic',
      icon: 'spark',
      image: '',
      featured: false,
      popular: true,
      order: 7,
    },
    {
      id: 'svc-reflex',
      name: 'Foot Reflexology',
      slug: 'reflexology',
      tagline: 'For feet that walked all of Bávaro',
      description:
        'Pressure-point work through the soles, arches and calves, finishing with a cooling mint balm. Hot sand, flip flops and excursion days are hard on feet — this fixes them.',
      benefits: [
        'Relieves swollen, tired feet',
        'Improves circulation after flights',
        'Can be done fully clothed',
      ],
      durations: [
        { minutes: 30, price: 30 },
        { minutes: 45, price: 40 },
      ],
      category: 'Therapeutic',
      icon: 'leaf',
      image: '',
      featured: false,
      popular: false,
      order: 8,
    },
    {
      id: 'svc-lymph',
      name: 'Lymphatic Drainage',
      slug: 'lymphatic-drainage',
      tagline: 'Light, rhythmic, de-puffing',
      description:
        'Very light rhythmic strokes that follow the lymphatic pathways to move retained fluid. Popular after long-haul flights, in late pregnancy, and as part of a post-surgery recovery plan.',
      benefits: [
        'Reduces swelling and heaviness',
        'Gentle enough for every day',
        'Post-flight and post-op friendly',
      ],
      durations: [
        { minutes: 60, price: 65 },
        { minutes: 90, price: 90 },
      ],
      category: 'Therapeutic',
      icon: 'wave',
      image: '',
      featured: false,
      popular: false,
      order: 9,
    },
    {
      id: 'svc-reductive',
      name: 'Reductive & Anti-Cellulite',
      slug: 'reductive',
      tagline: 'The Dominican classic — firm and vigorous',
      description:
        'Strong kneading, wooden tools and rapid percussion over hips, legs and abdomen, the way it is done in salons all over the country. Firm by design — tell us your limit and we will stay under it.',
      benefits: [
        'Stimulating and energising',
        'Often booked as a course of 5',
        'Combines well with drainage',
      ],
      durations: [
        { minutes: 45, price: 55 },
        { minutes: 60, price: 65 },
      ],
      category: 'Therapeutic',
      icon: 'spark',
      image: '',
      featured: false,
      popular: false,
      order: 10,
    },
    {
      id: 'svc-prenatal',
      name: 'Prenatal Massage',
      slug: 'prenatal',
      tagline: 'Side-lying, cushioned, completely safe',
      description:
        'Second and third trimester work done side-lying with body cushions, focused on lower back, hips and swollen ankles. Two of our therapists hold specific prenatal certification.',
      benefits: [
        'Relieves lower back and hip load',
        'Eases swollen feet and ankles',
        'Certified prenatal therapists',
      ],
      durations: [{ minutes: 60, price: 60 }],
      category: 'Therapeutic',
      icon: 'heart',
      image: '',
      featured: false,
      popular: false,
      order: 11,
    },
    {
      id: 'svc-aftersun',
      name: 'After-Sun Aloe Ritual',
      slug: 'after-sun',
      tagline: 'When the Caribbean got you on day one',
      description:
        'Cool aloe harvested locally, cucumber and chilled towels applied with feather-light strokes — no deep pressure anywhere. Bring this one to your room on the evening you overdid the sun.',
      benefits: [
        'Cools and calms burnt skin',
        'Zero-pressure, feather light',
        'Rehydrates after sun and salt',
      ],
      durations: [{ minutes: 45, price: 50 }],
      category: 'Skin',
      icon: 'sun',
      image: '',
      featured: false,
      popular: false,
      order: 12,
    },
    {
      id: 'svc-scrub',
      name: 'Coconut & Coffee Body Scrub',
      slug: 'body-scrub',
      tagline: 'Exfoliate, rinse, then a full hour of massage',
      description:
        'Dominican coffee grounds, raw sugar and coconut oil scrubbed over the whole body, rinsed off, then sixty minutes of relaxing massage on brand-new skin. Ninety minutes total.',
      benefits: [
        'Skin like the first day of holiday',
        'Scrub plus a full-hour massage',
        'Made with local coffee and cacao',
      ],
      durations: [{ minutes: 90, price: 85 }],
      category: 'Skin',
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
      name: 'Honeymoon Sunset',
      description:
        'Two therapists, two tables under our tent on Los Corales beach as the light goes gold, then cold sparkling water and a plate of local fruit.',
      includes: [
        '90 min couples massage on the beach',
        'Sunset time slot held for you',
        'Flower petals & fruit plate',
        'Photo of the setup if you want one',
      ],
      price: 160,
      duration: '90 min · for two',
      badge: 'Most requested',
      order: 1,
    },
    {
      id: 'pkg-week',
      name: 'The Whole Week',
      description:
        'Four sessions across your stay, mixed however you like — deep tissue after the excursion day, relaxing before the flight home.',
      includes: [
        '4 × 60 min sessions',
        'Mix any treatments you like',
        'Same therapist each time if you prefer',
        'Save $40 against single prices',
      ],
      price: 170,
      duration: '4 × 60 min',
      badge: 'Best value',
      order: 2,
    },
    {
      id: 'pkg-arrival',
      name: 'Arrival Reset',
      description:
        'The one to book for the evening you land. Lymphatic drainage for flight swelling, then reflexology for the feet, in your room.',
      includes: [
        '60 min lymphatic drainage',
        '30 min foot reflexology',
        'In your hotel room',
        'Late slots until 22:00',
      ],
      price: 85,
      duration: '90 min · in-room',
      badge: 'Day one',
      order: 3,
    },
    {
      id: 'pkg-bride',
      name: 'Bridal Party',
      description:
        'Up to five people massaged in the same afternoon at your villa or resort suite — we bring enough therapists that nobody waits long.',
      includes: [
        'Up to 5 guests',
        '60 min each',
        'We bring 2–3 therapists',
        'Villa, suite or beach',
      ],
      price: 240,
      duration: 'Half day · groups',
      badge: 'Groups',
      order: 4,
    },
  ],

  team: [
    {
      id: 'team-yaritza',
      name: 'Yaritza',
      role: 'Owner · deep tissue & hot stone',
      bio:
        'Fourteen years of hands, five of them in the biggest resort spas on this coast. She reads a back in about thirty seconds and is the one to ask for if something genuinely hurts.',
      specialties: ['Deep tissue', 'Hot stone', 'Sports recovery'],
      languages: ['Español', 'English'],
      years: '14 years',
      photo: '',
      accent: 'ocean',
      order: 1,
    },
    {
      id: 'team-massiel',
      name: 'Massiel',
      role: 'Relaxing & aromatherapy',
      bio:
        'The slowest, softest hands on the team. Guests fall asleep on her table constantly, which she takes as the highest possible compliment.',
      specialties: ['Relaxing', 'Aromatherapy', 'After-sun'],
      languages: ['Español', 'English'],
      years: '7 years',
      photo: '',
      accent: 'coral',
      order: 2,
    },
    {
      id: 'team-carolina',
      name: 'Carolina',
      role: 'Prenatal & lymphatic drainage',
      bio:
        'Certified in prenatal and post-operative drainage. Endlessly patient, and the person we send to anyone nervous about being touched by a stranger.',
      specialties: ['Prenatal', 'Lymphatic drainage', 'Reflexology'],
      languages: ['Español', 'English', 'Français'],
      years: '6 years',
      photo: '',
      accent: 'palm',
      order: 3,
    },
    {
      id: 'team-anyi',
      name: 'Anyi',
      role: 'Reductive & anti-cellulite',
      bio:
        'Strong. Genuinely strong. Ask her for the Dominican reductive massage and then hold on — regulars book her five sessions at a time.',
      specialties: ['Reductive', 'Anti-cellulite', 'Deep tissue'],
      languages: ['Español', 'English (basic)'],
      years: '5 years',
      photo: '',
      accent: 'sun',
      order: 4,
    },
    {
      id: 'team-dahiana',
      name: 'Dahiana',
      role: 'Beach sessions & four hands',
      bio:
        'The one who carries the tent to the sand before sunrise. Loves beach work, big groups, and being half of a four-hands session.',
      specialties: ['Beach massage', 'Four hands', 'Relaxing'],
      languages: ['Español', 'English', 'Deutsch (basic)'],
      years: '4 years',
      photo: '',
      accent: 'seafoam',
      order: 5,
    },
  ],

  benefits: [
    {
      id: 'ben-flight',
      title: 'Undo the flight',
      description:
        'Eight hours in a seat leaves your hips locked and your ankles full of fluid. One session on arrival evening and day two of your holiday actually starts on day two.',
      icon: 'plane',
      order: 1,
    },
    {
      id: 'ben-sleep',
      title: 'Sleep through the heat',
      description:
        'The first nights in the tropics are restless — new time zone, air conditioning, too much sun. Evening massage drops your nervous system into rest and the night goes quiet.',
      icon: 'moon',
      order: 2,
    },
    {
      id: 'ben-sun',
      title: 'Rescue over-sunned skin',
      description:
        'Caribbean sun is stronger than it feels with a sea breeze on you. Cool aloe, cucumber and a feather-light touch take the sting out of an honest mistake.',
      icon: 'sun',
      order: 3,
    },
    {
      id: 'ben-excursion',
      title: 'Recover between excursions',
      description:
        'Saona, buggies, catamarans, Hoyo Azul — adventure days are hard on shoulders and calves. Book the evening after and go again tomorrow.',
      icon: 'compass',
      order: 4,
    },
    {
      id: 'ben-local',
      title: 'Money that stays on the island',
      description:
        'You get resort-quality work for roughly half the resort spa price, and five Dominican women get paid directly for it. No middleman, no commission.',
      icon: 'heart',
      order: 5,
    },
    {
      id: 'ben-nomove',
      title: 'You never have to move',
      description:
        'Beach chair, hotel room, villa terrace — we carry the table, the sheets, the oils and the music. Your only job is to be horizontal.',
      icon: 'palm',
      order: 6,
    },
  ],

  discover: [
    {
      id: 'dsc-loscorales',
      name: 'Playa Los Corales',
      category: 'Beach',
      blurb:
        'The stretch of sand right outside our door. Softer crowds than the resort beaches, beach bars every hundred metres, and a shallow reef close to shore.',
      tip:
        'Walk left toward El Cortecito for the liveliest section, right for the quiet end where the palms lean over the water.',
      walkMinutes: 2,
      priceLevel: 'Free',
      mapUrl: 'https://maps.google.com/?q=Playa+Los+Corales+Bavaro',
      image: '',
      tags: ['Swimming', 'Sunrise', 'Beach bars'],
      order: 1,
    },
    {
      id: 'dsc-cortecito',
      name: 'El Cortecito beach village',
      category: 'Beach',
      blurb:
        'The old fishing corner of Bávaro — wooden boats pulled up on the sand, souvenir stalls, and the most authentic little strip on this whole coast.',
      tip:
        'Prices at the stalls are opening offers. Smile, offer about half, meet near the middle — it is expected and friendly.',
      walkMinutes: 8,
      priceLevel: 'Free',
      mapUrl: 'https://maps.google.com/?q=El+Cortecito+Bavaro',
      image: '',
      tags: ['Souvenirs', 'Fishing boats', 'People watching'],
      order: 2,
    },
    {
      id: 'dsc-capitancook',
      name: 'Capitán Cook',
      category: 'Eat & Drink',
      blurb:
        'The El Cortecito institution. You pick your fish or lobster from ice, they grill it over coals, and you eat it barefoot with your table on the sand.',
      tip:
        'Seafood is priced by weight — ask them to weigh your pick in front of you so the bill holds no surprises.',
      walkMinutes: 9,
      priceLevel: '$$$',
      mapUrl: 'https://maps.google.com/?q=Capitan+Cook+El+Cortecito',
      image: '',
      tags: ['Seafood', 'On the sand', 'Sunset'],
      order: 3,
    },
    {
      id: 'dsc-soles',
      name: 'Soles Chill Out Bar',
      category: 'Eat & Drink',
      blurb:
        'Beanbags in the sand, decent cocktails and a DJ who reads the hour correctly. Our own after-work spot when a shift finishes late.',
      tip: 'Go for sunset, stay for the live music that usually starts around nine.',
      walkMinutes: 4,
      priceLevel: '$$',
      mapUrl: 'https://maps.google.com/?q=Soles+Chill+Out+Bar+Los+Corales',
      image: '',
      tags: ['Cocktails', 'Live music', 'Sunset'],
      order: 4,
    },
    {
      id: 'dsc-loscoralesstrip',
      name: 'The Los Corales restaurant strip',
      category: 'Eat & Drink',
      blurb:
        'One walkable street of independent kitchens — Italian, Argentine grill, sushi, tacos, Dominican criollo. Where everyone eats on the night they escape the buffet.',
      tip:
        'It fills up after 19:00 in high season. Walk down at 18:30, look at three menus, then pick.',
      walkMinutes: 5,
      priceLevel: '$$',
      mapUrl: 'https://maps.google.com/?q=Los+Corales+restaurants+Bavaro',
      image: '',
      tags: ['Dinner', 'Walkable', 'Variety'],
      order: 5,
    },
    {
      id: 'dsc-comedor',
      name: 'A Dominican comedor',
      category: 'Eat & Drink',
      blurb:
        'The little local canteens serving la bandera — rice, beans, stewed meat, salad and fried plantain — for a few hundred pesos. This is what the island actually eats at lunch.',
      tip:
        'Go before 13:30, while everything is fresh. Ask for "la bandera con pollo guisado" and you cannot go wrong.',
      walkMinutes: 10,
      priceLevel: '$',
      mapUrl: 'https://maps.google.com/?q=comedor+Bavaro+Punta+Cana',
      image: '',
      tags: ['Local food', 'Cheap', 'Lunch'],
      order: 6,
    },
    {
      id: 'dsc-saona',
      name: 'Isla Saona',
      category: 'Excursion',
      blurb:
        'The postcard island — catamaran out, speedboat back, a stop at the natural pool where starfish sit in waist-deep water. The one excursion nearly everyone does.',
      tip:
        'It is a full 12-hour day and the boat gets loud. Book your massage for the evening after, not the morning of.',
      walkMinutes: 0,
      priceLevel: '$$$',
      mapUrl: 'https://maps.google.com/?q=Isla+Saona',
      image: '',
      tags: ['Full day', 'Catamaran', 'Iconic'],
      order: 7,
    },
    {
      id: 'dsc-hoyoazul',
      name: 'Hoyo Azul & Scape Park',
      category: 'Excursion',
      blurb:
        'A cenote of impossible turquoise at the foot of a cliff in Cap Cana, reached by a short jungle walk. Add zip lines and cave pools if you want a whole day of it.',
      tip:
        'First entry of the morning gets you the water almost to yourself and much better photographs.',
      walkMinutes: 0,
      priceLevel: '$$$',
      mapUrl: 'https://maps.google.com/?q=Hoyo+Azul+Scape+Park+Cap+Cana',
      image: '',
      tags: ['Cenote', 'Half day', 'Swimming'],
      order: 8,
    },
    {
      id: 'dsc-macao',
      name: 'Playa Macao',
      category: 'Excursion',
      blurb:
        'Twenty-five minutes north, wilder and emptier, with real Atlantic waves and the best beginner surf school on this coast. Fried fish shacks right behind the sand.',
      tip:
        'The current is genuinely strong here — swim where the surf school is, not at the empty ends.',
      walkMinutes: 0,
      priceLevel: '$$',
      mapUrl: 'https://maps.google.com/?q=Playa+Macao+Punta+Cana',
      image: '',
      tags: ['Surfing', 'Wild beach', 'Half day'],
      order: 9,
    },
    {
      id: 'dsc-snorkel',
      name: 'The reef off Los Corales',
      category: 'Excursion',
      blurb:
        'You do not need a boat trip to snorkel here. The reef sits a short swim from the shore in front of Los Corales, with parrotfish, sergeant majors and the occasional ray.',
      tip:
        'Go early — the water is clearest before the wind picks up around eleven. Bring reef-safe sunscreen.',
      walkMinutes: 3,
      priceLevel: 'Free',
      mapUrl: 'https://maps.google.com/?q=Los+Corales+reef+snorkeling',
      image: '',
      tags: ['Snorkeling', 'Free', 'Morning'],
      order: 10,
    },
    {
      id: 'dsc-cocobongo',
      name: 'Coco Bongo',
      category: 'Nightlife',
      blurb:
        'Not a nightclub so much as a three-hour circus — acrobats on wires, tribute acts, confetti cannons, open bar. Downtown Punta Cana, and completely relentless.',
      tip:
        'Doors open around 22:00 but the show builds after midnight. Ticket includes drinks, so take a taxi, not a car.',
      walkMinutes: 0,
      priceLevel: '$$$',
      mapUrl: 'https://maps.google.com/?q=Coco+Bongo+Punta+Cana',
      image: '',
      tags: ['Show', 'Open bar', 'Late'],
      order: 11,
    },
    {
      id: 'dsc-imagine',
      name: 'Imagine Punta Cana',
      category: 'Nightlife',
      blurb:
        'A discotheque built inside a natural cave system, with different music in each cavern. Strange and completely brilliant.',
      tip: 'Wednesdays and Saturdays are the big nights. Dress code is smart — no beachwear at the door.',
      walkMinutes: 0,
      priceLevel: '$$$',
      mapUrl: 'https://maps.google.com/?q=Imagine+Punta+Cana',
      image: '',
      tags: ['Club', 'Caves', 'Late'],
      order: 12,
    },
    {
      id: 'dsc-palmareal',
      name: 'Palma Real Shopping Village',
      category: 'Shopping',
      blurb:
        'The nearest proper mall — pharmacy, supermarket, cigars, rum, amber and larimar, a cinema and a food court. Free shuttles run from most resorts.',
      tip:
        'Larimar is only mined in the Dominican Republic. Buy it here from a certified shop rather than from a beach vendor.',
      walkMinutes: 0,
      priceLevel: '$$',
      mapUrl: 'https://maps.google.com/?q=Palma+Real+Shopping+Village',
      image: '',
      tags: ['Souvenirs', 'Pharmacy', 'Air conditioning'],
      order: 13,
    },
    {
      id: 'dsc-supermarket',
      name: 'Supermercado in Los Corales',
      category: 'Essentials',
      blurb:
        'Water, rum, coffee, sunscreen and fruit at local prices, five minutes from the beach — a fraction of what the resort shop charges for the same bottle.',
      tip:
        'Buy the big 5-litre water bottles. Never drink the tap water, and skip ice from street stalls.',
      walkMinutes: 5,
      priceLevel: '$',
      mapUrl: 'https://maps.google.com/?q=supermercado+Los+Corales+Bavaro',
      image: '',
      tags: ['Water', 'Snacks', 'Cheap'],
      order: 14,
    },
    {
      id: 'dsc-pharmacy',
      name: 'Farmacia & clinic',
      category: 'Essentials',
      blurb:
        'Pharmacies here are excellent and much cheaper than at home — after-sun, motion sickness tablets, mosquito repellent, most antibiotics over the counter.',
      tip:
        'For anything more serious, the private clinics in Bávaro are fast and speak English. Keep your travel insurance number in your phone.',
      walkMinutes: 6,
      priceLevel: '$',
      mapUrl: 'https://maps.google.com/?q=farmacia+Bavaro+Los+Corales',
      image: '',
      tags: ['Health', 'After-sun', 'Repellent'],
      order: 15,
    },
    {
      id: 'dsc-money',
      name: 'Cash, cards & tipping',
      category: 'Essentials',
      blurb:
        'US dollars are accepted nearly everywhere, but you get a better rate paying in pesos. Cards work in restaurants and shops; beach vendors and motoconchos are cash only.',
      tip:
        'Withdraw from a bank ATM inside a mall, not a standalone machine on the street. 10% is a normal, appreciated tip.',
      walkMinutes: 5,
      priceLevel: '—',
      mapUrl: 'https://maps.google.com/?q=Banco+Popular+Bavaro',
      image: '',
      tags: ['Money', 'ATM', 'Tipping'],
      order: 16,
    },
    {
      id: 'dsc-transport',
      name: 'Getting around Bávaro',
      category: 'Getting around',
      blurb:
        'Uber works in Punta Cana and is the cheapest honest option. Motoconchos (motorbike taxis) are fastest for short hops. Resort taxis are comfortable but priced in dollars.',
      tip:
        'Agree the price before you get in any taxi or on any motoconcho. Ask your hotel what the fare should be first.',
      walkMinutes: 0,
      priceLevel: '$',
      mapUrl: 'https://maps.google.com/?q=Bavaro+Punta+Cana',
      image: '',
      tags: ['Uber', 'Taxi', 'Motoconcho'],
      order: 17,
    },
    {
      id: 'dsc-sargassum',
      name: 'Sargassum & sun timing',
      category: 'Essentials',
      blurb:
        'Seaweed drifts onto this coast mostly between May and August; crews clear the main beaches each morning. UV is brutal between 11:00 and 15:00 even under cloud.',
      tip:
        'Swim early, shade in the middle of the day, and book your beach massage for the golden hour instead of noon.',
      walkMinutes: 0,
      priceLevel: '—',
      mapUrl: '',
      image: '',
      tags: ['Weather', 'Sun safety', 'Planning'],
      order: 18,
    },
  ],

  testimonials: [
    {
      id: 'tst-1',
      name: 'Hannah & Tom',
      country: 'United Kingdom',
      quote:
        'We booked the sunset couples massage on our honeymoon and it turned out to be the thing we talk about most. Two therapists, a tent on the sand, the sky going pink. Worth every dollar.',
      rating: 5,
      service: 'Couples Massage',
      stayedAt: 'Los Corales',
      order: 1,
    },
    {
      id: 'tst-2',
      name: 'Markus',
      country: 'Deutschland',
      quote:
        'Ich hatte nach dem Flug einen komplett blockierten Nacken. Yaritza hat genau gewusst, wo sie arbeiten muss. Am nächsten Morgen war alles frei. Ganz klare Empfehlung.',
      rating: 5,
      service: 'Deep Tissue',
      stayedAt: 'Hotel in Bávaro',
      order: 2,
    },
    {
      id: 'tst-3',
      name: 'Sophie',
      country: 'Canada',
      quote:
        'They came to my room at 8pm after the Saona trip, brought everything, and were completely professional from start to finish. As a woman travelling alone I felt entirely comfortable.',
      rating: 5,
      service: 'Full Body Relaxing',
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
      service: 'Reductive & Relaxing',
      stayedAt: 'Villa, Cocotal',
      order: 4,
    },
    {
      id: 'tst-5',
      name: 'Elena',
      country: 'España',
      quote:
        'Estaba embarazada de siete meses y Carolina lo hizo todo de lado, con cojines, con muchísimo cuidado. Dormí de un tirón por primera vez en el viaje.',
      rating: 5,
      service: 'Prenatal',
      stayedAt: 'El Cortecito',
      order: 5,
    },
    {
      id: 'tst-6',
      name: 'Dave',
      country: 'United States',
      quote:
        'Half the price of the resort spa and honestly better. The studio is small and simple but spotlessly clean, and the massage was the real thing. Went back twice.',
      rating: 5,
      service: 'Hot Stone',
      stayedAt: 'Punta Cana',
      order: 6,
    },
  ],

  faqs: [
    {
      id: 'faq-book',
      question: 'How do I book?',
      answer:
        'WhatsApp is fastest — we usually reply within a few minutes between 9:00 and 21:00. Send your dates, how many people, and whether you want the studio, the beach or your room. You can also use the reservation form on this site; it opens WhatsApp with everything already filled in.',
      order: 1,
    },
    {
      id: 'faq-hotel',
      question: 'Can you really come to my hotel room?',
      answer:
        'Yes — we visit resorts, hotels, Airbnbs and villas across Bávaro, El Cortecito, Cortecito, Cap Cana, Cocotal, Uvero Alto and Punta Cana Village. We bring a folding table, fresh linens, oils, towels and a small speaker. Just tell us the resort name and your building or room number so reception lets us through smoothly.',
      order: 2,
    },
    {
      id: 'faq-pay',
      question: 'How can I pay?',
      answer:
        'Cash in US dollars or Dominican pesos, card in the studio, or online before we arrive — we send a Stripe or PayPal link over WhatsApp, and we also accept local transfers and card payments through Banco Popular / Azul. Whatever is easiest for you.',
      order: 3,
    },
    {
      id: 'faq-safe',
      question: 'Is this a legitimate, professional massage service?',
      answer:
        'Completely. This is a licensed therapeutic massage business run by a woman, staffed entirely by certified Dominican therapists. We offer therapeutic and relaxation massage only. Draping is used at all times and your comfort and privacy are respected without exception.',
      order: 4,
    },
    {
      id: 'faq-notice',
      question: 'How far in advance should I book?',
      answer:
        'Same-day appointments are often possible, especially in the studio. For sunset beach slots, couples massages and anything for a group, a day or two ahead is much safer — those hours fill first in high season.',
      order: 5,
    },
    {
      id: 'faq-bring',
      question: 'What do I need to prepare?',
      answer:
        'Nothing. For hotel visits, just clear a little space beside the bed. Shower first if you have been in the sea — salt and sand make oil work rough on the skin. Afterwards, drink water and try not to schedule anything demanding for an hour.',
      order: 6,
    },
    {
      id: 'faq-pressure',
      question: 'What if I do not like the pressure?',
      answer:
        'Tell us immediately, in any language, at any moment. There is no politeness required here — we adjust straight away. Pressure that you tolerate rather than enjoy is a massage that did not work.',
      order: 7,
    },
    {
      id: 'faq-group',
      question: 'Can you do groups, weddings and bachelorette parties?',
      answer:
        'Yes, and we love them. For groups we bring two or three therapists so nobody waits long. Give us a few days notice for anything over four people, and tell us the villa or suite so we can plan the setup.',
      order: 8,
    },
  ],

  payments: [
    {
      id: 'pay-cash',
      name: 'Cash',
      description:
        'US dollars or Dominican pesos, paid after the session. Nothing to arrange in advance.',
      icon: 'cash',
      url: '',
      enabled: true,
      order: 1,
    },
    {
      id: 'pay-stripe',
      name: 'Card via Stripe',
      description:
        'Visa, Mastercard and Amex. We send you a secure Stripe link on WhatsApp — pay before we arrive or on the table.',
      icon: 'stripe',
      url: '',
      enabled: true,
      order: 2,
    },
    {
      id: 'pay-azul',
      name: 'Banco Popular · Azul',
      description:
        'Local card payments and transfers through Banco Popular Azul. The easiest option if you have a Dominican account.',
      icon: 'bank',
      url: '',
      enabled: true,
      order: 3,
    },
    {
      id: 'pay-paypal',
      name: 'PayPal',
      description:
        'Send to our PayPal address, or ask us for a payment request. Useful if you would rather not enter a card at all.',
      icon: 'paypal',
      url: '',
      enabled: true,
      order: 4,
    },
  ],

  gallery: [
    { id: 'gal-1', caption: 'Sunrise setup on Los Corales beach', image: '', order: 1 },
    { id: 'gal-2', caption: 'The studio, five minutes before opening', image: '', order: 2 },
    { id: 'gal-3', caption: 'Warm stones, ready', image: '', order: 3 },
    { id: 'gal-4', caption: 'Golden hour, two tables', image: '', order: 4 },
    { id: 'gal-5', caption: 'Coconut oil pressed on the island', image: '', order: 5 },
    { id: 'gal-6', caption: 'The walk from our door to the sand', image: '', order: 6 },
  ],
}
