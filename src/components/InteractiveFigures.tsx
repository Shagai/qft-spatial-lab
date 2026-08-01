import { useMemo, useState } from 'react'

type RelativisticEquation = 'Schrodinger' | 'Klein-Gordon' | 'Dirac'

type PoincareGeneratorFamily = 'Translations' | 'Rotations' | 'Boosts'

type LorentzFieldType = 'Scalar' | 'Vector' | 'Spinor'

type ParticleOrbit = 'Massive' | 'Massless'

const lorentzFieldTypes: Record<
  LorentzFieldType,
  {
    componentAction: string
    fieldLaw: string
    meaning: string
  }
> = {
  Scalar: {
    componentAction: 'D(Lambda) = 1',
    fieldLaw: "phi'(x) = phi(Lambda^-1 x)",
    meaning: 'Only the spacetime argument moves; a scalar value has no components to mix.',
  },
  Vector: {
    componentAction: 'D(Lambda) = Lambda',
    fieldLaw: "A'^mu(x) = Lambda^mu_nu A^nu(Lambda^-1 x)",
    meaning: 'The event moves and the four vector components mix with one another.',
  },
  Spinor: {
    componentAction: 'D(Lambda) = S(Lambda)',
    fieldLaw: "psi'(x) = S(Lambda) psi(Lambda^-1 x)",
    meaning: 'Spinor components transform through the double cover SL(2,C), not as a four-vector.',
  },
}

const particleOrbits: Record<
  ParticleOrbit,
  {
    invariant: string
    referenceMomentum: string
    littleGroup: string
    label: string
    states: string
    intuition: string
  }
> = {
  Massive: {
    invariant: 'P^2 = m^2, P^0 > 0',
    referenceMomentum: 'k = (m, 0, 0, 0)',
    littleGroup: 'SU(2)',
    label: 'spin j',
    states: '2j + 1 spin components',
    intuition: 'A rest frame exists. The transformations that keep the particle at rest are rotations.',
  },
  Massless: {
    invariant: 'P^2 = 0, P^0 > 0',
    referenceMomentum: 'k = (kappa, 0, 0, kappa)',
    littleGroup: 'ISO(2)',
    label: 'helicity h in the finite-helicity branch',
    states: 'one state per helicity sector',
    intuition:
      'No rest frame exists. In the observed finite-helicity branch, null rotations act trivially and the physical action is a twist around the light ray; nontrivial null rotations lead to continuous spin.',
  },
}

const poincareGeneratorFamilies: Record<
  PoincareGeneratorFamily,
  {
    count: number
    parameters: string
    generators: string
    action: string
    algebra: string
  }
> = {
  Translations: {
    count: 4,
    parameters: 'a^mu',
    generators: 'P^mu = (H, P)',
    action: 'Shift the origin in time or space without changing intervals.',
    algebra: '[P^mu, P^nu] = 0',
  },
  Rotations: {
    count: 3,
    parameters: 'omega_ij',
    generators: 'J_i = epsilon_ijk M^jk / 2',
    action: 'Rotate spatial axes and the spatial momentum vector.',
    algebra: '[J_i, J_j] = i epsilon_ijk J_k',
  },
  Boosts: {
    count: 3,
    parameters: 'omega_0i',
    generators: 'K_i = M^i0',
    action: 'Change inertial frame, mixing time with space and energy with momentum.',
    algebra: '[K_i, K_j] = -i epsilon_ijk J_k',
  },
}

const equationNotes: Record<
  RelativisticEquation,
  {
    equation: string
    object: string
    lesson: string
    path: string[]
  }
