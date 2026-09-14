'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const RING_CHART: { us: string; uk: string; eu: string; diameterMm: string; circumferenceMm: string }[] = [
  { us: '5', uk: 'J½', eu: '49', diameterMm: '15.7', circumferenceMm: '49.3' },
  { us: '6', uk: 'L½', eu: '52', diameterMm: '16.5', circumferenceMm: '51.8' },
  { us: '7', uk: 'N½', eu: '54', diameterMm: '17.3', circumferenceMm: '54.4' },
  { us: '8', uk: 'P½', eu: '57', diameterMm: '18.1', circumferenceMm: '57.0' },
  { us: '9', uk: 'R½', eu: '59', diameterMm: '19.0', circumferenceMm: '59.5' },
  { us: '10', uk: 'T½', eu: '62', diameterMm: '19.8', circumferenceMm: '62.3' },
  { us: '11', uk: 'V½', eu: '64', diameterMm: '20.6', circumferenceMm: '64.8' },
];

const NECKLACE_CHART: { length: string; position: string }[] = [
  { length: '40 cm', position: 'Choker — sits high on the neck' },
  { length: '42 cm', position: 'Collar — rests on the collarbone' },
  { length: '45 cm', position: 'Princess — sits just below the collarbone' },
  { length: '50 cm', position: 'Matinee — falls to the centre of the bust' },
];

const BRACELET_CHART: { length: string; wristSize: string }[] = [
  { length: '15 cm', wristSize: 'Up to 14 cm (XS)' },
  { length: '16 cm', wristSize: '14–15 cm (S)' },
  { length: '17 cm', wristSize: '15–16 cm (M)' },
  { length: '18 cm', wristSize: '16–17 cm (L)' },
  { length: '19 cm', wristSize: '17–18 cm (XL)' },
];

const BANGLE_CHART: { diameter: string; wristSize: string }[] = [
  { diameter: '2.2 in (56 mm)', wristSize: '5.5–5.9 in (XS)' },
  { diameter: '2.4 in (61 mm)', wristSize: '5.9–6.3 in (S · most common)' },
  { diameter: '2.6 in (66 mm)', wristSize: '6.3–6.7 in (M)' },
  { diameter: '2.8 in (71 mm)', wristSize: '6.7–7.1 in (L)' },
];

const CATEGORY_TIPS: Record<string, string> = {
  rings:
    'Measure an existing ring’s inner diameter in millimetres and match it to the closest US size, or wrap a strip of paper around your finger, mark where it overlaps, and measure the length in millimetres — that’s your circumference.',
  necklaces:
    'Use a soft measuring tape around the neck, or drape a string along a necklace you already own at the length you like and measure the string.',
  bracelets:
    'Wrap a soft measuring tape snugly around your wrist just below the wrist bone — note the measurement in centimetres and add 1.5–2 cm for a comfortable fit.',
  bangles:
    'Measure the widest part of your hand (knuckles) when closed, and the inside diameter of a bangle that fits well. Bangles should slide on with slight resistance.',
};

const CATEGORY_LABEL: Record<string, string> = {
  rings: 'Ring Size Guide',
  necklaces: 'Necklace Length Guide',
  bracelets: 'Bracelet Size Guide',
  bangles: 'Bangle Size Guide',
};

