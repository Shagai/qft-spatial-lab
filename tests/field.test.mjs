import test from 'node:test'
import assert from 'node:assert/strict'
import {
  SITE_COUNT, MODE_COUNTS, prepareModes, siteProbabilities, quadratureDensity, measureQuadrature,
} from '../src/labs/field/fieldModel.ts'

function near(actual, expected, tolerance = 1e-11) {
  assert.ok(Math.abs(actual - expected) < tolerance, `Expected ${actual} within ${tolerance} of ${expected}`)
}

test('normalization is preserved across momentum and site bases', () => {
  for (const count of MODE_COUNTS) {
    for (const offset of [-32, -1, 0, 31]) {
      for (const spread of [0, 0.57, 1]) {
        const modes = prepareModes(count, offset, spread)
        near(modes.reduce((sum, mode) => sum + mode.magnitude ** 2, 0), 1)
        const probabilities = siteProbabilities(modes)
        assert.equal(probabilities.length, SITE_COUNT)
        assert.ok(probabilities.every(p => p >= 0))
        near(probabilities.reduce((a, b) => a + b, 0), 1)
      }
    }
  }
})

test('one momentum eigenstate is uniform in the site basis', () => {
  for (const k of [0, 5, -12]) {
    siteProbabilities([{ index: k, magnitude: 1, phase: 2.1 }]).forEach(p => near(p, 1 / SITE_COUNT))
  }
})

test('equal-phase mode contributions focus at the translation site', () => {
  let previousPeak = 0
  for (const count of MODE_COUNTS) {
    const modes = prepareModes(count, -13, 0)
    const probabilities = siteProbabilities(modes)
    const peak = probabilities[32 - 13]
    assert.ok(peak > previousPeak)
    near(peak, Math.max(...probabilities))
    previousPeak = peak
  }
})

test('translation rotates the entire dephased probability distribution across the periodic boundary', () => {
  const fixed = siteProbabilities(prepareModes(15, 0, 0.84))
  for (const translation of [-32, 31, 64]) {
    const shifted = siteProbabilities(prepareModes(15, translation, 0.84))
    shifted.forEach((p, i) => near(p, fixed[(i - translation + SITE_COUNT) % SITE_COUNT]))
  }
})

test('relative phase changes the packet at fixed momentum probabilities', () => {
  const aligned = prepareModes(15, 0, 0)
  const scrambled = prepareModes(15, 0, 1)
  assert.deepEqual(aligned.map(mode => mode.magnitude), scrambled.map(mode => mode.magnitude))
  assert.ok(Math.max(...siteProbabilities(scrambled)) < 0.75 * Math.max(...siteProbabilities(aligned)))
})

test('oscillator quadrature densities integrate to one with the predicted variance', () => {
  for (const n of [0, 1]) {
    let mass = 0
    let variance = 0
    const dq = 0.002
    for (let i = -4000; i <= 4000; i++) {
      const q = i * dq
      const dP = quadratureDensity(n, q) * dq
      mass += dP
      variance += q * q * dP
    }
    near(mass, 1)
    near(variance, n + 0.5)
  }
  near(quadratureDensity(1, 0), 0)
})

test('repeated measurements recover the centered oscillator distributions', () => {
  let state = 167
  const random = () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0
    return state / 2 ** 32
  }
  for (const n of [0, 1]) {
    const samples = Array.from({ length: 80000 }, () => measureQuadrature(n, random))
    near(samples.reduce((sum, q) => sum + q, 0) / samples.length, 0, 0.02)
    near(samples.reduce((sum, q) => sum + q ** 2, 0) / samples.length, n + 0.5, 0.025)
  }
})
