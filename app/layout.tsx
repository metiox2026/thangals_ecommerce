import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { BagProvider } from '@/context/BagContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BagDrawer } from '@/components/BagDrawer';
import { InitialLoader } from '@/components/InitialLoader';
import { PageScroll } from '@/components/PageScroll';
import { SearchBar } from '@/components/SearchBar';

const cormorant = localFont({
  src: './fonts/CormorantGaramond-VariableFont_wght.woff2',
  variable: '--font-cormorant',
  display: 'swap',
  weight: '300 700',
});

const jost = localFont({
  src: './fonts/Jost-VariableFont_wght.woff2',
  variable: '--font-jost',
  display: 'swap',
  weight: '300 600',
});

export const metadata: Metadata = {
  title: 'Thangals — Gold, Diamond & Emerald Jewellery in Dubai',
  description: 'Hallmarked gold, diamond and emerald jewellery, hand-finished in Dubai.',
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`} suppressHydrationWarning>
      <body className="bg-white text-[#1C1C1C] antialiased font-sans overflow-hidden">
        <InitialLoader />
        <BagProvider>
          <WishlistProvider>
            <PageScroll>
              <Header />
              <div className="h-[75px] md:h-[115px]" />
              <SearchBar />
              <main className="min-h-[70vh]">{children}</main>
              <Footer />
            </PageScroll>
            <BagDrawer />
          </WishlistProvider>
        </BagProvider>
      </body>
    </html>
  );
}
