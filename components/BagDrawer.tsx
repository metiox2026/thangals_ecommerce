'use client';

import React from 'react';
import { useBag } from '@/context/BagContext';
import Link from 'next/link';

export const BagDrawer: React.FC = () => {
  const { items, isOpen, closeBag, removeItem, updateQuantity, totalPrice } = useBag();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeBag}
      />

      {/* Panel */}
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#FAF8F5] p-6 shadow-2xl transition-transform">
        <div className="flex items-center justify-between border-b border-[#E5DDD0] pb-4">
          <h2 className="font-serif text-2xl font-medium text-[#1A3A2A]">Your Shopping Bag</h2>
          <button
            onClick={closeBag}
            className="text-2xl text-[#777] transition-colors hover:text-[#1C1C1C]"
            aria-label="Close bag"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
              <svg
                className="mb-4 h-12 w-12 text-[#E5DDD0]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="font-serif text-lg text-[#444]">Your bag is empty</p>
              <button
                onClick={closeBag}
                className="mt-4 rounded-sm border border-[#1A3A2A] px-6 py-2 text-xs uppercase tracking-widest text-[#1A3A2A] transition-colors hover:bg-[#1A3A2A] hover:text-white"
              >
                Explore Jewellery
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b border-[#E5DDD0] pb-4 items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-sm object-cover bg-neutral-100"
                  />
                  <div className="flex-1">
                    <h3 className="font-serif text-base font-medium text-[#1C1C1C]">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#777]">{item.subtitle}</p>
                    <p className="mt-1 font-serif text-sm font-semibold text-[#1A3A2A]">
                      {item.currency} {item.price.toLocaleString()}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center border border-[#E5DDD0] bg-white rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-xs text-[#444] hover:bg-[#F3F7F4]"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-xs text-[#444] hover:bg-[#F3F7F4]"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-700 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#E5DDD0] pt-4">
            <div className="flex justify-between pb-4 font-serif text-lg">
              <span className="text-[#444]">Subtotal</span>
              <span className="font-semibold text-[#1A3A2A]">
                AED {totalPrice.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => alert('Checkout demo initiated!')}
              className="w-full rounded-sm bg-[#1A3A2A] py-3 text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-90"
            >
              Proceed to Checkout
            </button>
            <p className="mt-2 text-center text-[10px] text-[#777]">
              Complimentary gift packaging & insured shipping across the UAE.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
};
