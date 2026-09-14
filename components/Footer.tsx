'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { localizeDigits } from '@/lib/format';

const socialIconClass =
  'flex h-9 w-9 items-center justify-center border border-[#D8D2C7] text-[#666666] transition-colors hover:border-[#0B3C30] hover:text-[#0B3C30]';

const ChevronIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    className={className}
  >
    <path d="m6 9 6 6 6-6"></path>
  </svg>
);

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const isLg = useMediaQuery('(min-width: 1024px)');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isLg) setOpen(true);
  }, [isLg]);

  return (
    <details
      open={open}
      onToggle={(e) => {
        if (!isLg) setOpen(e.currentTarget.open);
      }}
      className="group border-b border-[#E6E1DA] py-3 sm:border-0 sm:py-0"
    >
      <summary className="flex cursor-pointer items-center justify-between list-none marker:hidden lg:cursor-default lg:pointer-events-none">
        <h3 className="font-jost text-[13px] font-medium tracking-[0.2em] uppercase text-[#4A4A4A]">
          {title}
        </h3>
        <ChevronIcon className="size-4 text-[#666666] transition-transform duration-200 group-open:rotate-180 lg:hidden" />
      </summary>
      <div className="mt-3 lg:mt-5">{children}</div>
    </details>
  );
};

const StaticSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="border-b border-[#E6E1DA] py-3 sm:border-0 sm:py-0">
    <h3 className="font-jost text-[13px] font-medium tracking-[0.2em] uppercase text-[#4A4A4A]">
      {title}
    </h3>
    <div className="mt-3 lg:mt-5">{children}</div>
  </div>
);

