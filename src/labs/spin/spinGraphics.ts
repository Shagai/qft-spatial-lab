import * as THREE from 'three'
import { armRotation } from './spinModel'

const teal = '#69f5df'
const amber = '#ffba64'
const axisColors = ['#ff818b', '#81e5b0', '#8cbaff']
const up = new THREE.Vector3(0, 1, 0)
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)
const split = v(-2.35, 0.53, 0)
const join = v(2.35, 0.53, 0)
const input = v(-2.95, 0.53, 0)
const outputs = [-0.45, 0.45].map(z => v(2.97, 0.53, z))
const paths = [-0.95, 0.95].map(z => [split, v(-1.20, 0.53, z), v(1.20, 0.53, z), join])

function rod(a: THREE.Vector3, b: THREE.Vector3, r: number, material: THREE.Material, sides = 12) {
  const delta = b.clone().sub(a)
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(r, r, delta.length(), sides), material)
  tube.position.copy(a).lerp(b, 0.5)
  tube.quaternion.setFromUnitVectors(up, delta.normalize())
  return tube
}

function lamp(color: string | number, radius: number) {
  return new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 10), new THREE.MeshBasicMaterial({ color }))
}

// Wide transparent sheaths give the rays a soft edge without a postprocessing pass in VR.
function ray(points: THREE.Vector3[], color: string) {
  const group = new THREE.Group()
  for (const [radius, opacity] of [[0.047, 0.10], [0.029, 0.22], [0.020, 1]]) {
    const material = new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, depthWrite: opacity === 1 })
    for (let i = 1; i < points.length; i++) group.add(rod(points[i - 1], points[i], radius, material, 8))
  }
  return group
}

function label(text: string, color: string, width: number, height: number, panel = false) {
  const canvas = document.createElement('canvas')
  canvas.width = 384
  canvas.height = Math.round(384 * height / width)
  const ctx = canvas.getContext('2d')!
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  function write(value: string) {
    const { width: w, height: h } = canvas
    ctx.clearRect(0, 0, w, h)
    if (panel) {
      ctx.fillStyle = '#101e27'
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = color
      ctx.globalAlpha = 0.65
      ctx.lineWidth = 3
      ctx.strokeRect(2, 2, w - 4, h - 4)
      ctx.globalAlpha = 1
    }
    ctx.font = `600 ${h * (panel ? 0.51 : 0.74)}px ui-monospace, monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    if (!panel) {
      ctx.strokeStyle = '#12212b'
      ctx.lineWidth = h * 0.09
      ctx.lineJoin = 'round'
      ctx.strokeText(value, w / 2, h / 2)
    }
    ctx.fillStyle = color
    ctx.fillText(value, w / 2, h * 0.52, w * 0.89)
    texture.needsUpdate = true
  }
  write(text)
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(width, height, 1)
  return { sprite, texture, write }
}

function triad(tint: string) {
  const group = new THREE.Group()
  const direction = new THREE.Group()
  const radius = 0.45
  const stem = new THREE.MeshBasicMaterial({ color: tint, transparent: true, opacity: 0.55 })
  const tether = rod(v(0, 0.9, 0), v(0, 1.39, 0), 0.009, stem, 6)
  group.add(tether, direction)
  direction.position.y = 1.42
  direction.add(lamp(tint, 0.048))
  const axes = [v(1, 0, 0), v(0, 1, 0), v(0, 0, 1)]
  axes.forEach((axis, i) => {
    const material = new THREE.MeshBasicMaterial({ color: axisColors[i] })
    direction.add(rod(v(0, 0, 0), axis.clone().multiplyScalar(radius * 0.84), 0.017, material))
    const head = new THREE.Mesh(new THREE.ConeGeometry(0.053, 0.14, 14), material)
    head.quaternion.setFromUnitVectors(up, axis)
    head.position.copy(axis).multiplyScalar(radius * 0.91)
    direction.add(head)
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.011, 6, 16), new THREE.MeshBasicMaterial({ color: tint }))
    collar.quaternion.setFromUnitVectors(v(0, 0, 1), axis)
    collar.position.copy(axis).multiplyScalar(radius * 0.77)
    direction.add(collar)
    const letter = label(['x', 'y', 'z'][i], axisColors[i], 0.19, 0.19).sprite
    letter.position.copy(axis).multiplyScalar(radius + 0.1)
    direction.add(letter)
  })
  return { group, direction, tether }
}

function grid() {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      dark: { value: new THREE.Color('#11202a') },
      lineColor: { value: new THREE.Color('#39505b') },
    },
    vertexShader: `varying vec2 xy;
      void main() {
        xy = position.xy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `uniform vec3 dark;
      uniform vec3 lineColor;
      varying vec2 xy;
      void main() {
        vec2 p = xy * 2.0;
        vec2 edge = abs(fract(p - 0.5) - 0.5) / max(fwidth(p), vec2(0.0001));
        float line = 1.0 - min(min(edge.x, edge.y), 1.0);
        float distanceFade = 1.0 - smoothstep(3.0, 10.0, length(xy));
        gl_FragColor = vec4(mix(dark, lineColor, line * distanceFade * 0.48), 1.0);
        #include <colorspace_fragment>
      }`,
  })
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), material)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -0.335
  return floor
}

