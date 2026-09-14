'use client';

import { useSyncExternalStore } from 'react';

// === Module-level store: true when any sticky bottom bar (shop sticky
// controls on /shop, or product page mobile action bar on /product/*)
// is currently visible. Other floating UI (e.g. WhatsApp button)
// subscribes to this to clear the area.
let _visible = false;
const _listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  _listeners.add(cb);
  return () => {
    _listeners.delete(cb);
  };
}

function getSnapshot(): boolean {
  return _visible;
}

function getServerSnapshot(): boolean {
  return false;
}

export const setStickyBarVisible = (visible: boolean): void => {
  if (_visible === visible) return;
  _visible = visible;
  _listeners.forEach((cb) => cb());
};

export const useStickyBarVisible = (): boolean =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);