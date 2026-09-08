'use client';

import React, { useState, useEffect, useRef } from 'react';
import SimpleBar from 'simplebar-react';
import type SimpleBarCore from 'simplebar-core';
import 'simplebar-react/dist/simplebar.min.css';
import { ScrollProvider } from '@/context/ScrollContext';

export const PageScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef<SimpleBarCore | null>(null);

  useEffect(() => {
    const core = ref.current;
    if (!core) return;
    const el = core.getScrollElement();
    if (!el) return;

    const handler = () => {
      const y = el.scrollTop;
      setScrollY(y);
      window.dispatchEvent(new CustomEvent('pagescroll', { detail: { scrollY: y } }));
    };
    el.addEventListener('scroll', handler, { passive: true });
    handler();

    return () => {
      el.removeEventListener('scroll', handler);
    };
  }, []);

  return (
    <ScrollProvider value={{ scrollY }}>
      <SimpleBar
        ref={ref}
        style={{ height: '100dvh' }}
        autoHide={false}
        className="page-scrollbar"
      >
        {children}
      </SimpleBar>
    </ScrollProvider>
  );
};