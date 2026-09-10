import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api, Product } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { AddToBagButton } from './AddToBagButton';
import { WishlistToggle } from './WishlistToggle';
import { ShareButton } from './ShareButton';
import { Disclosure } from './Disclosure';
import { ProductGallery } from './ProductGallery';
import { MobileActionBar } from './MobileActionBar';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const TAG_LABELS: Record<string, string> = {
  'best-seller': 'Best Seller',
  'new': 'New',
  'signature': 'Signature',
  'heritage': 'Heritage',
};

function SpecRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-[#777]">{label}</span>
      <span className={`font-medium ${highlight ? 'text-emerald-700' : 'text-[#1C1C1C]'}`}>
        {value}
      </span>
    </div>
  );
}

function Aed({ value }: { value: number }) {
  return (
    <span className="inline-flex items-baseline gap-0.5 tabular-nums lining-nums">
      <img src="/aed-symbol.svg" alt="" aria-hidden className="inline-block h-[0.85em] w-auto" />
      {value.toLocaleString()}
    </span>
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

function TrustItem({ icon, label, className = '' }: { icon: React.ReactNode; label: string; className?: string }) {
  return (
    <div className={`flex w-[88px] flex-col items-center gap-1.5 text-center sm:w-auto ${className}`}>
      <span className="flex size-9 items-center justify-center text-[#1A3A2A]">
        {icon}
      </span>
      <span className="text-[10px] leading-tight text-[#555]">{label}</span>
    </div>
  );
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  let product: Product | null = null;
  let related: Product[] = [];

  try {
    product = await api.products.get(resolvedParams.id);
    const all = await api.products.list({ category: product.category });
    related = all.filter((p) => p.id !== product!.id).slice(0, 4);
  } catch (e) {
    notFound();
  }

  if (!product) notFound();

  const tagLabel = product.tag ? TAG_LABELS[product.tag] ?? product.tag : null;
  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const finalPrice =
    product.discountPct && product.discountPct > 0
      ? Math.round(product.price * (1 - product.discountPct / 100))
      : product.price;
  const metalColorLabel = product.metalColor
    ? product.metalColor.charAt(0).toUpperCase() + product.metalColor.slice(1) + ' Gold'
    : null;
  const productCode = `THG-${product.id.replace(/-/g, '').slice(0, 8).toUpperCase()}`;
  const installmentAmount = Math.round(finalPrice / 4);
  const baseMetalValue = Math.round(product.price * 0.72);
  const makingCharges = product.price - baseMetalValue;
  const discountAmount = product.price - finalPrice;

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8 lg:px-10 lg:py-4">
      {/* Breadcrumb */}
      <nav className="mb-8 text-xs text-[#777] lg:mb-3">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:underline">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-[#1C1C1C]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Product Image Gallery */}
        <ProductGallery images={galleryImages} name={product.name} />

        {/* Details */}
        <div className="flex flex-col justify-between">
          <div>
            {tagLabel && (
              <span className="inline-block rounded-sm bg-[#1A3A2A] px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest text-white">
                {tagLabel}
              </span>
            )}
            <h1 className="mt-3 font-serif text-2xl font-normal text-[#1C1C1C] sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-1 text-sm text-[#777]">{product.subtitle}</p>
            <p className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-[#999]">
              Code: {productCode}
            </p>

            <div className="mt-6 flex items-baseline gap-3 font-serif text-2xl font-medium text-black">
              <span className="flex items-baseline gap-1.5 tabular-nums lining-nums">
                <img src="/aed-symbol.svg" alt="AED" className="inline-block h-[0.85em] w-auto translate-y-[0.05em]" />
                {finalPrice.toLocaleString()}
              </span>
              {product.discountPct && product.discountPct > 0 && (
                <>
                  <span className="flex items-baseline gap-1 text-sm text-[#999] line-through">
                    <img src="/aed-symbol.svg" alt="" aria-hidden className="inline-block h-[0.85em] w-auto opacity-80" />
                    {product.price.toLocaleString()}
                  </span>
                  <span className="text-xs font-medium text-[#C89F53]">
                    {product.discountPct}% off
                  </span>
                </>
              )}
            </div>

            <p className="mt-2 text-[10px] tracking-wide text-[#777]">
              (Price inclusive of Taxes)
            </p>
            <div className="mt-2 flex w-full items-center gap-3 rounded-sm border border-[#E5DDD0] bg-[#FAF8F5] px-4 py-3.5 text-xs tracking-wide text-[#555] lg:hidden">
              <div className="flex flex-col gap-0.5">
                <img
                  src="/tabby-logo.avif"
                  alt="Tabby"
                  width={64}
                  height={22}
                  className="h-6 w-auto shrink-0 self-start rounded-sm"
                />
                <img
                  src="/tamara-logo.jpg"
                  alt="Tamara"
                  width={64}
                  height={22}
                  className="h-auto w-[60px] self-start rounded-sm"
                />
              </div>
              <span className="ml-auto self-center text-right text-[15px]">
                or 4 interest-free payments of <Aed value={installmentAmount} />
              </span>
            </div>
            <div className="mt-2 hidden w-full items-center gap-2 rounded-sm border border-[#E5DDD0] bg-[#FAF8F5] px-4 py-3 text-sm tracking-wide text-[#555] lg:flex">
              <img
                src="/tabby-logo.avif"
                alt="Tabby"
                width={64}
                height={22}
                className="h-7 w-auto shrink-0 rounded-sm"
              />
              <img
                src="/tamara-logo.jpg"
                alt="Tamara"
                width={64}
                height={22}
                className="h-7 w-auto shrink-0 rounded-sm"
              />
              <span className="ml-auto text-right">
                or 4 interest-free payments of <Aed value={installmentAmount} />
              </span>
            </div>

            <div className="mt-6 hidden gap-3 sm:flex">
              <div className="flex-1">
                <AddToBagButton product={product} />
              </div>
              <WishlistToggle product={product} />
              <ShareButton
                productName={product.name}
                className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border border-[#E5DDD0] text-[#C89F53] transition-colors hover:border-[#C89F53] cursor-pointer"
              />
            </div>

            <div className="mt-4 flex flex-row items-center justify-between gap-1.5 text-[10px] text-[#555]">
              <span className="inline-flex items-center gap-0.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-700">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span><span className="font-medium text-emerald-700">Available</span> for Store Pickup</span>
              </span>
              <span className="inline text-[#C89F53]">·</span>
              <span>Free UAE delivery in 1-2 business days</span>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3 sm:grid sm:grid-cols-5 sm:gap-2">
              <TrustItem icon={TRUST_ICONS.hallmark} label="Hallmark Certified" />
              <TrustItem icon={TRUST_ICONS.shipping} label="Free UAE Shipping" />
              <TrustItem icon={TRUST_ICONS.resize} label="Complimentary Resizing" />
              <TrustItem icon={TRUST_ICONS.exchange} label="Lifetime Exchange" />
              <TrustItem icon={TRUST_ICONS.returns} label="14-Day Returns" />
            </div>

            <div className="mt-6 border-t border-[#E5DDD0] pt-6">
              <p className="text-xs leading-relaxed text-[#444]">{product.description}</p>
            </div>

            {/* Specifications */}
            <div className="mt-6 space-y-2 border-t border-[#E5DDD0] pt-6 text-xs text-[#444]">
              <SpecRow label="Brand" value="Thangals" />
              <SpecRow label="Metal" value={product.metal} />
              {product.stone && <SpecRow label="Main Gemstone" value={product.stone} />}
              {product.weightGrams !== undefined && (
                <SpecRow label="Weight" value={`${product.weightGrams} g`} />
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
      </div>

      {/* Disclosures + Contact — full-width row below image on large screens */}
      <section className="mt-12 border-t border-[#E5DDD0] pt-10 lg:mt-16 lg:pt-12">
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-2 text-xs text-[#444]">
            <Disclosure title="Hallmark & Certification">
              Every Thangals piece is independently assayed and stamped with the UAE Central
              Hallmark, certifying the karatage of your gold and the authenticity of any
              gemstones. Your certificate of authenticity and detailed invoice are included
              with every order.
            </Disclosure>
            <Disclosure title="Care & Lifetime Warranty">
              Your piece is covered by our lifetime care programme — complimentary cleaning,
              prong tightening and polishing for as long as you own it. Bring it to any of
              our boutiques or send it to us by insured courier; we&rsquo;ll return it ready
              to wear.
            </Disclosure>
            <Disclosure title="Shipping & Returns">
              Free insured delivery across the UAE within 2&ndash;4 business days.
              International shipping is available to the GCC, UK and India. Returns accepted
              within 14 days for unworn pieces in their original condition.
            </Disclosure>
            <Disclosure title="Product Dimensions">
              Detailed measurements &mdash; including band width, stone size and total
              dimensions &mdash; are available on request. Contact our boutique team at
              +971 4 226 1993 or visit any of our stores for exact specifications of
              this piece.
            </Disclosure>
            <Disclosure title="Price Breakup">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Metal ({product.metal})</span>
                  <Aed value={baseMetalValue} />
                </div>
                <div className="flex justify-between">
                  <span>Making &amp; Stone Charges</span>
                  <Aed value={makingCharges} />
                </div>
                <div className="flex justify-between border-t border-[#E5DDD0] pt-2 font-medium">
                  <span>Subtotal</span>
                  <Aed value={product.price} />
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#C89F53]">
                    <span>Discount ({product.discountPct}% off)</span>
                    <span>&minus;<Aed value={discountAmount} /></span>
                  </div>
                )}
                <div className="flex justify-between border-t border-[#E5DDD0] pt-2 font-serif text-base font-medium text-[#1A2621]">
                  <span>Total</span>
                  <Aed value={finalPrice} />
                </div>
              </div>
            </Disclosure>
          </div>
          <div className="border-t border-[#E5DDD0] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#1A2621]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 14h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a1 1 0 0 1-1-1v-6Z" />
                <path d="M21 14h-2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-6Z" />
                <path d="M3 14a9 9 0 0 1 18 0" />
              </svg>
              Any Questions? Please Contact Us At
            </p>
            <a
              href="tel:+97142261993"
              className="mt-2 inline-block font-sans text-2xl font-semibold tabular-nums lining-nums tracking-[0.02em] text-[#1A2621] hover:underline"
            >
              +971 4 226 1993
            </a>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] text-[#444]">
              <Link href="/contact" className="hover:underline">Return &amp; Exchange</Link>
              <Link href="/contact" className="hover:underline">Shipping Policy</Link>
              <Link href="/contact" className="hover:underline">Terms &amp; Conditions</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section id="related-products" className="mt-16 border-t border-[#E5DDD0] pt-12">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#C89F53] sm:text-[11px]">
              You May Also Love
            </p>
            <h2 className="mt-2 font-serif text-2xl font-normal text-[#1C1C1C] sm:text-3xl">
              More from this Collection
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

      <MobileActionBar product={product} />
    </div>
  );
}
