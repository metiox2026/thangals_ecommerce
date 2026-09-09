import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api, Product } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { AddToBagButton } from './AddToBagButton';
import { WishlistToggle } from './WishlistToggle';
import { Disclosure } from './Disclosure';
import { ProductGallery } from './ProductGallery';

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

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12 lg:px-10">
      {/* Breadcrumb */}
      <nav className="mb-8 text-xs text-[#777]">
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
            <h1 className="mt-3 font-serif text-3xl font-normal text-[#1C1C1C] sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-1 text-sm text-[#777]">{product.subtitle}</p>

            <div className="mt-6 flex items-baseline gap-3 font-serif text-3xl font-medium text-black">
              <span className="tabular-nums lining-nums">
                {product.currency} {finalPrice.toLocaleString()}
              </span>
              {product.discountPct && product.discountPct > 0 && (
                <>
                  <span className="text-sm text-[#999] line-through">
                    {product.currency} {product.price.toLocaleString()}
                  </span>
                  <span className="text-xs font-medium text-[#C89F53]">
                    {product.discountPct}% off
                  </span>
                </>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <div className="flex-1">
                <AddToBagButton product={product} />
              </div>
              <WishlistToggle product={product} />
            </div>

            <div className="mt-4 flex justify-between text-center text-[10px] text-[#777]">
              <span>✓ Lifetime Warranty</span>
              <span>✓ Complimentary Resizing</span>
              <span>✓ UAE Hallmark Certified</span>
            </div>

            <div className="mt-6 border-t border-[#E5DDD0] pt-6">
              <p className="text-xs leading-relaxed text-[#444]">{product.description}</p>
            </div>

            {/* Specifications */}
            <div className="mt-6 space-y-2 border-t border-[#E5DDD0] pt-6 text-xs text-[#444]">
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

          <div className="mt-8 space-y-2 border-t border-[#E5DDD0] pt-6 text-xs text-[#444]">
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
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-[#E5DDD0] pt-12">
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
