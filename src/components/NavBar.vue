<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { profile } from '../data/profile'

const route = useRoute()
const open = ref(false)
const active = ref('')

const links = [
  { label: 'À propos', to: { path: '/', hash: '#a-propos' }, id: 'a-propos' },
  { label: 'Projets', to: { path: '/', hash: '#projets' }, id: 'projets' },
  { label: 'Compétences', to: { path: '/', hash: '#competences' }, id: 'competences' },
  { label: 'Veille', to: { path: '/', hash: '#veille' }, id: 'veille' },
  { label: 'Contact', to: { path: '/', hash: '#contact' }, id: 'contact' },
]

function isActive(link) {
  if (link.id === 'projets' && route.path.startsWith('/projets')) return true
  return route.path === '/' && active.value === link.id
}

function onScroll() {
  if (route.path !== '/') return
  let current = ''
  for (const l of links) {
    const el = document.getElementById(l.id)
    if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) current = l.id
  }
  active.value = current
}

watch(() => route.fullPath, () => {
  open.value = false
  requestAnimationFrame(onScroll)
})
const onKey = (e) => e.key === 'Escape' && (open.value = false)
// menu ouvert sur téléphone : la page derrière ne défile plus
watch(open, (v) => (document.documentElement.style.overflow = v ? 'hidden' : ''))

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
  onScroll()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <header class="nav">
    <RouterLink to="/" class="nav__brand plain">{{ profile.name }}</RouterLink>

    <div class="nav__mobile">
      <a :href="profile.cv" download class="nav__cv-mobile plain">CV</a>
      <button class="nav__toggle" :aria-expanded="open" aria-controls="menu-principal" @click="open = !open">
        {{ open ? 'Fermer' : 'Menu' }}
      </button>
    </div>

    <nav id="menu-principal" class="nav__menu" :class="{ 'is-open': open }" aria-label="Menu principal">
      <ul>
        <li v-for="(link, i) in links" :key="link.id">
          <RouterLink :to="link.to" class="plain" :class="{ 'is-active': isActive(link) }" :aria-current="isActive(link) ? 'location' : undefined">
            <span class="nav__index" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>{{ link.label }}
          </RouterLink>
        </li>
        <li><a :href="profile.cv" download class="nav__cv plain">CV (PDF)</a></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  height: var(--header-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 0 var(--gutter);
  background: var(--bg);
  border-bottom: 1px solid var(--line);
}
.nav__brand { font-family: var(--font-display); font-size: 18px; }
.nav__menu ul { display: flex; gap: 26px; align-items: center; }
.nav__menu a { display: inline-block; padding: 10px 0; color: var(--muted); font-size: 15px; text-decoration: none; }
.nav__menu a:hover,
.nav__menu a.is-active { color: var(--text); }
.nav__menu a.is-active { box-shadow: inset 0 -2px 0 var(--accent); }
.nav__cv {
  color: var(--accent-ink) !important;
  background: var(--accent);
  padding: 8px 14px !important;
  font-weight: 600;
}

.nav__index { display: none; }
.nav__mobile { display: none; align-items: center; gap: 8px; }
.nav__cv-mobile {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 14px;
  background: var(--accent);
  color: var(--accent-ink);
  font-weight: 600;
  font-size: 14px;
}
.nav__toggle {
  min-height: 44px;
  padding: 0 4px;
  border: 0;
  background: none;
  color: var(--text);
  font: 600 16px var(--font-body);
  cursor: pointer;
}

@media (max-width: 860px) {
  .nav { gap: 12px; }
  .nav__brand { min-width: 0; font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .nav__mobile { display: flex; flex-shrink: 0; }
  .nav__toggle { min-height: 40px; padding: 0 14px; border: 1px solid var(--line); }
  .nav__menu {
    display: none;
    position: fixed;
    top: var(--header-h);
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--bg);
    padding: 24px var(--gutter);
  }
  .nav__menu.is-open { display: block; }
  .nav__menu ul { flex-direction: column; align-items: stretch; gap: 0; }
  .nav__menu li { border-bottom: 1px solid var(--line); }
  .nav__menu a { display: flex; align-items: baseline; gap: 16px; font-size: 30px; font-family: var(--font-display); padding: 16px 0; color: var(--text); }
  .nav__menu a.is-active { box-shadow: none; color: var(--accent); }
  .nav__index { display: inline; font-size: 14px; color: var(--accent); }
  .nav__menu li:last-child { border-bottom: 0; margin-top: 24px; }
  .nav__cv { display: flex !important; justify-content: center; font-size: 18px !important; padding: 14px !important; }
}
</style>