> = {
  Schrodinger: {
    equation: 'i hbar d_t psi = -(hbar^2 / 2m) nabla^2 psi + V psi',
    object: 'A complex wavefunction for fixed particle number in a preferred time coordinate.',
    lesson: 'Excellent nonrelativistic theory, but time and space are not treated symmetrically.',
    path: ['State vector', 'Hamiltonian', 'Time evolution', 'Born rule'],
  },
  'Klein-Gordon': {
    equation: '(Box + m^2) phi = 0',
    object: 'A relativistic scalar wave equation that follows directly from p_mu p^mu = m^2.',
    lesson: 'Covariant and useful for spin-0 fields, but awkward as a one-particle probability wave.',
    path: ['Mass shell', 'Second order wave', 'Positive and negative frequency', 'Scalar field'],
  },
  Dirac: {
    equation: '(i gamma^mu partial_mu - m) psi = 0',
    object: 'A first-order relativistic equation for spinor degrees of freedom.',
    lesson: 'It builds in spin and antiparticle structure, then points naturally toward quantum fields.',
    path: ['Linear operator', 'Gamma matrices', 'Spinor solutions', 'Electron field'],
  },
}

const bridgeSteps = [
  {
    title: 'Quantum states',
    detail: 'Vectors in Hilbert space represent amplitudes; rays represent physical states.',
  },
  {
    title: 'Symmetry',
    detail: 'Time translations, rotations, boosts, and translations act on states.',
  },
  {
    title: 'Relativity',
    detail: 'Energy and momentum combine into four-vectors with invariant mass.',
  },
  {
    title: 'Wave equations',
    detail: 'Klein-Gordon and Dirac equations implement the relativistic mass shell.',
  },
  {
    title: 'Fields',
    detail: 'Local fields handle creation, annihilation, covariance, and causal propagation.',
  },
]

const scatteringFlowSteps = [
  {
    title: 'Prepare',
    detail: 'Build localized incoming packets from stable one-particle states.',
  },
  {
    title: 'Separate',
    detail: 'Move far enough into the past that the packets evolve approximately freely.',
  },
  {
    title: 'Interact',
    detail: 'Let the full quantum dynamics explore every allowed intermediate alternative.',
  },
  {
    title: 'Detect',
    detail: 'Identify separated outgoing particles and their momenta, spins, and species.',
  },
  {
    title: 'Infer',
    detail: 'Turn amplitudes into rates, cross-sections, phase shifts, and resonance parameters.',
  },
]

export function HomeQftMapFigure() {
  return (
    <figure className="qft-map-figure">
      <div className="field-lines" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="map-orbit" aria-label="QFT concept orbit">
        <span className="map-node node-state">Hilbert space</span>
        <span className="map-node node-symmetry">Symmetry</span>
        <span className="map-node node-field">Fields</span>
        <span className="map-node node-quanta">Quanta</span>
        <strong>QFT</strong>
      </div>
      <figcaption>
        <strong>Notebook map</strong>
        <span>States give amplitudes, symmetries constrain dynamics, and fields organize particles.</span>
      </figcaption>
    </figure>
  )
}

