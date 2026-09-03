import React from 'react';
import Link from 'next/link';
import { api, Store } from '@/lib/api';

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

      <div className="mt-10 overflow-hidden rounded-sm">
        <img
          src="/images/boutique.jpg"
          alt="Thangals boutique interior"
          className="h-[380px] w-full object-cover"
        />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <div key={store.id} className="border-t border-[#E5DDD0] pt-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#B8975A]">
              {store.emirate}
            </p>
            <h2 className="mt-1 font-serif text-2xl text-[#1C1C1C]">{store.name}</h2>
            <p className="mt-2 text-xs text-[#444]">{store.address}</p>
            <p className="mt-1 text-xs text-[#777]">{store.hours}</p>
            <a
              href={`tel:${store.phone}`}
              className="mt-3 inline-block text-xs font-medium text-[#1A3A2A] hover:underline"
            >
              {store.phone}
            </a>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/contact"
          className="inline-block rounded-sm bg-[#1A3A2A] px-10 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-white hover:bg-[#2D5A3D]"
        >
          Book a Private Viewing
        </Link>
      </div>
    </div>
  );
}
