import { copyFileSync, cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'

rmSync('assets', { recursive: true, force: true })
mkdirSync('assets', { recursive: true })
cpSync('dist/assets', 'assets', { recursive: true })
copyFileSync('dist/index.html', 'index.html')
copyFileSync('dist/index.html', '404.html')
copyFileSync('dist/favicon.svg', 'favicon.svg')
copyFileSync('dist/manifest.webmanifest', 'manifest.webmanifest')
writeFileSync('.nojekyll', '')

rmSync('docs', { recursive: true, force: true })
mkdirSync('docs', { recursive: true })
cpSync('dist', 'docs', { recursive: true })
copyFileSync('docs/index.html', 'docs/404.html')
writeFileSync('docs/.nojekyll', '')

console.log('Synced GitHub Pages files to repo root and docs/')
