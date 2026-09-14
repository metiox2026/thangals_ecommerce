'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { CustomSelect, SelectOption } from '@/components/CustomSelect';
import { openDrawer } from '@/components/FilterPanel';

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

const PANEL_MS = 320;
const PANEL_EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';

export const ShopControls: React.FC<ShopControlsProps> = ({
  totalCount,
  activeSort,
  activeView,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [tabOpen, setTabOpen] = useState(false);
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

      {/* Floating side tab — mirrors gold-rate button position; visible after inline row scrolls out */}
      <div
        aria-hidden={!showTab}
        className={`fixed bottom-24 right-0 top-auto z-40 transition-all duration-300 ease-out md:top-1/2 md:bottom-auto md:-translate-y-[calc(50%-43px)] ${
          showTab ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-full opacity-0'
        }`}
      >
        <div
          style={{
            transition: `width ${PANEL_MS}ms ${PANEL_EASE}, height ${PANEL_MS}ms ${PANEL_EASE}, border-radius ${PANEL_MS}ms ${PANEL_EASE}, box-shadow ${PANEL_MS}ms ${PANEL_EASE}`,
            boxShadow: tabOpen ? '0 0 0 0 rgba(0, 0, 0, 0)' : '-1px 1px 3px rgba(0, 0, 0, 0.12)',
          }}
          className={`relative bg-[#144B3C] text-white ${
            tabOpen
              ? 'w-[320px] h-[440px] rounded-l-md'
              : 'w-[32px] h-[120px] rounded-tl-[12px] rounded-bl-[12px]'
          }`}
        >
          {!tabOpen && (
            <button
              type="button"
              onClick={() => setTabOpen(true)}
              aria-label="Open sort and filter"
              className="absolute inset-0 flex cursor-pointer items-center justify-center"
            >
              <span
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  color: '#ffffff',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  whiteSpace: 'nowrap',
                }}
              >
                Sort & Filter
              </span>
            </button>
          )}

          {tabOpen && (
            <div className="absolute inset-0 flex flex-col overflow-y-auto p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.22em] uppercase text-white/70">
                    Refine
                  </p>
                  <p className="mt-1 font-sans text-base font-medium tracking-[0.04em]">
                    Sort & Filter
                  </p>
                  <div className="mt-2 h-px w-10 bg-[#C89F53]" />
                </div>
                <button
                  type="button"
                  onClick={() => setTabOpen(false)}
                  aria-label="Close sort and filter"
                  className="text-white/70 transition-colors hover:text-white"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="mt-3 text-[10px] tracking-[0.12em] uppercase text-white/60">
                {totalCount} {totalCount === 1 ? 'piece' : 'pieces'}
              </p>

              <div className="mt-5">
                <p className="text-[10px] tracking-[0.16em] uppercase text-white/70">
                  Sort by
                </p>
                <div className="mt-2 space-y-0.5">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSort(opt.value)}
                      aria-pressed={activeSort === opt.value}
                      className={`flex w-full items-center justify-between gap-2 px-2 py-1.5 text-left text-[12px] transition-colors ${
                        activeSort === opt.value
                          ? 'text-[#C89F53]'
                          : 'text-white hover:text-[#C89F53]'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {activeSort === opt.value && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="m5 12 5 5 9-11" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  openDrawer();
                  setTabOpen(false);
                }}
                className="mt-5 flex w-full items-center justify-between gap-2 border-t border-white/15 px-2 pt-4 text-left text-[12px] text-white transition-colors hover:text-[#C89F53]"
              >
                <span className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  Filters
                </span>
                <span className="text-[14px] text-white/50">→</span>
              </button>

              <div className="mt-auto border-t border-white/15 pt-4">
                <p className="text-[10px] tracking-[0.16em] uppercase text-white/70">
                  View
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => activeView !== 'grid' && toggleView()}
                    aria-pressed={activeView === 'grid'}
                    className={`flex flex-1 items-center justify-center gap-2 px-3 py-2 text-[11px] uppercase tracking-[0.12em] transition-colors ${
                      activeView === 'grid'
                        ? 'bg-white text-[#144B3C]'
                        : 'border border-white/30 text-white hover:border-white'
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                    </svg>
                    Grid
                  </button>
                  <button
                    type="button"
                    onClick={() => activeView !== 'list' && toggleView()}
                    aria-pressed={activeView === 'list'}
                    className={`flex flex-1 items-center justify-center gap-2 px-3 py-2 text-[11px] uppercase tracking-[0.12em] transition-colors ${
                      activeView === 'list'
                        ? 'bg-white text-[#144B3C]'
                        : 'border border-white/30 text-white hover:border-white'
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M8 6h13" />
                      <path d="M8 12h13" />
                      <path d="M8 18h13" />
                      <path d="M3 6h.01" />
                      <path d="M3 12h.01" />
                      <path d="M3 18h.01" />
                    </svg>
                    List
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};