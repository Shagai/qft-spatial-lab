export type TopicStatus = 'seeded' | 'next' | 'research' | 'planned'

export type Topic = {
  slug: string
  title: string
  route?: string
  category: 'Foundations' | 'Relativity' | 'Wave Equations' | 'Fields' | 'Calculations'
  layer: string
  status: TopicStatus
  summary: string
  learningGoals: string[]
  exercises: string[]
  related: string[]
}

export const topics: Topic[] = [
  {
    slug: 'hilbert-space-rays',
    title: 'Hilbert Space and Rays',
    route: '/chapters/relativistic-quantum-mechanics/quantum-language#state-space',
    category: 'Foundations',
    layer: 'State space',
    status: 'seeded',
    summary:
      'Quantum states live in a complex Hilbert space, but physical states are rays because normalization and global phase do not change probabilities.',
    learningGoals: [
      'Explain superposition as vector addition',
      'Separate a vector representative from a physical ray',
      'Identify why global phase is unobservable and relative phase is observable',
    ],
    exercises: [
      'Normalize a two-level spin state',
      'Compare global and relative phase in a spin superposition',
      'Compute an inner product and identify orthogonal states',
    ],
    related: ['Born rule', 'Operators', 'Spinors'],
  },
  {
    slug: 'born-rule',
    title: 'Born Rule',
    route: '/chapters/relativistic-quantum-mechanics/quantum-language#born-rule',
    category: 'Foundations',
    layer: 'Measurement',
    status: 'seeded',
    summary:
      'Measurement probabilities are squared magnitudes of amplitudes, usually projections onto normalized outcome states.',
    learningGoals: [
      'Compute probabilities from amplitudes',
      'Know when normalization factors are required',
      'Recognize complete orthonormal outcome bases',
    ],
    exercises: [
      'Project a spin state onto up and down outcomes',
      'Verify probabilities sum to one in a complete basis',
      'Write the normalized-ray version of the probability formula',
    ],
    related: ['Hilbert Space and Rays', 'Operators'],
  },
  {
    slug: 'operators-observables',
    title: 'Operators and Observables',
    route: '/chapters/relativistic-quantum-mechanics/quantum-language#operators',
    category: 'Foundations',
    layer: 'Linear maps',
    status: 'next',
    summary:
      'Observables are represented by self-adjoint operators whose eigenvectors describe possible sharp measurement outcomes.',
    learningGoals: [
      'Connect eigenvalues to measurement results',
      'Explain expectation values',
      'Use commutators to reason about compatible measurements',
    ],
    exercises: [
      'Diagonalize a Pauli matrix',
      'Compute an expectation value',
      'Check whether two observables commute',
    ],
    related: ['Born Rule', 'Symmetry Generators'],
  },
  {
    slug: 'lorentz-symmetry',
    title: 'Lorentz Transformations in Quantum Theory',
    route: '/chapters/relativistic-quantum-mechanics/lorentz-transformations#meaning',
    category: 'Relativity',
    layer: 'Spacetime symmetry',
    status: 'seeded',
    summary:
      'One Lorentz transformation acts geometrically on spacetime, unitarily on physical states, and through a finite-dimensional matrix on field components.',
    learningGoals: [
      'Distinguish the actions of Lambda, U, and D',
      'Explain why a transformed field is evaluated at the inverse point',
      'Connect spinors and projective symmetry to double covers',
    ],
    exercises: [
      'Transform a scalar and a four-vector field',
      'Compare unitary state transformations with spinor matrices',
      'Track helicity under parity and time reversal',
    ],
    related: ['Poincaré Algebra', 'Projective Representations', 'Spinors'],
  },
  {
    slug: 'poincare-algebra',
    title: 'Poincaré Algebra',
    route: '/chapters/relativistic-quantum-mechanics/poincare-algebra#group',
    category: 'Relativity',
    layer: 'Symmetry generators',
    status: 'seeded',
    summary:
      'Four translations, three rotations, and three boosts form the infinitesimal multiplication table of relativistic spacetime symmetry.',
    learningGoals: [
      'Distinguish the Poincaré group from its Lie algebra',
      'Derive why the Lorentz generators form an antisymmetric tensor',
      'Connect the two Casimirs to particle labels',
    ],
    exercises: [
      'Count the ten Poincaré generators',
      'Recover the rotation-boost commutators from the covariant algebra',
      'Explain why two non-collinear boosts produce a rotation',
    ],
    related: ['Lorentz Transformations', 'One-Particle States', 'Noether Charges'],
  },
  {
    slug: 'one-particle-states',
    title: 'One-Particle States',
    route: '/chapters/relativistic-quantum-mechanics/one-particle-states#question',
    category: 'Relativity',
    layer: 'Particle representations',
    status: 'seeded',
    summary:
      'Momentum orbits and little groups explain why massive particles carry spin while familiar massless particles carry helicity.',
    learningGoals: [
      'Construct states from a standard momentum and standard boost',
      'Compare the massive SU(2) and massless ISO(2) little groups',
      'Separate particle polarizations from field components',
    ],
    exercises: [
      'Find the little group of a rest momentum',
      'Count the polarizations of a massive spin-one particle',
      'Explain why a photon has two physical helicities',
    ],
    related: ['Poincaré Algebra', 'Wigner Rotations', 'Massive Spin One'],
  },
  {
    slug: 'discrete-projective-symmetries',
    title: 'Discrete and Projective Symmetries',
    route:
      '/chapters/relativistic-quantum-mechanics/discrete-projective-symmetries#question',
    category: 'Relativity',
    layer: 'Global quantum symmetry',
    status: 'seeded',
    summary:
      'Parity, antiunitary time reversal, projective phases, and the Lorentz double cover expose symmetry information that infinitesimal generators cannot see.',
    learningGoals: [
      'Distinguish the connected Lorentz group from its other components',
      'Explain why positive-energy time reversal is antiunitary',
      'Separate removable phase conventions from global double-cover structure',
    ],
    exercises: [
      'Transform the Poincaré generators under parity and time reversal',
      'Derive the cocycle condition from associativity',
      'Explain why a 2π loop and a 4π loop behave differently for spinors',
    ],
    related: ['Lorentz Transformations', 'Poincaré Algebra', 'One-Particle States'],
  },
  {
    slug: 'klein-gordon-equation',
    title: 'Klein-Gordon Equation',
    route: '/chapters/relativistic-quantum-mechanics/wave-equations#klein-gordon',
    category: 'Wave Equations',
    layer: 'Scalar relativistic waves',
    status: 'seeded',
    summary:
      'The Klein-Gordon equation follows from the relativistic energy-momentum relation and describes spin-0 relativistic modes.',
    learningGoals: [
      'Derive the equation from E^2 = p^2 c^2 + m^2 c^4',
      'Interpret plane-wave solutions',
      'Understand why probability density becomes subtle',
    ],
    exercises: [
      'Plug a plane wave into the equation',
      'Find the dispersion relation',
      'Compare its density with Schrodinger probability density',
    ],
    related: ['Lorentz Symmetry', 'Scalar Fields'],
  },
  {
    slug: 'dirac-equation',
    title: 'Dirac Equation',
    route: '/chapters/relativistic-quantum-mechanics/wave-equations#dirac',
    category: 'Wave Equations',
    layer: 'Spinor relativistic waves',
    status: 'seeded',
    summary:
      'The Dirac equation is first order in time and space, introduces gamma matrices, and naturally contains spin and antiparticle structure.',
    learningGoals: [
      'Explain why a linear relativistic equation needs matrices',
      'State the gamma-matrix anticommutation relation',
      'Recognize the positive and negative energy branches',
    ],
    exercises: [
      'Square the Dirac operator to recover the mass shell',
      'Check the continuity equation',
      'List what a four-component spinor stores',
    ],
    related: ['Spinors', 'Antiparticles'],
  },
  {
    slug: 'fields-over-particles',
    title: 'Fields over Fixed Particle Number',
    route: '/chapters/relativistic-quantum-mechanics/toward-fields#fixed-number',
    category: 'Fields',
    layer: 'QFT motivation',
    status: 'seeded',
    summary:
      'Relativity and quantum mechanics together make fixed-particle-number wave mechanics unstable; local fields handle creation, annihilation, and covariance.',
    learningGoals: [
      'Explain why relativistic energy allows particle production',
      'Connect negative-frequency modes to antiparticles',
      'State why locality is easier with fields',
    ],
    exercises: [
      'Estimate when pair production becomes energetically allowed',
      'Compare one-particle and field mode language',
      'Map a field mode to a creation operator preview',
    ],
    related: ['Canonical Quantization', 'Path Integrals'],
  },
  {
    slug: 'asymptotic-states',
    title: 'Asymptotic States',
    route: '/chapters/scattering-theory/asymptotic-states',
    category: 'Foundations',
    layer: 'Scattering states',
    status: 'seeded',
    summary:
      'Localized incoming and outgoing packets connect freely interpreted detector records to exact states of the interacting theory.',
    learningGoals: [
      'Explain why the asymptotic condition is a statement about wave packets',
      'Interpret the in and out Møller operators',
      'State when stable particle states form a complete scattering basis',
    ],
    exercises: [
      'Build a localized state from momentum eigenstates',
      'Compare incoming and outgoing boundary prescriptions',
      'Identify why an unstable resonance is not an external state',
    ],
    related: ['One-Particle States', 'Fock Space', 'Infrared Physics'],
  },
  {
    slug: 'scattering-amplitudes',
    title: 'The S-Matrix and Scattering Amplitudes',
    route: '/chapters/scattering-theory/s-matrix',
    category: 'Calculations',
    layer: 'Quantum transitions',
    status: 'seeded',
    summary:
      'The S-matrix compares exact in and out states, while the invariant amplitude isolates connected dynamics from unchanged propagation and momentum conservation.',
    learningGoals: [
      'Separate the identity and transition parts of S',
      'Read the momentum-conservation delta function correctly',
      'Use symmetry and cluster decomposition to constrain amplitudes',
    ],
    exercises: [
      'Extract an invariant amplitude from a matrix element',
      'Write the Mandelstam invariants for 2-to-2 scattering',
      'Distinguish connected processes from spectator contributions',
    ],
    related: ['Asymptotic States', 'Poincaré Algebra', 'Feynman Rules'],
  },
  {
    slug: 'cross-sections-phase-space',
    title: 'Cross-Sections and Phase Space',
    route: '/chapters/scattering-theory/amplitudes-to-observables',
    category: 'Calculations',
    layer: 'Observable rates',
    status: 'seeded',
    summary:
      'Invariant phase space and incoming flux turn squared amplitudes into decay widths, angular distributions, and cross-sections.',
    learningGoals: [
      'Separate dynamics, phase space, and incident flux',
      'Apply spin averages and identical-particle factors',
      'Recognize two-body thresholds through the Källén function',
    ],
    exercises: [
      'Reduce two-body phase space in the center-of-momentum frame',
      'Check the dimensions of a decay width and cross-section',
      'Convert luminosity and cross-section into an event rate',
    ],
    related: ['Scattering Amplitudes', 'Decay Widths', 'Collider Kinematics'],
  },
  {
    slug: 'unitarity-optical-theorem',
    title: 'Unitarity and the Optical Theorem',
    route: '/chapters/scattering-theory/unitarity',
    category: 'Calculations',
    layer: 'Probability constraints',
    status: 'seeded',
    summary:
      'Probability conservation ties the imaginary part of a forward amplitude to the inclusive sum over every physically open channel.',
    learningGoals: [
      'Derive the transition-operator unitarity relation',
      'Interpret on-shell intermediate states in the optical theorem',
      'Distinguish full unitarity from loss out of one selected channel',
    ],
    exercises: [
      'Insert a complete set of final states into the unitarity relation',
      'Verify the optical theorem for one partial wave',
      'Locate the first branch point when a new channel opens',
    ],
    related: ['Scattering Amplitudes', 'Partial Waves', 'Cut Diagrams'],
  },
  {
    slug: 'partial-waves',
    title: 'Partial Waves and Phase Shifts',
    route: '/chapters/scattering-theory/partial-waves',
    category: 'Calculations',
    layer: 'Angular channels',
    status: 'seeded',
    summary:
      'Rotational symmetry reorganizes a scattering amplitude into angular-momentum channels that obey separate geometric unitarity bounds.',
    learningGoals: [
      'Expand a spinless amplitude in Legendre polynomials',
      'Interpret phase shift and inelasticity on the Argand diagram',
      'Predict which angular channel dominates near threshold',
    ],
    exercises: [
      'Recover the elastic partial-wave unitarity circle',
      'Show that low-energy short-range scattering is s-wave dominated',
      'Derive the black-disk elastic and reaction cross-sections',
    ],
    related: ['Unitarity', 'Angular Momentum', 'Resonances'],
  },
  {
    slug: 'resonances',
    title: 'Resonances and Unstable Particles',
    route: '/chapters/scattering-theory/resonances',
    category: 'Calculations',
    layer: 'Analytic structure',
    status: 'seeded',
    summary:
      'An unstable particle appears through a complex pole whose position, residue, and phase motion encode mass, lifetime, and channel couplings.',
    learningGoals: [
      'Connect complex pole position to width and lifetime',
      'Interpret partial widths and branching fractions',
      'Explain why interference can hide a resonance peak',
    ],
    exercises: [
      'Read mass and width from a narrow pole',
      'Relate a branching ratio to a partial width',
      'Combine a pole amplitude with a smooth background',
    ],
    related: ['Partial Waves', 'Analytic Continuation', 'Decay Widths'],
  },
  {
    slug: 'relativistic-quantum-mechanics-problems',
    title: 'Relativistic Quantum Mechanics Workbook',
    route: '/chapters/relativistic-quantum-mechanics/problems',
    category: 'Calculations',
    layer: 'Solved problems',
    status: 'seeded',
    summary:
      'Six guided solutions develop Wigner rotations, boosted photon polarization, the Galilei central charge, Poincaré Casimirs, and 2+1-dimensional particle states.',
    learningGoals: [
      'Translate symmetry laws into explicit observer transformations',
      'Derive a Lie algebra and identify its non-removable central charge',
      'Classify massive and massless states in a lower-dimensional spacetime',
    ],
    exercises: [
      'Compute a transverse Wigner rotation',
      'Restore a boosted photon polarization to radiation gauge',
      'Prove that P² and W² are invariant operators',
    ],
    related: ['Poincaré Algebra', 'One-Particle States', 'Projective Representations'],
  },
  {
    slug: 'scattering-theory-problems',
    title: 'Scattering Theory Workbook',
    route: '/chapters/scattering-theory/problems',
    category: 'Calculations',
    layer: 'Solved problems',
    status: 'seeded',
    summary:
      'Seven complete calculations cover a separable interaction, resonance data, lab-frame phase space, Dyson ordering, the K-matrix, and partial-wave methods.',
    learningGoals: [
      'Solve and resum a Lippmann-Schwinger equation',
      'Derive observable cross-sections in nontrivial frames',
      'Use Hermiticity, angular momentum, and isospin to organize scattering',
    ],
    exercises: [
      'Extract a branching fraction from a resonant peak',
      'Derive the lab-frame recoil Jacobian',
      'Normalize an energy-labelled partial-wave basis',
    ],
    related: ['Scattering Amplitudes', 'Unitarity', 'Partial Waves'],
  },
  {
    slug: 'propagators',
    title: 'Propagators',
    category: 'Calculations',
    layer: 'Green functions',
    status: 'planned',
    summary:
      'Propagators are the response functions that become internal lines in perturbative QFT calculations.',
    learningGoals: [
      'Relate propagators to differential operators',
      'Understand boundary prescriptions',
      'Preview how correlators encode amplitudes',
    ],
    exercises: [
      'Solve a simple Green function equation',
      'Compare retarded and Feynman prescriptions',
      'Identify poles in momentum space',
    ],
    related: ['Path Integrals', 'Feynman Rules'],
  },
]

export const topicCategories = [...new Set(topics.map((topic) => topic.category))]
