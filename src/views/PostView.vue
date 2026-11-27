<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import NotFoundView from './NotFoundView.vue'
import { findPost } from '../data/posts'

const route = useRoute()
const post = computed(() => findPost(route.params.slug))
const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

watchEffect(() => {
  if (post.value) document.title = `${post.value.title} — Antoine Duarte`
})
</script>

<template>
  <NotFoundView v-if="!post" />
  <article v-else class="post container">
    <p class="crumbs"><RouterLink to="/veille" class="plain">← Journal de veille</RouterLink></p>
    <header class="post__head">
      <p class="kicker"><time :datetime="post.date">{{ formatDate(post.date) }}</time></p>
      <h1 class="post__title">{{ post.title }}</h1>
      <p class="chips"><span v-for="t in post.tags" :key="t" class="chip">{{ t }}</span></p>
    </header>
    <div class="post__body" v-html="post.body"></div>
  </article>
</template>

<style scoped>
.post { padding-top: calc(var(--header-h) + 32px); max-width: 48rem; }
.crumbs { margin-bottom: 32px; color: var(--muted); }
.post__head { margin-bottom: 36px; padding-bottom: 24px; border-bottom: 1px solid var(--line); }
.post__title { font-size: clamp(30px, 4.4vw, 54px); margin-bottom: 16px; }
.post__body { font-size: 18px; line-height: 1.75; }
.post__body :deep(p) { margin-bottom: 1.1em; }
.post__body :deep(h3) { margin: 2em 0 0.6em; font-size: 24px; padding-left: 14px; border-left: 3px solid var(--accent); }
.post__body :deep(ul) { margin-bottom: 1.1em; }
.post__body :deep(li) { position: relative; padding-left: 20px; margin-bottom: 8px; }
.post__body :deep(li)::before { content: ''; position: absolute; left: 0; top: 0.7em; width: 8px; height: 8px; background: var(--accent); }
</style>
