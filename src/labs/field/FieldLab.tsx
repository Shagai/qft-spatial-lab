import { useId, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  MODE_COUNTS, SITE_COUNT, measureQuadrature, prepareModes, quadratureDensity, siteProbabilities,
} from './fieldModel'
import type { FourierMode, ModeCount, Occupation } from './fieldModel'
import './field.css'

const chart = { left: 42, right: 393, top: 15, base: 149 }

function fmt(value: number) {
  return String(value).replace('-', '−')
}

function Plot({ title, subtitle, tone, children }: {
  title: string
  subtitle: string
  tone: 'amber' | 'mint'
  children: ReactNode
}) {
  return (
    <figure className={`field-plot field-plot--${tone}`}>
      <figcaption><span className="field-plot-dot" />{title}<small>{subtitle}</small></figcaption>
      {children}
    </figure>
  )
}

function Spectrum({ modes }: { modes: FourierMode[] }) {
  const bound = Math.max(2, (modes.length - 1) / 2)
  const x = (k: number) => chart.left + (k + bound + 1) * (chart.right - chart.left) / (2 * bound + 2)
  const y = (amplitude: number) => 108 - 91 * amplitude
  const tickIndices = Array.from(new Set([-bound, 0, bound]))
  return (
    <Plot title="Momentum modes" subtitle="|cₖ| · phase" tone="amber">
      <svg viewBox="0 0 414 207" role="img" aria-label={`${modes.length} Fourier amplitude${modes.length === 1 ? '' : 's'}. A dial below each stem shows its phase.`}>
        {[0, 0.5, 1].map(tick => (
          <g key={tick}>
            <line className="field-gridline" x1={chart.left} x2={chart.right} y1={y(tick)} y2={y(tick)} />
            <text className="field-axis" x={chart.left - 8} y={y(tick) + 4} textAnchor="end">{tick}</text>
          </g>
        ))}
        {tickIndices.map(tick => (
          <g key={tick}>
            <line className="field-gridline" x1={x(tick)} x2={x(tick)} y1={y(1)} y2="155" />
            <text className="field-axis" x={x(tick)} y="174" textAnchor="middle">{fmt(tick)}</text>
          </g>
        ))}
        {modes.map(mode => {
          const px = x(mode.index)
          const py = y(mode.magnitude)
          const radius = Math.min(8, (x(1) - x(0)) * 0.39)
          return (
            <g key={mode.index}>
              <line className="field-stem" x1={px} x2={px} y1={y(0)} y2={py} />
              <circle className="field-amplitude-dot" cx={px} cy={py} r={modes.length > 15 ? 2.5 : 3.8} />
              <circle className="field-phase-ring" cx={px} cy="140" r={radius} />
              <line className="field-phase-hand" x1={px} y1="140" x2={px + radius * Math.cos(mode.phase)} y2={140 - radius * Math.sin(mode.phase)} />
            </g>
          )
        })}
        <text className="field-axis" x="29" y="145" textAnchor="middle">φ</text>
        <text className="field-axis-title" x="218" y="197" textAnchor="middle">mode index k</text>
      </svg>
    </Plot>
  )
}

function SitePlot({ probabilities }: { probabilities: number[] }) {
  const peak = Math.max(...probabilities)
  const scale = Math.ceil(peak * 100 / 2) * 2 / 100
  const x = (index: number) => chart.left + index * (chart.right - chart.left) / (SITE_COUNT - 1)
  const y = (prob: number) => chart.base - prob / scale * (chart.base - chart.top)
  const points = probabilities.map((p, i) => `${x(i).toFixed(2)},${y(p).toFixed(2)}`).join(' ')
  return (
    <Plot title="Site probability" subtitle="Pⱼ = |ψⱼ|²" tone="mint">
      <svg viewBox="0 0 414 207" role="img" aria-label={`Probabilities across 64 sites. Peak ${(100 * peak).toFixed(1)} percent.`}>
        {[0, scale / 2, scale].map(tick => (
          <g key={tick}>
            <line className="field-gridline" x1={chart.left} x2={chart.right} y1={y(tick)} y2={y(tick)} />
            <text className="field-axis" x={chart.left - 7} y={y(tick) + 4} textAnchor="end">{Math.round(100 * tick)}%</text>
          </g>
        ))}
        {[-32, -16, 0, 16, 31].map(site => (
          <g key={site}>
            <line className="field-gridline" x1={x(site + 32)} x2={x(site + 32)} y1={chart.top} y2={chart.base} />
            <text className="field-axis" x={x(site + 32)} y="174" textAnchor="middle">{fmt(site)}</text>
          </g>
        ))}
        <polygon className="field-prob-area" points={`${chart.left},${chart.base} ${points} ${chart.right},${chart.base}`}/>
        <polyline className="field-prob-line" points={points} />
        {probabilities.map((p, i) => <circle className="field-site" key={i} cx={x(i)} cy={y(p)} r="1.65" />)}
        <text className="field-axis-title" x="218" y="197" textAnchor="middle">lattice site j</text>
      </svg>
    </Plot>
  )
}

