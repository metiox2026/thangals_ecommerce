'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useBag } from '@/context/BagContext';
import { useWishlist } from '@/context/WishlistContext';
import { usePageScroll } from '@/context/ScrollContext';

const HEADER_HEIGHT = 115;

export const Header: React.FC = () => {
  const { totalCount, openBag } = useBag();
  const { totalCount: wishlistCount } = useWishlist();
  const { scrollY } = usePageScroll();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lastScrollYRef = useRef(0);
  const directionalEnabledRef = useRef(false);
  const scrolledRef = useRef(false);

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
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/15 bg-[#004237]">
      {/* Top Logo & Actions Row (collapses on scroll via grid-rows; spacer follows via root class) */}
      <div
        className={`grid transition-[grid-template-rows] duration-150 ease-out ${
          scrolled ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-5 pt-2 pb-2 lg:px-10">
            {/* Left Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open menu"
                className="-ml-2.5 flex items-center justify-center p-2.5 text-white transition-colors hover:text-[#C89F53] lg:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                  <path d="M4 5h16"></path>
                  <path d="M4 12h16"></path>
                  <path d="M4 19h16"></path>
                </svg>
              </button>
              <button
                aria-label="Search"
                className="hidden w-64 items-center gap-2 border border-white/30 bg-transparent px-4 py-2 text-white transition-colors hover:border-white/60 lg:flex"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-[16px] text-white/70">
                  <path d="m21 21-4.34-4.34"></path>
                  <circle cx="11" cy="11" r="8"></circle>
                </svg>
                <span className="text-[11px] tracking-[0.14em] text-white/70 uppercase">
                  Search
                </span>
              </button>
            </div>

            {/* Center Brand Logo (Official Logo Image) */}
            <Link href="/" aria-label="Thangals home" className="justify-self-center">
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
                <span className="text-[8.5px] font-normal tracking-[0.14em] uppercase">Stores</span>
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
                      {wishlistCount}
                    </span>
                  )}
                </span>
                <span className="hidden text-[8.5px] font-normal tracking-[0.14em] uppercase sm:inline">Wishlist</span>
              </Link>

              <Link
                href="/contact"
                className="hidden flex-col items-center gap-1 text-white transition-colors hover:text-[#C89F53] sm:flex"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-[17px]">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="text-[8.5px] font-normal tracking-[0.14em] uppercase">Account</span>
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
                <span className="hidden text-[8.5px] font-normal tracking-[0.14em] uppercase sm:inline">Bag</span>
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-medium text-[#004237]">
                    {totalCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="hidden border-t border-white/15 lg:block bg-[#004237]">
        <ul className="mx-auto flex max-w-[1440px] items-center justify-center gap-9 px-10">
          {[
            { name: 'Gold Jewellery', href: '/shop' },
            { name: 'Diamond Jewellery', href: '/shop' },
            { name: 'Collections', href: '/collections' },
            { name: 'Wedding', href: '/bridal' },
            { name: 'Best Sellers', href: '/shop' },
            { name: 'New Arrivals', href: '/shop' },
            { name: 'Gifts', href: '/collections' },
            { name: 'Offers', href: '/shop' },
          ].map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="group flex items-center gap-1 py-3 text-[11px] font-medium tracking-[0.2em] text-white/90 uppercase transition-colors hover:text-[#C89F53]"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Drawer — always rendered after mount; CSS controls open/close via .drawer-open class */}
      {mounted && createPortal(
        <div
          className={mobileNavOpen ? 'drawer-root drawer-open' : 'drawer-root'}
          aria-hidden={!mobileNavOpen}
        >
          <div
            className="drawer-backdrop"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
          <div className="drawer-panel">
            <div className="drawer-header">
              <img src="/images/thangals-logo.png" alt="Thangals" className="drawer-logo" />
              <button
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close menu"
                className="drawer-close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
            <ul className="drawer-list">
              {[
                { name: 'Gold Jewellery', href: '/shop' },
                { name: 'Diamond Jewellery', href: '/shop' },
                { name: 'Collections', href: '/collections' },
                { name: 'Wedding', href: '/bridal' },
                { name: 'Best Sellers', href: '/shop' },
                { name: 'New Arrivals', href: '/shop' },
                { name: 'Gifts', href: '/collections' },
                { name: 'Offers', href: '/shop' },
              ].map((item) => (
                <li key={item.name} className="drawer-item">
                  <Link
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className="drawer-link"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="drawer-footer">
              <Link
                href="/stores"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Stores"
                className="drawer-footer-link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Stores</span>
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Wishlist"
                className="drawer-footer-link"
              >
                <span className="drawer-footer-icon-wrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
                  </svg>
                  {wishlistCount > 0 && (
                    <span className="drawer-footer-count !bg-[#C89F53]">{wishlistCount}</span>
                  )}
                </span>
                <span>Wishlist</span>
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Account"
                className="drawer-footer-link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Account</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  openBag();
                }}
                aria-label="Bag"
                className="drawer-footer-link"
              >
                <span className="drawer-footer-icon-wrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                    <path d="M3.103 6.034h17.794"></path>
                    <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"></path>
                  </svg>
                  {totalCount > 0 && (
                    <span className="drawer-footer-count">{totalCount}</span>
                  )}
                </span>
                <span>Bag</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
