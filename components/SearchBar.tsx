'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTypewriterPlaceholder } from '@/lib/hooks/useTypewriterPlaceholder';

export const SearchBar: React.FC = () => {
  const router = useRouter();
  const { lang: language, t } = useLanguage();
  const [query, setQuery] = useState('');

  const typewriterPlaceholder = useTypewriterPlaceholder({
    words:
      language === 'AR'
        ? ['مجوهرات', 'مجموعات', 'هدايا', 'خواتم', 'قلادات']
        : ['jewellery', 'collections', 'gifts', 'rings', 'necklaces'],
    prefix: language === 'AR' ? 'ابحث عن ' : 'Search ',
  });

  return (
    <div className="border-b border-[#003024] bg-[#004237] lg:hidden">
      <div className="mx-auto flex max-w-[1400px] items-center px-3 py-2">
        <form
          className="flex h-9 w-full items-center gap-2 border border-[#2D5A3D] bg-[#144B3C] px-4 font-jost text-white text-start"
          onSubmit={(e) => {
            e.preventDefault();
            const q = query.trim();
            if (!q) return;
            router.push(`/search?q=${encodeURIComponent(q)}`);
          }}
          suppressHydrationWarning
        >
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={typewriterPlaceholder}
            className="w-full min-w-0 bg-transparent font-jost text-[16px] leading-[1] tracking-[0.14em] text-white placeholder:text-[12px] placeholder:tracking-normal focus:outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
            suppressHydrationWarning
          />
        </form>
      </div>
    </div>
  );
};