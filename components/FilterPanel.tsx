'use client';

import React, { useEffect, useMemo, useSyncExternalStore } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type {
  GenderFilter,
  OccasionFilter,
  PriceFilter,
  WeightFilter,
  DiscountFilter,
  PurityFilter,
  MetalColorFilter,
  Product,
} from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

type FilterKey =
  | 'category'
  | 'gender'
  | 'occasion'
  | 'price'
  | 'weight'
  | 'discount'
  | 'purity'
  | 'metalColor';

// === Module-level drawer store ===
// Keeps trigger button and drawer in sync without React Context or
// prop drilling. Both subscribe to the same snapshot.
let _isOpen = false;
const _listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  _listeners.add(cb);
  return () => {
    _listeners.delete(cb);
  };
}

function getSnapshot(): boolean {
  return _isOpen;
}

function getServerSnapshot(): boolean {
  return false;
}

export const openDrawer = (): void => {
  if (_isOpen) return;
  _isOpen = true;
  _listeners.forEach((cb) => cb());
};

export const closeDrawer = (): void => {
  if (!_isOpen) return;
  _isOpen = false;
  _listeners.forEach((cb) => cb());
};

const FILTER_ICON = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="sm:h-6 sm:w-6"
  >
    <path d="M3 5h18l-7 9v6l-4-2v-4z" />
  </svg>
);

const CHECK_ICON = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m5 12 5 5 9-11" />
  </svg>
);

const CLOSE_ICON = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

interface OptionGroup<T extends string> {
  label: string;
  param: FilterKey;
  options: { value: T; label: string }[];
}

const FILTER_KEYS: FilterKey[] = [
  'category',
  'gender',
  'occasion',
  'price',
  'weight',
  'discount',
  'purity',
  'metalColor',
];

function buildSections(t: (key: string) => string): OptionGroup<string>[] {
  return [
    {
      label: t('filter.section.category'),
      param: 'category',
      options: [
        { value: 'earrings', label: t('filter.option.earrings') },
        { value: 'rings', label: t('filter.option.rings') },
        { value: 'bracelets', label: t('filter.option.bracelets') },
        { value: 'necklaces', label: t('filter.option.necklaces') },
        { value: 'bangles', label: t('filter.option.bangles') },
      ],
    },
    {
      label: t('filter.section.gender'),
      param: 'gender',
      options: [
        { value: 'women', label: t('filter.option.women') },
        { value: 'men', label: t('filter.option.men') },
        { value: 'kids', label: t('filter.option.kids') },
      ],
    },
    {
      label: t('filter.section.occasion'),
      param: 'occasion',
      options: [
        { value: 'bridal', label: t('filter.option.bridal') },
        { value: 'everyday', label: t('filter.option.everyday') },
        { value: 'festive', label: t('filter.option.festive') },
        { value: 'wedding', label: t('filter.option.wedding') },
      ],
    },
    {
      label: t('filter.section.price'),
      param: 'price',
      options: [
        { value: 'u1000', label: t('filter.price.u1000') },
        { value: '1000-3000', label: t('filter.price.1000_3000') },
        { value: '3000-6000', label: t('filter.price.3000_6000') },
        { value: '6000plus', label: t('filter.price.6000plus') },
      ],
    },
    {
      label: t('filter.section.weight'),
      param: 'weight',
      options: [
        { value: 'lt5', label: t('filter.weight.lt5') },
        { value: '5-15', label: t('filter.weight.5_15') },
        { value: '15-30', label: t('filter.weight.15_30') },
        { value: '30plus', label: t('filter.weight.30plus') },
      ],
    },
    {
      label: t('filter.section.discount'),
      param: 'discount',
      options: [
        { value: '10plus', label: t('filter.discount.10plus') },
        { value: '25plus', label: t('filter.discount.25plus') },
        { value: '50plus', label: t('filter.discount.50plus') },
      ],
    },
    {
      label: t('filter.section.purity'),
      param: 'purity',
      options: [
        { value: '22K', label: '22K' },
        { value: '18K', label: '18K' },
        { value: '14K', label: '14K' },
      ],
    },
    {
      label: t('filter.section.metalColor'),
      param: 'metalColor',
      options: [
        { value: 'yellow', label: t('filter.metalColor.yellow') },
        { value: 'rose', label: t('filter.metalColor.rose') },
        { value: 'white', label: t('filter.metalColor.white') },
      ],
    },
  ];
}

function readActiveFilters(
  searchParams: URLSearchParams,
): Partial<Record<FilterKey, string>> {
  return FILTER_KEYS.reduce(
    (acc, key) => {
      const v = searchParams.get(key);
      if (v) acc[key] = v;
      return acc;
    },
    {} as Partial<Record<FilterKey, string>>,
  );
}

