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

interface ProductRightColumnProps {
  product: Product;
}

function Aed({ value }: { value: number }) {
  return (
    <span className="inline-flex items-baseline gap-0.5 tabular-nums lining-nums">
      <img src="/aed-symbol.svg" alt="" aria-hidden className="inline-block h-[0.85em] w-auto" />
      {value.toLocaleString()}
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
    <div className={`flex w-[88px] flex-col items-center gap-1.5 text-center sm:w-auto ${className}`}>
      <span className="flex size-9 items-center justify-center text-[#1A3A2A]">{icon}</span>
      <span className="whitespace-nowrap text-[10px] leading-tight text-[#555]">{label}</span>
    </div>
  );
}

const TAG_LABELS: Record<string, string> = {
  'best-seller': 'Best Seller',
  new: 'New',
  signature: 'Signature',
  heritage: 'Heritage',
};

export const ProductRightColumn: React.FC<ProductRightColumnProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [tabbyOpen, setTabbyOpen] = useState(false);

  const hasSizes = (product.sizes?.length ?? 0) > 0;
  const tagLabel = product.tag ? TAG_LABELS[product.tag] ?? product.tag : null;
  const metalColorLabel = product.metalColor
    ? product.metalColor.charAt(0).toUpperCase() + product.metalColor.slice(1) + ' Gold'
    : null;
  const productCode = `THG-${product.id.replace(/-/g, '').slice(0, 8).toUpperCase()}`;

  const currentPrice = getPriceForSize(product, selectedSize);
  const minSizePrice = getMinSizePrice(product);
  const sizeDimension = getDimensionForSize(product, selectedSize);
  const installmentAmount = Math.round(currentPrice / 4);

  const isShowingFrom = hasSizes && !selectedSize && minSizePrice !== null;
  const headlinePrice = isShowingFrom && minSizePrice !== null ? minSizePrice : currentPrice;
  const showStrikeThrough =
    product.discountPct !== undefined &&
    product.discountPct > 0 &&
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
          {product.name}
        </h1>
        {product.rating !== undefined && (
          <Link
            href="#reviews"
            className="mt-2 inline-flex rounded-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89F53] focus-visible:ring-offset-2"
            aria-label={`${product.reviewCount ?? 0} reviews — jump to reviews section`}
          >
            <Rating
              value={product.rating}
              size="sm"
              showValue
              reviewCount={product.reviewCount}
            />
          </Link>
        )}
        <p className="mt-2 text-sm text-[#777]">{product.subtitle}</p>
        <p className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-[#999]">
          Code: {productCode}
        </p>

        <div className="mt-6 flex items-baseline gap-3 font-jost text-2xl font-medium text-black">
          {isShowingFrom && (
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#60736A]">
              From
            </span>
          )}
          <span className="flex items-baseline gap-1.5 tabular-nums lining-nums">
            <img
              src="/aed-symbol.svg"
              alt="AED"
              className="inline-block h-[0.85em] w-auto translate-y-[0.05em]"
            />
            {headlinePrice.toLocaleString()}
          </span>
          {showStrikeThrough && product.price !== currentPrice && (
            <span className="flex items-baseline gap-1 text-sm text-[#999] line-through">
              <img
                src="/aed-symbol.svg"
                alt=""
                aria-hidden
                className="inline-block h-[0.85em] w-auto opacity-80"
              />
              {product.price.toLocaleString()}
            </span>
          )}
          {product.discountPct !== undefined && product.discountPct > 0 && !isShowingFrom && (
            <span className="text-xs font-medium text-[#C89F53]">
              {product.discountPct}% off
            </span>
          )}
        </div>

        <p className="mt-2 text-[10px] tracking-wide text-[#777]">
          {isShowingFrom
            ? 'Final price depends on selected size'
            : '(Price inclusive of Taxes)'}
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
            As low as <strong className="font-semibold text-[#1A2621]"><Aed value={installmentAmount} /></strong>
            <span className="block text-[11px] text-[#777]">
              or 4 interest-free payments.{' '}
              <button
                type="button"
                onClick={() => setTabbyOpen(true)}
                className="cursor-pointer font-semibold text-emerald-800 underline-offset-4 hover:underline"
              >
                Learn more
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
            As low as{' '}
            <strong className="font-semibold text-[#1A2621]">
              <Aed value={installmentAmount} />
            </strong>{' '}
            /month or 4 interest-free payments.{' '}
            <button
              type="button"
              onClick={() => setTabbyOpen(true)}
              className="cursor-pointer font-semibold text-emerald-800 underline-offset-4 hover:underline"
            >
              Learn more
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
            product={product}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
          />
        </div>

        <div className="mt-4 flex flex-col lg:mt-6">
          <div className="order-1 mt-4 flex flex-row items-center justify-between gap-1.5 text-[10px] text-[#555] lg:order-2 lg:mt-4">
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
                <span className="font-medium text-emerald-700">Available</span> for Store
                Pickup
              </span>
            </span>
            <span className="inline text-[#C89F53]">·</span>
            <span>Free UAE delivery in 1-2 business days</span>
          </div>

          <div className="order-2 mt-6 grid grid-cols-2 justify-items-center gap-3 sm:grid sm:grid-cols-5 sm:gap-2 lg:order-1 lg:mt-0">
            <TrustItem icon={TRUST_ICONS.hallmark} label="Hallmark Certified" />
            <TrustItem icon={TRUST_ICONS.shipping} label="Free UAE Shipping" />
            <TrustItem icon={TRUST_ICONS.resize} label="Complimentary Resizing" />
            <TrustItem icon={TRUST_ICONS.exchange} label="Lifetime Exchange" />
            <TrustItem icon={TRUST_ICONS.returns} label="14-Day Returns" />
          </div>
        </div>

        <div className="mt-6 space-y-3 border-t border-[#E5DDD0] pt-6">
          {product.description.split(/\n\s*\n/).map((para, i) => (
            <p key={i} className="text-xs leading-relaxed text-[#444]">
              {para}
            </p>
          ))}
        </div>

        {/* Specifications */}
        <div className="mt-6 space-y-2 border-t border-[#E5DDD0] pt-6 text-xs text-[#444]">
          <SpecRow label="Brand" value="Thangals" />
          <SpecRow label="Metal" value={product.metal} />
          {product.stone && <SpecRow label="Main Gemstone" value={product.stone} />}
          {sizeDimension ? (
            <SpecRow label="Dimensions" value={sizeDimension} highlight />
          ) : (
            product.weightGrams !== undefined && (
              <SpecRow label="Weight" value={`${product.weightGrams} g`} />
            )
          )}
          {product.purity && <SpecRow label="Purity" value={product.purity} />}
          {metalColorLabel && <SpecRow label="Metal Colour" value={metalColorLabel} />}
          {product.occasion && (
            <SpecRow
              label="Designed For"
              value={product.occasion.charAt(0).toUpperCase() + product.occasion.slice(1)}
            />
          )}
          <SpecRow label="Certification" value="UAE Central Hallmark Certified" />
          <SpecRow
            label="Availability"
            value="In Stock (Boutique & Online)"
            highlight
          />
        </div>
      </div>
    </div>
  );
};