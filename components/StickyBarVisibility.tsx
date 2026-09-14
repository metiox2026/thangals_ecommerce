'use client';

import { useSyncExternalStore } from 'react';

// === Module-level store: which sticky bottom bar is currently visible.
// Other floating UI (e.g. WhatsApp button) subscribes so it can lift
// out of the way using a per-bar offset.
export type StickyBarType = 'shop' | 'product' | null;

let _type: StickyBarType = null;
const _listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  _listeners.add(cb);
  return () => {
    _listeners.delete(cb);
  };
}

function getSnapshot(): StickyBarType {
  return _type;
}

function getServerSnapshot(): StickyBarType {
  return null;
}

export const setStickyBarType = (type: StickyBarType): void => {
  if (_type === type) return;
  _type = type;
  _listeners.forEach((cb) => cb());
};

export const useStickyBarType = (): StickyBarType =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);