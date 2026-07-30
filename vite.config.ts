import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import netlify from '@netlify/vite-plugin'

const isGitHubPages = process.env.GITHUB_PAGES === 'true'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages sirve el sitio en /Ulpan/; Netlify / local usan la raíz.
  base: isGitHubPages ? '/Ulpan/' : '/',
  plugins: [react(), ...(isGitHubPages ? [] : [netlify()])],
})
