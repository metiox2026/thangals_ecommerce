'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Product } from '@/lib/api';
import { usePageScroll } from '@/context/ScrollContext';
import { AddToBagButton } from './AddToBagButton';
import { WishlistToggle } from './WishlistToggle';

const SCROLL_THRESHOLD = 10;

export const MobileActionBar: React.FC<{ product: Product }> = ({ product }) => {
  const [mounted, setMounted] = useState(false);
  const [atRelated, setAtRelated] = useState(false);
  const [atFooter, setAtFooter] = useState(false);
  const { scrollY } = usePageScroll();

  useEffect(() => {
    setMounted(true);

    const related = document.getElementById('related-products');
    const footer = document.getElementById('site-footer');
    if (!related && !footer) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === related) setAtRelated(entry.isIntersecting);
          if (entry.target === footer) setAtFooter(entry.isIntersecting);
        }
      },
      { rootMargin: '0px 0px -60px 0px' },
    );
    if (related) io.observe(related);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, []);

  if (!mounted) return null;

  const visible = scrollY > SCROLL_THRESHOLD && !atRelated && !atFooter;

  return createPortal(
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-[60] rounded-t-2xl border-t border-[#E5DDD0] bg-white px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 ease-out sm:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center gap-3 py-1.5">
        <div className="flex-1">
          <AddToBagButton product={product} />
        </div>
        <WishlistToggle product={product} />
      </div>
    </div>,
    document.body,
  );
};
