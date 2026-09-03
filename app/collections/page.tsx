import React from 'react';
import Link from 'next/link';
import { api, Collection } from '@/lib/api';

export default async function CollectionsPage() {
  let collections: Collection[] = [];
  try {
    collections = await api.collections.list();
  } catch (e) {
    console.error(e);
  }

  const mainCol = collections.find((c) => c.slug === 'zumurud') || collections[0];
  const otherCols = collections.filter((c) => c.slug !== 'zumurud');

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#B8975A]">The Maison</p>
        <h1 className="mt-2 font-serif text-4xl font-normal text-[#1C1C1C] sm:text-5xl">
          Our Collections
        </h1>
        <div className="mx-auto mt-3 h-[1px] w-12 bg-[#B8975A]" />
        <p className="mt-3 text-xs text-[#777]">
          Four distinct houses, each developed over years with our karigars in Dubai.
        </p>
      </div>

      <div className="mt-12 space-y-12">
        {/* Main Collection Banner */}
        {mainCol && (
          <div className="relative overflow-hidden rounded-sm bg-[#1A3A2A] text-white">
            <div className="relative min-h-[420px] w-full">
              <img
                src={mainCol.image}
                alt={mainCol.name}
                className="h-[420px] w-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center p-8 lg:p-16">
                <div className="max-w-md">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#D4B57A]">
                    {mainCol.tagline}
                  </span>
                  <h2 className="mt-2 font-serif text-4xl sm:text-5xl">{mainCol.name}</h2>
                  <div className="mt-3 h-[1px] w-12 bg-[#B8975A]" />
                  <p className="mt-4 text-xs font-light leading-relaxed text-white/80 sm:text-sm">
                    {mainCol.description}
                  </p>
                  <Link
                    href="/shop"
                    className="mt-6 inline-block rounded-sm bg-[#B8975A] px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#1A3A2A] hover:bg-white"
                  >
                    {mainCol.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid for Other Collections */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {otherCols.map((c) => (
            <Link key={c.slug} href="/shop" className="group block">
              <div className="aspect-[3/4] w-full overflow-hidden rounded-sm bg-neutral-200">
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 font-serif text-2xl font-medium text-[#1C1C1C] group-hover:text-[#2D5A3D]">
                {c.name}
              </h3>
              <p className="mt-1 text-xs text-[#777] leading-relaxed">{c.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
