import { useEffect, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { desktopOrbit } from './desktopOrbit'
import { buildExperiment, buildRays, disposeObject } from './spinGraphics'
import { drawSurfaces, prepareSurfaces } from './softwareView'

interface Props {
  angle: number
  progress: number
  reversed: boolean
  overlay: boolean
  counts?: { a: number; b: number }
  pulse?: number
  resetRef: RefObject<() => void>
  onError: () => void
}

export default function SpinFallback(props: Props) {
  const host = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const live = useRef(props)
  const { resetRef } = props
  useEffect(() => { live.current = props }, [props])
  useEffect(() => {
    const element = canvas.current
    const stage = host.current
    const ctx = element?.getContext('2d')
    if (!element || !stage || !ctx) return
    const base = document.createElement('canvas')
    let cameraDirty = true
    let disposed = false
    const dpr = Math.min(1.5, window.devicePixelRatio || 1)
    const { camera, controls, home, dispose } = desktopOrbit(stage, element, () => { cameraDirty = true }, (width, height) => {
      base.width = element.width = Math.max(1, Math.round(width * dpr))
      base.height = element.height = Math.max(1, Math.round(height * dpr))
    })
    resetRef.current = home
    const rays = buildRays()
    const surfaces = prepareSurfaces(rays)
    disposeObject(rays)
    const experiment = buildExperiment()
    const abort = new AbortController()
    const modelRoot = `${import.meta.env.BASE_URL}models/`
    async function load() {
      try {
        const response = await fetch(`${modelRoot}interferometer.glb`, { signal: abort.signal })
        if (!response.ok) throw new Error('Model unavailable')
        const gltf = await new GLTFLoader().parseAsync(await response.arrayBuffer(), modelRoot)
        if (!disposed) surfaces.push(...prepareSurfaces(gltf.scene))
        disposeObject(gltf.scene)
        cameraDirty = true
      } catch {
        if (!disposed) live.current.onError()
      }
    }
    void load()
    const point = new THREE.Vector3()
    const position = new THREE.Vector3()
    const axis = new THREE.Vector3()
    const colors = ['#ff818b', '#81e5b0', '#8cbaff']
    const tints = ['#69f5df', '#ffba64']
    function project(p: THREE.Vector3) {
      point.copy(p).project(camera)
      return { x: (1 + point.x) * base.width / 2, y: (1 - point.y) * base.height / 2 }
    }
    function drawLabel(p: THREE.Vector3, value: string, color: string) {
      if (!ctx) return
      const at = project(p)
      const size = Math.min(15, Math.max(10, base.width / (56 * dpr))) * dpr
      ctx.font = `600 ${size}px ui-monospace, monospace`
      const w = ctx.measureText(value).width + 12 * dpr
      const h = size + 8 * dpr
      ctx.fillStyle = '#12232d'
      ctx.strokeStyle = color
      ctx.lineWidth = 0.75 * dpr
      ctx.fillRect(at.x - w / 2, at.y - h / 2, w, h)
      ctx.strokeRect(at.x - w / 2, at.y - h / 2, w, h)
      ctx.fillStyle = color
      ctx.fillText(value, at.x, at.y + dpr)
    }
    function drawFrame(i: number) {
      if (!ctx) return
      const frame = experiment.frames[i]
      const q = frame.direction.quaternion
      const origin = frame.direction.getWorldPosition(position)
      const at = project(origin)
      const length = 0.45 * frame.direction.scale.x
      for (let a = 0; a < 3; a++) {
        axis.set(Number(a === 0), Number(a === 1), Number(a === 2)).applyQuaternion(q)
        const end = project(axis.multiplyScalar(length).add(origin))
        const dx = end.x - at.x, dy = end.y - at.y
        const heading = Math.atan2(dy, dx)
        const tip = 6.5 * dpr
        ctx.strokeStyle = ctx.fillStyle = colors[a]
        ctx.lineWidth = 2.2 * dpr
        ctx.beginPath()
        ctx.moveTo(at.x, at.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(end.x, end.y)
        ctx.lineTo(end.x - tip * Math.cos(heading + 0.46), end.y - tip * Math.sin(heading + 0.46))
        ctx.lineTo(end.x - tip * Math.cos(heading - 0.46), end.y - tip * Math.sin(heading - 0.46))
        ctx.fill()
        const labelX = end.x + 7 * dpr * Math.cos(heading), labelY = end.y + 7 * dpr * Math.sin(heading)
        ctx.font = `600 ${11 * dpr}px ui-monospace, monospace`
        ctx.strokeStyle = '#12222a'
        ctx.lineWidth = 2 * dpr
        ctx.strokeText('xyz'[a], labelX, labelY)
        ctx.fillText('xyz'[a], labelX, labelY)
      }
      ctx.fillStyle = tints[i]
      ctx.beginPath()
      ctx.arc(at.x, at.y, 3.5 * dpr, 0, Math.PI * 2)
      ctx.fill()
    }
    let previous: Props | null = null
    let request = 0
    let packetCounts: Props['counts']
    let pulseAt = -Infinity
    let pulseVisible = false
    function paint(now: number) {
      request = requestAnimationFrame(paint)
      if (!element || !ctx || document.hidden) return
      const moved = controls.update()
      const p = live.current
      if (p !== previous) {
        experiment.setFrames(p.angle, p.progress, p.reversed, p.overlay)
        if (previous && (p.pulse ?? 0) > (previous.pulse ?? 0)) {
          pulseAt = now
          packetCounts = p.counts && { a: p.counts.a - (previous.counts?.a ?? 0), b: p.counts.b - (previous.counts?.b ?? 0) }
        }
        if ((p.pulse ?? 0) < (previous?.pulse ?? 0)) pulseAt = -Infinity
      }
      const t = (now - pulseAt) / 1050
      if (!cameraDirty && !moved && p === previous && t > 1 && !pulseVisible) return
      previous = p
      if (cameraDirty || moved) {
        camera.updateMatrixWorld()
        drawSurfaces(base, camera, surfaces)
        cameraDirty = false
      }
      const w = base.width, h = base.height
      ctx.clearRect(0, 0, w, h)
      ctx.lineWidth = 0.7 * dpr
      ctx.strokeStyle = '#263a45'
      for (let j = -8; j <= 8; j++) {
        ctx.beginPath()
        const p1 = project(position.set(j, -0.34, -7)), p2 = project(position.set(j, -0.34, 7))
        const p3 = project(position.set(-7, -0.34, j)), p4 = project(position.set(7, -0.34, j))
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.moveTo(p3.x, p3.y)
        ctx.lineTo(p4.x, p4.y)
        ctx.stroke()
      }
      ctx.save()
      ctx.fillStyle = ctx.shadowColor = '#08141b'
      ctx.shadowBlur = 13 * dpr
      ctx.shadowOffsetY = 3 * dpr
      ctx.beginPath()
      for (const [i, corner] of [[-3.60, -1.42], [3.60, -1.42], [3.60, 1.42], [-3.60, 1.42]].entries()) {
        const at = project(position.set(corner[0], -0.34, corner[1]))
        if (i === 0) ctx.moveTo(at.x, at.y)
        else ctx.lineTo(at.x, at.y)
      }
      ctx.closePath()
      ctx.fill()
      ctx.restore()
      ctx.drawImage(base, 0, 0)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (let i = 0; i < 2; i++) {
        drawFrame(i)
        drawLabel(experiment.tags[i].sprite.position, i === 1 && p.reversed ? 'Y → X' : 'X → Y', tints[i])
        drawLabel(experiment.outputTags[i].position, i === 0 ? 'A' : 'B', '#d1e3e7')
      }
      pulseVisible = t <= 1
      experiment.showPacket(t, packetCounts)
      experiment.dots.forEach(dot => {
        if (!dot.visible) return
        const at = project(dot.position)
        ctx.fillStyle = ctx.shadowColor = dot.material.color.getStyle()
        ctx.shadowBlur = 8 * dpr
        ctx.beginPath()
        ctx.arc(at.x, at.y, 4 * dpr, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })
    }
    request = requestAnimationFrame(paint)
    return () => {
      disposed = true
      abort.abort()
      cancelAnimationFrame(request)
      dispose()
      disposeObject(experiment.world)
      resetRef.current = () => {}
    }
  }, [resetRef])
  return <div ref={host} className="spin-canvas"><canvas ref={canvas} tabIndex={0} role="img" aria-label="Interactive 3D neutron interferometer. Drag or use arrow keys to orbit, plus or minus to zoom, and Home to reset. The upper teal and lower amber arms carry two colored spatial frames." /></div>
}
