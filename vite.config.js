import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Réservations des produits',
        short_name: 'TED',
        description: 'TRADING EXPRESSIONS DISTRIBUTION/produits',
        theme_color: '#000000',
        icons: [
          {
            src: '/logo.png', // Chemin relatif depuis le dossier public
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo.png', // Chemin relatif depuis le dossier public
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff'
      }
    })
  ]
});
