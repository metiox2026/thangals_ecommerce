'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

const MIN_VISIBLE_MS = 2000;
const FADE_OUT_MS = 500;
const HARD_TIMEOUT_MS = 8000;

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function shouldSkipLoader(): boolean {
  if (typeof document === 'undefined') return false;
  if (document.documentElement.hasAttribute('data-loader-skip')) return true;
  try {
    return sessionStorage.getItem('thangals_loader_shown') === '1';
  } catch {
    return false;
  }
}

export const InitialLoader: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  const isProductRoute = pathname?.startsWith('/product/') ?? false;
  // Initial state must match server output (visible=true on non-product routes)
  // so hydration doesn't mismatch. We hide via layout effect on first paint
  // when the loader was already shown in this session.
  const [visible, setVisible] = useState(!isProductRoute);
  const [hiding, setHiding] = useState(false);
  const finishedRef = useRef(false);

  useIsomorphicLayoutEffect(() => {
    if (typeof document === 'undefined') return;
    if (shouldSkipLoader()) {
      setVisible(false);
    }
  }, []);

  useEffect(() => {
    if (pathname?.startsWith('/product/')) {
      setVisible(false);
      return;
    }
    if (typeof window === 'undefined') return;

    if (shouldSkipLoader()) {
      setVisible(false);
      return;
    }

    const startTime = Date.now();
    let loadTimer = 0;
    let hardTimer = 0;
    let fadeOutTimer = 0;

    const cleanup = () => {
      window.removeEventListener('load', onLoad);
      window.clearTimeout(loadTimer);
      window.clearTimeout(hardTimer);
      window.clearTimeout(fadeOutTimer);
    };

    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      cleanup();

      const elapsed = Date.now() - startTime;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      fadeOutTimer = window.setTimeout(() => {
        setHiding(true);
        fadeOutTimer = window.setTimeout(() => {
          setVisible(false);
          try {
            sessionStorage.setItem('thangals_loader_shown', '1');
            document.documentElement.setAttribute('data-loader-skip', '');
          } catch {
            /* storage unavailable — ignore */
          }
        }, FADE_OUT_MS);
      }, wait);
    };

    const onLoad = () => {
      window.removeEventListener('load', onLoad);
      window.clearTimeout(hardTimer);
      hardTimer = 0;
      finish();
    };

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', onLoad);
      loadTimer = window.setTimeout(onLoad, 4000);
      hardTimer = window.setTimeout(finish, HARD_TIMEOUT_MS);

      return cleanup;
    }
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={t('loader.loading')}
      className={`fixed inset-x-0 z-[200] flex items-center justify-center bg-[#004237] transition-opacity duration-500 ease-out ${
        hiding ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ top: 'env(safe-area-inset-top)', bottom: 0 }}
    >
      <img
        src="/loader-logo.gif"
        alt="Thangals"
        className="w-40 sm:w-48 md:w-56 lg:w-48"
        draggable={false}
      />
    </div>
  );
};

