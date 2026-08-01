import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ChaptersPage from './pages/ChaptersPage'
import HomePage from './pages/HomePage'
import TopicsPage from './pages/TopicsPage'
import { problemSolutionRoutes } from './routes/problemRoutes'

const RelativisticQuantumMechanicsPage = lazy(
  () => import('./pages/RelativisticQuantumMechanicsPage'),
)
const RelativisticQuantumMechanicsProblemsPage = lazy(() =>
  import('./pages/ChapterProblemsPage').then((module) => ({
    default: module.RelativisticQuantumMechanicsProblemsPage,
  })),
)
const QuantumLanguage = lazy(
  () => import('./articles/relativistic-quantum-mechanics/quantum-language.mdx'),
)
const LorentzTransformations = lazy(
  () => import('./articles/relativistic-quantum-mechanics/lorentz-transformations.mdx'),
)
const PoincareAlgebra = lazy(
  () => import('./articles/relativistic-quantum-mechanics/poincare-algebra.mdx'),
)
const OneParticleStates = lazy(
  () => import('./articles/relativistic-quantum-mechanics/one-particle-states.mdx'),
)
const DiscreteProjectiveSymmetries = lazy(
  () => import('./articles/relativistic-quantum-mechanics/discrete-projective-symmetries.mdx'),
)
const WaveEquations = lazy(
  () => import('./articles/relativistic-quantum-mechanics/wave-equations.mdx'),
)
const TowardFields = lazy(
  () => import('./articles/relativistic-quantum-mechanics/toward-fields.mdx'),
)
const ScatteringTheoryPage = lazy(() => import('./pages/ScatteringTheoryPage'))
const ScatteringTheoryProblemsPage = lazy(() =>
  import('./pages/ChapterProblemsPage').then((module) => ({
    default: module.ScatteringTheoryProblemsPage,
  })),
)
const AsymptoticStates = lazy(
  () => import('./articles/scattering-theory/asymptotic-states.mdx'),
)
const ScatteringMatrix = lazy(
  () => import('./articles/scattering-theory/s-matrix.mdx'),
)
const AmplitudesToObservables = lazy(
  () => import('./articles/scattering-theory/amplitudes-to-observables.mdx'),
)
const ScatteringPerturbationTheory = lazy(
  () => import('./articles/scattering-theory/perturbation-theory.mdx'),
)
const ScatteringUnitarity = lazy(
  () => import('./articles/scattering-theory/unitarity.mdx'),
)
const PartialWaves = lazy(
  () => import('./articles/scattering-theory/partial-waves.mdx'),
)
const Resonances = lazy(
  () => import('./articles/scattering-theory/resonances.mdx'),
)

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="chapters" element={<ChaptersPage />} />
        <Route
          path="chapters/relativistic-quantum-mechanics"
          element={<RelativisticQuantumMechanicsPage />}
        />
        <Route
          path="chapters/relativistic-quantum-mechanics/problems"
          element={<RelativisticQuantumMechanicsProblemsPage />}
        />
        <Route
          path="chapters/relativistic-quantum-mechanics/quantum-language"
          element={<QuantumLanguage />}
        />
        <Route
          path="chapters/relativistic-quantum-mechanics/lorentz-transformations"
          element={<LorentzTransformations />}
        />
        <Route
          path="chapters/relativistic-quantum-mechanics/poincare-algebra"
          element={<PoincareAlgebra />}
        />
        <Route
          path="chapters/relativistic-quantum-mechanics/one-particle-states"
          element={<OneParticleStates />}
        />
        <Route
          path="chapters/relativistic-quantum-mechanics/discrete-projective-symmetries"
          element={<DiscreteProjectiveSymmetries />}
        />
        <Route
          path="chapters/relativistic-quantum-mechanics/wave-equations"
          element={<WaveEquations />}
        />
        <Route
          path="chapters/relativistic-quantum-mechanics/toward-fields"
          element={<TowardFields />}
        />
        <Route path="chapters/scattering-theory" element={<ScatteringTheoryPage />} />
        <Route
          path="chapters/scattering-theory/problems"
          element={<ScatteringTheoryProblemsPage />}
        />
        <Route
          path="chapters/scattering-theory/asymptotic-states"
          element={<AsymptoticStates />}
        />
        <Route
          path="chapters/scattering-theory/s-matrix"
          element={<ScatteringMatrix />}
        />
        <Route
          path="chapters/scattering-theory/amplitudes-to-observables"
          element={<AmplitudesToObservables />}
        />
        <Route
          path="chapters/scattering-theory/perturbation-theory"
          element={<ScatteringPerturbationTheory />}
        />
        <Route
          path="chapters/scattering-theory/unitarity"
          element={<ScatteringUnitarity />}
        />
        <Route
          path="chapters/scattering-theory/partial-waves"
          element={<PartialWaves />}
        />
        <Route
          path="chapters/scattering-theory/resonances"
          element={<Resonances />}
        />
        {problemSolutionRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        <Route path="topics" element={<TopicsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
