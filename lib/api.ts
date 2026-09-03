const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  currency: string;
  category: 'earrings' | 'rings' | 'bracelets' | 'necklaces' | 'bangles';
  tag?: 'best-seller' | 'new' | 'signature' | 'heritage';
  image: string;
  description: string;
  metal: string;
  stone?: string;
  inStock: boolean;
}

export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  heroImage: string;
  cta: string;
}

export interface Store {
  id: string;
  emirate: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  mapUrl: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  date: string;
  rating: number;
  text: string;
}

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'veda-solitaire-ring',
    name: 'Veda Solitaire Ring',
    subtitle: '18K Yellow Gold · Diamond',
    price: 4850,
    currency: 'AED',
    category: 'rings',
    tag: 'best-seller',
    image: '/images/cat_rings.jpg',
    description: 'A timeless solitaire in 18K yellow gold, set with a brilliant-cut diamond hand-selected for its fire and clarity.',
    metal: '18K Yellow Gold',
    stone: 'Diamond',
    inStock: true,
  },
  {
    id: 'mira-diamond-studs',
    name: 'Mira Diamond Studs',
    subtitle: '18K Yellow Gold · Diamond',
    price: 1290,
    currency: 'AED',
    category: 'earrings',
    tag: 'new',
    image: '/images/cat_earrings.jpg',
    description: 'Perfectly matched brilliant-cut diamonds in secure 18K yellow gold butterfly backs.',
    metal: '18K Yellow Gold',
    stone: 'Diamond',
    inStock: true,
  },
  {
    id: 'zumurud-emerald-line-bracelet',
    name: 'Zumurud Emerald Line Bracelet',
    subtitle: '18K Gold · Emerald & Diamond',
    price: 6400,
    currency: 'AED',
    category: 'bracelets',
    tag: 'signature',
    image: '/images/cat_bracelets.jpg',
    description: 'Sixteen matched Zambian emeralds closed-set in 18K gold and separated by pavé diamonds.',
    metal: '18K Yellow Gold',
    stone: 'Emerald & Diamond',
    inStock: true,
  },
  {
    id: 'amara-emerald-drop-pendant',
    name: 'Amara Emerald Drop Pendant',
    subtitle: '18K Gold · Emerald',
    price: 980,
    currency: 'AED',
    category: 'necklaces',
    image: '/images/cat_necklaces.jpg',
    description: 'A single pear-shaped Zambian emerald suspended from an 18K gold bail on a fine curb chain.',
    metal: '18K Yellow Gold',
    stone: 'Emerald',
    inStock: true,
  },
  {
    id: 'kanmani-filigree-bangles',
    name: 'Kanmani Filigree Bangles',
    subtitle: '22K Yellow Gold',
    price: 3750,
    currency: 'AED',
    category: 'bangles',
    tag: 'heritage',
    image: '/images/cat_bangles.jpg',
    description: 'A pair of bangles worked entirely by hand with intricate filigree.',
    metal: '22K Yellow Gold',
    inStock: true,
  },
  {
    id: 'noor-pave-band',
    name: 'Noor Pavé Band',
    subtitle: '18K Yellow Gold · Diamond',
    price: 2150,
    currency: 'AED',
    category: 'rings',
    image: '/images/cat_rings.jpg',
    description: 'Forty-two brilliant-cut diamonds set in a continuous pavé across an 18K yellow gold band.',
    metal: '18K Yellow Gold',
    stone: 'Diamond',
    inStock: true,
  },
  {
    id: 'saira-layering-chain',
    name: 'Saira Layering Chain',
    subtitle: '18K Yellow Gold',
    price: 720,
    currency: 'AED',
    category: 'necklaces',
    image: '/images/cat_necklaces.jpg',
    description: 'A featherlight 45cm curb chain in 18K yellow gold, designed specifically for layering.',
    metal: '18K Yellow Gold',
    inStock: true,
  },
  {
    id: 'ilm-emerald-studs',
    name: 'Ilm Emerald Studs',
    subtitle: '18K Gold · Emerald',
    price: 1640,
    currency: 'AED',
    category: 'earrings',
    image: '/images/cat_earrings.jpg',
    description: 'Oval Zambian emeralds in a simple 18K gold bezel setting.',
    metal: '18K Yellow Gold',
    stone: 'Emerald',
    inStock: true,
  },
];

