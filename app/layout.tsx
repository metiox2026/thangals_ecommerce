import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';
import { BagProvider } from '@/context/BagContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BagDrawer } from '@/components/BagDrawer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { GoldRateButton } from '@/components/GoldRateButton';
import { PageScroll } from '@/components/PageScroll';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jost',
});

export const metadata: Metadata = {
  title: 'Thangals — Gold, Diamond & Emerald Jewellery in Dubai',
  description: 'Hallmarked gold, diamond and emerald jewellery, hand-finished in Dubai.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="bg-white text-[#1C1C1C] antialiased font-sans overflow-hidden">
        <BagProvider>
          <PageScroll>
            <Header />
            <div className="h-[115px]" />
            <main className="min-h-[70vh]">{children}</main>
            <Footer />
          </PageScroll>
          <BagDrawer />
          <WhatsAppButton />
          <GoldRateButton />
        </BagProvider>
      </body>
    </html>
  );
}
