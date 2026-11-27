// Objets 3D simples, un par projet. Chaque fonction renvoie un THREE.Group d'environ 4 unités de large,
// centré sur l'origine et posé sur y = 0.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

const ACCENT = '#5b74ff'

export function materials() {
  const phys = (o) => new THREE.MeshPhysicalMaterial(o)
  return {
    paint: phys({ color: ACCENT, metalness: 0.4, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.08 }),
    carbon: phys({ color: '#1b1d22', metalness: 0.2, roughness: 0.45, clearcoat: 0.6, clearcoatRoughness: 0.3 }),
    rubber: new THREE.MeshStandardMaterial({ color: '#121316', roughness: 0.92 }),
    metal: new THREE.MeshStandardMaterial({ color: '#c9ced6', metalness: 1, roughness: 0.22 }),
    gold: new THREE.MeshStandardMaterial({ color: '#d9a84e', metalness: 1, roughness: 0.3 }),
    light: phys({ color: '#ece8e1', roughness: 0.35, clearcoat: 0.5 }),
    plastic: phys({ color: '#24272e', roughness: 0.55, clearcoat: 0.3, clearcoatRoughness: 0.4 }),
    pcb: phys({ color: '#183a30', roughness: 0.5, clearcoat: 0.6, clearcoatRoughness: 0.25 }),
    chip: new THREE.MeshStandardMaterial({ color: '#0f1013', roughness: 0.6 }),
    glow: new THREE.MeshStandardMaterial({ color: ACCENT, emissive: ACCENT, emissiveIntensity: 2.2, roughness: 0.4 }),
  }
}

const rbox = (w, h, d, r = 0.05, seg = 3) => new RoundedBoxGeometry(w, h, d, seg, Math.min(r, w / 2, h / 2, d / 2))
function add(group, geo, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat)
  m.position.set(x, y, z)
  m.castShadow = true
  m.receiveShadow = true
  group.add(m)
  return m
}

// ---------------- Drapeau à damier ----------------
// Mât métallique et drapeau qui ondule (forme figée). Seules les cases blanches sont dessinées :
// sur fond noir, les cases vides font les cases noires du damier.
export function checkeredFlag(M) {
  const g = new THREE.Group()
  const H = 4.4
  add(g, new THREE.CylinderGeometry(0.06, 0.07, H, 16), M.metal, -1.75, H / 2, 0)
  add(g, new THREE.SphereGeometry(0.13, 20, 14), M.glow, -1.75, H + 0.08, 0)
  const cols = 8
  const rows = 5
  const W = 3.4
  const FH = 2.1
  const cw = W / cols
  const ch = FH / rows
  const wave = (x) => Math.sin(x * 1.7) * 0.28 * (x / W) // l'ondulation grandit loin du mât
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r + c) % 2) continue
      const geo = new THREE.PlaneGeometry(cw, ch, 6, 2)
      const pos = geo.attributes.position
      const x0 = c * cw + cw / 2
      for (let i = 0; i < pos.count; i++) {
        const x = x0 + pos.getX(i)
        pos.setZ(i, wave(x))
        pos.setY(i, pos.getY(i) - Math.sin(x * 0.9) * 0.08) // le bord libre retombe un peu
      }
      geo.computeVertexNormals()
      add(g, geo, M.light, -1.7 + x0, H - 0.2 - ch / 2 - r * ch, 0)
    }
  }
  // le drapeau est tenu à la main : le mât penche vers l'avant-droite, pivot au pied du mât
  const held = new THREE.Group()
  held.position.set(-1.75, 0, 0)
  g.position.set(1.75, 0, 0)
  held.add(g)
  held.rotation.z = -0.38
  held.rotation.x = 0.12
  // l'ensemble est recentré sous la caméra
  const outer = new THREE.Group()
  outer.position.set(-0.9, -0.4, 0)
  outer.add(held)
  return outer
}

