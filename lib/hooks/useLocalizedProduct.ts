'use client';

import { useMemo } from 'react';
import { Product } from '@/lib/api';
import { arProducts } from '@/lib/translations/products';
import { useLanguage } from '@/contexts/LanguageContext';

export function useLocalizedProduct(product: Product): Product {
  const { lang } = useLanguage();

  return useMemo(() => {
    if (lang !== 'AR') return product;
    const ar = arProducts[product.id];
    if (!ar) return product;
    return {
      ...product,
      name: ar.name,
      subtitle: ar.subtitle,
      description: ar.description,
      metal: ar.metal,
      stone: ar.stone ?? product.stone,
      sizeGuideNote: ar.sizeGuideNote ?? product.sizeGuideNote,
    };
  }, [product, lang]);
}
