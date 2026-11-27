// Transforme un objet 3D (objects.js) en nuage de particules :
// des points tirés au hasard à la surface de chacune de ses pièces, avec la couleur de la pièce.
import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'

const ACCENT = new THREE.Color('#5b74ff')
const DARK_FALLBACK = new THREE.Color('#6a7180') // les pièces trop sombres resteraient invisibles sur fond noir

// Découpe le calcul en petits morceaux : toutes les ~6 ms, on rend la main au navigateur
// pour que la page reste fluide pendant la préparation
let sliceStart = 0
async function breathe() {
  if (performance.now() - sliceStart < 6) return
  await new Promise((r) => setTimeout(r))
  sliceStart = performance.now()
}

function triangleArea(geo, matrix) {
  const g = geo.index ? geo.toNonIndexed() : geo
  const p = g.attributes.position
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const c = new THREE.Vector3()
  const n = new THREE.Vector3()
  let area = 0
  for (let i = 0; i < p.count; i += 3) {
    a.fromBufferAttribute(p, i).applyMatrix4(matrix)
    b.fromBufferAttribute(p, i + 1).applyMatrix4(matrix)
    c.fromBufferAttribute(p, i + 2).applyMatrix4(matrix)
    area += n.crossVectors(b.sub(a), c.sub(a)).length() * 0.5
  }
  return area
}

function pointColor(material) {
  if (material.emissive && material.emissiveIntensity > 1) return ACCENT.clone().multiplyScalar(1.6)
  const c = material.color.clone()
  const lum = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b
  return lum < 0.12 ? DARK_FALLBACK.clone() : c
}

// Renvoie { pos, col } pour `count` points, l'objet étant mis à l'échelle `scale` puis décalé de `offset`
export async function sampleObject(object, count, { scale = 1, offset = new THREE.Vector3() } = {}) {
  await breathe()
  object.updateMatrixWorld(true)
  const parts = []
  const meshes = []
  object.traverse((o) => o.isMesh && meshes.push(o))
  for (const o of meshes) {
    const area = triangleArea(o.geometry, o.matrixWorld)
    await breathe()
    // les petites pièces (boutons, broches, voyants) reçoivent proportionnellement plus de points
    parts.push({ mesh: o, weight: Math.pow(area, 0.65), sampler: new MeshSurfaceSampler(o).build() })
    await breathe()
  }
  const total = parts.reduce((s, p) => s + p.weight, 0)
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  const v = new THREE.Vector3()
  let i = 0
  for (const [k, p] of parts.entries()) {
    const n = k === parts.length - 1 ? count - i : Math.round((p.weight / total) * count)
    const c = pointColor(p.mesh.material)
    for (let j = 0; j < n && i < count; j++, i++) {
      p.sampler.sample(v)
      v.applyMatrix4(p.mesh.matrixWorld).multiplyScalar(scale).add(offset)
      pos.set([v.x, v.y, v.z], i * 3)
      col.set([c.r, c.g, c.b], i * 3)
      if (j % 500 === 499) await breathe()
    }
    await breathe()
  }
  return { pos, col }
}
