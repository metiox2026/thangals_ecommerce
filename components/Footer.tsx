'use client';

import React from 'react';
import Link from 'next/link';

const socialIconClass =
  'flex h-9 w-9 items-center justify-center border border-[#D8D2C7] text-[#666666] transition-colors hover:border-[#0B3C30] hover:text-[#0B3C30]';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-24 border-t border-[#E6E1DA] bg-[#F5F2EC]">
      {/* ===== NEWSLETTER BAND ===== */}
      <div className="border-b border-[#E6E1DA]">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-3 px-5 py-8 text-center lg:px-10">
          <img
            src="/images/thangals-logo.png"
            alt="Thangals Gold &amp; Diamonds"
            className="h-10 w-auto sm:h-12"
          />
          <h2 className="font-display text-2xl md:text-[1.75rem] md:leading-[1.15]">
            Join the World of Thangals
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-[#666666]">
            From heritage gold to emerald heirlooms, find the piece that feels like you.
          </p>
          <form
            className="mx-auto mt-1 flex max-w-md items-stretch border-b border-[#1C1C1C]/30"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="Email"
              className="flex-1 bg-transparent py-1.5 text-sm uppercase tracking-[0.12em] outline-none placeholder:text-[#1A2621]"
            />
            <button className="bg-[#0B3C30] px-6 text-[11px] tracking-[0.22em] uppercase text-white transition-opacity hover:opacity-90">
              Sign up
            </button>
          </form>
          <p className="mx-auto max-w-xl text-xs leading-relaxed text-[#666666]">
            <span className="font-medium text-[#1A2621]">See What Customers Have To Say:</span>{' '}
            Real experiences from happy customers who found their perfect piece with Thangals.
          </p>
        </div>
      </div>

      {/* ===== 5-COLUMN LINK GRID ===== */}
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-5 lg:px-10">
        {/* Shopping */}
        <div>
          <h3 className="eyebrow">Shopping</h3>
          <ul className="mt-5 space-y-3 text-sm text-[#666666]">
            <li><Link href="/shop" className="link-underline hover:text-[#1C1C1C]">All Jewellery</Link></li>
            <li><Link href="/shop" className="link-underline hover:text-[#1C1C1C]">Gold Jewellery</Link></li>
            <li><Link href="/shop" className="link-underline hover:text-[#1C1C1C]">Diamond Jewellery</Link></li>
            <li><Link href="/bridal" className="link-underline hover:text-[#1C1C1C]">Bridal</Link></li>
            <li><Link href="/collections" className="link-underline hover:text-[#1C1C1C]">Collections</Link></li>
            <li><Link href="/shop" className="link-underline hover:text-[#1C1C1C]">Gifts</Link></li>
          </ul>
        </div>

        {/* Our Company */}
        <div>
          <h3 className="eyebrow">Our Company</h3>
          <ul className="mt-5 space-y-3 text-sm text-[#666666]">
            <li><Link href="/" className="link-underline hover:text-[#1C1C1C]">Home</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">About Us</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">Our Story</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">Blog</Link></li>
            <li><Link href="/stores" className="link-underline hover:text-[#1C1C1C]">Boutiques</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">Careers</Link></li>
          </ul>
        </div>

        {/* Information */}
        <div>
          <h3 className="eyebrow">Information</h3>
          <ul className="mt-5 space-y-3 text-sm text-[#666666]">
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">Terms &amp; Conditions</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">Privacy Policy</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">Shipping Policy</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">Return &amp; Exchange</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">Hallmarking</Link></li>
          </ul>
        </div>

        {/* Let Us Help You */}
        <div>
          <h3 className="eyebrow">Let Us Help You</h3>
          <ul className="mt-5 space-y-3 text-sm text-[#666666]">
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">FAQ</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">Ring Size Guide</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">Bangle Size Guide</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">Jewellery Care</Link></li>
            <li><Link href="/contact" className="link-underline hover:text-[#1C1C1C]">Sitemap</Link></li>
          </ul>
        </div>

        {/* Connect With Us */}
        <div>
          <h3 className="eyebrow">Connect With Us</h3>
          <address className="not-italic mt-5 space-y-3 text-sm leading-relaxed text-[#666666]">
            <p>
              Head Office<br />
              Gold Centre Bldg — Shop 19 &amp; 20<br />
              Gold Souq, Deira — Dubai
            </p>
            <p>
              <a href="tel:+97142261993" className="link-underline hover:text-[#1C1C1C]">
                +971 4 226 1993
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
            <a href="#" aria-label="TikTok" className={socialIconClass}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-[15px]">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" aria-label="Instagram" className={socialIconClass}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-[15px]">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </a>
            {/* YouTube */}
            <a href="#" aria-label="YouTube" className={socialIconClass}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-[15px]">
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                <path d="m10 15 5-3-5-3z"></path>
              </svg>
            </a>
            {/* Facebook */}
            <a href="#" aria-label="Facebook" className={socialIconClass}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-[15px]">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" aria-label="LinkedIn" className={socialIconClass}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-[15px]">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ===== COPYRIGHT BAR ===== */}
      <div className="border-t border-[#E6E1DA]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-6 text-[11px] tracking-[0.14em] uppercase text-[#666666] sm:flex-row sm:justify-between lg:px-10">
          <span>© 2026 Thangals Jewellery LLC, Dubai · Hallmarked 22K &amp; 18K · Made in the UAE since 1993</span>
          <span>Privacy · Terms · Hallmarking</span>
        </div>
      </div>
    </footer>
  );
};
