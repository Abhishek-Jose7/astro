import { Cinzel, Cormorant_Garamond, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400'],
});

export const metadata = {
  title: 'Celestia Oracle — Birth Chart & Astrology Reading',
  description: 'Cast your natal chart with the stars. Discover Sun, Moon, and Rising sign readings, planetary alignments, house placements, aspects, elemental balance, and numerology — all from your exact birth moment.',
  keywords: 'astrology, birth chart, natal chart, zodiac, horoscope, celestial reading, numerology',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
