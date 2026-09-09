'use client';

import React from 'react';

const GOLD_GRADIENT = 'linear-gradient(180deg, #F2DEB0 0%, #E5C88C 25%, #C89F53 60%, #A8843D 100%)';

export const GoldScreenButton: React.FC = () => {
  return (
    <a
      href="https://metiox.com"
      aria-label="Open gold scheme"
      style={{
        background: GOLD_GRADIENT,
        boxShadow: '-1px 1px 3px rgba(0, 0, 0, 0.12)',
      }}
      className="fixed right-0 top-auto z-40 text-[#1A2621] max-w-[320px] w-[28px] h-[96px] rounded-tl-[12px] bottom-[182px] flex items-center justify-center cursor-pointer md:bottom-auto md:top-1/2 md:-translate-y-[calc(50%+43px)]"
    >
      <span
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          color: '#1A2621',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '2px',
          whiteSpace: 'nowrap',
        }}
      >
        Scheme
      </span>
    </a>
  );
};