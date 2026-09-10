'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useBag, BagItem } from '@/context/BagContext';
import { api, Product, getPriceForSize } from '@/lib/api';
import { SizeSelector } from './SizeSelector';

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

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function RulerIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21.3 8.7 8.7 21.3a1 1 0 0 1-1.4 0L2.7 16.7a1 1 0 0 1 0-1.4L15.3 2.7a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4Z" />
      <path d="m7.5 10.5 6 6" />
    </svg>
  );
}

interface ItemRowProps {
  item: BagItem;
  product: Product | undefined;
  onRemove: () => void;
  onQuantity: (delta: number) => void;
  onPickSize: (size: string) => void;
}

const ItemRow: React.FC<ItemRowProps> = ({ item, product, onRemove, onQuantity, onPickSize }) => {
  const sku = formatSku(item.id);
  const subtitle =
    item.subtitle ||
    (product
      ? `${product.metal}${product.weightGrams ? ` • ${product.weightGrams.toFixed(4)} g` : ''}`
      : '');
  const sizes = product?.sizes ?? [];
  const requiresSize = sizes.length > 0;
  const missingSize = requiresSize && !item.size;
  const [editingSize, setEditingSize] = useState(missingSize);

  return (
    <article className="flex gap-3 border-b border-[#E5DDD0] pb-5 sm:gap-4">
      <Link
        href={`/product/${item.id}`}
        className="block shrink-0 overflow-hidden bg-[#F2F6F4]"
        style={{ width: '90px', height: '90px' }}
      >
        <img
          src={item.image}
          alt={item.name}
          width={180}
          height={180}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/product/${item.id}`}
              className="block truncate text-sm font-medium text-[#1A2621] transition-colors hover:text-[#144B3C]"
            >
              {item.name}
            </Link>
            <p className="mt-0.5 text-[10px] tracking-[0.14em] text-[#60736A] uppercase">
              SKU : {sku}
            </p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${item.name} from bag`}
            title="Remove"
            className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-sm text-[#60736A] transition-colors hover:text-[#144B3C]"
          >
            <TrashIcon />
          </button>
        </div>

        <p className="mt-1 truncate text-[12px] text-[#1A2621]">{subtitle}</p>

        {/* Size row */}
        {requiresSize && (
          <div className="mt-1.5">
            {!editingSize ? (
              <button
                type="button"
                onClick={() => setEditingSize(true)}
                className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-[10px] uppercase tracking-[0.12em] transition-colors ${
                  missingSize
                    ? 'border-[#C89F53] bg-[#FBF1DF] text-[#7A5320] hover:border-[#A87B33]'
                    : 'border-[#E5DDD0] bg-white text-[#1A2621] hover:border-[#1A3A2A]'
                }`}
                aria-label={item.size ? `Change size, currently ${item.size}` : 'Select size'}
              >
                <RulerIcon />
                {missingSize ? (
                  <>
                    Select size
                    <span className="ml-1 inline-block size-1.5 rounded-full bg-[#C89F53]" />
                  </>
                ) : (
                  <>
                    Size: <span className="font-semibold">{item.size}</span>
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#60736A]">
                    {item.size ? 'Change size' : 'Select size'}
                  </p>
                  {!missingSize && (
                    <button
                      type="button"
                      onClick={() => setEditingSize(false)}
                      className="text-[10px] uppercase tracking-[0.16em] text-[#9CA39F] hover:text-[#1A2621]"
                    >
                      Cancel
                    </button>
                  )}
                </div>
                <SizeSelector
                  sizes={sizes}
                  value={item.size ?? null}
                  onChange={(s) => {
                    onPickSize(s);
                    setEditingSize(false);
                  }}
                  variant="compact"
                />
              </div>
            )}
          </div>
        )}

        <p className="mt-1 text-[11px] text-[#C89F53]">Only 1 left</p>

        <div className="mt-1.5 flex items-center justify-between gap-2">
          <div className="flex h-7 items-center border border-[#E5DDD0] bg-white">
            <button
              type="button"
              onClick={() => onQuantity(-1)}
              aria-label="Decrease quantity"
              className="flex h-full w-7 shrink-0 cursor-pointer items-center justify-center text-[#444] transition-colors hover:bg-[#F3F7F4]"
            >
              −
            </button>
            <span className="inline-flex h-full min-w-7 items-center justify-center px-2 text-center text-xs tabular-nums lining-nums">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantity(1)}
              aria-label="Increase quantity"
              className="flex h-full w-7 shrink-0 cursor-pointer items-center justify-center text-[#444] transition-colors hover:bg-[#F3F7F4]"
            >
              +
            </button>
          </div>

          <p className="text-sm font-medium tabular-nums lining-nums text-[#1A2621]">
            <AedPrice value={item.price * item.quantity} />
          </p>
        </div>
      </div>
    </article>
  );
};

export const BagDrawer: React.FC = () => {
  const { items, isOpen, closeBag, removeItem, updateQuantity, setItemSize } = useBag();
  const [productMap, setProductMap] = useState<Record<string, Product>>({});

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeBag}
      />

      {/* Panel */}
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#FAF8F5] shadow-2xl transition-transform">
        <div className="flex items-center justify-between border-b border-[#E5DDD0] px-6 py-5">
          <h2 className="font-jost text-base font-semibold tracking-[0.18em] uppercase text-[#1A3A2A]">
            Shopping Cart{' '}
            <span className="text-[#60736A]">({itemCount})</span>
          </h2>
          <button
            onClick={closeBag}
            className="text-2xl text-[#777] transition-colors hover:text-[#1C1C1C]"
            aria-label="Close bag"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
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
            <div className="space-y-5">
              {items.map((item) => (
                <ItemRow
                  key={`${item.id}::${item.size ?? ''}`}
                  item={item}
                  product={productMap[item.id]}
                  onRemove={() => removeItem(item.id, item.size ?? null)}
                  onQuantity={(delta) => updateQuantity(item.id, item.size ?? null, delta)}
                  onPickSize={(s) => {
                    const product = productMap[item.id];
                    const newPrice = product ? getPriceForSize(product, s) : undefined;
                    setItemSize(item.id, item.size ?? null, s, newPrice);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#E5DDD0] bg-[#FAF8F4] px-6 py-4">
            <h3 className="font-display text-base font-medium text-[#1A2621]">
              Order Summary
            </h3>

            {missingSizeCount > 0 && (
              <div
                role="alert"
                className="mt-3 flex items-start gap-2 rounded-sm border border-[#E5DDD0] bg-[#FBF1DF] px-3 py-2 text-[11px] leading-relaxed text-[#7A5320]"
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
                  {' '}before checkout.
                </span>
              </div>
            )}

            <dl className="mt-3 space-y-2 text-xs">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-[#444]">
                  Price ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
                </dt>
                <dd className="font-medium tabular-nums lining-nums text-[#1A2621]">
                  <AedPrice value={subtotal} />
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-[#444]">Delivery Charge</dt>
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
            </dl>

            <div className="mt-3 border-t border-[#E5DDD0] pt-2.5">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-xs font-medium text-[#1A2621]">
                  Estimated Total
                </dt>
                <dd className="text-sm font-semibold tabular-nums lining-nums text-[#1A2621]">
                  <AedPrice value={subtotal} />
                </dd>
              </div>
              <p className="mt-0.5 text-right text-[9px] text-[#60736A]">
                (Inclusive of all taxes)
              </p>
            </div>

            <Link
              href={missingSizeCount > 0 ? '#' : '/checkout'}
              onClick={(e) => {
                if (missingSizeCount > 0) {
                  e.preventDefault();
                  return;
                }
                closeBag();
              }}
              aria-disabled={missingSizeCount > 0}
              className={`mt-2 block w-full rounded-sm py-3 text-center text-[10px] font-medium uppercase tracking-[0.2em] transition-opacity sm:text-[11px] ${
                missingSizeCount > 0
                  ? 'pointer-events-none cursor-not-allowed bg-[#E2E0DA] text-[#9CA39F]'
                  : 'bg-[#1A3A2A] text-white hover:opacity-90'
              }`}
            >
              Proceed to Checkout
            </Link>
            <div className="mt-0.5 text-center">
              <Link
                href="/shop"
                onClick={closeBag}
                className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#1A3A2A] underline-offset-4 transition-colors hover:underline sm:text-[10px]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
