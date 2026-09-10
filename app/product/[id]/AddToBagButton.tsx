'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/api';
import { useBag } from '@/context/BagContext';

export const AddToBagButton: React.FC<{ product: Product }> = ({ product }) => {
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
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleAdd}
      className={`w-full rounded-sm py-4 text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
        added
          ? 'bg-[#C89F53] text-white'
          : 'bg-[#1A3A2A] text-white hover:bg-[#2D5A3D]'
      }`}
    >
      {added ? 'Added to Cart' : 'Add to Cart'}
    </button>
  );
};
