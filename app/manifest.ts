import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Road2Abs',
    short_name: 'road2abs',
    description: 'Personal high-protein meal assistant for Swiss supermarkets.',
    start_url: '/today',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f7f6f3',
    theme_color: '#3a6235',
    categories: ['food', 'health', 'fitness'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
