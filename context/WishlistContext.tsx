'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/api';

interface WishlistContextType {
  items: Product[];
  isWished: (id: string) => boolean;
  toggleItem: (product: Product) => void;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  totalCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('thangals_wishlist');
      if (stored) setItems(JSON.parse(stored));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('thangals_wishlist', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const isWished = (id: string) => items.some((i) => i.id === id);

  const addItem = (product: Product) => {
    setItems((prev) => (prev.some((i) => i.id === product.id) ? prev : [...prev, product]));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleItem = (product: Product) => {
    setItems((prev) =>
      prev.some((i) => i.id === product.id)
        ? prev.filter((i) => i.id !== product.id)
        : [...prev, product],
    );
  };

  const clearAll = () => setItems([]);

  const totalCount = items.length;

  return (
    <WishlistContext.Provider
      value={{ items, isWished, toggleItem, addItem, removeItem, clearAll, totalCount }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
