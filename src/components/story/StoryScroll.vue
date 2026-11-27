<script setup>
// Récit au défilement : la scène 3D reste fixe derrière, les chapitres défilent devant.
// Chapitre 0 = accueil, 1 à 4 = projets (ordre chronologique), 5 = suite.
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import ScreenFrame from '../ScreenFrame.vue'
import { asset } from '../../data/asset'
import { profile } from '../../data/profile'
import { featuredProjects, otherProjects } from '../../data/projects'

const router = useRouter()
const chapters = [...featuredProjects].sort((a, b) => a.start.localeCompare(b.start))

const root = ref(null)
const canvas = ref(null)
const steps = ref([])
const progress = ref(0)
const ready = ref(false)
const static3d = ref(false) // pas de WebGL ou mouvement réduit : récit sans 3D
const hovered = ref(null)
let scene = null
let observer

const chapter = computed(() => Math.round(progress.value))
const inProjects = computed(() => chapter.value >= 1 && chapter.value <= chapters.length)
const hoveredProject = computed(() => chapters.find((p) => p.slug === hovered.value))
const firstShot = (p) => p.shots.find((s) => s.src) ?? p.shots[0]

// WebGL2 avec une vraie carte graphique : en rendu logiciel, la 3D ramerait et bloquerait la page
function canRender3d() {
  const gl = document.createElement('canvas').getContext('webgl2', { failIfMajorPerformanceCaveat: true })
  if (!gl) return false
  const info = gl.getExtension('WEBGL_debug_renderer_info')
  const name = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER))
  gl.getExtension('WEBGL_lose_context')?.loseContext()
  return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(name)
}
// attend la fin du chargement puis un moment libre (Safari n'a pas requestIdleCallback)
async function pageIdle() {
  if (document.readyState !== 'complete') await new Promise((r) => window.addEventListener('load', r, { once: true }))
  await new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(r, { timeout: 1500 }) : setTimeout(r, 200)))
}

function onScroll() {
  // p vaut exactement i quand le centre du chapitre i est au milieu de l'écran
  const mid = window.innerHeight * 0.5
  const centers = steps.value.map((el) => {
    const r = el.getBoundingClientRect()
    return r.top + r.height / 2
  })
  let p = 0
  for (let i = 0; i < centers.length - 1; i++) {
    if (mid >= centers[i]) p = i + Math.min(1, (mid - centers[i]) / (centers[i + 1] - centers[i]))
  }
  progress.value = p
  scene?.setProgress(p)
}
function onPointer(e) {
  scene?.setMouse((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1))
}
function onClick(e) {
  // seuls les clics hors des panneaux atteignent la scène
  if (e.target.closest('.panel, a, button')) return
  scene?.click()
}
function onResize() {
  scene?.resize()
  onScroll()
}

onMounted(async () => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
  requestAnimationFrame(() => root.value && onScroll())

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || !canRender3d()) {
    static3d.value = true
    return
  }
  // le texte d'abord : la 3D attend que la page soit chargée et le navigateur disponible
  await pageIdle()
  const { createStoryScene } = await import('./objectScene.js')
  if (!canvas.value) return
  const created = await createStoryScene(canvas.value, {
    reducedMotion: reduced,
    chapters,
    onHover: (slug) => (hovered.value = slug),
    onSelect: (slug) => router.push(`/projets/${slug}`),
  })
  // le visiteur a pu changer de page pendant la préparation
  if (!root.value) return created.dispose()
  scene = created
  scene.setProgress(progress.value)
  ready.value = true
  window.addEventListener('pointermove', onPointer, { passive: true })
  root.value.addEventListener('click', onClick)
  observer = new IntersectionObserver(([e]) => (e.isIntersecting ? scene.resume() : scene.pause()))
  observer.observe(root.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('pointermove', onPointer)
  observer?.disconnect()
  scene?.dispose()
})
</script>