export function buildRays() {
  const rays = new THREE.Group()
  rays.add(ray([input, split], '#c3e1ef'))
  paths.forEach((points, i) => rays.add(ray(points, i === 0 ? teal : amber)))
  outputs.forEach(endpoint => rays.add(ray([join, endpoint], '#b6d6ed')))
  return rays
}

export function buildExperiment() {
  const world = new THREE.Group()
  const ground = grid()
  world.add(ground, buildRays())

  const frames = [triad(teal), triad(amber)]
  const tags = [label('X → Y', teal, 0.88, 0.30, true), label('Y → X', amber, 0.88, 0.30, true)]
  frames.forEach((frame, i) => {
    world.add(frame.group, tags[i].sprite)
    tags[i].sprite.position.set(i === 0 ? -0.96 : 1.07, 1.40, paths[i][1].z)
  })

  const outputTags = ['A', 'B'].map((name, i) => {
    const tag = label(name, '#eff7f7', 0.29, 0.28, true).sprite
    tag.position.set(3.19, 0.97, i === 0 ? -0.49 : 0.49)
    world.add(tag)
    return tag
  })

  const panel = new THREE.Group()
  panel.visible = false
  world.add(panel)
  const readout = label('A  0    B  0', '#eef8fc', 2.8, 0.39, true)
  readout.sprite.position.set(0, 2.3, -1.4)
  panel.add(readout.sprite)
  const buttons = ['Swap lower order', 'Run 100 neutrons'].map((text, i) => {
    const item = label(text, i === 0 ? amber : teal, 1.82, 0.46, true)
    const face = new THREE.Mesh(new THREE.PlaneGeometry(1.82, 0.46), new THREE.MeshBasicMaterial({ map: item.texture, side: THREE.DoubleSide, toneMapped: false }))
    item.sprite.material.dispose()
    face.position.set(i === 0 ? -1 : 1, 0.13, 1.84)
    face.rotation.x = -Math.PI / 3.2
    panel.add(face)
    return face
  })

  const dots = [lamp(teal, 0.074), lamp(amber, 0.074)]
  dots.forEach(dot => {
    dot.visible = false
    world.add(dot)
  })
  // Arc-length parameterization keeps constant packet speed through both bends.
  const routes = paths.map(points => {
    const route = new THREE.CurvePath<THREE.Vector3>()
    for (let j = 1; j < points.length; j++) route.add(new THREE.LineCurve3(points[j - 1], points[j]))
    return route
  })

  let lastOrder = true
  function setFrames(angle: number, progress: number, reversed: boolean, overlay: boolean) {
    frames.forEach((frame, i) => {
      const [w, x, y, z] = armRotation(angle, progress, i === 1 && reversed)
      frame.direction.quaternion.set(x, y, z, w)
      frame.group.position.z = overlay ? 0 : paths[i][1].z
      frame.tether.visible = !overlay
      // Extend the second set of arrows so exactly coincident axes remain legible.
      frame.direction.scale.setScalar(overlay && i === 1 ? 1.32 : 1)
    })
    if (lastOrder !== reversed) tags[1].write(reversed ? 'Y → X' : 'X → Y')
    lastOrder = reversed
  }

  function showPacket(t: number, counts?: { a: number; b: number }) {
    dots.forEach((dot, i) => {
      dot.visible = t >= 0 && t <= 1
      if (!dot.visible) return
      dot.material.color.set(t < 0.1 || t >= 0.84 ? '#d9ecf3' : i === 0 ? teal : amber)
      if (t < 0.1) {
        dot.visible = i === 0
        dot.position.copy(input).lerp(split, t / 0.1)
      } else if (t < 0.84) {
        routes[i].getPoint((t - 0.1) / 0.74, dot.position)
      } else {
        dot.visible = !counts || (i === 0 ? counts.a : counts.b) > 0
        dot.position.copy(join).lerp(outputs[i], (t - 0.84) / 0.16)
      }
    })
  }

  return { world, ground, panel, buttons, readout, frames, tags, dots, outputTags, setFrames, showPacket }
}

export function disposeObject(root: THREE.Object3D) {
  const geometry = new Set<THREE.BufferGeometry>()
  const materials = new Set<THREE.Material>()
  const textures = new Set<THREE.Texture>()
  root.traverse(node => {
    const item = node as THREE.Mesh
    if (item.geometry && !(node instanceof THREE.Sprite)) geometry.add(item.geometry)
    if (item.material) {
      for (const material of Array.isArray(item.material) ? item.material : [item.material]) materials.add(material)
    }
  })
  for (const material of materials) {
    for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value)
    material.dispose()
  }
  for (const resource of [...textures, ...geometry]) resource.dispose()
}
