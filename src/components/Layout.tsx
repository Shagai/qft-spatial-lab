import { Suspense, useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Chapters', to: '/chapters' },
  { label: 'Topics', to: '/topics' },
]

export default function Layout() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink className="brand" to="/" aria-label="QFT Learning Notebook home">
          <span className="brand-mark">QFT</span>
          <span>
            <strong>QFT Learning Notebook</strong>
            <small>Fields, symmetries, particles, and calculations</small>
          </span>
        </NavLink>
        <nav className="top-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="route-main" ref={mainRef} tabIndex={-1} aria-label="Page content">
        <Suspense
          fallback={
            <div className="route-loading" role="status" aria-live="polite">
              Opening the note…
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <footer className="site-footer">
        <span>Static MDX knowledge base.</span>
        <span>Notes grow chapter by chapter from first principles.</span>
      </footer>
    </div>
  )
}
