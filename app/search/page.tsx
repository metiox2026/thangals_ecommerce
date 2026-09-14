import React from 'react';
import { api, Product } from '@/lib/api';
import { SearchResults } from './SearchResults';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q ?? '').trim();

  let products: Product[] = [];
  try {
    products = await api.products.list();
  } catch (e) {
    console.error(e);
  }

  return <SearchResults query={query} products={products} />;
}