// ---------------- Manette de jeu ----------------
export function gamepad(M) {
  const g = new THREE.Group()
  const s = new THREE.Shape()
  s.moveTo(-1.05, 0.8)
  s.lineTo(1.05, 0.8)
  s.bezierCurveTo(1.65, 0.8, 1.95, 0.35, 1.98, -0.25)
  s.bezierCurveTo(2.02, -0.95, 1.6, -1.35, 1.2, -1.1)
  s.bezierCurveTo(0.9, -0.88, 0.7, -0.55, 0.3, -0.52)
  s.lineTo(-0.3, -0.52)
  s.bezierCurveTo(-0.7, -0.55, -0.9, -0.88, -1.2, -1.1)
  s.bezierCurveTo(-1.6, -1.35, -2.02, -0.95, -1.98, -0.25)
  s.bezierCurveTo(-1.95, 0.35, -1.65, 0.8, -1.05, 0.8)
  const depth = 0.34
  const bodyGeo = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: 0.16, bevelSize: 0.14, bevelSegments: 8, curveSegments: 32 })
  bodyGeo.translate(0, 0, -depth / 2)
  const body = new THREE.Group()
  add(body, bodyGeo, M.plastic)
  const top = depth / 2 + 0.16 // surface supérieure (face avant de l'extrusion)
  // joysticks
  for (const [x, y] of [[-1.1, 0.28], [0.6, -0.3]]) {
    const base = add(body, new THREE.CylinderGeometry(0.3, 0.32, 0.08, 40), M.chip, x, y, top)
    base.rotation.x = Math.PI / 2
    const stem = add(body, new THREE.CylinderGeometry(0.1, 0.1, 0.16, 20), M.chip, x, y, top + 0.1)
    stem.rotation.x = Math.PI / 2
    const cap = add(body, new THREE.CylinderGeometry(0.24, 0.22, 0.09, 40), M.light, x, y, top + 0.2)
    cap.rotation.x = Math.PI / 2
  }
  // croix directionnelle
  add(body, rbox(0.42, 0.13, 0.1, 0.03), M.chip, -0.6, -0.32, top + 0.03)
  add(body, rbox(0.13, 0.42, 0.1, 0.03), M.chip, -0.6, -0.32, top + 0.03)
  // boutons d'action
  const btnGeo = new THREE.SphereGeometry(0.13, 28, 16)
  btnGeo.scale(1, 1, 0.5)
  ;[[1.1, 0.5], [1.38, 0.24], [0.82, 0.24], [1.1, -0.02]].forEach(([x, y], k) => add(body, btnGeo, k % 2 ? M.light : M.paint, x, y, top + 0.04))
  // bouton central lumineux
  const home = add(body, new THREE.CylinderGeometry(0.14, 0.14, 0.05, 32), M.glow, 0, 0.42, top + 0.02)
  home.rotation.x = Math.PI / 2
  // gâchettes
  for (const x of [-1.25, 1.25]) add(body, rbox(0.75, 0.22, 0.4, 0.1), M.carbon, x, 0.86, 0.05)
  // la manette est présentée inclinée vers le spectateur
  body.rotation.x = -Math.PI / 2 + 0.55
  body.position.y = 0.75
  g.add(body)
  return g
}

// ---------------- Base de données (flux de données) ----------------
export function database(M) {
  const g = new THREE.Group()
  const R = 1.25
  const H = 0.6
  // disque aux bords arrondis, par révolution d'un profil
  const prof = [new THREE.Vector2(0, -H / 2), new THREE.Vector2(R - 0.08, -H / 2)]
  for (let i = 0; i <= 8; i++) {
    const a = -Math.PI / 2 + (i / 8) * Math.PI
    prof.push(new THREE.Vector2(R - 0.08 + Math.cos(a) * 0.08, Math.sin(a) * 0.08 + (i < 4 ? -H / 2 + 0.08 : H / 2 - 0.08)))
  }
  prof.push(new THREE.Vector2(R - 0.08, H / 2), new THREE.Vector2(0, H / 2))
  const diskGeo = new THREE.LatheGeometry(prof, 72)
  const ringGeo = new THREE.TorusGeometry(R - 0.02, 0.028, 12, 96)
  ringGeo.rotateX(Math.PI / 2)
  for (let i = 0; i < 3; i++) {
    const y = H / 2 + i * (H + 0.14)
    add(g, diskGeo, i === 1 ? M.light : M.plastic, 0, y, 0)
    if (i < 2) {
      const ring = new THREE.Mesh(ringGeo, M.glow)
      ring.position.y = y + H / 2 + 0.07
      g.add(ring)
    }
    // voyants en façade
    for (let k = 0; k < 3; k++) {
      const a = -0.35 + k * 0.18
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), M.glow)
      led.position.set(Math.sin(a) * (R + 0.01), y + 0.08, Math.cos(a) * (R + 0.01))
      g.add(led)
    }
  }
  return g
}

