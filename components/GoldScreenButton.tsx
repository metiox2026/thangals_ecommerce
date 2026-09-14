'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const GOLD_GRADIENT = 'linear-gradient(180deg, #F2DEB0 0%, #E5C88C 25%, #C89F53 60%, #A8843D 100%)';

export const GoldScreenButton: React.FC = () => {
  const { lang, t } = useLanguage();
  const isAr = lang === 'AR';
  return (
    <a
      href="https://metiox.com"
      aria-label={t('aria.openScheme')}
      style={{
        background: GOLD_GRADIENT,
        boxShadow: isAr ? '1px 1px 3px rgba(0, 0, 0, 0.12)' : '-1px 1px 3px rgba(0, 0, 0, 0.12)',
      }}
      className={`fixed top-auto z-40 text-[#1A2621] max-w-[320px] w-[28px] h-[96px] flex items-center justify-center cursor-pointer md:bottom-auto md:top-1/2 md:-translate-y-[calc(50%+43px)] ${
        isAr
          ? 'left-0 rounded-tr-[12px] bottom-[182px]'
          : 'right-0 rounded-tl-[12px] bottom-[182px]'
      }`}
    >
      <span
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          color: '#1A2621',
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '2px',
          whiteSpace: 'nowrap',
        }}
      >
        {t('scheme.tab')}
      </span>
    </a>
  );
};