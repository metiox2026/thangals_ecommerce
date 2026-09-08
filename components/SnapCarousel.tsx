'use client';

import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import Link from 'next/link';

export type SnapItem = {
  title: string;
  desc: string;
  img: string;
  link: string;
};

export const SnapCarousel: React.FC<{ items: SnapItem[] }> = ({ items }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || items.length === 0) return;

    const middleIndex = Math.floor(items.length / 2);
    const middleEl = el.children[middleIndex] as HTMLElement | undefined;
    if (!middleEl) return;

    const target =
      middleEl.offsetLeft - (el.clientWidth - middleEl.clientWidth) / 2;

    el.scrollTo({ left: target, behavior: 'auto' });
  }, [items.length]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const containerCenter = el.scrollLeft + el.clientWidth / 2;
      let nearest = 0;
      let nearestDist = Infinity;
      Array.from(el.children).forEach((child, i) => {
        const tileCenter = (child as HTMLElement).offsetLeft + (child as HTMLElement).offsetWidth / 2;
        const dist = Math.abs(tileCenter - containerCenter);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = i;
        }
      });
      setActiveIndex(nearest);
    };

    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [items.length]);

  return (
    <div className="mt-8 md:mt-12">
      <div
        ref={ref}
        className="snap-scroll flex snap-x snap-mandatory snap-stop-always gap-4 overflow-x-auto overflow-y-hidden pb-4 md:gap-6 md:pb-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0"
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x pan-y',
          overscrollBehaviorX: 'contain',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          width: '100%',
          transform: 'translateZ(0)',
        }}
      >
        {items.map((tile) => (
          <Link
            key={tile.title}
            href={tile.link}
            className="group block min-w-[70%] snap-center sm:min-w-[55%] md:min-w-[50%] lg:min-w-0 lg:snap-align-none"
          >
            <div className="media-zoom relative bg-[#F2F6F4]">
              <img
                src={tile.img}
                alt={tile.title}
                loading="lazy"
                width={912}
                height={1200}
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
            <div className="mt-3 text-center md:mt-4">
              <h3 className="font-display text-lg text-[#1A2621] md:text-2xl">{tile.title}</h3>
              <p className="mt-1 text-xs text-[#60736A] md:text-sm">{tile.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2 lg:hidden">
        {items.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              i === activeIndex ? 'w-6 bg-[#144B3C]' : 'w-1.5 bg-[#C8D2CE]'
            }`}
          />
        ))}
      </div>
    </div>
  );
};