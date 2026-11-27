<script setup>
import { computed } from 'vue'

// Cadre de capture d'écran.
// - `shot.src`  : image présente → elle s'affiche (clic pour agrandir si `zoomable`).
// - `shot.w`    : largeur de l'image ; une version « -720.webp » existe alors pour les petits cadres.
// - `shot.file` : emplacement vide → en local, le cadre indique le fichier à déposer ;
//                 sur le site publié, il est masqué.
const props = defineProps({
  shot: { type: Object, required: true },
  zoomable: { type: Boolean, default: false },
  caption: { type: Boolean, default: true },
  sizes: { type: String, default: '(max-width: 760px) 100vw, 1024px' }, // largeur affichée du cadre
})
const emit = defineEmits(['zoom'])
const srcset = computed(() => props.shot.w && `${props.shot.src.replace('.webp', '-720.webp')} 720w, ${props.shot.src} ${props.shot.w}w`)
const isDev = import.meta.env.DEV
const publicPath = (f) => `public${f}`
</script>

<template>
  <figure v-if="props.shot.src || isDev" class="frame">
    <div class="frame__screen">
      <button v-if="props.shot.src && props.zoomable" class="frame__btn" @click="emit('zoom', props.shot)">
        <img :src="props.shot.src" :srcset="srcset" :sizes="srcset && props.sizes" :alt="props.shot.alt" loading="lazy" width="1600" height="1000" />
        <span class="sr-only">Agrandir l’image</span>
      </button>
      <img v-else-if="props.shot.src" :src="props.shot.src" :srcset="srcset" :sizes="srcset && props.sizes" :alt="props.shot.alt" loading="lazy" width="1600" height="1000" />
      <div v-else class="frame__empty">
        <p class="frame__label">Capture à ajouter</p>
        <p class="small">Dépose l’image ici :<br /><code>{{ publicPath(props.shot.file) }}</code></p>
        <p class="small muted">WebP ou PNG, 1600 px de large, format 16:10. Ce cadre est masqué sur le site publié tant que l’image manque.</p>
      </div>
    </div>
    <figcaption v-if="props.caption && props.shot.caption" class="frame__cap muted small">{{ props.shot.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.frame { margin: 0; }
.frame__screen {
  aspect-ratio: 16 / 10;
  border: 1px solid var(--line);
  background: var(--surface-2);
  overflow: hidden;
}
.frame__screen img,
.frame__btn { display: block; width: 100%; height: 100%; }
.frame__screen img { object-fit: cover; object-position: top left; }
.frame__btn { padding: 0; border: 0; background: none; cursor: zoom-in; }
.frame__empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  font-size: 15px;
}
.frame__empty code { font-family: var(--font-display); color: var(--accent); word-break: break-all; }
.frame__label { font-family: var(--font-display); font-size: 17px; }
.frame__cap { margin-top: 8px; }

/* Effet au défilement : le cadre se redresse en entrant dans l'écran (--p : voir src/scrollFx.js) */
.fx .frame__screen {
  transform-origin: 50% 100%;
  transform: perspective(900px) rotateX(calc((1 - var(--p, 1)) * 24deg)) scale(calc(0.9 + 0.1 * var(--p, 1)));
  opacity: calc(0.2 + 0.8 * var(--p, 1));
}
</style>
