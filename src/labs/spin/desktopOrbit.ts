import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const cameraDirection = new THREE.Vector3(3.15, 5.4, 8.3).normalize()
const target = new THREE.Vector3(0, 0.10, 0)

export function desktopOrbit(host: HTMLElement, canvas: HTMLCanvasElement, invalidate: () => void, size: (width: number, height: number) => void, suspended = () => false) {
  const camera = new THREE.PerspectiveCamera(34, 1, 0.03, 130)
  const controls = new OrbitControls(camera, canvas)
  controls.target.copy(target)
  controls.enablePan = false
  controls.enableDamping = true
  controls.dampingFactor = 0.11
  controls.addEventListener('change', invalidate)
  controls.rotateSpeed = 0.65
  controls.minPolarAngle = 0.10
  controls.maxPolarAngle = Math.PI * 0.465
  // The apparatus envelope stays inside the viewport at both desktop and phone aspect ratios.
  const bounds = [-3.73, 3.73].flatMap(x => [-0.34, 0.9].flatMap(y => [-1.54, 1.54].map(z => new THREE.Vector3(x, y, z))))
  bounds.push(new THREE.Vector3(0, 2.06, -0.95), new THREE.Vector3(0, 2.06, 0.95))
  let fit = 10
  function fitDistance() {
    const right = new THREE.Vector3().crossVectors(camera.up, cameraDirection).normalize()
    const vertical = new THREE.Vector3().crossVectors(cameraDirection, right)
    const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5))
    return Math.max(...bounds.map(point => {
      const delta = point.clone().sub(target)
      const width = Math.abs(delta.dot(right)) / (halfHeight * camera.aspect * 0.92)
      const height = Math.abs(delta.dot(vertical)) / (halfHeight * 0.94)
      return delta.dot(cameraDirection) + Math.max(width, height)
    }))
  }
  function home() {
    controls.target.copy(target)
    camera.position.copy(target).addScaledVector(cameraDirection, fit)
    camera.lookAt(target)
    controls.update()
    invalidate()
  }
  function resize() {
    if (suspended()) return
    const { width, height } = host.getBoundingClientRect()
    if (width === 0 || height === 0) return
    const oldFit = fit
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    fit = fitDistance()
    controls.minDistance = 2.4
    controls.maxDistance = fit * 2.5
    camera.position.sub(controls.target).multiplyScalar(fit / oldFit).add(controls.target)
    size(width, height)
    invalidate()
  }
  resize()
  home()
  const observer = new ResizeObserver(resize)
  observer.observe(host)
  function onKey(event: KeyboardEvent) {
    if (suspended()) return
    const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target))
    switch (event.key) {
      case 'ArrowLeft':
        spherical.theta -= 0.12
        break
      case 'ArrowRight':
        spherical.theta += 0.12
        break
      case 'ArrowUp':
        spherical.phi -= 0.1
        break
      case 'ArrowDown':
        spherical.phi += 0.1
        break
      case '+': case '=':
        spherical.radius /= 1.12
        break
      case '-':
        spherical.radius *= 1.12
        break
      case 'Home':
        home()
        event.preventDefault()
        return
      default:
        return
    }
    spherical.phi = THREE.MathUtils.clamp(spherical.phi, controls.minPolarAngle, controls.maxPolarAngle)
    spherical.radius = THREE.MathUtils.clamp(spherical.radius, controls.minDistance, controls.maxDistance)
    camera.position.setFromSpherical(spherical).add(controls.target)
    controls.update()
    invalidate()
    event.preventDefault()
  }
  canvas.addEventListener('keydown', onKey)
  function dispose() {
    observer.disconnect()
    controls.removeEventListener('change', invalidate)
    controls.dispose()
    canvas.removeEventListener('keydown', onKey)
  }
  return { camera, controls, home, resize, dispose }
}
