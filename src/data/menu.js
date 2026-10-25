// ─────────────────────────────────────────────────────────────────────────────
// MENU DATA: Osthir Flavours
// ─────────────────────────────────────────────────────────────────────────────
// Every dish below is paired with a photograph that was visually verified
// during the asset audit (see ASSETS.md). Descriptions are editorial copy
// based on what is visible in each photograph, edit freely.
//
// Prices, portion sizes, allergen and dietary certifications are UNKNOWN and
// intentionally left null, nothing unverified is published. To add prices:
// set `price: 850` (number, minor units not needed) on any item and the site
// will format it using the currency in src/config/site.js.
// ─────────────────────────────────────────────────────────────────────────────

/** @typedef {'biryani'|'desi-classics'|'curries'|'drinks'} CategoryId */

export const categories = [
  {
    id: 'biryani',
    name: 'Biryani',
    tagline: 'Layered, sealed, and steamed on dum.',
    description:
      'Long-grain rice layered with marinated meat, saffron, fried onions and whole spices, sealed and finished on gentle dum heat.',
  },
  {
    id: 'desi-classics',
    name: 'Desi Classics',
    tagline: 'Slow-simmered comfort, the home way.',
    description:
      'The dishes of the everyday table, patiently simmered curries with potatoes, whole spices and fresh coriander.',
  },
  {
    id: 'curries',
    name: 'Curries',
    tagline: 'Rich gravies, gently built.',
    description: 'Creamy, aromatic gravies built slowly and finished with care.',
  },
  {
    id: 'drinks',
    name: 'Drinks',
    tagline: 'Teas, lassis and slow pours.',
    description: 'Traditional teas brewed with spice and citrus, and chilled lassis poured thick.',
  },
];

