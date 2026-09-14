'use client';

import React, { useState } from 'react';
import { Product, getPriceForSize } from '@/lib/api';
import { useBag } from '@/context/BagContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddToBagButtonProps {
  product: Product;
  size?: string | null;
  disabled?: boolean;
  disabledLabel?: string;
  onDisabledClick?: () => void;
}

export const AddToBagButton: React.FC<AddToBagButtonProps> = ({
  product,
  size,
  disabled = false,
  disabledLabel,
  onDisabledClick,
}) => {
  const { addItem } = useBag();
  const { t } = useLanguage();
  const [added, setAdded] = useState(false);

  const trulyDisabled = disabled && !onDisabledClick;

  const handleClick = () => {
    if (disabled) {
      onDisabledClick?.();
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      price: getPriceForSize(product, size ?? null),
      currency: product.currency,
      image: product.image,
      size: size ?? null,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const label = disabled
    ? disabledLabel ?? t('pdp.selectSize')
    : added
    ? t('pdp.addedToBag')
    : t('pdp.addToBag');

  const stateClass = disabled
    ? 'border border-[#E5DDD0] bg-[#F3F1EC] text-[#9CA39F] sm:py-3.5'
    : added
    ? 'bg-[#C89F53] text-white sm:py-3.5'
    : 'bg-[#1A3A2A] text-white hover:bg-[#2D5A3D] sm:py-3.5';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={trulyDisabled}
      aria-disabled={disabled}
      className={`flex w-full items-center justify-center rounded-sm py-4 text-xs font-medium uppercase tracking-[0.2em] transition-colors ${stateClass}`}
    >
      <span className="inline-flex items-center justify-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
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
        {label}
      </span>
    </button>
  );
};
