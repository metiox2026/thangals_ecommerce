'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/api';
import { useWishlist } from '@/context/WishlistContext';
import { useBag } from '@/context/BagContext';
import { Rating } from './Rating';

interface ProductCardProps {
  product: Product;
  view?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, view = 'grid' }) => {
  const { isWished, toggleItem } = useWishlist();
  const { addItem } = useBag();
  const wished = isWished(product.id);
  const [added, setAdded] = useState(false);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  const addToBag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      price: product.price,
      currency: product.currency,
      image: product.image,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  const getTagLabel = (tag?: string) => {
    switch (tag) {
      case 'best-seller': return 'Best Seller';
      case 'new': return 'New';
      case 'signature': return 'Signature';
      case 'heritage': return 'Heritage';
      default: return null;
    }
  };

  const tagLabel = getTagLabel(product.tag);

  if (view === 'list') {
    return (
      <Link href={`/product/${product.id}`} target="_blank" rel="noopener noreferrer" className="group block">
        <div className="flex flex-col border border-[#EAEAEA] bg-white transition-colors hover:border-[#1A3A2A] sm:flex-row">
          <div className="media-zoom relative shrink-0 border-b border-[#EAEAEA] bg-[#F2F6F4] sm:border-b-0 sm:border-r sm:w-72 lg:w-80">
            <img
              src={product.image}
              alt={product.name}
              loading="eager"
              width={800}
              height={800}
              className="aspect-square w-full object-cover sm:h-full sm:aspect-auto"
            />
            {tagLabel && (
              <span className="absolute left-2 top-2 inline-flex items-center justify-center rounded-sm bg-gradient-to-r from-[#FBE7B6] via-[#E8CB85] to-[#C89F53] px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-widest text-black shadow-sm md:left-3 md:top-3 md:px-2 md:py-1 md:text-[9px]">
                {tagLabel}
              </span>
            )}
            <button
              type="button"
              onClick={addToBag}
              aria-label={added ? 'Added to bag' : 'Add to bag'}
              className={`absolute right-1 top-1 z-10 flex size-9 cursor-pointer items-center justify-center text-[#C89F53] transition-opacity hover:opacity-100 md:right-2 md:top-2 md:size-10 ${
                added ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={added ? '#C89F53' : 'none'}
                stroke={added ? '#FFFFFF' : 'currentColor'}
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="md:h-5 md:w-5"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </button>
            <button
              type="button"
              onClick={toggleWishlist}
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={wished}
              className={`absolute right-1 bottom-1 z-10 flex size-9 cursor-pointer items-center justify-center text-[#C89F53] transition-opacity hover:opacity-100 md:right-2 md:bottom-2 md:size-10 ${
                wished ? 'opacity-100' : 'opacity-60'
              }`}
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
          <div className="flex flex-1 flex-col justify-center gap-2 p-5 sm:p-6 lg:p-8">
            <h3 className="font-display text-xl leading-snug text-[#1A2621] transition-colors group-hover:text-[#144B3C] sm:text-2xl">
              {product.name}
            </h3>
            <p className="text-xs tracking-wide text-[#60736A] sm:text-sm">{product.subtitle}</p>
            {product.rating !== undefined && (
              <Rating
                value={product.rating}
                size="sm"
                showValue
                showReviewCount={false}
                reviewCount={product.reviewCount}
                className="mt-1.5"
              />
            )}
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
        <Link href={`/product/${product.id}`} target="_blank" rel="noopener noreferrer" className="absolute inset-0 block">
          <div className="media-zoom h-full w-full border border-[#EAEAEA] bg-[#F2F6F4]">
            <img
              src={product.image}
              alt={product.name}
              loading="eager"
              width={800}
              height={800}
              className="h-full w-full object-cover"
            />
            {tagLabel && (
              <span className="absolute left-2 top-2 inline-flex items-center justify-center rounded-sm bg-gradient-to-r from-[#FBE7B6] via-[#E8CB85] to-[#C89F53] px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-widest text-black shadow-sm md:left-3 md:top-3 md:px-2 md:py-1 md:text-[9px]">
                {tagLabel}
              </span>
            )}
          </div>
        </Link>
        <button
          type="button"
          onClick={addToBag}
          aria-label={added ? 'Added to bag' : 'Add to bag'}
          aria-live="polite"
          className={`absolute right-1 top-1 z-10 flex size-9 cursor-pointer items-center justify-center text-[#C89F53] transition-opacity hover:opacity-100 md:right-2 md:top-2 md:size-10 ${
            added ? 'opacity-100' : 'opacity-60'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={added ? '#C89F53' : 'none'}
            stroke={added ? '#FFFFFF' : 'currentColor'}
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="md:h-5 md:w-5"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </button>
        <button
          type="button"
          onClick={toggleWishlist}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wished}
          className={`absolute right-1 bottom-1 z-10 flex size-9 cursor-pointer items-center justify-center text-[#C89F53] transition-opacity hover:opacity-100 md:right-2 md:bottom-2 md:size-10 ${
            wished ? 'opacity-100' : 'opacity-60'
          }`}
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
      <Link href={`/product/${product.id}`} target="_blank" rel="noopener noreferrer" className="block pt-4">
        <h3 className="font-display text-lg leading-snug text-[#1A2621] group-hover:text-[#144B3C] transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-xs tracking-wide text-[#60736A]">{product.subtitle}</p>
        {product.rating !== undefined && (
          <Rating
            value={product.rating}
            size="xs"
            showValue
            showReviewCount={false}
            reviewCount={product.reviewCount}
            className="mt-2"
          />
        )}
        <p className="mt-2 text-sm text-[#1A2621]">
          {product.currency}&nbsp;{product.price.toLocaleString()}
        </p>
      </Link>
    </div>
  );
};
