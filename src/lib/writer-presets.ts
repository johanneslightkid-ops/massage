import type { LanguageCode } from './translations'

/**
 * One-tap briefs for the AI blog writer.
 *
 * Each preset carries a label in both languages for the owner and a `brief`
 * in English for the model — the specific, real-world detail that turns a
 * generic "massage on holiday" article into one a guest recognises: which
 * day of the trip it is, which treatment actually helps, where the reader
 * flew in from and what that journey and that culture bring with them.
 *
 * The audience briefs describe travel patterns and customs, never character:
 * how long the flight is, which season they are escaping, how they celebrate.
 */

export interface WriterPreset {
  id: string
  label: Record<LanguageCode, string>
  brief: string
  /** A sentence that works as the topic when the owner types nothing. */
  topic: Record<LanguageCode, string>
}

export const OCCASIONS: WriterPreset[] = [
  {
    id: 'arrival',
    label: { en: 'Arrival day', es: 'Día de llegada' },
    brief: 'The first 24 hours after landing at Punta Cana airport (PUJ): long flight, swollen ankles, travel stiffness, adjusting to heat and time zone.',
    topic: { en: 'What to book on your first evening in Punta Cana', es: 'Qué reservar tu primera noche en Punta Cana' },
  },
  {
    id: 'excursion',
    label: { en: 'After an excursion', es: 'Después de una excursión' },
    brief: 'The evening after a big excursion day: Saona Island catamaran, buggies to Macao beach, Hoyo Azul / Scape Park, ziplines, snorkelling — sun, bumpy rides, sore back and legs.',
    topic: { en: 'Recovering from an excursion day in Bávaro', es: 'Recuperarse de un día de excursión en Bávaro' },
  },
  {
    id: 'honeymoon',
    label: { en: 'Honeymoon', es: 'Luna de miel' },
    brief: 'Newlyweds a few days after the wedding: exhausted, happy, wanting romance without effort; couples massage in the room or on the terrace at golden hour.',
    topic: { en: 'Couples massage ideas for a Punta Cana honeymoon', es: 'Ideas de masaje en pareja para una luna de miel en Punta Cana' },
  },
  {
    id: 'anniversary',
    label: { en: 'Anniversary or birthday', es: 'Aniversario o cumpleaños' },
    brief: 'A celebration trip — an anniversary, a milestone birthday (40th, 50th, 60th): making one evening special, gifts, surprises a partner can organise.',
    topic: { en: 'Surprising your partner with a massage on a celebration trip', es: 'Sorprender a tu pareja con un masaje en un viaje de celebración' },
  },
  {
    id: 'girls',
    label: { en: 'Bachelorette / girls’ trip', es: 'Despedida / viaje de amigas' },
    brief: 'A group of friends in a villa or suite: bachelorette weekend or girls’ trip, organising several treatments in one afternoon, timing around nights out.',
    topic: { en: 'Planning a group massage for a girls’ trip in Punta Cana', es: 'Organizar un masaje en grupo en un viaje de amigas a Punta Cana' },
  },
  {
    id: 'wedding',
    label: { en: 'Destination wedding', es: 'Boda en destino' },
    brief: 'A destination wedding in Punta Cana: the couple, the bridal party and the guests — pre-wedding nerves, glowing skin, dancing feet afterwards.',
    topic: { en: 'Massage before and after a destination wedding', es: 'Masajes antes y después de una boda en destino' },
  },
  {
    id: 'family',
    label: { en: 'Family holiday', es: 'Vacaciones en familia' },
    brief: 'A multigenerational family in a villa or resort: grandparents with stiff hips, parents who never get an hour off, a family celebration like a quinceañera or reunion.',
    topic: { en: 'Looking after the whole family on holiday', es: 'Cuidar a toda la familia en vacaciones' },
  },
  {
    id: 'babymoon',
    label: { en: 'Babymoon', es: 'Babymoon' },
    brief: 'A pregnant guest on a babymoon: safety first (trained prenatal therapist, side-lying, second/third trimester, check with doctor), comfort in the heat.',
    topic: { en: 'Prenatal massage on a babymoon: what is safe', es: 'Masaje prenatal en un babymoon: qué es seguro' },
  },
  {
    id: 'golf',
    label: { en: 'Golf week', es: 'Semana de golf' },
    brief: 'A golf trip: several rounds at Punta Espada, Corales, La Cana or Iberostar Bávaro in heat — lower back, lead shoulder, forearms; timing massage around tee times.',
    topic: { en: 'Sports massage between golf rounds in Punta Cana', es: 'Masaje deportivo entre rondas de golf en Punta Cana' },
  },
  {
    id: 'winter',
    label: { en: 'Winter escape', es: 'Escapar del invierno' },
    brief: 'Escaping a northern winter (December–April): months of cold, tense shoulders, dry skin meeting strong sun, often a longer stay of one to four weeks.',
    topic: { en: 'Thawing out: a winter-escape week of massage', es: 'Descongelarse: una semana de masajes para escapar del invierno' },
  },
  {
    id: 'workation',
    label: { en: 'Workation / long stay', es: 'Teletrabajo / estancia larga' },
    brief: 'Remote workers and digital nomads staying weeks: laptop neck, bad furniture, regular weekly sessions, booking around video calls and time zones.',
    topic: { en: 'Fixing laptop neck on a Caribbean workation', es: 'Arreglar el cuello del portátil en un teletrabajo caribeño' },
  },
  {
    id: 'solo',
    label: { en: 'Solo traveller', es: 'Viajera sola' },
    brief: 'Someone travelling alone, often a woman: feeling safe with a women-run team in her own room, treating herself, a quiet reset.',
    topic: { en: 'A massage in your room when you travel solo', es: 'Un masaje en tu habitación cuando viajas sola' },
  },
  {
    id: 'rainy',
    label: { en: 'Rainy afternoon', es: 'Tarde de lluvia' },
    brief: 'A tropical rain shower or a cloudy day (common in the afternoon from May to November): turning the day indoors into the best part of the trip.',
    topic: { en: 'What to do on a rainy afternoon in Punta Cana', es: 'Qué hacer una tarde de lluvia en Punta Cana' },
  },
  {
    id: 'departure',
    label: { en: 'Last night', es: 'Última noche' },
    brief: 'The evening before the flight home: packing, an early flight, preparing the body for the long journey and the return to work.',
    topic: { en: 'Why the last night is the best time for a massage', es: 'Por qué la última noche es el mejor momento para un masaje' },
  },
]

