<script setup>
import { onMounted } from 'vue'
import { posts, sources } from '../data/posts'

const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date))
const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

onMounted(() => (document.title = 'Journal de veille — Antoine Duarte'))
</script>

<template>
  <div class="veille container">
    <header class="sec-head">
      <p class="kicker">Veille · {{ sorted.length }} articles</p>
      <h1 class="sec-title">Journal de veille</h1>
      <p class="sec-lead">
        Ce que je découvre en intelligence artificielle, en lien avec mes projets, et ce que j’en retiens.
        Mes sources : {{ sources.join(', ') }}.
      </p>
    </header>

    <ol class="list">
      <li v-for="p in sorted" :key="p.slug" class="card entry">
        <time :datetime="p.date" class="entry__date">{{ formatDate(p.date) }}</time>
        <h2 class="entry__title"><RouterLink :to="`/veille/${p.slug}`" class="plain">{{ p.title }}</RouterLink></h2>
        <p class="muted">{{ p.summary }}</p>
        <p class="chips"><span v-for="t in p.tags" :key="t" class="chip">{{ t }}</span></p>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.veille { padding-top: calc(var(--header-h) + 48px); }
.list { display: grid; gap: 16px; max-width: 52rem; }
.entry { position: relative; display: grid; gap: 10px; transition: border-color 0.2s ease; }
.entry:hover { border-color: var(--accent); }
.entry__date { font-family: var(--font-display); font-size: 14px; color: var(--accent); }
.entry__title { font-size: clamp(20px, 2vw, 26px); line-height: 1.2; }
.entry__title a::after { content: ''; position: absolute; inset: 0; }
</style>