export function RelativisticBridgeFigure() {
  return (
    <figure className="interactive-figure bridge-figure">
      <figcaption>
        <strong>From quantum mechanics to QFT</strong>
        <span>The first chapter is the bridge between state vectors and relativistic fields.</span>
      </figcaption>
      <div className="bridge-path" aria-label="Conceptual bridge">
        {bridgeSteps.map((step, index) => (
          <div className="bridge-step" key={step.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{step.title}</strong>
            <p>{step.detail}</p>
          </div>
        ))}
      </div>
    </figure>
  )
}

export function ScatteringFlowFigure() {
  return (
    <figure className="interactive-figure bridge-figure">
      <figcaption>
        <strong>What a scattering experiment asks the theory to connect</strong>
        <span>The observable story lives at the ends; the interaction is summarized by an amplitude.</span>
      </figcaption>
      <div className="bridge-path" aria-label="Scattering experiment flow">
        {scatteringFlowSteps.map((step, index) => (
          <div className="bridge-step" key={step.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{step.title}</strong>
            <p>{step.detail}</p>
          </div>
        ))}
      </div>
    </figure>
  )
}

export function PartialWaveUnitarityFigure() {
  const [phaseShift, setPhaseShift] = useState(48)
  const [inelasticity, setInelasticity] = useState(0.82)
  const phaseRadians = (2 * phaseShift * Math.PI) / 180
  const sReal = inelasticity * Math.cos(phaseRadians)
  const sImaginary = inelasticity * Math.sin(phaseRadians)
  const amplitudeReal = sImaginary / 2
  const amplitudeImaginary = (1 - sReal) / 2
  const probabilityLeavingChannel = 1 - inelasticity ** 2
  const plotScale = 78
  const pointX = 110 + plotScale * sReal
  const pointY = 110 - plotScale * sImaginary

  return (
    <figure className="interactive-figure partial-wave-figure">
      <figcaption>
        <strong>One partial wave inside the unitarity disk</strong>
        <span>
          The phase turns the channel around the circle. Inelasticity pulls it toward the center.
        </span>
      </figcaption>
      <div className="scattering-figure-grid">
        <div className="partial-wave-plot">
          <svg viewBox="0 0 220 220" role="img" aria-label="Complex S matrix plane for one partial wave">
            <line x1="20" y1="110" x2="200" y2="110" className="plot-axis" />
            <line x1="110" y1="20" x2="110" y2="200" className="plot-axis" />
            <circle cx="110" cy="110" r={plotScale} className="unitarity-boundary" />
            <line x1="110" y1="110" x2={pointX} y2={pointY} className="unitarity-radius" />
            <circle cx={pointX} cy={pointY} r="6" className="plot-point" />
            <text x="194" y="103">Re</text>
            <text x="116" y="27">Im</text>
            <text x={Math.min(pointX + 9, 184)} y={Math.max(pointY - 8, 18)}>Sℓ</text>
          </svg>
        </div>
        <div className="scattering-controls">
          <label>
            <span>Phase shift δℓ</span>
            <input
              type="range"
              min="0"
              max="180"
              step="1"
              value={phaseShift}
              onChange={(event) => setPhaseShift(Number(event.target.value))}
            />
            <output>{phaseShift}° · the S-matrix angle is {2 * phaseShift}°</output>
          </label>
          <label>
            <span>Inelasticity parameter ηℓ</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={inelasticity}
              onChange={(event) => setInelasticity(Number(event.target.value))}
            />
            <output>{inelasticity.toFixed(2)}</output>
          </label>
        </div>
      </div>
      <div className="scattering-readout" aria-live="polite">
        <p>
          <span>Channel value</span>
          <strong>Sℓ = {sReal.toFixed(2)} {sImaginary >= 0 ? '+' : '−'} {Math.abs(sImaginary).toFixed(2)}i</strong>
        </p>
        <p>
          <span>Partial-wave amplitude</span>
          <strong>aℓ = {amplitudeReal.toFixed(2)} + {amplitudeImaginary.toFixed(2)}i</strong>
        </p>
        <p>
          <span>Probability sent elsewhere</span>
          <strong>{(probabilityLeavingChannel * 100).toFixed(1)}%</strong>
        </p>
      </div>
      <p className="figure-caption-note">
        At ηℓ = 1 the point sits on the boundary and the channel is purely elastic. A smaller ηℓ
        does not violate unitarity: it records probability carried into channels omitted from this
        two-body view.
      </p>
    </figure>
  )
}

export function ResonanceProfileFigure() {
  const [offset, setOffset] = useState(0)
  const intensity = 1 / (1 + offset ** 2)
  const phase = (Math.atan2(1, -offset) * 180) / Math.PI
  const plotPath = useMemo(
    () =>
      Array.from({ length: 81 }, (_, index) => {
        const x = -4 + index / 10
        const plotX = 26 + ((x + 4) / 8) * 348
        const plotY = 174 - (1 / (1 + x ** 2)) * 136
        return `${index === 0 ? 'M' : 'L'} ${plotX.toFixed(1)} ${plotY.toFixed(1)}`
      }).join(' '),
    [],
  )
  const pointX = 26 + ((offset + 4) / 8) * 348
  const pointY = 174 - intensity * 136

  return (
    <figure className="interactive-figure resonance-figure">
      <figcaption>
        <strong>A narrow resonance has both a line shape and a phase motion</strong>
        <span>Scan through the pole in units of one half-width.</span>
      </figcaption>
      <div className="resonance-plot">
        <svg viewBox="0 0 400 210" role="img" aria-label="Normalized resonance intensity against energy offset">
          <line x1="26" y1="174" x2="380" y2="174" className="plot-axis" />
          <line x1="200" y1="24" x2="200" y2="180" className="plot-guide" />
          <path d={plotPath} className="resonance-curve" />
          <line x1={pointX} y1="174" x2={pointX} y2={pointY} className="plot-guide current" />
          <circle cx={pointX} cy={pointY} r="6" className="plot-point" />
          <text x="184" y="199">Eᵣ</text>
          <text x="282" y="199">energy →</text>
          <text x="34" y="33">|amplitude|²</text>
        </svg>
      </div>
      <div className="control-grid two-column resonance-controls">
        <label>
          <span>Energy offset</span>
          <input
            type="range"
            min="-4"
            max="4"
            step="0.1"
            value={offset}
            onChange={(event) => setOffset(Number(event.target.value))}
          />
          <output>2(E − Eᵣ) / Γ = {offset.toFixed(1)}</output>
        </label>
        <div className="equation-card" aria-live="polite">
          <span>Normalized intensity: {intensity.toFixed(3)}</span>
          <strong>Resonant phase-shift contribution: {phase.toFixed(1)}°</strong>
        </div>
      </div>
      <p className="figure-caption-note">
        The symmetric peak is the ideal isolated case. A real background amplitude adds before
        squaring, so the same pole can appear as a skewed peak—or even as a dip—while the phase
        motion remains an important clue.
      </p>
    </figure>
  )
}

export function PoincareGeneratorsFigure() {
  const [selected, setSelected] = useState<PoincareGeneratorFamily>('Translations')
  const family = poincareGeneratorFamilies[selected]

  return (
    <figure className="interactive-figure poincare-figure">
      <figcaption>
        <strong>The ten continuous Poincaré generators</strong>
        <span>Select a family to connect its parameters, generators, action, and commutator.</span>
      </figcaption>
      <div className="segmented-control" role="group" aria-label="Choose a Poincaré generator family">
        {(Object.keys(poincareGeneratorFamilies) as PoincareGeneratorFamily[]).map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={selected === name}
            className={selected === name ? 'is-selected' : ''}
            onClick={() => setSelected(name)}
          >
            {name} · {poincareGeneratorFamilies[name].count}
          </button>
        ))}
      </div>
      <div className="generator-count-grid" aria-label="Four translations, three rotations, and three boosts">
        {(Object.keys(poincareGeneratorFamilies) as PoincareGeneratorFamily[]).map((name) => (
          <div className={selected === name ? 'generator-family is-selected' : 'generator-family'} key={name}>
            <strong>{name}</strong>
            <div className="generator-tokens" aria-hidden="true">
              {Array.from({ length: poincareGeneratorFamilies[name].count }, (_, index) => (
                <i key={index} />
              ))}
            </div>
            <span>{poincareGeneratorFamilies[name].count} generators</span>
          </div>
        ))}
      </div>
      <div className="figure-notes three-column" aria-live="polite">
        <p>
          <strong>Parameters and generators.</strong> <code>{family.parameters}</code> pairs with{' '}
          <code>{family.generators}</code>.
        </p>
        <p>
          <strong>Geometric action.</strong> {family.action}
        </p>
        <p>
          <strong>Characteristic relation.</strong> <code>{family.algebra}</code>
        </p>
      </div>
    </figure>
  )
}

