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
  dimensions?: { label: string; value: string }[];
  sizes?: string[];
  sizeGuideNote?: string;
  sizeVariants?: { size: string; price: number; dimension: string }[];
  purity?: '22K' | '18K' | '14K';
  metalColor?: 'yellow' | 'rose' | 'white';
  rating?: number;
  reviewCount?: number;
  ordersCount?: number;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  location: string;
  date: string;
  rating: number;
  title?: string;
  text: string;
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
  lat: number;
  lng: number;
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
    images: ['/images/cat_rings.jpg', '/images/veda-solitaire-2.png', '/images/veda-solitaire-3.png', '/images/veda-solitaire-4.png'],
    description: `This classic solitaire showcases a hand-selected brilliant-cut diamond set on a slender 18K yellow gold band, allowing the stone's fire and clarity to take centre stage. The understated four-claw setting lifts the diamond just enough to let light move through every facet, while the polished band keeps the silhouette clean and timeless.

The 0.40 ct centre stone pairs effortlessly with everything from everyday wear to formal occasions, making it an enduring choice for an engagement ring, a milestone gift, or a self-purchased heirloom. Crafted in 18K yellow gold with a 1.8 mm band, it sits comfortably on the hand and stacks beautifully alongside our pavé and eternity bands.`,
    metal: '18K Yellow Gold',
    stone: 'Diamond',
    inStock: true,
    gender: 'women',
    occasion: 'wedding',
    weightGrams: 4.2,
    purity: '18K',
    metalColor: 'yellow',
    dimensions: [
      { label: 'Band width', value: '1.8 mm' },
      { label: 'Centre stone', value: '4.8 mm round brilliant · 0.40 ct' },
      { label: 'Top dimension', value: '6.8 mm' },
    ],
    sizes: ['5', '6', '7', '8', '9', '10', '11'],
    sizeGuideNote: 'US ring size. Complimentary resizing available within 60 days.',
    sizeVariants: [
      { size: '5', price: 4196, dimension: '3.6 g · Ø 15.7 mm' },
      { size: '6', price: 4408, dimension: '3.8 g · Ø 16.5 mm' },
      { size: '7', price: 4632, dimension: '4.0 g · Ø 17.3 mm' },
      { size: '8', price: 4850, dimension: '4.2 g · Ø 18.1 mm' },
      { size: '9', price: 5065, dimension: '4.4 g · Ø 19.0 mm' },
      { size: '10', price: 5303, dimension: '4.6 g · Ø 19.8 mm' },
      { size: '11', price: 5516, dimension: '4.8 g · Ø 20.6 mm' },
    ],
    rating: 4.9,
    reviewCount: 312,
    ordersCount: 1240,
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
    description: `These perfectly matched brilliant-cut diamond studs are secured in classic 18K yellow gold four-claw settings, with secure butterfly backs designed for daily wear. Each stone is hand-paired for size, cut and colour so the pair reads as a single, harmonious set from every angle.

At 0.15 ct total diamond weight, the Miras sit close to the ear with a refined, understated sparkle — equally at home in the office, at dinner, or paired with an updo for an occasion. A quiet, considered staple in any fine-jewellery collection.`,
    metal: '18K Yellow Gold',
    stone: 'Diamond',
    inStock: true,
    gender: 'women',
    occasion: 'everyday',
    weightGrams: 2.1,
    purity: '18K',
    metalColor: 'yellow',
    dimensions: [
      { label: 'Stone size (each)', value: '3.4 mm round brilliant' },
      { label: 'Total diamond weight', value: '0.15 ct (pair)' },
      { label: 'Post length', value: '10 mm' },
    ],
    rating: 4.8,
    reviewCount: 86,
    ordersCount: 320,
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
    description: `Sixteen matched Zambian emeralds are closed-set in a single line across a polished 18K yellow gold band, separated by fine pavé diamonds that catch the light between each stone. The emeralds are carefully calibrated for a uniform, saturated green — the deep, slightly bluish tone our house is named for.

Worn on its own, the bracelet sits as a refined statement along the wrist; layered with our Zumurud pendant or stacked with delicate gold chains, it becomes part of a considered suite. Each emerald is hand-selected in Zambia and cut to fit the line setting precisely, so the bracelet feels continuous and fluid in motion.`,
    metal: '18K Yellow Gold',
    stone: 'Emerald & Diamond',
    inStock: true,
    gender: 'women',
    occasion: 'festive',
    weightGrams: 18.5,
    discountPct: 10,
    purity: '18K',
    metalColor: 'yellow',
    dimensions: [
      { label: 'Length', value: '17 cm + 2 cm extender' },
      { label: 'Width', value: '4.5 mm' },
      { label: 'Emeralds', value: '3 × 4 mm each · 16 stones' },
    ],
    sizes: ['15 cm', '16 cm', '17 cm', '18 cm', '19 cm'],
    sizeGuideNote: 'Wrist circumference. Add 1.5–2 cm to your wrist for a comfortable fit.',
    sizeVariants: [
      { size: '15 cm', price: 5647, dimension: '16.3 g · 15 cm' },
      { size: '16 cm', price: 6024, dimension: '17.4 g · 16 cm' },
      { size: '17 cm', price: 6400, dimension: '18.5 g · 17 cm' },
      { size: '18 cm', price: 6776, dimension: '19.6 g · 18 cm' },
      { size: '19 cm', price: 7153, dimension: '20.7 g · 19 cm' },
    ],
    rating: 4.9,
    reviewCount: 247,
    ordersCount: 580,
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
    description: `A single pear-shaped Zambian emerald is suspended from a hand-formed 18K yellow gold bail on a fine 1.1 mm curb chain, the stone dropping 22 mm from the collarbone. The emerald's rich, slightly bluish green — our signature Zumurud tone — is the focal point, framed by just enough gold to let it breathe.

The pendant is lightweight enough for everyday wear, with an extender that lets the chain sit at 40, 42, 45 or 50 cm depending on the neckline. Layer it with the Saira chain for a soft, stacked look, or wear it alone as a quiet statement close to the throat.`,
    metal: '18K Yellow Gold',
    stone: 'Emerald',
    inStock: true,
    gender: 'women',
    occasion: 'everyday',
    weightGrams: 3.4,
    purity: '18K',
    metalColor: 'yellow',
    dimensions: [
      { label: 'Chain length', value: '45 cm + 5 cm extender' },
      { label: 'Pendant drop', value: '22 mm' },
      { label: 'Emerald', value: '8 × 6 mm pear-cut' },
    ],
    sizes: ['40 cm', '42 cm', '45 cm', '50 cm'],
    sizeGuideNote: 'Total chain length. Includes extender where applicable.',
    sizeVariants: [
      { size: '40 cm', price: 871, dimension: '3.0 g · 40 cm' },
      { size: '42 cm', price: 915, dimension: '3.2 g · 42 cm' },
      { size: '45 cm', price: 980, dimension: '3.4 g · 45 cm' },
      { size: '50 cm', price: 1089, dimension: '3.8 g · 50 cm' },
    ],
    rating: 4.7,
    reviewCount: 142,
    ordersCount: 510,
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
    description: `This pair of 22K yellow gold bangles is worked entirely by hand in the filigree tradition passed down through our atelier — fine threads of gold twisted, soldered and finished into an intricate, lace-like pattern. Each bangle takes several days to complete, with every motif drawn from the bridal jewellery of South India.

The 2.4 in inner diameter is the standard women's size, and the 8 mm width gives the bangles presence without weight. Worn as a pair for a ceremony, or stacked three or four deep with other Kanmani pieces for a fuller bridal look, they soften and become more luminous the more they are worn.`,
    metal: '22K Yellow Gold',
    inStock: true,
    gender: 'women',
    occasion: 'bridal',
    weightGrams: 32,
    purity: '22K',
    metalColor: 'yellow',
    dimensions: [
      { label: 'Inner diameter', value: '61 mm · 2.4 in (standard women’s)' },
      { label: 'Width', value: '8 mm each' },
      { label: 'Set', value: 'Pair' },
    ],
    sizes: ['2.2 in', '2.4 in', '2.6 in', '2.8 in'],
    sizeGuideNote: 'Inner diameter. 2.4 in is the most common women’s size.',
    sizeVariants: [
      { size: '2.2 in', price: 3443, dimension: '29.4 g · Ø 56 mm' },
      { size: '2.4 in', price: 3750, dimension: '32.0 g · Ø 61 mm' },
      { size: '2.6 in', price: 4057, dimension: '34.6 g · Ø 66 mm' },
      { size: '2.8 in', price: 4364, dimension: '37.2 g · Ø 71 mm' },
    ],
    rating: 5.0,
    reviewCount: 198,
    ordersCount: 410,
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
    description: `Forty-two brilliant-cut diamonds are set in a continuous pavé across a polished 18K yellow gold band, the stones calibrated to a uniform 1.3 mm for a clean, uninterrupted line of light around the finger. Total diamond weight is 0.45 ct, set deep enough to sit flush and low-profile for everyday wear.

The 3.5 mm band width makes this an effortless stacker alongside our solitaire and half-eternity rings, and equally elegant worn alone as a wedding band, anniversary ring, or milestone piece. Pavé settings are inspected by hand at every stage to ensure the stones sit secure and the goldwork remains crisp.`,
    metal: '18K Yellow Gold',
    stone: 'Diamond',
    inStock: true,
    gender: 'women',
    occasion: 'wedding',
    weightGrams: 5.6,
    purity: '18K',
    metalColor: 'yellow',
    dimensions: [
      { label: 'Band width', value: '3.5 mm' },
      { label: 'Stones', value: '1.3 mm round pavé · 42 diamonds' },
      { label: 'Total diamond weight', value: '0.45 ct' },
    ],
    sizes: ['5', '6', '7', '8', '9', '10', '11'],
    sizeGuideNote: 'US ring size. Complimentary resizing available within 60 days.',
    sizeVariants: [
      { size: '5', price: 1860, dimension: '4.8 g · Ø 15.7 mm' },
      { size: '6', price: 1954, dimension: '5.1 g · Ø 16.5 mm' },
      { size: '7', price: 2053, dimension: '5.3 g · Ø 17.3 mm' },
      { size: '8', price: 2150, dimension: '5.6 g · Ø 18.1 mm' },
      { size: '9', price: 2245, dimension: '5.8 g · Ø 19.0 mm' },
      { size: '10', price: 2350, dimension: '6.1 g · Ø 19.8 mm' },
      { size: '11', price: 2445, dimension: '6.4 g · Ø 20.6 mm' },
    ],
    rating: 4.8,
    reviewCount: 174,
    ordersCount: 620,
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
    description: `This featherlight 18K yellow gold curb chain is designed specifically for layering — at just 1.1 mm wire thickness and 1.8 g at 45 cm, it sits close to the neck without weight or drag. The links are tightly calibrated so the chain catches light in a continuous, even shimmer rather than individual glints.

Available in 40, 42, 45 and 50 cm lengths, the Saira chain moves from a choker to a longer pendant drop with a simple extender. Wear it solo as a daily staple, layer two or three at different lengths, or pair it with the Amara pendant for a considered, everyday suite.`,
    metal: '18K Yellow Gold',
    inStock: true,
    gender: 'women',
    occasion: 'everyday',
    weightGrams: 1.8,
    discountPct: 25,
    purity: '18K',
    metalColor: 'yellow',
    dimensions: [
      { label: 'Chain length', value: '45 cm' },
      { label: 'Wire thickness', value: '1.1 mm' },
      { label: 'Clasp', value: 'Lobster' },
    ],
    sizes: ['40 cm', '42 cm', '45 cm', '50 cm'],
    sizeGuideNote: 'Total chain length. Designed for layering.',
    sizeVariants: [
      { size: '40 cm', price: 640, dimension: '1.6 g · 40 cm' },
      { size: '42 cm', price: 672, dimension: '1.7 g · 42 cm' },
      { size: '45 cm', price: 720, dimension: '1.8 g · 45 cm' },
      { size: '50 cm', price: 800, dimension: '2.0 g · 50 cm' },
    ],
    rating: 4.7,
    reviewCount: 421,
    ordersCount: 1890,
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
    description: `Oval Zambian emeralds sit in simple 18K yellow gold bezel settings, the soft, open bezel framing each stone without crowding it. The 7 × 5 mm size gives the emeralds presence at the ear while keeping the silhouette refined and wearable for everyday.

The deep, slightly bluish green — our Zumurud tone — reads beautifully against both warm gold and cool silver tones, making the Ilm studs a versatile bridge between collections. Secure 11 mm posts and matched butterfly backs keep them comfortable from morning to evening.`,
    metal: '18K Yellow Gold',
    stone: 'Emerald',
    inStock: true,
    gender: 'women',
    occasion: 'festive',
    weightGrams: 2.8,
    purity: '18K',
    metalColor: 'yellow',
    dimensions: [
      { label: 'Stone size (each)', value: '7 × 5 mm oval' },
      { label: 'Setting', value: '18K gold bezel' },
      { label: 'Post length', value: '11 mm' },
    ],
    rating: 4.8,
    reviewCount: 96,
    ordersCount: 280,
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
  { id: 's1', emirate: 'Dubai', name: 'Gold Land Building, Deira', address: 'Gold Land Building, Shop No G 3-4, Deira, Dubai, UAE', hours: '10:00 – 22:30, Sun–Sat', phone: '+971 4 547 6633', mapUrl: '#', lat: 25.2697, lng: 55.2974 },
  { id: 's2', emirate: 'Dubai', name: 'Meena Bazaar, Bur Dubai', address: 'Manzoor Building, Meena Bazar, Bur Dubai, Dubai, UAE', hours: '10:00 – 22:30, Sun–Sat', phone: '+971 4 284 4115', mapUrl: '#', lat: 25.2637, lng: 55.2979 },
  { id: 's3', emirate: 'Dubai', name: 'Satwa', address: 'Shop 3, Khatija Building, Al Hudaiba Road, Al Satwa, Dubai, UAE', hours: '10:00 – 22:30, Sun–Sat', phone: '+971 4 320 8779', mapUrl: '#', lat: 25.2280, lng: 55.2634 },
  { id: 's4', emirate: 'Dubai', name: 'Ithra, Al Ras', address: 'Hind Plaza 5, Shop No.7, Plot no. 635, Al Ras, Dubai, UAE', hours: '10:00 – 23:00, Sun–Sat', phone: '+971 4 334 5150', mapUrl: '#', lat: 25.2709, lng: 55.2959 },
  { id: 's5', emirate: 'Dubai', name: 'Dubai Investment Park', address: 'Fakhree Center, Shop No. 6, Plot no. 597-350, DIP 2, Dubai, UAE', hours: '10:00 – 22:30, Sun–Sat', phone: '+971 4 256 1876', mapUrl: '#', lat: 24.9846, lng: 55.1609 },
  { id: 's6', emirate: 'Dubai', name: 'Al Ras, Deira', address: 'Shamaal Building, Near Al Ras Metro, Deira, Dubai, UAE', hours: '10:00 – 22:30, Sun–Sat', phone: '+971 4 348 1833', mapUrl: '#', lat: 25.2681, lng: 55.2942 },
  { id: 's7', emirate: 'Dubai', name: 'Al Fahidi Street, Bur Dubai', address: 'BCCI Building, Shop No.1, Al Souk Al Kabir, Al Fahidi Street, Bur Dubai, Dubai, UAE', hours: '10:00 – 22:30, Sun–Sat', phone: '+971 4 337 7176', mapUrl: '#', lat: 25.2638, lng: 55.2993 },
  { id: 's8', emirate: 'Dubai', name: 'Royal Diamond, Deira Gold Souq', address: 'Royal Diamond Building, Opp Multi Level Parking, Deira Gold Souq, Dubai, UAE', hours: '10:00 – 22:30, Sun–Sat', phone: '+971 4 547 7779', mapUrl: '#', lat: 25.2706, lng: 55.2978 },
  { id: 's9', emirate: 'Dubai', name: 'Al Shamal, Deira Gold Souq', address: 'Shop 15, Al Shamal Building, Opp Multi Level Parking, Deira Gold Souq, Dubai, UAE', hours: '10:00 – 22:30, Sun–Sat', phone: '+971 4 349 8379', mapUrl: '#', lat: 25.2698, lng: 55.2969 },
  { id: 's10', emirate: 'Dubai', name: 'Marhaba, Deira', address: 'Shop No. 8, Marhaba Plaza Building, Al Dhagaya Street, Dubai Gold Souk, Deira, Dubai, UAE', hours: '09:30 – 22:30, Sun–Sat', phone: '+971 42 694 202', mapUrl: '#', lat: 25.2701, lng: 55.2974 },
  { id: 's11', emirate: 'Dubai', name: 'Karama Center, Al Karama', address: 'Shop No. 38A, Ground Floor, Karama Center, Al Karama, Dubai, UAE', hours: '09:30 – 22:30, Sun–Sat', phone: '+971 4 330 8664', mapUrl: '#', lat: 25.2456, lng: 55.3037 },
  { id: 's12', emirate: 'Sharjah', name: 'Rolla, Sharjah', address: 'Mutawa Building, Shop No. 03, Al Ghuwair Street, Sharjah, UAE', hours: '10:00 – 22:30, Sun–Sat', phone: '+971 6 523 4996', mapUrl: '#', lat: 25.3598, lng: 55.3935 },
  { id: 's13', emirate: 'Sharjah', name: 'Thangals Manufacturing (Thangals Gold FZE)', address: 'Warehouse A2 – 049, SAIF Zone, Sharjah, UAE', hours: '09:00 – 20:00', phone: '+971 6 542 5240', mapUrl: '#', lat: 25.3216, lng: 55.6437 },
  { id: 's14', emirate: 'Dubai', name: 'Thangals Wholesale', address: 'Office M10, Mezzanine Floor, Gold Land Building, Al Khaleej Street, Deira, Dubai, UAE', hours: '10:00 – 20:00', phone: '+971 4 343 3006', mapUrl: '#', lat: 25.2697, lng: 55.2974 },
  { id: 's15', emirate: 'Doha', name: 'Doha Gold Souq', address: 'Shop 81, Ganam Center, Gold Souq, Doha, Qatar', hours: 'Sat–Thu 10:00 – 22:00; Fri 14:30 – 22:00', phone: '+974 4417 1395', mapUrl: '#', lat: 25.2865, lng: 51.5349 },
  { id: 's16', emirate: 'Trivandrum', name: 'Kaniyapuram, Trivandrum', address: 'S.H Building, near KSRTC Depot, Kaniyapuram, Trivandrum, Kerala 695301, India', hours: '09:30 – 20:30, Sun–Sat', phone: '+91 471 299 4916', mapUrl: '#', lat: 8.5892, lng: 76.8536 },
  { id: 's17', emirate: 'Kozhikode', name: 'Koduvally, Kozhikode', address: 'Ground Floor, 29/41, OK Building, Ottakanjira, Koduvally, Kozhikkode, Kerala 673572, India', hours: '09:30 – 20:30, Sun–Sat', phone: '+91 495 296 3916', mapUrl: '#', lat: 11.3713, lng: 75.9132 },
  { id: 's18', emirate: 'Muscat', name: 'Muscat, Al Qurum', address: 'Fanja House, Near Sabco Shopping Center, Al Qurum, Muscat, Oman', hours: 'Sat–Thu 10:00 – 13:00 & 16:30 – 22:00; Fri 16:30 – 22:00', phone: '+968 9820 8558', mapUrl: '#', lat: 23.6143, lng: 58.4675 },
  { id: 's19', emirate: 'Kuala Lumpur', name: 'Kuala Lumpur', address: 'Suite 6, Sentral Suites, Wisma C&S Jasani, 21-2 Jalan Tuanku Abdul Rahman, 50100 Kuala Lumpur, Malaysia', hours: '09:00 – 21:00, Sun–Sat', phone: '+603 2202 7136', mapUrl: '#', lat: 3.1578, lng: 101.6947 },
  { id: 's20', emirate: 'Singapore', name: 'Centrium Square', address: '320 Serangoon Road 02-10, Centrium Square, Singapore 218108', hours: '10:30 – 18:30, Mon–Sat', phone: '+65 9476 3003', mapUrl: '#', lat: 1.3067, lng: 103.8536 },
];

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { id: 't1', name: 'Aisha R.', location: 'Dubai Marina', date: 'March 2026', rating: 5, text: 'They reset my grandmother’s emeralds into a necklace I now wear weekly. The craftsmanship is faultless.' },
  { id: 't2', name: 'Rahul & Meera', location: 'Deira Boutique', date: 'January 2026', rating: 5, text: 'The private appointment made choosing our wedding set calm instead of overwhelming.' },
  { id: 't3', name: 'Fatima K.', location: 'Abu Dhabi', date: 'December 2025', rating: 5, text: 'Hallmarking, invoicing, buyback terms — everything was explained without pressure.' },
];

