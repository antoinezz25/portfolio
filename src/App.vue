<script setup>
import NavBar from './components/NavBar.vue'
import FooterBar from './components/FooterBar.vue'
</script>

<template>
  <a class="skip-link" href="#contenu">Aller au contenu</a>
  <NavBar />
  <main id="contenu" tabindex="-1">
    <RouterView />
  </main>
  <FooterBar />
</template>

<style>
main:focus { outline: none; }
</style>
