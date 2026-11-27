<script setup>
import { onMounted } from 'vue'
onMounted(() => (document.title = 'Page introuvable — Antoine Duarte'))
</script>

<template>
  <div class="nf container">
    <p class="kicker">Erreur 404</p>
    <h1 class="sec-title">Page introuvable</h1>
    <p class="sec-lead">Cette page n’existe pas ou plus.</p>
    <p class="back"><RouterLink to="/" class="btn">Revenir à l’accueil</RouterLink></p>
  </div>
</template>

<style scoped>
.nf { padding-top: calc(var(--header-h) + 14vh); padding-bottom: 14vh; }
.back { margin-top: 32px; }
</style>
