import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

type TocItem = {
  href: string
  label: string
}

type ArticleLayoutProps = {
  kicker: string
  title: string
  subtitle: string
  updated: string
  readingTime: string
  toc: TocItem[]
  parent?: {
    label: string
    to: string
  }
  children: ReactNode
}

export default function ArticleLayout({
  kicker,
  title,
  subtitle,
  updated,
  readingTime,
  toc,
  parent,
  children,
}: ArticleLayoutProps) {
  const { hash } = useLocation()
  const tocItems = useMemo(
    () =>
      toc.map((item) => ({
        ...item,
        id: item.href.startsWith('#') ? item.href.slice(1) : item.href,
      })),
    [toc],
  )
  const [activeId, setActiveId] = useState(tocItems[0]?.id ?? '')

  useEffect(() => {
    const headings = tocItems
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => Boolean(heading))

    if (headings.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]

        if (visible?.target.id) {
          setActiveId(visible.target.id)
        }
      },
      {
        rootMargin: '-18% 0px -65% 0px',
        threshold: [0, 1],
      },
    )

    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [tocItems])

  useEffect(() => {
    const id = hash.startsWith('#') ? hash.slice(1) : hash

    if (!id) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(id)

      if (!target) {
        return
      }

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })
      setActiveId(id)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [hash])

  return (
    <article className="article-frame">
      <header className="article-hero">
        {parent ? (
          <Link className="article-breadcrumb" to={parent.to}>
            ← {parent.label}
          </Link>
        ) : null}
        <p className="eyebrow">{kicker}</p>
        <h1>{title}</h1>
        <p className="lede">{subtitle}</p>
        <dl className="article-meta">
          <div>
            <dt>Updated</dt>
            <dd>{updated}</dd>
          </div>
          <div>
            <dt>Reading time</dt>
            <dd>{readingTime}</dd>
          </div>
        </dl>
      </header>

      <div className="article-grid">
        <aside className="article-toc" aria-label="On this page">
          <strong>On this page</strong>
          {tocItems.map((item) => (
            <Link
              key={item.id}
              to={{ hash: item.href }}
              className={activeId === item.id ? 'article-toc-link is-active' : 'article-toc-link'}
              onClick={() => setActiveId(item.id)}
            >
              {item.label}
            </Link>
          ))}
        </aside>
        <div className="article-body">{children}</div>
      </div>
    </article>
  )
}
