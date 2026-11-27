<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import ScreenFrame from '../components/ScreenFrame.vue'
import NotFoundView from './NotFoundView.vue'
import { featuredProjects, findProject } from '../data/projects'

const route = useRoute()
const project = computed(() => findProject(route.params.slug))
const ordered = [...featuredProjects].sort((a, b) => a.start.localeCompare(b.start))
const index = computed(() => ordered.findIndex((p) => p.slug === route.params.slug))
const prev = computed(() => ordered[index.value - 1])
const next = computed(() => ordered[index.value + 1])
// les emplacements vides ne s'affichent qu'en local
const extraShots = computed(() => project.value.shots.slice(1).filter((s) => s.src || import.meta.env.DEV))

watchEffect(() => {
  if (project.value) document.title = `${project.value.title} — Antoine Duarte`
})

// Visionneuse d'image (élément <dialog> natif : gère Échap et le focus)
const dialog = ref(null)
const zoomed = ref(null)
function openImage(img) {
  zoomed.value = img
  dialog.value?.showModal()
}
</script>

<template>
  <NotFoundView v-if="!project" />
  <article v-else class="project container">
    <p class="crumbs"><RouterLink :to="{ path: '/', hash: '#projets' }" class="plain">← Tous les projets</RouterLink></p>

    <!-- 1. En-tête : ce que c'est, en une phrase -->
    <header class="head">
      <p class="kicker">{{ project.badge }} · {{ project.period }}</p>
      <h1 class="head__title">{{ project.title }}</h1>
      <p class="head__short">{{ project.short }}</p>
      <p class="chips head__chips">
        <span class="chip">{{ project.frame }}</span>
        <span class="chip">{{ project.team }}</span>
        <span class="chip">{{ project.org }}</span>
      </p>
    </header>

    <!-- 2. La capture principale -->
    <ScreenFrame :shot="project.shots[0]" zoomable class="hero-shot" @zoom="openImage" />

    <!-- 3. Le détail : à gauche ce que j'ai fait, à droite les repères techniques -->
    <div class="body">
      <div class="card main">
        <section aria-labelledby="h-obj">
          <h2 id="h-obj" class="block__title">Objectif</h2>
          <p>{{ project.intro }}</p>
        </section>

        <section aria-labelledby="h-fonct">
          <h2 id="h-fonct" class="block__title">Fonctionnalités principales</h2>
          <ul class="points">
            <li v-for="h in project.highlights" :key="h">{{ h }}</li>
          </ul>
        </section>

        <section aria-labelledby="h-role">
          <h2 id="h-role" class="block__title">Mon rôle</h2>
          <p>{{ project.role }}</p>
        </section>

        <section aria-labelledby="h-defis">
          <h2 id="h-defis" class="block__title">Défis et solutions</h2>
          <div v-for="(c, i) in project.challenges.slice(0, 2)" :key="i" class="challenge">
            <p class="challenge__pb"><span class="challenge__tag">Défi</span>{{ c.problem }}</p>
            <p><span class="challenge__tag challenge__tag--ok">Solution</span>{{ c.solution }}</p>
          </div>
        </section>
      </div>

      <aside class="side">
        <div class="card">
          <h2 class="card__title">Technologies</h2>
          <p class="chips">
            <span v-for="t in project.stack" :key="t" class="chip">{{ t }}</span>
          </p>
        </div>
        <div class="card">
          <h2 class="card__title">Liens</h2>
          <p v-for="l in project.links" :key="l.url">
            <a :href="l.url" target="_blank" rel="noopener">{{ l.label }}<span class="sr-only"> (nouvel onglet)</span></a>
          </p>
          <p v-if="project.privateRepo" class="muted small">Code dans un dépôt d’équipe privé. Démonstration possible sur demande.</p>
        </div>
      </aside>
    </div>

    <!-- 4. Les autres captures -->
    <section v-if="extraShots.length" class="shots-section" aria-labelledby="h-captures">
      <h2 id="h-captures" class="block__title">Captures</h2>
      <div class="shots">
        <ScreenFrame v-for="(shot, i) in extraShots" :key="i" :shot="shot" zoomable @zoom="openImage" />
      </div>
    </section>

    <nav class="pager" aria-label="Projet précédent et suivant">
      <RouterLink v-if="prev" :to="`/projets/${prev.slug}`" class="card plain pager__link">
        <span class="muted small">← Projet précédent</span><span class="pager__name">{{ prev.label }}</span>
      </RouterLink>
      <span v-else></span>
      <RouterLink v-if="next" :to="`/projets/${next.slug}`" class="card plain pager__link pager__next">
        <span class="muted small">Projet suivant →</span><span class="pager__name">{{ next.label }}</span>
      </RouterLink>
    </nav>

    <dialog ref="dialog" class="viewer" aria-label="Image agrandie" @click.self="dialog.close()">
      <figure v-if="zoomed">
        <img :src="zoomed.src" :alt="zoomed.alt" />
        <figcaption class="small muted">{{ zoomed.caption }}</figcaption>
      </figure>
      <button class="btn viewer__close" @click="dialog.close()">Fermer</button>
    </dialog>
  </article>
</template>

<style scoped>
.project { padding-top: calc(var(--header-h) + 32px); }
.crumbs { margin-bottom: 32px; color: var(--muted); }
.crumbs a:hover { color: var(--text); }

.head { max-width: 50rem; }
.head__title { font-size: clamp(32px, 4.6vw, 60px); }
.head__short { margin-top: 16px; font-size: 19px; color: var(--muted); }
.head__chips { margin-top: 20px; }
.hero-shot { margin: 36px 0 24px; }

.body { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 20px; align-items: start; }
@media (max-width: 920px) { .body { grid-template-columns: 1fr; } }
@media (max-width: 600px) {
  .main { padding: 20px 18px; gap: 24px; }
  .head__short { font-size: 17px; }
  .hero-shot { margin: 24px 0 16px; }
}
.main { padding: 32px; display: grid; gap: 30px; }
.block__title {
  font-size: 20px;
  margin-bottom: 10px;
  padding-left: 14px;
  border-left: 3px solid var(--accent);
  line-height: 1.2;
}
.challenge + .challenge { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--line); }
.challenge__pb { color: var(--muted); margin-bottom: 6px; }
.challenge__tag {
  display: inline-block;
  margin-right: 10px;
  padding: 1px 8px;
  font-size: 13px;
  font-weight: 600;
  background: var(--surface-2);
  color: var(--muted);
}
.challenge__tag--ok { background: rgb(91 116 255 / 18%); color: var(--accent); }

.side { display: grid; gap: 16px; position: sticky; top: calc(var(--header-h) + 20px); }
@media (max-width: 920px) { .side { position: static; } }

.shots-section { margin-top: 48px; }
.shots { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }

.pager { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 56px; }
.pager__link { display: flex; flex-direction: column; gap: 4px; transition: border-color 0.2s ease; }
.pager__link:hover { border-color: var(--accent); }
.pager__name { font-family: var(--font-display); font-size: 20px; }
.pager__next { text-align: right; }
@media (max-width: 600px) { .pager { grid-template-columns: 1fr; } .pager__next { text-align: left; } }

.viewer {
  max-width: min(1200px, 94vw);
  max-height: 92vh;
  padding: 20px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
}
.viewer::backdrop { background: rgb(0 0 0 / 80%); }
.viewer figure { margin: 0; }
.viewer img { max-height: 74vh; width: auto; margin: 0 auto; }
.viewer figcaption { margin-top: 12px; }
.viewer__close { margin-top: 16px; }
</style>
