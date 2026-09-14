'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const MIN_VISIBLE_MS = 2000;
const FADE_OUT_MS = 500;

export const InitialLoader: React.FC = () => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(() => !pathname?.startsWith('/product/'));
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith('/product/')) {
      setVisible(false);
      return;
    }
    if (typeof window === 'undefined') return;

    if (sessionStorage.getItem('thangals_loader_shown') === '1') {
      setVisible(false);
      return;
    }

    const startTime = Date.now();
    let raf = 0;
    let fallbackTimer = 0;

    const finish = () => {
      const elapsed = Date.now() - startTime;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(() => {
        setHiding(true);
        window.setTimeout(() => {
          setVisible(false);
          try {
            sessionStorage.setItem('thangals_loader_shown', '1');
          } catch {
            /* storage unavailable — ignore */
          }
        }, FADE_OUT_MS);
      }, wait);
    };

    if (document.readyState === 'complete') {
      finish();
    } else {
      const onLoad = () => {
        window.removeEventListener('load', onLoad);
        finish();
      };
      window.addEventListener('load', onLoad);
      // Hard fallback in case 'load' never fires (e.g. stalled requests)
      fallbackTimer = window.setTimeout(finish, 4000);

      return () => {
        window.removeEventListener('load', onLoad);
        window.clearTimeout(fallbackTimer);
        window.cancelAnimationFrame(raf);
      };
    }
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Thangals"
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