export function LorentzLayersFigure() {
  const [selected, setSelected] = useState<LorentzFieldType>('Vector')
  const field = lorentzFieldTypes[selected]

  return (
    <figure className="interactive-figure lorentz-layers-figure">
      <figcaption>
        <strong>One Lorentz transformation, three spaces</strong>
        <span>Keep the jobs of Lambda, U, and D separate, then connect them.</span>
      </figcaption>
      <div className="transformation-layers" aria-label="Three actions of a Lorentz transformation">
        <div className="transformation-layer">
          <span>Spacetime</span>
          <strong>Lambda</strong>
          <small>moves x and p</small>
        </div>
        <i aria-hidden="true">→</i>
        <div className="transformation-layer">
          <span>Hilbert space</span>
          <strong>U(Lambda)</strong>
          <small>moves physical states</small>
        </div>
        <i aria-hidden="true">→</i>
        <div className="transformation-layer is-accented">
          <span>Field components</span>
          <strong>D(Lambda)</strong>
          <small>mixes component labels</small>
        </div>
      </div>
      <div className="segmented-control" role="group" aria-label="Choose a field type">
        {(Object.keys(lorentzFieldTypes) as LorentzFieldType[]).map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={selected === name}
            className={selected === name ? 'is-selected' : ''}
            onClick={() => setSelected(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="figure-notes three-column" aria-live="polite">
        <p>
          <strong>Component action.</strong> <code>{field.componentAction}</code>
        </p>
        <p>
          <strong>Field law.</strong> <code>{field.fieldLaw}</code>
        </p>
        <p>
          <strong>Meaning.</strong> {field.meaning}
        </p>
      </div>
    </figure>
  )
}

export function ParticleLittleGroupFigure() {
  const [selected, setSelected] = useState<ParticleOrbit>('Massive')
  const orbit = particleOrbits[selected]

  return (
    <figure className="interactive-figure little-group-figure">
      <figcaption>
        <strong>Mass chooses the orbit; the little group chooses the internal label</strong>
        <span>Compare the reference momentum that can—and cannot—be brought to rest.</span>
      </figcaption>
      <div className="segmented-control" role="group" aria-label="Choose a momentum orbit">
        {(Object.keys(particleOrbits) as ParticleOrbit[]).map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={selected === name}
            className={selected === name ? 'is-selected' : ''}
            onClick={() => setSelected(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="figure-result" aria-live="polite">
        <div className="little-group-grid">
          <div>
            <span>Momentum orbit</span>
            <strong>{orbit.invariant}</strong>
          </div>
          <div>
            <span>Reference momentum</span>
            <strong>{orbit.referenceMomentum}</strong>
          </div>
          <div>
            <span>Little group</span>
            <strong>{orbit.littleGroup}</strong>
          </div>
          <div>
            <span>Particle label</span>
            <strong>{orbit.label}</strong>
          </div>
        </div>
        <div className="figure-notes two-column">
          <p>
            <strong>State count.</strong> {orbit.states}.
          </p>
          <p>
            <strong>Mental picture.</strong> {orbit.intuition}
          </p>
        </div>
      </div>
    </figure>
  )
}

export function BornRuleFigure() {
  const [theta, setTheta] = useState(52)
  const radians = (theta * Math.PI) / 180
  const upAmplitude = Math.cos(radians / 2)
  const downAmplitude = Math.sin(radians / 2)
  const upProbability = upAmplitude ** 2
  const downProbability = downAmplitude ** 2

  return (
    <figure className="interactive-figure born-figure">
      <figcaption>
        <strong>Born rule for a two-state system</strong>
        <span>Move the state angle and watch amplitudes become probabilities.</span>
      </figcaption>
      <div className="control-grid two-column">
        <label>
          <span>State angle</span>
          <input
            type="range"
            min="0"
            max="180"
            step="1"
            value={theta}
            onChange={(event) => setTheta(Number(event.target.value))}
          />
          <output>{theta} degrees</output>
        </label>
        <div className="equation-card">
          <span>|psi&gt; = cos(theta/2)|up&gt; + sin(theta/2)|down&gt;</span>
          <strong>P(n) = |&lt;n|psi&gt;|^2</strong>
        </div>
      </div>
      <div className="probability-grid">
        <ProbabilityBar label="up" amplitude={upAmplitude} probability={upProbability} />
        <ProbabilityBar label="down" amplitude={downAmplitude} probability={downProbability} />
      </div>
    </figure>
  )
}

function ProbabilityBar({
  label,
  amplitude,
  probability,
}: {
  label: string
  amplitude: number
  probability: number
}) {
  return (
    <div className="probability-row">
      <span>{label}</span>
      <div className="bar-track">
        <i style={{ width: `${probability * 100}%` }} />
      </div>
      <strong>{Math.round(probability * 100)}%</strong>
      <small>amplitude {amplitude.toFixed(3)}</small>
    </div>
  )
}

export function PhaseFigure() {
  const [phase, setPhase] = useState(0)
  const relativePhase = `${phase} degrees`
  const interference = useMemo(() => (0.5 * (1 + Math.cos((phase * Math.PI) / 180)) * 100).toFixed(0), [phase])

  return (
    <figure className="interactive-figure phase-figure">
      <figcaption>
        <strong>Global phase versus relative phase</strong>
        <span>A common phase changes no probabilities; a relative phase changes interference.</span>
      </figcaption>
      <div className="control-grid two-column">
        <label>
          <span>Relative phase</span>
          <input
            type="range"
            min="0"
            max="360"
            step="5"
            value={phase}
            onChange={(event) => setPhase(Number(event.target.value))}
          />
          <output>{relativePhase}</output>
        </label>
        <div className="equation-card">
          <span>|psi&gt; = (|A&gt; + exp(i phi)|B&gt;) / sqrt(2)</span>
          <strong>Interference signal: {interference}%</strong>
        </div>
      </div>
      <div className="interference-strip" aria-label="Relative interference signal">
        <i style={{ width: `${interference}%` }} />
      </div>
      <p className="figure-caption-note">
        A phase on the whole state is invisible. A phase between components is measurable because
        amplitudes can add or cancel before the absolute square is taken.
      </p>
    </figure>
  )
}

export function RelativisticEquationFigure() {
  const [selected, setSelected] = useState<RelativisticEquation>('Klein-Gordon')
  const note = equationNotes[selected]

  return (
    <figure className="interactive-figure equation-figure">
      <figcaption>
        <strong>Three wave-equation viewpoints</strong>
        <span>Switch equations and track what each one keeps or breaks.</span>
      </figcaption>
      <div className="segmented-control" role="group" aria-label="Choose wave equation">
        {(Object.keys(equationNotes) as RelativisticEquation[]).map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={selected === name}
            className={selected === name ? 'is-selected' : ''}
            onClick={() => setSelected(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="figure-result" aria-live="polite">
        <div className="equation-path" aria-label={`${selected} conceptual path`}>
          {note.path.map((step, index) => (
            <div className="path-node" key={step}>
              <span>{step}</span>
              {index < note.path.length - 1 ? <i aria-hidden="true" /> : null}
            </div>
          ))}
        </div>
        <div className="figure-notes three-column">
          <p>
            <strong>Equation.</strong> <code>{note.equation}</code>
          </p>
          <p>
            <strong>Object.</strong> {note.object}
          </p>
          <p>
            <strong>Lesson.</strong> {note.lesson}
          </p>
        </div>
      </div>
    </figure>
  )
}

export function SpacetimeIntervalFigure() {
  const [velocity, setVelocity] = useState(60)
  const beta = velocity / 100
  const gamma = 1 / Math.sqrt(1 - beta ** 2)

  return (
    <figure className="interactive-figure spacetime-figure">
      <figcaption>
        <strong>Lorentz factor intuition</strong>
        <span>Relativistic effects become large as v approaches c.</span>
      </figcaption>
      <div className="control-grid two-column">
        <label>
          <span>Speed as fraction of c</span>
          <input
            type="range"
            min="0"
            max="99"
            step="1"
            value={velocity}
            onChange={(event) => setVelocity(Number(event.target.value))}
          />
          <output>v/c = {beta.toFixed(2)}</output>
        </label>
        <div className="equation-card">
          <span>gamma = 1 / sqrt(1 - v^2/c^2)</span>
          <strong>gamma = {gamma.toFixed(2)}</strong>
        </div>
      </div>
      <div className="bar-compare">
        <div>
          <span>Rest clock interval</span>
          <div className="bar-track">
            <i style={{ width: '50%' }} />
          </div>
          <strong>1.00</strong>
        </div>
        <div>
          <span>Frame factor</span>
          <div className="bar-track">
            <i className="violet-bar" style={{ width: `${Math.min(gamma * 18, 100)}%` }} />
          </div>
          <strong>{gamma.toFixed(2)}</strong>
        </div>
      </div>
    </figure>
  )
}
