import * as THREE from 'three'

/** Indexed hardware geometry, world-space positions, and prelit vertex colors. */
type Surface = { xyz: Float32Array; rgb: Uint8Array; index: ArrayLike<number> }
const key = new THREE.Vector3(-2.5, 5, 3).normalize()
const fill = new THREE.Vector3(2, 3, -3).normalize()
const sheen = new THREE.Vector3(0, 1, 1).normalize()

export function prepareSurfaces(object: THREE.Object3D) {
  const result: Surface[] = []
  const point = new THREE.Vector3()
  const normal = new THREE.Vector3()
  const color = new THREE.Color()
  object.updateMatrixWorld(true)
  object.traverse(node => {
    if (!(node instanceof THREE.Mesh)) return
    const geometry = node.geometry as THREE.BufferGeometry
    const positions = geometry.getAttribute('position')
    const normals = geometry.getAttribute('normal')
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(node.matrixWorld)
    const indices = geometry.index?.array ?? Uint32Array.from({ length: positions.count }, (_, i) => i)
    const materials = Array.isArray(node.material) ? node.material : [node.material]
    const groups = geometry.groups.length ? geometry.groups : [{ start: 0, count: indices.length, materialIndex: 0 }]
    const xyz = new Float32Array(positions.count * 3)
    for (let i = 0; i < positions.count; i++) {
      point.fromBufferAttribute(positions, i).applyMatrix4(node.matrixWorld).toArray(xyz, i * 3)
    }
    for (const group of groups) {
      const material = materials[group.materialIndex ?? 0]
      if (!material?.color || material.opacity < 0.5) continue
      const rgb = new Uint8Array(positions.count * 3)
      for (let i = 0; i < positions.count; i++) {
        color.copy(material.color)
        if (normals && !material.isMeshBasicMaterial) {
          normal.fromBufferAttribute(normals, i).applyNormalMatrix(normalMatrix)
          const diffuse = 0.24 + 0.90 * Math.max(0, normal.dot(key)) + 0.42 * Math.max(0, normal.dot(fill))
          const reflection = 0.30 * Math.pow(Math.max(0, normal.dot(sheen)), 24)
          color.multiplyScalar(diffuse).addScalar(reflection)
        }
        color.convertLinearToSRGB()
        rgb[i * 3] = Math.min(255, color.r * 255)
        rgb[i * 3 + 1] = Math.min(255, color.g * 255)
        rgb[i * 3 + 2] = Math.min(255, color.b * 255)
      }
      result.push({ xyz, rgb, index: indices.subarray(group.start, group.start + group.count) })
    }
  })
  return result
}

// Only repaint the static instrument on a camera change. Depth testing keeps the
// ray correctly inside the coils even on browsers without a WebGL context.
export function drawSurfaces(canvas: HTMLCanvasElement, camera: THREE.PerspectiveCamera, surfaces: Surface[]) {
  const ctx = canvas.getContext('2d')!
  const w = canvas.width
  const h = canvas.height
  const pixels = ctx.createImageData(w, h)
  const depth = new Float32Array(w * h).fill(Infinity)
  const view = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse).elements
  for (const { xyz, rgb, index } of surfaces) {
    const pos = new Float32Array(xyz.length)
    for (let i = 0; i < xyz.length; i += 3) {
      const x = xyz[i], y = xyz[i + 1], z = xyz[i + 2]
      const invW = 1 / (view[3] * x + view[7] * y + view[11] * z + view[15])
      pos[i] = ((view[0] * x + view[4] * y + view[8] * z + view[12]) * invW + 1) * w / 2
      pos[i + 1] = (1 - (view[1] * x + view[5] * y + view[9] * z + view[13]) * invW) * h / 2
      pos[i + 2] = (view[2] * x + view[6] * y + view[10] * z + view[14]) * invW
    }
    for (let n = 0; n < index.length; n += 3) {
      const a = index[n] * 3, b = index[n + 1] * 3, c = index[n + 2] * 3
      const x0 = pos[a], y0 = pos[a + 1]
      const x1 = pos[b], y1 = pos[b + 1], x2 = pos[c], y2 = pos[c + 1]
      const det = (x1 - x0) * (y2 - y0) - (y1 - y0) * (x2 - x0)
      if (det >= -1e-5) continue
      const xMin = Math.max(0, Math.floor(Math.min(x0, x1, x2)))
      const xMax = Math.min(w - 1, Math.ceil(Math.max(x0, x1, x2)))
      const yMin = Math.max(0, Math.floor(Math.min(y0, y1, y2)))
      const yMax = Math.min(h - 1, Math.ceil(Math.max(y0, y1, y2)))
      for (let y = yMin; y <= yMax; y++) {
        for (let x = xMin; x <= xMax; x++) {
          const u = ((x + 0.5 - x0) * (y2 - y0) - (y + 0.5 - y0) * (x2 - x0)) / det
          const v = ((x1 - x0) * (y + 0.5 - y0) - (y1 - y0) * (x + 0.5 - x0)) / det
          const t = 1 - u - v
          if (Math.min(u, v, t) < 0) continue
          const z = t * pos[a + 2] + u * pos[b + 2] + v * pos[c + 2]
          const at = y * w + x
          if (z >= depth[at]) continue
          depth[at] = z
          for (let ch = 0; ch < 3; ch++) pixels.data[4 * at + ch] = t * rgb[a + ch] + u * rgb[b + ch] + v * rgb[c + ch]
          pixels.data[4 * at + 3] = 255
        }
      }
    }
  }
  ctx.putImageData(pixels, 0, 0)
}
