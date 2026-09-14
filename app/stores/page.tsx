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
      <StoresList stores={stores} />
    </div>
  );
}
