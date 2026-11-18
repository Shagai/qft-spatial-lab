import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { desktopOrbit } from './desktopOrbit'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { buildExperiment, disposeObject } from './spinGraphics'
import SpinFallback from './SpinFallback'
import SpinSchematic from './SpinSchematic'
import './spinScene.css'

interface SceneProps {
  angle: number
  progress: number
  reversed: boolean
  overlay: boolean
  onSwap: () => void
  onRun: () => void
  counts?: { a: number; b: number }
  pulse?: number
}

type XRStatus = 'unavailable' | 'ready' | 'starting' | 'active'
const canvasDescription = 'Orbit the neutron interferometer. The upper teal and lower amber beams pass through spin rotators. Colored x, y and z arrows show each spatial orientation. Use the arrow keys to orbit, plus or minus to zoom, and Home to reset.'

export default function SpinScene(props: SceneProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const liveProps = useRef(props)
  const resetCamera = useRef<() => void>(() => {})
  const toggleVR = useRef<() => void>(() => {})
  const [xr, setXR] = useState<XRStatus>('unavailable')
  const [xrNotice, setXRNotice] = useState('')
  const [fallback, setFallback] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => { liveProps.current = props }, [props])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let disposed = false
    let dirty = true
    let pageVisible = true
    let renderer: THREE.WebGLRenderer
    try {
      const surface = document.createElement('canvas')
      const context = surface.getContext('webgl2', { antialias: true, alpha: false })
      if (!context) throw new Error('WebGL 2 unavailable')
      renderer = new THREE.WebGLRenderer({ canvas: surface, context })
    } catch {
      queueMicrotask(() => { if (!disposed) setFallback('Software-rendered 3D · Drag to orbit') })
      return () => { disposed = true }
    }

    const canvas = renderer.domElement
    canvas.tabIndex = 0
    canvas.setAttribute('role', 'img')
    canvas.setAttribute('aria-label', canvasDescription)
    host.appendChild(canvas)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.xr.enabled = true
    renderer.xr.setReferenceSpaceType('local')
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#11202a')
    const { camera, controls, home, resize, dispose: disposeOrbit } = desktopOrbit(host, canvas, () => { dirty = true }, (width, height) => {
      if (!renderer.xr.isPresenting) renderer.setSize(width, height, false)
    }, () => renderer.xr.isPresenting)
    resetCamera.current = home
    const experiment = buildExperiment()
    scene.add(experiment.world)
    const room = new RoomEnvironment()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const environment = pmrem.fromScene(room, 0.045)
    scene.environment = environment.texture
    scene.environmentIntensity = 0.72
    room.dispose()
    pmrem.dispose()
    scene.add(new THREE.HemisphereLight('#e8f7ff', '#56616d', 1.9))
    const key = new THREE.DirectionalLight('#fff0dc', 2.6)
    key.position.set(-2.5, 5, 3)
    const rim = new THREE.DirectionalLight('#b8e6fc', 1.9)
    rim.position.set(2, 3, -3)
    scene.add(key, rim)

    const intersection = new IntersectionObserver(([entry]) => {
      pageVisible = entry.isIntersecting
      if (pageVisible) dirty = true
    })
    intersection.observe(host)

    const abort = new AbortController()
    const modelRoot = `${import.meta.env.BASE_URL}models/`
    async function addModel() {
      try {
        const response = await fetch(`${modelRoot}interferometer.glb`, { signal: abort.signal })
        if (!response.ok) throw new Error('Model unavailable')
        const asset = await new GLTFLoader().parseAsync(await response.arrayBuffer(), modelRoot)
        if (disposed) disposeObject(asset.scene)
        else {
          experiment.world.add(asset.scene)
          dirty = true
        }
      } catch {
        if (!disposed) setFallback('Live beam schematic')
      }
    }
    void addModel()

    function onLost(event: Event) {
      event.preventDefault()
      if (!disposed) setFallback('Software-rendered 3D · Drag to orbit')
    }
    function onRestored() {
      if (disposed) return
      setFallback('')
      setAttempt(n => n + 1)
    }
    canvas.addEventListener('webglcontextlost', onLost)
    canvas.addEventListener('webglcontextrestored', onRestored)

    let session: XRSession | null = null
    let requesting = false
    let positionBench = false
    const desktopPosition = camera.position.clone()
    const inputs = [renderer.xr.getController(0), renderer.xr.getController(1)]
    const raycaster = new THREE.Raycaster()
    const pick = (input: typeof inputs[number]) => {
      input.updateWorldMatrix(true, false)
      experiment.panel.updateWorldMatrix(true, true)
      raycaster.setFromXRController(input)
      return raycaster.intersectObjects(experiment.buttons, false)[0]
    }
    const listeners = inputs.map(input => {
      const beam = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 0, -1)]),
        new THREE.LineBasicMaterial({ color: '#add7dd', transparent: true, opacity: 0.7 }),
      )
      input.add(beam)
      scene.add(input)
      const select = () => {
        const hit = pick(input)
        if (!session || !hit) return
        if (hit.object === experiment.buttons[0]) liveProps.current.onSwap()
        else liveProps.current.onRun()
      }
      input.addEventListener('select', select)
      return { beam, select }
    })

    function entered() {
      if (disposed) return
      controls.enabled = false
      experiment.world.visible = false
      experiment.ground.visible = false
      experiment.panel.visible = true
      positionBench = true
      setXR('active')
    }
    function exited() {
      session = null
      if (disposed) return
      controls.enabled = true
      experiment.world.visible = true
      experiment.world.position.set(0, 0, 0)
      experiment.world.rotation.set(0, 0, 0)
      experiment.world.scale.setScalar(1)
      experiment.ground.visible = true
      experiment.panel.visible = false
      positionBench = false
      camera.position.copy(desktopPosition)
      camera.lookAt(controls.target)
      camera.fov = 34
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      resize()
      controls.update()
      dirty = true
      setXR('ready')
    }
    renderer.xr.addEventListener('sessionstart', entered)
    renderer.xr.addEventListener('sessionend', exited)
    const xrSystem = navigator.xr
    function probeXR() {
      if (!xrSystem || !window.isSecureContext) return
      void xrSystem.isSessionSupported('immersive-vr').then(supported => {
        if (!disposed && !session && !requesting) setXR(supported ? 'ready' : 'unavailable')
      }).catch(() => {})
    }
    probeXR()
    xrSystem?.addEventListener('devicechange', probeXR)
    toggleVR.current = async () => {
      if (!xrSystem || requesting || disposed) return
      if (session) {
        await session.end().catch(() => {})
        return
      }
      requesting = true
      setXR('starting')
      setXRNotice('')
      try {
        const next = await xrSystem.requestSession('immersive-vr', { optionalFeatures: ['local-floor'] })
        if (disposed) {
          await next.end()
          return
        }
        desktopPosition.copy(camera.position)
        session = next
        await renderer.xr.setSession(next)
      } catch {
        const failed = session
        session = null
        await failed?.end().catch(() => {})
        if (!disposed) {
          setXR('ready')
          setXRNotice('VR could not start. Check the headset connection and browser permission.')
        }
      } finally {
        requesting = false
      }
    }

    let last: SceneProps | undefined
    let lastPulse = liveProps.current.pulse ?? 0
    let packetStart = -Infinity
    let packetVisible = false
    renderer.setAnimationLoop((now, frame) => {
      const immersive = renderer.xr.isPresenting
      if (disposed || (!immersive && (!pageVisible || document.hidden))) return
      if (immersive && positionBench && frame) {
        const space = renderer.xr.getReferenceSpace()
        const pose = space && frame.getViewerPose(space)
        if (pose) {
          const { position, orientation } = pose.transform
          const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(new THREE.Quaternion(orientation.x, orientation.y, orientation.z, orientation.w))
          forward.y = 0
          if (forward.lengthSq() < 0.0001) forward.set(0, 0, -1)
          else forward.normalize()
          experiment.world.position.set(position.x, position.y - 0.48, position.z).addScaledVector(forward, 1.08)
          experiment.world.rotation.y = Math.atan2(-forward.x, -forward.z)
          experiment.world.scale.setScalar(0.215)
          experiment.world.visible = true
          positionBench = false
        }
      }
      if (immersive) {
        const hovered = new Set<THREE.Object3D>()
        inputs.forEach((input, i) => {
          if (!input.visible) return
          const hit = pick(input)
          listeners[i].beam.scale.z = hit?.distance ?? 1.5
          if (hit) hovered.add(hit.object)
        })
        for (const button of experiment.buttons) button.material.color.set(hovered.has(button) ? '#ffffff' : '#bdcfd0')
      }
      const p = liveProps.current
      if (p !== last) {
        experiment.setFrames(p.angle, p.progress, p.reversed, p.overlay)
        if (p.counts && (p.counts.a !== last?.counts?.a || p.counts.b !== last?.counts?.b)) {
          experiment.readout.write(`A  ${p.counts.a}    B  ${p.counts.b}`)
        }
        const pulse = p.pulse ?? (p.counts ? p.counts.a + p.counts.b : 0)
        if (pulse > lastPulse) packetStart = now
        if (pulse < lastPulse) packetStart = -Infinity
        lastPulse = pulse
        last = p
        dirty = true
      }
      const packetTime = (now - packetStart) / 1050
      if (packetTime <= 1 || packetVisible) {
        experiment.showPacket(packetTime, p.counts)
        packetVisible = packetTime <= 1
        dirty = true
      }
      const moved = !immersive && controls.update()
      if (immersive || dirty || moved) renderer.render(scene, camera)
      dirty = false
    })

    return () => {
      disposed = true
      abort.abort()
      resetCamera.current = () => {}
      toggleVR.current = () => {}
      renderer.setAnimationLoop(null)
      xrSystem?.removeEventListener('devicechange', probeXR)
      renderer.xr.removeEventListener('sessionstart', entered)
      renderer.xr.removeEventListener('sessionend', exited)
      inputs.forEach((input, i) => input.removeEventListener('select', listeners[i].select))
      disposeOrbit()
      intersection.disconnect()
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      canvas.remove()
      const cleanGL = () => {
        disposeObject(scene)
        environment.dispose()
        renderer.dispose()
        renderer.forceContextLoss()
      }
      if (session) void session.end().catch(() => {}).finally(cleanGL)
      else cleanGL()
    }
  }, [attempt])

  const canVR = !fallback && (xr === 'active' || xr === 'ready')
  return (
    <div className="spin-stage">
      <div ref={hostRef} className="spin-canvas" hidden={Boolean(fallback)} />
      {fallback && (fallback === 'Live beam schematic' ? <SpinSchematic {...props} /> : <SpinFallback {...props} resetRef={resetCamera} onError={() => setFallback('Live beam schematic')} />)}
      <div className="spin-stage-tools">
        <span>{fallback || 'Drag to orbit · Scroll or pinch to zoom'}</span>
        {fallback !== 'Live beam schematic' && <button type="button" onClick={() => resetCamera.current()}>Reset view</button>}
        {fallback === 'Live beam schematic' ? <button type="button" onClick={() => {
          setFallback('')
          setAttempt(n => n + 1)
        }}>Retry 3D</button> : <>
          <button type="button" disabled={!canVR} title={canVR ? 'Open the immersive tabletop' : 'Use a WebXR-compatible headset browser over HTTPS'} onClick={() => toggleVR.current()}>
            {xr === 'active' ? 'Exit VR' : xr === 'starting' ? 'Starting VR…' : xr === 'ready' ? 'Enter VR' : 'VR unavailable'}
          </button>
        </>}
      </div>
      {xrNotice && <p className="spin-xr-status" role="status">{xrNotice}</p>}
    </div>
  )
}
