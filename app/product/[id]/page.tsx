import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api, Product } from '@/lib/api';
import { AddToBagButton } from './AddToBagButton';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  let product: Product | null = null;

  try {
    product = await api.products.get(resolvedParams.id);
  } catch (e) {
    notFound();
  }

  if (!product) notFound();

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
        {/* Product Image */}
        <div className="aspect-square w-full overflow-hidden rounded-sm border border-[#E5DDD0] bg-[#FAF8F5]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between">
          <div>
            {product.tag && (
              <span className="inline-block rounded-sm bg-[#1A3A2A] px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest text-white">
                {product.tag.replace('-', ' ')}
              </span>
            )}
            <h1 className="mt-3 font-serif text-3xl font-normal text-[#1C1C1C] sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-1 text-sm text-[#777]">{product.subtitle}</p>

            <div className="mt-6 font-serif text-3xl font-medium text-[#1A3A2A]">
              {product.currency} {product.price.toLocaleString()}
            </div>

            <div className="mt-6 border-t border-[#E5DDD0] pt-6">
              <p className="text-xs leading-relaxed text-[#444]">{product.description}</p>
            </div>

            {/* Specifications */}
            <div className="mt-6 space-y-2 border-t border-[#E5DDD0] pt-6 text-xs text-[#444]">
              <div className="flex justify-between">
                <span className="text-[#777]">Metal</span>
                <span className="font-medium text-[#1C1C1C]">{product.metal}</span>
              </div>
              {product.stone && (
                <div className="flex justify-between">
                  <span className="text-[#777]">Main Gemstone</span>
                  <span className="font-medium text-[#1C1C1C]">{product.stone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#777]">Certification</span>
                <span className="font-medium text-[#1C1C1C]">UAE Central Hallmark Certified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777]">Availability</span>
                <span className="font-medium text-emerald-700">In Stock (Boutique & Online)</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6">
            <AddToBagButton product={product} />

            <div className="mt-4 flex justify-between text-center text-[10px] text-[#777]">
              <span>✓ Lifetime Warranty</span>
              <span>✓ Complimentary Resizing</span>
              <span>✓ UAE Hallmark Certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
