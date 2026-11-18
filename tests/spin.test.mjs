import assert from 'node:assert/strict'
import { test } from 'node:test'
import { armRotation, detectorProbability, countDetections } from '../src/labs/spin/spinModel.ts'

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-12, String(actual))

test('opposite orders give opposite SU(2) lifts of the same classical half-turn', () => {
  const upper = armRotation(180, 1, false)
  const lower = armRotation(180, 1, true)
  upper.forEach((v, i) => close(v, -lower[i]))
  close(upper[3], -1)
  close(lower[3], 1)
})

test('a calibrated interferometer is bright in A for every pair of identical paths', () => {
  for (const angle of [0, 27, 90, 163, 180]) {
    for (const t of [0, .15, .5, .65, 1]) close(detectorProbability(angle, t, false), 1)
  }
})

test('detector probabilities match analytic angles and intermediate checkpoints', () => {
  close(detectorProbability(180, 0, true), 1)
  close(detectorProbability(180, .5, true), .5)
  close(detectorProbability(180, 1, true), 0)
  for (const angle of [11, 53, 90, 145]) {
    close(detectorProbability(angle, 1, true), 1 - Math.sin(angle * Math.PI / 360) ** 4)
  }
})

test('single-particle sampling preserves every neutron and both deterministic limits', () => {
  assert.deepEqual(countDetections(0, 100), { a: 0, b: 100 })
  assert.deepEqual(countDetections(1, 100), { a: 100, b: 0 })
  const draws = [.12, .8, .4, .6]
  assert.deepEqual(countDetections(.5, draws.length, () => draws.shift()), { a: 2, b: 2 })
})
