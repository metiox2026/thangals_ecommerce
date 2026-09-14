'use client';

import { useEffect, useState } from 'react';

interface Options {
  words: string[];
  prefix?: string;
  typeMs?: number;
  holdMs?: number;
  eraseMs?: number;
  pauseMs?: number;
}

export function useTypewriterPlaceholder({
  words,
  prefix = '',
  typeMs = 90,
  holdMs = 1100,
  eraseMs = 45,
  pauseMs = 350,
}: Options): string {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'holding' | 'erasing'>('typing');

  useEffect(() => {
    if (words.length === 0) return;
    const current = words[index];
    let timer: number;

    if (phase === 'typing') {
      if (text.length < current.length) {
        timer = window.setTimeout(() => {
          setText(current.slice(0, text.length + 1));
        }, typeMs);
      } else {
        timer = window.setTimeout(() => setPhase('holding'), 0);
      }
    } else if (phase === 'holding') {
      timer = window.setTimeout(() => {
        setPhase('erasing');
      }, holdMs);
    } else {
      if (text.length > 0) {
        timer = window.setTimeout(() => {
          setText(current.slice(0, text.length - 1));
        }, eraseMs);
      } else {
        timer = window.setTimeout(() => {
          setIndex((i) => (i + 1) % words.length);
          setPhase('typing');
        }, pauseMs);
      }
    }

    return () => window.clearTimeout(timer);
  }, [words, index, text, phase, typeMs, holdMs, eraseMs, pauseMs]);

  return `${prefix}${text}`;
}
