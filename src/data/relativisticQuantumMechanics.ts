export type RelativisticQuantumMechanicsSection = {
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

export const relativisticQuantumMechanicsRoute = '/chapters/relativistic-quantum-mechanics'

export const relativisticQuantumMechanicsSections: RelativisticQuantumMechanicsSection[] = [
  {
    slug: 'quantum-language',
    number: '01',
    title: 'The Quantum Language',
    shortTitle: 'Quantum language',
    readingTime: '14 min',
    question: 'What structure from ordinary quantum mechanics must survive relativity?',
    summary:
      'Build states, rays, amplitudes, the Born rule, observables, and symmetry generators as the common language used by every later section.',
    route: `${relativisticQuantumMechanicsRoute}/quantum-language`,
    concepts: ['Hilbert space', 'Rays and phase', 'Born rule', 'Operators', 'Generators'],
  },
  {
    slug: 'lorentz-transformations',
    number: '02',
    title: 'Lorentz Transformations in Quantum Theory',
    shortTitle: 'Lorentz transformations',
    readingTime: '18 min',
    question: 'How can one Lorentz transformation act on spacetime, states, and fields?',
    summary:
      'Separate the geometric matrix, the unitary Hilbert-space operator, and the finite-dimensional field matrix; then connect spinors, projective phases, parity, and time reversal.',
    route: `${relativisticQuantumMechanicsRoute}/lorentz-transformations`,
    concepts: ['Λ, U, and D', 'Field covariance', 'Spinors', 'Projective symmetry', 'P and T'],
  },
  {
    slug: 'poincare-algebra',
    number: '03',
    title: 'The Poincaré Algebra',
    shortTitle: 'Poincaré algebra',
    readingTime: '18 min',
    question: 'What is the infinitesimal multiplication table of spacetime symmetry?',
    summary:
      'Derive the ten generators, their commutators, the noncommutativity of boosts, and the Casimirs that survive every change of inertial frame.',
    route: `${relativisticQuantumMechanicsRoute}/poincare-algebra`,
    concepts: ['Semidirect product', 'Ten generators', 'Commutators', 'Boosts', 'Casimirs'],
  },
  {
    slug: 'one-particle-states',
    number: '04',
    title: 'One-Particle States',
    shortTitle: 'One-particle states',
    readingTime: '20 min',
    question: 'Why does relativity classify massive particles by spin and massless particles by helicity?',
    summary:
      'Use standard momenta and little groups to derive spin, helicity, Wigner rotation, photon polarizations, and the difference between particle states and field components.',
    route: `${relativisticQuantumMechanicsRoute}/one-particle-states`,
    concepts: ['Momentum orbits', 'Little groups', 'Spin', 'Helicity', 'Wigner rotation'],
  },
  {
    slug: 'discrete-projective-symmetries',
    number: '05',
    title: 'Discrete and Projective Symmetries',
    shortTitle: 'Discrete symmetries',
    readingTime: '18 min',
    question: 'What changes when a symmetry lies outside the identity component—or composes only up to phase?',
    summary:
      'Understand parity, antiunitary time reversal, projective phases, double covers, and the global distinction between a 2π and a 4π rotation.',
    route: `${relativisticQuantumMechanicsRoute}/discrete-projective-symmetries`,
    concepts: ['Parity', 'Time reversal', 'Antiunitarity', 'Projective phases', 'Double covers'],
  },
  {
    slug: 'wave-equations',
    number: '06',
    title: 'Relativistic Wave Equations',
    shortTitle: 'Wave equations',
    readingTime: '16 min',
    question: 'What happens when the relativistic mass shell becomes a wave equation?',
    summary:
      'Follow the mass-shell condition into the Klein-Gordon and Dirac equations, and see why negative-frequency solutions are clues rather than pathologies.',
    route: `${relativisticQuantumMechanicsRoute}/wave-equations`,
    concepts: ['Mass shell', 'Klein-Gordon', 'Dirac', 'Spinors', 'Antiparticles'],
  },
  {
    slug: 'toward-fields',
    number: '07',
    title: 'Why the Story Ends with Fields',
    shortTitle: 'Toward fields',
    readingTime: '12 min',
    question: 'Why is a relativistic one-particle wavefunction not the final language?',
    summary:
      'Connect particle creation, Fock space, local operators, creation and annihilation modes, and scattering states to the need for quantum fields.',
    route: `${relativisticQuantumMechanicsRoute}/toward-fields`,
    concepts: ['Variable particle number', 'Fock space', 'Locality', 'Field operators', 'Scattering preview'],
  },
]
