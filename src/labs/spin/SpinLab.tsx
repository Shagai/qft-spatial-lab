import { useEffect, useState } from 'react'
import SpinScene from './SpinScene'
import { countDetections, detectorProbability } from './spinModel'
import './spin.css'

type Prediction = 'A' | 'B' | 'Equal'
const zero = { a: 0, b: 0 }
const asPercent = (v: number) => String(Number((100 * v).toFixed(1))) + '%'

export default function SpinLab({ embedded = false }: { embedded?: boolean }) {
  const [angle, setAngle] = useState(180)
  const [progress, setProgress] = useState(1)
  const [reversed, setReversed] = useState(true)
  const [overlay, setOverlay] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [counts, setCounts] = useState(zero)
  const probability = detectorProbability(angle, progress, reversed)
  const total = counts.a + counts.b
  const expected = Math.abs(probability - .5) < 1e-7 ? 'Equal' : probability > .5 ? 'A' : 'B'

  useEffect(() => {
    if (!playing) return
    let frame = 0
    const start = performance.now()
    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / 3700)
      setProgress(t)
      if (t < 1) frame = requestAnimationFrame(animate)
      else setPlaying(false)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [playing])

  function clearTrial() {
    setPlaying(false)
    setCounts(zero)
    setPrediction(null)
  }

  function changeOrder(next: boolean) {
    if (next === reversed) return
    clearTrial()
    setReversed(next)
  }

  function run() {
    setPlaying(false)
    const batch = countDetections(probability, 100)
    setCounts(c => ({ a: c.a + batch.a, b: c.b + batch.b }))
  }

  const Title = embedded ? 'h3' : 'h1'
  return (
    <section className="spin-lab" aria-label="Spinor interferometer experiment">
      <header className="spin-title">
        <Title>The spinor interferometer</Title>
        <p>Can two rotations leave the axes aligned and send the neutron to a different detector?</p>
      </header>
      <div className="spin-workbench">
        <div className="spin-visual">
          <div className="spin-viewport">
            <SpinScene angle={angle} progress={progress} reversed={reversed} overlay={overlay}
              onSwap={() => changeOrder(!reversed)} onRun={run} counts={counts} pulse={total} />
          </div>
          <div className="spin-transport">
            <button type="button" className="spin-replay" aria-label={playing ? 'Pause rotations' : 'Replay rotations'} onClick={() => {
              if (playing) setPlaying(false)
              else { clearTrial(); setProgress(0); setPlaying(true) }
            }}>{playing ? 'Ⅱ Pause' : '▷ Replay'}</button>
            <label>Rotation progress <input aria-label="Rotation progress" type="range" min="0" max="100" value={Math.round(progress * 100)}
              onChange={e => { clearTrial(); setProgress(Number(e.target.value) / 100) }} /></label>
            <output>{Math.round(progress * 100)}%</output>
          </div>
        </div>
        <aside className="spin-settings" aria-label="Apparatus controls">
          <h2>Set up the arms</h2>
          <div className="spin-arm"><span className="spin-dot teal" /> Upper arm <b>X → Y</b></div>
          <div className="spin-arm"><span className="spin-dot amber" /> Lower arm <b>{reversed ? 'Y → X' : 'X → Y'}</b></div>
          <div className="spin-segment" aria-label="Lower arm order">
            <button aria-pressed={!reversed} onClick={() => changeOrder(false)}>Same order</button>
            <button aria-pressed={reversed} onClick={() => changeOrder(true)}>Reversed order</button>
          </div>
          <label className="spin-angle">Angle per rotation <output>{angle}°</output>
            <input type="range" min="0" max="180" step="1" value={angle} aria-label="Angle per rotation"
              onChange={e => { clearTrial(); setAngle(Number(e.target.value)) }} />
          </label>
          <label className="spin-check"><input type="checkbox" checked={overlay} onChange={e => setOverlay(e.target.checked)} /> Overlay the two frames</label>
          <p className="spin-help">Each rotator station applies two pulses about fixed laboratory axes X and Y. Compare the final frames, then predict the brighter detector.</p>
        </aside>
      </div>
      <div className="spin-measure">
        <div className="spin-predict">
          <h2>Predict the brighter detector</h2>
          <div className="spin-choices" role="group" aria-label="Prediction">
            {(['A', 'Equal', 'B'] as const).map(p => <button key={p} aria-pressed={prediction === p} disabled={total > 0}
              onClick={() => setPrediction(p)}>{p === 'Equal' ? 'Equal counts' : 'Detector ' + p}</button>)}
          </div>
          <button className="spin-fire" type="button" onClick={run}>Run 100 neutrons <span aria-hidden="true">→</span></button>
          {total > 0 && <button className="spin-clear" onClick={clearTrial}>Clear trial</button>}
        </div>
        <div className="spin-readout" aria-live="polite">
          <h2>Detector counts</h2>
          <div className="spin-counts"><span>A <strong>{counts.a}</strong></span><span>B <strong>{counts.b}</strong></span></div>
          <div className={'spin-meter' + (total ? ' measured' : '')}>
            {total > 0 && <i style={{ width: asPercent(counts.a / total) }} />}
          </div>
          <p>{total ? (prediction ? (prediction === expected ? 'Your prediction matches the model. ' : 'The model predicts ' + (expected === 'Equal' ? 'equal rates. ' : 'a brighter detector ' + expected + '. ')) : '') +
            'Expected A ' + asPercent(probability) + ' · B ' + asPercent(1 - probability) : 'Ready. Equal paths are calibrated to send every neutron to A.'}</p>
        </div>
      </div>
      <details className="spin-derivation">
        <summary>Derive the detector probabilities</summary>
        <p>Each splitter is balanced. The phase bias between the arms is zero. If their output spin states are u and v, their amplitudes at A add as (u + v)/2 and at B subtract as (u − v)/2.</p>
        <div className="spin-equation">P(A) = ½ [1 + Re ⟨u | v⟩]<br />P(B) = 1 − P(A)</div>
        <p>At 180°, each rotation acts as −i times its Pauli matrix. X followed by Y gives +iσ<sub>z</sub>. Y followed by X gives −iσ<sub>z</sub>. The three spatial axes end in identical orientations, but the spin amplitudes differ by a sign. Recombination turns that relative sign into a detector count.</p>
        <p>After both rotations of angle θ, the reversed-order setting gives P(A) = 1 − sin⁴(θ/2). Try 90° and predict the mean count in 100 runs.</p>
      </details>
    </section>
  )
}
