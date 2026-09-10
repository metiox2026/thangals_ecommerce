'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/api';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
  view?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, view = 'grid' }) => {
  const { isWished, toggleItem } = useWishlist();
  const wished = isWished(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  const getTagLabel = (tag?: string) => {
    switch (tag) {
      case 'best-seller': return 'Best seller';
      case 'new': return 'New';
      case 'signature': return 'Signature';
      case 'heritage': return 'Heritage';
      default: return null;
    }
  };

  const tagLabel = getTagLabel(product.tag);

  if (view === 'list') {
    return (
      <Link href={`/product/${product.id}`} className="group block">
        <div className="flex flex-col border border-[#EAEAEA] bg-white transition-colors hover:border-[#1A3A2A] sm:flex-row">
          <div className="media-zoom relative shrink-0 border-b border-[#EAEAEA] bg-[#F2F6F4] sm:border-b-0 sm:border-r sm:w-72 lg:w-80">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              width={800}
              height={800}
              className="aspect-square w-full object-cover sm:h-full sm:aspect-auto"
            />
            {tagLabel && (
              <span className="absolute left-2 top-2 bg-white px-2 py-1 text-[9px] tracking-[0.16em] uppercase text-[#144B3C] font-semibold md:left-4 md:top-4 md:px-3 md:py-1 md:text-[10px] md:tracking-[0.18em]">
                {tagLabel}
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-center gap-2 p-5 sm:p-6 lg:p-8">
            <h3 className="font-display text-xl leading-snug text-[#1A2621] transition-colors group-hover:text-[#144B3C] sm:text-2xl">
              {product.name}
            </h3>
            <p className="text-xs tracking-wide text-[#60736A] sm:text-sm">{product.subtitle}</p>
            <p className="mt-1 text-sm text-[#1A2621] sm:text-base">
              {product.currency}&nbsp;{product.price.toLocaleString()}
            </p>
            {product.description && (
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#60736A] sm:mt-3 sm:text-sm">
                {product.description}
              </p>
            )}
            <span className="mt-3 inline-flex w-fit items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#1A3A2A] sm:mt-4 sm:text-[11px]">
              View details
              <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="group">
      <div className="relative aspect-square w-full overflow-hidden">
        <Link href={`/product/${product.id}`} className="absolute inset-0 block">
          <div className="media-zoom h-full w-full border border-[#EAEAEA] bg-[#F2F6F4]">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              width={800}
              height={800}
              className="h-full w-full object-cover"
            />
            {tagLabel && (
              <span className="absolute left-2 top-2 bg-white px-2 py-1 text-[9px] tracking-[0.16em] uppercase text-[#144B3C] font-semibold md:left-4 md:top-4 md:px-3 md:py-1 md:text-[10px] md:tracking-[0.18em]">
                {tagLabel}
              </span>
            )}
          </div>
        </Link>
        <button
          type="button"
          onClick={toggleWishlist}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wished}
          className="absolute right-1 bottom-1 z-10 flex size-9 cursor-pointer items-center justify-center text-[#C89F53] transition-colors hover:text-[#C89F53] md:right-2 md:bottom-2 md:size-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={wished ? '#C89F53' : 'none'}
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="md:h-5 md:w-5"
          >
            <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
          </svg>
        </button>
      </div>
      <Link href={`/product/${product.id}`} className="block pt-4">
        <h3 className="font-display text-lg leading-snug text-[#1A2621] group-hover:text-[#144B3C] transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-xs tracking-wide text-[#60736A]">{product.subtitle}</p>
        <p className="mt-2 text-sm text-[#1A2621]">
          {product.currency}&nbsp;{product.price.toLocaleString()}
        </p>
      </Link>
    </div>
  );
};
