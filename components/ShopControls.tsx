'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { CustomSelect, SelectOption } from '@/components/CustomSelect';
import { openDrawer } from '@/components/FilterPanel';
import { setStickyBarVisible } from '@/components/StickyBarVisibility';

type SortValue = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';
type ViewValue = 'grid' | 'list';

interface ShopControlsProps {
  totalCount: number;
  activeSort: SortValue;
  activeView: ViewValue;
}

const SORT_OPTIONS: SelectOption<SortValue>[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A → Z' },
];

const SORT_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="sm:h-6 sm:w-6">
    <path d="M3 6h18" />
    <path d="M6 12h12" />
    <path d="M10 18h4" />
  </svg>
);

const GRID_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="sm:h-6 sm:w-6">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

const LIST_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="sm:h-6 sm:w-6">
    <path d="M8 6h13" />
    <path d="M8 12h13" />
    <path d="M8 18h13" />
    <path d="M3 6h.01" />
    <path d="M3 12h.01" />
    <path d="M3 18h.01" />
  </svg>
);

const SORT_ICON_SM = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M6 12h12" />
    <path d="M10 18h4" />
  </svg>
);

const GRID_ICON_SM = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

const LIST_ICON_SM = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 6h13" />
    <path d="M8 12h13" />
    <path d="M8 18h13" />
    <path d="M3 6h.01" />
    <path d="M3 12h.01" />
    <path d="M3 18h.01" />
  </svg>
);

const FILTER_ICON_SM = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

export const ShopControls: React.FC<ShopControlsProps> = ({
  totalCount,
  activeSort,
  activeView,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showTab, setShowTab] = useState(false);
  const inlineRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = inlineRowRef.current;
    if (!row) return;
    const io = new IntersectionObserver(
      ([entry]) => setShowTab(!entry.isIntersecting),
    );
    io.observe(row);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    setStickyBarVisible(showTab);
    return () => setStickyBarVisible(false);
  }, [showTab]);

  const pushParams = (mutate: (sp: URLSearchParams) => void) => {
    const sp = new URLSearchParams(searchParams.toString());
    mutate(sp);
    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleSort = (value: SortValue) => {
    pushParams((sp) => {
      if (value === 'featured') sp.delete('sort');
      else sp.set('sort', value);
    });
  };

  const toggleView = () => {
    pushParams((sp) => {
      if (activeView === 'grid') sp.set('view', 'list');
      else sp.delete('view');
    });
  };

  return (
    <>
      {/* Inline row at top of page; side tab takes over once it scrolls out */}
      <div
        ref={inlineRowRef}
        className="mt-6 flex items-center justify-between gap-3 border-y border-[#E5DDD0] py-4 sm:mt-8 sm:gap-4"
      >
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#60736A] sm:text-[11px]">
          <span className="font-semibold text-[#1A2621]">{totalCount}</span>{' '}
          {totalCount === 1 ? 'piece' : 'pieces'}
        </p>

        <div className="flex items-center gap-2 sm:gap-3">
          <CustomSelect
            label="Sort"
            value={activeSort}
            options={SORT_OPTIONS}
            onChange={handleSort}
            icon={SORT_ICON}
            active={activeSort !== 'featured'}
          />

          <button
            type="button"
            aria-label="Filter"
            onClick={openDrawer}
            className="flex shrink-0 items-center justify-center text-[#1A3A2A] outline-none transition-colors cursor-pointer min-h-[40px] min-w-[40px] hover:text-[#C89F53] sm:min-h-[48px] sm:min-w-[48px] h-10 w-10 sm:h-12 sm:w-12"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="sm:h-6 sm:w-6">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>

          <button
            type="button"
            onClick={toggleView}
            aria-label={activeView === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
            aria-pressed={activeView === 'list'}
            className={`flex shrink-0 items-center justify-center text-[#1A3A2A] outline-none transition-colors cursor-pointer min-h-[40px] min-w-[40px] sm:min-h-[48px] sm:min-w-[48px] h-10 w-10 sm:h-12 sm:w-12 ${
              activeView === 'list' ? 'text-[#C89F53]' : 'hover:text-[#C89F53]'
            }`}
          >
            {activeView === 'grid' ? LIST_ICON : GRID_ICON}
          </button>
        </div>
      </div>

      {/* Mobile: full-width bottom bar (matches product page mobile action bar) */}
      <div
        aria-hidden={!showTab}
        className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ease-out sm:hidden ${
          showTab ? 'translate-y-0' : 'pointer-events-none translate-y-full'
        }`}
      >
        <div
          style={{ boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.06)' }}
          className="flex items-center justify-around border-t border-[#E5DDD0] bg-white rounded-t-2xl px-6 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
        >
          <CustomSelect
            label="Sort"
            value={activeSort}
            options={SORT_OPTIONS}
            onChange={handleSort}
            icon={SORT_ICON}
            align="left"
            active={activeSort !== 'featured'}
            variant="default"
            size="sm"
            direction="up"
            className="h-11 w-11"
          />

          <button
            type="button"
            aria-label="Filter"
            onClick={openDrawer}
            className="flex h-11 w-11 items-center justify-center text-[#144B3C] transition-colors hover:text-[#C89F53] cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>

          <button
            type="button"
            onClick={toggleView}
            aria-label={activeView === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
            aria-pressed={activeView === 'list'}
            className={`flex h-11 w-11 items-center justify-center text-[#144B3C] transition-colors hover:text-[#C89F53] cursor-pointer ${
              activeView === 'list' ? 'text-[#C89F53]' : ''
            }`}
          >
            {activeView === 'grid' ? LIST_ICON : GRID_ICON}
          </button>
        </div>
      </div>

      {/* sm+: vertical right-edge side tab (gold-rate styling); visible after inline row scrolls out */}
      <div
        aria-hidden={!showTab}
        className={`fixed bottom-24 right-0 top-auto z-40 hidden transition-all duration-300 ease-out sm:block md:top-1/2 md:bottom-auto md:-translate-y-[calc(50%-43px)] ${
          showTab ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-full opacity-0'
        }`}
      >
        <div
          style={{ boxShadow: '-1px 1px 3px rgba(0, 0, 0, 0.12)' }}
          className="flex flex-col items-center gap-0 border border-[#E8CB85] bg-white py-0.5 text-[#144B3C] rounded-l-md w-8"
        >
          <CustomSelect
            label="Sort"
            value={activeSort}
            options={SORT_OPTIONS}
            onChange={handleSort}
            icon={SORT_ICON_SM}
            align="right"
            active={activeSort !== 'featured'}
            variant="default"
            size="sm"
            className="h-8 w-8"
          />

          <button
            type="button"
            aria-label="Filter"
            onClick={openDrawer}
            className="flex h-8 w-8 items-center justify-center text-[#144B3C] transition-colors hover:text-[#C89F53] cursor-pointer"
          >
            {FILTER_ICON_SM}
          </button>

          <button
            type="button"
            onClick={toggleView}
            aria-label={activeView === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
            aria-pressed={activeView === 'list'}
            className={`flex h-8 w-8 items-center justify-center text-[#144B3C] transition-colors hover:text-[#C89F53] cursor-pointer ${
              activeView === 'list' ? 'text-[#C89F53]' : ''
            }`}
          >
            {activeView === 'grid' ? LIST_ICON_SM : GRID_ICON_SM}
          </button>
        </div>
      </div>
    </>
  );
};