<template>
  <section ref="root" class="story" :class="{ 'is-static': static3d }" aria-label="Mon parcours, projet par projet">
    <div class="story__stage" aria-hidden="true">
      <canvas ref="canvas" class="story__canvas" :class="{ 'is-ready': ready }"></canvas>

      <!-- repère de chapitre -->
      <div class="story__counter" :class="{ 'is-shown': inProjects && ready }">
        <span class="story__num">{{ String(Math.min(chapter, chapters.length)).padStart(2, '0') }}</span>
        <span class="muted"> / {{ String(chapters.length).padStart(2, '0') }}</span>
        <span class="story__track"><span class="story__fill" :style="{ transform: `scaleX(${Math.min(1, Math.max(0, (progress - 0.5) / chapters.length))})` }"></span></span>
      </div>
      <p class="story__hover" :class="{ 'is-shown': hoveredProject }">
        <template v-if="hoveredProject">{{ hoveredProject.label }} · cliquer pour ouvrir</template>
      </p>
    </div>

    <!-- 0. Accueil -->
    <div :ref="(el) => (steps[0] = el)" class="step step--hero">
      <div class="hero">
        <h1 class="hero__name">{{ profile.name }}</h1>
        <p class="hero__claim">Développeur data, BI et IA.</p>
        <p class="hero__intro">Étudiant en 3<sup>e</sup> année de BUT Informatique à Belfort.<br />J’ai construit des flux de données à l’université et des applications en équipe.</p>
        <p class="hero__hint">Faites défiler pour découvrir mon parcours, projet par projet.</p>
      </div>
      <!-- sans 3D : une photo de l'ordinateur en particules prend sa place -->
      <img v-if="static3d" class="hero__poster" :src="asset('img/accueil-ordinateur.webp')" alt="" width="1050" height="770" />
    </div>

    <!-- 1 à 4. Projets -->
    <div
      v-for="(p, i) in chapters"
      :key="p.slug"
      :ref="(el) => (steps[i + 1] = el)"
      :id="i === 0 ? 'projets' : undefined"
      class="step"
      :class="i % 2 === 0 ? 'step--left' : 'step--right'"
    >
      <article class="panel" :aria-labelledby="`ch-${p.slug}`">
        <p class="kicker">Projet {{ i + 1 }} sur {{ chapters.length }} · {{ p.period }}</p>
        <h2 :id="`ch-${p.slug}`" class="panel__title">{{ p.label }}</h2>
        <p class="panel__ctx"><span class="chip">{{ p.frame }}</span><span class="chip">{{ p.team }}</span></p>
        <p class="panel__short">{{ p.short }}</p>
        <ul class="panel__points points">
          <li v-for="h in p.highlights" :key="h">{{ h }}</li>
        </ul>
        <ScreenFrame :shot="firstShot(p)" :caption="false" sizes="(max-width: 760px) 92vw, 430px" class="panel__frame" />
        <RouterLink :to="`/projets/${p.slug}`" class="btn panel__cta">Voir le projet en détail</RouterLink>
      </article>
    </div>

    <!-- 5. Suite -->
    <div :ref="(el) => (steps[chapters.length + 1] = el)" class="step step--end">
      <!-- les petits projets, juste avant la conclusion du récit -->
      <div class="others">
        <p class="kicker">Aussi réalisé</p>
        <ul class="others__list">
          <li v-for="p in otherProjects" :key="p.slug" class="card">
            <ScreenFrame v-if="p.thumb" :shot="p.thumb" :caption="false" sizes="(max-width: 760px) 92vw, 380px" class="others__shot" />
            <h3 class="others__title">{{ p.title }}</h3>
            <p class="muted small">{{ p.frame }} · {{ p.period }}</p>
            <p class="others__short">{{ p.short }}</p>
            <a v-for="l in p.links" :key="l.url" :href="l.url" target="_blank" rel="noopener" class="small">
              {{ l.label }}<span class="sr-only"> : {{ p.title }} (nouvel onglet)</span>
            </a>
          </li>
        </ul>
      </div>
      <div class="end">
        <h2 class="end__title">Et la suite&nbsp;?</h2>
        <p class="end__text muted">Après le BUT, je veux poursuivre mes études en data et en IA, en master ou en école d’ingénieurs.</p>
        <p class="end__links">
          <a href="#contact" class="btn">Me contacter</a>
          <a :href="profile.cv" download class="btn btn--ghost">Télécharger mon CV (PDF)</a>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.story {
  position: relative;
  /* rien ne doit élargir la page (panneaux qui glissent) ; « clip » ne crée pas de zone de défilement,
     donc la scène reste bien fixée (sticky) pendant le récit */
  overflow-x: clip;
}
.story__stage {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  pointer-events: none;
}
.story__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1.4s ease;
  pointer-events: auto;
}
.story__canvas.is-ready { opacity: 1; }

