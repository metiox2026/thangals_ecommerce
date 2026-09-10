'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Store } from '@/lib/api';
import { StoreMap } from '@/components/StoreMap';

interface Props {
  stores: Store[];
}

const toRad = (d: number) => (d * Math.PI) / 180;
const haversine = (
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number => {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

const formatDistance = (km: number): string => {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
};

export const StoresList: React.FC<Props> = ({ stores }) => {
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);

  const sortedStores = useMemo(() => {
    if (!userLoc) return stores;
    return [...stores]
      .map((s) => ({
        store: s,
        distance:
          typeof s.lat === 'number' && typeof s.lng === 'number'
            ? haversine(userLoc, { lat: s.lat, lng: s.lng })
            : Infinity,
      }))
      .sort((a, b) => a.distance - b.distance)
      .map((x) => x.store);
  }, [stores, userLoc]);

  const distances = useMemo(() => {
    const map = new Map<string, number>();
    if (!userLoc) return map;
    for (const s of stores) {
      if (typeof s.lat === 'number' && typeof s.lng === 'number') {
        map.set(s.id, haversine(userLoc, { lat: s.lat, lng: s.lng }));
      }
    }
    return map;
  }, [stores, userLoc]);

  return (
    <>
      <div className="mt-10">
        <StoreMap stores={stores} onLocate={setUserLoc} />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {sortedStores.map((store) => {
          const mapHref =
            store.mapUrl && store.mapUrl !== '#'
              ? store.mapUrl
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.name} ${store.address} ${store.emirate}`)}`;
          const distance = distances.get(store.id);
          return (
            <div key={store.id} className="border-t border-[#E5DDD0] pt-6">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#B8975A]">
                  {store.emirate}
                </p>
                {typeof distance === 'number' && (
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#1A3A2A]">
                    {formatDistance(distance)}
                  </p>
                )}
              </div>
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
    </>
  );
};
