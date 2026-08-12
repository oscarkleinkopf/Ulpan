import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import netlify from '@netlify/vite-plugin'
import { VitePWA } from 'vite-plugin-pwa'

const isGitHubPages = process.env.GITHUB_PAGES === 'true'
const base = isGitHubPages ? '/Ulpan/' : '/'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages sirve el sitio en /Ulpan/; Netlify / local usan la raíz.
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'icons/icon-192.png',
        'icons/icon-512.png',
        'icons/icon-512-maskable.png',
        'icons/apple-touch-icon.png',
      ],
      manifest: {
        name: 'Ulpan con la Mora Maggie',
        short_name: 'Ulpan Maggie',
        description:
          'Aprende hebreo desde cero con la Mora Maggie: alefato, vocabulario, gramática, tareas y práctica.',
        lang: 'es',
        dir: 'ltr',
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#e7eef0',
        theme_color: '#1a3a32',
        categories: ['education'],
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: isGitHubPages ? '/Ulpan/index.html' : '/index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,webp,webmanifest,ico,woff2}'],
      },
      devOptions: {
        enabled: false,
      },
    }),
    ...(isGitHubPages ? [] : [netlify()]),
  ],
})
