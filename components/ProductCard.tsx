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
          <span className="absolute left-4 top-4 bg-white/90 px-3 py-1 text-[10px] tracking-[0.18em] uppercase text-[#144B3C] font-medium">
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