const FALLBACK_COLLECTIONS: Collection[] = [
  {
    slug: 'zumurud',
    name: 'Zumurud',
    tagline: 'Our house colour',
    description: 'Matched Zambian emeralds closed-set in 22K gold. The collection our house colour is named for.',
    image: '/images/hero_bg.jpg',
    heroImage: '/images/hero_bg.jpg',
    cta: 'Shop Zumurud',
  },
  {
    slug: 'saira',
    name: 'Saira',
    tagline: 'Everyday fine',
    description: 'Featherlight chains, bezels and hoops for wearing every single day.',
    image: '/images/occasion_everyday.jpg',
    heroImage: '/images/occasion_everyday.jpg',
    cta: 'Shop Saira',
  },
  {
    slug: 'noor',
    name: 'Noor',
    tagline: 'Ceremonial bridal',
    description: 'Ceremonial bridal suites — necklace, jhumkas, vanki and bangles, matched as one.',
    image: '/images/occasion_bridal.jpg',
    heroImage: '/images/occasion_bridal.jpg',
    cta: 'Shop Noor',
  },
];

const FALLBACK_STORES: Store[] = [
  { id: 's1', emirate: 'Dubai', name: 'Gold Souk, Deira', address: 'Shop 12, Sikkat Al Khail Road', hours: '10:00 – 22:00 daily', phone: '+971 4 226 1993', mapUrl: '#' },
  { id: 's2', emirate: 'Dubai', name: 'Meena Bazaar', address: 'Al Fahidi Street, Bur Dubai', hours: '10:00 – 22:00 daily', phone: '+971 4 353 4411', mapUrl: '#' },
  { id: 's3', emirate: 'Dubai', name: 'Dubai Marina Mall', address: 'Level 1, Marina Mall', hours: '10:00 – 23:00 daily', phone: '+971 4 399 2277', mapUrl: '#' },
];

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { id: 't1', name: 'Aisha R.', location: 'Dubai Marina', date: 'March 2026', rating: 5, text: 'They reset my grandmother’s emeralds into a necklace I now wear weekly. The craftsmanship is faultless.' },
  { id: 't2', name: 'Rahul & Meera', location: 'Deira Boutique', date: 'January 2026', rating: 5, text: 'The private appointment made choosing our wedding set calm instead of overwhelming.' },
  { id: 't3', name: 'Fatima K.', location: 'Abu Dhabi', date: 'December 2025', rating: 5, text: 'Hallmarking, invoicing, buyback terms — everything was explained without pressure.' },
];

async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API}${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch (e) {
    return fallback;
  }
}

export const api = {
  products: {
    list: async (params?: { category?: string; tag?: string }) => {
      const qs = new URLSearchParams(params as Record<string, string>).toString();
      const res = await get<Product[]>(`/products${qs ? `?${qs}` : ''}`, FALLBACK_PRODUCTS);
      if (params?.category) {
        return res.filter((p) => p.category === params.category);
      }
      return res;
    },
    get: async (id: string) => {
      const list = await get<Product[]>('/products', FALLBACK_PRODUCTS);
      return list.find((p) => p.id === id) || FALLBACK_PRODUCTS[0];
    },
  },
  collections: {
    list: () => get<Collection[]>('/collections', FALLBACK_COLLECTIONS),
    get: async (slug: string) => {
      const list = await get<Collection[]>('/collections', FALLBACK_COLLECTIONS);
      return list.find((c) => c.slug === slug) || FALLBACK_COLLECTIONS[0];
    },
  },
  stores: {
    list: () => get<Store[]>('/stores', FALLBACK_STORES),
  },
  testimonials: {
    list: () => get<Testimonial[]>('/testimonials', FALLBACK_TESTIMONIALS),
  },
};
