'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

interface Slide {
  src: string;
  altKey: string;
  href: string;
}

const SLIDES: Slide[] = [
  { src: '/images/hero-1.jpg', altKey: 'home.hero.slide1.alt', href: '/collections' },
  { src: '/images/hero-2.jpg', altKey: 'home.hero.slide2.alt', href: '/shop' },
  { src: '/images/hero-3.jpg', altKey: 'home.hero.slide3.alt', href: '/bridal' },
  { src: '/images/hero-4.jpg', altKey: 'home.hero.slide4.alt', href: '/bridal' },
];

const INTERVAL_MS = 5000;
const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
const SWIPE_THRESHOLD = 50;

export const HeroCarousel: React.FC = () => {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAuto = () => {
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
  };

  const stopAuto = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, []);

  const goTo = (next: number) => {
    const wrapped = (next + SLIDES.length) % SLIDES.length;
    setIndex(wrapped);
    stopAuto();
    startAuto();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndXRef.current = null;
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const delta = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta > 0) {
        goTo(index + 1);
      } else {
        goTo(index - 1);
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  return (
    <section className="relative w-full">
      <div
        className="relative aspect-[16/9] w-full overflow-hidden bg-[#0E372B] touch-pan-y md:aspect-auto md:h-[calc(100vh-115px)]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {SLIDES.map((slide, i) => {
          const alt = t(slide.altKey);
          return (
            <Link
              key={slide.src}
              href={slide.href}
              aria-label={alt}
              className="absolute inset-0 block"
            >
              <img
                src={slide.src}
                alt={alt}
                width={1920}
                height={1080}
                className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
                draggable={false}
                style={{
                  opacity: i === index ? 1 : 0,
                  transition: `opacity 1000ms ${EASE}`,
                }}
              />
            </Link>
          );
        })}

        <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goTo(i);
              }}
              aria-label={t('home.hero.goToSlide', { n: i + 1 })}
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