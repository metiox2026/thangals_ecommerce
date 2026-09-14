'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Product,
  getPriceForSize,
  getMinSizePrice,
  getDimensionForSize,
} from '@/lib/api';
import { InstallmentPlansModal } from '@/components/InstallmentPlansModal';
import { ProductActionArea } from './ProductActionArea';
import { Rating } from '@/components/Rating';
import { useLocalizedProduct } from '@/lib/hooks/useLocalizedProduct';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatNumber, NumberText, localizeDigits } from '@/lib/format';

interface ProductRightColumnProps {
  product: Product;
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

function SpecRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-[#777]">{label}</span>
      <span className={`font-medium ${highlight ? 'text-emerald-700' : 'text-[#1C1C1C]'}`}>
        {value}
      </span>
    </div>
  );
}

const TRUST_ICONS = {
  hallmark: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  shipping: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  ),
  resize: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M14 15H9v-6" />
      <path d="M16 3h5v5" />
      <path d="M21 3 9 15" />
    </svg>
  ),
  engrave: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L11 16l-4 1 1-4Z" />
    </svg>
  ),
  exchange: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  ),
  returns: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h11a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5h-4" />
    </svg>
  ),
};

function TrustItem({
  icon,
  label,
  className = '',
}: {
  icon: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex w-full min-w-0 flex-row items-center justify-start gap-0.5 text-left ${className}`}>
      <span className="flex size-9 shrink-0 items-center justify-center text-[#1A3A2A]">{icon}</span>
      <span className="text-[10px] leading-tight text-[#555] [text-wrap:balance]">{label}</span>
    </div>
  );
}

const TAG_KEYS: Record<string, string> = {
  'best-seller': 'tag.bestSeller',
  new: 'tag.new',
  signature: 'tag.signature',
  heritage: 'tag.heritage',
};

export const ProductRightColumn: React.FC<ProductRightColumnProps> = ({ product }) => {
  const { t, lang } = useLanguage();
  const p = useLocalizedProduct(product);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [tabbyOpen, setTabbyOpen] = useState(false);

  const hasSizes = (p.sizes?.length ?? 0) > 0;
  const tagLabel = p.tag ? t(TAG_KEYS[p.tag] ?? '') || p.tag : null;
  const metalColorLabel = p.metalColor ? t(`filter.metalColor.${p.metalColor}`) : null;
  const productCode = `THG-${p.id.replace(/-/g, '').slice(0, 8).toUpperCase()}`;

  const currentPrice = getPriceForSize(p, selectedSize);
  const minSizePrice = getMinSizePrice(p);
  const sizeDimension = getDimensionForSize(p, selectedSize);
  const installmentAmount = Math.round(currentPrice / 4);

  const isShowingFrom = hasSizes && !selectedSize && minSizePrice !== null;
  const headlinePrice = isShowingFrom && minSizePrice !== null ? minSizePrice : currentPrice;
  const showStrikeThrough =
    p.discountPct !== undefined &&
    p.discountPct > 0 &&
    !isShowingFrom;

  return (
    <div className="flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          {tagLabel && (
            <span className="inline-flex items-center justify-center rounded-sm bg-gradient-to-r from-[#FBE7B6] via-[#E8CB85] to-[#C89F53] px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest text-black shadow-sm">
              {tagLabel}
            </span>
          )}
        </div>
        <h1 className="mt-3 font-serif text-2xl font-normal text-[#1C1C1C] sm:text-3xl">
          {p.name}
        </h1>
        {p.rating !== undefined && (
          <Link
            href="#reviews"
            className="mt-2 inline-flex rounded-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89F53] focus-visible:ring-offset-2"
            aria-label={t('pdp.jumpToReviews', { n: p.reviewCount ?? 0 })}
          >
            <Rating
              value={p.rating}
              size="sm"
              showValue
              reviewCount={p.reviewCount}
            />
          </Link>
        )}
        <p className="mt-2 text-sm text-[#777]">{p.subtitle}</p>
        <p className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-[#999]">
          {t('pdp.codePrefix')} {productCode}
        </p>

        <div className="mt-6 flex items-baseline gap-3 font-jost text-2xl font-medium text-black">
          {isShowingFrom && (
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#60736A]">
              {t('pdp.from')}
            </span>
          )}
          <span className="flex items-baseline gap-1.5 tabular-nums lining-nums">
            <img
              src="/aed-symbol.svg"
              alt="AED"
              className="inline-block h-[0.85em] w-auto translate-y-[0.05em]"
            />
            <NumberText value={headlinePrice} lang={lang} />
          </span>
          {showStrikeThrough && p.price !== currentPrice && (
            <span className="flex items-baseline gap-1 text-sm text-[#999] line-through">
              <img
                src="/aed-symbol.svg"
                alt=""
                aria-hidden
                className="inline-block h-[0.85em] w-auto opacity-80"
              />
              <NumberText value={p.price} lang={lang} />
            </span>
          )}
          {p.discountPct !== undefined && p.discountPct > 0 && !isShowingFrom && (
            <span className="text-xs font-medium text-[#C89F53]">
              <NumberText value={p.discountPct} lang={lang} />% {t('pdp.off')}
            </span>
          )}
        </div>

        <p className="mt-2 text-[10px] tracking-wide text-[#777]">
          {isShowingFrom ? `${t('pdp.finalPriceDepends')} ` : ''}
          {t('pdp.priceExcludesVat')}
        </p>

        <div className="mt-2 flex w-full items-center gap-3 rounded-sm border border-[#E5DDD0] bg-[#FAF8F5] px-4 py-3 text-xs text-[#555] lg:hidden">
          <div className="flex shrink-0 flex-col gap-1">
            <img
              src="/tabby-logo.avif"
              alt="Tabby"
              width={64}
              height={22}
              className="h-6 w-auto rounded-sm"
            />
            <img
              src="/tamara-logo.jpg"
              alt="Tamara"
              width={64}
              height={22}
              className="h-5 w-auto rounded-sm"
            />
          </div>
          <p className="ml-auto text-right leading-snug">
            {t('pdp.asLowAs')}{' '}
            <strong className="font-semibold text-[#1A2621]"><Aed value={installmentAmount} /></strong>
            <span className="block text-[11px] text-[#777]">
              {t('pdp.installmentsMobile')}{' '}
              <button
                type="button"
                onClick={() => setTabbyOpen(true)}
                className="cursor-pointer font-semibold text-emerald-800 underline-offset-4 hover:underline"
              >
                {t('pdp.learnMore')}
              </button>
            </span>
          </p>
        </div>
        <div className="mt-2 hidden w-full items-center gap-3 rounded-sm border border-[#E5DDD0] bg-[#FAF8F5] px-4 py-3 text-sm text-[#555] lg:flex">
          <div className="flex shrink-0 items-center gap-1.5">
            <img
              src="/tabby-logo.avif"
              alt="Tabby"
              width={64}
              height={22}
              className="h-6 w-auto rounded-sm"
            />
            <img
              src="/tamara-logo.jpg"
              alt="Tamara"
              width={64}
              height={22}
              className="h-6 w-auto rounded-sm"
            />
          </div>
          <p className="ml-auto text-right leading-snug">
            {t('pdp.asLowAs')}{' '}
            <strong className="font-semibold text-[#1A2621]">
              <Aed value={installmentAmount} />
            </strong>{' '}
            {t('pdp.installmentsDesktop')}{' '}
            <button
              type="button"
              onClick={() => setTabbyOpen(true)}
              className="cursor-pointer font-semibold text-emerald-800 underline-offset-4 hover:underline"
            >
              {t('pdp.learnMore')}
            </button>
          </p>
        </div>

        <InstallmentPlansModal
          open={tabbyOpen}
          onClose={() => setTabbyOpen(false)}
          price={currentPrice}
        />

        <div className="mt-6">
          <ProductActionArea
            product={p}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
          />
        </div>

        <div className="mt-4 flex flex-col pb-2 lg:mt-6 lg:pb-3">
          <div className="order-1 mt-4 flex flex-row items-center justify-between gap-1.5 text-[10px] text-[#555]">
            <span className="inline-flex items-center gap-0.5">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-emerald-700"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>
                <span className="font-medium text-emerald-700">{t('pdp.pickupAvailable')}</span> {t('pdp.pickupSuffix')}
              </span>
            </span>
            <span className="inline text-[#C89F53]">·</span>
            <span>{t('pdp.freeDelivery')}</span>
          </div>

          <div className="order-2 mt-2 grid grid-cols-1 gap-0 sm:gap-0 lg:grid-cols-2 lg:gap-x-3 lg:gap-y-1 lg:[direction:ltr]">
            <TrustItem icon={TRUST_ICONS.hallmark} label={t('pdp.trust.hallmark')} />
            <TrustItem icon={TRUST_ICONS.shipping} label={t('pdp.trust.shipping')} />
            <TrustItem icon={TRUST_ICONS.engrave} label={t('pdp.trust.engrave')} />
            <TrustItem icon={TRUST_ICONS.exchange} label={t('pdp.trust.maintenance')} />
            <TrustItem icon={TRUST_ICONS.returns} label={t('pdp.trust.returns')} />
          </div>
        </div>

        <div className="mt-6 space-y-3 border-t border-[#E5DDD0] pt-6">
          {p.description.split(/\n\s*\n/).map((para, i) => (
            <p key={i} className="text-xs leading-relaxed text-[#444]">
              {para}
            </p>
          ))}
        </div>

        {/* Specifications */}
        <div className="mt-6 space-y-2 border-t border-[#E5DDD0] pt-6 text-xs text-[#444]">
          <SpecRow label={t('pdp.spec.brand')} value="Thangals" />
          <SpecRow label={t('pdp.spec.metal')} value={p.metal} />
          {p.stone && <SpecRow label={t('pdp.spec.stone')} value={p.stone} />}
          {sizeDimension ? (
            <SpecRow label={t('pdp.spec.dimensions')} value={localizeDigits(sizeDimension, lang)} highlight />
          ) : (
            p.weightGrams !== undefined && (
              <SpecRow label={t('pdp.spec.weight')} value={`${localizeDigits(String(p.weightGrams), lang)} ${t('units.gram')}`} />
            )
          )}
          {p.purity && <SpecRow label={t('pdp.spec.purity')} value={t(`filter.purity.${p.purity}`)} />}
          {metalColorLabel && <SpecRow label={t('pdp.spec.metalColor')} value={metalColorLabel} />}
          {p.occasion && (
            <SpecRow
              label={t('pdp.spec.designedFor')}
              value={t(`filter.option.${p.occasion}`)}
            />
          )}
          <SpecRow label={t('pdp.spec.certification')} value={t('pdp.certHallmark')} />
          <SpecRow
            label={t('pdp.spec.availability')}
            value={t('pdp.availability')}
            highlight
          />
        </div>
      </div>
    </div>
  );
};