export const SITE_COUNT = 64
export const MODE_COUNTS = [1, 3, 7, 15, 31] as const
export type ModeCount = (typeof MODE_COUNTS)[number]
export type Occupation = 0 | 1

export type FourierMode = {
  index: number
  magnitude: number
  phase: number
}

const tau = 2 * Math.PI

// A fixed, reproducible phase pattern lets the slider retrace the same states.
function phaseOffset(index: number) {
  let bits = Math.imul(index + SITE_COUNT, 0x45d9f3b)
  bits = Math.imul(bits ^ (bits >>> 16), 0x45d9f3b)
  return tau * (((bits ^ (bits >>> 16)) >>> 0) / 2 ** 32 - 0.5)
}

export function prepareModes(count: ModeCount, translation: number, phaseSpread: number): FourierMode[] {
  const halfBand = (count - 1) / 2
  const width = Math.max(halfBand / 1.6, 1)
  const weights = Array.from({ length: count }, (_, i) => Math.exp(-0.5 * ((i - halfBand) / width) ** 2))
  const norm = Math.hypot(...weights)
  return weights.map((weight, i) => {
    const index = i - halfBand
    return {
      index,
      magnitude: weight / norm,
      phase: -tau * index * translation / SITE_COUNT + phaseSpread * phaseOffset(index),
    }
  })
}

export function siteProbabilities(modes: FourierMode[]) {
  return Array.from({ length: SITE_COUNT }, (_, i) => {
    const site = i - SITE_COUNT / 2
    let real = 0
    let imaginary = 0
    for (const mode of modes) {
      const angle = mode.phase + tau * mode.index * site / SITE_COUNT
      real += mode.magnitude * Math.cos(angle)
      imaginary += mode.magnitude * Math.sin(angle)
    }
    return (real ** 2 + imaginary ** 2) / SITE_COUNT
  })
}

// Dimensionless q = (a + a†)/√2 with [q,p] = i.
export function quadratureDensity(occupation: Occupation, q: number) {
  const vacuum = Math.exp(-(q ** 2)) / Math.sqrt(Math.PI)
  return occupation === 0 ? vacuum : 2 * q ** 2 * vacuum
}

export function measureQuadrature(occupation: Occupation, random = Math.random) {
  // Each Cartesian component has variance 1/2. The signed radius of three
  // such components has the one-quantum density 2q² exp(−q²)/√π.
  const component = () => Math.sqrt(-Math.log(1 - random())) * Math.cos(tau * random())
  if (occupation === 0) return component()
  const radius = Math.hypot(component(), component(), component())
  return random() < 0.5 ? -radius : radius
}
