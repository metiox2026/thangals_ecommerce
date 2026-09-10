import React from 'react';
import Link from 'next/link';
import { api, Store } from '@/lib/api';
import { StoreMap } from '@/components/StoreMap';

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

      <div className="mt-10">
        <StoreMap stores={stores} />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => {
          const mapHref =
            store.mapUrl && store.mapUrl !== '#'
              ? store.mapUrl
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.name} ${store.address} ${store.emirate}`)}`;
          return (
            <div key={store.id} className="border-t border-[#E5DDD0] pt-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#B8975A]">
                {store.emirate}
              </p>
              <h2 className="mt-1 font-jost text-2xl text-[#1C1C1C]">{store.name}</h2>
              <p className="mt-2 text-xs text-[#444]">{store.address}</p>
              <p className="mt-1 text-xs text-[#777]">{store.hours}</p>
              <div className="mt-3 flex items-center gap-4">
                <a
                  href={`tel:${store.phone}`}
                  className="text-xs font-medium text-[#1A3A2A] hover:underline"
                >
                  {store.phone}
                </a>
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium uppercase tracking-[0.15em] text-[#B8975A] hover:underline"
                >
                  View on map →
                </a>
              </div>
            </div>
          );
        })}
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
