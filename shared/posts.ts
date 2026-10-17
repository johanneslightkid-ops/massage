import type { BlogPost } from './types'

/**
 * Starting blog posts. Bodies use a deliberately small Markdown dialect —
 * `## heading`, `### subheading`, `- list`, `> quote`, `**bold**`, `*italic*`
 * and `[link](url)` — which is all the renderer in `src/lib/markdown.tsx`
 * understands, and all an owner (or the AI writer) should ever need.
 */
export const posts: BlogPost[] = [
  {
    id: 'post-arrival-day',
    slug: 'first-massage-after-a-long-flight',
    title: 'Your first massage after a long flight: what to book on arrival day',
    excerpt:
      'Nine hours in a seat, a transfer from PUJ and a check-in queue. Here is what your body actually wants on day one — and what it does not.',
    body: `You land at Punta Cana, the air hits you like a warm towel, and an hour later you are in your room with stiff legs, a heavy head and a suitcase you have not opened. This is the most common moment guests message us, and the best one to get right.

## What a long flight does to you

Sitting still for hours slows the circulation in your legs, so ankles swell and calves feel tight. Dry cabin air dehydrates you, and the time change leaves your nervous system somewhere over the Atlantic. None of this needs deep pressure. It needs **movement, warmth and calm**.

## What we recommend

- **60 to 90 minutes of a gentle, flowing massage** — long strokes towards the heart, extra time on legs and feet.
- **Light to medium pressure.** Your muscles are not knotted yet, they are just tired. Deep tissue on arrival day often leaves people sore on day two.
- **Late afternoon or early evening.** It helps you fall asleep on local time instead of napping at 3 pm.

> If you only remember one thing: on arrival day, ask for relaxing, not fixing.

## Before we arrive

Drink a big glass of water, have something light to eat, and take a warm shower if you can. We bring the table, the linens and the oils, so all you need is a bit of floor space by the balcony door — the sea breeze does the rest.

## When to save the deep work

If you have a tight back from the flight that really bothers you, tell us. We can spend ten focused minutes there and keep the rest gentle. Save a full **deep tissue or sports massage** for day three or four, after you have slept, swum and probably done something adventurous.

Message us on WhatsApp with your hotel and landing time, and we will suggest a slot that fits your first evening.`,
    category: 'Wellbeing',
    tags: ['arrival', 'jet lag', 'first massage'],
    coverImage: '',
    author: 'Massage Playero',
    publishedAt: '2026-09-02',
    readMinutes: 3,
    published: true,
    featured: true,
    order: 1,
  },
  {
    id: 'post-sun-and-skin',
    slug: 'sun-salt-and-skin-before-a-massage',
    title: 'Sun, salt and skin: getting the most from a massage on a beach holiday',
    excerpt:
      'The Caribbean sun in Bávaro is stronger than it feels. A few simple habits keep your skin happy — and your massage comfortable.',
    body: `The breeze off the water in Bávaro makes the midday sun feel softer than it is. By the time you notice the pink on your shoulders, it is already a sunburn. Here is how to enjoy the beach and still enjoy your massage.

## Sunburn and massage do not mix

A massage on burnt skin hurts, and it can make the burn worse. If you are red, hot to the touch or peeling, **tell us before we come**. We will either move your appointment a day or two, or give you a very light treatment that avoids the burnt areas entirely, with cool aloe instead of warm oil.

## Five habits that help

- **Reef-safe sunscreen, reapplied after every swim.** Salt water and towels wipe it off faster than you think.
- **Shade between 11:00 and 15:00.** The palapas on Los Corales and El Cortecito are there for a reason.
- **Rinse off the salt** with fresh water before your massage — it lets the oil glide instead of drag.
- **Drink more than usual.** Heat, sun and a couple of piña coladas all dehydrate you.
- **Skip heavy exfoliation** for a day after a lot of sun.

## The best time for your massage

For most guests, **late afternoon or golden hour** is ideal. The heat has dropped, your skin has cooled, and you have showered off the beach. A massage then turns into a very good night's sleep.

## Skin treatments

If your skin feels dry and tight after a few beach days, ask about our skin-focused treatments. They use rich, cooling products and slower, softer techniques, and they are lovely on the evening before you fly home.

> Your skin is on holiday too. Treat it gently and it will glow all week.`,
    category: 'Beach life',
    tags: ['sun', 'skin', 'beach'],
    coverImage: '',
    author: 'Massage Playero',
    publishedAt: '2026-09-18',
    readMinutes: 3,
    published: true,
    featured: false,
    order: 2,
  },
  {
    id: 'post-couples-room',
    slug: 'couples-massage-in-your-hotel-room',
    title: 'A couples massage in your hotel room: how it works',
    excerpt:
      'Two therapists, two tables, one sea view. Everything you need to know before booking a couples massage where you are staying.',
    body: `Honeymoons, anniversaries, a birthday, or simply a holiday together — a couples massage is one of the nicest things you can do side by side. Doing it in your own room or villa means no robes in a corridor and no rushing back afterwards.

## What we bring

- **Two therapists and two folding tables**, set up side by side.
- **Fresh linens, towels and warm oils**, plus a little speaker for soft music if you like.
- **Everything goes back in our bags afterwards.** We leave the room as we found it.

## How much space you need

About the size of two beds side by side. Most hotel rooms in Bávaro and Punta Cana are fine once a chair or a coffee table is moved. A terrace or a villa living room is perfect, especially at sunset.

## Same treatment, or different?

You do not have to choose the same massage. One of you can have a **gentle relaxing massage** while the other gets **firm, focused work on the back and shoulders**. Just tell us when you book.

## Checking with your hotel

Most resorts welcome outside therapists, some ask for your name at the gate, and a few all-inclusives only allow their own spa. **Ask reception before you book** — we are happy to talk to them for you.

## Making it special

Add a few extra minutes for a scalp massage, ask us to scatter flowers, or book it for golden hour and open the balcony doors. Afterwards there is nowhere you need to be.

> The best part, guests tell us, is the ten minutes after — lying there together, listening to the sea.`,
    category: 'Together',
    tags: ['couples', 'hotel', 'honeymoon'],
    coverImage: '',
    author: 'Massage Playero',
    publishedAt: '2026-10-05',
    readMinutes: 3,
    published: true,
    featured: false,
    order: 3,
  },
]
