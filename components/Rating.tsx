'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDecimal, formatNumber, NumberText } from '@/lib/format';

interface RatingProps {
  value: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showValue?: boolean;
  showReviewCount?: boolean;
  reviewCount?: number;
  className?: string;
}

const SIZE_MAP = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 18,
};

const Star: React.FC<{ fill: number; size: number }> = ({ fill, size }) => {
  const pct = Math.max(0, Math.min(100, fill * 100));
  return (
    <span
      className="relative inline-block shrink-0"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute inset-0 text-[#E5DDD0]"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      <span
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ width: `${pct}%` }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="#E8CB85"
          stroke="#E8CB85"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </span>
    </span>
  );
};

export const Rating: React.FC<RatingProps> = ({
  value,
  size = 'sm',
  showValue = false,
  showReviewCount = true,
  reviewCount,
  className = '',
}) => {
  const { t, lang } = useLanguage();
  const px = SIZE_MAP[size];
  const textClass =
    size === 'xs'
      ? 'text-[10px]'
      : size === 'sm'
        ? 'text-[11px]'
        : size === 'md'
          ? 'text-xs'
          : 'text-sm';

  const stars: React.ReactNode[] = [];
  for (let i = 1; i <= 5; i++) {
    const remaining = Math.max(0, value - (i - 1));
    stars.push(<Star key={i} fill={Math.min(1, remaining)} size={px} />);
  }

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-0.5" role="img" aria-label={t('aria.rating', { value })}>
        {stars}
      </div>
      {showValue && (
        <span className={`${textClass} text-[#60736A]`}>
          <span className="font-medium text-[#1A2621]"><NumberText value={value} lang={lang} fractionDigits={1} /></span>
          {showReviewCount && reviewCount !== undefined && <span className="mx-1">·</span>}
          {showReviewCount && reviewCount !== undefined && (
            <span>
              <NumberText value={reviewCount} lang={lang} /> {reviewCount === 1 ? t('rating.review') : t('rating.reviews')}
            </span>
          )}
        </span>
      )}
    </div>
  );
};
