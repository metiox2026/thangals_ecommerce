import React from 'react';
import { api, Store } from '@/lib/api';
import { StoresList } from './StoresList';

export default async function StoresPage() {
  let stores: Store[] = [];
  try {
    stores = await api.stores.list();
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#B8975A]">Visit</p>
        <h1 className="mt-2 font-serif text-4xl font-normal text-[#1C1C1C] sm:text-5xl">
          Our Boutiques
        </h1>
        <div className="mx-auto mt-3 h-[1px] w-12 bg-[#B8975A]" />
        <p className="mt-3 text-xs text-[#777]">
          Private viewing rooms, on-site goldsmiths and same-day resizing at every location across the Emirates.
        </p>
      </div>

      <StoresList stores={stores} />
    </div>
  );
}