export const AUDIENCES: WriterPreset[] = [
  {
    id: 'canada',
    label: { en: 'Canada', es: 'Canadá' },
    brief: 'Readers from Canada (Toronto, Montréal, Ottawa, Calgary): escaping long winters, direct 4–5 hour flights, often a week or more at an all-inclusive; some read in French.',
    topic: { en: 'A winter week in Bávaro for Canadian travellers', es: 'Una semana de invierno en Bávaro para viajeros canadienses' },
  },
  {
    id: 'usa',
    label: { en: 'United States', es: 'Estados Unidos' },
    brief: 'Readers from the US (New York, New Jersey, Boston, Chicago, Florida, Texas): short 3–4 hour flights, long weekends and spring break, used to booking spa services by phone or app.',
    topic: { en: 'A long weekend in Punta Cana from the US', es: 'Un fin de semana largo en Punta Cana desde Estados Unidos' },
  },
  {
    id: 'diaspora',
    label: { en: 'Dominican diaspora', es: 'Diáspora dominicana' },
    brief: 'Dominicans living abroad (New York, Miami, Boston, Spain) coming home: family visits, holidays and Christmas, mixing family time with a few days of rest at the beach.',
    topic: { en: 'Coming home to the island: rest between family visits', es: 'Volver a la isla: descansar entre visitas familiares' },
  },
  {
    id: 'puertorico',
    label: { en: 'Puerto Rico', es: 'Puerto Rico' },
    brief: 'Readers from Puerto Rico: a short flight, often family or group trips, celebrations, close cultural ties and shared Caribbean habits.',
    topic: { en: 'A quick Caribbean getaway from Puerto Rico', es: 'Una escapada caribeña rápida desde Puerto Rico' },
  },
  {
    id: 'mexico',
    label: { en: 'Mexico', es: 'México' },
    brief: 'Readers from Mexico: honeymoons and family trips, people who know beach resorts well and compare with Cancún and Riviera Maya.',
    topic: { en: 'Punta Cana for travellers who know the Riviera Maya', es: 'Punta Cana para quienes conocen la Riviera Maya' },
  },
  {
    id: 'colombia',
    label: { en: 'Colombia & Venezuela', es: 'Colombia y Venezuela' },
    brief: 'Readers from Colombia and Venezuela: family celebrations, honeymoons, groups of friends; warm, social travellers who value personal attention and celebrate together.',
    topic: { en: 'Celebrating together in Punta Cana', es: 'Celebrar juntos en Punta Cana' },
  },
  {
    id: 'southerncone',
    label: { en: 'Argentina & Chile', es: 'Argentina y Chile' },
    brief: 'Readers from Argentina and Chile: long flights with connections, often in their summer or winter holidays, staying longer and exploring beyond the resort.',
    topic: { en: 'Recovering from a long trip from South America', es: 'Recuperarse de un viaje largo desde Sudamérica' },
  },
  {
    id: 'spain',
    label: { en: 'Spain', es: 'España' },
    brief: 'Readers from Spain: 8–9 hour flights from Madrid or Barcelona, 5–6 hour time difference, honeymoons and summer holidays, strong ties with the Dominican Republic.',
    topic: { en: 'Beating jet lag on a trip from Spain', es: 'Vencer el jet lag en un viaje desde España' },
  },
  {
    id: 'german',
    label: { en: 'Germany, Austria, Switzerland', es: 'Alemania, Austria, Suiza' },
    brief: 'Readers from Germany, Austria and Switzerland: 10-hour flights, 6-hour time difference, long two- or three-week holidays, appreciate clear practical information, punctuality and certified therapists.',
    topic: { en: 'Two weeks in the Caribbean, planned well', es: 'Dos semanas en el Caribe, bien planificadas' },
  },
  {
    id: 'uk',
    label: { en: 'UK & Ireland', es: 'Reino Unido e Irlanda' },
    brief: 'Readers from the UK and Ireland: 9-hour flights from London or Manchester, 5-hour time difference, school holidays, honeymoons, very sun-sensitive skin.',
    topic: { en: 'Sun, skin and massage for UK travellers', es: 'Sol, piel y masaje para viajeros del Reino Unido' },
  },
  {
    id: 'france',
    label: { en: 'France & Belgium', es: 'Francia y Bélgica' },
    brief: 'Readers from France and Belgium: 9-hour flights from Paris, appreciate quality, aromatherapy and skin care; some prefer French-speaking service.',
    topic: { en: 'Aromatherapy and skin rituals for a tropical holiday', es: 'Aromaterapia y rituales de piel para unas vacaciones tropicales' },
  },
  {
    id: 'italy',
    label: { en: 'Italy', es: 'Italia' },
    brief: 'Readers from Italy: winter and August holidays, couples and families, value beauty, good food and a relaxed pace.',
    topic: { en: 'La dolce vita, Caribbean style', es: 'La dolce vita, al estilo caribeño' },
  },
  {
    id: 'eastern',
    label: { en: 'Eastern Europe', es: 'Europa del Este' },
    brief: 'Readers from Poland, Czechia, Russia and Eastern Europe: long flights with connections, long stays to make the journey worthwhile, escaping cold winters.',
    topic: { en: 'Making a long trip to the Caribbean worth it', es: 'Que valga la pena un viaje largo al Caribe' },
  },
  {
    id: 'local',
    label: { en: 'Locals & residents', es: 'Locales y residentes' },
    brief: 'People who live in Bávaro, Punta Cana or Santo Domingo: a staycation, a weekend at the beach, after a long work season in tourism.',
    topic: { en: 'A staycation massage for people who live here', es: 'Un masaje de staycation para quienes viven aquí' },
  },
]

export const FORMATS: WriterPreset[] = [
  {
    id: 'guide',
    label: { en: 'Practical guide', es: 'Guía práctica' },
    brief: 'A practical guide with clear steps, timing and what to book.',
    topic: { en: '', es: '' },
  },
  {
    id: 'story',
    label: { en: 'Inspiring story', es: 'Historia inspiradora' },
    brief: 'An inspiring, sensory story of one realistic guest’s day, followed by the practical lessons from it. Never claim it is a real review.',
    topic: { en: '', es: '' },
  },
  {
    id: 'faq',
    label: { en: 'Questions & answers', es: 'Preguntas y respuestas' },
    brief: 'Questions & answers: four to six "## " subheadings phrased as the exact questions guests type into Google, each answered in a short paragraph.',
    topic: { en: '', es: '' },
  },
  {
    id: 'itinerary',
    label: { en: 'Day-by-day plan', es: 'Plan día a día' },
    brief: 'A day-by-day plan across the trip, saying which treatment fits which day and why.',
    topic: { en: '', es: '' },
  },
]

export function presetById(list: WriterPreset[], id: string | null): WriterPreset | undefined {
  return id ? list.find((preset) => preset.id === id) : undefined
}
