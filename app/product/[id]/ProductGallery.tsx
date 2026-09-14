'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSwipe, setLightboxSwipe] = useState(0);
  const [lightboxAnimating, setLightboxAnimating] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'transitioning'>('idle');
  const [phantomSrc, setPhantomSrc] = useState<string | null>(null);
  const [phantomOffset, setPhantomOffset] = useState(0);
  const [hoverZoom, setHoverZoom] = useState(false);
  const [hoverOrigin, setHoverOrigin] = useState('50% 50%');
  const containerRef = useRef<HTMLDivElement>(null);
  const lightboxTouchRef = useRef<{
    startX: number;
    startY: number;
    dx: number;
    dy: number;
  } | null>(null);
  const lightboxTimerRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (!lightboxOpen) return;
    if (lightboxTimerRef.current) {
      clearTimeout(lightboxTimerRef.current);
      lightboxTimerRef.current = null;
    }
    setLightboxSwipe(0);
    setLightboxAnimating(false);
    setPhase('idle');
    setPhantomSrc(null);
    setPhantomOffset(0);
    const prevOverflow = document.body.style.overflow;
    const prevDataset = document.body.dataset.modalOpen;
    document.body.style.overflow = 'hidden';
    document.body.dataset.modalOpen = 'true';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      else if (e.key === 'ArrowRight') setActive((a) => (a + 1) % total);
      else if (e.key === 'ArrowLeft') setActive((a) => (a - 1 + total) % total);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      if (prevDataset === undefined) delete document.body.dataset.modalOpen;
      else document.body.dataset.modalOpen = prevDataset;
      window.removeEventListener('keydown', onKey);
      if (lightboxTimerRef.current) {
        clearTimeout(lightboxTimerRef.current);
        lightboxTimerRef.current = null;
      }
      setLightboxSwipe(0);
      setLightboxAnimating(false);
      setPhase('idle');
      setPhantomSrc(null);
      setPhantomOffset(0);
    };
  }, [lightboxOpen, total]);

  const onLightboxTouchStart = (e: React.TouchEvent) => {
    if (total <= 1 || lightboxTimerRef.current) return;
    const t = e.touches[0];
    lightboxTouchRef.current = { startX: t.clientX, startY: t.clientY, dx: 0, dy: 0 };
  };

  const onLightboxTouchMove = (e: React.TouchEvent) => {
    if (!lightboxTouchRef.current || lightboxTimerRef.current) return;
    const t = e.touches[0];
    const dx = t.clientX - lightboxTouchRef.current.startX;
    const dy = t.clientY - lightboxTouchRef.current.startY;
    lightboxTouchRef.current.dx = dx;
    lightboxTouchRef.current.dy = dy;
    let vw = (dx / window.innerWidth) * 100;
    if (vw > 30) vw = 30 + (vw - 30) * 0.3;
    if (vw < -30) vw = -30 + (vw - -30) * 0.3;
    setLightboxSwipe(vw);
    setLightboxAnimating(false);
  };

  const onLightboxTouchEnd = () => {
    const ref = lightboxTouchRef.current;
    lightboxTouchRef.current = null;
    if (!ref || total <= 1) {
      setLightboxSwipe(0);
      return;
    }
    const horizontalDominant = Math.abs(ref.dx) > Math.abs(ref.dy) * 1.5;
    if (!horizontalDominant) {
      setLightboxAnimating(true);
      setLightboxSwipe(0);
      lightboxTimerRef.current = window.setTimeout(() => {
        lightboxTimerRef.current = null;
        setLightboxAnimating(false);
      }, 240);
      return;
    }
    const goingForward = ref.dx < 0;
    const currentV = (ref.dx / window.innerWidth) * 100;
    const threshold = 18;
    if (Math.abs(currentV) < threshold) {
      setLightboxAnimating(true);
      setLightboxSwipe(0);
      lightboxTimerRef.current = window.setTimeout(() => {
        lightboxTimerRef.current = null;
        setLightboxAnimating(false);
      }, 240);
      return;
    }
    startLightboxTransition(goingForward);
  };

  const startLightboxTransition = (forward: boolean) => {
    const newIdx = forward ? (active + 1) % total : (active - 1 + total) % total;
    const newSrc = images[newIdx];
    const currentTarget = forward ? -100 : 100;
    const phantomStart = forward ? 100 : -100;
    const phantomTarget = 0;

    setPhase('transitioning');
    setPhantomSrc(newSrc);
    setPhantomOffset(phantomStart);
    setLightboxAnimating(false);
    setLightboxSwipe((prev) => prev);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setLightboxAnimating(true);
        setLightboxSwipe(currentTarget);
        setPhantomOffset(phantomTarget);
        lightboxTimerRef.current = window.setTimeout(() => {
          lightboxTimerRef.current = null;
          setActive(newIdx);
          setPhase('idle');
          setPhantomSrc(null);
          setPhantomOffset(0);
          setLightboxSwipe(0);
          setLightboxAnimating(false);
        }, 260);
      });
    });
  };

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

  const isHoverZoomEligible = () =>
    typeof window !== 'undefined' && window.innerWidth >= 1024;

  const onContainerMouseEnter = () => {
    if (isHoverZoomEligible()) setHoverZoom(true);
  };

  const onContainerMouseMove = (e: React.MouseEvent) => {
    if (!isHoverZoomEligible()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    setHoverOrigin(`${xPct}% ${yPct}%`);
  };

  const onContainerMouseLeave = () => setHoverZoom(false);

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
        className="group relative w-full cursor-zoom-in overflow-hidden rounded-sm border border-[#E5DDD0] bg-[#FAF8F5]"
        style={size ? { height: `${size}px` } : { height: 0 }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseEnter={onContainerMouseEnter}
        onMouseMove={onContainerMouseMove}
        onMouseLeave={onContainerMouseLeave}
        onClick={() => setLightboxOpen(true)}
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
                style={{
                  backfaceVisibility: 'hidden',
                  transform: i === active && hoverZoom ? 'scale(2)' : 'scale(1)',
                  transformOrigin: hoverOrigin,
                  transition: 'transform 200ms ease-out',
                }}
              />
            </div>
          ))}
        </div>
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous image"
              onMouseEnter={() => setHoverZoom(false)}
              onMouseLeave={() => {
                if (isHoverZoomEligible()) setHoverZoom(true);
              }}
              className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 flex items-center justify-center p-2 text-white opacity-0 mix-blend-difference transition-opacity duration-200 group-hover:opacity-60 sm:flex"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next image"
              onMouseEnter={() => setHoverZoom(false)}
              onMouseLeave={() => {
                if (isHoverZoomEligible()) setHoverZoom(true);
              }}
              className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 flex items-center justify-center p-2 text-white opacity-0 mix-blend-difference transition-opacity duration-200 group-hover:opacity-60 sm:flex"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </>
        )}
        <div
          className="absolute right-2 top-2 z-10 sm:hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <ShareButton
            productName={name}
            className="flex size-7 items-center justify-center text-[#144B3C] opacity-60 transition-opacity hover:opacity-100"
          />
        </div>
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

      {lightboxOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center overscroll-contain bg-white/95"
            style={{
              WebkitTapHighlightColor: 'transparent',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
            }}
            onClick={() => setLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(false);
              }}
              aria-label="Close"
              className="absolute z-10 flex size-11 cursor-pointer touch-manipulation items-center justify-center rounded-full text-[#1A2621] opacity-70 transition-opacity hover:opacity-100"
              style={{
                top: 'max(12px, env(safe-area-inset-top))',
                right: 'max(12px, env(safe-area-inset-right))',
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive((a) => (a - 1 + total) % total);
                  }}
                  aria-label="Previous image"
                  className="absolute z-10 flex size-12 -translate-y-1/2 cursor-pointer touch-manipulation items-center justify-center rounded-full text-[#1A2621] opacity-70 transition-opacity hover:opacity-100"
                  style={{
                    top: '50%',
                    left: 'max(8px, env(safe-area-inset-left))',
                  }}
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive((a) => (a + 1) % total);
                  }}
                  aria-label="Next image"
                  className="absolute z-10 flex size-12 -translate-y-1/2 cursor-pointer touch-manipulation items-center justify-center rounded-full text-[#1A2621] opacity-70 transition-opacity hover:opacity-100"
                  style={{
                    top: '50%',
                    right: 'max(8px, env(safe-area-inset-right))',
                  }}
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div
              className="relative flex w-full items-center justify-center overflow-hidden"
              style={{
                height: '85dvh',
                touchAction: 'none',
              }}
              onTouchStart={onLightboxTouchStart}
              onTouchMove={onLightboxTouchMove}
              onTouchEnd={onLightboxTouchEnd}
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[active]}
                alt={`${name} — view ${active + 1}`}
                width={1600}
                height={1600}
                loading="eager"
                decoding="async"
                draggable={false}
                className="max-h-[85dvh] max-w-[92vw] touch-manipulation select-none object-contain"
                style={{
                  transform: `translateX(${lightboxSwipe}vw)`,
                  transition: lightboxAnimating ? 'transform 260ms ease-out' : 'none',
                  willChange: 'transform',
                  WebkitTouchCallout: 'none',
                  WebkitUserDrag: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                }}
              />
              {phase === 'transitioning' && phantomSrc && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={phantomSrc}
                  alt=""
                  width={1600}
                  height={1600}
                  loading="eager"
                  decoding="async"
                  draggable={false}
                  className="pointer-events-none absolute max-h-[85dvh] max-w-[92vw] select-none object-contain"
                  style={{
                    transform: `translateX(${phantomOffset}vw)`,
                    transition: 'transform 260ms ease-out',
                    willChange: 'transform',
                    WebkitTouchCallout: 'none',
                    WebkitUserDrag: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                  }}
                />
              )}
            </div>

            {total > 1 && (
              <p
                className="absolute left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.24em] text-[#60736A]"
                style={{
                  bottom: 'max(16px, env(safe-area-inset-bottom))',
                }}
              >
                {active + 1} / {total}
              </p>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
};
