import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Amiri, Tajawal, Noto_Naskh_Arabic } from 'next/font/google';
import './globals.css';
import { BagProvider } from '@/context/BagContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BagDrawer } from '@/components/BagDrawer';
import { InitialLoader } from '@/components/InitialLoader';
import { PageScroll } from '@/components/PageScroll';
import { SearchBar } from '@/components/SearchBar';
import { WhatsAppButton } from '@/components/WhatsAppButton';

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

const amiri = Amiri({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-amiri',
  display: 'swap',
});

const tajawal = Tajawal({
  weight: ['400', '500', '700'],
  variable: '--font-tajawal',
  display: 'swap',
});

const cairo = Noto_Naskh_Arabic({
  weight: ['400', '500', '700'],
  variable: '--font-noto-naskh',
  display: 'block',
});

export const metadata: Metadata = {
  title: 'Thangals — Gold, Diamond & Emerald Jewellery in Dubai',
  description: 'Hallmarked gold, diamond and emerald jewellery, hand-finished in Dubai.',
};

export const viewport: Viewport = {
  themeColor: '#004237',
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
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${amiri.variable} ${tajawal.variable} ${cairo.variable} bg-[#004237]`} suppressHydrationWarning>
      <body className="bg-[#004237] text-[#1C1C1C] antialiased font-sans overflow-hidden">
        <LanguageProvider>
          <InitialLoader />
          <BagProvider>
            <WishlistProvider>
              <PageScroll>
                <Header />
                <div className="h-[72px] sm:h-[80px] md:h-[124px]" />
                <SearchBar />
                <main className="min-h-[70vh]">{children}</main>
                <Footer />
                <WhatsAppButton />
              </PageScroll>
              <BagDrawer />
            </WishlistProvider>
          </BagProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
