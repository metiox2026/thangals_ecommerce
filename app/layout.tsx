import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { BagProvider } from '@/context/BagContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BagDrawer } from '@/components/BagDrawer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { GoldRateButton } from '@/components/GoldRateButton';
import { PageScroll } from '@/components/PageScroll';

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
