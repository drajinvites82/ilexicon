/**
 * Site-wide facts. Everything a human might need to edit before launch lives here.
 * Open items (spec §11): formspreeId and legalEntity are placeholders until Raj supplies them.
 */
export const site = {
  name: 'iLexicon',
  url: 'https://ilexicon.com',
  tagline: 'Ideas to action.',
  footerDescription:
    'IT services, software delivery and team augmentation for US businesses since 2016.',
  foundingYear: 2016,

  /** Legal entity shown in the © line. Placeholder until confirmed. */
  legalEntity: 'iLexicon LLC',

  /** Formspree form ID for the contact form (spec §8.2). Placeholder until supplied. */
  formspreeId: 'FORMSPREE_ID',

  emails: {
    ideas: 'ideas@ilexicon.com',
    careers: 'careers@ilexicon.com',
  },

  /** The only address and phone on the site (spec §0, §4.2). */
  office: {
    label: 'Corporate office',
    street: '3916 N Potsdam Ave',
    city: 'Sioux Falls',
    region: 'SD',
    postalCode: '57104',
    country: 'US',
  },
  phone: {
    display: '+1 609 755 5394',
    tel: '+16097555394',
  },

  /** Privacy page is deferred (spec §11): hide the footer link until the copy exists. */
  privacy: {
    show: false,
    href: '/privacy',
  },
} as const;

export const navLinks = [
  { label: 'Services', href: '/services', key: 'services' },
  { label: 'Careers', href: '/careers', key: 'careers' },
  { label: 'About', href: '/about', key: 'about' },
  { label: 'Contact', href: '/contact', key: 'contact' },
] as const;

export type NavKey = (typeof navLinks)[number]['key'];