interface SizeGuideModalProps {
  open: boolean;
  onClose: () => void;
  category: 'rings' | 'necklaces' | 'bracelets' | 'bangles';
  note?: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  open,
  onClose,
  category,
  note,
}) => {
  const { t } = useLanguage();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.dataset.modalOpen = 'true';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      delete document.body.dataset.modalOpen;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[500] flex items-stretch justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={CATEGORY_LABEL[category] ?? 'Size guide'}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 flex w-full flex-col bg-[#FAF8F5] shadow-2xl sm:max-h-[90vh] sm:max-w-2xl sm:rounded-sm sm:overflow-hidden">
        <div className="flex shrink-0 items-center justify-between border-b border-[#E5DDD0] bg-white px-4 py-3 sm:px-6 sm:py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#C89F53]">
              Thangals
            </p>
            <h2 className="font-jost text-base font-semibold text-[#1A2621] sm:text-lg">
              {CATEGORY_LABEL[category] ?? 'Size guide'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('aria.closeSizeGuide')}
            className="flex size-8 items-center justify-center rounded-full text-[#60736A] transition-colors hover:bg-[#F2F6F4] hover:text-[#1A2621]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 px-4 py-3 sm:overflow-y-auto sm:px-6 sm:py-6">
          {note && (
            <p className="mb-3 rounded-sm border border-[#E5DDD0] bg-[#F2F6F4] px-3 py-2 text-[10px] leading-relaxed text-[#444] sm:mb-5 sm:py-2.5 sm:text-[11px]">
              {note}
            </p>
          )}

          {category === 'rings' && (
            <table className="w-full table-fixed border-collapse text-[11px] sm:table-auto sm:text-xs">
              <colgroup>
                <col className="w-[12%] sm:w-auto" />
                <col className="w-[16%] sm:w-auto" />
                <col className="w-[16%] sm:w-auto" />
                <col className="w-[28%] sm:w-auto" />
                <col className="w-[28%] sm:w-auto" />
              </colgroup>
              <thead>
                <tr className="border-b border-[#E5DDD0] text-[9px] uppercase tracking-[0.12em] text-[#60736A] sm:text-[10px] sm:tracking-[0.16em]">
                  <th className="py-1.5 pr-1 text-left font-medium sm:py-2 sm:pr-4">US</th>
                  <th className="py-1.5 pr-1 text-left font-medium sm:py-2 sm:pr-4">UK</th>
                  <th className="py-1.5 pr-1 text-left font-medium sm:py-2 sm:pr-4">EU</th>
                  <th className="py-1.5 pr-1 text-right font-medium sm:py-2 sm:pr-4">Dia. (mm)</th>
                  <th className="py-1.5 pl-1 text-right font-medium sm:py-2 sm:pl-4">Circ. (mm)</th>
                </tr>
              </thead>
              <tbody>
                {RING_CHART.map((row) => (
                  <tr key={row.us} className="border-b border-[#EAEAEA] text-[#1A2621]">
                    <td className="py-2 pr-1 font-medium sm:py-2.5 sm:pr-4">{row.us}</td>
                    <td className="py-2 pr-1 sm:py-2.5 sm:pr-4">{row.uk}</td>
                    <td className="py-2 pr-1 sm:py-2.5 sm:pr-4">{row.eu}</td>
                    <td className="py-2 pr-1 text-right tabular-nums lining-nums sm:py-2.5 sm:pr-4">{row.diameterMm}</td>
                    <td className="py-2 pl-1 text-right tabular-nums lining-nums sm:py-2.5 sm:pl-4">{row.circumferenceMm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {category === 'necklaces' && (
            <ul className="divide-y divide-[#E5DDD0]">
              {NECKLACE_CHART.map((row) => (
                <li key={row.length} className="flex items-baseline justify-between gap-3 py-2.5 text-[11px] sm:gap-4 sm:py-3 sm:text-xs">
                  <span className="font-medium tabular-nums lining-nums text-[#1A2621]">{row.length}</span>
                  <span className="text-right text-[#60736A]">{row.position}</span>
                </li>
              ))}
            </ul>
          )}

          {(category === 'bracelets' || category === 'bangles') && (() => {
            const rows: { size: string; wristSize: string }[] =
              category === 'bracelets'
                ? BRACELET_CHART.map((r) => ({ size: r.length, wristSize: r.wristSize }))
                : BANGLE_CHART.map((r) => ({ size: r.diameter, wristSize: r.wristSize }));
            return (
              <table className="w-full table-fixed border-collapse text-[11px] sm:table-auto sm:text-xs">
                <colgroup>
                  <col className="w-[36%] sm:w-auto" />
                  <col className="w-[64%] sm:w-auto" />
                </colgroup>
                <thead>
                  <tr className="border-b border-[#E5DDD0] text-[9px] uppercase tracking-[0.12em] text-[#60736A] sm:text-[10px] sm:tracking-[0.16em]">
                    <th className="py-1.5 pr-2 text-left font-medium sm:py-2 sm:pr-4">
                      {category === 'bracelets' ? 'Length' : 'Inner dia.'}
                    </th>
                    <th className="py-1.5 pl-2 text-left font-medium sm:py-2 sm:pl-4">Fits wrist</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.size} className="border-b border-[#EAEAEA] text-[#1A2621]">
                      <td className="py-2 pr-2 font-medium tabular-nums lining-nums sm:py-2.5 sm:pr-4">
                        {row.size}
                      </td>
                      <td className="py-2 pl-2 text-[#60736A] sm:py-2.5 sm:pl-4">{row.wristSize}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          })()}

          <div className="mt-4 border-t border-[#E5DDD0] pt-3 sm:mt-6 sm:pt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1A3A2A]">
              How to measure
            </p>
            <p className="mt-1.5 text-[11px] leading-snug text-[#444] sm:mt-2 sm:text-[12px] sm:leading-relaxed">
              {CATEGORY_TIPS[category]}
            </p>
            <p className="mt-2 text-[10px] text-[#777] sm:mt-3 sm:text-[11px]">
              Not sure? Visit any of our boutiques for a complimentary sizing —
              <Link href="/stores" className="ml-1 underline-offset-4 hover:underline text-[#144B3C]">
                find a store
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
