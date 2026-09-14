'use client';

import React, { useState } from 'react';
import { SizeGuideModal } from '@/components/SizeGuideModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { localizeDigits } from '@/lib/format';

interface SizeSelectorProps {
  sizes: string[];
  value: string | null;
  onChange: (size: string) => void;
  variant?: 'grid' | 'compact';
  note?: string;
  category?: 'rings' | 'necklaces' | 'bracelets' | 'bangles';
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  value,
  onChange,
  variant = 'grid',
  note,
  category,
}) => {
  const { t, lang } = useLanguage();
  const [guideOpen, setGuideOpen] = useState(false);

  if (sizes.length === 0) return null;

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        {sizes.map((s) => {
          const selected = s === value;
          return (
            <button
              key={localizeDigits(s, lang)}
              type="button"
              onClick={() => onChange(s)}
              aria-pressed={selected}
              className={`min-w-9 cursor-pointer rounded-sm border px-2.5 py-1.5 text-[11px] tracking-[0.04em] transition-colors ${
                selected
                  ? 'border-[#1A3A2A] bg-[#1A3A2A] text-white'
                  : 'border-[#E5DDD0] bg-white text-[#1A2621] hover:border-[#1A3A2A]'
              }`}
            >
              {localizeDigits(s, lang)}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#60736A]">
          {t('size.selectSize')}
        </p>
        {category && (
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="cursor-pointer text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-800 underline underline-offset-4 transition-colors hover:text-emerald-700"
          >
            {t('size.sizeGuide')}
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => {
          const selected = s === value;
          return (
            <button
              key={localizeDigits(s, lang)}
              type="button"
              onClick={() => onChange(s)}
              aria-pressed={selected}
              className={`min-w-12 cursor-pointer rounded-sm border px-3 py-2.5 text-xs font-medium transition-colors ${
                selected
                  ? 'border-[#1A3A2A] bg-[#1A3A2A] text-white'
                  : 'border-[#E5DDD0] bg-white text-[#1A2621] hover:border-[#1A3A2A]'
              }`}
            >
              {localizeDigits(s, lang)}
            </button>
          );
        })}
      </div>
      {category && (
        <SizeGuideModal
          open={guideOpen}
          onClose={() => setGuideOpen(false)}
          category={category}
          note={note}
        />
      )}
    </div>
  );
};
