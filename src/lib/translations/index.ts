/**
 * The whole UI vocabulary, in English and Spanish.
 *
 * Everything a visitor can read that is *not* owner-editable content lives
 * here. Editable content (treatments, tips, the owner story…) is translated by
 * keeping one KV document per language — see `shared/seed.ts` / `seed-es.ts`.
 *
 * Keys are grouped by where they appear. `{name}` placeholders are filled in by
 * `t(key, { name: '…' })`.
 */

export type LanguageCode = 'en' | 'es'

export const LANGUAGES: LanguageCode[] = ['en', 'es']

type Dict = Record<string, string>

/* ------------------------------------------------------------------ english */

const en: Dict = {
  /* nav ------------------------------------------------------------------ */
  'nav.home': 'Home',
  'nav.treatments': 'Treatments',
  'nav.discover': 'Discover Bávaro',
  'nav.team': 'Our team',
  'nav.book': 'Reserve',
  'nav.admin': 'Admin',
  'nav.main': 'Main navigation',
  'nav.explore': 'Explore',
  'nav.payments': 'Ways to pay',
  'nav.open_menu': 'Open menu',
  'nav.close_menu': 'Close menu',

  /* bottom tab bar ------------------------------------------------------- */
  'tab.home': 'Home',
  'tab.treatments': 'Massage',
  'tab.discover': 'Discover',
  'tab.team': 'Team',
  'tab.book': 'Reserve',

  /* generic actions ------------------------------------------------------ */
  'action.whatsapp': 'WhatsApp',
  'action.message_whatsapp': 'Message us on WhatsApp',
  'action.message_on_whatsapp': 'Message on WhatsApp',
  'action.chat_whatsapp': 'Chat with us on WhatsApp',
  'action.view_site': 'View site',
  'action.sign_in': 'Sign in',
  'action.sign_out': 'Sign out',
  'action.save': 'Save changes',
  'action.saving': 'Saving…',
  'action.saved': 'Saved',
  'action.cancel': 'Cancel',
  'action.discard': 'Discard',
  'action.delete': 'Delete',
  'action.edit': 'Edit',
  'action.close': 'Close',
  'action.duplicate': 'Duplicate',
  'action.move_up': 'Move up',
  'action.move_down': 'Move down',
  'action.refresh': 'Refresh',
  'action.restore_defaults': 'Restore defaults',
  'action.yes_restore': 'Yes, restore',
  'action.back_to_site': 'Back to the website',
  'action.loading': 'Loading…',

  /* language ------------------------------------------------------------- */
  'lang.select': 'Select language',
  'lang.en': 'English',
  'lang.es': 'Español',

  /* hero ----------------------------------------------------------------- */
  'hero.rating': '{count} guest reviews',
  'hero.therapists': '{count} certified therapists',
  'hero.where': 'Your room · Your villa · Your terrace',
  'hero.rating_label': 'Guest rating',
  'hero.team_label': 'Team size',
  'hero.where_label': 'Where we work',
  'hero.greet.dawn': 'Buenos días!',
  'hero.greet.day': '¡Hola, sunshine!',
  'hero.greet.dusk': 'Golden hour…',
  'hero.greet.night': 'Buenas noches',

  /* theme ---------------------------------------------------------------- */
  'theme.auto': 'Theme follows the clock (now {now}). Tap for day.',
  'theme.day': 'Day theme. Tap for night.',
  'theme.night': 'Night theme. Tap to follow the clock.',
  'theme.now_day': 'day',
  'theme.now_night': 'night',

  /* blog ----------------------------------------------------------------- */
  'nav.blog': 'Journal',
  'tab.blog': 'Journal',
  'blog.eyebrow': 'The journal',
  'blog.title': 'Notes from',
  'blog.script': 'the shoreline',
  'blog.note': 'written between appointments',
  'blog.all': 'All articles',
  'blog.page_title': 'Island journal',
  'blog.page_lead': 'Tips for your body on a beach holiday, the neighbourhood the way locals know it, and what to expect before you book.',
  'blog.all_topics': 'All topics',
  'blog.empty': 'No articles here yet — check back soon.',
  'blog.read_more': 'Read the article',
  'blog.read_minutes': '{minutes} min read',
  'blog.back': 'All articles',
  'blog.more': 'Keep reading',
  'blog.cta': 'Questions about a treatment? Ask us directly.',

  /* home notes ----------------------------------------------------------- */
  'home.treatments.note': 'we bring the table',
  'home.team.note': 'women-run, since day one',
  'home.discover.note': 'our favourite corners',

  /* home ----------------------------------------------------------------- */
  'home.treatments.eyebrow': 'What we do',
  'home.treatments.title': 'Treatments that suit',
  'home.treatments.script': 'a holiday body',
  'home.treatments.lead':
    'Everything is done with warm oil, fresh linens and pressure you choose. Prices are per person, in US dollars.',
  'home.treatments.all': 'All treatments',

  'home.packages.eyebrow': 'Occasions & bundles',
  'home.packages.title': 'For honeymoons, groups',
  'home.packages.script': 'and whole weeks',
  'home.packages.lead':
    'Fixed prices, no surprises. Every package is set up wherever you are staying — room, villa or terrace.',

  'home.team.eyebrow': 'The hands',
  'home.team.title': 'The women who',
  'home.team.script': 'do this properly',
  'home.team.all': 'Meet everyone',

  'home.discover.eyebrow': 'Your neighbourhood guide',
  'home.discover.title': 'What is actually good',
  'home.discover.script': 'within a short walk',
  'home.discover.lead':
    'We live here. This is the list we give friends — beaches, the restaurants worth leaving the resort for, and the practical things nobody tells you.',
  'home.discover.all': 'Open the guide',

  /* shared sections ------------------------------------------------------ */
  'venues.eyebrow': 'We come to you',
  'venues.title': 'Wherever you',
  'venues.script': 'are staying',
  'venues.lead':
    'The same therapists and the same table whichever you pick — all we need is a couple of metres of floor and somewhere to plug in.',

  'benefits.eyebrow': 'Why bother, on holiday?',
  'benefits.title': 'Because a week goes fast and',
  'benefits.script': 'your body arrived tired',
  'benefits.lead': 'Most guests book once, then come back twice. This is what usually changes.',

  'owner.eyebrow': 'Who you are booking with',
  'owner.title': 'A small business,',
  'owner.script': 'a few pairs of hands',
  'owner.badge_certified': 'Certified therapists',
  'owner.badge_women': 'Women-owned',
  'owner.badge_linens': 'Fresh linens every session',
  'owner.meet_team': 'Meet the team',
  'owner.ask': 'Ask us anything',

  'testimonials.eyebrow': 'Guests, afterwards',
  'testimonials.title': 'The nicest thing about this job is',
  'testimonials.script': 'how people leave',

  'payments.eyebrow': 'Paying is the easy part',
  'payments.title': 'Cash, card, or a link',
  'payments.script': 'before we arrive',
  'payments.lead':
    'Whatever is simplest for you. We send payment links over WhatsApp and never ask for card details in a chat.',
  'payments.open_link': 'Open payment link →',
  'payments.cancellations': 'Cancellations · ',

  'faq.eyebrow': 'Before you write',
  'faq.title': 'Questions we get',
  'faq.script': 'every single week',

  'cta.title': 'Ready when you are.',
  'cta.script': 'Even today.',
  'cta.lead':
    'Tell us the day, the hour and where you are staying. We answer on WhatsApp in minutes and bring everything with us.',
  'cta.form': 'Use the reservation form',

  /* treatments page ------------------------------------------------------ */
  'treatments.kicker': 'Menu & prices',
  'treatments.title': 'Every treatment,',
  'treatments.script': 'every price',
  'treatments.lead':
    'No packages you did not ask for and no upselling on the table. Pick a length, pick a place, and tell us what hurts.',
  'treatments.empty': 'Nothing in this category yet.',
  'treatments.bundles.eyebrow': 'Bundles',
  'treatments.bundles.title': 'Packages worth',
  'treatments.bundles.script': 'the whole week',
  'treatments.bundles.lead':
    'Better value than booking session by session, and the sunset slots are held for you in advance.',

  /* discover page -------------------------------------------------------- */
  'discover.title': 'The guide we give',
  'discover.script': 'our own friends',
  'discover.lead':
    'We live and work on this coast. Here is what is genuinely worth your time around Bávaro and El Cortecito — plus the practical things that make a first trip to the Dominican Republic easier.',
  'discover.walkable': '{count} places within a 10-minute walk',
  'discover.tips': '{count} local tips',
  'discover.search_placeholder': 'Search beaches, food, tips…',
  'discover.search_label': 'Search the guide',
  'discover.clear_search': 'Clear search',
  'discover.count_one': '{count} place',
  'discover.count_other': '{count} places',
  'discover.count_in': ' in {category}',
  'discover.empty_title': 'Nothing matched that.',
  'discover.empty_lead': 'Try a different word, or ask us on WhatsApp — we know the answer.',
  'discover.reset': 'Reset the guide',
  'discover.pairs.eyebrow': 'Plan the day around it',
  'discover.pairs.title': 'Massage pairs well with',
  'discover.pairs.script': 'an excursion day',
  'discover.pairs.lead':
    'Saona, Macao, Hoyo Azul — they are long days on your feet. The evening after is when a massage does the most good, and we work late.',
  'discover.pairs.cta': 'Reserve an evening slot',
  'discover.pairs.secondary': 'See treatments',

  /* team page ------------------------------------------------------------ */
  'team.kicker': 'The people',
  'team.title': 'Dominican women,',
  'team.script': 'one small team',
  'team.lead':
    'We are not an agency and there is no call centre. When you write, you are writing to one of us.',
  'team.badge_certified': 'Certified therapists',
  'team.badge_since': 'Women-owned since 2019',
  'team.badge_languages': '{count} languages between us',
  'team.how.eyebrow': 'How a session actually goes',
  'team.how.title': 'No surprises,',
  'team.how.script': 'ever',
  'team.how.lead':
    'If you have never booked a massage outside a resort spa, here is exactly what happens.',
  'team.step1.title': 'You write on WhatsApp',
  'team.step1.body':
    'Tell us the day, the hour, how many people and where you are staying. We confirm in minutes.',
  'team.step2.title': 'We arrive prepared',
  'team.step2.body':
    'Table, fresh linens, towels, oils and a small speaker. For hotel visits we text when we reach reception.',
  'team.step3.title': 'You set the pressure',
  'team.step3.body':
    'We ask before we start and check during. Draping is used the whole time — say the word and we adjust anything.',
  'team.step4.title': 'Pay however suits you',
  'team.step4.body':
    'Card upfront or when we arrive, cash on the day, or PayPal in advance. Tipping is welcome but never expected.',
  'team.languages': 'Languages we work in',
  'team.speaks': 'Speaks {languages}',

  /* booking page --------------------------------------------------------- */
  'book.from_journey': 'Coming from our suggestion: {journey}. Everything below is already filled in.',
  'book.change_journey': 'Pick something else',
  'book.kicker': 'Reservation',
  'book.title': 'Tell us when,',
  'book.script': 'we bring everything',
  'book.lead':
    'Fill this in and it opens WhatsApp with your details already written out. Or just message us directly — both reach the same phone.',
  'book.step_treatment': 'Which treatment?',
  'book.step_duration': 'How long?',
  'book.step_venue': 'Where should we set up?',
  'book.step_when': 'When suits you?',
  'book.step_details': 'Your details',
  'book.or_package': 'Or a package',
  'book.from': 'from {price}',
  'book.date': 'Date',
  'book.people': 'How many people',
  'book.preferred_time': 'Preferred time',
  'book.name': 'Your name *',
  'book.name_placeholder': 'How should we greet you?',
  'book.hotel': 'Hotel, villa or room number',
  'book.hotel_placeholder': 'e.g. Resort name, building 4, room 212',
  'book.notes': 'Anything we should know?',
  'book.notes_placeholder': 'Injuries, pregnancy, pressure preference, sunburn, a surprise for someone…',
  'book.summary': 'Your request',
  'book.summary_treatment': 'Treatment',
  'book.summary_duration': 'Duration',
  'book.summary_where': 'Where',
  'book.summary_date': 'Date',
  'book.summary_time': 'Time',
  'book.summary_people': 'People',
  'book.pay_label': 'Paying:',
  'book.pay_summary':
    'card upfront through a secure link or on the spot when we arrive, cash on the day, or PayPal in advance. Nothing is due until we have confirmed your time.',
  'book.flexible': 'Flexible',
  'book.estimated': 'Estimated',
  'book.send': 'Send on WhatsApp',
  'book.sending': 'Sending…',
  'book.not_ready': 'Pick a treatment and add your name to continue.',
  'book.sent': 'Request saved — finish the message in WhatsApp and we will confirm.',
  'book.error_suffix': 'You can still send the WhatsApp message.',
  'book.preview': 'Preview the message',
  'book.error_save': 'Could not save the request.',
  'book.minutes': '{minutes} min',

  /* whatsapp message ----------------------------------------------------- */
  'wa.intro': 'Hola {brand}! I would like to reserve a massage.',
  'wa.name': 'Name',
  'wa.treatment': 'Treatment',
  'wa.duration': 'Duration',
  'wa.where': 'Where',
  'wa.hotel': 'Hotel / room',
  'wa.date': 'Date',
  'wa.time': 'Time',
  'wa.people': 'People',
  'wa.notes': 'Notes',

  /* cards ---------------------------------------------------------------- */
  'card.good_for': 'Good for',
  'card.pressure': 'Pressure',
  'card.popular': 'Popular',
  'card.from': 'from {price}',
  'card.reserve': 'Reserve this',
  'card.reserve_package': 'Reserve this package',
  'card.walk': '{minutes} min walk',
  'card.tip': 'Our tip · ',
  'card.map': 'Map',
  'card.stars': '{count} out of 5 stars',

  /* filters -------------------------------------------------------------- */
  'filter.all': 'All',

  /* footer --------------------------------------------------------------- */
  'footer.find_us': 'Find us',
  'footer.disclaimer': 'Therapeutic & relaxation massage only',
  'footer.rights': '© {year} {brand} · {city}, Dominican Republic',

  /* 404 ------------------------------------------------------------------ */
  'notfound.title': 'This page drifted out with the tide.',
  'notfound.lead': 'Nothing here — but the sea is still two minutes away.',
  'notfound.cta': 'Back to the start',
  'notfound.seo': 'Page not found',

  /* admin — shell -------------------------------------------------------- */
  'admin.title': 'Admin',
  'admin.sections': 'Admin sections',
  'admin.overview': 'Overview',
  'admin.overview_short': 'Home',
  'admin.settings': 'Site settings',
  'admin.settings_short': 'Site',
  'admin.bookings': 'Requests',
  'admin.bookings_short': 'Requests',
  'admin.security': 'Password & data',
  'admin.security_short': 'Password',
  'admin.assistant': 'AI assistant',
  'admin.assistant_short': 'Assistant',
  'admin.guide_short': 'Guide',
  'admin.default_password_warning': 'You are still using the default password — tap to change it.',

  /* admin — sign in ------------------------------------------------------ */
  'admin.login.lead':
    'Sign in to edit the website — treatments, prices, the guide, your team and everything else.',
  'admin.login.password': 'Password',
  'admin.login.hint_before': 'First time here? The starting password is',
  'admin.login.hint_after': '— change it under “Password” as soon as you are in.',
  'admin.login.failed': 'Could not sign in.',

  /* admin — overview ----------------------------------------------------- */
  'admin.hello': 'Hola, {name}.',
  'admin.hello_lead': 'Everything on the website is editable here. Changes go live the moment you save.',
  'admin.stat.treatments': 'Treatments',
  'admin.stat.tips': 'Local tips',
  'admin.stat.therapists': 'Therapists',
  'admin.stat.requests': 'New requests',
  'admin.start_here': 'Start here',
  'admin.start.settings': 'Put your real WhatsApp number in Site settings → Contact',
  'admin.start.services': 'Check the treatment prices against what you actually charge',
  'admin.start.team': 'Replace the team names and add photos',
  'admin.start.discover': 'Add the places you personally send guests to',
  'admin.start.security': 'Change the admin password from the default',
  'admin.how_title': 'How editing works',
  'admin.how1': 'Tap any row to open it, edit the fields, then press Save changes in the bar at the bottom.',
  'admin.how2': 'Arrows on the left of each row change the order things appear in on the website.',
  'admin.how3': 'Photos are added by uploading from your phone or pasting a link — leave it empty and we draw tropical artwork instead.',
  'admin.how4': 'Every section has a Restore defaults button if an edit goes wrong.',
  'admin.how_save': 'Save changes',
  'admin.how_restore': 'Restore defaults',

  /* admin — settings / collections --------------------------------------- */
  'admin.settings_lead': 'Your name, your WhatsApp number, the hero, the hours and the small print.',
  'admin.unsaved': 'Unsaved changes',
  'admin.save_error': 'Could not save.',
  'admin.auto_translate': 'Auto-translate',
  'admin.auto_translate_help': 'When on, every save is translated into the other languages automatically. Only what you changed is translated.',
  'admin.translating': 'Saved — translating into the other languages…',
  'admin.saved_translated': 'Saved and translated into {languages}',
  'admin.translate_failed': 'Saved, but the translation did not finish: {reason}. Switch language and check, or save again.',

  /* ai blog writer ------------------------------------------------------- */
  'writer.title': 'AI blog writer',
  'writer.lead': 'Tell it what the article is about in one sentence. It drafts the whole post in your voice — you read it, change anything, and save.',
  'writer.topic': 'What should the article be about?',
  'writer.topic_placeholder': 'e.g. What to do if you get sunburnt the day before your massage',
  'writer.idea1': 'Best massage after an excursion to Saona',
  'writer.idea2': 'How to prepare your room for an in-room massage',
  'writer.idea3': 'Prenatal massage on holiday: what is safe',
  'writer.idea4': 'Five quiet beaches near Bávaro',
  'writer.keywords': 'Phrases to include (optional)',
  'writer.keywords_placeholder': 'hotel room massage Punta Cana, couples massage',
  'writer.tone': 'Tone',
  'writer.tone.warm': 'Warm & personal',
  'writer.tone.practical': 'Practical & clear',
  'writer.tone.playful': 'Playful & sunny',
  'writer.tone.luxurious': 'Calm & luxurious',
  'writer.length': 'Length',
  'writer.length.short': 'Short (~350 words)',
  'writer.length.medium': 'Medium (~600 words)',
  'writer.length.long': 'Long (~1,000 words)',
  'writer.write': 'Write the draft',
  'writer.writing': 'Writing… (about 20 seconds)',
  'writer.again': 'Write another version',
  'writer.error': 'The writer could not finish. Try again in a moment.',
  'writer.draft_in': 'Draft in {language}',
  'writer.preview': 'Preview',
  'writer.edit': 'Edit text',
  'writer.field_title': 'Title',
  'writer.field_excerpt': 'Summary',
  'writer.field_category': 'Category',
  'writer.field_tags': 'Tags, comma separated',
  'writer.field_body': 'Article',
  'writer.publish_now': 'Publish straight away',
  'writer.translate_all': 'Translate into every language',
  'writer.save_draft': 'Save as draft',
  'writer.save_publish': 'Save and publish',
  'writer.saved_draft': 'Saved as a draft — it is in the list below.',
  'writer.published': 'Published on the blog.',
  'writer.translated_into': 'Also written in {languages}.',
  'admin.reset_error': 'Could not reset.',
  'admin.restored_settings': 'Restored the starting settings',
  'admin.restored_content': 'Restored the starting content',
  'admin.confirm_reset_settings': 'Replace every setting with the starting values?',
  'admin.confirm_reset_collection': 'Replace all {label} with the starting content?',
  'admin.add_one': 'Add {singular}',
  'admin.add_first': 'Add the first one',
  'admin.none_yet': 'No {label} yet.',
  'admin.untitled': 'Untitled {singular}',

  /* admin — field editor ------------------------------------------------- */
  'field.nothing_added': 'Nothing added yet.',
  'field.type_enter': 'Type and press Enter',
  'field.add_item': 'Add item',
  'field.remove': 'Remove {name}',
  'field.minutes': 'Minutes',
  'field.price': 'Price',
  'field.add_length': 'Add a length',
  'field.remove_duration': 'Remove duration',
  'field.add_row': 'Add a row',
  'field.remove_row': 'Remove row',
  'field.pair_label_placeholder': 'Monday – Saturday',
  'field.pair_value_placeholder': '9:00 – 21:00',
  'field.on': 'On',
  'field.off': 'Off',
  'field.refs_empty': 'Nothing to link to yet — add a treatment first.',
  'field.upload': 'Upload image',
  'field.upload_title': 'Upload from device',
  'field.upload_failed': 'Failed to upload image: {message}',

  /* admin — bookings ----------------------------------------------------- */
  'admin.bookings_title': 'Reservation requests',
  'admin.bookings_lead':
    'Everything sent through the form on the website. Requests are kept for six months.',
  'admin.bookings_empty': 'No requests yet. They appear here the moment someone uses the reservation form.',
  'admin.bookings_load_error': 'Could not load requests.',
  'admin.bookings_update_error': 'Could not update.',
  'admin.delete_request': 'Delete request',
  'status.new': 'New',
  'status.confirmed': 'Confirmed',
  'status.done': 'Done',
  'status.cancelled': 'Cancelled',

  /* admin — security ----------------------------------------------------- */
  'admin.security_lead':
    'The admin password protects everything on this page. Change it from the default before you share the site.',
  'admin.security_warning_title': 'You are still using the default password.',
  'admin.security_warning_body_before': 'Anyone who guesses',
  'admin.security_warning_body_after':
    'can edit the whole website. Set a new one below — it takes ten seconds.',
  'admin.change_password': 'Change the password',
  'admin.current_password': 'Current password',
  'admin.new_password': 'New password',
  'admin.repeat_password': 'Repeat the new password',
  'admin.update_password': 'Update password',
  'admin.password_changed': 'Password changed. Use the new one next time you sign in.',
  'admin.password_too_short': 'Choose a password of at least 4 characters.',
  'admin.password_mismatch': 'The two new passwords do not match.',
  'admin.password_error': 'Could not change the password.',
  'admin.restore_all_title': 'Restore all starting content',
  'admin.restore_all_lead':
    'Replaces every treatment, tip, review and setting with the content the site shipped with. Reservation requests and your password are not touched.',
  'admin.restore_all_cta': 'Restore everything',
  'admin.restore_all_confirm': 'Yes, replace everything',

  /* admin — AI assistant ------------------------------------------------- */
  'ai.title': 'Guided assistant',
  'ai.subtitle': 'Talk or type — it updates the website for you',
  'ai.lead':
    'Start a conversation and the assistant walks you through everything on the site, one question at a time. It writes the wording, saves the changes and translates them into the other language for you.',
  'ai.start': 'Start the conversation',
  'ai.finish': 'Finish the conversation',
  'ai.live': 'Conversation is live',
  'ai.idle': 'Conversation is off',
  'ai.mic_on': 'Stop the microphone',
  'ai.mic_off': 'Speak',
  'ai.listening': 'Listening… speak now',
  'ai.transcribing': 'Writing down what you said…',
  'ai.thinking': 'Thinking…',
  'ai.tap_mic': 'Tap the microphone, or type below',
  'ai.input_placeholder': 'Type your answer…',
  'ai.send': 'Send',
  'ai.mute': 'Mute the voice',
  'ai.unmute': 'Read answers aloud',
  'ai.greeting':
    'Hola! I can update anything on the website with you — treatments and prices, the team, the guide, your hours, the small print. Tell me what you would like to change, or say “give me a tour” and I will go through it section by section.',
  'ai.closing':
    'That is everything saved. Here is what still needs your hands — the assistant cannot do these for you.',
  'ai.applied': 'Saved: {summary}',
  'ai.apply_failed': 'Could not save that change: {message}',
  'ai.translated': 'Translated into {language} as well.',
  'ai.translating': 'Translating into the other language…',
  'ai.manual_title': 'Left for you to do by hand',
  'ai.manual_none': 'Nothing left by hand — every change is live.',
  'ai.manual_photo': 'Upload a photo for “{name}” in {section}.',
  'ai.changes_title': 'Changes made in this conversation',
  'ai.no_changes': 'Nothing changed yet.',
  'ai.error': 'Sorry — that did not go through. Try again in a moment.',
  'ai.unsupported_mic':
    'This browser will not give the page a microphone. You can still type, and everything works the same.',
  'ai.mic_denied': 'The microphone was blocked. Allow it in your browser settings, or just type instead.',
  'ai.review': 'Review',
  'ai.confirm': 'Yes, save it',
  'ai.reject': 'No, change it',
  'ai.section_label': 'Working on',
  'ai.reset': 'Start over',

  /* map ------------------------------------------------------------------ */
  'map.eyebrow': 'Where we work',
  'map.title': 'All over',
  'map.script': 'this coast',
  'map.lead': 'We travel across {neighborhood} and the rest of Bávaro and Punta Cana. Message us and tell us where you are staying.',
  'map.open': 'Open in Google Maps',

  /* misc ----------------------------------------------------------------- */
  'seo.home_suffix': 'Massage in {neighborhood}, {city}',
  'seo.catalog': 'Massage treatments',
  'error.content_load': 'Could not load the site content.',
  'error.unknown': 'Something went wrong.',
  'a11y.loading': 'Loading',

  /* find your massage — the guided concierge --------------------------- */
  'find.kicker': 'No massage vocabulary required',
  'find.title': 'Find your',
  'find.script': 'massage',
  'find.lead':
    'Tell us what kind of day you are having and we will suggest something lovely. Three questions, about twenty seconds.',
  'find.start': 'Start',
  'find.intro_note': 'Already know what you want? See every treatment.',
  'find.step_of': 'Step {current} of {total}',
  'find.back': 'Back',
  'find.restart': 'Start again',
  'find.skip': 'Skip this',
  'find.progress': 'Progress through the questions',

  'find.q_moment': 'What kind of day are you having?',
  'find.q_moment_sub': 'Pick whichever is closest. There is no wrong answer.',
  'find.moment.just-arrived': 'I just arrived',
  'find.moment.just-arrived.sub': 'My body is still traveling.',
  'find.moment.after-adventure': 'I had an adventure',
  'find.moment.after-adventure.sub': 'ATV, boat, snorkelling, golf, hiking…',
  'find.moment.switch-off': 'I just want to switch off',
  'find.moment.switch-off.sub': 'No agenda. Just relax.',
  'find.moment.targeted': 'My neck, shoulders or back need attention',
  'find.moment.targeted.sub': 'I know exactly where I feel it.',
  'find.moment.celebrating': 'We are celebrating',
  'find.moment.celebrating.sub': 'Honeymoon, anniversary, special evening.',
  'find.moment.with-someone': 'I am travelling with someone',
  'find.moment.with-someone.sub': 'Couple, friend, family.',
  'find.moment.gentle': 'I would like something gentle',
  'find.moment.gentle.sub': 'Comfort over intensity.',
  'find.moment.expecting': 'I am expecting',
  'find.moment.expecting.sub': 'Prenatal-focused care.',
  'find.moment.unsure': 'I am not sure',
  'find.moment.unsure.sub': 'Help me choose.',

  'find.q_feel': 'How should it feel?',
  'find.q_feel_sub': 'You can change your mind on the table at any time.',
  'find.feel.gentle': 'Very gentle',
  'find.feel.gentle.sub': 'Light pressure throughout.',
  'find.feel.relaxing': 'Slow and relaxing',
  'find.feel.relaxing.sub': 'Warm, flowing, unhurried.',
  'find.feel.balanced': 'Balanced',
  'find.feel.balanced.sub': 'Somewhere in the middle.',
  'find.feel.firm': 'Firm and focused',
  'find.feel.firm.sub': 'Real pressure where it aches.',
  'find.feel.surprise': 'Surprise me',
  'find.feel.surprise.sub': 'You choose — you do this all day.',

  'find.q_venue': 'Where should we set up?',
  'find.q_venue_sub': 'We come to you and bring the table, the oils and the music.',
  'find.venue.room': 'Your hotel room',
  'find.venue.room.sub': 'Beside the bed, air conditioning on.',
  'find.venue.villa': 'Your villa or apartment',
  'find.venue.villa.sub': 'More floor space, easy for two tables.',
  'find.venue.terrace': 'Your terrace or balcony',
  'find.venue.terrace.sub': 'Open air, still your own space.',

  'find.q_comfort': 'One little comfort check…',
  'find.q_comfort_sub':
    'Only so we suggest something that is right for you today. Tick anything that applies — or nothing at all.',
  'find.comfort_privacy':
    'This stays on your phone. It is not saved, not sent with your booking, and not shared with anyone.',
  'find.comfort_none': 'None of these',
  'find.comfort_continue': 'Continue',
  'find.concern.pregnant': 'I am pregnant',
  'find.concern.recent-surgery': 'I have had surgery recently',
  'find.concern.acute-injury': 'I have a fresh injury',
  'find.concern.blood-thinners': 'I take blood thinners',
  'find.concern.fever': 'I have a fever or feel unwell',
  'find.concern.swelling': 'I have swelling I cannot explain',
  'find.concern.sunburn': 'I am sunburned or overheated',
  'find.concern.intoxicated': 'I have been drinking',

  'find.result_kicker': 'For you, today',
  'find.result_lead': 'Here is what we would suggest.',
  'find.because': 'Because {reasons} — this one is a lovely fit.',
  'find.because.just-arrived': 'you have just arrived',
  'find.because.after-adventure': 'you have been out adventuring',
  'find.because.switch-off': 'you want to switch off',
  'find.because.targeted': 'you know where it aches',
  'find.because.celebrating': 'you are celebrating',
  'find.because.with-someone': 'you are travelling together',
  'find.because.gentle': 'you would like something gentle',
  'find.because.expecting': 'you are expecting',
  'find.because.unsure': 'you would like us to choose',
  'find.because_feel.gentle': 'you want it very gentle',
  'find.because_feel.relaxing': 'you want it slow and relaxing',
  'find.because_feel.balanced': 'you want it balanced',
  'find.because_feel.firm': 'you want it firm',
  'find.because_venue.room': 'you would rather stay in your room',
  'find.because_venue.villa': 'you have the space at your villa',
  'find.because_venue.terrace': 'you want to be out in the open air',
  'find.because_care': 'you asked us to keep it gentle',
  'find.because_prenatal': 'this one is given by a therapist trained for pregnancy',

  'find.why': 'Why this fits',
  'find.what': 'What we will do',
  'find.good_for': 'Good for',
  'find.duration': 'Length',
  'find.where': 'Where',
  'find.minutes': '{minutes} min',
  'find.from': 'from {price}',
  'find.based_on': 'This is our {service}.',
  'find.cta_book': 'Book this massage',
  'find.cta_another': 'Show me another option',
  'find.cta_all': 'See all treatments',
  'find.alt_title': 'Or one of these',
  'find.fallback_note':
    'Nothing matched perfectly, so here are the ones our guests love most. Message us and we will help you choose.',

  'find.all_title': 'Every journey we offer',
  'find.all_lead':
    'Each one is a real massage from our treatment list, chosen for a particular kind of day. Answer the questions above and we will point you at the right one — or read through them and pick for yourself.',
  'find.rest_title': 'Take care of yourself first.',
  'find.rest_body':
    'This sounds like one of those moments when rest, fluids, cooling down or a doctor matters more than a massage. Once you are feeling well again we would love to help you unwind.',
  'find.rest_cta': 'Message us when you are feeling better',
  'find.rest_back': 'Change my answers',

  'find.care_title': 'Let us talk first.',
  'find.care_body':
    'What you told us is worth a quick conversation with a therapist before we book anything — and with your own doctor where that matters. Below is what we would gently suggest in the meantime.',
  'find.care_cta': 'Ask us about this on WhatsApp',

  'find.quick_paths': 'Or start from one of these',
  'find.home_kicker': 'Not sure what to book?',
  'find.home_title': 'Tell us about your day',
  'find.home_lead':
    'Answer three quick questions and we will suggest the massage that suits the day you are actually having.',
  'find.home_cta': 'Find your massage',
  'find.treatments_prompt': 'Not sure what to choose?',
  'find.treatments_lead': 'Tell us about your day and we will suggest something.',
  'find.seo_description':
    'Answer three quick questions — how your day has gone, how you want it to feel, and where — and we will suggest the right massage for you in Bávaro, Punta Cana.',

}

