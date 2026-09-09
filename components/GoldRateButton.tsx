'use client';

import React, { useEffect, useState } from 'react';

const RATES = [
  { karat: '24K', label: 'Pure Gold', aed: 397 },
  { karat: '22K', label: '916 Jewellery', aed: 365 },
  { karat: '21K', label: '875 Jewellery', aed: 348 },
  { karat: '18K', label: '750 Jewellery', aed: 298 },
];

const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
const BRAND = '#144B3C';
const NOTCH = 12;
const PANEL_MS = 320;
const FADE_MS = 200;

export const GoldRateButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open]);

  return (
    <div
      style={{
        transition: `width ${PANEL_MS}ms ${EASE}, height ${PANEL_MS}ms ${EASE}, border-radius ${PANEL_MS}ms ${EASE}, box-shadow ${PANEL_MS}ms ${EASE}`,
        boxShadow: open ? '0 0 0 0 rgba(0, 0, 0, 0)' : '-1px 1px 3px rgba(0, 0, 0, 0.12)',
      }}
      className={`fixed bottom-24 right-0 top-auto z-40 bg-[#144B3C] text-white max-w-[320px] md:top-1/2 md:bottom-auto md:-translate-y-[calc(50%-43px)] ${
        open
          ? 'w-[calc(100vw-32px)] h-[420px] rounded-l-md'
          : 'w-[28px] h-[96px] rounded-tl-[12px] rounded-bl-[12px]'
      }`}
    >
      {!open && (
        <>
          {/* Top concave notch — radial-gradient curve biting into the top-right corner */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-0"
            style={{
              top: `-${NOTCH - 1}px`,
              width: NOTCH,
              height: NOTCH,
              background: `radial-gradient(circle at top left, transparent ${NOTCH}px, ${BRAND} ${NOTCH + 1}px)`,
            }}
          />
          {/* Bottom concave notch — mirrored curve on the lower side */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-0"
            style={{
              bottom: `-${NOTCH - 1}px`,
              width: NOTCH,
              height: NOTCH,
              background: `radial-gradient(circle at bottom left, transparent ${NOTCH}px, ${BRAND} ${NOTCH + 1}px)`,
            }}
          />
        </>
      )}
      {/* Closed state: vertical tab. Fades in after the panel has finished shrinking. */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open today's gold rate"
        style={{
          transition: `opacity ${FADE_MS}ms ease ${open ? '0ms' : `${PANEL_MS}ms`}`,
        }}
        className={`absolute inset-0 flex items-center justify-center cursor-pointer ${
          open ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <span
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            color: '#ffffff',
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '2px',
            whiteSpace: 'nowrap',
          }}
        >
          Gold Rate
        </span>
      </button>

      {/* Open state: rate board. Fades in after the panel has finished expanding.
          Always absolute inset-0 so it shrinks with the parent instead of snapping. */}
      <div
        style={{
          transition: `opacity ${FADE_MS}ms ease ${open ? `${PANEL_MS}ms` : '0ms'}`,
        }}
        className={`absolute inset-0 flex flex-col bg-[#144B3C] p-5 ${
          open ? 'opacity-100' : 'pointer-events-none overflow-hidden opacity-0'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-white/70">
              Today&apos;s Rate
            </p>
            <p className="mt-1 font-sans text-lg font-medium tracking-[0.04em]">
              Gold Rates in Dubai
            </p>
            <div className="mt-2 h-px w-10 bg-[#C89F53]"></div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close gold rate panel"
            className="text-white/70 transition-colors hover:text-white"
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
              className="size-4"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>

        <p className="mt-3 text-[10px] tracking-[0.12em] uppercase text-white/60">
          Indicative · per gram · 03 Sep 2026
        </p>

        <div className="mt-4 space-y-2.5">
          {RATES.map((rate) => (
            <div
              key={rate.karat}
              className="flex items-baseline justify-between border-b border-white/15 pb-2"
            >
              <div>
                <p className="text-base text-white">{rate.karat}</p>
                <p className="text-[10px] tracking-[0.14em] uppercase text-white/60">
                  {rate.label}
                </p>
              </div>
              <p className="text-sm text-white">AED {rate.aed}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[10px] tracking-[0.12em] uppercase text-white/60">
          Subject to weight, wastage &amp; hallmarking at the boutique.
        </p>
      </div>
    </div>
  );
};
