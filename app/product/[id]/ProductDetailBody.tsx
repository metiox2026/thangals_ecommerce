'use client';

import React from 'react';
import Link from 'next/link';
import { Product, Review } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { Rating } from '@/components/Rating';
import { Disclosure } from './Disclosure';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalizedReview } from '@/lib/hooks/useLocalizedReview';
import { formatDecimal, formatNumber, NumberText, LocalizedText, localizeDigits } from '@/lib/format';
import type { Language } from '@/contexts/LanguageContext';

function renderDate(date: string, lang: Language): React.ReactNode {
  const match = date.match(/[\d٠-٩]{4}/);
  if (!match || lang !== 'AR') return date;
  const idx = match.index!;
  return (
    <>
      {date.slice(0, idx)}
      <LocalizedText value={match[0]} lang={lang} />
      {date.slice(idx + 4)}
    </>
  );
}

function Aed({ value }: { value: number }) {
  const { lang } = useLanguage();
  return (
    <span className="inline-flex items-baseline gap-0.5 tabular-nums lining-nums">
      <img src="/aed-symbol.svg" alt="" aria-hidden className="inline-block h-[0.85em] w-auto" />
      <NumberText value={value} lang={lang} />
    </span>
  );
}

interface ProductDetailBodyProps {
  product: Product;
  related: Product[];
  reviews: Review[];
}

