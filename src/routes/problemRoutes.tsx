import { lazy, type ComponentType } from 'react'
import {
  relativisticQuantumMechanicsProblems,
  scatteringTheoryProblems,
  type SolvedProblem,
} from '../data/problemSets'

const problemPageModules = import.meta.glob<{ default: ComponentType }>(
  '../articles/*/problems/*.mdx',
)

function solutionRoutes(chapterSlug: string, problems: SolvedProblem[]) {
  return problems.map((problem) => {
    const modulePath = `../articles/${chapterSlug}/problems/${problem.slug}.mdx`
    const loadProblemPage = problemPageModules[modulePath]

    if (!loadProblemPage) {
      throw new Error(`Missing solved-problem page: ${modulePath}`)
    }

    return {
      path: problem.route.slice(1),
      Component: lazy(loadProblemPage),
    }
  })
}

export const problemSolutionRoutes = [
  ...solutionRoutes(
    'relativistic-quantum-mechanics',
    relativisticQuantumMechanicsProblems,
  ),
  ...solutionRoutes('scattering-theory', scatteringTheoryProblems),
]
