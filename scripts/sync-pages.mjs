import { copyFileSync, cpSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

rmSync('assets', { recursive: true, force: true })
mkdirSync('assets', { recursive: true })
cpSync('dist/assets', 'assets', { recursive: true })
copyFileSync('dist/index.html', 'index.html')
copyFileSync('dist/index.html', '404.html')
copyFileSync('dist/favicon.svg', 'favicon.svg')

// Manifest + service worker (PWA) en la raíz de GitHub Pages
for (const name of readdirSync('dist')) {
  if (
    name === 'manifest.webmanifest' ||
    name === 'sw.js' ||
    name === 'registerSW.js' ||
    name.startsWith('workbox-')
  ) {
    copyFileSync(join('dist', name), name)
  }
}

// Iconos PWA
rmSync('icons', { recursive: true, force: true })
cpSync('dist/icons', 'icons', { recursive: true })

// Ilustraciones Maggie (public/images → raíz Pages)
rmSync('images', { recursive: true, force: true })
cpSync('dist/images', 'images', { recursive: true })

writeFileSync('.nojekyll', '')

rmSync('docs', { recursive: true, force: true })
mkdirSync('docs', { recursive: true })
cpSync('dist', 'docs', { recursive: true })
copyFileSync('docs/index.html', 'docs/404.html')
writeFileSync('docs/.nojekyll', '')

console.log('Synced GitHub Pages files to repo root and docs/')
