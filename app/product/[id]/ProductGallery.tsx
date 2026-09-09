'use client';

import React, { useState, useRef, useCallback } from 'react';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

const SWIPE_THRESHOLD = 40;

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, name }) => {
  const [active, setActive] = useState(0);
  const total = images.length;
  const startXRef = useRef<number | null>(null);
  const deltaXRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (idx: number) => {
      if (total === 0) return;
      setActive(((idx % total) + total) % total);
    },
    [total],
  );

  const prev = useCallback(() => goTo(active - 1), [active, goTo]);
  const next = useCallback(() => goTo(active + 1), [active, goTo]);

  const onTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    deltaXRef.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startXRef.current === null) return;
    deltaXRef.current = e.touches[0].clientX - startXRef.current;
  };

  const onTouchEnd = () => {
    if (startXRef.current === null) return;
    if (deltaXRef.current > SWIPE_THRESHOLD) prev();
    else if (deltaXRef.current < -SWIPE_THRESHOLD) next();
    startXRef.current = null;
    deltaXRef.current = 0;
  };

  if (total === 0) return null;

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="group relative w-full overflow-hidden rounded-sm border border-[#E5DDD0] bg-[#FAF8F5]"
        style={{ paddingBottom: '100%', boxSizing: 'border-box' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          key={active}
          src={images[active]}
          alt={`${name} — view ${active + 1}`}
          width={800}
          height={800}
          decoding="async"
          className="absolute top-0 left-0 h-full w-full object-cover"
          draggable={false}
        />

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 z-10 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/50 text-[#1A2621] opacity-60 transition-opacity duration-200 hover:opacity-100 hover:text-[#144B3C] focus-visible:opacity-100 sm:left-3 sm:size-10 sm:opacity-0 sm:group-hover:opacity-60 sm:group-hover:hover:opacity-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 z-10 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/50 text-[#1A2621] opacity-60 transition-opacity duration-200 hover:opacity-100 hover:text-[#144B3C] focus-visible:opacity-100 sm:right-3 sm:size-10 sm:opacity-0 sm:group-hover:opacity-60 sm:group-hover:hover:opacity-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 bg-transparent px-2.5 py-1 opacity-60 transition-opacity duration-200 focus-within:opacity-100 sm:bottom-4 sm:opacity-0 sm:group-hover:opacity-60 sm:group-hover:focus-within:opacity-100">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`size-1.5 cursor-pointer rounded-full transition-all ${
                    i === active ? 'w-4 bg-[#144B3C]' : 'bg-[#1A2621]/40 hover:bg-[#1A2621]/70'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-3 grid w-full grid-cols-4 gap-2 sm:mt-4 sm:gap-3">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === active}
              className={`relative block w-full cursor-pointer overflow-hidden border bg-[#FAF8F5] transition-colors ${
                i === active ? 'border-[#144B3C]' : 'border-[#E5DDD0] hover:border-[#1A2621]'
              }`}
              style={{ paddingBottom: '100%', boxSizing: 'border-box' }}
            >
              <img
                src={src}
                alt=""
                width={200}
                height={200}
                decoding="async"
                className="absolute top-0 left-0 h-full w-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
