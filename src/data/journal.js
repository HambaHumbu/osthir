// Journal posts. Real, useful, written in Osthir's voice. No fabricated
// sources, no invented claims about the restaurant. Images are existing
// illustrative stills until our own photography exists.

export const posts = [
  {
    slug: 'what-dum-cooking-means',
    title: 'What dum cooking means',
    date: '2026-10-25',
    image: 'process-dum-seal',
    alt: 'Hands pressing a ring of dough around the rim of a pot to seal it for dum cooking.',
    excerpt: 'Dum is a method, not an ingredient. Here is what the sealed pot actually does to the rice.',
    body: [
      'Dum is a cooking method, not an ingredient. The word comes from the Persian for breath, and that is close to what it does. It lets a dish finish in its own trapped steam.',
      'A pot is layered with par-cooked rice and meat, the lid is sealed, often with a ring of dough, and the whole thing sits on low heat. Nothing is stirred. The steam cannot escape, so it cooks the rice evenly and carries the smell of the spices through every grain.',
      'The payoff is texture. Rice stays separate instead of turning to paste, and the meat stays moist because it is steaming rather than frying. When the seal is broken at the table, the smell is the whole point.',
      'You do not need a restaurant to try it. A heavy pot with a tight lid and a low flame gets you most of the way. The hard part is patience. Once it is sealed, you leave it alone.',
    ],
  },
  {
    slug: 'malai-tea-explained',
    title: 'Malai tea, explained',
    date: '2026-10-25',
    image: 'process-tea-pull',
    alt: 'Milky tea poured in a long stream from one glass jug into a smaller glass, froth forming.',
    excerpt: 'Malai means cream. This is why malai tea drinks thicker and rounder than ordinary chai.',
    body: [
      'Malai means cream. Malai tea is tea made richer with the cream that rises on boiled milk, so it drinks thicker and rounder than ordinary chai.',
      'The method is old and low tech. Full-fat milk is boiled until a skin of cream forms on top, that cream is stirred back in, and strong tea is added with sugar to taste. Some cooks pull the tea between two jugs to froth it.',
      'The result sits between a tea and a dessert. It is sweet, warm, and heavy enough to be a small treat on its own rather than a drink beside food.',
      'If you want to try it at home, use whole milk, let it boil properly, and do not rush the cream. Thin milk makes thin tea.',
    ],
  },
];

export function getPost(slug) {
  return posts.find((p) => p.slug === slug);
}

export default posts;
