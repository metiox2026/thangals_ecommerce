import React from 'react';
import { WishlistContents } from './WishlistContents';

export const metadata = {
  title: 'Wishlist — Thangals',
  description: 'Pieces you have saved for later.',
};

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-12 pt-0 sm:px-6 lg:px-10">
      <WishlistContents />
    </div>
  );
}
