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
  images?: string[];
  description: string;
  metal: string;
  stone?: string;
  inStock: boolean;
  gender?: 'women' | 'men' | 'kids';
  occasion?: 'bridal' | 'everyday' | 'festive' | 'wedding';
  weightGrams?: number;
  discountPct?: number;
  purity?: '22K' | '18K' | '14K';
  metalColor?: 'yellow' | 'rose' | 'white';
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
    images: ['/images/cat_rings.jpg', '/images/atelier-1.jpg', '/images/emerald_suite.png', '/images/atelier-3.jpg'],
    description: 'A timeless solitaire in 18K yellow gold, set with a brilliant-cut diamond hand-selected for its fire and clarity.',
    metal: '18K Yellow Gold',
    stone: 'Diamond',
    inStock: true,
    gender: 'women',
    occasion: 'wedding',
    weightGrams: 4.2,
    purity: '18K',
    metalColor: 'yellow',
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
    images: ['/images/cat_earrings.jpg', '/images/atelier-2.jpg', '/images/atelier-4.jpg', '/images/hero_bg.jpg'],
    description: 'Perfectly matched brilliant-cut diamonds in secure 18K yellow gold butterfly backs.',
    metal: '18K Yellow Gold',
    stone: 'Diamond',
    inStock: true,
    gender: 'women',
    occasion: 'everyday',
    weightGrams: 2.1,
    purity: '18K',
    metalColor: 'yellow',
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
    images: ['/images/cat_bracelets.jpg', '/images/emerald_suite.png', '/images/atelier-1.jpg', '/images/atelier-2.jpg'],
    description: 'Sixteen matched Zambian emeralds closed-set in 18K gold and separated by pavé diamonds.',
    metal: '18K Yellow Gold',
    stone: 'Emerald & Diamond',
    inStock: true,
    gender: 'women',
    occasion: 'festive',
    weightGrams: 18.5,
    discountPct: 10,
    purity: '18K',
    metalColor: 'yellow',
  },
  {
    id: 'amara-emerald-drop-pendant',
    name: 'Amara Emerald Drop Pendant',
    subtitle: '18K Gold · Emerald',
    price: 980,
    currency: 'AED',
    category: 'necklaces',
    image: '/images/cat_necklaces.jpg',
    images: ['/images/cat_necklaces.jpg', '/images/atelier-3.jpg', '/images/hero_bg.jpg', '/images/atelier-4.jpg'],
    description: 'A single pear-shaped Zambian emerald suspended from an 18K gold bail on a fine curb chain.',
    metal: '18K Yellow Gold',
    stone: 'Emerald',
    inStock: true,
    gender: 'women',
    occasion: 'everyday',
    weightGrams: 3.4,
    purity: '18K',
    metalColor: 'yellow',
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
    images: ['/images/cat_bangles.jpg', '/images/atelier-1.jpg', '/images/atelier-2.jpg', '/images/hero_bg.jpg'],
    description: 'A pair of bangles worked entirely by hand with intricate filigree.',
    metal: '22K Yellow Gold',
    inStock: true,
    gender: 'women',
    occasion: 'bridal',
    weightGrams: 32,
    purity: '22K',
    metalColor: 'yellow',
  },
  {
    id: 'noor-pave-band',
    name: 'Noor Pavé Band',
    subtitle: '18K Yellow Gold · Diamond',
    price: 2150,
    currency: 'AED',
    category: 'rings',
    image: '/images/cat_rings.jpg',
    images: ['/images/cat_rings.jpg', '/images/atelier-4.jpg', '/images/atelier-3.jpg', '/images/emerald_suite.png'],
    description: 'Forty-two brilliant-cut diamonds set in a continuous pavé across an 18K yellow gold band.',
    metal: '18K Yellow Gold',
    stone: 'Diamond',
    inStock: true,
    gender: 'women',
    occasion: 'wedding',
    weightGrams: 5.6,
    purity: '18K',
    metalColor: 'yellow',
  },
  {
    id: 'saira-layering-chain',
    name: 'Saira Layering Chain',
    subtitle: '18K Yellow Gold',
    price: 720,
    currency: 'AED',
    category: 'necklaces',
    image: '/images/cat_necklaces.jpg',
    images: ['/images/cat_necklaces.jpg', '/images/hero_bg.jpg', '/images/atelier-1.jpg', '/images/atelier-3.jpg'],
    description: 'A featherlight 45cm curb chain in 18K yellow gold, designed specifically for layering.',
    metal: '18K Yellow Gold',
    inStock: true,
    gender: 'women',
    occasion: 'everyday',
    weightGrams: 1.8,
    discountPct: 25,
    purity: '18K',
    metalColor: 'yellow',
  },
  {
    id: 'ilm-emerald-studs',
    name: 'Ilm Emerald Studs',
    subtitle: '18K Gold · Emerald',
    price: 1640,
    currency: 'AED',
    category: 'earrings',
    image: '/images/cat_earrings.jpg',
    images: ['/images/cat_earrings.jpg', '/images/atelier-2.jpg', '/images/emerald_suite.png', '/images/atelier-4.jpg'],
    description: 'Oval Zambian emeralds in a simple 18K gold bezel setting.',
    metal: '18K Yellow Gold',
    stone: 'Emerald',
    inStock: true,
    gender: 'women',
    occasion: 'festive',
    weightGrams: 2.8,
    purity: '18K',
    metalColor: 'yellow',
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

export type GenderFilter = 'women' | 'men' | 'kids';
export type OccasionFilter = 'bridal' | 'everyday' | 'festive' | 'wedding';
export type PriceFilter = 'u1000' | '1000-3000' | '3000-6000' | '6000plus';
export type WeightFilter = 'lt5' | '5-15' | '15-30' | '30plus';
export type DiscountFilter = '10plus' | '25plus' | '50plus';
export type PurityFilter = '22K' | '18K' | '14K';
export type MetalColorFilter = 'yellow' | 'rose' | 'white';

export interface ProductFilters {
  category?: Product['category'] | Product['category'][];
  gender?: GenderFilter | GenderFilter[];
  occasion?: OccasionFilter | OccasionFilter[];
  price?: PriceFilter | PriceFilter[];
  weight?: WeightFilter | WeightFilter[];
  discount?: DiscountFilter | DiscountFilter[];
  purity?: PurityFilter | PurityFilter[];
  metalColor?: MetalColorFilter | MetalColorFilter[];
}

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

function matchPrice(price: number, band: PriceFilter): boolean {
  if (band === 'u1000') return price < 1000;
  if (band === '1000-3000') return price >= 1000 && price <= 3000;
  if (band === '3000-6000') return price > 3000 && price <= 6000;
  if (band === '6000plus') return price > 6000;
  return true;
}

function matchWeight(weight: number, band: WeightFilter): boolean {
  if (band === 'lt5') return weight < 5;
  if (band === '5-15') return weight >= 5 && weight <= 15;
  if (band === '15-30') return weight > 15 && weight <= 30;
  if (band === '30plus') return weight > 30;
  return true;
}

function asArray<T>(v: T | T[] | undefined): T[] | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v : [v];
}

