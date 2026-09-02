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
  'hero.where': 'Studio · Beach · Your hotel room',
  'hero.rating_label': 'Guest rating',
  'hero.team_label': 'Team size',
  'hero.where_label': 'Where we work',

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
    'Fixed prices, no surprises. Every package can be moved to the beach, the studio or your room.',

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
  'venues.eyebrow': 'Three ways to be massaged',
  'venues.title': 'Come to us, or',
  'venues.script': 'we come to you',
  'venues.lead':
    'The same therapists and the same table wherever you are — the only difference is the soundtrack.',

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
    'We live and work on this beach. Here is what is genuinely worth your time within a short walk of the studio — plus the practical things that make a first trip to the Dominican Republic easier.',
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
  'team.script': 'one small studio',
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
    'Tell us the day, the hour, how many people, and whether you want the studio, the beach or your room. We confirm in minutes.',
  'team.step2.title': 'We arrive prepared',
  'team.step2.body':
    'Table, fresh linens, towels, oils and a small speaker. For hotel visits we text when we reach reception.',
  'team.step3.title': 'You set the pressure',
  'team.step3.body':
    'We ask before we start and check during. Draping is used the whole time — say the word and we adjust anything.',
  'team.step4.title': 'Pay however suits you',
  'team.step4.body':
    'Cash, card in the studio, or a Stripe, PayPal or Azul link over WhatsApp. Tipping is welcome but never expected.',
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
  'notfound.lead': 'Nothing here — but the beach is still two minutes away.',
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
  'map.eyebrow': 'Find the studio',
  'map.title': 'Two minutes from',
  'map.script': 'the sand',
  'map.lead': 'We are behind the beach path in {neighborhood}. Message us and we will send a pin.',
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

  'find.q_venue': 'Where would you like your little escape?',
  'find.q_venue_sub': 'We bring the table, the oils and the music.',
  'find.venue.hotel': 'Your hotel room',
  'find.venue.hotel.sub': 'We come to you, anywhere in Bávaro.',
  'find.venue.beach': 'The beach',
  'find.venue.beach.sub': 'Our table, in the shade, by the water.',
  'find.venue.studio': 'Our studio',
  'find.venue.studio.sub': 'Two minutes from the sand in Los Corales.',

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
  'find.because_venue.hotel': 'you would rather stay in your room',
  'find.because_venue.beach': 'you want to be on the sand',
  'find.because_venue.studio': 'you are happy to come to the studio',
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

