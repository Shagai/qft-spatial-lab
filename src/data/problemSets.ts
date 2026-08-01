export type SolvedProblem = {
  slug: string
  number: string
  title: string
  shortTitle: string
  readingTime: string
  difficulty: 'Guided' | 'Intermediate' | 'Advanced'
  question: string
  summary: string
  route: string
  theoryRoute: string
  concepts: string[]
}

export const relativisticQuantumMechanicsProblemsRoute =
  '/chapters/relativistic-quantum-mechanics/problems'

export const relativisticQuantumMechanicsProblems: SolvedProblem[] = [
  {
    slug: 'massive-spin-transverse-boost',
    number: '01',
    title: 'A Transverse Boost of a Massive Spin-One State',
    shortTitle: 'Massive transverse boost',
    readingTime: '18 min',
    difficulty: 'Intermediate',
    question:
      'How does a boost perpendicular to a massive particle’s momentum change both its momentum and spin description?',
    summary:
      'Construct the transformed momentum and the Wigner rotation, then read the new state as a spin-one superposition rather than a naively boosted spin label.',
    route: `${relativisticQuantumMechanicsProblemsRoute}/massive-spin-transverse-boost`,
    theoryRoute:
      '/chapters/relativistic-quantum-mechanics/one-particle-states#wigner-rotation',
    concepts: ['Standard boosts', 'Wigner rotation', 'Spin one', 'Observer change'],
  },
  {
    slug: 'photon-polarization-boost',
    number: '02',
    title: 'A Boosted Photon Polarization',
    shortTitle: 'Photon polarization boost',
    readingTime: '15 min',
    difficulty: 'Guided',
    question:
      'What does a transverse linear polarization look like to an observer boosted along the polarization direction?',
    summary:
      'Boost the momentum and polarization four-vector, use gauge freedom to return to a purely spatial representative, and verify transversality explicitly.',
    route: `${relativisticQuantumMechanicsProblemsRoute}/photon-polarization-boost`,
    theoryRoute: '/chapters/relativistic-quantum-mechanics/one-particle-states#photon',
    concepts: ['Photon', 'Polarization', 'Gauge freedom', 'Transversality'],
  },
  {
    slug: 'galilei-central-extension',
    number: '03',
    title: 'The Centrally Extended Galilei Algebra',
    shortTitle: 'Galilei central charge',
    readingTime: '22 min',
    difficulty: 'Advanced',
    question:
      'Which commutators follow from Galilean transformations, and which central term cannot be removed by redefining generators?',
    summary:
      'Differentiate the group law, use rotational covariance and Jacobi identities, and identify mass as the surviving central charge in three spatial dimensions.',
    route: `${relativisticQuantumMechanicsProblemsRoute}/galilei-central-extension`,
    theoryRoute: '/chapters/relativistic-quantum-mechanics/poincare-algebra#algebra',
    concepts: ['Galilei group', 'Lie algebra', 'Central extension', 'Mass'],
  },
  {
    slug: 'poincare-casimirs',
    number: '04',
    title: 'Why the Poincaré Casimirs Are Invariant',
    shortTitle: 'Poincaré Casimirs',
    readingTime: '15 min',
    difficulty: 'Guided',
    question:
      'Why do the contractions P² and W² commute with every Poincaré transformation?',
    summary:
      'Show that momentum and the Pauli-Lubanski vector transform covariantly, then use invariant contractions to prove that mass and spin label whole representations.',
    route: `${relativisticQuantumMechanicsProblemsRoute}/poincare-casimirs`,
    theoryRoute: '/chapters/relativistic-quantum-mechanics/poincare-algebra#casimirs',
    concepts: ['Casimir', 'Pauli-Lubanski vector', 'Translations', 'Lorentz covariance'],
  },
  {
    slug: 'massive-particles-in-2-plus-1',
    number: '05',
    title: 'Massive Spin in 2+1 Dimensions',
    shortTitle: 'Massive states in 2+1D',
    readingTime: '18 min',
    difficulty: 'Intermediate',
    question:
      'How are massive one-particle states classified when spacetime has only two spatial directions?',
    summary:
      'Find the SO(2) little group, explain one-dimensional spin sectors and anyonic spin on the universal cover, and track what parity and time reversal do to the spin label.',
    route: `${relativisticQuantumMechanicsProblemsRoute}/massive-particles-in-2-plus-1`,
    theoryRoute: '/chapters/relativistic-quantum-mechanics/one-particle-states#little-group',
    concepts: ['2+1 dimensions', 'SO(2)', 'Anyons', 'Parity and time reversal'],
  },
  {
    slug: 'massless-particles-in-2-plus-1',
    number: '06',
    title: 'Massless States in 2+1 Dimensions',
    shortTitle: 'Massless states in 2+1D',
    readingTime: '18 min',
    difficulty: 'Advanced',
    question:
      'What replaces helicity for a massless particle in 2+1-dimensional Minkowski spacetime?',
    summary:
      'Determine the null little group, distinguish its trivial and nontrivial unitary representations, and examine how inversions pair the continuous label.',
    route: `${relativisticQuantumMechanicsProblemsRoute}/massless-particles-in-2-plus-1`,
    theoryRoute: '/chapters/relativistic-quantum-mechanics/one-particle-states#massless',
    concepts: ['Null little group', 'Massless states', '2+1 dimensions', 'Inversions'],
  },
]

export const scatteringTheoryProblemsRoute = '/chapters/scattering-theory/problems'

