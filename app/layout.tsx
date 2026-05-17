import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Kamai — AI-Powered Financial Stability for India\'s Flexible Workforce',
  description: 'Kamai is an AI-powered financial stability platform helping India\'s flexible workforce predict income, manage spending, build creditworthiness, and achieve long-term financial growth.',
  keywords: 'fintech, gig workers, freelancers, income prediction, credit building, financial stability, India, AI finance',
  openGraph: {
    title: 'Kamai — Financial Stability for India\'s Gig Economy',
    description: 'Predict income. Control spending. Build credit. Achieve financial growth.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
