'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/api';
import { useWishlist } from '@/context/WishlistContext';
import { useBag } from '@/context/BagContext';

const WishlistItem: React.FC<{ product: Product }> = ({ product }) => {
  const { removeItem } = useWishlist();
  const { addItem } = useBag();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
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

  return (
    <div className="group">
      <Link href={`/product/${product.id}`} className="media-zoom relative block border border-[#EAEAEA] bg-[#F2F6F4]">
        <img
          src={product.image}
          alt={product.name}
          loading="eager"
          width={800}
          height={800}
          className="aspect-square w-full object-cover"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            removeItem(product.id);
          }}
          aria-label={`Remove ${product.name} from wishlist`}
          className="absolute right-0 bottom-0 flex size-9 cursor-pointer items-center justify-center text-[#1A2621] transition-colors hover:text-[#144B3C] md:right-px md:bottom-px md:size-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="#144B3C"
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
      </Link>
      <div className="pt-4">
        <h3 className="font-display text-lg leading-snug text-[#1A2621]">
          <Link href={`/product/${product.id}`} className="transition-colors hover:text-[#144B3C]">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-xs tracking-wide text-[#60736A]">{product.subtitle}</p>
        <p className="mt-2 text-sm text-[#1A2621]">
          {product.currency}&nbsp;{product.price.toLocaleString()}
        </p>
        <button
          type="button"
          onClick={handleAdd}
          className={`mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors sm:text-[12px] ${
            added
              ? 'border border-[#C89F53] bg-[#C89F53] text-white'
              : 'border border-[#1A3A2A] text-[#1A3A2A] hover:bg-[#1A3A2A] hover:text-white'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {added ? 'Added to Bag' : 'Add to Bag'}
        </button>
      </div>
    </div>
  );
};

export const WishlistContents: React.FC = () => {
  const { items, clearAll, totalCount } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center sm:py-24">
        <svg
          className="mb-4 h-12 w-12 text-[#E5DDD0] sm:mb-5 sm:h-14 sm:w-14"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.25"
          aria-hidden="true"
        >
          <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
        </svg>
        <p className="font-display text-xl text-[#1A2621] sm:text-2xl">Your wishlist is empty</p>
        <p className="mt-2 max-w-sm px-4 text-[12px] text-[#60736A] sm:text-sm">
          Tap the heart on any piece to save it for later. Your selection will appear here.
        </p>
        <Link
          href="/shop"
          className="mt-6 border border-[#1A3A2A] px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] text-[#1A3A2A] transition-colors hover:bg-[#1A3A2A] hover:text-white sm:mt-8 sm:text-[12px]"
        >
          Explore Jewellery
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 sm:mt-8">
      <div className="flex items-center justify-between gap-3 border-y border-[#E5DDD0] py-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#60736A] sm:text-[11px]">
          <span className="font-semibold text-[#1A2621]">{totalCount}</span>{' '}
          {totalCount === 1 ? 'piece saved' : 'pieces saved'}
        </p>
        <button
          type="button"
          onClick={clearAll}
          className="text-[10px] uppercase tracking-[0.2em] text-[#144B3C] underline-offset-4 transition-colors hover:text-[#0E372B] hover:underline sm:text-[11px]"
        >
          Clear wishlist
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((product) => (
          <WishlistItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
