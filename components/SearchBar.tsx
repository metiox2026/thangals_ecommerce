'use client';

import React from 'react';

export const SearchBar: React.FC = () => {
  return (
    <div className="border-b border-[#E2E7E4] bg-white lg:hidden">
      <div className="mx-auto flex max-w-[1400px] items-center px-3 py-2">
        <label className="flex w-full items-center gap-2 border border-[#EAEAEA] bg-[#FAF8F4] px-4 py-2 text-[#1A2621] transition-colors focus-within:border-[#144B3C] focus-within:bg-white">
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
            className="size-4 shrink-0 text-[#60736A]"
          >
            <path d="m21 21-4.34-4.34"></path>
            <circle cx="11" cy="11" r="8"></circle>
          </svg>
          <input
            type="search"
            placeholder="Search jewellery, collections, gifts…"
            className="w-full min-w-0 bg-transparent text-[12px] tracking-[0.14em] text-[#1A2621] uppercase placeholder:text-[#60736A] placeholder:normal-case placeholder:tracking-normal focus:outline-none"
            suppressHydrationWarning
          />
        </label>
      </div>
    </div>
  );
};