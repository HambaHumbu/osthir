// SEO + structured-data helpers. JSON-LD is only ever built from verified
// configuration — unknown fields (address, phone, hours, prices, ratings)
// are omitted, never fabricated.
import site from '../config/site.js';
import { menuItems, categories, getCategory } from '../data/menu.js';

export function canonical(pathname) {
  return new URL(pathname, site.url).toString();
}

export function restaurantJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: site.name,
    description: site.description,
    url: site.url,
    servesCuisine: ['Biryani', 'South Asian', 'Desi'],
    logo: new URL('/logo-512.png', site.url).toString(),
    image: new URL(site.seo.defaultOgImage, site.url).toString(),
  };
  const { contact, location } = site;
  if (contact.email) data.email = contact.email;
  if (contact.phoneHref) data.telephone = contact.phoneHref;
  if (location.addressLines) {
    data.address = {
      '@type': 'PostalAddress',
      streetAddress: location.addressLines.join(', '),
      ...(location.city && { addressLocality: location.city }),
      ...(location.postcode && { postalCode: location.postcode }),
      ...(location.country && { addressCountry: location.country }),
    };
  }
  if (location.geo) data.geo = { '@type': 'GeoCoordinates', ...location.geo };
  if (location.openingHours) {
    data.openingHours = location.openingHours.map((h) => `${h.days} ${h.hours}`);
  }
  if (site.orderingUrl) {
    data.potentialAction = {
      '@type': 'OrderAction',
      target: { '@type': 'EntryPoint', urlTemplate: site.orderingUrl },
    };
  }
  const social = Object.values(site.social).filter(Boolean);
  if (social.length) data.sameAs = social;
  return data;
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    description: site.description,
  };
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: canonical(item.path),
    })),
  };
}

export function menuJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: `${site.name} Menu`,
    url: canonical('/menu/'),
    hasMenuSection: categories.map((cat) => ({
      '@type': 'MenuSection',
      name: cat.name,
      hasMenuItem: menuItems
        .filter((i) => i.category === cat.id)
        .map((i) => ({
          '@type': 'MenuItem',
          name: i.name,
          description: i.short,
          url: canonical(`/menu/${i.slug}/`),
          ...(i.price != null && {
            offers: { '@type': 'Offer', price: i.price, priceCurrency: site.currency },
          }),
        })),
    })),
  };
}

export function menuItemJsonLd(item) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MenuItem',
    name: item.name,
    description: item.description,
    url: canonical(`/menu/${item.slug}/`),
    image: canonical(`/media/img/${item.image}-${1080}.jpg`),
    ...(item.price != null && {
      offers: { '@type': 'Offer', price: item.price, priceCurrency: site.currency },
    }),
    suitableForDiet: undefined,
  };
}

export function webPageJsonLd({ name, description, path }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url: canonical(path),
    isPartOf: { '@type': 'WebSite', name: site.name, url: site.url },
  };
}

export function faqJsonLd(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export { getCategory };
