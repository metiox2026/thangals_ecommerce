'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { SnapCarousel } from '@/components/SnapCarousel';
import { useLanguage } from '@/contexts/LanguageContext';
import { arHomeReviews } from '@/lib/translations/homeReviews';
import { formatDecimal, formatNumber, NumberText } from '@/lib/format';

type Review = {
  name: string;
  initial: string;
  location: string;
  time: string;
  isLocalGuide: boolean;
  rating: number;
  text: string;
};

// Customer reviews content (names, dates, locations, text) is translated via
// `arHomeReviews` keyed by the canonical English `name`. Only the UI badge
// ("Local Guide") uses the standard translation system.
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

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  const { t, lang } = useLanguage();
  const ar = lang === 'AR' ? arHomeReviews[review.name] : undefined;
  const name = ar?.name ?? review.name;
  const initial = ar?.initial ?? review.initial;
  const location = ar?.location ?? review.location;
  const time = ar?.time ?? review.time;
  const text = ar?.text ?? review.text;
  return (
    <article className="mr-6 flex w-[360px] shrink-0 flex-col rounded-2xl border border-[#E8EAED] bg-white p-6">
      <header className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#144B3C] to-[#0E372B] text-sm font-semibold text-white">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-[#1A2621]">{name}</p>
            {review.isLocalGuide && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#E8F0FE] px-2 py-0.5 text-[10px] font-medium text-[#1967D2]">
                <svg className="size-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2 4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
                </svg>
                {t('home.clients.localGuide')}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-[#5F6368]">
            {time} · {location}
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

      <p className="mt-4 text-sm leading-relaxed text-[#3C4043]">{text}</p>
    </article>
  );
};

interface HomeContentsProps {
  products: Product[];
}

export const HomeContents: React.FC<HomeContentsProps> = ({ products }) => {
  const { t, lang } = useLanguage();

  const newThisSeason = products.slice(0, 4);
  const mostLoved = products.slice(4, 8);

  const trustItems = [
    { key: 'home.trust.hallmarked', icon: 'shield' },
    { key: 'home.trust.natural', icon: 'diamond' },
    { key: 'home.trust.appointments', icon: 'calendar' },
    { key: 'home.trust.polishing', icon: 'sparkle' },
  ] as const;

  const categoryItems = [
    { key: 'home.category.earrings', cat: 'earrings', img: '/images/cat_earrings.jpg' },
    { key: 'home.category.rings', cat: 'rings', img: '/images/cat_rings.jpg' },
    { key: 'home.category.bracelets', cat: 'bracelets', img: '/images/cat_bracelets.jpg' },
    { key: 'home.category.necklaces', cat: 'necklaces', img: '/images/cat_necklaces.jpg' },
    { key: 'home.category.bangles', cat: 'bangles', img: '/images/cat_bangles.jpg' },
  ];

  const genderItems = [
    { titleKey: 'home.gender.women.title', descKey: 'home.gender.women.desc', img: '/images/gender-women.jpg', link: '/shop' },
    { titleKey: 'home.gender.men.title', descKey: 'home.gender.men.desc', img: '/images/gender-men.jpg', link: '/shop' },
    { titleKey: 'home.gender.kids.title', descKey: 'home.gender.kids.desc', img: '/images/gender-kids.jpg', link: '/shop' },
  ];

  const occasionItems = [
    { titleKey: 'home.occasion.bridal.title', descKey: 'home.occasion.bridal.desc', img: '/images/occasion_bridal.jpg', link: '/bridal' },
    { titleKey: 'home.occasion.everyday.title', descKey: 'home.occasion.everyday.desc', img: '/images/occasion_everyday.jpg', link: '/shop' },
    { titleKey: 'home.occasion.him.title', descKey: 'home.occasion.him.desc', img: '/images/occasion_men.jpg', link: '/shop' },
  ];

  return (
    <div>
      {/* ===== TRUST BAR (marquee) ===== */}
      <div dir="ltr" className="relative overflow-hidden border-y border-[#E2E7E4] bg-[#FAF8F4] py-3 lg:py-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#FAF8F4] to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#FAF8F4] to-transparent"></div>
        <div className="flex w-max animate-marquee-left whitespace-nowrap">
          {[...Array(4)].flatMap((_, dupIdx) =>
            trustItems.map((item) => (
              <div
                key={`${dupIdx}-${item.key}`}
                className="flex shrink-0 items-center gap-2 px-6 text-[10px] tracking-[0.16em] uppercase text-[#60736A] lg:gap-3 lg:px-10 lg:text-[13px] lg:tracking-[0.22em]"
              >
                <TrustIcon name={item.icon} />
                <span>{t(item.key)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== NEW THIS SEASON ===== */}
      <section className="bg-white mx-auto max-w-[1400px] px-5 py-12 lg:px-10">
        <div className="text-center">
          <p className="eyebrow">{t('home.season.eyebrow')}</p>
          <h2 className="mt-3 font-display text-3xl md:text-[2.6rem] md:leading-[1.15]">
            {t('home.season.title')}
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
            {t('home.season.cta')}
          </Link>
        </div>
      </section>

      {/* ===== SHOP BY CATEGORY ===== */}
      <section className="bg-white mx-auto max-w-[1400px] px-5 pt-0 pb-12 lg:px-10">
        <div className="text-center">
          <p className="eyebrow">{t('home.category.eyebrow')}</p>
          <h2 className="mt-3 font-display text-3xl md:text-[2.6rem] md:leading-[1.15]">
            {t('home.category.title')}
          </h2>
          <div className="rule-gold mt-5 mx-auto"></div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-5">
          {categoryItems.map((c) => {
            const name = t(c.key);
            return (
              <Link
                key={c.cat}
                href={`/shop?category=${c.cat}`}
                className="group block"
              >
                <div className="media-zoom border border-[#EAEAEA] bg-[#F2F6F4]">
                  <img
                    src={c.img}
                    alt={name}
                    loading="eager"
                    width={800}
                    height={800}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                <p className="mt-3 text-center text-[11px] tracking-[0.2em] uppercase text-[#1A2621] group-hover:text-[#144B3C] transition-colors">
                  {name}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== SHOP BY GENDER ===== */}
      <section className="bg-white mx-auto max-w-[1400px] px-5 py-12 lg:px-10 !pt-0">
        <div className="text-center">
          <p className="eyebrow">{t('home.gender.eyebrow')}</p>
          <h2 className="mt-3 font-display text-3xl md:text-[2.6rem] md:leading-[1.15]">
            {t('home.gender.title')}
          </h2>
          <div className="rule-gold mt-5 mx-auto"></div>
        </div>

        <SnapCarousel
          items={genderItems.map((g) => ({
            title: t(g.titleKey),
            desc: t(g.descKey),
            img: g.img,
            link: g.link,
          }))}
        />
      </section>

      {/* ===== SIGNATURE SPOTLIGHT — THE EMERALD SUITE ===== */}
      <section className="relative bg-[#0E372B]">
        <img
          src="/images/hero_bg.jpg"
          alt={t('home.signature.imgAlt')}
          loading="eager"
          className={`absolute inset-0 h-full w-full object-cover opacity-40 ${lang === 'AR' ? 'scale-x-[-1]' : ''}`}
        />
        <div className="relative mx-auto flex max-w-[1400px] items-center px-8 py-8 lg:px-20 lg:py-12">
          <div className="max-w-lg text-white">
            <p className="eyebrow !text-[#C89F53]">{t('home.signature.eyebrow')}</p>
            <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">{t('home.signature.title')}</h2>
            <div className="rule-gold mt-5"></div>
            <p className="mt-5 text-sm leading-relaxed opacity-85 md:text-base">
              {t('home.signature.body')}
            </p>
            <Link
              href="/collections"
              className="mt-8 inline-flex border border-[#C89F53] px-7 py-3 text-[11px] tracking-[0.22em] uppercase text-[#C89F53] transition-colors hover:bg-[#C89F53] hover:text-[#0E372B]"
            >
              {t('home.signature.cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SHOP BY OCCASION ===== */}
      <section className="bg-white mx-auto max-w-[1400px] px-5 py-12 lg:px-10">
        <div className="text-center">
          <p className="eyebrow">{t('home.occasion.eyebrow')}</p>
          <h2 className="mt-3 font-display text-3xl md:text-[2.6rem] md:leading-[1.15]">
            {t('home.occasion.title')}
          </h2>
          <div className="rule-gold mt-5 mx-auto"></div>
        </div>

        <SnapCarousel
          items={occasionItems.map((o) => ({
            title: t(o.titleKey),
            desc: t(o.descKey),
            img: o.img,
            link: o.link,
          }))}
        />
      </section>

      {/* ===== MOST LOVED ===== */}
      <section className="bg-white mx-auto max-w-[1400px] px-5 py-12 lg:px-10 !pt-0">
        <div className="text-center">
          <p className="eyebrow">{t('home.best.eyebrow')}</p>
          <h2 className="mt-3 font-display text-3xl md:text-[2.6rem] md:leading-[1.15]">
            {t('home.best.title')}
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
        <div className="mx-auto max-w-[1400px] px-5 pt-12 pb-6 text-center lg:px-10">
          <p className="eyebrow">{t('home.atelier.eyebrow')}</p>
          <h2 className="mt-3 font-display text-3xl md:text-[2.6rem] md:leading-[1.15]">
            {t('home.atelier.title')}
          </h2>
        </div>
        <video
          src="/craft-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="mb-12 w-full object-contain"
        />
      </section>

      {/* ===== GIFTING SECTION ===== */}
      <section className="bg-[#E5F0EB]">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-12 lg:grid-cols-2 lg:px-10">
          <img
            src="/images/gifting.jpg"
            alt={t('home.gifting.imgAlt')}
            loading="eager"
            width={1200}
            height={800}
            className="w-full object-cover"
          />
          <div>
            <div>
              <p className="eyebrow">{t('home.gifting.eyebrow')}</p>
              <h2 className="mt-3 font-display text-3xl md:text-[2.6rem] md:leading-[1.15]">
                {t('home.gifting.title')}
              </h2>
              <div className="rule-gold mt-5"></div>
              <p className="mt-5 text-sm leading-relaxed text-[#60736A] max-w-xl">
                {t('home.gifting.body')}
              </p>
            </div>
            <Link
              href="/shop"
              className="mt-8 inline-flex bg-[#144B3C] px-8 py-3.5 text-[11px] tracking-[0.22em] uppercase text-white transition-opacity hover:opacity-90"
            >
              {t('home.gifting.cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ===== VISIT US ===== */}
      <section className="bg-white mx-auto max-w-[1400px] px-5 py-12 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <div>
              <p className="eyebrow">{t('home.visit.eyebrow')}</p>
              <h2 className="mt-3 font-display text-3xl md:text-[2.6rem] md:leading-[1.15]">
                {t('home.visit.title')}
              </h2>
              <div className="rule-gold mt-5"></div>
              <p className="mt-5 text-sm leading-relaxed text-[#60736A] max-w-xl">
                {t('home.visit.body')}
              </p>
            </div>
            <Link
              href="/stores"
              className="mt-8 inline-flex border border-[#144B3C] px-8 py-3.5 text-[11px] tracking-[0.22em] uppercase text-[#144B3C] transition-colors hover:bg-[#144B3C] hover:text-white"
            >
              {t('home.visit.cta')}
            </Link>
          </div>
          <img
            src="/images/boutique.jpg"
            alt={t('home.visit.imgAlt')}
            loading="eager"
            width={1600}
            height={1008}
            className="w-full object-cover"
          />
        </div>
      </section>

      {/* ===== TESTIMONIALS / CLIENTS ===== */}
      <section className="border-t border-[#E2E7E4] bg-[#FAF8F4]">
        <div className="mx-auto max-w-[1400px] px-5 py-14 lg:px-10">
          <div className="text-center">
            <p className="eyebrow">{t('home.clients.eyebrow')}</p>
            <h2 className="mt-3 font-display text-3xl md:text-[2.6rem] md:leading-[1.15]">
              {t('home.clients.title')}
            </h2>
            <div className="rule-gold mt-5 mx-auto"></div>

            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#E8EAED] bg-white px-3.5 py-1.5 shadow-sm md:gap-3 md:px-5 md:py-2.5">
              <svg className="size-4 md:size-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="size-3.5 fill-[#FBBC05] md:size-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs font-semibold text-[#1A2621] md:text-sm"><NumberText value={4.9} lang={lang} fractionDigits={1} /></span>
              <span className="text-xs text-[#5F6368] md:text-sm">
                · {t('home.clients.googleReviews', { n: 320 })}
              </span>
            </div>
          </div>

          <div dir="ltr" className="relative mt-14 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#FAF8F4] to-transparent"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#FAF8F4] to-transparent"></div>
            <div className="flex w-max animate-marquee-left">
              {[...row1, ...row1].map((review, i) => (
                <ReviewCard key={`r1-${review.name}-${i}`} review={review} />
              ))}
            </div>
          </div>

          <div dir="ltr" className="relative mt-6 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#FAF8F4] to-transparent"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#FAF8F4] to-transparent"></div>
            <div className="flex w-max animate-marquee-right">
              {[...row2, ...row2].map((review, i) => (
                <ReviewCard key={`r2-${review.name}-${i}`} review={review} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== EDITORIAL / SEO CONTENT ===== */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="eyebrow">{t('home.editorial.eyebrow')}</p>
              <h2 className="mt-3 font-display text-3xl md:text-[2.6rem] md:leading-[1.15]">
                {t('home.editorial.title')}
              </h2>
              <div className="rule-gold mt-5"></div>
            </div>
            <div className="space-y-5 text-sm leading-relaxed text-[#60736A]">
              <p>{t('home.editorial.body1')}</p>
              <p>{t('home.editorial.body2')}</p>
              <p>{t('home.editorial.body3')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Trust-bar icons — extracted from inline JSX so the data array stays clean.
const TrustIcon: React.FC<{ name: 'shield' | 'diamond' | 'calendar' | 'sparkle' }> = ({ name }) => {
  const className = 'size-4 text-[#144B3C] lg:size-5';
  switch (name) {
    case 'shield':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
      );
    case 'diamond':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <path d="M6 3h12l4 6-10 12L2 9z"></path>
          <path d="M11 3 8 9l4 12 4-12-3-6"></path>
          <path d="M2 9h20"></path>
        </svg>
      );
    case 'calendar':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <path d="M8 2v4"></path>
          <path d="M16 2v4"></path>
          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
          <path d="M3 10h18"></path>
        </svg>
      );
    case 'sparkle':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
          <path d="M20 2v4"></path>
          <path d="M22 4h-4"></path>
          <circle cx="4" cy="20" r="2"></circle>
        </svg>
      );
  }
};
