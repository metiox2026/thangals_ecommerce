'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  query: string;
  products: Product[];
}

export const SearchResults: React.FC<Props> = ({ query, products }) => {
  const { t, lang } = useLanguage();

  const results = useMemo(() => {
    if (!query) return [] as Product[];
    const needle = query.toLowerCase().trim();
    if (!needle) return [];
    const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wordRe = new RegExp(`(?:^|\\b|[^a-z0-9])${escaped}(?:$|\\b|[^a-z0-9])`, 'i');
    return products.filter((p) => {
      const textHaystack = `${p.name} ${p.subtitle} ${p.description} ${p.metal} ${p.stone ?? ''}`;
      const category = p.category.toLowerCase();
      // Word-boundary match on free text so "ring" matches "gold ring" but
      // NOT "layering" or "string". Category uses exact match so "ring"
      // matches the rings category but NOT "earrings".
      return (
        wordRe.test(textHaystack) ||
        category === needle ||
        category === `${needle}s`
      );
    });
  }, [query, products]);

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-white px-6 py-12 lg:px-10">
      <div className="w-full max-w-[1400px]">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[#B8975A]">{t('search.eyebrow')}</p>
          {query ? (
            <>
              <h1 className="mt-2 font-serif text-4xl font-normal text-[#1C1C1C] sm:text-5xl">
                {t('search.resultsFor', { q: query })}
              </h1>
              <div className="mx-auto mt-3 h-[1px] w-12 bg-[#B8975A]" />
              <p className="mt-3 text-xs text-[#777]">
                {t('search.count', { n: results.length })}
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-2 font-serif text-4xl font-normal text-[#1C1C1C] sm:text-5xl">
                {t('search.title')}
              </h1>
              <div className="mx-auto mt-3 h-[1px] w-12 bg-[#B8975A]" />
              <p className="mt-3 text-xs text-[#777]">{t('search.prompt')}</p>
            </>
          )}
        </div>

        {query && results.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-sm text-[#444]">{t('search.empty')}</p>
            <Link
              href="/shop"
              className="mt-6 inline-block rounded-sm bg-[#1A3A2A] px-10 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-white hover:bg-[#2D5A3D]"
            >
              {t('search.browseAll')}
            </Link>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} view="grid" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
