// Scène 3D du récit : un objet par projet, entièrement fait de particules.
//   GP Explorer → drapeau à damier · Survie zombie → manette · Flux Calcium → base de données · Centre aquatique → microcontrôleur
// Les objets sont modélisés dans objects.js, puis des points sont tirés sur leur surface (objectParticles.js).
// À l'accueil, un ordinateur portable en particules tourne lentement à côté de la présentation.
// À chaque chapitre, tous les points s'envolent et se reposent pour former l'objet du projet.
// À la fin, ils se dispersent et disparaissent.
// Même interface que storyScene.js (createStoryScene).
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { materials, checkeredFlag, gamepad, database, microcontroller, laptop } from './objects.js'
import { sampleObject } from './objectParticles.js'
import { createParticleLayer } from './particleLayer.js'

export const STEPS = 6
const BG = '#000000'

// objet de chaque projet ; la base de données tourne sur elle-même,
// le drapeau, la manette et la carte oscillent pour rester lisibles de face
const BUILDERS = { 'gp-explorer': checkeredFlag, 'fps-zombie': gamepad, 'stage-dsin': database, 'centre-aquatique': microcontroller }
const SWING = new Set(['gp-explorer', 'fps-zombie', 'centre-aquatique'])

// plans de caméra : accueil, 4 chapitres, fin ; `side` laisse la place au panneau de texte
const SHOTS = [
  { pos: [0, 3, 13], look: [0, 0.4, 0], side: 0.75, down: 0 },
  { pos: [0, 3, 12], look: [0, 1.7, 0], side: 1, mobileDown: 1.3 }, // drapeau : plus haut, on le descend sur téléphone
  { pos: [0, 3, 12], look: [0, 0.8, 0], side: -1 },
  { pos: [0, 3, 12], look: [0, 1.1, 0], side: 1 },
  { pos: [0, 3, 12], look: [0, 0.6, 0], side: -1 },
  { pos: [0, 4, 16], look: [0, 0.8, 0], side: 0 },
]

