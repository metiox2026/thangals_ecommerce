'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { CustomSelect, SelectOption } from '@/components/CustomSelect';
import { FilterTrigger } from '@/components/FilterPanel';

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

export const ShopControls: React.FC<ShopControlsProps> = ({
  totalCount,
  activeSort,
  activeView,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    <div className="mt-6 flex items-center justify-between gap-3 border-y border-[#E5DDD0] py-4 sm:mt-8 sm:gap-4">
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

        <FilterTrigger />

        <button
          type="button"
          onClick={toggleView}
          aria-label={activeView === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
          aria-pressed={activeView === 'list'}
          className={`flex shrink-0 items-center justify-center border bg-white outline-none transition-colors cursor-pointer min-h-[40px] min-w-[40px] sm:min-h-[48px] sm:min-w-[48px] h-10 w-10 sm:h-12 sm:w-12 ${
            activeView === 'list'
              ? 'border-[#1A3A2A] bg-[#F2F6F4] text-[#1A3A2A]'
              : 'border-[#E5DDD0] text-[#1A3A2A] hover:border-[#1A3A2A] hover:bg-[#F2F6F4]'
          }`}
        >
          {activeView === 'grid' ? LIST_ICON : GRID_ICON}
        </button>
      </div>
    </div>
  );
};
