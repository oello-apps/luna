import type { Metadata, Viewport } from 'next';
import { DM_Sans, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { AppFooter } from '@/components/AppFooter';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

export const viewport: Viewport = {
  themeColor: '#FDF8F9',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Lune — Cycle & Period Tracker',
  description:
    'Privacy-first menstrual cycle predictor with up to 5 period dates, ovulation, fertile window, and PMS estimates.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Lune',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Lune — Cycle & Period Tracker',
    description:
      'Privacy-first menstrual cycle predictor with up to 5 period dates, ovulation, fertile window, and PMS estimates.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lune — Cycle & Period Tracker',
    description:
      'Privacy-first menstrual cycle predictor with up to 5 period dates, ovulation, fertile window, and PMS estimates.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body
        className="flex min-h-screen flex-col bg-[#FDF8F9] text-zinc-900 font-sans antialiased selection:bg-rose-100 selection:text-rose-900"
        suppressHydrationWarning
      >
        <div className="flex-1 flex flex-col">{children}</div>
        <AppFooter />
        <MobileBottomNav />
        <OfflineIndicator />
      </body>
    </html>
  );
}
