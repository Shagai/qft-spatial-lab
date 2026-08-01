export type ChapterStatus = 'active' | 'planned' | 'draft'

export type Chapter = {
  slug: string
  title: string
  subtitle: string
  section: string
  status: ChapterStatus
  readingTime: string
  updated: string
  route: string
  summary: string
  focus: string[]
}

export const chapters: Chapter[] = [
  {
    slug: 'relativistic-quantum-mechanics',
    title: 'Relativistic Quantum Mechanics',
    subtitle:
      'From Hilbert spaces and the Born rule through Poincaré symmetry, particle classification, discrete symmetries, relativistic wave equations, and why one-particle quantum mechanics points toward fields.',
    section: 'Chapter 1',
    status: 'active',
    readingTime: '7 sections · 116 min',
    updated: '2026-08-01',
    route: '/chapters/relativistic-quantum-mechanics',
    summary:
      'A seven-part path from quantum states through Lorentz, Poincaré, and discrete symmetry to particle types, wave equations, and the need for local quantum fields.',
    focus: [
      'Hilbert space and rays',
      'Amplitudes, inner products, and measurement',
      'Poincaré generators, commutators, and Casimirs',
      'Mass, spin, helicity, and little groups',
      'Parity, time reversal, projective phases, and double covers',
      'Lorentz covariance and relativistic wave equations',
      'Klein-Gordon, Dirac, spin, and antiparticles',
      'Why fields become the natural next step',
    ],
  },
  {
    slug: 'scattering-theory',
    title: 'Scattering Theory',
    subtitle:
      'From localized asymptotic particles and the S-matrix through invariant rates, unitarity, partial waves, and resonances.',
    section: 'Chapter 2',
    status: 'active',
    readingTime: '7 sections · 118 min',
    updated: '2026-08-01',
    route: '/chapters/scattering-theory',
    summary:
      'A seven-part path from laboratory preparations to invariant amplitudes, measurable probabilities, probability-flow constraints, angular channels, and unstable particles.',
    focus: [
      'Wave packets and asymptotic states',
      'The S-matrix and invariant amplitudes',
      'Lorentz-invariant phase space, rates, and cross-sections',
      'Lippmann-Schwinger and Dyson expansions',
      'Unitarity and the optical theorem',
      'Partial waves and phase shifts',
      'Resonance poles, widths, and branching fractions',
    ],
  },
  {
    slug: 'classical-field-theory',
    title: 'Classical Field Theory',
    subtitle: 'Lagrangian densities, Euler-Lagrange equations for fields, Noether currents, and stress-energy.',
    section: 'Chapter 3',
    status: 'planned',
    readingTime: 'TBD',
    updated: 'Planned',
    route: '/chapters',
    summary:
      'Builds the classical field language that QFT quantizes: actions, symmetries, currents, and conserved quantities.',
    focus: ['Action principle', 'Noether theorem', 'Scalar, spinor, and gauge fields', 'Stress-energy tensor'],
  },
  {
    slug: 'canonical-quantization',
    title: 'Canonical Quantization',
    subtitle: 'Promoting fields to operators, commutators, creation and annihilation operators, and Fock space.',
    section: 'Chapter 4',
    status: 'planned',
    readingTime: 'TBD',
    updated: 'Planned',
    route: '/chapters',
    summary:
      'Turns classical fields into quantum operators and explains particles as field excitations.',
    focus: ['Equal-time commutators', 'Mode expansions', 'Fock space', 'Hamiltonian picture'],
  },
  {
    slug: 'path-integrals',
    title: 'Path Integrals',
    subtitle: 'Generating functionals, propagators, perturbation theory, and the bridge to Feynman rules.',
    section: 'Chapter 5',
    status: 'planned',
    readingTime: 'TBD',
    updated: 'Planned',
    route: '/chapters',
    summary:
      'Reframes quantum dynamics through sums over histories and prepares the diagrammatic toolkit.',
    focus: ['Functional integration', 'Sources and correlators', 'Gaussian integrals', 'Perturbation expansion'],
  },
  {
    slug: 'quantum-electrodynamics',
    title: 'Quantum Electrodynamics',
    subtitle: 'Gauge symmetry, photons, electrons, vertices, scattering amplitudes, and renormalization ideas.',
    section: 'Chapter 6',
    status: 'planned',
    readingTime: 'TBD',
    updated: 'Planned',
    route: '/chapters',
    summary:
      'Applies the formalism to the simplest realistic relativistic quantum field theory.',
    focus: ['U(1) gauge symmetry', 'Feynman rules', 'Tree-level amplitudes', 'Loop corrections'],
  },
]

export const activeChapter = chapters.find((chapter) => chapter.status === 'active') ?? chapters[0]
