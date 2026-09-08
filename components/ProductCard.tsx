'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/api';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
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

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="media-zoom relative border border-[#EAEAEA] bg-[#F2F6F4]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="aspect-square w-full object-cover"
        />
        {tagLabel && (
          <span className="absolute left-2 top-2 bg-white px-2 py-1 text-[9px] tracking-[0.16em] uppercase text-[#144B3C] font-semibold md:left-4 md:top-4 md:px-3 md:py-1 md:text-[10px] md:tracking-[0.18em]">
            {tagLabel}
          </span>
        )}
      </div>
      <div className="pt-4">
        <h3 className="font-display text-lg leading-snug text-[#1A2621] group-hover:text-[#144B3C] transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-xs tracking-wide text-[#60736A]">{product.subtitle}</p>
        <p className="mt-2 text-sm text-[#1A2621]">
          {product.currency}&nbsp;{product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
};
