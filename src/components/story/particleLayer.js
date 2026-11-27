// Nuage de particules qui passe d'une forme à l'autre au défilement.
// Chaque forme = { pos, col } (même nombre de points pour toutes) ; jusqu'à 6 formes.
// Une forme peut être rendue invisible (opacité 0) : ses points apparaissent alors en s'assemblant.
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  attribute vec3 s0; attribute vec3 s1; attribute vec3 s2; attribute vec3 s3; attribute vec3 s4; attribute vec3 s5;
  attribute vec3 c0; attribute vec3 c1; attribute vec3 c2; attribute vec3 c3; attribute vec3 c4; attribute vec3 c5;
  attribute float aRand;
  uniform float uStep;   // forme de départ (entier)
  uniform float uMix;    // avancement vers la suivante (0 → 1)
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uAlphaA;  // opacité de la forme de départ
  uniform float uAlphaB;  // opacité de la forme d'arrivée
  varying vec3 vColor;
  varying float vFade;

  vec3 pick(float k, vec3 a, vec3 b, vec3 c, vec3 d, vec3 e, vec3 f) {
    if (k < 0.5) return a;
    if (k < 1.5) return b;
    if (k < 2.5) return c;
    if (k < 3.5) return d;
    if (k < 4.5) return e;
    return f;
  }

  void main() {
    // chaque point part avec un léger retard : la transformation « coule » au lieu d'être d'un bloc
    float t = clamp((uMix - aRand * 0.35) / 0.65, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    vec3 p = mix(pick(uStep, s0, s1, s2, s3, s4, s5), pick(uStep + 1.0, s0, s1, s2, s3, s4, s5), t);
    vColor = mix(pick(uStep, c0, c1, c2, c3, c4, c5), pick(uStep + 1.0, c0, c1, c2, c3, c4, c5), t);

    // pendant le trajet, les points s'envolent en tourbillon puis se reposent sur le nouvel objet
    float travel = sin(t * 3.14159);
    float ph = aRand * 40.0;
    p += vec3(sin(uTime * 0.9 + ph), cos(uTime * 0.7 + ph * 1.3), sin(uTime * 0.8 + ph * 0.7)) * travel * (0.6 + aRand * 1.8);
    // scintillement très léger au repos
    p += vec3(sin(uTime * 0.6 + ph), sin(uTime * 0.5 + ph * 2.0), cos(uTime * 0.55 + ph)) * 0.012;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.7 + aRand * 0.6) * uPixelRatio * (12.0 / -mv.z);
    vFade = clamp(1.0 - (-mv.z - 10.0) / 30.0, 0.4, 1.0) * mix(uAlphaA, uAlphaB, t);
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vFade;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.05, d) * vFade;
    gl_FragColor = vec4(vColor * alpha, alpha);
  }
`

export function createParticleLayer({ shapes, pixelRatio, size = 2 }) {
  const count = shapes[0].pos.length / 3
  const geo = new THREE.BufferGeometry()
  for (let k = 0; k < 6; k++) {
    const sh = shapes[Math.min(k, shapes.length - 1)]
    geo.setAttribute(`s${k}`, new THREE.BufferAttribute(sh.pos, 3))
    geo.setAttribute(`c${k}`, new THREE.BufferAttribute(sh.col, 3))
  }
  geo.setAttribute('position', geo.getAttribute('s0'))
  const rnd = new Float32Array(count)
  for (let i = 0; i < count; i++) rnd[i] = Math.random()
  geo.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1))
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 40)
  const uniforms = {
    uStep: { value: 0 },
    uMix: { value: 0 },
    uTime: { value: 0 },
    uSize: { value: size },
    uPixelRatio: { value: pixelRatio },
    uAlphaA: { value: 1 },
    uAlphaB: { value: 1 },
  }
  const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  const points = new THREE.Points(geo, material)
  return {
    points,
    setPixelRatio(r) {
      uniforms.uPixelRatio.value = r
    },
    update(step, mix, time, alphaA = 1, alphaB = 1) {
      uniforms.uAlphaA.value = alphaA
      uniforms.uAlphaB.value = alphaB
      uniforms.uStep.value = step
      uniforms.uMix.value = mix
      uniforms.uTime.value = time
    },
    dispose() {
      geo.dispose()
      material.dispose()
    },
  }
}
