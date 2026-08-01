import { Link } from 'react-router-dom'
import {
  relativisticQuantumMechanicsProblems,
  scatteringTheoryProblems,
  type SolvedProblem,
} from '../data/problemSets'

type ChapterProblemsPageProps = {
  kicker: string
  chapterTitle: string
  chapterRoute: string
  title: string
  subtitle: string
  totalTime: string
  problems: SolvedProblem[]
  conventions: string
}

function ChapterProblemsPage({
  kicker,
  chapterTitle,
  chapterRoute,
  title,
  subtitle,
  totalTime,
  problems,
  conventions,
}: ChapterProblemsPageProps) {
  return (
    <div className="page chapter-hub problem-hub">
      <header className="chapter-hub-hero">
        <div>
          <Link className="article-breadcrumb" to={chapterRoute}>
            ← {chapterTitle}
          </Link>
          <p className="eyebrow">{kicker}</p>
          <h1>{title}</h1>
          <p className="lede">{subtitle}</p>
          <div className="action-row">
            <Link className="button primary" to={problems[0].route}>
              Start problem 1
            </Link>
            <Link className="button" to={chapterRoute}>
              Chapter overview
            </Link>
          </div>
        </div>
        <aside className="chapter-hub-summary" aria-label="Problem set summary">
          <span>{problems.length} solved problems</span>
          <strong>{totalTime}</strong>
          <p>Every solution includes a plan, a full derivation, interpretation, and checks.</p>
        </aside>
      </header>

      <section className="chapter-thesis problem-set-thesis">
        <p className="eyebrow">How to use the workbook</p>
        <h2>Attempt the setup first; use the solution to inspect your reasoning.</h2>
        <p>
          Each exercise is paraphrased from the source problem and solved in the notation of this
          notebook. The goal is not merely to reach the boxed result, but to make every choice of
          basis, normalization, sign, and Jacobian visible.
        </p>
        <p className="problem-conventions">
          <strong>Working conventions.</strong> {conventions}
        </p>
      </section>

      <section className="reader-section">
        <div className="section-heading">
          <p className="eyebrow">Problem map</p>
          <h2>One focused page per derivation</h2>
          <p>Open them in order for a guided workbook, or jump directly to the technique you need.</p>
        </div>
        <div className="chapter-section-list problem-set-list">
          {problems.map((problem) => (
            <Link className="chapter-section-card problem-set-card" key={problem.slug} to={problem.route}>
              <div className="chapter-section-number">
                <span>{problem.number}</span>
                <small>{problem.readingTime}</small>
              </div>
              <div className="chapter-section-copy">
                <p className="card-kicker">
                  {problem.difficulty} · {problem.question}
                </p>
                <h3>{problem.title}</h3>
                <p>{problem.summary}</p>
                <div className="definition-strip" aria-label={`Concepts in ${problem.title}`}>
                  {problem.concepts.map((concept) => (
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
    </div>
  )
}

export function RelativisticQuantumMechanicsProblemsPage() {
  return (
    <ChapterProblemsPage
      kicker="Chapter 1 · Solved problem set"
      chapterTitle="Relativistic Quantum Mechanics"
      chapterRoute="/chapters/relativistic-quantum-mechanics"
      title="Relativistic Quantum Mechanics Problems"
      subtitle="Six guided derivations that turn boosts, little groups, central extensions, and Casimirs into working calculations."
      totalTime="About 106 minutes"
      problems={relativisticQuantumMechanicsProblems}
      conventions="The metric is (+,−,−,−), observer boosts are stated explicitly, and one-particle states use the chapter’s covariant conventions."
    />
  )
}

export function ScatteringTheoryProblemsPage() {
  return (
    <ChapterProblemsPage
      kicker="Chapter 2 · Solved problem set"
      chapterTitle="Scattering Theory"
      chapterRoute="/chapters/scattering-theory"
      title="Scattering Theory Problems"
      subtitle="Seven complete calculations connecting formal scattering identities to amplitudes, cross-sections, phase shifts, and resonances."
      totalTime="About 131 minutes"
      problems={scatteringTheoryProblems}
      conventions="We use S = 1 + iT, covariantly normalized external states, invariant phase space, and the (+,−,−,−) metric. Source-specific signs are translated before calculating."
    />
  )
}
