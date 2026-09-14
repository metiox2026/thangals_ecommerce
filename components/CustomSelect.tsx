'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface CustomSelectProps<T extends string> {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  icon: React.ReactNode;
  align?: 'left' | 'right';
  active?: boolean;
  className?: string;
  variant?: 'default' | 'light';
  size?: 'md' | 'sm';
  direction?: 'down' | 'up';
}

export function CustomSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  icon,
  align = 'right',
  active = false,
  className = '',
  variant = 'default',
  size = 'md',
  direction = 'down',
}: CustomSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const current = options.find((o) => o.value === value) ?? options[0];
  const isHighlighted = active || open;
  const isLight = variant === 'light';
  const buttonSize =
    size === 'sm'
      ? 'h-8 w-8 min-h-0 min-w-0'
      : 'min-h-[40px] min-w-[40px] sm:min-h-[48px] sm:min-w-[48px] h-10 w-10 sm:h-12 sm:w-12';
  const buttonColor = isLight
    ? isHighlighted
      ? 'text-[#C89F53]'
      : 'text-white hover:text-[#C89F53]'
    : isHighlighted
      ? 'text-[#C89F53]'
      : 'text-[#1A3A2A] hover:text-[#C89F53]';

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onScroll = () => setOpen(false);
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    window.addEventListener('pagescroll', onScroll as EventListener);
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('pagescroll', onScroll as EventListener);
      document.removeEventListener('scroll', onScroll, { capture: true } as AddEventListenerOptions);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative inline-flex items-center justify-center ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex shrink-0 items-center justify-center outline-none transition-colors cursor-pointer ${buttonSize} ${buttonColor}`}
      >
        {icon}
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className={`absolute z-30 min-w-[200px] animate-fade-down overflow-hidden border border-[#E5DDD0] bg-white shadow-[0_18px_40px_-20px_rgba(20,75,60,0.45)] ${
            direction === 'up'
              ? 'bottom-full mb-2 animate-fade-up'
              : 'top-full mt-2'
          } ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={opt.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                    buttonRef.current?.focus();
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
                    isSelected
                      ? 'bg-[#1A3A2A] text-white'
                      : 'text-[#1A2621] hover:bg-[#F2F6F4] hover:text-[#144B3C]'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <svg
                      className="size-3.5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m5 12 5 5 9-11" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
