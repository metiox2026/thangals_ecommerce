'use client';

import React, { useState } from 'react';

interface ShareButtonProps {
  productName: string;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ productName, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';

    // Direct share to WhatsApp
    window.open(
      `https://wa.me/?text=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer',
    );

    // Fallback: copy link (in case popup blocked / WhatsApp Web unavailable)
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // silent — WhatsApp window opening is the primary affordance
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share on WhatsApp"
      title={copied ? 'Link copied' : 'Share on WhatsApp'}
      className={`flex items-center justify-center transition-colors cursor-pointer ${className}`}
    >
      {copied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      )}
    </button>
  );
};