function splitValues(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

interface FilterSectionsProps {
  activeFilters: Partial<Record<FilterKey, string>>;
  onOptionClick: (param: FilterKey, value: string) => void;
  onClearAll: () => void;
  sections: OptionGroup<string>[];
  clearAllLabel: string;
}

function FilterSections({
  activeFilters,
  onOptionClick,
  onClearAll,
  sections,
  clearAllLabel,
}: FilterSectionsProps) {
  return (
    <div>
      {sections.map((section) => (
        <div
          key={section.param}
          className="border-b border-[#E5DDD0] px-5 py-4"
        >
          <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[#60736A] sm:text-[11px]">
            {section.label}
          </p>
          <ul className="flex flex-col">
            {section.options.map((opt) => {
              const activeValues = splitValues(activeFilters[section.param]);
              const active = activeValues.includes(opt.value);
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => onOptionClick(section.param, opt.value)}
                    aria-pressed={active}
                    className={`flex w-full items-center justify-between gap-3 py-1.5 text-left text-[12px] font-medium transition-colors sm:text-[13px] ${
                      active
                        ? 'text-[#144B3C]'
                        : 'text-[#1A2621] hover:text-[#144B3C]'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    <span
                      className={`flex size-5 shrink-0 items-center justify-center border transition-colors ${
                        active
                          ? 'border-[#144B3C] bg-[#144B3C] text-white'
                          : 'border-[#D6DAD6] bg-white text-transparent'
                      }`}
                    >
                      {CHECK_ICON}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="px-5 py-4">
        <button
          type="button"
          onClick={onClearAll}
          className="text-[10px] uppercase tracking-[0.2em] text-[#144B3C] underline-offset-4 transition-colors hover:text-[#0E372B] hover:underline sm:text-[11px]"
        >
          {clearAllLabel}
        </button>
      </div>
    </div>
  );
}

export const FilterTrigger: React.FC = () => {
  const isOpen = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const filterCount = FILTER_KEYS.reduce(
    (acc, key) => acc + (searchParams.get(key) ? 1 : 0),
    0,
  );
  const isHighlighted = isOpen || filterCount > 0;

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        aria-label={t('shop.filter')}
        aria-expanded={isOpen}
        onClick={openDrawer}
        className={`flex shrink-0 items-center justify-center text-[#1A3A2A] outline-none transition-colors cursor-pointer min-h-[40px] min-w-[40px] sm:min-h-[48px] sm:min-w-[48px] h-10 w-10 sm:h-12 sm:w-12 ${
          isHighlighted ? 'text-[#C89F53]' : 'hover:text-[#C89F53]'
        }`}
      >
        {FILTER_ICON}
      </button>
    </div>
  );
};

export const FilterDrawer: React.FC = () => {
  const isOpen = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const sections = useMemo(() => buildSections(t), [t]);
  const activeFilters = readActiveFilters(searchParams);

  const updateParam = (param: FilterKey, value: string | null) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (value === null || value === '') sp.delete(param);
    else sp.set(param, value);
    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleOptionClick = (param: FilterKey, value: string) => {
    const current = splitValues(activeFilters[param]);
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateParam(param, next.length ? next.join(',') : null);
  };

  const clearAll = () => {
    const sp = new URLSearchParams(searchParams.toString());
    sections.forEach((s) => sp.delete(s.param));
    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Reset on unmount so navigation back to /shop starts closed
  useEffect(() => {
    return () => closeDrawer();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-[60] ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={closeDrawer}
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      <div
        className={`absolute top-0 start-0 flex h-full w-[min(85vw,360px)] flex-col bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out lg:w-[min(90vw,400px)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'
        }`}
        role="dialog"
        aria-label={t('shop.filter')}
        aria-modal="true"
      >
        {/* Header — flex layout so the close button gets a reliable tap target */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#E5DDD0] px-2 py-3 sm:px-3 sm:py-4">
          <div className="w-10 shrink-0 sm:w-12" />
          <h2 className="flex-1 text-center font-display text-base text-[#1A2621] sm:text-lg">
            {t('filter.title')}
          </h2>
          <button
            type="button"
            aria-label={t('aria.closeFilter')}
            onClick={closeDrawer}
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#1A2621] transition-colors hover:bg-[#F2F6F4] hover:text-[#144B3C] active:bg-[#E5F0EB] sm:size-12"
          >
            {CLOSE_ICON}
          </button>
        </div>

        <div className="snap-scroll flex-1 overflow-y-auto">
          <FilterSections
            activeFilters={activeFilters}
            onOptionClick={handleOptionClick}
            onClearAll={clearAll}
            sections={sections}
            clearAllLabel={t('filter.clearAll')}
          />
        </div>

        {/* Footer — explicit Done button gives users a second, obvious way to close */}
        <div className="shrink-0 border-t border-[#E5DDD0] p-3 sm:p-4">
          <button
            type="button"
            onClick={closeDrawer}
            className="w-full cursor-pointer bg-[#144B3C] py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#0E372B] active:bg-[#0E372B] sm:py-3.5 sm:text-[12px]"
          >
            {t('filter.done')}
          </button>
        </div>
      </div>
    </div>
  );
};
