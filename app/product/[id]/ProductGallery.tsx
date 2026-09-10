'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ShareButton } from './ShareButton';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

const SWIPE_THRESHOLD_PCT = 12;
const SWIPE_ANIM_MS = 240;

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, name }) => {
  const [active, setActive] = useState(0);
  const total = images.length;
  const startXRef = useRef<number | null>(null);
  const dragPctRef = useRef(0);
  const animatingRef = useRef(false);
  const containerWidthRef = useRef(0);
  const [pct, setPct] = useState(0);
  const [animated, setAnimated] = useState(false);
  const [size, setSize] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      containerWidthRef.current = w;
      setSize(w);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      if (typeof img.decode === 'function') {
        img.decode().catch(() => {});
      }
    });
  }, [images]);

  const goTo = useCallback(
    (idx: number) => {
      if (total === 0) return;
      setActive(((idx % total) + total) % total);
    },
    [total],
  );

  const animateTo = useCallback(
    (newIdx: number) => {
      if (animatingRef.current) return;
      if (newIdx === active) return;

      const forward = (newIdx - active + total) % total;
      const backward = (active - newIdx + total) % total;
      const direction: 1 | -1 = forward <= backward ? 1 : -1;
      const isAdjacent = forward === 1 || backward === 1;

      if (!isAdjacent) {
        animatingRef.current = true;
        goTo(newIdx);
        window.setTimeout(() => {
          animatingRef.current = false;
        }, 60);
        return;
      }

      animatingRef.current = true;
      setAnimated(true);
      setPct(-direction * 100);
      window.setTimeout(() => {
        goTo(newIdx);
        setPct(0);
        setAnimated(false);
        animatingRef.current = false;
      }, SWIPE_ANIM_MS);
    },
    [active, goTo, total],
  );

  const prev = useCallback(() => animateTo(active - 1), [active, animateTo]);
  const next = useCallback(() => animateTo(active + 1), [active, animateTo]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (animatingRef.current) return;
    startXRef.current = e.touches[0].clientX;
    dragPctRef.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startXRef.current === null || containerWidthRef.current === 0) return;
    const delta = e.touches[0].clientX - startXRef.current;
    dragPctRef.current = (delta / containerWidthRef.current) * 100;
    setPct(dragPctRef.current);
  };

  const onTouchEnd = () => {
    if (startXRef.current === null) return;
    const dragged = dragPctRef.current;
    startXRef.current = null;
    dragPctRef.current = 0;

    if (Math.abs(dragged) > SWIPE_THRESHOLD_PCT) {
      const direction = dragged < 0 ? 1 : -1;
      animatingRef.current = true;
      setAnimated(true);
      setPct(-direction * 100);
      window.setTimeout(() => {
        goTo(active + direction);
        setPct(0);
        setAnimated(false);
        animatingRef.current = false;
      }, SWIPE_ANIM_MS);
    } else {
      animatingRef.current = true;
      setAnimated(true);
      setPct(0);
      window.setTimeout(() => {
        setAnimated(false);
        animatingRef.current = false;
      }, SWIPE_ANIM_MS);
    }
  };

  if (total === 0) return null;

  const transitionStyle = animated ? `transform ${SWIPE_ANIM_MS}ms ease-out` : 'none';

  const trackStyle: React.CSSProperties = {
    width: size ? `${size * total}px` : '100%',
    height: size ? `${size}px` : '100%',
    transform: `translate3d(${-active * size + (size ? (pct / 100) * size : 0)}px, 0, 0)`,
    transition: transitionStyle,
    willChange: 'transform',
    backfaceVisibility: 'hidden',
  };

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="group relative w-full overflow-hidden rounded-sm border border-[#E5DDD0] bg-[#FAF8F5]"
        style={size ? { height: `${size}px` } : { height: 0 }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="absolute inset-0 flex" style={trackStyle}>
          {images.map((src, i) => (
            <div
              key={src + i}
              style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
              className="relative shrink-0 grow-0"
            >
              <img
                src={src}
                alt={i === active ? `${name} — view ${i + 1}` : ''}
                aria-hidden={i !== active}
                width={800}
                height={800}
                loading="eager"
                decoding="async"
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ backfaceVisibility: 'hidden' }}
              />
            </div>
          ))}
        </div>
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 flex items-center justify-center p-2 text-white opacity-0 mix-blend-difference transition-opacity duration-200 group-hover:opacity-60 sm:flex"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 flex items-center justify-center p-2 text-white opacity-0 mix-blend-difference transition-opacity duration-200 group-hover:opacity-60 sm:flex"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </>
        )}
        <ShareButton
          productName={name}
          className="absolute right-2 top-2 z-10 flex size-7 items-center justify-center text-[#144B3C] opacity-60 transition-opacity hover:opacity-100 sm:hidden"
        />
      </div>

      {total > 1 && (
        <div className="mx-auto mt-3 grid w-[224px] grid-cols-4 gap-2 sm:mt-4 sm:w-[236px] sm:gap-3">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => animateTo(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === active}
              className={`block h-[50px] w-[50px] cursor-pointer overflow-hidden border bg-[#FAF8F5] transition-colors ${
                i === active ? 'border-[#144B3C]' : 'border-[#E5DDD0] hover:border-[#1A2621]'
              }`}
            >
              <img
                src={src}
                alt=""
                width={50}
                height={50}
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
