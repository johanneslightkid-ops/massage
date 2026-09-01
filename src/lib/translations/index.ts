/**
 * Translation system with English and Spanish support.
 * Auto-translates content using Google Translate API (free tier) or Cloudflare AI.
 */

export type LanguageCode = 'en' | 'es';

export interface Translation {
  key: string;
  en: string;
  es: string;
}

// Core UI translations
export const uiTranslations: Record<string, Translation> = {
  // Navigation
  'nav.home': { key: 'nav.home', en: 'Home', es: 'Inicio' },
  'nav.treatments': { key: 'nav.treatments', en: 'Treatments', es: 'Tratamientos' },
  'nav.discover': { key: 'nav.discover', en: 'Discover Bávaro', es: 'Descubre Bávaro' },
  'nav.team': { key: 'nav.team', en: 'Our team', es: 'Nuestro equipo' },
  'nav.book': { key: 'nav.book', en: 'Reserve', es: 'Reservar' },
  'nav.admin': { key: 'nav.admin', en: 'Admin', es: 'Administración' },
  
  // Common actions
  'action.book_now': { key: 'action.book_now', en: 'Book Now', es: 'Reservar ahora' },
  'action.learn_more': { key: 'action.learn_more', en: 'Learn More', es: 'Más información' },
  'action.contact_us': { key: 'action.contact_us', en: 'Contact Us', es: 'Contáctanos' },
  'action.whatsapp': { key: 'action.whatsapp', en: 'WhatsApp', es: 'WhatsApp' },
  'action.message_whatsapp': { key: 'action.message_whatsapp', en: 'Message us on WhatsApp', es: 'Envíanos un mensaje por WhatsApp' },
  'action.view_site': { key: 'action.view_site', en: 'View site', es: 'Ver sitio' },
  'action.sign_out': { key: 'action.sign_out', en: 'Sign out', es: 'Cerrar sesión' },
  'action.save': { key: 'action.save', en: 'Save', es: 'Guardar' },
  'action.cancel': { key: 'action.cancel', en: 'Cancel', es: 'Cancelar' },
  'action.delete': { key: 'action.delete', en: 'Delete', es: 'Eliminar' },
  'action.edit': { key: 'action.edit', en: 'Edit', es: 'Editar' },
  'action.add_new': { key: 'action.add_new', en: 'Add new', es: 'Agregar nuevo' },
  
  // Language toggle
  'lang.en': { key: 'lang.en', en: 'EN', es: 'EN' },
  'lang.es': { key: 'lang.es', en: 'ES', es: 'ES' },
  'lang.select': { key: 'lang.select', en: 'Select language', es: 'Seleccionar idioma' },
  
  // Hero section
  'hero.kicker': { key: 'hero.kicker', en: 'Welcome to paradise', es: 'Bienvenido al paraíso' },
  'hero.cta_primary': { key: 'hero.cta_primary', en: 'Book your session', es: 'Reserva tu sesión' },
  'hero.cta_secondary': { key: 'hero.cta_secondary', en: 'Explore treatments', es: 'Explorar tratamientos' },
  
  // Booking
  'booking.title': { key: 'booking.title', en: 'Book Your Session', es: 'Reserva Tu Sesión' },
  'booking.name': { key: 'booking.name', en: 'Your Name', es: 'Tu Nombre' },
  'booking.contact': { key: 'booking.contact', en: 'Contact Information', es: 'Información de Contacto' },
  'booking.service': { key: 'booking.service', en: 'Select Service', es: 'Seleccionar Servicio' },
  'booking.date': { key: 'booking.date', en: 'Preferred Date', es: 'Fecha Preferida' },
  'booking.time': { key: 'booking.time', en: 'Preferred Time', es: 'Hora Preferida' },
  'booking.submit': { key: 'booking.submit', en: 'Request Booking', es: 'Solicitar Reserva' },
  'booking.success': { key: 'booking.success', en: 'Booking request sent! We will contact you soon.', es: '¡Solicitud de reserva enviada! Te contactaremos pronto.' },
  
  // Admin
  'admin.overview': { key: 'admin.overview', en: 'Overview', es: 'Resumen' },
  'admin.settings': { key: 'admin.settings', en: 'Site settings', es: 'Configuración del sitio' },
  'admin.treatments': { key: 'admin.treatments', en: 'Treatments', es: 'Tratamientos' },
  'admin.team': { key: 'admin.team', en: 'Team', es: 'Equipo' },
  'admin.discover': { key: 'admin.discover', en: 'Discover', es: 'Descubrir' },
  'admin.bookings': { key: 'admin.bookings', en: 'Requests', es: 'Solicitudes' },
  'admin.security': { key: 'admin.security', en: 'Password & data', es: 'Contraseña y datos' },
  'admin.ai_assistant': { key: 'admin.ai_assistant', en: 'AI Assistant', es: 'Asistente IA' },
  'admin.map_settings': { key: 'admin.map_settings', en: 'Google Maps', es: 'Google Maps' },
  
  // AI Assistant
  'ai.greeting': { key: 'ai.greeting', en: 'Hello! I\'m your AI assistant. How can I help you today?', es: '¡Hola! Soy tu asistente de IA. ¿Cómo puedo ayudarte hoy?' },
  'ai.listening': { key: 'ai.listening', en: 'Listening...', es: 'Escuchando...' },
  'ai.processing': { key: 'ai.processing', en: 'Processing...', es: 'Procesando...' },
  'ai.speak_now': { key: 'ai.speak_now', en: 'Speak now', es: 'Habla ahora' },
  'ai.click_mic': { key: 'ai.click_mic', en: 'Click the microphone to speak', es: 'Haz clic en el micrófono para hablar' },
};

/**
 * Get translation for a key in the specified language
 */
export function t(key: string, lang: LanguageCode = 'en'): string {
  if (lang === 'en') {
    return uiTranslations[key]?.en || key;
  }
  return uiTranslations[key]?.es || key;
}

/**
 * Get all UI translations for a specific language
 */
export function getUiTranslations(lang: LanguageCode = 'en'): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, translation] of Object.entries(uiTranslations)) {
    result[key] = lang === 'en' ? translation.en : translation.es;
  }
  return result;
}

/**
 * Check if a language code is supported
 */
export function isSupportedLanguage(code: string): code is LanguageCode {
  return code === 'en' || code === 'es';
}

/**
 * Get the display name for a language
 */
export function getLanguageDisplayName(code: LanguageCode): string {
  return code === 'en' ? 'English' : 'Español';
}

/**
 * Toggle between languages
 */
export function toggleLanguage(current: LanguageCode): LanguageCode {
  return current === 'en' ? 'es' : 'en';
}