function Wavepacket() {
  const [count, setCount] = useState<ModeCount>(7)
  const [translation, setTranslation] = useState(0)
  const [spread, setSpread] = useState(0)
  const modes = useMemo(() => prepareModes(count, translation, spread / 100), [count, translation, spread])
  const probabilities = useMemo(() => siteProbabilities(modes), [modes])
  const total = probabilities.reduce((sum, value) => sum + value, 0)
  const peak = Math.max(...probabilities)
  const id = useId()
  return (
    <div>
      <div className="field-charts">
        <Spectrum modes={modes} />
        <SitePlot probabilities={probabilities} />
      </div>
      <div className="field-controls">
        <fieldset className="field-mode-control">
          <legend>Active modes</legend>
          <div className="field-choices">{MODE_COUNTS.map(n => <button key={n} type="button" aria-pressed={count === n} onClick={() => setCount(n)}>{n}</button>)}</div>
        </fieldset>
        <div className="field-slider">
          <label htmlFor={`${id}-translate`}>Translation <output>{fmt(translation)} sites</output></label>
          <input id={`${id}-translate`} type="range" min="-32" max="31" value={translation} disabled={count === 1}
            onChange={e => setTranslation(Number(e.target.value))} />
        </div>
        <div className="field-slider">
          <label htmlFor={`${id}-spread`}>Phase spread <output>{spread}%</output></label>
          <input id={`${id}-spread`} type="range" min="0" max="100" value={spread} disabled={count === 1}
            onChange={e => setSpread(Number(e.target.value))} />
        </div>
      </div>
      <div className="field-readout">
        <span>Peak site probability <b>{(100 * peak).toFixed(2)}%</b></span>
        <span>Total probability <b>{total.toFixed(3)}</b></span>
      </div>
      <p className="field-hint">{count === 1
        ? 'A single momentum mode gives every site the same probability. Add modes to localize the excitation.'
        : 'Each dial shows one mode’s phase, with zero pointing right. Add modes to narrow the peak, then spread their phases and watch the same amplitudes interfere differently.'}</p>
      <details className="field-detail">
        <summary>How the modes make a particle</summary>
        <p>A free field on this periodic lattice has 64 independent momentum oscillators. The state
          {' '}<span className="field-math">|ψ⟩ = ∑ₖ cₖ aₖ†|0⟩</span> distributes one quantum among them.
          Each component has exactly one excitation. The amber stems show the magnitudes of its normalized coefficients.</p>
        <p>With sites numbered −32 through 31, the discrete Fourier transform gives the site amplitude
          {' '}<span className="field-math">ψⱼ = (1/√64) ∑ₖ cₖ exp(2πikj/64)</span>.
          Each green dot gives the probability |ψⱼ|² for a measurement in this discrete one-particle basis. The line connects neighboring samples.
          Translating by s sites multiplies cₖ by exp(−2πiks/64), so the pattern wraps across the edges.</p>
      </details>
    </div>
  )
}

const binWidth = 0.25
const qMin = -4
const qMax = 4
const bins = (qMax - qMin) / binWidth

