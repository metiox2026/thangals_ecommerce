import React from 'react';
import type { Language } from '@/contexts/LanguageContext';

const LOCALE = (lang: Language) => (lang === 'AR' ? 'ar-AE-u-nu-arab' : 'en-US');

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'] as const;

/**
 * Format a number for the active language.
 * - AR: uses ar-AE with arabic number system → Eastern Arabic numerals (٠١٢٣٤٥٦٧٨٩)
 * - EN: uses en-US locale → Latin numerals with comma thousand separator
 *
 * Use anywhere a number is rendered as a plain string (template literals,
 * Leaflet popup HTML, attributes). For JSX text, prefer <NumberText /> so
 * Arabic digits render in their proper right-to-left visual order.
 */
export function formatNumber(value: number, lang: Language): string {
  return value.toLocaleString(LOCALE(lang));
}

/**
 * Format a decimal with the active language's numerals.
 * Used for star ratings like "4.9" / "٤٫٩".
 */
export function formatDecimal(
  value: number,
  lang: Language,
  fractionDigits = 1,
): string {
  return value.toLocaleString(LOCALE(lang), {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

/**
 * Convert every Latin digit in an already-formatted string to Arabic-Indic
 * digits (or vice versa). Used for things the locale formatter cannot reach:
 * size dimensions stored as plain strings (e.g. "16.3 g · Ø 15.7 mm") and
 * phone numbers, where the value is not a JS Number.
 */
export function localizeDigits(str: string, lang: Language): string {
  if (lang !== 'AR') return str;
  return str.replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
}

interface NumberTextProps {
  value: number;
  lang: Language;
  fractionDigits?: number;
  className?: string;
}

/**
 * JSX wrapper that renders a formatted number with the correct bidi direction.
 * For Arabic, wraps the digits in <bdo dir="rtl"> so AN-class digits display
 * in their traditional right-to-left visual order — the same way Arabic
 * letters flow — even if the surrounding context tries to render them LTR.
 */
export const NumberText: React.FC<NumberTextProps> = ({
  value,
  lang,
  fractionDigits,
  className,
}) => {
  const formatted =
    fractionDigits !== undefined
      ? formatDecimal(value, lang, fractionDigits)
      : formatNumber(value, lang);

  if (lang === 'AR') {
    return (
      <bdo dir="rtl" className={className}>
        {formatted}
      </bdo>
    );
  }
  return <span className={className}>{formatted}</span>;
};