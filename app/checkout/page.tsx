'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useBag } from '@/context/BagContext';
import { api, Product, getPriceForSize } from '@/lib/api';
import { SizeSelector } from '@/components/SizeSelector';

function formatSku(id: string): string {
  const cleaned = id.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  const padded = (cleaned + '00000000').slice(0, 8);
  return `TA${padded}SKU`;
}

function AedPrice({ value }: { value: number }) {
  return (
    <span className="inline-flex items-baseline gap-0.5 tabular-nums lining-nums">
      <img
        src="/aed-symbol.svg"
        alt=""
        aria-hidden
        className="inline-block h-[0.85em] w-auto"
      />
      {value.toLocaleString()}
    </span>
  );
}

const EMIRATES = [
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Ajman',
  'Umm Al Quwain',
  'Ras Al Khaimah',
  'Fujairah',
];

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60736A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

type FieldProps = {
  label: string;
  required?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

function Field({ label, required, fullWidth, icon, className = '', ...inputProps }: FieldProps) {
  return (
    <div className={fullWidth ? 'sm:col-span-2' : ''}>
      <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.16em] text-[#60736A]">
        {label}
        {required && <span className="ml-0.5 text-[#C89F53]">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#9CA39F]">
            {icon}
          </span>
        )}
        <input
          {...inputProps}
          className={`w-full border border-[#E5DDD0] bg-white px-3 py-2.5 text-sm text-[#1A2621] placeholder:text-[#9CA39F] outline-none transition-colors focus:border-[#144B3C] focus:ring-1 focus:ring-[#144B3C]/20 ${
            icon ? 'pl-9' : ''
          } ${className}`}
        />
      </div>
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  required?: boolean;
  fullWidth?: boolean;
  options: readonly string[];
} & React.SelectHTMLAttributes<HTMLSelectElement>;

function SelectField({ label, required, fullWidth, options, className = '', ...selectProps }: SelectFieldProps) {
  return (
    <div className={fullWidth ? 'sm:col-span-2' : ''}>
      <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.16em] text-[#60736A]">
        {label}
        {required && <span className="ml-0.5 text-[#C89F53]">*</span>}
      </label>
      <select
        {...selectProps}
        className={`w-full appearance-none border border-[#E5DDD0] bg-white px-3 py-2.5 text-sm text-[#1A2621] outline-none transition-colors focus:border-[#144B3C] focus:ring-1 focus:ring-[#144B3C]/20 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%2360736A%22><path d=%22M5.5 7.5l4.5 4.5 4.5-4.5z%22/></svg>')] bg-[length:14px_14px] bg-[right_0.9rem_center] bg-no-repeat pr-9 ${className}`}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function StepHeader({
  n,
  title,
  subtitle,
  open,
  onToggle,
  completed,
}: {
  n: number;
  title: string;
  subtitle?: string;
  open: boolean;
  onToggle: () => void;
  completed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="flex w-full items-center justify-between bg-[#F2F6F4] px-4 py-3.5 text-left transition-colors hover:bg-[#E5F0EB] sm:px-5 sm:py-4"
    >
      <div className="flex items-center gap-3">
        {completed ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
            <CheckIcon size={15} />
          </span>
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A3A2A] text-xs font-semibold text-white">
            {n}
          </span>
        )}
        <div>
          <h2 className="font-jost text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1A2621] sm:text-xs">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-[11px] font-normal normal-case tracking-normal text-[#60736A]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <span className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}>
        <ChevronDownIcon />
      </span>
    </button>
  );
}

function CheckoutStepper({ active }: { active: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: 'Order' },
    { n: 2, label: 'Delivery' },
    { n: 3, label: 'Payment' },
  ] as const;

  return (
    <div className="mx-auto flex max-w-md items-center justify-center gap-3 sm:gap-4">
      {steps.map((s, i) => {
        const isActive = s.n === active;
        const isPast = s.n < active;
        return (
          <React.Fragment key={s.n}>
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold transition-colors ${
                  isPast
                    ? 'bg-emerald-600 text-white'
                    : isActive
                    ? 'bg-[#1A3A2A] text-white'
                    : 'border border-[#E5DDD0] bg-white text-[#9CA39F]'
                }`}
              >
                {isPast ? <CheckIcon size={12} /> : s.n}
              </span>
              <span className={`text-[9px] uppercase tracking-[0.18em] ${isActive ? 'text-[#1A3A2A]' : isPast ? 'text-emerald-700' : 'text-[#9CA39F]'}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-px w-8 sm:w-12 ${isPast ? 'bg-emerald-600' : 'bg-[#E5DDD0]'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function PaymentOption({
  value,
  label,
  sublabel,
  selected,
  onSelect,
  logo,
}: {
  value: 'card' | 'tabby' | 'tamara';
  label: string;
  sublabel?: string;
  selected: boolean;
  onSelect: () => void;
  logo?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex w-full items-center gap-3 border px-4 py-3.5 text-left transition-all ${
        selected
          ? 'border-[#1A3A2A] bg-[#FAF8F4] shadow-[inset_0_0_0_1px_#1A3A2A]'
          : 'border-[#E5DDD0] bg-white hover:border-[#60736A]'
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          selected ? 'border-[#1A3A2A]' : 'border-[#E5DDD0]'
        }`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-[#1A3A2A]" />}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#1A2621]">{label}</p>
        {sublabel && <p className="text-[11px] text-[#60736A]">{sublabel}</p>}
      </div>
      {logo && <div className="flex h-7 items-center">{logo}</div>}
    </button>
  );
}

export default function CheckoutPage() {
  const { items, setItemSize } = useBag();
  const [productMap, setProductMap] = useState<Record<string, Product>>({});
  const [payment, setPayment] = useState<'card' | 'tabby' | 'tamara'>('card');
  const [openStep, setOpenStep] = useState<2 | 3 | null>(2);
  const [step1Open, setStep1Open] = useState(false);
  const [step2Completed, setStep2Completed] = useState(false);
  const [editingSizeFor, setEditingSizeFor] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await api.products.list();
        if (cancelled) return;
        const map: Record<string, Product> = {};
        for (const p of list) map[p.id] = p;
        setProductMap(map);
      } catch {
        /* swallow */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );
  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );
  const missingSizeCount = useMemo(
    () =>
      items.filter((i) => {
        const p = productMap[i.id];
        return p?.sizes && p.sizes.length > 0 && !i.size;
      }).length,
    [items, productMap],
  );
  const canPlaceOrder = items.length > 0 && missingSizeCount === 0;

  const onPlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (missingSizeCount > 0) {
      setStep1Open(true);
      return;
    }
    alert('Demo: order would be placed here.');
  };

  const toggle = (n: 2 | 3) => setOpenStep(openStep === n ? null : n);

  const activeStep: 1 | 2 | 3 = step1Open ? 1 : !step2Completed ? 2 : 3;

  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 py-4 sm:px-6 sm:py-10">
      {/* Top bar */}
      <div className="mb-5 flex items-center justify-between">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-[#60736A] transition-colors hover:text-[#1A2621]"
        >
          <ArrowLeftIcon />
          Shopping Bag
        </Link>
        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-[#60736A]">
          <LockIcon />
          100% Secure
        </span>
      </div>

      {/* Stepper */}
      <div className="mb-5 sm:mb-10">
        <CheckoutStepper active={activeStep} />
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="font-display text-2xl text-[#1A2621] sm:text-3xl">
            Your bag is empty
          </p>
          <Link
            href="/shop"
            className="mt-6 border border-[#1A3A2A] px-8 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#1A3A2A] transition-colors hover:bg-[#1A3A2A] hover:text-white"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_380px] lg:gap-10">
          {/* Left column — Steps 2 & 3 */}
          <form
            onSubmit={onPlaceOrder}
            className="order-2 space-y-4 lg:order-1"
          >
            {/* Step 2 — Delivery Details */}
            <section className="border border-[#E5DDD0] bg-white">
              <StepHeader
                n={2}
                title="Delivery Details"
                subtitle={step2Completed ? 'Saved — click to edit' : 'Where should we ship?'}
                open={openStep === 2}
                onToggle={() => toggle(2)}
                completed={step2Completed}
              />
              {openStep === 2 && (
                <div className="px-4 py-4 sm:px-5 sm:py-5">
                  <div className="mb-5">
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1A3A2A]">
                      Contact Information
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field
                        label="Email Address"
                        type="email"
                        required
                        placeholder="you@example.com"
                        icon={<MailIcon />}
                      />
                      <Field
                        label="Mobile Number"
                        type="tel"
                        required
                        placeholder="+971 XX XXX XXXX"
                        icon={<PhoneIcon />}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1A3A2A]">
                      Shipping Address
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field
                        label="Full Name"
                        type="text"
                        required
                        placeholder="As on ID"
                        icon={<UserIcon />}
                        fullWidth
                      />
                      <Field
                        label="Street Address"
                        type="text"
                        required
                        placeholder="Building, street name"
                        icon={<HomeIcon />}
                        fullWidth
                      />
                      <Field
                        label="City / Area"
                        type="text"
                        required
                        placeholder="e.g. Downtown Dubai"
                        icon={<MapPinIcon />}
                      />
                      <SelectField
                        label="Emirate"
                        required
                        defaultValue="Dubai"
                        options={EMIRATES}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      const form = (e.currentTarget as HTMLButtonElement).closest('form');
                      if (form && !(form as HTMLFormElement).checkValidity()) {
                        (form as HTMLFormElement).reportValidity();
                        return;
                      }
                      setStep2Completed(true);
                      setOpenStep(null);
                    }}
                    className="mt-5 w-full bg-[#1A3A2A] py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-90 sm:text-[12px]"
                  >
                    Save Delivery Details
                  </button>
                </div>
              )}
            </section>

            {/* Step 3 — Payment Options */}
            <section className="border border-[#E5DDD0] bg-white">
              <StepHeader
                n={3}
                title="Payment Options"
                subtitle="Choose how you'd like to pay"
                open={openStep === 3}
                onToggle={() => toggle(3)}
              />
              {openStep === 3 && (
                <div className="px-4 py-4 sm:px-5 sm:py-5">
                  <div className="space-y-2.5" role="radiogroup" aria-label="Payment method">
                    <PaymentOption
                      value="card"
                      label="Credit / Debit Card"
                      sublabel="Visa, Mastercard, Amex"
                      selected={payment === 'card'}
                      onSelect={() => setPayment('card')}
                      logo={
                        <div className="flex items-center gap-1.5">
                          <span className="rounded-sm bg-[#1A3A2A] px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-white">
                            VISA
                          </span>
                          <div className="flex items-center">
                            <span className="h-4 w-4 rounded-full bg-[#EB001B]" />
                            <span className="-ml-2 h-4 w-4 rounded-full bg-[#F79E1B]" />
                          </div>
                        </div>
                      }
                    />
                    <PaymentOption
                      value="tabby"
                      label="Tabby"
                      sublabel="Pay in 4 interest-free payments"
                      selected={payment === 'tabby'}
                      onSelect={() => setPayment('tabby')}
                      logo={
                        <img
                          src="/tabby-logo.avif"
                          alt="Tabby"
                          className="h-5 w-auto"
                        />
                      }
                    />
                    <PaymentOption
                      value="tamara"
                      label="Tamara"
                      sublabel="Pay in 4 installments, no interest"
                      selected={payment === 'tamara'}
                      onSelect={() => setPayment('tamara')}
                      logo={
                        <img
                          src="/tamara-logo.jpg"
                          alt="Tamara"
                          className="h-5 w-auto"
                        />
                      }
                    />
                  </div>

                  {payment === 'card' && (
                    <div className="mt-5 grid gap-3 border-t border-[#E5DDD0] pt-5 sm:grid-cols-2">
                      <Field
                        label="Card Number"
                        type="text"
                        required
                        placeholder="1234 5678 9012 3456"
                        fullWidth
                      />
                      <Field
                        label="Name on Card"
                        type="text"
                        required
                        placeholder="As printed on card"
                        fullWidth
                      />
                      <Field
                        label="Expiry"
                        type="text"
                        required
                        placeholder="MM / YY"
                      />
                      <Field
                        label="CVC"
                        type="text"
                        required
                        placeholder="3 digits"
                      />
                    </div>
                  )}

                  {(payment === 'tabby' || payment === 'tamara') && (
                    <div className="mt-5 rounded-sm border border-dashed border-[#E5DDD0] bg-[#FAF8F4] px-4 py-3.5 text-[11px] leading-relaxed text-[#60736A]">
                      You'll be redirected to {payment === 'tabby' ? 'Tabby' : 'Tamara'} to complete your secure payment after placing the order.
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Place Order + trust signals */}
            <div className="pt-2">
              {missingSizeCount > 0 && (
                <div
                  role="alert"
                  className="mb-3 flex items-start gap-2 rounded-sm border border-[#E5DDD0] bg-[#FBF1DF] px-3 py-2.5 text-[11px] leading-relaxed text-[#7A5320]"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="mt-px shrink-0"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>
                    {missingSizeCount === 1
                      ? 'One item needs a size'
                      : `${missingSizeCount} items need a size`}
                    {' '}before you can place your order.
                  </span>
                </div>
              )}
              <button
                type="submit"
                disabled={!canPlaceOrder}
                aria-disabled={!canPlaceOrder}
                className={`block w-full py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] transition-opacity sm:text-[12px] ${
                  canPlaceOrder
                    ? 'bg-[#1A3A2A] text-white hover:opacity-90'
                    : 'cursor-not-allowed bg-[#E2E0DA] text-[#9CA39F]'
                }`}
              >
                Place Order
              </button>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[10px] uppercase tracking-[0.14em] text-[#60736A]">
                <span className="inline-flex items-center gap-1">
                  <LockIcon /> Secure Checkout
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckIcon size={11} /> Insured Shipping
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckIcon size={11} /> Easy Returns
                </span>
              </div>
            </div>
          </form>

          {/* Right column — items + cream Order Details */}
          <aside className="order-1 lg:order-2 lg:sticky lg:top-28 lg:self-start">
            {/* Step 1 — Order Summary (independent accordion, closed by default) */}
            <section className="border border-[#E5DDD0] bg-white">
              <StepHeader
                n={1}
                title="Order Summary"
                subtitle={`${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
                open={step1Open}
                onToggle={() => setStep1Open((v) => !v)}
              />
              {step1Open && (
                <div className="px-4 py-4 sm:px-5 sm:py-5">
                  <ul className="divide-y divide-[#E5DDD0]">
                    {items.map((item) => {
                      const product = productMap[item.id];
                      const subtitle = item.subtitle || product?.metal || '';
                      const weight = product?.weightGrams?.toFixed(4);
                      const sizes = product?.sizes ?? [];
                      const requiresSize = sizes.length > 0;
                      const missingSize = requiresSize && !item.size;
                      const editingKey = `${item.id}::${item.size ?? ''}`;
                      const isEditing = editingSizeFor === editingKey;
                      return (
                        <li key={editingKey} className="flex gap-4 py-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            width={72}
                            height={72}
                            loading="eager"
                            className="h-[72px] w-[72px] shrink-0 object-cover"
                          />
                          <div className="flex min-w-0 flex-1 flex-col">
                            <p className="text-sm font-medium text-[#1A2621]">
                              {item.name}
                            </p>
                            <p className="mt-0.5 text-[10px] tracking-[0.14em] text-[#60736A] uppercase">
                              SKU : {formatSku(item.id)}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#555]">
                              <span>
                                Qty:{' '}
                                <span className="text-[#1A2621]">
                                  {item.quantity}
                                </span>
                              </span>
                              {requiresSize ? (
                                <button
                                  type="button"
                                  onClick={() => setEditingSizeFor(isEditing ? null : editingKey)}
                                  className={`inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[11px] transition-colors ${
                                    missingSize
                                      ? 'border-[#C89F53] bg-[#FBF1DF] text-[#7A5320] hover:border-[#A87B33]'
                                      : 'border-[#E5DDD0] bg-white text-[#1A2621] hover:border-[#1A3A2A]'
                                  }`}
                                >
                                  Size:{' '}
                                  <span className="font-medium">
                                    {item.size ?? 'Select size'}
                                  </span>
                                </button>
                              ) : (
                                <span>
                                  Size: <span className="text-[#1A2621]">One size</span>
                                </span>
                              )}
                              {subtitle && (
                                <span>
                                  Metal:{' '}
                                  <span className="text-[#1A2621]">{subtitle}</span>
                                </span>
                              )}
                              {weight && (
                                <span>
                                  Weight:{' '}
                                  <span className="text-[#1A2621]">{weight} g</span>
                                </span>
                              )}
                            </div>
                            {isEditing && requiresSize && (
                              <div className="mt-2 space-y-1.5">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#60736A]">
                                  {item.size ? 'Change size' : 'Select size'}
                                </p>
                                <SizeSelector
                                  sizes={sizes}
                                  value={item.size ?? null}
                                  onChange={(s) => {
                                    const newPrice = product ? getPriceForSize(product, s) : undefined;
                                    setItemSize(item.id, item.size ?? null, s, newPrice);
                                    setEditingSizeFor(null);
                                  }}
                                  variant="compact"
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex shrink-0 flex-col items-end justify-between">
                            <button
                              type="button"
                              aria-label="Remove item"
                              className="flex h-6 w-6 items-center justify-center rounded-full text-[#9CA39F] transition-colors hover:bg-[#F2F6F4] hover:text-[#1A2621]"
                            >
                              <XIcon />
                            </button>
                            <p className="text-sm font-medium tabular-nums lining-nums text-[#1A2621]">
                              <AedPrice value={item.price * item.quantity} />
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </section>

            {/* Cream compact Order Details */}
            <div className="mt-4 bg-[#FAF8F4] px-4 py-4 sm:mt-5 sm:px-5 sm:py-5">
              <h3 className="mb-4 font-display text-base font-medium text-[#1A2621]">
                Order Details
              </h3>
              <dl className="space-y-2.5 text-xs text-[#1A2621]">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-[#555]">
                    Price ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
                  </dt>
                  <dd className="font-medium tabular-nums lining-nums">
                    <AedPrice value={subtotal} />
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-[#555]">Delivery Charge</dt>
                  <dd className="flex items-center gap-2">
                    <span className="relative inline-flex items-baseline gap-0.5 text-[11px] text-[#A0A0A0] tabular-nums lining-nums">
                      <img
                        src="/aed-symbol.svg"
                        alt=""
                        aria-hidden
                        className="inline-block h-[0.85em] w-auto"
                      />
                      <span className="line-through decoration-[#A0A0A0] decoration-[1.5px]">
                        50
                      </span>
                    </span>
                    <span className="font-medium text-emerald-700">Free</span>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-[#555]">VAT (5%)</dt>
                  <dd className="font-medium tabular-nums lining-nums text-[#1A2621]">
                    <AedPrice value={Math.round(subtotal * 0.05)} />
                  </dd>
                </div>
              </dl>

              <div className="mt-4 border-t border-[#E5DDD0] pt-3">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-sm font-medium text-[#1A2621]">
                    Estimated Total
                  </dt>
                  <dd className="text-base font-semibold tabular-nums lining-nums text-[#1A2621]">
                    <AedPrice value={subtotal + Math.round(subtotal * 0.05)} />
                  </dd>
                </div>
                <p className="mt-0.5 text-right text-[9px] text-[#60736A]">
                  VAT included in total
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
