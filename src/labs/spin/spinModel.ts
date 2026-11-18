/** U(q) = w I - i (x σx + y σy + z σz), in a fixed laboratory frame. */
export type Rotation = readonly [number, number, number, number]

function compose([s, a, b, c]: Rotation, [t, x, y, z]: Rotation): Rotation {
  return [
    s*t - a*x - b*y - c*z,
    s*x + a*t + b*z - c*y,
    s*y - a*z + b*t + c*x,
    s*z + a*y - b*x + c*t,
  ]
}

function turn(axis: 'x' | 'y', degrees: number): Rotation {
  const half = degrees * Math.PI / 360
  const v = Math.sin(half)
  return [Math.cos(half), axis === 'x' ? v : 0, axis === 'y' ? v : 0, 0]
}

export function armRotation(angle: number, progress: number, reverse: boolean): Rotation {
  const fraction = Math.min(1, Math.max(0, progress))
  const first = turn(reverse ? 'y' : 'x', angle * Math.min(1, fraction * 2))
  const second = turn(reverse ? 'x' : 'y', angle * Math.max(0, fraction * 2 - 1))
  return compose(second, first)
}

export function detectorProbability(angle: number, progress: number, reversed: boolean) {
  const upper = armRotation(angle, progress, false)
  const lower = armRotation(angle, progress, reversed)
  // At zero path-phase bias Re <ψ|U_upper† U_lower|ψ> is the scalar of the
  // relative SU(2) rotation, independent of the normalized input spin state.
  const overlap = upper.reduce((sum, value, i) => sum + value * lower[i], 0)
  return Math.max(0, Math.min(1, (1 + overlap) / 2))
}

export function countDetections(probabilityA: number, shots: number, random = Math.random) {
  let a = 0
  for (let i = 0; i < shots; i++) {
    if (random() < probabilityA) a++
  }
  return { a, b: shots - a }
}
