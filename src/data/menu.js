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
    alt: 'Beef biryani in a wide bowl, dark slow-cooked beef over saffron rice, topped with crisp fried onions and a whole green chilli, steam rising.',
    short: 'Dark, slow-cooked beef folded through saffron-fragrant rice under a tangle of crisp fried onions.',
    description:
      'Our beef biryani layers deeply browned, slow-cooked beef with long-grain rice kissed by saffron. It is finished the way biryani deserves, a crown of golden fried onions and a whole green chilli, served steaming from the pot.',
    notes: ['Slow-cooked beef', 'Saffron rice', 'Crisp fried onions'],
    price: null,
    featured: true,
  },
  {
    slug: 'lamb-biryani',
    name: 'Lamb Biryani',
    category: 'biryani',
    image: 'lamb-biryani',
    alt: 'Lamb biryani with on-the-bone lamb over saffron and carrot-threaded rice, garnished with lemon, mint, cinnamon and bay leaf.',
    short: 'On-the-bone lamb, tender to the fork, over bright saffron rice with lemon and mint.',
    description:
      'On-the-bone lamb, steamed until it yields, layered through rice threaded with saffron and sweet carrot. Whole cinnamon, bay, fried onion and fresh mint carry the aroma; a wedge of lemon cuts the richness.',
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
    alt: 'Chicken desi curry, bone-in chicken and potatoes in a golden gravy with a whole green chilli and fresh coriander, served in a brass bowl.',
    short: 'Bone-in chicken and soft potatoes in a golden, gently spiced home-style gravy.',
    description:
      'The everyday classic, done patiently. Bone-in chicken and potatoes simmered in a golden gravy, finished with fresh coriander and a whole green chilli. Simple food, made with uncommon care.',
    notes: ['Bone-in chicken', 'Golden potato gravy', 'Fresh coriander'],
    price: null,
    featured: true,
  },
  {
    slug: 'beef-desi',
    name: 'Beef Desi',
    category: 'desi-classics',
    image: 'beef-desi',
    alt: 'Beef desi, dark, glossy slow-cooked beef curry with potatoes in a hammered brass bowl, topped with coriander, steam rising.',
    short: 'Deeply browned beef and potatoes in a dark, glossy gravy, the boldest bowl we make.',
    description:
      'Beef simmered low and slow until the gravy turns dark and glossy, with potatoes that have soaked up every drop. Served in brass, crowned with coriander, still steaming.',
    notes: ['Slow-simmered beef', 'Dark glossy gravy', 'Potatoes'],
    price: null,
    featured: false,
  },
  {
    slug: 'duck-desi',
    name: 'Duck Desi',
    category: 'desi-classics',
    image: 'duck-desi',
    alt: 'Duck desi curry, rich dark duck pieces in a glossy gravy with cinnamon, cardamom, dried chillies and coriander in a brass bowl.',
    short: 'Rich duck in a dark, whole-spice gravy, cinnamon, cardamom and dried chilli.',
    description:
      'A celebration dish. Duck simmered in a dark gravy built on whole spices (cinnamon, green cardamom, dried chillies) until the meat is deep and the sauce shines.',
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
    alt: 'Chicken korma, pale creamy korma with tender chicken, scattered with fried onions, almond flakes and a drizzle of ghee in a brass bowl.',
    short: 'Velvet-smooth korma, tender chicken in a mild, creamy gravy with almonds and fried onion.',
    description:
      'The gentlest dish on the menu. Chicken korma in a pale, velvet gravy, finished with almond flakes, crisp fried onions and a slow drizzle of ghee.',
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
    alt: 'Hot lemon tea in a clear glass with a slice of lemon, steam rising, on a dark stone coaster.',
    short: 'Bright, clear and steaming, black tea with a full wheel of fresh lemon.',
    description: 'A clean, bright brew with a full wheel of lemon. The reset button between courses.',
    notes: ['Served hot', 'Fresh lemon'],
    price: null,
    featured: false,
  },
  {
    slug: 'mint-tea',
    name: 'Mint Tea',
    category: 'drinks',
    image: 'mint-tea',
    alt: 'Mint tea in a clear glass filled with fresh mint leaves, steam rising, on a brass tray with linen.',
    short: 'A glass full of torn fresh mint, brewed light and cooling.',
    description: 'Fresh mint, torn by hand and steeped light. Cooling, green and quietly refreshing.',
    notes: ['Fresh torn mint', 'Served hot'],
    price: null,
    featured: false,
  },
  {
    slug: 'saffron-tea',
    name: 'Saffron Tea',
    category: 'drinks',
    image: 'saffron-tea',
    alt: 'Saffron tea in a clear glass, amber-gold with visible saffron threads, steam rising, on a ceramic saucer.',
    short: 'Amber-gold tea steeped with real saffron threads.',
    description: 'Our most luxurious cup, tea steeped amber-gold with visible saffron threads.',
    notes: ['Real saffron threads', 'Served hot'],
    price: null,
    featured: false,
  },
  {
    slug: 'regular-lassi',
    name: 'Regular Lassi',
    category: 'drinks',
    image: 'regular-lassi',
    alt: 'A tall glass of chilled plain lassi with a frothy top dusted with spice, condensation on the glass.',
    short: 'Chilled, frothy and thick-poured, the classic yoghurt cooler.',
    description: 'Thick-poured, chilled and frothy, dusted lightly with spice. The classic cooler beside anything spicy.',
    notes: ['Served chilled', 'Frothy top'],
    price: null,
    featured: true,
  },
  {
    slug: 'pistachio-badam-milk',
    name: 'Pistachio Badam Milk',
    category: 'drinks',
    image: 'pistachio-badam-milk',
    alt: 'Pistachio badam milk in a tall glass topped with chopped pistachios and almonds, pistachios scattered beside it.',
    short: 'Chilled nut milk crowned with crushed pistachio and almond.',
    description: 'Cool, creamy and crowned with crushed pistachio and almond, dessert you can drink.',
    notes: ['Served chilled', 'Pistachio & almond'],
    price: null,
    featured: true,
  },
  {
    slug: 'mango-lassi',
    name: 'Mango Lassi',
    category: 'drinks',
    image: 'mango-lassi-pour',
    alt: 'Mango lassi being poured thick from a brass jug into a tall glass, dusted with pistachio, fresh mango beside it.',
    short: 'Ripe mango blended thick into yoghurt, poured slow and dusted with pistachio.',
    description: 'Ripe mango and yoghurt, blended thick and poured slow, finished with a dusting of pistachio.',
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
