import React from 'react';
import { api, Product } from '@/lib/api';
import { HeroCarousel } from '@/components/HeroCarousel';
import { GoldScreenButton } from '@/components/GoldScreenButton';
import { GoldRateButton } from '@/components/GoldRateButton';
import { HomeContents } from './HomeContents';

export default async function HomePage() {
  let products: Product[] = [];

  try {
    products = await api.products.list();
  } catch (e) {
    console.error('API fetch error on homepage:', e);
  }

  return (
    <>
      <HeroCarousel />
      <HomeContents products={products} />
      <GoldScreenButton />
      <GoldRateButton />
    </>
  );
}