export const menuItems = [
  // ── Biryani ────────────────────────────────────────────────────────────────
  {
    slug: 'beef-biryani',
    name: 'Beef Biryani',
    category: 'biryani',
    image: 'beef-biryani',
    alt: 'Beef biryani: dark beef over saffron rice, topped with fried onions and a green chilli.',
    short: 'Slow-cooked beef, saffron rice, a fistful of fried onions on top.',
    description:
      'The beef is cooked until it pulls apart, then layered with saffron rice and a green chilli for heat. Fried onions go on last, sweet and crisp. Best eaten straight from the pot.',
    notes: ['Slow-cooked beef', 'Saffron rice', 'Crisp fried onions'],
    price: null,
    featured: true,
  },
  {
    slug: 'lamb-biryani',
    name: 'Lamb Biryani',
    category: 'biryani',
    image: 'lamb-biryani',
    alt: 'Lamb on the bone over saffron and carrot rice, with lemon, mint, cinnamon and bay.',
    short: 'Lamb on the bone over saffron rice. Squeeze the lemon, tear the mint.',
    description:
      'Lamb on the bone, steamed until it gives way. The rice is threaded with saffron and sweet carrot, with cinnamon and bay in the background. The lemon wedge is not decoration. Use it.',
    notes: ['On-the-bone lamb', 'Saffron & carrot rice', 'Lemon & mint'],
    price: null,
    featured: true,
  },

  // ── Desi Classics ──────────────────────────────────────────────────────────
  {
    slug: 'chicken-desi',
    name: 'Chicken Desi',
    category: 'desi-classics',
    image: 'chicken-desi',
    alt: 'Bone-in chicken and potato in a golden gravy with green chilli and coriander.',
    short: 'Bone-in chicken and potato in a turmeric gravy, the kind you wipe the bowl with.',
    description:
      'The everyday curry, cooked slowly. Bone-in chicken and potato in a golden, turmeric-warm gravy, finished with coriander and a green chilli. Good with rice. Better with more rice.',
    notes: ['Bone-in chicken', 'Golden potato gravy', 'Fresh coriander'],
    price: null,
    featured: true,
  },
  {
    slug: 'beef-desi',
    name: 'Beef Desi',
    category: 'desi-classics',
    image: 'beef-desi',
    alt: 'Dark beef curry with potato in a brass bowl, topped with coriander.',
    short: 'Dark, deep beef curry with potato. The boldest bowl on the menu.',
    description:
      'Beef cooked low until the gravy goes dark and thick and the potatoes have taken all of it in.',
    notes: ['Slow-simmered beef', 'Dark glossy gravy', 'Potatoes'],
    price: null,
    featured: false,
  },
  {
    slug: 'duck-desi',
    name: 'Duck Desi',
    category: 'desi-classics',
    image: 'duck-desi',
    alt: 'Dark duck curry with cinnamon, cardamom and dried chilli, finished with coriander.',
    short: 'Duck in a dark whole-spice gravy. Not a Tuesday dish.',
    description:
      'Duck is the one you order when something is worth celebrating. It cooks in a dark gravy built on whole spices (cinnamon, green cardamom, dried chillies) until the meat is deep and the sauce turns glossy.',
    notes: ['Rich duck', 'Whole spices', 'Dried chilli & cardamom'],
    price: null,
    featured: false,
  },

  // ── Curries ────────────────────────────────────────────────────────────────
  {
    slug: 'chicken-korma',
    name: 'Chicken Korma',
    category: 'curries',
    image: 'chicken-korma',
    alt: 'Pale, creamy korma with chicken, almond flakes, fried onion and a drizzle of ghee.',
    short: 'Mild, creamy, a little sweet from fried onion and almond.',
    description:
      'The gentle one. Chicken in a pale, mild gravy, a little sweet from fried onion, with almond flakes and ghee on top. Order it for the kids, then regret sharing.',
    notes: ['Creamy mild gravy', 'Almond flakes', 'Fried onion & ghee'],
    price: null,
    featured: false,
  },

  // ── Drinks ─────────────────────────────────────────────────────────────────
  {
    slug: 'lemon-tea',
    name: 'Lemon Tea',
    category: 'drinks',
    image: 'lemon-tea',
    alt: 'Hot lemon tea in a clear glass with a slice of lemon.',
    short: 'Black tea, a full wheel of lemon. Clean and bright.',
    description: 'Black tea with a whole wheel of lemon. What you want between two rich courses.',
    notes: ['Served hot', 'Fresh lemon'],
    price: null,
    featured: false,
  },
  {
    slug: 'mint-tea',
    name: 'Mint Tea',
    category: 'drinks',
    image: 'mint-tea',
    alt: 'Mint tea in a clear glass, packed with fresh mint leaves.',
    short: 'A glass packed with torn mint, brewed light.',
    description: 'Fresh mint, torn by hand and steeped light. Green, cooling, and quietly good after biryani.',
    notes: ['Fresh torn mint', 'Served hot'],
    price: null,
    featured: false,
  },
  {
    slug: 'saffron-tea',
    name: 'Saffron Tea',
    category: 'drinks',
    image: 'saffron-tea',
    alt: 'Amber-gold saffron tea in a clear glass, saffron threads visible.',
    short: 'Amber-gold, steeped with real saffron threads.',
    description: 'Tea steeped until it turns amber-gold, with real saffron threads you can see in the glass. The treat of the drinks list.',
    notes: ['Real saffron threads', 'Served hot'],
    price: null,
    featured: false,
  },
  {
    slug: 'regular-lassi',
    name: 'Regular Lassi',
    category: 'drinks',
    image: 'regular-lassi',
    alt: 'A tall glass of chilled plain lassi, frothy on top, dusted with spice.',
    short: 'Thick, cold, frothy on top. The classic cooler.',
    description: 'Yoghurt poured thick and cold, with a little froth and a dusting of spice. Keep one next to anything with chilli in it.',
    notes: ['Served chilled', 'Frothy top'],
    price: null,
    featured: true,
  },
  {
    slug: 'pistachio-badam-milk',
    name: 'Pistachio Badam Milk',
    category: 'drinks',
    image: 'pistachio-badam-milk',
    alt: 'Pistachio badam milk in a tall glass, topped with chopped pistachio and almond.',
    short: 'Cold almond milk, crushed pistachio on top. Pudding you can drink.',
    description: 'Cold milk blended with almond and sugar, pistachio crushed over the top. It is basically dessert, and nobody here will stop you.',
    notes: ['Served chilled', 'Pistachio & almond'],
    price: null,
    featured: true,
  },
  {
    slug: 'mango-lassi',
    name: 'Mango Lassi',
    category: 'drinks',
    image: 'mango-lassi-pour',
    alt: 'Thick mango lassi poured into a tall glass, dusted with pistachio.',
    short: 'Ripe mango blended thick into yoghurt, pistachio on top.',
    description: 'Ripe mango and yoghurt, blended thick enough to eat with a spoon, finished with pistachio.',
    notes: ['Served chilled', 'Ripe mango'],
    price: null,
    featured: false,
  },
];

export function itemsByCategory(categoryId) {
  return menuItems.filter((item) => item.category === categoryId);
}

export function getItem(slug) {
  return menuItems.find((item) => item.slug === slug);
}

export function relatedItems(item, count = 3) {
  const sameCat = menuItems.filter((i) => i.category === item.category && i.slug !== item.slug);
  const others = menuItems.filter((i) => i.category !== item.category);
  return [...sameCat, ...others].slice(0, count);
}

export function getCategory(id) {
  return categories.find((c) => c.id === id);
}
