'use client';

import React, { useState } from 'react';

interface DisclosureProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const Disclosure: React.FC<DisclosureProps> = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#E5DDD0] py-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-4 text-left"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#1A2621]">
          {title}
        </span>
        <span
          className={`flex size-6 items-center justify-center text-[#1A2621] transition-transform duration-300 ${
            open ? 'rotate-45' : 'rotate-0'
          }`}
          aria-hidden="true"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="text-sm leading-relaxed text-[#444]">{children}</div>
        </div>
      </div>
    </div>
  );
};
