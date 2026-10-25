// llms.txt — a supplementary plain-text guide to this site for language-model
// crawlers. This is a courtesy index, not a substitute for crawlable HTML and
// valid structured data (both of which this site provides).
import site from '../config/site.js';
import { menuItems, categories } from '../data/menu.js';

export function GET() {
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    '## Pages',
    '',
    `- Home: ${site.url}/`,
    `- Menu: ${site.url}/menu/`,
    `- Drinks: ${site.url}/drinks/`,
    `- The Craft (cooking process): ${site.url}/the-craft/`,
    `- Our Story: ${site.url}/our-story/`,
    `- Visit / locations: ${site.url}/locations/`,
    `- Catering: ${site.url}/catering/`,
    `- Contact: ${site.url}/contact/`,
    '',
    '## Menu',
    '',
  ];
  for (const cat of categories) {
    lines.push(`### ${cat.name}`);
    for (const item of menuItems.filter((i) => i.category === cat.id)) {
      lines.push(`- ${item.name}: ${item.short} (${site.url}/menu/${item.slug}/)`);
    }
    lines.push('');
  }
  if (!site.location.addressLines) {
    lines.push('Note: address, phone and opening hours are not yet published on the site.');
  }
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
