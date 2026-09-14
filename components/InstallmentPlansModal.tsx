'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDecimal, NumberText } from '@/lib/format';

interface InstallmentPlansModalProps {
  open: boolean;
  onClose: () => void;
  price: number;
}

const TABBY_FEE_TOTAL = 115.5;
const TAMARA_FEE_TOTAL = 60;

function Aed({ value, decimals = 2 }: { value: number; decimals?: number }) {
  const { lang } = useLanguage();
  return (
    <span className="inline-flex items-baseline gap-0.5 tabular-nums lining-nums">
      <img src="/aed-symbol.svg" alt="" aria-hidden className="inline-block h-[0.85em] w-auto" />
      <NumberText value={value} lang={lang} fractionDigits={decimals} />
    </span>
  );
}

interface Plan {
  n: 4 | 6 | 8 | 12;
  monthlyPayment: number;
  monthlyFee: number;
  noFee: boolean;
}

function tabbyPlans(price: number): Plan[] {
  const base = Math.round(price);
  return [
    { n: 4, monthlyPayment: base / 4, monthlyFee: 0, noFee: true },
    { n: 6, monthlyPayment: (base + TABBY_FEE_TOTAL) / 6, monthlyFee: TABBY_FEE_TOTAL / 6, noFee: false },
    { n: 8, monthlyPayment: (base + TABBY_FEE_TOTAL) / 8, monthlyFee: TABBY_FEE_TOTAL / 8, noFee: false },
    { n: 12, monthlyPayment: (base + TABBY_FEE_TOTAL) / 12, monthlyFee: TABBY_FEE_TOTAL / 12, noFee: false },
  ];
}

function tamaraPlans(price: number): Plan[] {
  const base = Math.round(price);
  return [
    { n: 4, monthlyPayment: base / 4, monthlyFee: 0, noFee: true },
    { n: 6, monthlyPayment: (base + TAMARA_FEE_TOTAL) / 6, monthlyFee: TAMARA_FEE_TOTAL / 6, noFee: false },
    { n: 8, monthlyPayment: (base + TAMARA_FEE_TOTAL) / 8, monthlyFee: TAMARA_FEE_TOTAL / 8, noFee: false },
    { n: 12, monthlyPayment: (base + TAMARA_FEE_TOTAL) / 12, monthlyFee: TAMARA_FEE_TOTAL / 12, noFee: false },
  ];
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1A3A2A] to-[#144B3C] text-xs font-semibold text-white shadow-md shadow-[#1A3A2A]/30">
        {n}
      </span>
      <span className="pt-1 leading-relaxed">{children}</span>
    </li>
  );
}

interface ProviderSectionProps {
  logoSrc: string;
  logoAlt: string;
  name: string;
  tagline: string;
  plans: Plan[];
}

