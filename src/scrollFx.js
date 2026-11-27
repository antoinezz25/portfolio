// Effets liés au défilement, compatibles avec tous les navigateurs.
// Chaque élément suivi reçoit une variable CSS --p (de 0 à 1) qui avance avec le défilement ;
// le CSS s'en sert pour l'opacité, le décalage, le masque… Sans JavaScript, --p vaut 1 : tout reste visible.
//   - effets d'entrée : --p passe de 0 à 1 quand l'élément entre dans l'écran
//   - effets de sortie (.hero) : --p passe de 0 à 1 quand l'élément quitte l'écran par le haut

const ENTER = '.sec-title, .kicker, .rise, .frame__screen, .panel, .end'
const EXIT = '.hero'

const tracked = new Map() // élément -> 'enter' | 'exit'
const last = new WeakMap() // élément -> dernière valeur de --p
let ticking = false

function collect(root = document) {
  root.querySelectorAll(ENTER).forEach((el) => tracked.has(el) || tracked.set(el, 'enter'))
  root.querySelectorAll(EXIT).forEach((el) => tracked.has(el) || tracked.set(el, 'exit'))
  for (const el of tracked.keys()) if (!el.isConnected) tracked.delete(el)
}

function update() {
  ticking = false
  const vh = window.innerHeight
  // toutes les mesures d'abord, toutes les écritures ensuite : le navigateur ne recalcule la page qu'une fois
  const values = []
  for (const [el, mode] of tracked) {
    const r = el.getBoundingClientRect()
    let p
    if (mode === 'enter') {
      // 0 quand le haut de l'élément touche le bas de l'écran, 1 après 30 % de hauteur d'écran
      p = (vh - r.top) / (vh * 0.3)
    } else {
      // 0 tant que l'élément est en place, 1 quand 70 % de sa hauteur est sortie par le haut
      p = -r.top / (r.height * 0.7)
    }
    p = Math.min(1, Math.max(0, p))
    values.push([el, p.toFixed(3)])
  }
  for (const [el, v] of values) {
    if (last.get(el) === v) continue
    last.set(el, v)
    el.style.setProperty('--p', v)
  }
}

function requestUpdate() {
  if (!ticking) {
    ticking = true
    requestAnimationFrame(update)
  }
}

export function startScrollFx(root) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  document.documentElement.classList.add('fx')
  collect()
  requestUpdate() // à la prochaine image : pas de calcul de mise en page pendant le chargement
  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate)
  // les pages changent (navigation, listes) : on suit les nouveaux éléments
  new MutationObserver(() => {
    collect()
    requestUpdate()
  }).observe(root, { childList: true, subtree: true })
}
