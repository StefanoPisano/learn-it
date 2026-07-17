import { useState, useMemo } from 'react'
import { Search, Plus } from 'lucide-react'
import { LearningPathCard } from '../components/LearningPathCard'
import { EmptyState } from '../components/EmptyState'

const mockLearningPaths = [
  {
    id: 1,
    title: 'React Hooks Deep Dive',
    description: 'Master useState, useEffect, useContext and custom hooks with practical examples.',
    difficulty: 'intermediate' as const,
    tags: ['react', 'hooks', 'frontend'],
    progress: 65,
    author: 'John Doe',
  },
  {
    id: 2,
    title: 'TypeScript Fundamentals',
    description: 'Learn TypeScript from scratch - types, interfaces, generics and best practices.',
    difficulty: 'beginner' as const,
    tags: ['typescript', 'javascript'],
    progress: 100,
    author: 'Jane Smith',
  },
  {
    id: 3,
    title: 'Advanced CSS Patterns',
    description: 'Explore modern CSS techniques: grid, flexbox, custom properties and animations.',
    difficulty: 'advanced' as const,
    tags: ['css', 'frontend', 'design'],
    progress: 30,
    author: 'Mike Johnson',
  },
  {
    id: 4,
    title: 'Node.js API Design',
    description: 'Build RESTful APIs with Node.js, Express and best practices for production.',
    difficulty: 'intermediate' as const,
    tags: ['nodejs', 'backend', 'api'],
    progress: 0,
    author: 'Sarah Wilson',
  },
  {
    id: 5,
    title: 'Git Workflow Mastery',
    description: 'Learn Git branching strategies, rebasing, and collaboration workflows.',
    difficulty: 'beginner' as const,
    tags: ['git', 'devops'],
    progress: 85,
    author: 'Alex Chen',
  },
  {
    id: 6,
    title: 'Database Design Principles',
    description: 'Understand relational database design, normalization and query optimization.',
    difficulty: 'advanced' as const,
    tags: ['database', 'sql', 'backend'],
    progress: 15,
    author: 'Emily Brown',
  },
]

export function Dashboard() {
  const [search, setSearch] = useState('')

  const filteredPaths = useMemo(() => {
    if (!search.trim() || search.length < 3) return mockLearningPaths

    const query = search.toLowerCase()
    return mockLearningPaths.filter(
      (path) =>
        path.title.toLowerCase().includes(query) ||
        path.description.toLowerCase().includes(query) ||
        path.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
  }, [search])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">
            Dashboard
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            Your learning progress at a glance
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary)]/90 transition-colors">
          <Plus className="w-5 h-5" />
          Import Path
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
        <input
          type="text"
          placeholder="Search learning paths..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-colors"
        />
      </div>

      {filteredPaths.length === 0 ? (
        <EmptyState message="No learning paths match your search" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPaths.map((path) => (
            <LearningPathCard key={path.id} {...path} />
          ))}
        </div>
      )}
    </div>
  )
}
