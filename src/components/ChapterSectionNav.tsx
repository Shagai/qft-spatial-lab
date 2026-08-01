import { Link } from 'react-router-dom'
import {
  relativisticQuantumMechanicsRoute,
  relativisticQuantumMechanicsSections,
} from '../data/relativisticQuantumMechanics'

type ChapterSectionNavProps = {
  currentSlug: string
  sections?: Array<{
    slug: string
    number: string
    shortTitle: string
    route: string
  }>
  overviewRoute?: string
  overviewLabel?: string
  chapterTitle?: string
  completionRoute?: string
  completionEyebrow?: string
  completionLabel?: string
}

export default function ChapterSectionNav({
  currentSlug,
  sections = relativisticQuantumMechanicsSections,
  overviewRoute = relativisticQuantumMechanicsRoute,
  overviewLabel = 'Chapter overview',
  chapterTitle = 'Relativistic Quantum Mechanics',
  completionRoute = '/chapters',
  completionEyebrow = 'Chapter complete',
  completionLabel = 'All chapters',
}: ChapterSectionNavProps) {
  const currentIndex = sections.findIndex((section) => section.slug === currentSlug)
  const previous = currentIndex > 0 ? sections[currentIndex - 1] : null
  const next =
    currentIndex >= 0 && currentIndex < sections.length - 1
      ? sections[currentIndex + 1]
      : null

  return (
    <nav className="chapter-section-nav" aria-label={`${chapterTitle} section navigation`}>
      <Link className="chapter-overview-link" to={overviewRoute}>
        {overviewLabel}
      </Link>
      <div className="chapter-section-nav-links">
        {previous ? (
          <Link className="chapter-sequence-link previous" to={previous.route}>
            <span>Previous · {previous.number}</span>
            <strong>{previous.shortTitle}</strong>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="chapter-sequence-link next" to={next.route}>
            <span>Next · {next.number}</span>
            <strong>{next.shortTitle}</strong>
          </Link>
        ) : (
          <Link className="chapter-sequence-link next" to={completionRoute}>
            <span>{completionEyebrow}</span>
            <strong>{completionLabel}</strong>
          </Link>
        )}
      </div>
    </nav>
  )
}