/* ------------------------------------------------------------------ spanish */


const dictionaries: Partial<Record<LanguageCode, Dict>> = { en }

/** Fetches a language's dictionary once. English is always bundled. */
export async function loadLanguage(code: LanguageCode): Promise<void> {
  if (dictionaries[code]) return
  if (code === 'es') dictionaries.es = (await import('./es')).es
}

export function isLanguageLoaded(code: LanguageCode): boolean {
  return Boolean(dictionaries[code])
}

/** Every key the dictionary knows — handy for a completeness test. */
export const translationKeys = Object.keys(en)

export type TranslateVars = Record<string, string | number>

function interpolate(template: string, vars?: TranslateVars): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  )
}

/**
 * Look a key up. Missing Spanish falls back to English rather than showing the
 * raw key — a half-translated page still reads.
 */
export function t(key: string, lang: LanguageCode = 'en', vars?: TranslateVars): string {
  const value = dictionaries[lang]?.[key] ?? en[key] ?? key
  return interpolate(value, vars)
}

export function isSupportedLanguage(code: string): code is LanguageCode {
  return code === 'en' || code === 'es'
}

export function getLanguageDisplayName(code: LanguageCode): string {
  return code === 'en' ? 'English' : 'Español'
}

export function otherLanguage(code: LanguageCode): LanguageCode {
  return code === 'en' ? 'es' : 'en'
}

export function toggleLanguage(current: LanguageCode): LanguageCode {
  return otherLanguage(current)
}

/** BCP-47 tag for speech recognition, `lang` attributes and `Intl`. */
export function localeTag(code: LanguageCode): string {
  return code === 'es' ? 'es-DO' : 'en-US'
}
