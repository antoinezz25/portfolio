<script setup>
import { profile } from '../data/profile'
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <p>{{ profile.name }} · {{ new Date().getFullYear() }}</p>
      <p class="muted small">Site codé à la main avec Vue.js et Three.js.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer { margin-top: 120px; border-top: 1px solid var(--line); padding: 32px 0 40px; }
.footer__inner { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 32px; }
</style>