const es: Dict = {
  /* nav ------------------------------------------------------------------ */
  'nav.home': 'Inicio',
  'nav.treatments': 'Tratamientos',
  'nav.discover': 'Descubre Bávaro',
  'nav.team': 'Nuestro equipo',
  'nav.book': 'Reservar',
  'nav.admin': 'Administración',
  'nav.main': 'Navegación principal',
  'nav.explore': 'Explora',
  'nav.payments': 'Formas de pago',
  'nav.open_menu': 'Abrir el menú',
  'nav.close_menu': 'Cerrar el menú',

  /* bottom tab bar ------------------------------------------------------- */
  'tab.home': 'Inicio',
  'tab.treatments': 'Masajes',
  'tab.discover': 'Descubre',
  'tab.team': 'Equipo',
  'tab.book': 'Reservar',

  /* generic actions ------------------------------------------------------ */
  'action.whatsapp': 'WhatsApp',
  'action.message_whatsapp': 'Escríbenos por WhatsApp',
  'action.message_on_whatsapp': 'Escribir por WhatsApp',
  'action.chat_whatsapp': 'Chatea con nosotras por WhatsApp',
  'action.view_site': 'Ver el sitio',
  'action.sign_in': 'Entrar',
  'action.sign_out': 'Cerrar sesión',
  'action.save': 'Guardar cambios',
  'action.saving': 'Guardando…',
  'action.saved': 'Guardado',
  'action.cancel': 'Cancelar',
  'action.discard': 'Descartar',
  'action.delete': 'Eliminar',
  'action.edit': 'Editar',
  'action.close': 'Cerrar',
  'action.duplicate': 'Duplicar',
  'action.move_up': 'Subir',
  'action.move_down': 'Bajar',
  'action.refresh': 'Actualizar',
  'action.restore_defaults': 'Restaurar valores iniciales',
  'action.yes_restore': 'Sí, restaurar',
  'action.back_to_site': 'Volver al sitio web',
  'action.loading': 'Cargando…',

  /* language ------------------------------------------------------------- */
  'lang.select': 'Seleccionar idioma',
  'lang.en': 'English',
  'lang.es': 'Español',

  /* hero ----------------------------------------------------------------- */
  'hero.rating': '{count} reseñas de huéspedes',
  'hero.therapists': '{count} terapeutas certificadas',
  'hero.where': 'Estudio · Playa · Tu habitación',
  'hero.rating_label': 'Valoración de huéspedes',
  'hero.team_label': 'Tamaño del equipo',
  'hero.where_label': 'Dónde trabajamos',

  /* home ----------------------------------------------------------------- */
  'home.treatments.eyebrow': 'Lo que hacemos',
  'home.treatments.title': 'Masajes pensados para',
  'home.treatments.script': 'un cuerpo de vacaciones',
  'home.treatments.lead':
    'Todo con aceite tibio, sábanas limpias y la presión que tú elijas. Los precios son por persona, en dólares estadounidenses.',
  'home.treatments.all': 'Todos los tratamientos',

  'home.packages.eyebrow': 'Ocasiones y paquetes',
  'home.packages.title': 'Para lunas de miel, grupos',
  'home.packages.script': 'y semanas enteras',
  'home.packages.lead':
    'Precios cerrados, sin sorpresas. Cualquier paquete se puede hacer en la playa, en el estudio o en tu habitación.',

  'home.team.eyebrow': 'Las manos',
  'home.team.title': 'Las mujeres que',
  'home.team.script': 'lo hacen bien',
  'home.team.all': 'Conócelas a todas',

  'home.discover.eyebrow': 'Tu guía del barrio',
  'home.discover.title': 'Lo que de verdad vale la pena',
  'home.discover.script': 'a pocos pasos',
  'home.discover.lead':
    'Vivimos aquí. Esta es la lista que le damos a nuestros amigos — playas, los restaurantes por los que sí vale la pena salir del resort y las cosas prácticas que nadie te cuenta.',
  'home.discover.all': 'Abrir la guía',

  /* shared sections ------------------------------------------------------ */
  'venues.eyebrow': 'Tres formas de recibir tu masaje',
  'venues.title': 'Ven a vernos, o',
  'venues.script': 'vamos nosotras',
  'venues.lead':
    'Las mismas terapeutas y la misma camilla estés donde estés — lo único que cambia es el sonido de fondo.',

  'benefits.eyebrow': '¿Por qué, estando de vacaciones?',
  'benefits.title': 'Porque la semana vuela y',
  'benefits.script': 'tu cuerpo llegó cansado',
  'benefits.lead':
    'La mayoría reserva una vez y vuelve dos. Esto es lo que suele cambiar.',

  'owner.eyebrow': 'Con quién estás reservando',
  'owner.title': 'Un negocio pequeño,',
  'owner.script': 'unas pocas manos',
  'owner.badge_certified': 'Terapeutas certificadas',
  'owner.badge_women': 'Dirigido por mujeres',
  'owner.badge_linens': 'Sábanas limpias en cada sesión',
  'owner.meet_team': 'Conoce al equipo',
  'owner.ask': 'Pregúntanos lo que quieras',

  'testimonials.eyebrow': 'Los huéspedes, después',
  'testimonials.title': 'Lo mejor de este trabajo es',
  'testimonials.script': 'cómo se va la gente',

  'payments.eyebrow': 'Pagar es lo fácil',
  'payments.title': 'Efectivo, tarjeta o un enlace',
  'payments.script': 'antes de llegar',
  'payments.lead':
    'Lo que te resulte más sencillo. Enviamos enlaces de pago por WhatsApp y nunca pedimos datos de tarjeta por chat.',
  'payments.open_link': 'Abrir el enlace de pago →',
  'payments.cancellations': 'Cancelaciones · ',

  'faq.eyebrow': 'Antes de escribirnos',
  'faq.title': 'Preguntas que nos hacen',
  'faq.script': 'todas las semanas',

  'cta.title': 'Cuando tú quieras.',
  'cta.script': 'Incluso hoy.',
  'cta.lead':
    'Dinos el día, la hora y dónde te alojas. Respondemos por WhatsApp en minutos y llevamos todo con nosotras.',
  'cta.form': 'Usar el formulario de reserva',

  /* treatments page ------------------------------------------------------ */
  'treatments.kicker': 'Carta y precios',
  'treatments.title': 'Cada tratamiento,',
  'treatments.script': 'cada precio',
  'treatments.lead':
    'Sin paquetes que no pediste y sin venderte nada sobre la camilla. Elige la duración, elige el lugar y dinos qué te duele.',
  'treatments.empty': 'Todavía no hay nada en esta categoría.',
  'treatments.bundles.eyebrow': 'Paquetes',
  'treatments.bundles.title': 'Paquetes que valen',
  'treatments.bundles.script': 'la semana entera',
  'treatments.bundles.lead':
    'Sale mejor que reservar sesión por sesión, y te guardamos los horarios del atardecer por adelantado.',

  /* discover page -------------------------------------------------------- */
  'discover.title': 'La guía que le damos',
  'discover.script': 'a nuestras amigas',
  'discover.lead':
    'Vivimos y trabajamos en esta playa. Esto es lo que de verdad vale tu tiempo a pocos pasos del estudio — más las cosas prácticas que hacen más fácil un primer viaje a la República Dominicana.',
  'discover.walkable': '{count} lugares a menos de 10 minutos a pie',
  'discover.tips': '{count} consejos locales',
  'discover.search_placeholder': 'Busca playas, comida, consejos…',
  'discover.search_label': 'Buscar en la guía',
  'discover.clear_search': 'Borrar la búsqueda',
  'discover.count_one': '{count} lugar',
  'discover.count_other': '{count} lugares',
  'discover.count_in': ' en {category}',
  'discover.empty_title': 'No encontramos nada así.',
  'discover.empty_lead': 'Prueba con otra palabra, o pregúntanos por WhatsApp — nosotras sabemos.',
  'discover.reset': 'Reiniciar la guía',
  'discover.pairs.eyebrow': 'Organiza el día alrededor',
  'discover.pairs.title': 'El masaje combina bien con',
  'discover.pairs.script': 'un día de excursión',
  'discover.pairs.lead':
    'Saona, Macao, Hoyo Azul — son días largos de pie. La tarde siguiente es cuando un masaje hace más bien, y trabajamos hasta tarde.',
  'discover.pairs.cta': 'Reservar un horario de tarde',
  'discover.pairs.secondary': 'Ver tratamientos',

  /* team page ------------------------------------------------------------ */
  'team.kicker': 'Las personas',
  'team.title': 'Mujeres dominicanas,',
  'team.script': 'un estudio pequeño',
  'team.lead':
    'No somos una agencia ni tenemos un centro de llamadas. Cuando escribes, le escribes a una de nosotras.',
  'team.badge_certified': 'Terapeutas certificadas',
  'team.badge_since': 'Dirigido por mujeres desde 2019',
  'team.badge_languages': '{count} idiomas entre nosotras',
  'team.how.eyebrow': 'Cómo es una sesión de verdad',
  'team.how.title': 'Sin sorpresas,',
  'team.how.script': 'nunca',
  'team.how.lead':
    'Si nunca has reservado un masaje fuera del spa de un resort, esto es exactamente lo que pasa.',
  'team.step1.title': 'Nos escribes por WhatsApp',
  'team.step1.body':
    'Dinos el día, la hora, cuántas personas y si prefieres el estudio, la playa o tu habitación. Confirmamos en minutos.',
  'team.step2.title': 'Llegamos con todo',
  'team.step2.body':
    'Camilla, sábanas limpias, toallas, aceites y una bocina pequeña. En los hoteles te escribimos al llegar a recepción.',
  'team.step3.title': 'Tú decides la presión',
  'team.step3.body':
    'Preguntamos antes de empezar y comprobamos durante la sesión. Usamos toalla de cobertura todo el tiempo — dilo y ajustamos lo que sea.',
  'team.step4.title': 'Pagas como prefieras',
  'team.step4.body':
    'Efectivo, tarjeta en el estudio, o un enlace de Stripe, PayPal o Azul por WhatsApp. La propina se agradece, pero nunca se espera.',
  'team.languages': 'Idiomas en los que trabajamos',
  'team.speaks': 'Habla {languages}',

  /* booking page --------------------------------------------------------- */
  'book.from_journey': 'Viene de nuestra sugerencia: {journey}. Abajo ya está todo puesto.',
  'book.change_journey': 'Elegir otra cosa',
  'book.kicker': 'Reserva',
  'book.title': 'Dinos cuándo,',
  'book.script': 'nosotras llevamos todo',
  'book.lead':
    'Rellena esto y se abrirá WhatsApp con tus datos ya escritos. O escríbenos directamente — ambos llegan al mismo teléfono.',
  'book.step_treatment': '¿Qué tratamiento?',
  'book.step_duration': '¿Cuánto tiempo?',
  'book.step_venue': '¿Dónde montamos la camilla?',
  'book.step_when': '¿Cuándo te viene bien?',
  'book.step_details': 'Tus datos',
  'book.or_package': 'O un paquete',
  'book.from': 'desde {price}',
  'book.date': 'Fecha',
  'book.people': 'Cuántas personas',
  'book.preferred_time': 'Hora preferida',
  'book.name': 'Tu nombre *',
  'book.name_placeholder': '¿Cómo te saludamos?',
  'book.hotel': 'Hotel, villa o número de habitación',
  'book.hotel_placeholder': 'ej. Nombre del resort, edificio 4, habitación 212',
  'book.notes': '¿Algo que debamos saber?',
  'book.notes_placeholder':
    'Lesiones, embarazo, preferencia de presión, quemaduras de sol, una sorpresa para alguien…',
  'book.summary': 'Tu solicitud',
  'book.summary_treatment': 'Tratamiento',
  'book.summary_duration': 'Duración',
  'book.summary_where': 'Dónde',
  'book.summary_date': 'Fecha',
  'book.summary_time': 'Hora',
  'book.summary_people': 'Personas',
  'book.flexible': 'Flexible',
  'book.estimated': 'Estimado',
  'book.send': 'Enviar por WhatsApp',
  'book.sending': 'Enviando…',
  'book.not_ready': 'Elige un tratamiento y escribe tu nombre para continuar.',
  'book.sent': 'Solicitud guardada — termina el mensaje en WhatsApp y te confirmamos.',
  'book.error_suffix': 'Aun así puedes enviar el mensaje de WhatsApp.',
  'book.preview': 'Ver el mensaje',
  'book.error_save': 'No pudimos guardar la solicitud.',
  'book.minutes': '{minutes} min',

  /* whatsapp message ----------------------------------------------------- */
  'wa.intro': '¡Hola {brand}! Me gustaría reservar un masaje.',
  'wa.name': 'Nombre',
  'wa.treatment': 'Tratamiento',
  'wa.duration': 'Duración',
  'wa.where': 'Dónde',
  'wa.hotel': 'Hotel / habitación',
  'wa.date': 'Fecha',
  'wa.time': 'Hora',
  'wa.people': 'Personas',
  'wa.notes': 'Notas',

  /* cards ---------------------------------------------------------------- */
  'card.popular': 'Popular',
  'card.from': 'desde {price}',
  'card.reserve': 'Reservar este',
  'card.reserve_package': 'Reservar este paquete',
  'card.walk': '{minutes} min a pie',
  'card.tip': 'Nuestro consejo · ',
  'card.map': 'Mapa',
  'card.stars': '{count} de 5 estrellas',

  /* filters -------------------------------------------------------------- */
  'filter.all': 'Todo',

  /* footer --------------------------------------------------------------- */
  'footer.find_us': 'Encuéntranos',
  'footer.disclaimer': 'Solo masaje terapéutico y de relajación',
  'footer.rights': '© {year} {brand} · {city}, República Dominicana',

  /* 404 ------------------------------------------------------------------ */
  'notfound.title': 'Esta página se fue con la marea.',
  'notfound.lead': 'Aquí no hay nada — pero la playa sigue a dos minutos.',
  'notfound.cta': 'Volver al inicio',
  'notfound.seo': 'Página no encontrada',

  /* admin — shell -------------------------------------------------------- */
  'admin.title': 'Administración',
  'admin.sections': 'Secciones de administración',
  'admin.overview': 'Resumen',
  'admin.overview_short': 'Inicio',
  'admin.settings': 'Configuración del sitio',
  'admin.settings_short': 'Sitio',
  'admin.bookings': 'Solicitudes',
  'admin.bookings_short': 'Solicitudes',
  'admin.security': 'Contraseña y datos',
  'admin.security_short': 'Contraseña',
  'admin.assistant': 'Asistente IA',
  'admin.assistant_short': 'Asistente',
  'admin.guide_short': 'Guía',
  'admin.default_password_warning':
    'Sigues usando la contraseña inicial — toca aquí para cambiarla.',

  /* admin — sign in ------------------------------------------------------ */
  'admin.login.lead':
    'Entra para editar el sitio web — tratamientos, precios, la guía, tu equipo y todo lo demás.',
  'admin.login.password': 'Contraseña',
  'admin.login.hint_before': '¿Primera vez? La contraseña inicial es',
  'admin.login.hint_after': '— cámbiala en «Contraseña» en cuanto entres.',
  'admin.login.failed': 'No pudimos iniciar sesión.',

  /* admin — overview ----------------------------------------------------- */
  'admin.hello': 'Hola, {name}.',
  'admin.hello_lead':
    'Todo lo que hay en el sitio web se edita aquí. Los cambios salen en vivo en cuanto guardas.',
  'admin.stat.treatments': 'Tratamientos',
  'admin.stat.tips': 'Consejos locales',
  'admin.stat.therapists': 'Terapeutas',
  'admin.stat.requests': 'Solicitudes nuevas',
  'admin.start_here': 'Empieza por aquí',
  'admin.start.settings':
    'Pon tu número real de WhatsApp en Configuración del sitio → Contacto',
  'admin.start.services': 'Revisa que los precios coincidan con lo que cobras de verdad',
  'admin.start.team': 'Cambia los nombres del equipo y añade fotos',
  'admin.start.discover': 'Añade los lugares a los que mandas a tus huéspedes',
  'admin.start.security': 'Cambia la contraseña inicial de administración',
  'admin.how_title': 'Cómo funciona la edición',
  'admin.how1':
    'Toca cualquier fila para abrirla, edita los campos y pulsa Guardar cambios en la barra de abajo.',
  'admin.how2':
    'Las flechas a la izquierda de cada fila cambian el orden en que aparecen en el sitio.',
  'admin.how3':
    'Las fotos se añaden subiéndolas desde el móvil o pegando un enlace — si lo dejas vacío dibujamos ilustraciones tropicales.',
  'admin.how4': 'Cada sección tiene un botón Restaurar valores iniciales por si algo sale mal.',
  'admin.how_save': 'Guardar cambios',
  'admin.how_restore': 'Restaurar valores iniciales',

  /* admin — settings / collections --------------------------------------- */
  'admin.settings_lead':
    'Tu nombre, tu número de WhatsApp, la portada, los horarios y la letra pequeña.',
  'admin.unsaved': 'Cambios sin guardar',
  'admin.save_error': 'No pudimos guardar.',
  'admin.reset_error': 'No pudimos restaurar.',
  'admin.restored_settings': 'Se restauró la configuración inicial',
  'admin.restored_content': 'Se restauró el contenido inicial',
  'admin.confirm_reset_settings': '¿Reemplazar toda la configuración con los valores iniciales?',
  'admin.confirm_reset_collection': '¿Reemplazar {label} con el contenido inicial?',
  'admin.add_one': 'Añadir {singular}',
  'admin.add_first': 'Añadir el primero',
  'admin.none_yet': 'Todavía no hay {label}.',
  'admin.untitled': '{singular} sin título',

  /* admin — field editor ------------------------------------------------- */
  'field.nothing_added': 'Todavía no has añadido nada.',
  'field.type_enter': 'Escribe y pulsa Enter',
  'field.add_item': 'Añadir elemento',
  'field.remove': 'Quitar {name}',
  'field.minutes': 'Minutos',
  'field.price': 'Precio',
  'field.add_length': 'Añadir una duración',
  'field.remove_duration': 'Quitar la duración',
  'field.add_row': 'Añadir una fila',
  'field.remove_row': 'Quitar la fila',
  'field.pair_label_placeholder': 'Lunes – sábado',
  'field.pair_value_placeholder': '9:00 – 21:00',
  'field.on': 'Sí',
  'field.off': 'No',
  'field.refs_empty': 'Todavía no hay nada que enlazar — agrega primero un masaje.',
  'field.upload': 'Subir imagen',
  'field.upload_title': 'Subir desde el dispositivo',
  'field.upload_failed': 'No se pudo subir la imagen: {message}',

  /* admin — bookings ----------------------------------------------------- */
  'admin.bookings_title': 'Solicitudes de reserva',
  'admin.bookings_lead':
    'Todo lo que llega por el formulario del sitio. Las solicitudes se guardan seis meses.',
  'admin.bookings_empty':
    'Todavía no hay solicitudes. Aparecen aquí en cuanto alguien usa el formulario de reserva.',
  'admin.bookings_load_error': 'No pudimos cargar las solicitudes.',
  'admin.bookings_update_error': 'No pudimos actualizar.',
  'admin.delete_request': 'Eliminar la solicitud',
  'status.new': 'Nueva',
  'status.confirmed': 'Confirmada',
  'status.done': 'Hecha',
  'status.cancelled': 'Cancelada',

  /* admin — security ----------------------------------------------------- */
  'admin.security_lead':
    'La contraseña de administración protege todo lo de esta página. Cámbiala antes de compartir el sitio.',
  'admin.security_warning_title': 'Sigues usando la contraseña inicial.',
  'admin.security_warning_body_before': 'Cualquiera que adivine',
  'admin.security_warning_body_after':
    'puede editar todo el sitio. Pon una nueva aquí abajo — se hace en diez segundos.',
  'admin.change_password': 'Cambiar la contraseña',
  'admin.current_password': 'Contraseña actual',
  'admin.new_password': 'Contraseña nueva',
  'admin.repeat_password': 'Repite la contraseña nueva',
  'admin.update_password': 'Actualizar la contraseña',
  'admin.password_changed': 'Contraseña cambiada. Usa la nueva la próxima vez que entres.',
  'admin.password_too_short': 'Elige una contraseña de al menos 4 caracteres.',
  'admin.password_mismatch': 'Las dos contraseñas nuevas no coinciden.',
  'admin.password_error': 'No pudimos cambiar la contraseña.',
  'admin.restore_all_title': 'Restaurar todo el contenido inicial',
  'admin.restore_all_lead':
    'Reemplaza cada tratamiento, consejo, reseña y ajuste con el contenido con el que salió el sitio. Las solicitudes de reserva y tu contraseña no se tocan.',
  'admin.restore_all_cta': 'Restaurar todo',
  'admin.restore_all_confirm': 'Sí, reemplazar todo',

  /* admin — AI assistant ------------------------------------------------- */
  'ai.title': 'Asistente guiado',
  'ai.subtitle': 'Habla o escribe — actualiza el sitio por ti',
  'ai.lead':
    'Empieza una conversación y el asistente te lleva por todo el sitio, una pregunta a la vez. Redacta los textos, guarda los cambios y los traduce al otro idioma por ti.',
  'ai.start': 'Empezar la conversación',
  'ai.finish': 'Terminar la conversación',
  'ai.live': 'Conversación activa',
  'ai.idle': 'Conversación apagada',
  'ai.mic_on': 'Detener el micrófono',
  'ai.mic_off': 'Hablar',
  'ai.listening': 'Escuchando… habla ahora',
  'ai.transcribing': 'Anotando lo que dijiste…',
  'ai.thinking': 'Pensando…',
  'ai.tap_mic': 'Toca el micrófono, o escribe abajo',
  'ai.input_placeholder': 'Escribe tu respuesta…',
  'ai.send': 'Enviar',
  'ai.mute': 'Silenciar la voz',
  'ai.unmute': 'Leer las respuestas en voz alta',
  'ai.greeting':
    '¡Hola! Puedo actualizar contigo cualquier cosa del sitio — tratamientos y precios, el equipo, la guía, los horarios, la letra pequeña. Dime qué quieres cambiar, o di «dame un recorrido» y vamos sección por sección.',
  'ai.closing':
    'Eso es todo guardado. Esto es lo que aún necesita tus manos — el asistente no puede hacerlo por ti.',
  'ai.applied': 'Guardado: {summary}',
  'ai.apply_failed': 'No pudimos guardar ese cambio: {message}',
  'ai.translated': 'También se tradujo al {language}.',
  'ai.translating': 'Traduciendo al otro idioma…',
  'ai.manual_title': 'Te queda por hacer a mano',
  'ai.manual_none': 'No queda nada a mano — todos los cambios están en vivo.',
  'ai.manual_photo': 'Sube una foto para «{name}» en {section}.',
  'ai.changes_title': 'Cambios hechos en esta conversación',
  'ai.no_changes': 'Todavía no ha cambiado nada.',
  'ai.error': 'Lo siento — eso no salió. Inténtalo otra vez en un momento.',
  'ai.unsupported_mic':
    'Este navegador no le da micrófono a la página. Puedes escribir igual, y todo funciona igual.',
  'ai.mic_denied':
    'El micrófono está bloqueado. Permítelo en los ajustes del navegador, o simplemente escribe.',
  'ai.review': 'Revisar',
  'ai.confirm': 'Sí, guárdalo',
  'ai.reject': 'No, cámbialo',
  'ai.section_label': 'Trabajando en',
  'ai.reset': 'Empezar de nuevo',

  /* map ------------------------------------------------------------------ */
  'map.eyebrow': 'Encuentra el estudio',
  'map.title': 'A dos minutos',
  'map.script': 'de la arena',
  'map.lead': 'Estamos detrás del camino de la playa en {neighborhood}. Escríbenos y te mandamos la ubicación.',
  'map.open': 'Abrir en Google Maps',

  /* misc ----------------------------------------------------------------- */
  'seo.home_suffix': 'Masajes en {neighborhood}, {city}',
  'seo.catalog': 'Tratamientos de masaje',
  'error.content_load': 'No pudimos cargar el contenido del sitio.',
  'error.unknown': 'Algo salió mal.',
  'a11y.loading': 'Cargando',

  /* find your massage — the guided concierge --------------------------- */
  'find.kicker': 'Sin saber nada de masajes',
  'find.title': 'Encuentre su',
  'find.script': 'masaje',
  'find.lead':
    'Cuéntenos qué tipo de día está teniendo y le sugerimos algo rico. Tres preguntas, unos veinte segundos.',
  'find.start': 'Empezar',
  'find.intro_note': '¿Ya sabe lo que quiere? Vea todos los masajes.',
  'find.step_of': 'Paso {current} de {total}',
  'find.back': 'Atrás',
  'find.restart': 'Empezar de nuevo',
  'find.skip': 'Saltar',
  'find.progress': 'Avance de las preguntas',

  'find.q_moment': '¿Qué tipo de día está teniendo?',
  'find.q_moment_sub': 'Elija lo que más se parezca. No hay respuesta incorrecta.',
  'find.moment.just-arrived': 'Acabo de llegar',
  'find.moment.just-arrived.sub': 'Mi cuerpo sigue de viaje.',
  'find.moment.after-adventure': 'Vengo de una aventura',
  'find.moment.after-adventure.sub': 'Cuatrimoto, catamarán, snorkel, golf, senderismo…',
  'find.moment.switch-off': 'Solo quiero desconectar',
  'find.moment.switch-off.sub': 'Sin planes. Relajarme y ya.',
  'find.moment.targeted': 'Me molesta el cuello, los hombros o la espalda',
  'find.moment.targeted.sub': 'Sé exactamente dónde lo siento.',
  'find.moment.celebrating': 'Estamos celebrando',
  'find.moment.celebrating.sub': 'Luna de miel, aniversario, una noche especial.',
  'find.moment.with-someone': 'Vengo acompañada',
  'find.moment.with-someone.sub': 'Pareja, amiga, familia.',
  'find.moment.gentle': 'Quisiera algo suave',
  'find.moment.gentle.sub': 'Comodidad antes que intensidad.',
  'find.moment.expecting': 'Estoy embarazada',
  'find.moment.expecting.sub': 'Atención prenatal.',
  'find.moment.unsure': 'No estoy segura',
  'find.moment.unsure.sub': 'Ayúdenme a elegir.',

  'find.q_feel': '¿Cómo quiere que se sienta?',
  'find.q_feel_sub': 'Puede cambiar de opinión en la camilla cuando quiera.',
  'find.feel.gentle': 'Muy suave',
  'find.feel.gentle.sub': 'Presión ligera todo el tiempo.',
  'find.feel.relaxing': 'Lento y relajante',
  'find.feel.relaxing.sub': 'Tibio, envolvente, sin prisa.',
  'find.feel.balanced': 'Equilibrado',
  'find.feel.balanced.sub': 'Un punto intermedio.',
  'find.feel.firm': 'Firme y dirigido',
  'find.feel.firm.sub': 'Presión de verdad donde molesta.',
  'find.feel.surprise': 'Sorpréndanme',
  'find.feel.surprise.sub': 'Elijan ustedes, que en eso trabajan.',

  'find.q_venue': '¿Dónde quiere su ratito de escape?',
  'find.q_venue_sub': 'Llevamos la camilla, los aceites y la música.',
  'find.venue.hotel': 'Su habitación',
  'find.venue.hotel.sub': 'Vamos a donde esté, en todo Bávaro.',
  'find.venue.beach': 'La playa',
  'find.venue.beach.sub': 'Nuestra camilla, a la sombra, junto al agua.',
  'find.venue.studio': 'Nuestro estudio',
  'find.venue.studio.sub': 'A dos minutos de la arena, en Los Corales.',

  'find.q_comfort': 'Una preguntita de comodidad…',
  'find.q_comfort_sub':
    'Solo para sugerirle algo que hoy le siente bien. Marque lo que aplique, o nada.',
  'find.comfort_privacy':
    'Esto se queda en su teléfono. No se guarda, no se envía con su reserva y no se comparte con nadie.',
  'find.comfort_none': 'Ninguna de estas',
  'find.comfort_continue': 'Continuar',
  'find.concern.pregnant': 'Estoy embarazada',
  'find.concern.recent-surgery': 'Me operaron hace poco',
  'find.concern.acute-injury': 'Tengo una lesión reciente',
  'find.concern.blood-thinners': 'Tomo anticoagulantes',
  'find.concern.fever': 'Tengo fiebre o me siento mal',
  'find.concern.swelling': 'Tengo una hinchazón que no sé explicar',
  'find.concern.sunburn': 'Cogí mucho sol o estoy quemada',
  'find.concern.intoxicated': 'He estado bebiendo',

  'find.result_kicker': 'Para usted, hoy',
  'find.result_lead': 'Esto es lo que le sugerimos.',
  'find.because': 'Como {reasons}, esta le va muy bien.',
  'find.because.just-arrived': 'acaba de llegar',
  'find.because.after-adventure': 'viene de una aventura',
  'find.because.switch-off': 'quiere desconectar',
  'find.because.targeted': 'sabe dónde le molesta',
  'find.because.celebrating': 'está celebrando',
  'find.because.with-someone': 'viajan juntos',
  'find.because.gentle': 'quisiera algo suave',
  'find.because.expecting': 'está embarazada',
  'find.because.unsure': 'prefiere que elijamos nosotras',
  'find.because_feel.gentle': 'la quiere muy suave',
  'find.because_feel.relaxing': 'la quiere lenta y relajante',
  'find.because_feel.balanced': 'la quiere equilibrada',
  'find.because_feel.firm': 'la quiere firme',
  'find.because_venue.hotel': 'prefiere quedarse en su habitación',
  'find.because_venue.beach': 'quiere estar en la arena',
  'find.because_venue.studio': 'puede venir al estudio',
  'find.because_care': 'nos pidió mantenerla suave',
  'find.because_prenatal': 'esta la da una terapeuta con formación en embarazo',

  'find.why': 'Por qué le va bien',
  'find.what': 'Qué vamos a hacer',
  'find.good_for': 'Buena para',
  'find.duration': 'Duración',
  'find.where': 'Dónde',
  'find.minutes': '{minutes} min',
  'find.from': 'desde {price}',
  'find.based_on': 'Este es nuestro {service}.',
  'find.cta_book': 'Reservar este masaje',
  'find.cta_another': 'Muéstrenme otra opción',
  'find.cta_all': 'Ver todos los masajes',
  'find.alt_title': 'O una de estas',
  'find.fallback_note':
    'Nada encajó del todo, así que estas son las que más gustan. Escríbanos y la ayudamos a elegir.',

  'find.rest_title': 'Primero cuídese usted.',
  'find.rest_body':
    'Esto suena a uno de esos momentos en que descansar, tomar líquido, refrescarse o ver a un médico importa más que un masaje. Cuando se sienta bien otra vez, nos encantará ayudarla a relajarse.',
  'find.rest_cta': 'Escríbanos cuando se sienta mejor',
  'find.rest_back': 'Cambiar mis respuestas',

  'find.care_title': 'Hablemos primero.',
  'find.care_body':
    'Lo que nos cuenta merece una conversación corta con una terapeuta antes de reservar, y con su médico donde corresponda. Abajo le dejamos lo que le sugeriríamos con cuidado mientras tanto.',
  'find.care_cta': 'Pregúntenos por WhatsApp',

  'find.quick_paths': 'O empiece por una de estas',
  'find.home_kicker': '¿No sabe qué reservar?',
  'find.home_title': 'Cuéntenos de su día',
  'find.home_lead':
    'Responda tres preguntas rápidas y le sugerimos el masaje que le va al día que está teniendo de verdad.',
  'find.home_cta': 'Encuentre su masaje',
  'find.treatments_prompt': '¿No sabe cuál elegir?',
  'find.treatments_lead': 'Cuéntenos de su día y le sugerimos algo.',
  'find.seo_description':
    'Responda tres preguntas rápidas — cómo le ha ido el día, cómo quiere que se sienta y dónde — y le sugerimos el masaje adecuado en Bávaro, Punta Cana.',

}

export const dictionaries: Record<LanguageCode, Dict> = { en, es }

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
