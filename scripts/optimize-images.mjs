// Convertit les captures de raw-images/ en WebP optimisés dans public/img/
import sharp from 'sharp'
import { readdir, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const SRC = 'raw-images'
const OUT = 'public/img'
const MAX_WIDTH = 1400

// raw-images/ reste sur le poste (hors dépôt) : les captures brutes peuvent contenir des données privées
for (const dir of existsSync(SRC) ? await readdir(SRC) : []) {
  await mkdir(path.join(OUT, dir), { recursive: true })
  for (const file of await readdir(path.join(SRC, dir))) {
    const name = file.replace(/\.(png|jpe?g)$/i, '')
    const isPhoto = dir === 'stage' && name === 'photo_pro'
    const img = sharp(path.join(SRC, dir, file)).rotate()
    await img
      .resize({ width: isPhoto ? 600 : MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: isPhoto ? 80 : 82 })
      .toFile(path.join(OUT, dir, `${name}.webp`))
    console.log(`${dir}/${name}.webp`)
  }
}

// Version 720 px des captures larges : chargée dans les petits cadres (voir `w` dans projects.js)
for (const entry of await readdir(OUT, { recursive: true })) {
  if (!entry.endsWith('.webp') || entry.endsWith('-720.webp') || entry.startsWith('accueil')) continue
  const file = path.join(OUT, entry)
  if ((await sharp(file).metadata()).width <= 1000) continue
  await sharp(file).resize({ width: 720 }).webp({ quality: 80 }).toFile(file.replace('.webp', '-720.webp'))
}