export const Footer: React.FC = () => {
  const { t, lang } = useLanguage();

  return (
    <footer id="site-footer" className="mt-16 border-t border-[#E6E1DA] bg-[#F5F2EC] lg:mt-24">
      {/* ===== NEWSLETTER BAND ===== */}
      <div className="border-b border-[#E6E1DA]">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-2 px-5 py-6 text-center sm:gap-3 sm:py-8 lg:px-10">
          <img
            src="/images/thangals-logo.png"
            alt="Thangals Gold &amp; Diamonds"
            className="h-9 w-auto sm:h-12"
          />
          <h2 className="font-display text-xl leading-tight sm:text-2xl md:text-[1.75rem] md:leading-[1.15]">
            {t('footer.newsletter.title')}
          </h2>
          <p className="mx-auto max-w-xl text-xs leading-relaxed text-[#666666] sm:text-sm">
            {t('footer.newsletter.body')}
          </p>
          <form
            className="mx-auto mt-1 flex w-full max-w-md items-stretch border-b border-[#1C1C1C]/30"
            onSubmit={(e) => e.preventDefault()}
            suppressHydrationWarning
          >
            <input
              type="email"
              required
              placeholder={t('footer.newsletter.placeholder')}
              className="min-w-0 flex-1 bg-transparent py-1.5 text-sm uppercase tracking-[0.12em] outline-none placeholder:text-[#1A2621]"
              suppressHydrationWarning
            />
            <button className="bg-[#0B3C30] px-5 text-[11px] tracking-[0.22em] uppercase text-white transition-opacity hover:opacity-90 sm:px-6">
              {t('footer.newsletter.cta')}
            </button>
          </form>
          <p className="mx-auto max-w-xl text-[11px] leading-relaxed text-[#666666] sm:text-xs">
            <span className="font-medium text-[#1A2621]">{t('footer.newsletter.reviewsLabel')}</span>{' '}
            {t('footer.newsletter.reviewsBody')}
          </p>
        </div>
      </div>

      {/* ===== LINK GRID (accordions on mobile, expanded on lg+) ===== */}
      <div className="mx-auto grid max-w-[1400px] gap-0 px-5 py-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 sm:py-12 lg:grid-cols-5 lg:gap-10 lg:px-10 lg:py-16">
        {/* Shopping */}
        <Section title={t('footer.section.shopping')}>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-[#666666] sm:block sm:space-y-3 sm:gap-y-0">
            <li><Link href="/shop" className="link-underline hover:text-[#1C1C1C]">{t('footer.link.allJewellery')}</Link></li>
            <li><Link href="/shop" className="link-underline hover:text-[#1C1C1C]">{t('nav.gold')}</Link></li>
            <li><Link href="/shop" className="link-underline hover:text-[#1C1C1C]">{t('nav.diamond')}</Link></li>
            <li><Link href="/bridal" className="link-underline hover:text-[#1C1C1C]">{t('filter.option.bridal')}</Link></li>
            <li><Link href="/collections" className="link-underline hover:text-[#1C1C1C]">{t('nav.collections')}</Link></li>
            <li><Link href="/shop" className="link-underline hover:text-[#1C1C1C]">{t('nav.gifts')}</Link></li>
          </ul>
        </Section>

        {/* Our Company */}
        <Section title={t('footer.section.company')}>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-[#666666] sm:block sm:space-y-3 sm:gap-y-0">
            <li><Link href="/" className="link-underline hover:text-[#1C1C1C]">{t('footer.link.home')}</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">{t('footer.link.about')}</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">{t('footer.link.ourStory')}</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">{t('footer.link.blog')}</Link></li>
            <li><Link href="/stores" className="link-underline hover:text-[#1C1C1C]">{t('footer.link.boutiques')}</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">{t('footer.link.careers')}</Link></li>
          </ul>
        </Section>

        {/* Information */}
        <Section title={t('footer.section.info')}>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-[#666666] sm:block sm:space-y-3 sm:gap-y-0">
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">{t('footer.link.terms')}</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">{t('footer.link.privacy')}</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">{t('footer.link.shipping')}</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">{t('footer.link.returns')}</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">{t('footer.link.hallmarking')}</Link></li>
          </ul>
        </Section>

        {/* Let Us Help You */}
        <Section title={t('footer.section.help')}>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-[#666666] sm:block sm:space-y-3 sm:gap-y-0">
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">{t('footer.link.faq')}</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">{t('footer.link.ringGuide')}</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">{t('footer.link.bangleGuide')}</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">{t('footer.link.care')}</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">{t('footer.link.sitemap')}</Link></li>
          </ul>
        </Section>

        {/* Connect With Us — always visible, no toggle */}
        <StaticSection title={t('footer.section.connect')}>
          <address className="not-italic space-y-3 text-sm leading-relaxed text-[#666666]">
            <p>
              {t('footer.contact.headOffice')}<br />
              Gold Centre Bldg — Shop 19 &amp; 20<br />
              Gold Souq, Deira — Dubai
            </p>
            <p>
              <a href="tel:+97142261993" className="link-underline hover:text-[#1C1C1C]">
                {localizeDigits('+971 4 226 1993', lang)}
              </a>
            </p>
            <p>
              <a href="mailto:hello@thangals.com" className="link-underline hover:text-[#1C1C1C]">
                hello@thangals.com
              </a>
            </p>
          </address>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {/* TikTok */}
            <a href="#" aria-label={t('aria.social.tiktok')} className={socialIconClass}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-[15px]">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" aria-label={t('aria.social.instagram')} className={socialIconClass}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-[15px]">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </a>
            {/* YouTube */}
            <a href="#" aria-label={t('aria.social.youtube')} className={socialIconClass}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-[15px]">
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                <path d="m10 15 5-3-5-3z"></path>
              </svg>
            </a>
            {/* Facebook */}
            <a href="#" aria-label={t('aria.social.facebook')} className={socialIconClass}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-[15px]">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" aria-label={t('aria.social.linkedin')} className={socialIconClass}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-[15px]">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </StaticSection>
      </div>

      {/* ===== COPYRIGHT BAR ===== */}
      <div className="border-t border-[#E6E1DA]">
        <div className="mx-auto max-w-[1400px] px-5 py-5 text-center text-[11px] leading-relaxed text-[#666666] sm:py-6 sm:text-xs lg:px-10">
          <p>{t('footer.copyright', { year: 2026 }).split('METIOX SOLUTIONS').map((part, i, arr) => (
            <React.Fragment key={i}>
              {part}
              {i < arr.length - 1 && (
                <a href="https://metiox.com" className="text-[#1A2621] hover:underline">METIOX SOLUTIONS</a>
              )}
            </React.Fragment>
          ))}</p>
          <p className="mt-1.5">
            {t('footer.legalDisclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
};