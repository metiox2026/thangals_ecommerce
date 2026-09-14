'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalizedProduct } from '@/lib/hooks/useLocalizedProduct';

interface ProductBreadcrumbProps {
  product: Product;
}

export const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({ product }) => {
  const { t } = useLanguage();
  const p = useLocalizedProduct(product);
  return (
    <nav className="mb-8 text-xs text-[#777] lg:mb-3">
      <Link href="/" className="hover:underline">
        {t('pdp.breadcrumb.home')}
      </Link>
      <span className="mx-2">/</span>
      <Link href="/shop" className="hover:underline">
        {t('pdp.breadcrumb.shop')}
      </Link>
      <span className="mx-2">/</span>
      <span className="text-[#1C1C1C]">{p.name}</span>
    </nav>
  );
};
