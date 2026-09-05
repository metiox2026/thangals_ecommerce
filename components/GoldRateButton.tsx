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
        transition: `width 280ms ${EASE} ${open ? '0ms' : '180ms'}, border-radius 280ms ${EASE} ${
          open ? '0ms' : '180ms'
        }, box-shadow 280ms ${EASE}`,
        boxShadow: open ? 'none' : '-2px 2px 6px rgba(0, 0, 0, 0.2)',
      }}
      className={`fixed top-1/2 right-0 z-40 -translate-y-1/2 bg-[#144B3C] text-white ${
        open
          ? 'w-80 rounded-l-md'
          : 'w-[24px] h-[90px] rounded-tl-[12px] rounded-bl-[12px]'
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
      {/* Closed state: vertical tab. Visible only after the panel has fully collapsed. */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open today's gold rate"
        style={{
          transition: `opacity 200ms ease ${open ? '0ms' : '280ms'}`,
        }}
        className={`absolute inset-0 flex items-center justify-center ${
          open ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <span
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            color: '#ffffff',
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: '8px',
            fontWeight: 600,
            letterSpacing: '2px',
            whiteSpace: 'nowrap',
          }}
        >
          Gold Rate
        </span>
      </button>

      {/* Open state: rate board. Fades out first on close, then width shrinks. */}
      <div
        style={{
          transition: `opacity 200ms ease ${open ? '120ms' : '0ms'}`,
        }}
        className={`flex h-full flex-col bg-[#144B3C] p-5 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-white/70">
              Today&apos;s Rate
            </p>
            <p className="mt-1 font-display text-xl">
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
              xmlns="http://www.w3://www.w3.org/2000/svg"
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