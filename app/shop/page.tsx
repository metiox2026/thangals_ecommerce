import React from 'react';
import { Suspense } from 'react';
import { api, Product } from '@/lib/api';
import type {
  GenderFilter,
  OccasionFilter,
  PriceFilter,
  WeightFilter,
  DiscountFilter,
  PurityFilter,
  MetalColorFilter,
} from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { ShopControls } from '@/components/ShopControls';
import { FilterDrawer } from '@/components/FilterPanel';

type SortValue = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';
type CategoryValue = 'all' | 'earrings' | 'rings' | 'bracelets' | 'necklaces' | 'bangles';
type ViewValue = 'grid' | 'list';

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    view?: string;
    gender?: string;
    occasion?: string;
    price?: string;
    weight?: string;
    discount?: string;
    purity?: string;
    metalColor?: string;
  }>;
}

function isSortValue(v: string | undefined): v is SortValue {
  return v === 'featured' || v === 'price-asc' || v === 'price-desc' || v === 'name-asc';
}

function isCategoryValue(v: string | undefined): v is CategoryValue {
  return (
    v === 'all' ||
    v === 'earrings' ||
    v === 'rings' ||
    v === 'bracelets' ||
    v === 'necklaces' ||
    v === 'bangles'
  );
}

function isViewValue(v: string | undefined): v is ViewValue {
  return v === 'grid' || v === 'list';
}

function isGender(v: string | undefined): v is GenderFilter {
  return v === 'women' || v === 'men' || v === 'kids';
}

function isOccasion(v: string | undefined): v is OccasionFilter {
  return v === 'bridal' || v === 'everyday' || v === 'festive' || v === 'wedding';
}

function isPrice(v: string | undefined): v is PriceFilter {
  return v === 'u1000' || v === '1000-3000' || v === '3000-6000' || v === '6000plus';
}

function isWeight(v: string | undefined): v is WeightFilter {
  return v === 'lt5' || v === '5-15' || v === '15-30' || v === '30plus';
}

function isDiscount(v: string | undefined): v is DiscountFilter {
  return v === '10plus' || v === '25plus' || v === '50plus';
}

function isPurity(v: string | undefined): v is PurityFilter {
  return v === '22K' || v === '18K' || v === '14K';
}

function isMetalColor(v: string | undefined): v is MetalColorFilter {
  return v === 'yellow' || v === 'rose' || v === 'white';
}

function parseMulti<T extends string>(
  v: string | undefined,
  guard: (s: string | undefined) => s is T,
): T[] | undefined {
  if (!v) return undefined;
  const parts = v
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const filtered = parts.filter(guard);
  return filtered.length ? filtered : undefined;
}

function applySort(products: Product[], sort: SortValue): Product[] {
  if (sort === 'price-asc') return [...products].sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') return [...products].sort((a, b) => b.price - a.price);
  if (sort === 'name-asc') return [...products].sort((a, b) => a.name.localeCompare(b.name));
  return products;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;
  const sort: SortValue = isSortValue(resolvedParams.sort) ? resolvedParams.sort : 'featured';
  const categories = parseMulti(resolvedParams.category, isCategoryValue)?.filter(
    (c) => c !== 'all',
  );
  const view: ViewValue = isViewValue(resolvedParams.view) ? resolvedParams.view : 'grid';
  const gender = parseMulti(resolvedParams.gender, isGender);
  const occasion = parseMulti(resolvedParams.occasion, isOccasion);
  const price = parseMulti(resolvedParams.price, isPrice);
  const weight = parseMulti(resolvedParams.weight, isWeight);
  const discount = parseMulti(resolvedParams.discount, isDiscount);
  const purity = parseMulti(resolvedParams.purity, isPurity);
  const metalColor = parseMulti(resolvedParams.metalColor, isMetalColor);

  let products: Product[] = [];
  try {
    products = await api.products.list({
      category: categories && categories.length ? categories : undefined,
      gender,
      occasion,
      price,
      weight,
      discount,
      purity,
      metalColor,
    });
  } catch (e) {
    console.error(e);
  }

  const productsView = applySort(products, sort);

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-12 pt-0 sm:px-6 lg:px-10">
      {/* ===== BANNER ===== */}
      <section
        className="relative mb-2 h-[200px] w-screen overflow-hidden sm:h-[240px] lg:h-[280px]"
        style={{ left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}
      >
        <img
          src="/images/shop-hero-necklace.jpg"
          alt="Thangals jewellery collection — hand-finished hallmarked gold"
          width={1920}
          height={600}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: 'center 35%' }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.3), rgba(255,255,255,0.6))',
          }}
        />
        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col items-center justify-center px-5 text-center text-[#1A2621] sm:px-8 lg:px-10">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#C89F53] sm:text-[11px] sm:tracking-[0.32em]">
            The Thangals Edit
          </p>
          <h1 className="mt-2 font-serif text-2xl leading-tight sm:mt-3 sm:text-4xl lg:text-5xl" style={{ fontWeight: 200 }}>
            All Jewellery
          </h1>
          <div className="mx-auto mt-3 h-[1px] w-10 bg-[#C89F53] sm:mt-4 sm:w-12" />
          <p className="mt-3 max-w-md px-2 text-[11px] leading-relaxed text-[#1A2621]/85 sm:mt-4 sm:max-w-xl sm:px-0 sm:text-sm">
            Every piece is hallmarked, hand-finished and covered by lifetime care.
          </p>
        </div>
      </section>

      {/* Sort + Filter + View Controls */}
      <Suspense fallback={null}>
        <ShopControls
          totalCount={productsView.length}
          activeSort={sort}
          activeView={view}
        />

        <div>
          {/* Products Grid */}
          <div
            className={
              view === 'list'
                ? 'mt-6 flex flex-col gap-4 sm:mt-8 sm:gap-5'
                : 'mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-8 sm:grid-cols-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4'
            }
          >
            {productsView.length > 0 ? (
              productsView.map((product) => (
                <ProductCard key={product.id} product={product} view={view} />
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-sm text-[#777]">
                No jewellery pieces match these filters.
              </div>
            )}
          </div>
        </div>

        <FilterDrawer />
      </Suspense>
    </div>
  );
}