function includesAny<T>(productValue: T | undefined, candidates: T | T[] | undefined): boolean {
  const list = asArray(candidates);
  if (list === undefined) return true;
  if (productValue === undefined) return false;
  return list.includes(productValue);
}

function matchPriceAny(price: number, candidates: PriceFilter | PriceFilter[] | undefined): boolean {
  const list = asArray(candidates);
  if (list === undefined) return true;
  return list.some((b) => matchPrice(price, b));
}

function matchWeightAny(
  weight: number | undefined,
  candidates: WeightFilter | WeightFilter[] | undefined,
): boolean {
  const list = asArray(candidates);
  if (list === undefined) return true;
  if (weight === undefined) return false;
  return list.some((b) => matchWeight(weight, b));
}

function matchDiscountAny(
  discountPct: number,
  candidates: DiscountFilter | DiscountFilter[] | undefined,
): boolean {
  const list = asArray(candidates);
  if (list === undefined) return true;
  return list.some((d) => {
    if (d === '10plus') return discountPct >= 10;
    if (d === '25plus') return discountPct >= 25;
    if (d === '50plus') return discountPct >= 50;
    return false;
  });
}

export const api = {
  products: {
    list: async (params?: ProductFilters) => {
      const qs = params
        ? new URLSearchParams(
            Object.entries(params).flatMap(([k, v]) => {
              if (v === undefined) return [];
              const arr = Array.isArray(v) ? v : [v];
              return arr.map((val) => [k, String(val)]);
            }) as [string, string][],
          ).toString()
        : '';
      const res = await get<Product[]>(`/products${qs ? `?${qs}` : ''}`, FALLBACK_PRODUCTS);
      if (!params) return res;
      return res.filter((p) => {
        if (!includesAny(p.category, params.category)) return false;
        if (!includesAny(p.gender, params.gender)) return false;
        if (!includesAny(p.occasion, params.occasion)) return false;
        if (!includesAny(p.purity, params.purity)) return false;
        if (!includesAny(p.metalColor, params.metalColor)) return false;
        if (!matchPriceAny(p.price, params.price)) return false;
        if (!matchWeightAny(p.weightGrams, params.weight)) return false;
        if (!matchDiscountAny(p.discountPct ?? 0, params.discount)) return false;
        return true;
      });
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