export const scatteringTheoryProblems: SolvedProblem[] = [
  {
    slug: 'separable-interaction',
    number: '01',
    title: 'Solving a Separable Interaction Exactly',
    shortTitle: 'Separable interaction',
    readingTime: '18 min',
    difficulty: 'Intermediate',
    question:
      'How does a rank-one interaction turn the Lippmann-Schwinger equation into an algebraic problem?',
    summary:
      'Solve the in and out states, resum the transition operator, and expose the pole condition and unitary S-matrix in a model simple enough to do exactly.',
    route: `${scatteringTheoryProblemsRoute}/separable-interaction`,
    theoryRoute: '/chapters/scattering-theory/perturbation-theory#lippmann-schwinger',
    concepts: ['Rank-one potential', 'Resolvent', 'Lippmann-Schwinger', 'Pole condition'],
  },
  {
    slug: 'spin-one-resonance',
    number: '02',
    title: 'Branching Fractions from a Spin-One Resonance',
    shortTitle: 'Spin-one resonance',
    readingTime: '15 min',
    difficulty: 'Guided',
    question:
      'What can an elastic peak cross-section reveal about a resonance’s electronic branching fraction and total peak rate?',
    summary:
      'Apply the narrow-resonance formula, convert natural units to square centimeters, and separate production probability from decay probability.',
    route: `${scatteringTheoryProblemsRoute}/spin-one-resonance`,
    theoryRoute: '/chapters/scattering-theory/resonances#partial-widths',
    concepts: ['Breit-Wigner', 'Branching fraction', 'Peak cross-section', 'Unit conversion'],
  },
  {
    slug: 'laboratory-frame-cross-section',
    number: '03',
    title: 'Two-Body Scattering in the Laboratory Frame',
    shortTitle: 'Laboratory cross-section',
    readingTime: '20 min',
    difficulty: 'Advanced',
    question:
      'How do we integrate two-body phase space directly when the target begins at rest?',
    summary:
      'Start from the invariant master formula, eliminate the recoil momentum, evaluate the energy-delta Jacobian, and obtain dσ/dΩ in laboratory variables.',
    route: `${scatteringTheoryProblemsRoute}/laboratory-frame-cross-section`,
    theoryRoute: '/chapters/scattering-theory/amplitudes-to-observables#collisions',
    concepts: ['Lab frame', 'Phase space', 'Delta-function Jacobian', 'Recoil'],
  },
  {
    slug: 'born-to-dyson',
    number: '04',
    title: 'From Energy Denominators to the Dyson Series',
    shortTitle: 'Born to Dyson',
    readingTime: '18 min',
    difficulty: 'Intermediate',
    question:
      'How does old-fashioned perturbation theory reorganize itself into ordered interaction times?',
    summary:
      'Replace each energy denominator by a time integral, change variables to ordered vertex times, and recover the interaction-picture Dyson expansion.',
    route: `${scatteringTheoryProblemsRoute}/born-to-dyson`,
    theoryRoute: '/chapters/scattering-theory/perturbation-theory#dyson',
    concepts: ['Born series', 'Fourier representation', 'Time ordering', 'Dyson series'],
  },
  {
    slug: 'k-matrix',
    number: '05',
    title: 'Standing Waves and the Hermitian K-Matrix',
    shortTitle: 'Hermitian K-matrix',
    readingTime: '18 min',
    difficulty: 'Advanced',
    question:
      'Why does replacing the outgoing resolvent by its principal value produce a Hermitian reaction matrix?',
    summary:
      'Use the symmetric principal-value Green operator to prove Hermiticity and derive the Cayley transform that makes S-matrix unitarity automatic.',
    route: `${scatteringTheoryProblemsRoute}/k-matrix`,
    theoryRoute: '/chapters/scattering-theory/unitarity#operator-identity',
    concepts: ['Principal value', 'Standing waves', 'K-matrix', 'Cayley transform'],
  },
  {
    slug: 'pion-proton-partial-waves',
    number: '06',
    title: 'Pion-Proton Scattering in Partial Waves',
    shortTitle: 'Pion-proton partial waves',
    readingTime: '24 min',
    difficulty: 'Advanced',
    question:
      'How do total angular momentum, parity, and isospin organize elastic pion-proton scattering?',
    summary:
      'Build spin-flip and non-spin-flip amplitudes from δℓ± phase shifts, then combine the I = 1/2 and I = 3/2 channels for π⁺p and π⁻p.',
    route: `${scatteringTheoryProblemsRoute}/pion-proton-partial-waves`,
    theoryRoute: '/chapters/scattering-theory/partial-waves#coupled-channels',
    concepts: ['Pion-nucleon', 'Isospin', 'Spin flip', 'Phase shifts'],
  },
  {
    slug: 'partial-wave-normalization',
    number: '07',
    title: 'Normalizing the Partial-Wave Basis',
    shortTitle: 'Partial-wave normalization',
    readingTime: '18 min',
    difficulty: 'Advanced',
    question:
      'Why does the energy-normalized two-body partial-wave state carry its particular Jacobian?',
    summary:
      'Insert the momentum-space definition twice, use Clebsch-Gordan and spherical-harmonic orthogonality, and watch the radial Jacobian collapse to δ(E′ − E).',
    route: `${scatteringTheoryProblemsRoute}/partial-wave-normalization`,
    theoryRoute: '/chapters/scattering-theory/partial-waves#expansion',
    concepts: ['Partial-wave basis', 'Jacobian', 'Spherical harmonics', 'Normalization'],
  },
]
