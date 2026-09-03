import React from 'react';
import Link from 'next/link';
import { api, Product } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { HeroCarousel } from '@/components/HeroCarousel';

type Review = {
  name: string;
  initial: string;
  location: string;
  time: string;
  isLocalGuide: boolean;
  rating: number;
  text: string;
};

const row1: Review[] = [
  {
    name: 'Aisha R.',
    initial: 'A',
    location: 'Dubai Marina',
    time: '2 weeks ago',
    isLocalGuide: true,
    rating: 5,
    text: "They reset my grandmother's emeralds into a necklace I now wear weekly. The craftsmanship is faultless and the team made the whole process feel deeply personal.",
  },
  {
    name: 'Yusuf A.',
    initial: 'Y',
    location: 'Dubai Hills',
    time: '2 months ago',
    isLocalGuide: true,
    rating: 5,
    text: 'Bought a 22K signet for our anniversary. The hallmarking paperwork was explained line by line — exactly what you want from a heritage house.',
  },
  {
    name: 'Layla H.',
    initial: 'L',
    location: 'Al Ain',
    time: '5 days ago',
    isLocalGuide: false,
    rating: 5,
    text: 'Travelled from Al Ain for a private viewing and it was worth every kilometre. Calm, unhurried, no pushy upsells.',
  },
  {
    name: 'Nadia S.',
    initial: 'N',
    location: 'Jumeirah',
    time: '4 weeks ago',
    isLocalGuide: true,
    rating: 5,
    text: 'My everyday chain snapped after five years and they repaired it the same afternoon, free of charge. That is old-school service.',
  },
];

