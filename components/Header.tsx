'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatNumber, NumberText } from '@/lib/format';
import { useBag } from '@/context/BagContext';
import { useWishlist } from '@/context/WishlistContext';
import { usePageScroll } from '@/context/ScrollContext';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useTypewriterPlaceholder } from '@/lib/hooks/useTypewriterPlaceholder';

const HEADER_HEIGHT = 115;

type CountryCode = 'AE' | 'IN' | 'QA' | 'MY' | 'OM' | 'SG';

interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

// Circular country flags built from absolutely-positioned divs so they
// always render (regional-indicator emoji flags don't render as flags on
// every OS/browser). Each scales with the parent's text size.
const CountryFlag: React.FC<{ code: CountryCode; className?: string }> = ({
  code,
  className = '',
}) => {
  const wrap = (children: React.ReactNode) => (
    <span
      aria-hidden="true"
      className={`relative inline-block size-[18px] overflow-hidden rounded-full align-middle leading-none ${className}`}
    >
      {children}
    </span>
  );

  switch (code) {
    case 'AE':
      return wrap(
        <>
          <span className="absolute inset-y-0 left-0 w-1/4 bg-[#CE1126]" />
          <span className="absolute right-0 left-1/4 top-0 h-1/3 bg-[#009A44]" />
          <span className="absolute right-0 left-1/4 top-1/3 h-1/3 bg-white" />
          <span className="absolute right-0 left-1/4 bottom-0 h-1/3 bg-black" />
        </>,
      );
    case 'IN':
      return wrap(
        <>
          <span className="absolute inset-x-0 top-0 h-1/3 bg-[#FF9933]" />
          <span className="absolute inset-x-0 top-1/3 h-1/3 bg-white" />
          <span className="absolute inset-x-0 bottom-0 h-1/3 bg-[#138808]" />
        </>,
      );
    case 'QA':
      return wrap(
        <>
          <span className="absolute inset-0 bg-[#8D1B3D]" />
          <span
            className="absolute inset-y-0 left-0 w-[40%] bg-white"
            style={{ clipPath: 'polygon(0 0, 75% 50%, 0 100%)' }}
          />
        </>,
      );
    case 'MY':
      return wrap(
        <>
          <span className="absolute inset-0 bg-[#CC0001]" />
          <span className="absolute inset-x-0 bottom-0 h-1/2 bg-white" />
          <span className="absolute top-0 left-0 h-[45%] w-[45%] bg-[#010066]" />
        </>,
      );
    case 'OM':
      return wrap(
        <>
          <span className="absolute inset-y-0 left-0 w-1/4 bg-[#CE1126]" />
          <span className="absolute inset-y-0 left-1/4 w-1/2 bg-white" />
          <span className="absolute inset-y-0 right-0 w-1/4 bg-[#008000]" />
        </>,
      );
    case 'SG':
      return wrap(
        <>
          <span className="absolute inset-x-0 top-0 h-1/2 bg-[#ED2939]" />
          <span className="absolute inset-x-0 bottom-0 h-1/2 bg-white" />
        </>,
      );
  }
};

const GlobeIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const Header: React.FC = () => {
  const router = useRouter();
  const { totalCount, openBag } = useBag();
  const { totalCount: wishlistCount } = useWishlist();
  const { scrollY } = usePageScroll();
  const { lang: language, setLang: setLanguage, t } = useLanguage();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [country, setCountry] = useState<CountryCode>('AE');
  const [openDropdown, setOpenDropdown] = useState<'country' | 'language' | null>(null);
  const [drawerDropdown, setDrawerDropdown] = useState<'country' | 'language' | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, right: 0 });
  const countryButtonRef = useRef<HTMLButtonElement | null>(null);
  const languageButtonRef = useRef<HTMLButtonElement | null>(null);

  const typewriterPlaceholder = useTypewriterPlaceholder({
    words:
      language === 'AR'
        ? ['مجوهرات', 'مجموعات', 'هدايا', 'خواتم', 'قلادات']
        : ['jewellery', 'collections', 'gifts', 'rings', 'necklaces'],
    prefix: language === 'AR' ? 'ابحث عن ' : 'Search ',
  });
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const lastScrollYRef = useRef(0);
  const directionalEnabledRef = useRef(false);
  const scrolledRef = useRef(false);

  // Build dropdown options for country/language in the current language.
  const countryOptions: DropdownOption<CountryCode>[] = (
    ['AE', 'IN', 'QA', 'MY', 'OM', 'SG'] as CountryCode[]
  ).map((code) => ({ value: code, label: t(`country.${code}`) }));
  const languageOptions: DropdownOption<Language>[] = [
    { value: 'EN', label: 'English' },
    { value: 'AR', label: 'العربية' },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // PageScroll's initial reading happens ~1 frame after mount. Wait briefly
  // before enabling directional logic so a page-refresh-mid-scroll doesn't
  // look like a "scroll down from 0" and instantly collapse the top row,
  // which hides the menu button.
  useEffect(() => {
    const t = setTimeout(() => {
      directionalEnabledRef.current = true;
    }, 250);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = 'hidden';
      document.body.dataset.drawerOpen = 'true';
    } else {
      document.body.style.overflow = '';
      delete document.body.dataset.drawerOpen;
      setDrawerDropdown(null);
    }
    return () => {
      document.body.style.overflow = '';
      delete document.body.dataset.drawerOpen;
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!directionalEnabledRef.current) {
      lastScrollYRef.current = scrollY;
      return;
    }

    if (scrollY < HEADER_HEIGHT) {
      if (scrolledRef.current) {
        scrolledRef.current = false;
        setScrolled(false);
      }
      lastScrollYRef.current = scrollY;
      return;
    }

    const prevY = lastScrollYRef.current;
    const delta = scrollY - prevY;

    if (delta === 0) return;

    const next = delta > 0;
    if (scrolledRef.current !== next) {
      scrolledRef.current = next;
      setScrolled(next);
    }

    lastScrollYRef.current = scrollY;
  }, [scrollY]);

  const toggleDropdown = (which: 'country' | 'language') => {
    if (openDropdown === which) {
      setOpenDropdown(null);
      return;
    }
    const ref = which === 'country' ? countryButtonRef : languageButtonRef;
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const rtl = document.documentElement.dir === 'rtl';
      setDropdownPos({
        top: rect.bottom + 8,
        left: rtl ? 0 : rect.left,
        right: rtl ? window.innerWidth - rect.right : 0,
      });
    }
    setOpenDropdown(which);
  };

  useEffect(() => {
    if (!openDropdown) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (countryButtonRef.current?.contains(target)) return;
      if (languageButtonRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setOpenDropdown(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDropdown(null);
    };
    const onScroll = () => setOpenDropdown(null);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    window.addEventListener('pagescroll', onScroll as EventListener);
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('pagescroll', onScroll as EventListener);
      document.removeEventListener('scroll', onScroll, { capture: true } as AddEventListenerOptions);
    };
  }, [openDropdown]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#004237]">
      {/* Top Logo & Actions Row (collapses on scroll via grid-rows; spacer follows via root class) */}
      <div
        className={`grid transition-[grid-template-rows] duration-150 ease-out ${
          scrolled ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-5 pt-2 pb-2 lg:px-10">
            {/* Left Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                aria-label={mobileNavOpen ? t('aria.closeMenu') : t('aria.openMenu')}
                aria-expanded={mobileNavOpen}
                className="-ms-2.5 flex items-center justify-center p-2.5 text-white transition-colors hover:text-[#C89F53] lg:hidden"
              >
                {mobileNavOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                    <path d="M4 5h16"></path>
                    <path d="M4 12h16"></path>
                    <path d="M4 19h16"></path>
                  </svg>
                )}
              </button>
              <div className="hidden items-center gap-5 sm:gap-7 lg:flex">
                {!searchOpen && (
                  <button
                    aria-label={t('header.search')}
                    aria-expanded={false}
                    onClick={() => setSearchOpen(true)}
                    className="flex flex-col items-center gap-1 text-white transition-colors hover:text-[#C89F53]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-[17px]">
                      <path d="m21 21-4.34-4.34"></path>
                      <circle cx="11" cy="11" r="8"></circle>
                    </svg>
                    <span className="text-[8.5px] font-normal tracking-[0.14em] uppercase">
                      {t('header.search')}
                    </span>
                  </button>
                )}

                {searchOpen && (
                  <form
                    className="animate-fade-in flex flex-1 items-center gap-3 border border-[#2D5A3D] bg-[#144B3C] py-0.5 pl-4 pr-1 text-white"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const q = searchQuery.trim();
                      if (!q) return;
                      setSearchOpen(false);
                      router.push(`/search?q=${encodeURIComponent(q)}`);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0 text-white">
                      <path d="m21 21-4.34-4.34"></path>
                      <circle cx="11" cy="11" r="8"></circle>
                    </svg>
                    <input
                      type="text"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={typewriterPlaceholder}
                      onBlur={() => {
                        if (!searchQuery) setSearchOpen(false);
                      }}
                      className="min-w-0 flex-1 bg-transparent text-[12px] text-white normal-case placeholder:text-[#B8C7BE] placeholder:tracking-normal focus:outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
                      suppressHydrationWarning
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchOpen(false);
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      aria-label={t('aria.closeMenu')}
                      className="flex size-6 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:text-[#C89F53]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </button>
                  </form>
                )}

                {!searchOpen && (
                  <>
                    <Link
                      href="/contact"
                      className="flex flex-col items-center gap-1 text-white transition-colors hover:text-[#C89F53]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-[17px]">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <span className="text-[8.5px] font-normal tracking-[0.14em] uppercase">
                        {t('header.contact')}
                      </span>
                    </Link>

                    <button
                      ref={countryButtonRef}
                      type="button"
                      onClick={() => toggleDropdown('country')}
                      aria-haspopup="listbox"
                      aria-expanded={openDropdown === 'country'}
                      aria-label={`${t('header.countryLabel')}: ${t(`country.${country}`)}`}
                      className={`flex cursor-pointer flex-col items-center gap-1 transition-colors ${
                        openDropdown === 'country' ? 'text-[#C89F53]' : 'text-white hover:text-[#C89F53]'
                      }`}
                    >
                      <CountryFlag code={country} className="text-[17px]" />
                      <span className="text-[8.5px] font-normal tracking-[0.14em] uppercase">
                        {t(`country.short.${country}`)}
                      </span>
                    </button>

                    <button
                      ref={languageButtonRef}
                      type="button"
                      onClick={() => toggleDropdown('language')}
                      aria-haspopup="listbox"
                      aria-expanded={openDropdown === 'language'}
                      aria-label={`${t('header.languageLabel')}: ${language === 'AR' ? 'العربية' : 'English'}`}
                      className={`flex cursor-pointer flex-col items-center gap-1 transition-colors ${
                        openDropdown === 'language' ? 'text-[#C89F53]' : 'text-white hover:text-[#C89F53]'
                      }`}
                    >
                      <GlobeIcon className="size-[17px]" />
                      <span className="text-[8.5px] font-normal tracking-[0.14em] uppercase">
                        {language === 'AR' ? 'العربية' : 'English'}
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Center Brand Logo (Official Logo Image) */}
            <Link href="/" aria-label={t('aria.home')} className="justify-self-center">
              <div className="flex h-[56px] items-center sm:h-[62px]">
                <img
                  src="/images/thangals-logo-white.png"
                  alt="Thangals Gold & Diamonds"
                  width={350}
                  height={200}
                  className="h-full w-auto max-w-full object-contain"
                />
              </div>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center justify-end gap-5 sm:gap-7">
              <Link
                href="/stores"
                className="hidden flex-col items-center gap-1 text-white transition-colors hover:text-[#C89F53] md:flex"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-[17px]">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span className="text-[8.5px] font-normal tracking-[0.14em] uppercase">
                  {t('header.stores')}
                </span>
              </Link>

              <Link
                href="/wishlist"
                className="flex flex-col items-center gap-1 text-white transition-colors hover:text-[#C89F53]"
              >
                <span className="relative inline-flex">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-[17px]">
                    <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
                  </svg>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#C89F53] text-[9px] font-medium text-white">
                      <NumberText value={wishlistCount} lang={language} />
                    </span>
                  )}
                </span>
                <span className="hidden text-[8.5px] font-normal tracking-[0.14em] uppercase sm:inline">
                  {t('header.wishlist')}
                </span>
              </Link>

              <Link
                href="/contact"
                className="hidden flex-col items-center gap-1 text-white transition-colors hover:text-[#C89F53] sm:flex"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-[17px]">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="text-[8.5px] font-normal tracking-[0.14em] uppercase">
                  {t('header.account')}
                </span>
              </Link>

              <button
                onClick={openBag}
                className="relative flex flex-col items-center gap-1 text-white transition-colors hover:text-[#C89F53]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-[17px]">
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                  <path d="M3.103 6.034h17.794"></path>
                  <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"></path>
                </svg>
                <span className="hidden text-[8.5px] font-normal tracking-[0.14em] uppercase sm:inline">
                  {t('header.bag')}
                </span>
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-medium text-[#004237]">
                    <NumberText value={totalCount} lang={language} />
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="hidden border-t border-white/15 lg:block bg-[#004237]">
        <ul className={`mx-auto flex max-w-[1440px] items-center justify-center px-10 ${language === 'AR' ? 'gap-14' : 'gap-9'}`}>
          {[
            { key: 'nav.gold', href: '/shop' },
            { key: 'nav.diamond', href: '/shop' },
            { key: 'nav.collections', href: '/collections' },
            { key: 'nav.wedding', href: '/bridal' },
            { key: 'nav.bestSellers', href: '/shop' },
            { key: 'nav.newArrivals', href: '/shop' },
            { key: 'nav.gifts', href: '/collections' },
            { key: 'nav.offers', href: '/shop' },
          ].map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className="nav-link group flex items-center gap-1 py-3 text-[11px] font-medium tracking-[0.2em] text-white/90 uppercase transition-colors hover:text-[#C89F53]"
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Backdrop — rendered inside the page tree (so it's inside SimpleBar's
          stacking context). On Android Chrome, backdrop-filter only composites
          when the element is nested in a normal document flow, not portaled
          to a body with overflow:hidden. */}
      <div
        className={`drawer-backdrop ${mobileNavOpen ? 'is-open' : ''}`}
        onClick={() => setMobileNavOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer panel — portaled so it can sit above all page content. */}
      {mounted && createPortal(
        <div
          className={mobileNavOpen ? 'drawer-root drawer-open' : 'drawer-root'}
          aria-hidden={!mobileNavOpen}
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileNavOpen(false);
          }}
        >
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <ul className="drawer-list pt-2">
              {drawerDropdown === null && [
                { key: 'nav.gold', href: '/shop' },
                { key: 'nav.diamond', href: '/shop' },
                { key: 'nav.collections', href: '/collections' },
                { key: 'nav.wedding', href: '/bridal' },
                { key: 'nav.bestSellers', href: '/shop' },
                { key: 'nav.newArrivals', href: '/shop' },
                { key: 'nav.gifts', href: '/collections' },
                { key: 'nav.offers', href: '/shop' },
              ].map((item) => (
                <li key={item.key} className="drawer-item">
                  <Link
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className="drawer-link"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
              {drawerDropdown === 'country' && countryOptions.map((opt) => {
                const isSelected = opt.value === country;
                return (
                  <li key={opt.value} className="drawer-item">
                    <button
                      type="button"
                      onClick={() => {
                        setCountry(opt.value as CountryCode);
                        setDrawerDropdown(null);
                      }}
                      className="drawer-link relative !flex w-full items-center gap-3 whitespace-nowrap"
                    >
                      <CountryFlag code={opt.value as CountryCode} className="text-[14px]" />
                      <span className="flex-1 text-start">{opt.label}</span>
                      {isSelected && (
                        <svg className="ms-auto size-4 shrink-0 text-[#C89F53]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="m5 12 5 5 9-11"></path>
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })}
              {drawerDropdown === 'language' && languageOptions.map((opt) => {
                const isSelected = opt.value === language;
                return (
                  <li key={opt.value} className="drawer-item">
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage(opt.value as Language);
                        setDrawerDropdown(null);
                      }}
                      className="drawer-link relative !flex w-full items-center gap-3 whitespace-nowrap"
                    >
                      <span className="flex-1 text-start" lang={opt.value === 'AR' ? 'ar' : undefined}>{opt.label}</span>
                      {isSelected && (
                        <svg className="ms-auto size-4 shrink-0 text-[#C89F53]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="m5 12 5 5 9-11"></path>
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className={`drawer-footer ${language === 'AR' ? '!gap-8' : '!gap-4'}`}>
              <Link
                href="/stores"
                onClick={() => setMobileNavOpen(false)}
                aria-label={t('header.stores')}
                className="drawer-footer-link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{t('header.stores')}</span>
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileNavOpen(false)}
                aria-label={t('header.contact')}
                className="drawer-footer-link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>{t('header.contact')}</span>
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileNavOpen(false)}
                aria-label={t('header.account')}
                className="drawer-footer-link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>{t('header.account')}</span>
              </Link>
              <button
                type="button"
                onClick={() => setDrawerDropdown(drawerDropdown === 'country' ? null : 'country')}
                aria-label={`${t('header.countryLabel')}: ${t(`country.short.${country}`)}`}
                className="drawer-footer-link"
              >
                <CountryFlag code={country} className="text-[18px]" />
                <span>{t(`country.short.${country}`)}</span>
              </button>
              <button
                type="button"
                onClick={() => setDrawerDropdown(drawerDropdown === 'language' ? null : 'language')}
                aria-label={`${t('header.languageLabel')}: ${language === 'AR' ? 'العربية' : 'English'}`}
                className="drawer-footer-link"
              >
                <GlobeIcon className="size-[18px]" />
                <span>{language === 'AR' ? 'العربية' : 'English'}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Country / Language dropdown — positioned below trigger, escape & outside-click close it */}
      {mounted && openDropdown && createPortal(
        <ul
          ref={dropdownRef}
          role="listbox"
          style={{
            top: dropdownPos.top,
            left: dropdownPos.left || undefined,
            right: dropdownPos.right || undefined,
          }}
          className="fixed z-[60] min-w-[200px] animate-fade-down overflow-hidden border border-[#E5DDD0] bg-white shadow-[0_18px_40px_-20px_rgba(20,75,60,0.45)]"
        >
          {openDropdown === 'country'
            ? countryOptions.map((opt) => {
                const isSelected = opt.value === country;
                return (
                  <li key={opt.value} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => {
                        setCountry(opt.value);
                        setOpenDropdown(null);
                      }}
                      className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
                        isSelected
                          ? 'bg-[#1A3A2A] text-white'
                          : 'text-[#1A2621] hover:bg-[#F2F6F4] hover:text-[#144B3C]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <CountryFlag code={opt.value} className="text-[14px]" />
                        <span className="truncate">{opt.label}</span>
                      </span>
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
              })
            : languageOptions.map((opt) => {
                const isSelected = opt.value === language;
                return (
                  <li key={opt.value} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage(opt.value);
                        setOpenDropdown(null);
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
        </ul>,
        document.body
      )}
    </header>
  );
};
