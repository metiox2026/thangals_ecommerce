'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { en } from '@/lib/translations/en';
import { ar } from '@/lib/translations/ar';

export type Language = 'EN' | 'AR';

interface LanguageContextValue {
  lang: Language;
  dir: 'ltr' | 'rtl';
  t: (key: string, params?: Record<string, string | number>) => string;
  setLang: (lang: Language) => void;
}

const dictionaries: Record<Language, Record<string, string>> = { EN: en, AR: ar };

const STORAGE_KEY = 'thangals.lang';

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('EN');
  const [hydrated, setHydrated] = useState(false);

  // Read persisted language once on mount.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'EN' || saved === 'AR') setLangState(saved);
    } catch {
      // localStorage may be blocked (privacy mode); fall back to EN.
    }
    setHydrated(true);
  }, []);

  // Sync html lang/dir + localStorage whenever the language changes.
  useEffect(() => {
    if (!hydrated) return;
    const dir = lang === 'AR' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang === 'AR' ? 'ar' : 'en';
    document.documentElement.dir = dir;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang, hydrated]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = dictionaries[lang];
      let str = dict[key] ?? en[key] ?? key;
      if (params) {
        const locale = lang === 'AR' ? 'ar-AE-u-nu-arab' : 'en-US';
        for (const [k, v] of Object.entries(params)) {
          const formatted = typeof v === 'number' ? v.toLocaleString(locale) : String(v);
          str = str.replace(new RegExp(`{${k}}`, 'g'), formatted);
        }
      }
      return str;
    },
    [lang],
  );

  const setLang = useCallback((next: Language) => setLangState(next), []);

  const value: LanguageContextValue = {
    lang,
    dir: lang === 'AR' ? 'rtl' : 'ltr',
    t,
    setLang,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
