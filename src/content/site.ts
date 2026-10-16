/**
 * Site-wide facts. Everything a human might need to edit before launch lives here.
 */
export const site = {
  name: 'iLexicon',
  url: 'https://ilexicon.com',
  tagline: 'Ideas to action.',
  footerDescription:
    'IT services, software delivery and team augmentation for US businesses since 2017.',
  foundingYear: 2017,

  /** Legal entity shown in the © line and the JSON-LD legalName. */
  legalEntity: 'Lexicon IT Ltd',

  /** Contact form handler (public/contact.php): emails ideas@ from noreply@ilexicon.com. */
  formEndpoint: '/contact.php',

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
