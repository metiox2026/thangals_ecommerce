'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const SearchBar: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="border-b border-[#003024] bg-[#004237] lg:hidden">
      <div className="mx-auto flex max-w-[1400px] items-center px-3 py-2">
        <label className="flex w-full items-center gap-2 border border-[#2D5A3D] bg-[#144B3C] px-4 py-2 text-white transition-colors focus-within:border-[#C89F53]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4 shrink-0 text-white"
          >
            <path d="m21 21-4.34-4.34"></path>
            <circle cx="11" cy="11" r="8"></circle>
          </svg>
          <input
            type="search"
            placeholder={t('search.placeholder')}
            className="w-full min-w-0 bg-transparent text-[12px] tracking-[0.14em] text-white uppercase placeholder:text-[#B8C7BE] placeholder:normal-case placeholder:tracking-normal focus:outline-none"
            suppressHydrationWarning
          />
        </label>
      </div>
    </div>
  );
};