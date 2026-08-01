export type ScatteringTheorySection = {
  slug: string
  number: string
  title: string
  shortTitle: string
  readingTime: string
  question: string
  summary: string
  route: string
  concepts: string[]
}

export const scatteringTheoryRoute = '/chapters/scattering-theory'

export const scatteringTheorySections: ScatteringTheorySection[] = [
  {
    slug: 'asymptotic-states',
    number: '01',
    title: 'The Experiment at Infinity',
    shortTitle: 'Asymptotic states',
    readingTime: '16 min',
    question: 'How can an interacting theory begin and end with free particles?',
    summary:
      'Use localized wave packets, asymptotic separation, and Møller operators to define the exact in and out states that a scattering experiment prepares and detects.',
    route: `${scatteringTheoryRoute}/asymptotic-states`,
    concepts: ['Wave packets', 'Free states', 'In and out', 'Møller operators', 'Stable particles'],
  },
  {
    slug: 's-matrix',
    number: '02',
    title: 'The S-Matrix as a Quantum Map',
    shortTitle: 'The S-matrix',
    readingTime: '17 min',
    question: 'What part of a collision can an experiment actually ask the theory to predict?',
    summary:
      'Separate unchanged propagation from genuine transitions, factor kinematics from dynamics, and see how symmetry and cluster decomposition constrain amplitudes.',
    route: `${scatteringTheoryRoute}/s-matrix`,
    concepts: ['S and T', 'Invariant amplitude', 'Mandelstam variables', 'Symmetry', 'Connectedness'],
  },
  {
    slug: 'amplitudes-to-observables',
    number: '03',
    title: 'From Amplitudes to Observables',
    shortTitle: 'Observables',
    readingTime: '18 min',
    question: 'How does an invariant amplitude become a decay rate or a cross-section?',
    summary:
      'Combine squared amplitudes with invariant phase space, incoming flux, spin sums, and identical-particle factors to obtain measurable rates.',
    route: `${scatteringTheoryRoute}/amplitudes-to-observables`,
    concepts: ['Phase space', 'Flux', 'Decay width', 'Cross-section', 'Two-body kinematics'],
  },
  {
    slug: 'perturbation-theory',
    number: '04',
    title: 'The Perturbative Bridge',
    shortTitle: 'Perturbation theory',
    readingTime: '18 min',
    question: 'How do repeated interactions become the Dyson series and eventually Feynman diagrams?',
    summary:
      'Connect the Lippmann-Schwinger equation, boundary prescriptions, the Born expansion, time ordering, and the local interaction picture used by QFT.',
    route: `${scatteringTheoryRoute}/perturbation-theory`,
    concepts: ['Lippmann-Schwinger', 'i0 prescription', 'Born series', 'Dyson series', 'Time ordering'],
  },
  {
    slug: 'unitarity',
    number: '05',
    title: 'Unitarity and the Optical Theorem',
    shortTitle: 'Unitarity',
    readingTime: '17 min',
    question: 'How does conservation of total probability constrain every scattering amplitude?',
    summary:
      'Turn S†S = 1 into a sum over physical channels, understand the optical theorem, and connect imaginary parts with on-shell intermediate states.',
    route: `${scatteringTheoryRoute}/unitarity`,
    concepts: ['Probability flow', 'Optical theorem', 'On-shell states', 'Thresholds', 'Branch cuts'],
  },
  {
    slug: 'partial-waves',
    number: '06',
    title: 'Partial Waves and Phase Shifts',
    shortTitle: 'Partial waves',
    readingTime: '17 min',
    question: 'What does scattering look like one angular-momentum channel at a time?',
    summary:
      'Decompose an amplitude into angular channels, make elastic unitarity geometric, and understand phase shifts, inelasticity, and threshold behavior.',
    route: `${scatteringTheoryRoute}/partial-waves`,
    concepts: ['Angular momentum', 'Phase shifts', 'Unitarity circle', 'Inelasticity', 'Low energy'],
  },
  {
    slug: 'resonances',
    number: '07',
    title: 'Resonances, Poles, and Unstable Particles',
    shortTitle: 'Resonances',
    readingTime: '15 min',
    question: 'If an unstable particle never reaches a detector, in what sense does it exist?',
    summary:
      'Read unstable particles from pole position and phase motion, then connect mass, width, lifetime, branching fractions, and interference.',
    route: `${scatteringTheoryRoute}/resonances`,
    concepts: ['Complex poles', 'Width', 'Lifetime', 'Branching fractions', 'Interference'],
  },
]