.story__counter {
  white-space: nowrap;
  position: absolute;
  left: var(--gutter);
  bottom: 28px;
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-family: var(--font-display);
  opacity: 0;
  transition: opacity 0.4s ease;
}
.story__counter.is-shown { opacity: 1; }
.story__num { font-size: 32px; line-height: 1; color: var(--accent); }
.story__track { position: relative; flex: 0 0 180px; height: 2px; margin-left: 16px; background: var(--line); align-self: center; }
.story__fill { position: absolute; inset: 0; background: var(--accent); transform-origin: left; }

.story__hover {
  position: absolute;
  right: var(--gutter);
  bottom: 28px;
  font-size: 15px;
  color: var(--muted);
  opacity: 0;
  transition: opacity 0.2s ease;
}
.story__hover.is-shown { opacity: 1; }

/* Les chapitres laissent passer la souris vers la 3D, sauf leurs panneaux */
.step {
  position: relative;
  min-height: 135vh;
  display: flex;
  align-items: center;
  pointer-events: none;
  padding: 12vh var(--gutter);
}
.step--left { justify-content: flex-start; }
.step--right { justify-content: flex-end; }

/* Accueil */
/* Le premier chapitre remonte sous la scène fixe (la marge négative est ici, pas sur la scène :
   sinon la scène « collerait » au-delà de la fin du récit) */
.step--hero {
  min-height: 115vh;
  align-items: flex-start;
  justify-content: space-between;
  gap: 48px;
  padding-top: calc(var(--header-h) + 9vh);
  margin-top: -100vh;
  margin-top: -100svh;
}
.hero { max-width: 40rem; }

.hero__name { font-size: clamp(48px, 8.5vw, 136px); line-height: 0.92; letter-spacing: -0.03em; }
.hero__claim { margin-top: 28px; font-size: clamp(20px, 2vw, 28px); line-height: 1.35; max-width: 28ch; }
.hero__intro { margin-top: 18px; color: var(--muted); }
.hero__hint { margin-top: 40px; font-size: 15px; color: var(--accent); }

/* Panneau d'un chapitre : une carte, lue de haut en bas */
.panel {
  pointer-events: auto;
  width: min(100%, 30rem);
  background: var(--surface);
  border: 1px solid var(--line);
  border-top: 2px solid var(--accent);
  padding: 26px 26px 28px;
}
.panel .kicker { margin-bottom: 10px; }
.panel__title { font-size: clamp(30px, 3.2vw, 46px); line-height: 1; }
.panel__ctx { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 8px; }
.panel__short { margin-top: 16px; color: var(--muted); }
.panel__points { margin-top: 16px; font-size: 16px; }
.panel__frame { margin-top: 20px; }
.panel__cta { margin-top: 22px; }

