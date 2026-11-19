import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Lune Cycle Tracker',
    short_name: 'Lune',
    description:
      'Privacy-first menstrual cycle predictor with up to 5 period dates, ovulation, fertile window, and PMS estimates.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#FDF8F9',
    theme_color: '#FDF8F9',
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
