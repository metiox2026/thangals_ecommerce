'use client';

import React, { createContext, useContext } from 'react';

interface ScrollContextType {
  scrollY: number;
}

const ScrollContext = createContext<ScrollContextType>({ scrollY: 0 });

export const ScrollProvider: React.FC<{ value: ScrollContextType; children: React.ReactNode }> = ({
  value,
  children,
}) => {
  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
};

export const usePageScroll = () => useContext(ScrollContext);