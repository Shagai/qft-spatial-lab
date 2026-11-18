import { lazy, Suspense, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './labs.css'

const Spin = lazy(() => import('./spin/SpinLab'))
const Field = lazy(() => import('./field/FieldLab'))

const experiments = {
  spinor: { name: 'Spinor interferometer', chapter: 'discrete-projective-symmetries', section: 'double-cover' },
  'field-modes': { name: 'Field modes', chapter: 'toward-fields', section: 'creation-operators' },
}
type Experiment = keyof typeof experiments

function Instrument({ which, embedded }: { which: Experiment; embedded?: boolean }) {
  return <Suspense fallback={<p role="status">Opening the experiment…</p>}>
    {which === 'spinor' ? <Spin embedded={embedded} /> : <Field embedded={embedded} />}
  </Suspense>
}

export function LabPage({ which }: { which: Experiment }) {
  const { chapter, section } = experiments[which]
  return <div className="lab-page">
    <div className="lab-navigation">
      <nav aria-label="Experiments">
        <NavLink to="/labs/spinor">Spinor interferometer</NavLink>
        <NavLink to="/labs/field-modes">Field modes</NavLink>
      </nav>
      <Link className="lab-chapter-link" to={'/chapters/relativistic-quantum-mechanics/' + chapter + '#' + section}>Read chapter ↗</Link>
    </div>
    <Instrument key={which} which={which} />
  </div>
}

export function LabEmbed({ which }: { which: Experiment }) {
  const [open, setOpen] = useState(false)
  return <aside className="lab-embed">
    <div className="lab-embed-bar">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? 'Close experiment' : 'Open experiment'} · {experiments[which].name}
      </button>
      <Link to={'/labs/' + which}>Full lab ↗</Link>
    </div>
    {open && <Instrument which={which} embedded />}
  </aside>
}