// ---------------- Microcontrôleur (carte ESP32) ----------------
export function microcontroller(M) {
  const outer = new THREE.Group()
  const g = new THREE.Group()
  // la carte est inclinée vers le spectateur pour qu'on voie ses composants
  g.rotation.x = 0.55
  g.position.y = 0.55
  outer.add(g)
  const L = 3.8
  const W = 1.7
  add(g, rbox(L, 0.1, W, 0.04), M.pcb, 0, 0.05, 0)
  // barrettes de broches sur les deux longueurs
  const pins = 19
  const pinGeo = new THREE.BoxGeometry(0.045, 0.26, 0.045)
  for (const z of [-W / 2 + 0.14, W / 2 - 0.14]) {
    add(g, rbox(L - 0.5, 0.14, 0.17, 0.02), M.chip, 0, 0.17, z)
    for (let i = 0; i < pins; i++) add(g, pinGeo, M.gold, -(L - 0.7) / 2 + (i * (L - 0.7)) / (pins - 1), 0.3, z)
  }
  // module ESP32 : support bleu nuit, capot métallique, antenne imprimée
  add(g, rbox(1.85, 0.06, 1.05, 0.02), M.plastic, 0.78, 0.13, 0)
  add(g, rbox(1.22, 0.17, 0.92, 0.03), M.metal, 0.5, 0.24, 0)
  const zig = []
  for (let i = 0; i <= 8; i++) zig.push(new THREE.Vector3(1.38 + (i % 2) * 0.22, 0.17, -0.38 + i * 0.095))
  const ant = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(zig, false, 'catmullrom', 0.01), 64, 0.015, 6), M.gold)
  g.add(ant)
  // port USB, puces, boutons, voyant
  add(g, rbox(0.42, 0.2, 0.5, 0.04), M.metal, -L / 2 + 0.18, 0.2, 0)
  add(g, rbox(0.42, 0.08, 0.42, 0.02), M.chip, -0.95, 0.14, 0.05)
  add(g, rbox(0.24, 0.06, 0.24, 0.02), M.chip, -0.45, 0.13, -0.3)
  for (const z of [-0.45, 0.45]) {
    add(g, rbox(0.22, 0.09, 0.22, 0.02), M.metal, -1.38, 0.15, z)
    add(g, new THREE.CylinderGeometry(0.06, 0.06, 0.05, 16), M.chip, -1.38, 0.22, z)
  }
  const led = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.05, 0.06), M.glow)
  led.position.set(-1.05, 0.13, -0.42)
  g.add(led)
  outer.userData.led = led
  return outer
}

// ---------------- Ordinateur portable (accueil) ----------------
export function laptop(M) {
  const g = new THREE.Group()
  const W = 3.4
  const D = 2.3
  // socle et clavier
  add(g, rbox(W, 0.12, D, 0.06), M.plastic, 0, 0.06, 0)
  const cols = 12
  const rows = 4
  const keyGeo = rbox(0.2, 0.04, 0.2, 0.03)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) add(g, keyGeo, M.light, -W / 2 + 0.38 + c * 0.24, 0.14, -D / 2 + 0.38 + r * 0.25)
  }
  add(g, rbox(1.9, 0.04, 0.2, 0.03), M.light, 0, 0.14, -D / 2 + 0.38 + rows * 0.25) // barre d'espace
  add(g, rbox(1.2, 0.02, 0.62, 0.03), M.metal, 0, 0.13, D / 2 - 0.45) // pavé tactile
  // écran, articulé sur l'arrière du socle : fermé il recouvre le clavier, ouvert il bascule à ~105°
  const lid = new THREE.Group()
  lid.position.set(0, 0.12, -D / 2 + 0.04)
  lid.rotation.x = -1.83
  add(lid, rbox(W, 0.08, D - 0.1, 0.06), M.plastic, 0, 0, (D - 0.1) / 2)
  // dalle et lignes de code lumineuses
  add(lid, new THREE.BoxGeometry(W - 0.3, 0.01, D - 0.45), M.chip, 0, -0.045, (D - 0.1) / 2)
  const lines = [0.9, 1.6, 1.2, 2.1, 0.7, 1.8, 1.4, 1.0, 1.9]
  lines.forEach((len, k) => {
    const indent = [0, 0.2, 0.2, 0.4, 0.4, 0.2, 0, 0.2, 0][k]
    const line = add(lid, new THREE.BoxGeometry(len, 0.012, 0.07), k % 3 === 1 ? M.glow : M.light, -W / 2 + 0.35 + indent + len / 2, -0.055, 0.38 + k * 0.19)
    line.castShadow = false
  })
  g.add(lid)
  return g
}
