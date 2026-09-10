import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api, Product, Review } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { Rating } from '@/components/Rating';
import { Disclosure } from './Disclosure';
import { ProductGallery } from './ProductGallery';
import { ProductRightColumn } from './ProductRightColumn';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

function Aed({ value }: { value: number }) {
  return (
    <span className="inline-flex items-baseline gap-0.5 tabular-nums lining-nums">
      <img src="/aed-symbol.svg" alt="" aria-hidden className="inline-block h-[0.85em] w-auto" />
      {value.toLocaleString()}
    </span>
  );
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  let product: Product | null = null;
  let related: Product[] = [];
  let reviews: Review[] = [];

  try {
    product = await api.products.get(resolvedParams.id);
    const all = await api.products.list({ category: product.category });
    related = all.filter((p) => p.id !== product!.id).slice(0, 4);
    reviews = await api.reviews.forProduct(resolvedParams.id);
  } catch (e) {
    notFound();
  }

  if (!product) notFound();

  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const basePrice = product.price;
  const finalPrice =
    product.discountPct && product.discountPct > 0
      ? Math.round(basePrice * (1 - product.discountPct / 100))
      : basePrice;
  const baseMetalValue = Math.round(basePrice * 0.72);
  const makingCharges = basePrice - baseMetalValue;
  const discountAmount = basePrice - finalPrice;

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
        <ProductRightColumn product={product} />
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
              {product.dimensions && product.dimensions.length > 0 ? (
                <div className="space-y-1.5">
                  {product.dimensions.map((d) => (
                    <div key={d.label} className="flex justify-between gap-4">
                      <span className="text-[#777]">{d.label}</span>
                      <span className="font-medium text-[#1C1C1C]">{d.value}</span>
                    </div>
                  ))}
                  <p className="pt-2 text-[11px] text-[#777]">
                    For exact specifications or custom sizing, contact our boutique team at
                    +971 4 226 1993 or visit any of our stores.
                  </p>
                </div>
              ) : (
                <p>
                  Detailed measurements &mdash; including band width, stone size and total
                  dimensions &mdash; are available on request. Contact our boutique team at
                  +971 4 226 1993 or visit any of our stores for exact specifications of
                  this piece.
                </p>
              )}
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
          <div className="pt-6 lg:border-l lg:pl-8 lg:pt-0">
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

      {/* Reviews */}
      {reviews.length > 0 && product.rating !== undefined && product.reviewCount !== undefined && (
        <section id="reviews" className="mt-16 border-t border-[#E5DDD0] pt-12 lg:mt-20 lg:pt-14">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#C89F53] sm:text-[11px]">
              What Our Customers Say
            </p>
            <h2 className="mt-2 font-serif text-2xl font-normal text-[#1C1C1C] sm:text-3xl">
              Verified Reviews
            </h2>
            <div className="mx-auto mt-3 h-[1px] w-10 bg-[#C89F53]" />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
            {/* Aggregate */}
            <aside className="rounded-sm border border-[#E5DDD0] bg-[#FAF8F5] p-6 lg:p-7">
              <div className="flex items-baseline gap-2 font-serif text-[#1C1C1C]">
                <span className="text-5xl font-medium tabular-nums lining-nums">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-sm text-[#777]">/ 5</span>
              </div>
              <Rating value={product.rating} size="md" className="mt-3" />
              <p className="mt-3 text-xs leading-relaxed text-[#60736A]">
                Based on{' '}
                <span className="font-medium text-[#1C1C1C]">
                  {product.reviewCount.toLocaleString()}
                </span>{' '}
                verified reviews
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
                      <span className="w-3 tabular-nums">{stars}</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#C89F53" aria-hidden="true">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E5DDD0]">
                        <div
                          className="h-full bg-[#C89F53]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-4 text-right tabular-nums">{count}</span>
                    </div>
                  ));
                })()}
              </div>
            </aside>

            {/* Review list */}
            <div className="space-y-7">
              {reviews.map((r) => (
                <article
                  key={r.id}
                  className="border-b border-[#E5DDD0] pb-7 last:border-b-0 last:pb-0"
                >
                  <header className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1C1C1C]">{r.author}</p>
                      <p className="mt-0.5 text-[11px] text-[#777]">
                        {r.location} · {r.date}
                      </p>
                    </div>
                    <Rating value={r.rating} size="sm" />
                  </header>
                  {r.title && (
                    <h3 className="mt-3 text-sm font-medium text-[#1C1C1C]">{r.title}</h3>
                  )}
                  <p className="mt-2 text-xs leading-relaxed text-[#444] sm:text-sm">
                    {r.text}
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
                    Verified Buyer
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

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
    </div>
  );
}