const row2: Review[] = [
  {
    name: 'Rahul & Meera',
    initial: 'R',
    location: 'Deira Boutique',
    time: '1 month ago',
    isLocalGuide: false,
    rating: 5,
    text: 'The private appointment made choosing our wedding set calm instead of overwhelming. Every detail — from chai to the final hallmark check — was handled with care.',
  },
  {
    name: 'Fatima K.',
    initial: 'F',
    location: 'Abu Dhabi',
    time: '3 weeks ago',
    isLocalGuide: true,
    rating: 5,
    text: 'Hallmarking, invoicing, buyback terms — everything was explained without pressure. A truly transparent experience from start to finish.',
  },
  {
    name: 'Omar K.',
    initial: 'O',
    location: 'Business Bay',
    time: '6 weeks ago',
    isLocalGuide: false,
    rating: 4,
    text: 'Beautiful curb chain, slightly longer wait than promised for the resize — but the finish on the clasp was impeccable. Will return.',
  },
  {
    name: 'Sara M.',
    initial: 'S',
    location: 'Sharjah',
    time: '1 week ago',
    isLocalGuide: false,
    rating: 5,
    text: 'First time buying fine jewellery and the karigar walked me through every choice without making me feel small. Came away with a bracelet I adore.',
  },
];

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <article className="flex w-[360px] shrink-0 flex-col rounded-2xl border border-[#E8EAED] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
    <header className="flex items-center gap-3">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#144B3C] to-[#0E372B] text-sm font-semibold text-white">
        {review.initial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-[#1A2621]">{review.name}</p>
          {review.isLocalGuide && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#E8F0FE] px-2 py-0.5 text-[10px] font-medium text-[#1967D2]">
              <svg className="size-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2 4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
              </svg>
              Local Guide
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-[#5F6368]">
          {review.time} · {review.location}
        </p>
      </div>
    </header>

    <div className="mt-4 flex items-center gap-1">
      {[...Array(review.rating)].map((_, i) => (
        <svg key={i} className="size-4 fill-[#FBBC05]" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
      <svg className="ml-1 size-4" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    </div>

    <p className="mt-4 text-sm leading-relaxed text-[#3C4043]">{review.text}</p>
  </article>
);

export default async function HomePage() {
  let products: Product[] = [];

  try {
    products = await api.products.list();
  } catch (e) {
    console.error('API fetch error on homepage:', e);
  }

  const newThisSeason = products.slice(0, 4);
  const mostLoved = products.slice(4, 8);

  return (
    <div>
      {/* ===== HERO CAROUSEL ===== */}
      <HeroCarousel />

      {/* ===== TRUST BAR ===== */}
      <div className="border-y border-[#E2E7E4] bg-[#FAF8F4] py-6">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 px-5 md:grid-cols-4 lg:px-10">
          <div className="flex flex-col items-center gap-3 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-[#144B3C]">
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            <span className="text-[10px] leading-relaxed tracking-[0.16em] uppercase text-[#60736A]">
              Hallmarked 22K &amp; 18K Gold
            </span>
          </div>

          <div className="flex flex-col items-center gap-3 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-[#144B3C]">
              <path d="M6 3h12l4 6-10 12L2 9z"></path>
              <path d="M11 3 8 9l4 12 4-12-3-6"></path>
              <path d="M2 9h20"></path>
            </svg>
            <span className="text-[10px] leading-relaxed tracking-[0.16em] uppercase text-[#60736A]">
              Natural Emeralds &amp; Diamonds
            </span>
          </div>

          <div className="flex flex-col items-center gap-3 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-[#144B3C]">
              <path d="M8 2v4"></path>
              <path d="M16 2v4"></path>
              <rect width="18" height="18" x="3" y="4" rx="2"></rect>
              <path d="M3 10h18"></path>
            </svg>
            <span className="text-[10px] leading-relaxed tracking-[0.16em] uppercase text-[#60736A]">
              Private Appointments
            </span>
          </div>

          <div className="flex flex-col items-center gap-3 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-[#144B3C]">
              <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
              <path d="M20 2v4"></path>
              <path d="M22 4h-4"></path>
              <circle cx="4" cy="20" r="2"></circle>
            </svg>
            <span className="text-[10px] leading-relaxed tracking-[0.16em] uppercase text-[#60736A]">
              Complimentary Polishing
            </span>
          </div>
        </div>
      </div>

      {/* ===== SHOP BY CATEGORY (100% EXACT MATCH) ===== */}
      <section className="bg-white mx-auto max-w-[1400px] px-5 py-20 lg:px-10">
        <div className="text-center">
          <p className="eyebrow">Browse</p>
          <h2 className="mt-3 font-display text-3xl md:text-[2.6rem] md:leading-[1.15]">
            Shop by Category
          </h2>
          <div className="rule-gold mt-5 mx-auto"></div>
          <p className="mt-5 text-sm leading-relaxed text-[#60736A] mx-auto max-w-xl">
            Five houses of jewellery, one standard of finishing.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-5">
          {[
            { name: 'Earrings', cat: 'earrings', img: '/images/cat_earrings.jpg' },
            { name: 'Rings', cat: 'rings', img: '/images/cat_rings.jpg' },
            { name: 'Bracelets', cat: 'bracelets', img: '/images/cat_bracelets.jpg' },
            { name: 'Necklaces', cat: 'necklaces', img: '/images/cat_necklaces.jpg' },
            { name: 'Bangles', cat: 'bangles', img: '/images/cat_bangles.jpg' },
          ].map((c) => (
            <Link
              key={c.cat}
              href={`/shop?category=${c.cat}`}
              className="group block"
            >
              <div className="media-zoom border border-[#EAEAEA] bg-[#F2F6F4]">
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  width={800}
                  height={800}
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <p className="mt-3 text-center text-[11px] tracking-[0.2em] uppercase text-[#1A2621] group-hover:text-[#144B3C] transition-colors">
                {c.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== NEW THIS SEASON ===== */}
      <section className="bg-white mx-auto max-w-[1400px] px-5 py-20 lg:px-10 !pt-0">
        <div className="text-center">
          <p className="eyebrow">Just In</p>
          <h2 className="mt-3 font-display text-3xl md:text-[2.6rem] md:leading-[1.15]">
            New This Season
          </h2>
          <div className="rule-gold mt-5 mx-auto"></div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {newThisSeason.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex border border-[#144B3C] px-8 py-3 text-[11px] tracking-[0.2em] uppercase text-[#144B3C] transition-colors hover:bg-[#144B3C] hover:text-white"
          >
            View all jewellery
          </Link>
        </div>
      </section>

      {/* ===== SHOP BY GENDER ===== */}
      <section className="bg-white mx-auto max-w-[1400px] px-5 py-20 lg:px-10 !pt-0">
        <div className="text-center">
          <p className="eyebrow">For Everyone</p>
          <h2 className="mt-3 font-display text-3xl md:text-[2.6rem] md:leading-[1.15]">
            Shop By Gender
          </h2>
          <div className="rule-gold mt-5 mx-auto"></div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { title: 'Women', desc: 'Necklaces, earrings, rings & bridal sets', img: '/images/gender-women.jpg', link: '/shop' },
            { title: 'Men', desc: 'Signets, cuffs and curb chains', img: '/images/gender-men.jpg', link: '/shop' },
            { title: 'Kids & Teen', desc: 'Lightweight gold, made for everyday', img: '/images/gender-kids.jpg', link: '/shop' },
          ].map((tile) => (
            <Link key={tile.title} href={tile.link} className="group block">
              <div className="media-zoom relative bg-[#F2F6F4]">
                <img
                  src={tile.img}
                  alt={tile.title}
                  loading="lazy"
                  width={912}
                  height={1200}
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-display text-2xl text-[#1A2621]">{tile.title}</h3>
                <p className="mt-1 text-sm text-[#60736A]">{tile.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== SIGNATURE SPOTLIGHT — THE EMERALD SUITE ===== */}
      <section className="relative bg-[#0E372B]">
        <img
          src="/images/hero_bg.jpg"
          alt="The Emerald Suite"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="relative mx-auto flex max-w-[1400px] items-center px-8 py-10 lg:px-20 lg:py-16">
          <div className="max-w-lg text-white">
            <p className="eyebrow !text-[#C89F53]">Signature Piece</p>
            <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">The Emerald Suite</h2>
            <div className="rule-gold mt-5"></div>
            <p className="mt-5 text-sm leading-relaxed opacity-85 md:text-base">
              Zambian emeralds, matched over months for tone and saturation, then closed-set in 22K gold so the colour carries across the whole suite — necklace, jhumkas, ring.
            </p>
            <Link
              href="/collections"
              className="mt-8 inline-flex border border-[#C89F53] px-7 py-3 text-[11px] tracking-[0.22em] uppercase text-[#C89F53] transition-colors hover:bg-[#C89F53] hover:text-[#0E372B]"
            >
              Discover
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SHOP BY OCCASION ===== */}
      <section className="bg-white mx-auto max-w-[1400px] px-5 py-20 lg:px-10">
        <div className="text-center">
          <p className="eyebrow">Curated</p>
          <h2 className="mt-3 font-display text-3xl md:text-[2.6rem] md:leading-[1.15]">
            Shop by Occasion
          </h2>
          <div className="rule-gold mt-5 mx-auto"></div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Bridal',
              desc: 'Ceremonial sets in emerald and 22K gold',
              img: '/images/occasion_bridal.jpg',
              link: '/bridal',
            },
            {
              title: 'Everyday Fine',
              desc: 'Featherlight chains made for layering',
              img: '/images/occasion_everyday.jpg',
              link: '/shop',
            },
            {
              title: 'For Him',
              desc: 'Signets, cuffs and curb chains',
              img: '/images/occasion_men.jpg',
              link: '/shop',
            },
          ].map((occ) => (
            <Link key={occ.title} href={occ.link} className="group block">
              <div className="media-zoom relative bg-[#F2F6F4]">
                <img
                  src={occ.img}
                  alt={occ.title}
                  loading="lazy"
                  width={912}
                  height={1200}
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-display text-2xl text-[#1A2621]">{occ.title}</h3>
                <p className="mt-1 text-sm text-[#60736A]">{occ.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== MOST LOVED ===== */}
      <section className="bg-white mx-auto max-w-[1400px] px-5 py-20 lg:px-10 !pt-0">
        <div className="text-center">
          <p className="eyebrow">Most Loved</p>
          <h2 className="mt-3 font-display text-3xl md:text-[2.6rem] md:leading-[1.15]">
            Best Sellers
          </h2>
          <div className="rule-gold mt-5 mx-auto"></div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {mostLoved.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ===== FULL-WIDTH CRAFT VIDEO ===== */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1400px] px-5 pt-20 text-center lg:px-10">
          <p className="eyebrow">Inside the Atelier</p>
          <h2 className="mt-3 font-display text-3xl md:text-[2.6rem] md:leading-[1.15]">
            Where the metal becomes memory
          </h2>
          <div className="rule-gold mt-5 mx-auto"></div>
        </div>
        <video
          src="/craft-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full object-contain"
        />
      </section>

      {/* ===== GIFTING SECTION ===== */}
      <section className="bg-[#E5F0EB]">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-10">
          <img
            src="/images/gifting.jpg"
            alt="White gift box tied with a deep green ribbon beside gold earrings"
            loading="lazy"
            width={1200}
            height={800}
            className="w-full object-cover"
          />
          <div>
            <div>
              <p className="eyebrow">Gifting</p>
              <h2 className="mt-3 font-display text-3xl md:text-[2.6rem] md:leading-[1.15]">
                Wrapped in green, kept for years
              </h2>
              <div className="rule-gold mt-5"></div>
              <p className="mt-5 text-sm leading-relaxed text-[#60736A] max-w-xl">
                Every piece leaves the boutique in our signature ivory box with a hand-tied emerald ribbon, a hallmark certificate and a note in your own words.
              </p>
            </div>
            <Link
              href="/shop"
              className="mt-8 inline-flex bg-[#144B3C] px-8 py-3.5 text-[11px] tracking-[0.22em] uppercase text-white transition-opacity hover:opacity-90"
            >
              Shop gifts
            </Link>
          </div>
        </div>
      </section>

      {/* ===== VISIT US ===== */}
      <section className="bg-white mx-auto max-w-[1400px] px-5 py-20 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <div>
              <p className="eyebrow">Visit Us</p>
              <h2 className="mt-3 font-display text-3xl md:text-[2.6rem] md:leading-[1.15]">
                Nine boutiques across the Emirates
              </h2>
              <div className="rule-gold mt-5"></div>
              <p className="mt-5 text-sm leading-relaxed text-[#60736A] max-w-xl">
                Book a private viewing room, bring in an heirloom to be reset, or simply try on the new season with a cardamom chai.
              </p>
            </div>
            <Link
              href="/stores"
              className="mt-8 inline-flex border border-[#144B3C] px-8 py-3.5 text-[11px] tracking-[0.22em] uppercase text-[#144B3C] transition-colors hover:bg-[#144B3C] hover:text-white"
            >
              Find a boutique
            </Link>
          </div>
          <img
            src="/images/boutique.jpg"
            alt="Interior of a Thangals boutique with marble, gold and green detailing"
            loading="lazy"
            width={1600}
            height={1008}
            className="w-full object-cover"
          />
        </div>
      </section>

      {/* ===== TESTIMONIALS / CLIENTS ===== */}
      <section className="border-t border-[#E2E7E4] bg-[#FAF8F4]">
        <div className="mx-auto max-w-[1400px] px-5 py-24 lg:px-10">
          <div className="text-center">
            <p className="eyebrow">Clients</p>
            <h2 className="mt-3 font-display text-3xl md:text-[2.6rem] md:leading-[1.15]">
              In Their Words
            </h2>
            <div className="rule-gold mt-5 mx-auto"></div>

            <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-[#E8EAED] bg-white px-5 py-2.5 shadow-sm">
              <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="size-4 fill-[#FBBC05]" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-[#1A2621]">4.9</span>
              <span className="text-sm text-[#5F6368]">· 320 Google reviews</span>
            </div>
          </div>

          {/* Marquee row 1 — scrolls left */}
          <div className="relative mt-14 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#FAF8F4] to-transparent"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#FAF8F4] to-transparent"></div>
            <div className="flex w-max gap-6 animate-marquee-left">
              {[...row1, ...row1].map((review, i) => (
                <ReviewCard key={`r1-${review.name}-${i}`} review={review} />
              ))}
            </div>
          </div>

          {/* Marquee row 2 — scrolls right */}
          <div className="relative mt-6 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#FAF8F4] to-transparent"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#FAF8F4] to-transparent"></div>
            <div className="flex w-max gap-6 animate-marquee-right">
              {[...row2, ...row2].map((review, i) => (
                <ReviewCard key={`r2-${review.name}-${i}`} review={review} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== EDITORIAL / SEO CONTENT ===== */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="eyebrow">A Brief Guide</p>
              <h2 className="mt-3 font-display text-3xl md:text-[2.6rem] md:leading-[1.15]">
                Buying Gold &amp; Diamond Jewellery in Dubai
              </h2>
              <div className="rule-gold mt-5"></div>
            </div>
            <div className="space-y-5 text-sm leading-relaxed text-[#60736A]">
              <p>
                Dubai has long been the Gulf’s most trusted market for hallmarked gold and certified diamonds. Every piece sold at Thangals is stamped with a UAE hallmark confirming its karat weight, and every diamond above 0.30 carat is accompanied by an international grading certificate from GIA, IGI or HRD.
              </p>
              <p>
                Our karigars work the metal by hand in our Deira atelier, using techniques handed down across three generations. That is why our pieces are lighter to wear, easier to repair and simple to reset into a new design when your taste changes.
              </p>
              <p>
                We buy back any Thangals piece at the prevailing 22K or 18K rate, less making, on the day of return. It is one of the simplest and most transparent buyback policies in the country.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