const pause = () => new Promise((r) => setTimeout(r))
const clamp01 = (v) => Math.min(1, Math.max(0, v))
const smooth = (t) => t * t * (3 - 2 * t)
const lerp = (a, b, t) => a + (b - a) * t
// interpolation d'angle par le chemin le plus court
const lerpAngle = (a, b, t) => {
  const d = ((((b - a + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI
  return a + d * t
}

export async function createStoryScene(canvas, { reducedMotion, onSelect, onHover, chapters = [] }) {
  const lowPower = window.innerWidth < 760
  const N = lowPower ? 14000 : 32000

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(BG)
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)

  await pause()

  // ---------- Formes : chaque objet devient un nuage de points ----------
  const M = materials()
  const SCALE = 1.15
  // un objet à la fois, en rendant la main au navigateur entre deux : la page reste fluide
  const objects = []
  const single = []
  for (const p of chapters) {
    const o = BUILDERS[p.slug] ? BUILDERS[p.slug](M) : new THREE.Group()
    objects.push(o)
    await pause()
    single.push(await sampleObject(o, N, { scale: SCALE }))
    await pause()
  }
  // accueil : l'ordinateur portable ; fin : un nuage dispersé et invisible
  const pc = laptop(M)
  await pause()
  const intro = await sampleObject(pc, N, { scale: SCALE })
  const scatter = { pos: new Float32Array(N * 3), col: new Float32Array(N * 3).fill(1) }
  for (let k = 0; k < N; k++) {
    const u = Math.random() * Math.PI * 2
    const v = Math.acos(2 * Math.random() - 1)
    const r = 9 + Math.random() * 9
    scatter.pos.set([r * Math.sin(v) * Math.cos(u), r * Math.cos(v) * 0.6, r * Math.sin(v) * Math.sin(u)], k * 3)
  }
  // les objets pleins ne servent qu'à l'échantillonnage : ils ne sont jamais affichés
  Object.values(M).forEach((m) => m.dispose())
  objects.forEach((o) => o.traverse((m) => m.geometry?.dispose()))
  pc.traverse((m) => m.geometry?.dispose())

  await pause()
  const layer = createParticleLayer({ shapes: [intro, ...single, scatter], pixelRatio: renderer.getPixelRatio(), size: lowPower ? 2.6 : 2.1 })
  scene.add(layer.points)

  // zone de survol : une sphère invisible autour de l'objet du chapitre en cours
  const hitZone = new THREE.Mesh(new THREE.SphereGeometry(2.6, 16, 12), new THREE.MeshBasicMaterial({ visible: false }))
  hitZone.position.y = 0.7
  scene.add(hitZone)

  // ---------- Post-traitement ----------
  await pause()
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const bloom = lowPower ? null : new UnrealBloomPass(new THREE.Vector2(1, 1), 0.5, 0.45, 0.55)
  if (bloom) composer.addPass(bloom)
  composer.addPass(new OutputPass())

  // ---------- État ----------
  let target = 0
  let current = 0
  const mouse = new THREE.Vector2()
  const pointer = new THREE.Vector2(9, 9)
  const raycaster = new THREE.Raycaster()
  let hovered = null
  let running = true
  let frame = 0
  const look = new THREE.Vector3()
  const n = chapters.length

  // rotation de l'ensemble à une étape donnée
  // (toujours une oscillation bornée : un angle qui grandit sans fin ferait tourbillonner l'objet au défilement)
  function spin(step, t) {
    // l'ordinateur de l'accueil fait des tours complets ; l'angle est ramené entre -π et π
    // pour que le passage au chapitre suivant reste court
    if (step === 0) return (((t * 0.35 + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) - Math.PI
    if (step === STEPS - 1) return 0
    return SWING.has(chapters[step - 1]?.slug) ? -0.3 + Math.sin(t * 0.4) * 0.35 : -0.5 + Math.sin(t * 0.25) * 0.6
  }
  const visibleAt = (step) => (step === STEPS - 1 ? 0 : 1)

  function resize() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    renderer.setSize(w, h, false)
    composer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  function render(time) {
    const t = reducedMotion ? 0 : time * 0.001
    current = reducedMotion ? target : lerp(current, target, 0.07)
    const i = Math.min(STEPS - 2, Math.floor(current))
    const f = current - i
    const mix = smooth(clamp01((f - 0.2) / 0.6))

    layer.update(i, mix, t, visibleAt(i), visibleAt(i + 1))
    layer.points.rotation.y = lerpAngle(spin(i, t), spin(i + 1, t), mix)
    layer.points.position.y = reducedMotion ? 0 : Math.sin(t * 0.9) * 0.08

    // caméra
    const A = SHOTS[i]
    const B = SHOTS[i + 1]
    const narrow = canvas.clientWidth < 760
    const pos = new THREE.Vector3(...A.pos).lerp(new THREE.Vector3(...B.pos), mix)
    pos.y += Math.sin(Math.PI * mix) * 1.5
    if (narrow) pos.multiplyScalar(1.4)
    const par = reducedMotion ? 0 : 1
    camera.position.set(pos.x + mouse.x * 0.6 * par, pos.y + mouse.y * 0.4 * par, pos.z)
    look.set(lerp(A.look[0], B.look[0], mix), lerp(A.look[1], B.look[1], mix), lerp(A.look[2], B.look[2], mix))
    // sur téléphone, le panneau occupe le bas de l'écran : l'objet remonte dans la moitié haute
    if (narrow) look.y -= 2.4 - lerp(A.mobileDown ?? 0, B.mobileDown ?? 0, mix)
    // à l'accueil sur téléphone, l'ordinateur reste petit en haut pour ne pas couvrir le nom
    if (narrow && i === 0) {
      camera.position.multiplyScalar(lerp(1.35, 1, mix))
      look.y -= 1.5 * (1 - mix)
    }
    camera.lookAt(look)
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    const side = lerp(A.side, B.side, mix)
    const down = lerp(A.down ?? 0, B.down ?? 0, mix)
    if (!narrow) camera.setViewOffset(w, h, -w * 0.22 * side, -h * down, w, h)
    else camera.clearViewOffset()
    camera.updateProjectionMatrix()

    // survol : l'objet du chapitre en cours ouvre son projet
    const ch = Math.round(current)
    raycaster.setFromCamera(pointer, camera)
    const slug = ch >= 1 && ch <= n && raycaster.intersectObject(hitZone).length ? chapters[ch - 1].slug : null
    if (slug !== hovered) {
      hovered = slug
      canvas.style.cursor = slug ? 'pointer' : ''
      onHover?.(slug)
    }

    composer.render()
  }

  // qualité adaptée à la machine : si l'animation descend sous ~35 images/s,
  // on réduit la définition, puis on coupe le halo
  let last = 0
  let sum = 0
  let frames = 0
  let quality = 2
  function adapt(time) {
    const dt = time - last
    last = time
    if (dt > 250) return // onglet masqué ou premier affichage : on ne compte pas
    sum += dt
    if (++frames < 60) return
    const slow = sum / frames > 28
    sum = frames = 0
    if (!slow || quality === 0) return
    quality--
    if (quality === 1) {
      renderer.setPixelRatio(1)
      composer.setPixelRatio(1)
      layer.setPixelRatio(1)
      resize()
    } else if (bloom) bloom.enabled = false
  }

  function loop(time) {
    if (!running) return
    adapt(time)
    render(time)
    frame = requestAnimationFrame(loop)
  }

  await pause()
  resize()
  // les shaders sont compilés en arrière-plan avant la première image
  await renderer.compileAsync(scene, camera)
  frame = requestAnimationFrame(loop)

  return {
    setProgress(p) {
      target = Math.min(STEPS - 1, Math.max(0, p))
    },
    setMouse(x, y) {
      mouse.set(x, y)
      pointer.set(x, y)
    },
    clearPointer() {
      pointer.set(9, 9)
    },
    click() {
      if (hovered) onSelect?.(hovered)
    },
    resize,
    pause() {
      running = false
      cancelAnimationFrame(frame)
    },
    resume() {
      if (running) return
      running = true
      frame = requestAnimationFrame(loop)
    },
    dispose() {
      running = false
      cancelAnimationFrame(frame)
      layer.dispose()
      hitZone.geometry.dispose()
      hitZone.material.dispose()
      composer.dispose()
      renderer.dispose()
    },
  }
}
