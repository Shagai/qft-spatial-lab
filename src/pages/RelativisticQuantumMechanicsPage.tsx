import { Link } from 'react-router-dom'
import { RelativisticBridgeFigure } from '../components/InteractiveFigures'
import ProblemSetPreview from '../components/ProblemSetPreview'
import { relativisticQuantumMechanicsProblemsRoute } from '../data/problemSets'
import {
  relativisticQuantumMechanicsSections,
} from '../data/relativisticQuantumMechanics'

export default function RelativisticQuantumMechanicsPage() {
  return (
    <div className="page chapter-hub">
      <header className="chapter-hub-hero">
        <div>
          <p className="eyebrow">Chapter 1 · Guided reading path</p>
          <h1>Relativistic Quantum Mechanics</h1>
          <p className="lede">
            What changes when quantum states must make sense to every inertial observer? This
            chapter builds the answer from amplitudes and spacetime symmetry to particle types,
            discrete transformations, wave equations, and finally quantum fields.
          </p>
          <div className="action-row">
            <Link className="button primary" to={relativisticQuantumMechanicsSections[0].route}>
              Start section 1
            </Link>
            <Link className="button" to="/chapters">
              All chapters
            </Link>
          </div>
        </div>
        <aside className="chapter-hub-summary" aria-label="Chapter summary">
          <span>7 focused sections</span>
          <strong>About 116 minutes</strong>
          <p>Read in order the first time; return directly to any section when reviewing.</p>
        </aside>
      </header>

      <section className="chapter-thesis">
        <p className="eyebrow">The central problem</p>
        <h2>Relativity changes the meaning of a quantum state before it changes an equation.</h2>
        <p>
          The key task is not merely to replace the Schrödinger equation with a formula containing
          four-vectors. We must decide how spacetime transformations act on probabilities, how
          observers identify the same particle, and how spin survives when momentum changes. Once
          those questions are answered, the Klein-Gordon and Dirac equations fall into place—and
          their limitations point directly toward fields.
        </p>
      </section>

      <RelativisticBridgeFigure />

      <section className="reader-section">
        <div className="section-heading">
          <p className="eyebrow">Chapter map</p>
          <h2>Seven questions, one argument</h2>
          <p>Each page is short enough to study independently while preserving the full chain of ideas.</p>
        </div>
        <div className="chapter-section-list">
          {relativisticQuantumMechanicsSections.map((section) => (
            <Link className="chapter-section-card" key={section.slug} to={section.route}>
              <div className="chapter-section-number">
                <span>{section.number}</span>
                <small>{section.readingTime}</small>
              </div>
              <div className="chapter-section-copy">
                <p className="card-kicker">{section.question}</p>
                <h3>{section.title}</h3>
                <p>{section.summary}</p>
                <div className="definition-strip" aria-label={`Concepts in ${section.title}`}>
                  {section.concepts.map((concept) => (
                    <span key={concept}>{concept}</span>
                  ))}
                </div>
              </div>
              <span className="chapter-section-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <ProblemSetPreview
        count={6}
        title="Solved Relativistic Quantum Mechanics problems"
        summary="Work through observer boosts, photon polarization, the Galilei central charge, Poincaré Casimirs, and particle classification in 2+1 dimensions."
        route={relativisticQuantumMechanicsProblemsRoute}
        concepts={['Wigner rotations', 'Gauge freedom', 'Central extensions', 'Little groups']}
      />
    </div>
  )
}
