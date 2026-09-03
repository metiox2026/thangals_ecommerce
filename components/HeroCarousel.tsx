'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Slide {
  src: string;
  alt: string;
  href: string;
}

const SLIDES: Slide[] = [
  {
    src: '/images/hero-1.jpg',
    alt: 'Made for your moments — Thangals emerald and gold jewellery',
    href: '/collections',
  },
  {
    src: '/images/hero-2.jpg',
    alt: 'Gold for every day — Timeless 18K pieces from Thangals',
    href: '/shop',
  },
  {
    src: '/images/hero-3.jpg',
    alt: 'Made for your forever — Thangals bridal emerald and gold jewellery',
    href: '/bridal',
  },
  {
    src: '/images/hero-4.jpg',
    alt: 'A little sparkle, a lasting memory — Thangals wedding jewellery',
    href: '/bridal',
  },
];

const INTERVAL_MS = 5000;
const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';

export const HeroCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative">
      <div className="relative h-[calc(100vh-115px)] w-full overflow-hidden bg-[#0E372B]">
        {SLIDES.map((slide, i) => (
          <Link
            key={slide.src}
            href={slide.href}
            aria-label={slide.alt}
            className="absolute inset-0 block"
          >
            <img
              src={slide.src}
              alt={slide.alt}
              width={1920}
              height={1080}
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                opacity: i === index ? 1 : 0,
                transition: `opacity 1000ms ${EASE}`,
              }}
            />
          </Link>
        ))}

        <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIndex(i);
              }}
              aria-label={`Go to slide ${i + 1}`}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === index ? '24px' : '8px',
                backgroundColor: i === index ? '#FFFFFF' : 'rgba(255, 255, 255, 0.55)',
                boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.3)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
