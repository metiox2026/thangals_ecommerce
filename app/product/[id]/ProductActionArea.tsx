'use client';

import React, { useRef } from 'react';
import { Product } from '@/lib/api';
import { AddToBagButton } from './AddToBagButton';
import { WishlistToggle } from './WishlistToggle';
import { ShareButton } from './ShareButton';
import { MobileActionBar } from './MobileActionBar';
import { SizeSelector } from '@/components/SizeSelector';

interface ProductActionAreaProps {
  product: Product;
  selectedSize: string | null;
  onSelectSize: (size: string) => void;
}

export const ProductActionArea: React.FC<ProductActionAreaProps> = ({
  product,
  selectedSize,
  onSelectSize,
}) => {
  const sizes = product.sizes ?? [];
  const requiresSize = sizes.length > 0;
  const sizeSelectorRef = useRef<HTMLDivElement | null>(null);

  const disabled = requiresSize && selectedSize === null;

  const handleSelectSizeClick = () => {
    sizeSelectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <>
      {requiresSize && (
        <div ref={sizeSelectorRef} className="mt-6">
          <SizeSelector
            sizes={sizes}
            value={selectedSize}
            onChange={onSelectSize}
            note={product.sizeGuideNote}
            category={
              product.category === 'rings' ||
              product.category === 'necklaces' ||
              product.category === 'bracelets' ||
              product.category === 'bangles'
                ? product.category
                : undefined
            }
          />
        </div>
      )}

      <div className="mt-6 hidden gap-3 sm:flex">
        <div className="flex-1">
          <AddToBagButton
            product={product}
            size={selectedSize}
            disabled={disabled}
            disabledLabel="Select a size"
            onDisabledClick={handleSelectSizeClick}
          />
        </div>
        <WishlistToggle product={product} />
        <ShareButton
          productName={product.name}
          className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border border-[#E5DDD0] text-[#C89F53] transition-colors hover:border-[#C89F53] cursor-pointer"
        />
      </div>

      <MobileActionBar
        product={product}
        size={selectedSize}
        disabled={disabled}
        onDisabledClick={handleSelectSizeClick}
      />
    </>
  );
};
