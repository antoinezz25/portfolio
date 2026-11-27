import { createApp } from 'vue'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import '@fontsource-variable/inter'
import './styles/main.css'
import App from './App.vue'
import router from './router'
import { startScrollFx } from './scrollFx'

// Défilement fluide (désactivé si le visiteur demande moins d'animations)
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({ lerp: 0.1, anchors: true })
  const raf = (time) => {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
}

createApp(App).use(router).mount('#app')
startScrollFx(document.getElementById('app'))
