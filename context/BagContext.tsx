'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface BagItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  currency: string;
  image: string;
  quantity: number;
  size?: string | null;
}

interface BagContextType {
  items: BagItem[];
  isOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
  toggleBag: () => void;
  addItem: (item: Omit<BagItem, 'quantity'>) => void;
  removeItem: (id: string, size?: string | null) => void;
  updateQuantity: (id: string, size: string | null | undefined, delta: number) => void;
  setItemSize: (
    id: string,
    currentSize: string | null | undefined,
    nextSize: string,
    nextPrice?: number,
  ) => void;
  totalPrice: number;
  totalCount: number;
}

const BagContext = createContext<BagContextType | undefined>(undefined);

function sameSize(a: string | null | undefined, b: string | null | undefined): boolean {
  return (a ?? null) === (b ?? null);
}

export const BagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<BagItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('thangals_bag');
      if (stored) setItems(JSON.parse(stored));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('thangals_bag', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const openBag = () => setIsOpen(true);
  const closeBag = () => setIsOpen(false);
  const toggleBag = () => setIsOpen((prev) => !prev);

  const addItem = (newItem: Omit<BagItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.id === newItem.id && sameSize(i.size, newItem.size),
      );
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id && sameSize(i.size, newItem.size)
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (id: string, size?: string | null) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && sameSize(i.size, size))));
  };

  const updateQuantity = (
    id: string,
    size: string | null | undefined,
    delta: number,
  ) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.id === id && sameSize(i.size, size)) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as BagItem[],
    );
  };

  const setItemSize = (
    id: string,
    currentSize: string | null | undefined,
    nextSize: string,
    nextPrice?: number,
  ) => {
    setItems((prev) => {
      const collision = prev.find(
        (i) => i.id === id && sameSize(i.size, nextSize) && !sameSize(i.size, currentSize),
      );
      if (collision) {
        return prev
          .map((i) =>
            i.id === id && sameSize(i.size, currentSize)
              ? { ...i, quantity: i.quantity + collision.quantity }
              : i,
          )
          .filter((i) => !(i.id === id && sameSize(i.size, nextSize) && !sameSize(i.size, currentSize)));
      }
      return prev.map((i) =>
        i.id === id && sameSize(i.size, currentSize)
          ? { ...i, size: nextSize, ...(nextPrice !== undefined ? { price: nextPrice } : {}) }
          : i,
      );
    });
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BagContext.Provider
      value={{
        items,
        isOpen,
        openBag,
        closeBag,
        toggleBag,
        addItem,
        removeItem,
        updateQuantity,
        setItemSize,
        totalPrice,
        totalCount,
      }}
    >
      {children}
    </BagContext.Provider>
  );
};

export const useBag = () => {
  const context = useContext(BagContext);
  if (!context) throw new Error('useBag must be used within a BagProvider');
  return context;
};