function Oscillator() {
  const [occupation, setOccupation] = useState<Occupation>(0)
  const [observations, setObservations] = useState<number[]>([])
  const histogram = useMemo(() => {
    const counts = Array<number>(bins).fill(0)
    for (const q of observations) {
      const bin = Math.floor((q - qMin) / binWidth)
      if (bin >= 0 && bin < bins) counts[bin]++
    }
    return counts
  }, [observations])
  const densities = histogram.map(count => observations.length ? count / (observations.length * binWidth) : 0)
  const scale = Math.max(0.8, Math.ceil(Math.max(...densities) * 5) / 5)
  const x = (q: number) => chart.left + (q - qMin) / (qMax - qMin) * (chart.right - chart.left)
  const y = (density: number) => chart.base - density / scale * (chart.base - chart.top)
  const points = Array.from({ length: 161 }, (_, i) => {
    const q = qMin + (qMax - qMin) * i / 160
    return `${x(q).toFixed(2)},${y(quadratureDensity(occupation, q)).toFixed(2)}`
  }).join(' ')
  const outsideCount = observations.length - histogram.reduce((a, b) => a + b, 0)
  function prepare(next: Occupation) {
    if (next === occupation) return
    setOccupation(next)
    setObservations([])
  }
  function measure() {
    const samples = Array.from({ length: 64 }, () => measureQuadrature(occupation))
    setObservations(previous => previous.concat(samples))
  }
  return (
    <div className="field-oscillator">
      <div className="field-osc-grid">
        <Plot title="Mode quadrature" subtitle="density ρ(q)" tone="mint">
          <svg viewBox="0 0 414 204" role="img" aria-label={`Quadrature density of the ${occupation === 0 ? 'vacuum' : 'one-quantum state'}, with ${observations.length} measurements.`}>
            {[0, scale / 2, scale].map(tick => <g key={tick}>
              <line className="field-gridline" x1={chart.left} x2={chart.right} y1={y(tick)} y2={y(tick)} />
              <text className="field-axis" x={chart.left - 7} y={y(tick) + 4} textAnchor="end">{tick.toFixed(1)}</text>
            </g>)}
            {[-4, -2, 0, 2, 4].map(q => <g key={q}>
              <line className="field-gridline" x1={x(q)} x2={x(q)} y1={chart.top} y2={chart.base} />
              <text className="field-axis" x={x(q)} y="173" textAnchor="middle">{fmt(q)}</text>
            </g>)}
            {densities.map((p, i) => <rect key={i} className="field-hist-bin" x={x(qMin + i * binWidth) + 0.5} y={y(p)}
              width={x(binWidth) - x(0) - 1} height={chart.base - y(p)} />)}
            <polyline className="field-prob-line" points={points} />
            <text className="field-axis-title" x="218" y="197" textAnchor="middle">dimensionless quadrature q</text>
          </svg>
        </Plot>
        <div className="field-osc-panel">
          <fieldset>
            <legend>Prepare one mode</legend>
            <div className="field-choices">
              <button type="button" aria-pressed={occupation === 0} onClick={() => prepare(0)}>Vacuum |0⟩</button>
              <button type="button" aria-pressed={occupation === 1} onClick={() => prepare(1)}>One quantum |1⟩</button>
            </div>
          </fieldset>
          <p>{occupation === 0
            ? 'Even in the vacuum, repeated quadrature measurements have a spread. The most likely readings lie near zero.'
            : 'With one quantum, readings cluster on either side of zero. The probability density vanishes at the origin.'}</p>
          <button className="field-measure" type="button" onClick={measure}>Measure 64 copies <span aria-hidden="true">↗</span></button>
        </div>
      </div>
      <div className="field-readout">
        <span>Independent measurements <b aria-live="polite">{observations.length}</b></span>
        <span>Predicted variance <b>{(occupation + 0.5).toFixed(1)}</b></span>
        {outsideCount > 0 && <span>Outside plot <b>{outsideCount}</b></span>}
      </div>
      <p className="field-hint">The green curve predicts the quadrature distribution for one oscillator. The amber histogram collects measurements of separately prepared copies.</p>
      <details className="field-detail">
        <summary>What the quadrature measures</summary>
        <p>Here q = (a + a†)/√2 is the dimensionless oscillator coordinate of one field mode.
          The vacuum density is ρ₀(q) = exp(−q²)/√π. With one quantum it becomes ρ₁(q) = 2q²ρ₀(q).
          Both states have zero mean quadrature. In this plot q labels possible oscillator readings, while the wavepacket plot labels sites in space.</p>
      </details>
    </div>
  )
}

export default function FieldLab({ embedded = false }: { embedded?: boolean }) {
  const [view, setView] = useState<'packet' | 'oscillator'>('packet')
  return (
    <section className={`field-lab${embedded ? ' field-lab--embedded' : ''}`} aria-label="Field modes laboratory">
      {!embedded && <header className="field-intro">
        <h1>From modes to a particle</h1>
        <p>Build a localized excitation from the momentum modes of a free field on a ring of 64 sites. Then measure the quantum fluctuations of a single oscillator.</p>
      </header>}
      <div className="field-instrument">
        <div className="field-tabs" role="group" aria-label="Field experiment">
          <button type="button" aria-pressed={view === 'packet'} onClick={() => setView('packet')}>One-particle wavepacket</button>
          <button type="button" aria-pressed={view === 'oscillator'} onClick={() => setView('oscillator')}>Single oscillator</button>
        </div>
        <div hidden={view !== 'packet'}><Wavepacket /></div>
        <div hidden={view !== 'oscillator'}><Oscillator /></div>
      </div>
    </section>
  )
}