const ProviderSection: React.FC<ProviderSectionProps> = ({
  logoSrc,
  logoAlt,
  name,
  tagline,
  plans,
}) => {
  const { t } = useLanguage();
  const featured = plans[0];
  const others = plans.slice(1);

  return (
    <section className="space-y-3.5">
      <div className="flex items-center gap-2.5">
        <img src={logoSrc} alt={logoAlt} className="h-6 w-auto rounded-sm" />
        <div className="leading-tight">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1A3A2A]">
            {name}
          </p>
          <p className="text-[10px] text-[#60736A]">{tagline}</p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-[#C89F53]/40 bg-white p-5 shadow-md shadow-black/10">
        <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-[#C89F53]/12 blur-2xl" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7A5320]">
              {t('installment.recommended')}
            </p>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="font-jost text-4xl font-semibold tracking-tight tabular-nums lining-nums text-[#1A2621]">
                {featured.n}
              </span>
              <span className="text-sm font-medium text-[#60736A]">{t('installment.payments')}</span>
            </div>
            <p className="mt-0.5 text-xs text-[#60736A]">{t('installment.noFees')}</p>
          </div>
          <span className="shrink-0 rounded-full bg-[#C89F53]/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#7A5320] ring-1 ring-[#C89F53]/40">
            {t('installment.free')}
          </span>
        </div>
        <div className="relative mt-3 flex items-baseline gap-1">
          <span className="font-jost text-2xl font-semibold tabular-nums lining-nums text-[#1A2621]">
            <Aed value={featured.monthlyPayment} />
          </span>
          <span className="text-sm text-[#777]">{t('installment.perMonth')}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {others.map((plan) => (
          <div
            key={plan.n}
            className="rounded-2xl border border-[#E5DDD0] bg-white p-3.5 shadow-sm shadow-black/10 transition-shadow hover:shadow-md"
          >
            <p className="font-jost text-lg font-semibold tabular-nums lining-nums text-[#1A2621]">
              {plan.n}
            </p>
            <p className="text-[10px] uppercase tracking-[0.1em] text-[#60736A]">{t('installment.payments')}</p>
            <p className="mt-2.5 text-[10px] text-[#777]">
              +<Aed value={plan.monthlyFee} /> fee
            </p>
            <div className="mt-1.5 flex items-baseline gap-0.5 font-jost text-sm font-semibold tabular-nums lining-nums text-[#1A2621]">
              <Aed value={plan.monthlyPayment} />
              <span className="text-[10px] font-normal text-[#777]">{t('installment.perMonth')}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const InstallmentPlansModal: React.FC<InstallmentPlansModalProps> = ({
  open,
  onClose,
  price,
}) => {
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    const scrollY = window.scrollY;
    const prevOverflow = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.dataset.modalOpen = 'true';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;
      window.scrollTo(0, scrollY);
      delete document.body.dataset.modalOpen;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[500] flex items-stretch justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={t('installment.eyebrow')}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/55 to-black/65 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative z-10 flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl shadow-black/25 sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-3xl">
        <div className="flex shrink-0 items-start justify-between gap-3 px-6 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-7">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#60736A]">
              {t('installment.eyebrow')}
            </p>
            <h2 className="mt-1 font-jost text-xl font-semibold tracking-tight text-[#1A2621] sm:text-2xl">
              {t('installment.title')}
            </h2>
            <p className="mt-1 text-sm text-[#60736A]">
              {t('installment.subtitle')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('aria.closeInstallment')}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/60 text-[#60736A] shadow-sm ring-1 ring-white/40 backdrop-blur-md transition-all hover:bg-white hover:text-[#1A2621]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="h-px shrink-0 bg-gradient-to-r from-transparent via-[#1A3A2A]/20 to-transparent" />

        <div
          className="flex-1 space-y-7 overflow-y-auto overscroll-contain px-6 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-7"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <ProviderSection
            logoSrc="/tabby-logo.avif"
            logoAlt={t('provider.tabby')}
            name={t('provider.tabby')}
            tagline={t('provider.tabby.tagline')}
            plans={tabbyPlans(price)}
          />

          <div className="h-px bg-gradient-to-r from-transparent via-[#1A3A2A]/15 to-transparent" />

          <ProviderSection
            logoSrc="/tamara-logo.jpg"
            logoAlt={t('provider.tamara')}
            name={t('provider.tamara')}
            tagline={t('provider.tamara.tagline')}
            plans={tamaraPlans(price)}
          />

          <div className="rounded-3xl border border-[#E5DDD0] bg-white p-5 shadow-sm shadow-black/10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1A3A2A]">
              {t('installment.howItWorks')}
            </p>
            <ol className="mt-4 space-y-3 text-[13px] leading-relaxed text-[#444]">
              <Step n={1}>Choose Tabby or Tamara at checkout to select a payment plan</Step>
              <Step n={2}>Enter your information and add your debit or credit card</Step>
              <Step n={3}>Depending on your plan, you may or may not make a down payment</Step>
              <Step n={4}>We&rsquo;ll send you a reminder when your next payment is due</Step>
            </ol>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#E5DDD0] bg-white p-4 shadow-sm shadow-black/10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1A3A2A]">
                {t('installment.trusted.title')}
              </p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#444]">
                {t('installment.trusted.body')}
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5DDD0] bg-white p-4 shadow-sm shadow-black/10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1A3A2A]">
                {t('installment.safe.title')}
              </p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#444]">
                {t('installment.safe.body')}
              </p>
            </div>
          </div>

          <details className="group overflow-hidden rounded-2xl border border-[#E5DDD0] bg-white shadow-sm shadow-black/10">
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1A3A2A] [&::-webkit-details-marker]:hidden">
              {t('installment.terms')}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-open:rotate-90"
                aria-hidden="true"
              >
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </summary>
            <p className="px-5 pb-4 text-[11px] leading-relaxed text-[#777]">
              {t('installment.termsBody')}{' '}
              <a
                href="https://tabby.ai"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#1A3A2A] underline-offset-4 hover:underline"
              >
                tabby.ai
              </a>{' '}
              ·{' '}
              <a
                href="https://tamara.co"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#1A3A2A] underline-offset-4 hover:underline"
              >
                tamara.co
              </a>
            </p>
          </details>
        </div>
      </div>
    </div>,
    document.body,
  );
};