/* Fin */
.step--end { flex-direction: column; justify-content: center; gap: clamp(120px, 22vh, 220px); min-height: 150vh; }
.others { pointer-events: auto; width: min(100%, var(--max)); }
.others__list { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
.others__list .card { display: flex; flex-direction: column; gap: 6px; }
.others__title { font-size: 18px; }
.others__shot { margin-bottom: 8px; }
.others__short { font-size: 15px; margin: 4px 0; }
.end {
  text-align: center;
  pointer-events: auto;
  background: var(--bg);
  padding: 36px 32px;
}
.end__title { font-size: clamp(40px, 6vw, 88px); line-height: 0.95; }
.end__text { margin-top: 16px; }
.end__links { margin-top: 28px; display: flex; gap: 14px; justify-content: center; align-items: center; flex-wrap: wrap; }

/* Effet au défilement : le panneau glisse et se pose ; l'accueil s'efface en remontant
   (--p : voir src/scrollFx.js) */
.fx .panel,
.fx .end {
  opacity: var(--p, 1);
  transform: translate(calc((1 - var(--p, 1)) * -60px), calc((1 - var(--p, 1)) * 40px));
}
.fx .step--right .panel { transform: translate(calc((1 - var(--p, 1)) * 60px), calc((1 - var(--p, 1)) * 40px)); }
.fx .hero {
  opacity: calc(1 - var(--p, 0));
  transform: translateY(calc(var(--p, 0) * -80px));
}

/* Sans 3D : récit empilé, sans écran fixe */
.story.is-static .story__stage { display: none; }
/* texte toujours bien contrasté quand la version sans 3D montre déjà le premier projet */
.fx .story.is-static .panel { opacity: 1; transform: none; }
.story.is-static .step { min-height: 0; padding-top: 48px; padding-bottom: 48px; }
.story.is-static .step--hero { min-height: 80vh; margin-top: 0; padding-top: calc(var(--header-h) + 48px); }
.hero__poster {
  flex: 0 1 660px;
  min-width: 0;
  height: auto;
  align-self: center;
}

@media (max-width: 760px) {
  /* Téléphone : l'objet 3D occupe le haut de l'écran, le texte le bas */
  .step { min-height: 105vh; align-items: flex-end; padding: 0 16px 6vh; }
  .step--left, .step--right { justify-content: center; }

  /* accueil : le texte se cale en bas du premier écran, sous l'ordinateur */
  .step--hero { min-height: 100vh; min-height: 100svh; align-items: flex-end; padding: 0 16px 9vh; }
  .story.is-static .step--hero { flex-direction: column; justify-content: flex-end; align-items: flex-start; gap: 16px; padding-top: calc(var(--header-h) + 16px); }
  .hero__poster { order: -1; flex: none; width: min(78%, 300px); }
  .hero__name { font-size: clamp(44px, 13vw, 64px); }
  .hero__claim { margin-top: 16px; font-size: 19px; }
  .hero__intro { margin-top: 12px; font-size: 15px; }
  .hero__hint { margin-top: 20px; font-size: 14px; }

  /* panneau court : le détail complet est sur la page projet */
  .panel { width: 100%; padding: 18px 16px 18px; }
  .panel .kicker { font-size: 13px; margin-bottom: 6px; }
  .panel__title { font-size: 28px; }
  .panel__ctx { margin-top: 10px; gap: 6px; }
  .panel__ctx .chip { font-size: 12px; padding: 3px 8px; }
  .panel__short {
    margin-top: 10px;
    font-size: 15px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .panel__points, .panel__frame { display: none; }
  /* sur téléphone, le panneau monte simplement : pas de glissement latéral */
  .fx .panel,
  .fx .step--right .panel { transform: translateY(calc((1 - var(--p, 1)) * 40px)); }
  .panel__cta { margin-top: 14px; width: 100%; justify-content: center; }

  .story__hover { display: none; }
  .story__counter { bottom: auto; top: calc(var(--header-h) + 12px); left: 16px; }
  .story__num { font-size: 24px; }
  .story__track { flex-basis: 100px; }

  .step--end { min-height: 0; gap: 96px; padding: 12vh 16px 10vh; }
  .end { padding: 0; }
  .end__title { font-size: 40px; }
  .end__links { flex-direction: column; align-items: stretch; }
  .end__links .btn { justify-content: center; }
}
</style>
