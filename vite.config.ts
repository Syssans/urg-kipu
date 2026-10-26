import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// `vite build --mode native` makes the bundle for the iOS app (Capacitor):
// relative paths, and no service worker since the files ship inside the app.
export default defineConfig(({ mode }) => {
  const native = mode === 'native'
  const base = native ? './' : '/urg-kipu/'
  return {
  base,
  build: native ? { outDir: 'dist-native' } : undefined,
  plugins: [
    react(),
    tailwindcss(),
    !native && VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'icons/icon.svg'],
      manifest: {
        name: 'Kipu — Aide-mémoire médecine d’urgence',
        short_name: 'Kipu',
        description: 'Calculateurs de scores, protocoles et arbres décisionnels pour la médecine d’urgence.',
        theme_color: '#0a0a0b',
        background_color: '#0a0a0b',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        lang: 'fr',
        icons: [
          { src: `${base}icons/icon-192.png`, sizes: '192x192', type: 'image/png' },
          { src: `${base}icons/icon-512.png`, sizes: '512x512', type: 'image/png' },
          { src: `${base}icons/maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: `${base}index.html`,
      },
    }),
  ],
}
})
