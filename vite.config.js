import { copyFileSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages ne connaît que des fichiers : on copie index.html pour chaque page du site,
// pour que les liens directs (/projets/gp-explorer…) répondent 200.
// 404.html prend le relais pour les adresses inconnues (la page « introuvable » du site s'affiche).
function staticPages() {
  const slugs = (file) => [...readFileSync(file, 'utf8').matchAll(/^\s+slug: '([^']+)'/gm)].map((m) => m[1])
  return {
    name: 'static-pages',
    apply: 'build',
    closeBundle() {
      const pages = [
        '404',
        ...slugs('src/data/projects.js').map((s) => `projets/${s}`),
      ]
      for (const p of pages) {
        mkdirSync(dirname(`dist/${p}.html`), { recursive: true })
        copyFileSync('dist/index.html', `dist/${p}.html`)
      }
    },
  }
}

// en ligne : https://antoinezz25.github.io/portfolio/ ; en local : http://localhost:5173/
export default defineConfig(({ command, isPreview }) => ({
  plugins: [vue(), staticPages()],
  base: command === 'build' || isPreview ? '/portfolio/' : '/',
}))
