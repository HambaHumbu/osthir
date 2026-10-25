// llms.txt, a supplementary plain-text guide to this site for language-model
// crawlers. This is a courtesy index, not a substitute for crawlable HTML and
// valid structured data (both of which this site provides).
import site from '../config/site.js';
import { menuItems, categories } from '../data/menu.js';
import { href } from '../lib/url.js';

export function GET() {
  const abs = (p) => site.url + href(p);
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    '## Pages',
    '',
    `- [Home](${abs('/')})`,
    `- [Menu](${abs('/menu/')})`,
    `- [Drinks](${abs('/drinks/')})`,
    `- [The craft (cooking process)](${abs('/the-craft/')})`,
    `- [Our story](${abs('/our-story/')})`,
    `- [Visit and hours](${abs('/locations/')})`,
    `- [Catering](${abs('/catering/')})`,
    `- [Contact](${abs('/contact/')})`,
    '',
    '## Menu',
    '',
  ];
  for (const cat of categories) {
    lines.push(`### ${cat.name}`);
    for (const item of menuItems.filter((i) => i.category === cat.id)) {
      lines.push(`- [${item.name}](${abs(`/menu/${item.slug}/`)}): ${item.short}`);
    }
    lines.push('');
  }
  lines.push('## Status');
  lines.push('');
  lines.push(`- ${site.name} is opening soon in Canada. Planned hours are 11 AM to 2 AM, every day.`);
  lines.push('- Food photography on the site is illustrative until opening day.');
  if (!site.location.addressLines) {
    lines.push('- The exact street address and phone number are not published yet.');
  }
  lines.push('');
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
