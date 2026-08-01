import { Link } from 'react-router-dom'
import { ScatteringFlowFigure } from '../components/InteractiveFigures'
import ProblemSetPreview from '../components/ProblemSetPreview'
import { scatteringTheoryProblemsRoute } from '../data/problemSets'
import { scatteringTheorySections } from '../data/scatteringTheory'

export default function ScatteringTheoryPage() {
  return (
    <div className="page chapter-hub">
      <header className="chapter-hub-hero">
        <div>
          <p className="eyebrow">Chapter 2 · Guided reading path</p>
          <h1>Scattering Theory</h1>
          <p className="lede">
            How does a local quantum interaction become a number reported by an experiment? This
            chapter follows the chain from prepared particle packets to amplitudes, observable
            rates, unitarity, angular channels, and resonances.
          </p>
          <div className="action-row">
            <Link className="button primary" to={scatteringTheorySections[0].route}>
              Start section 1
            </Link>
            <Link className="button" to="/chapters">
              All chapters
            </Link>
          </div>
        </div>
        <aside className="chapter-hub-summary" aria-label="Chapter summary">
          <span>7 focused sections</span>
          <strong>About 118 minutes</strong>
          <p>Follow the argument in order, then return to individual tools as calculations require them.</p>
        </aside>
      </header>

      <section className="chapter-thesis">
        <p className="eyebrow">The central problem</p>
        <h2>A collision is not a little movie. It is a quantum map between preparations and detections.</h2>
        <p>
          The incoming and outgoing particles are observable because they become widely separated
          and approximately free. The interaction region can contain every quantum alternative
          allowed by the theory. Scattering theory deliberately avoids inventing one classical
          history for that region: it asks for the amplitude connecting what the laboratory can
          prepare to what its detectors can distinguish.
        </p>
      </section>

      <ScatteringFlowFigure />

      <section className="reader-section">
        <div className="section-heading">
          <p className="eyebrow">Chapter map</p>
          <h2>Seven questions, one experimental chain</h2>
          <p>Each page isolates one conceptual job while keeping the normalization and conventions consistent.</p>
        </div>
        <div className="chapter-section-list">
          {scatteringTheorySections.map((section) => (
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
        count={7}
        title="Solved Scattering Theory problems"
        summary="Apply the chapter to an exactly solvable interaction, resonance data, laboratory phase space, the Dyson expansion, K-matrices, and partial-wave calculations."
        route={scatteringTheoryProblemsRoute}
        concepts={['Lippmann-Schwinger', 'Cross-sections', 'K-matrix', 'Phase shifts']}
      />
    </div>
  )
}
