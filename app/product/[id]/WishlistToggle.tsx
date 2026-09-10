'use client';

import React from 'react';
import { Product } from '@/lib/api';
import { useWishlist } from '@/context/WishlistContext';

export const WishlistToggle: React.FC<{ product: Product }> = ({ product }) => {
  const { isWished, toggleItem } = useWishlist();
  const wished = isWished(product.id);

  return (
    <button
      type="button"
      onClick={() => toggleItem(product)}
      aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={wished}
      title={wished ? 'Saved to wishlist' : 'Save to wishlist'}
      className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border border-[#E5DDD0] text-[#C89F53] transition-colors hover:border-[#C89F53] cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill={wished ? '#C89F53' : 'none'}
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
      </svg>
    </button>
  );
};
