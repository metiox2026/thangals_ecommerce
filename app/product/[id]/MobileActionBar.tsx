'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Product } from '@/lib/api';
import { usePageScroll } from '@/context/ScrollContext';
import { setStickyBarType } from '@/components/StickyBarVisibility';
import { AddToBagButton } from './AddToBagButton';
import { WishlistToggle } from './WishlistToggle';

const SCROLL_THRESHOLD = 10;

interface MobileActionBarProps {
  product: Product;
  size: string | null;
  disabled: boolean;
  onDisabledClick?: () => void;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({
  product,
  size,
  disabled,
  onDisabledClick,
}) => {
  const [mounted, setMounted] = useState(false);
  const [atRelated, setAtRelated] = useState(false);
  const [atReviews, setAtReviews] = useState(false);
  const [atFooter, setAtFooter] = useState(false);
  const { scrollY } = usePageScroll();

  useEffect(() => {
    setMounted(true);

    const related = document.getElementById('related-products');
    const reviews = document.getElementById('reviews');
    const footer = document.getElementById('site-footer');
    if (!related && !reviews && !footer) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === related) setAtRelated(entry.isIntersecting);
          if (entry.target === reviews) setAtReviews(entry.isIntersecting);
          if (entry.target === footer) setAtFooter(entry.isIntersecting);
        }
      },
      { rootMargin: '0px 0px -60px 0px' },
    );
    if (related) io.observe(related);
    if (reviews) io.observe(reviews);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, []);

  const visible = scrollY > SCROLL_THRESHOLD && !atRelated && !atReviews && !atFooter;

  useEffect(() => {
    setStickyBarType(visible ? 'product' : null);
    return () => setStickyBarType(null);
  }, [visible]);

  if (!mounted) return null;

  return createPortal(
    <div
      aria-hidden={!visible}
      data-mobile-action-bar
      className={`fixed inset-x-0 bottom-0 z-[60] rounded-t-2xl border-t border-[#E5DDD0] bg-white px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur transition-transform duration-300 ease-out sm:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center gap-3 py-1.5">
        <div className="flex-1">
          <AddToBagButton
            product={product}
            size={size}
            disabled={disabled}
            disabledLabel="Select size"
            onDisabledClick={onDisabledClick}
          />
        </div>
        <WishlistToggle product={product} />
      </div>
    </div>,
    document.body,
  );
};