export const ProductDetailBody: React.FC<ProductDetailBodyProps> = ({
  product,
  related,
  reviews,
}) => {
  const { t, lang } = useLanguage();

  const basePrice = product.price;
  const finalPrice =
    product.discountPct && product.discountPct > 0
      ? Math.round(basePrice * (1 - product.discountPct / 100))
      : basePrice;
  const baseMetalValue = Math.round(basePrice * 0.72);
  const makingCharges = basePrice - baseMetalValue;
  const discountAmount = basePrice - finalPrice;

  return (
    <>
      {/* Disclosures + Contact — full-width row below image on large screens */}
      <section className="mt-12 border-t border-[#E5DDD0] pt-10 lg:mt-16 lg:pt-12">
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-[1.6fr_1fr] lg:[direction:ltr]">
          <div className="space-y-2 text-xs text-[#444]">
            <Disclosure title={t('pdp.disclosure.hallmark.title')}>
              {t('pdp.disclosure.hallmark.body')}
            </Disclosure>
            <Disclosure title={t('pdp.disclosure.care.title')}>
              {t('pdp.disclosure.care.body')}
            </Disclosure>
            <Disclosure title={t('pdp.disclosure.shipping.title')}>
              {t('pdp.disclosure.shipping.body')}
            </Disclosure>
            <Disclosure title={t('pdp.disclosure.dimensions.title')}>
              {product.dimensions && product.dimensions.length > 0 ? (
                <div className="space-y-1.5">
                  {product.dimensions.map((d) => (
                    <div key={d.label} className="flex justify-between gap-4">
                      <span className="text-[#777]">{d.label}</span>
                      <span className="font-medium text-[#1C1C1C]">{localizeDigits(d.value, lang)}</span>
                    </div>
                  ))}
                  <p className="pt-2 text-[11px] text-[#777]">
                    {t('pdp.disclosure.dimensions.contact')}
                  </p>
                </div>
              ) : (
                <p>{t('pdp.disclosure.dimensions.empty')}</p>
              )}
            </Disclosure>
            <Disclosure title={t('pdp.disclosure.priceBreakup.title')}>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t('pdp.priceBreakup.metal', { metal: product.metal })}</span>
                  <Aed value={baseMetalValue} />
                </div>
                <div className="flex justify-between">
                  <span>{t('pdp.priceBreakup.making')}</span>
                  <Aed value={makingCharges} />
                </div>
                <div className="flex justify-between border-t border-[#E5DDD0] pt-2 font-medium">
                  <span>{t('pdp.priceBreakup.subtotal')}</span>
                  <Aed value={product.price} />
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#C89F53]">
                    <span>{t('pdp.priceBreakup.discount', { pct: product.discountPct ?? 0 })}</span>
                    <span>&minus;<Aed value={discountAmount} /></span>
                  </div>
                )}
                <div className="flex justify-between border-t border-[#E5DDD0] pt-2 font-serif text-base font-medium text-[#1A2621]">
                  <span>{t('pdp.priceBreakup.total')}</span>
                  <Aed value={finalPrice} />
                </div>
              </div>
            </Disclosure>
          </div>
          <div className="pt-6 lg:border-l lg:border-[#E5DDD0] lg:pl-8 lg:pt-0">
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#1A2621]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 14h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a1 1 0 0 1-1-1v-6Z" />
                <path d="M21 14h-2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-6Z" />
                <path d="M3 14a9 9 0 0 1 18 0" />
              </svg>
              {t('pdp.contact.eyebrow')}
            </p>
            <a
              href="tel:+97142261993"
              className="mt-2 inline-block font-sans text-2xl font-semibold tabular-nums lining-nums tracking-[0.02em] text-[#1A2621] hover:underline"
            >
              <LocalizedText value="+971 4 226 1993" lang={lang} />
            </a>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] text-[#444]">
              <Link href="/contact" className="hover:underline">
                {t('pdp.contact.returns')}
              </Link>
              <Link href="/contact" className="hover:underline">
                {t('pdp.contact.shipping')}
              </Link>
              <Link href="/contact" className="hover:underline">
                {t('pdp.contact.terms')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section id="related-products" className="mt-16 border-t border-[#E5DDD0] pt-12">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#C89F53] sm:text-[11px]">
              {t('pdp.related.eyebrow')}
            </p>
            <h2 className="mt-2 font-serif text-2xl font-normal text-[#1C1C1C] sm:text-3xl">
              {t('pdp.related.title')}
            </h2>
            <div className="mx-auto mt-3 h-[1px] w-10 bg-[#C89F53]" />
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && product.rating !== undefined && product.reviewCount !== undefined && (
        <section id="reviews" className="mt-16 border-t border-[#E5DDD0] pt-12 lg:mt-20 lg:pt-14">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#C89F53] sm:text-[11px]">
              {t('pdp.reviews.eyebrow')}
            </p>
            <h2 className="mt-2 font-serif text-2xl font-normal text-[#1C1C1C] sm:text-3xl">
              {t('pdp.reviews.title')}
            </h2>
            <div className="mx-auto mt-3 h-[1px] w-10 bg-[#C89F53]" />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
            {/* Aggregate */}
            <aside className="rounded-sm border border-[#E5DDD0] bg-[#FAF8F5] p-6 lg:p-7">
              <div className="flex items-baseline gap-2 font-serif text-[#1C1C1C]">
                <span className="text-5xl font-medium tabular-nums lining-nums">
                  <NumberText value={product.rating} lang={lang} fractionDigits={1} />
                </span>
                <span className="text-sm text-[#777]">{t('pdp.reviews.outOf')}</span>
              </div>
              <Rating value={product.rating} size="md" className="mt-3" />
              <p className="mt-3 text-xs leading-relaxed text-[#60736A]">
                {t('pdp.reviews.basedOn', {
                  n: product.reviewCount,
                })}
              </p>

              <div className="mt-5 space-y-1.5 border-t border-[#E5DDD0] pt-5">
                {(() => {
                  const totalReviews = product.reviewCount ?? 0;
                  const distribution = [5, 4, 3, 2, 1].map((stars) => {
                    const actualCount = reviews.filter((r) => Math.round(r.rating) === stars).length;
                    const proportion = reviews.length > 0 ? actualCount / reviews.length : 0;
                    const count = Math.round(proportion * totalReviews);
                    return {
                      stars,
                      count,
                      pct: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
                    };
                  });
                  return distribution.map(({ stars, count, pct }) => (
                    <div key={stars} className="flex items-center gap-2 text-[11px] text-[#60736A]">
                      <span className="w-3 tabular-nums">{localizeDigits(String(stars), lang)}</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#C89F53" aria-hidden="true">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E5DDD0]">
                        <div
                          className="h-full bg-[#C89F53]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-4 text-right tabular-nums"><NumberText value={count} lang={lang} /></span>
                    </div>
                  ));
                })()}
              </div>
            </aside>

            {/* Review list */}
            <div className="space-y-7">
              {reviews.map((r) => {
                const lr = useLocalizedReview(r);
                return (
                <article
                  key={r.id}
                  className="border-b border-[#E5DDD0] pb-7 last:border-b-0 last:pb-0"
                >
                  <header className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1C1C1C]">{lr.author}</p>
                      <p className="mt-0.5 text-[11px] text-[#777]">
                        {lr.location} · {renderDate(lr.date, lang)}
                      </p>
                    </div>
                    <Rating value={r.rating} size="sm" />
                  </header>
                  {lr.title && (
                    <h3 className="mt-3 text-sm font-medium text-[#1C1C1C]">{lr.title}</h3>
                  )}
                  <p className="mt-2 text-xs leading-relaxed text-[#444] sm:text-sm">
                    {lr.text}
                  </p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-emerald-700">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {t('pdp.reviews.verifiedBuyer')}
                  </p>
                </article>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
};