const FALLBACK_REVIEWS: Review[] = [
  { id: 'r1', productId: 'veda-solitaire-ring', author: 'Priya M.', location: 'Sharjah', date: 'February 2026', rating: 5, title: 'Better than I expected', text: 'The diamond is genuinely stunning in person — the four-claw setting lifts it just enough. Resizing was included and done in a week.' },
  { id: 'r2', productId: 'veda-solitaire-ring', author: 'Daniel R.', location: 'Dubai Marina', date: 'December 2025', rating: 5, text: 'Bought this for my fiancée. The hallmark paperwork and the boutique experience were both impeccable.' },
  { id: 'r3', productId: 'veda-solitaire-ring', author: 'Mariam K.', location: 'Abu Dhabi', date: 'October 2025', rating: 4, text: 'Beautiful ring, sits comfortably. Wish the band was a touch thicker but the diamond more than makes up for it.' },
  { id: 'r4', productId: 'mira-diamond-studs', author: 'Aisha N.', location: 'Dubai', date: 'January 2026', rating: 5, text: 'Perfect size for everyday. The matching is really clean — you cannot tell which is left or right.' },
  { id: 'r5', productId: 'mira-diamond-studs', author: 'Lina F.', location: 'Ajman', date: 'November 2025', rating: 5, text: 'Light, secure, and the sparkle is understated exactly as I wanted. I wear them almost daily.' },
  { id: 'r6', productId: 'zumurud-emerald-line-bracelet', author: 'Sara T.', location: 'Dubai', date: 'March 2026', rating: 5, title: 'Heirloom quality', text: 'The emeralds are deep and saturated — exactly the colour shown online. I have layered it with my grandmother\'s bangles and it sits beautifully.' },
  { id: 'r7', productId: 'zumurud-emerald-line-bracelet', author: 'Hala M.', location: 'Sharjah', date: 'February 2026', rating: 5, text: 'Bought it as a self-gift after a promotion. The clasp is solid, the emeralds match perfectly. Worth every dirham.' },
  { id: 'r8', productId: 'amara-emerald-drop-pendant', author: 'Reema S.', location: 'Dubai', date: 'January 2026', rating: 5, text: 'The pendant drop is exactly the right length. I get compliments every time I wear it.' },
  { id: 'r9', productId: 'amara-emerald-drop-pendant', author: 'Noora H.', location: 'Abu Dhabi', date: 'September 2025', rating: 4, text: 'Lovely pendant. The chain is delicate so you have to be careful with it, but the emerald is gorgeous.' },
  { id: 'r10', productId: 'kanmani-filigree-bangles', author: 'Ananya V.', location: 'Dubai', date: 'March 2026', rating: 5, title: 'My wedding set', text: 'I wore these for my wedding and three other ceremonies. They have softened beautifully and feel personal.' },
  { id: 'r11', productId: 'kanmani-filigree-bangles', author: 'Meera J.', location: 'Trivandrum', date: 'January 2026', rating: 5, text: 'You can see the handwork in every motif. These are not machine-made and it shows. Heirloom pieces.' },
  { id: 'r12', productId: 'noor-pave-band', author: 'Tara B.', location: 'Dubai', date: 'February 2026', rating: 5, text: 'Stacks perfectly with my engagement ring. The pavé is tight and the band sits low — exactly what I wanted.' },
  { id: 'r13', productId: 'noor-pave-band', author: 'Yasmin A.', location: 'Sharjah', date: 'November 2025', rating: 5, text: 'Bought this as an anniversary band. The diamonds catch light from every angle without looking ostentatious.' },
  { id: 'r14', productId: 'saira-layering-chain', author: 'Huda K.', location: 'Dubai', date: 'March 2026', rating: 5, title: 'My everyday staple', text: 'I have bought three of these in different lengths and wear them stacked. Light enough to forget they are there.' },
  { id: 'r15', productId: 'saira-layering-chain', author: 'Farah D.', location: 'Dubai', date: 'January 2026', rating: 5, text: 'Featherlight is right. The lobster clasp is solid and the links are well finished.' },
  { id: 'r16', productId: 'saira-layering-chain', author: 'Layla M.', location: 'Abu Dhabi', date: 'October 2025', rating: 4, text: 'Great chain for the price. I deducted one star only because the 45 cm sits slightly longer on me than expected.' },
  { id: 'r17', productId: 'ilm-emerald-studs', author: 'Nadia P.', location: 'Dubai', date: 'February 2026', rating: 5, text: 'The bezels frame the emeralds without crowding them. Wearable from morning to evening.' },
  { id: 'r18', productId: 'ilm-emerald-studs', author: 'Aaliya R.', location: 'Sharjah', date: 'December 2025', rating: 5, text: 'The green is deep and bluish — true to the photos. I get compliments constantly.' },
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

export function getPriceForSize(product: Product, size: string | null): number {
  let price = product.price;
  if (size && product.sizeVariants) {
    const variant = product.sizeVariants.find((v) => v.size === size);
    if (variant) price = variant.price;
  }
  if (product.discountPct && product.discountPct > 0) {
    price = Math.round(price * (1 - product.discountPct / 100));
  }
  return price;
}

export function getDimensionForSize(product: Product, size: string | null): string | null {
  if (!size || !product.sizeVariants) return null;
  const variant = product.sizeVariants.find((v) => v.size === size);
  return variant ? variant.dimension : null;
}

export function getMinSizePrice(product: Product): number | null {
  if (!product.sizeVariants || product.sizeVariants.length === 0) return null;
  const minPrice = Math.min(...product.sizeVariants.map((v) => v.price));
  if (product.discountPct && product.discountPct > 0) {
    return Math.round(minPrice * (1 - product.discountPct / 100));
  }
  return minPrice;
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
  reviews: {
    list: () => get<Review[]>('/reviews', FALLBACK_REVIEWS),
    forProduct: (productId: string) =>
      get<Review[]>(`/reviews?productId=${productId}`, FALLBACK_REVIEWS.filter((r) => r.productId === productId)),
  },
};
