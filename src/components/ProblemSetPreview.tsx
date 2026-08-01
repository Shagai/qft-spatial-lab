import { Link } from 'react-router-dom'

type ProblemSetPreviewProps = {
  count: number
  title: string
  summary: string
  route: string
  concepts: string[]
}

export default function ProblemSetPreview({
  count,
  title,
  summary,
  route,
  concepts,
}: ProblemSetPreviewProps) {
  return (
    <section className="problem-set-preview" aria-labelledby="problem-set-preview-title">
      <div>
        <p className="eyebrow">Practice the chapter</p>
        <h2 id="problem-set-preview-title">{title}</h2>
        <p>{summary}</p>
        <div className="definition-strip" aria-label="Problem-set techniques">
          {concepts.map((concept) => (
            <span key={concept}>{concept}</span>
          ))}
        </div>
      </div>
      <div className="problem-set-preview-action">
        <span>{count} complete walkthroughs</span>
        <Link className="button primary" to={route}>
          Open solved problems
        </Link>
      </div>
    </section>
  )
}
