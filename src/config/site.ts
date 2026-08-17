/** Canonical site config for SEO, sitemap, and navigation. */
export const SITE = {
  name: '#VSB GOLD',
  shortName: 'VSB GOLD',
  tagline: 'House of Madness',
  manifesto: 'Craft and culture fused into jewelry that means something.',
  description:
    '#VSB GOLD is a brand born from the street and precise craft. We join gold, diamonds, and street culture into jewelry that carries weight — on the neck and in life.',
  url: 'https://vsb-gold.vercel.app',
  locale: 'en_US',
  lang: 'en',
  email: 'atelier@vsbgold.com',
  instagram: {
    handle: 'vsb.gold',
    url: 'https://www.instagram.com/vsb.gold/',
  },
  ogImage: '/brand/logo.png',
  themeColor: '#fdf5e8',
} as const

export type NavChild = {
  label: string
  to: string
  description?: string
}

export type NavItem = {
  label: string
  to?: string
  children?: NavChild[]
}

export const NAV: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Collection', to: '/collection' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export const FOOTER_LINKS = [
  { label: 'Collection', to: '/collection' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Privacy', to: '/privacy' },
] as const
