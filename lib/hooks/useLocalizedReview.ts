'use client';

import { useMemo } from 'react';
import { Review } from '@/lib/api';
import { arReviews } from '@/lib/translations/reviews';
import { useLanguage } from '@/contexts/LanguageContext';

export function useLocalizedReview(review: Review): Review {
  const { lang } = useLanguage();

  return useMemo(() => {
    if (lang !== 'AR') return review;
    const ar = arReviews[review.id];
    if (!ar) return review;
    return {
      ...review,
      author: ar.author,
      location: ar.location,
      date: ar.date,
      title: ar.title ?? review.title,
      text: ar.text,
    };
  }, [review, lang]);
}
