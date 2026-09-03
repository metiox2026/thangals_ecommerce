import React from 'react';
import Link from 'next/link';
import { api, Product } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams.category;

  let products: Product[] = [];
  try {
    products = await api.products.list(activeCategory ? { category: activeCategory } : undefined);
  } catch (e) {
    console.error(e);
  }

  const categories = [
    { label: 'All', value: undefined },
    { label: 'Earrings', value: 'earrings' },
    { label: 'Rings', value: 'rings' },
    { label: 'Bracelets', value: 'bracelets' },
    { label: 'Necklaces', value: 'necklaces' },
    { label: 'Bangles', value: 'bangles' },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#B8975A]">The Collection</p>
        <h1 className="mt-2 font-serif text-4xl font-normal text-[#1C1C1C] sm:text-5xl">
          All Jewellery
        </h1>
        <div className="mx-auto mt-3 h-[1px] w-12 bg-[#B8975A]" />
        <p className="mt-3 text-xs text-[#777]">
          Every piece is hallmarked, hand-finished and covered by lifetime care.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="mt-8 flex flex-wrap justify-center gap-2 border-b border-[#E5DDD0] pb-6">
        {categories.map((c) => {
          const isActive = activeCategory === c.value || (!activeCategory && !c.value);
          const href = c.value ? `/shop?category=${c.value}` : '/shop';
          return (
            <Link
              key={c.label}
              href={href}
              className={`px-5 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors rounded-sm ${
                isActive
                  ? 'bg-[#1A3A2A] text-white'
                  : 'bg-white border border-[#E5DDD0] text-[#444] hover:border-[#1A3A2A]'
              }`}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      {/* Products Grid */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.length > 0 ? (
          products.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className="col-span-full py-16 text-center text-sm text-[#777]">
            No jewellery pieces found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
