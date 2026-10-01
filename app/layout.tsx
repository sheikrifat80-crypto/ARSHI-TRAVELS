import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Arshi Travels | Premium International Tour Operator',
  description:
    'Book flights, tour packages, Hajj & Umrah with Arshi Travels — Bangladesh\'s trusted international tour operator. Best prices on domestic & international travel.',
  keywords: [
    'Arshi Travels',
    'Bangladesh tour operator',
    'flight booking',
    'tour packages',
    'Hajj packages',
    'Umrah packages',
    'Cox\'s Bazar tours',
    'international travel',
  ],
  openGraph: {
    title: 'Arshi Travels | Premium International Tour Operator',
    description:
      'Book flights, tour packages, Hajj & Umrah with Arshi Travels — Bangladesh\'s trusted international tour operator.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Arshi Travels',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arshi Travels | Premium International Tour Operator',
    description:
      'Book flights, tour packages, Hajj & Umrah with Arshi Travels.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
