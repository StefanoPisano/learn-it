import { useState, useMemo } from 'react'
import { Search, Plus, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LearningPathCard } from '../components/LearningPathCard'
import { EmptyState } from '../components/EmptyState'
import { ImportModal } from '../components/ImportModal'
import { useLearningPathStore, calcProgress } from '../store/learningPathStore'

type Difficulty = 'beginner' | 'intermediate' | 'advanced'
type SortBy = 'title' | 'progress' | 'difficulty'

export function LearningPaths() {
  const { t } = useTranslation()
  const paths = useLearningPathStore((state) => state.paths)
  const removePath = useLearningPathStore((state) => state.removePath)
  const followPath = useLearningPathStore((state) => state.followPath)
  const unfollowPath = useLearningPathStore((state) => state.unfollowPath)
  const [search, setSearch] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortBy>('title')
  const [isImportOpen, setIsImportOpen] = useState(false)

  const sortOptions: { value: SortBy; label: string }[] = [
    { value: 'title', label: t('learningPaths.sort.title') },
    { value: 'progress', label: t('learningPaths.sort.progress') },
    { value: 'difficulty', label: t('learningPaths.sort.difficulty') },
  ]

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    paths.forEach((path) => path.tags.forEach((tag) => tags.add(tag.toLowerCase())))
    return Array.from(tags).sort()
  }, [paths])

  const filteredPaths = useMemo(() => {
    let result = paths
    if (search.trim()) {
      const query = search.toLowerCase()
      result = result.filter(
        (path) =>
          path.title.toLowerCase().includes(query) ||
          path.description.toLowerCase().includes(query) ||
          path.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    if (selectedDifficulty) {
      result = result.filter((path) => path.difficulty === selectedDifficulty)
    }

    if (selectedTag) {
      result = result.filter((path) => path.tags.some((tag) => tag.toLowerCase() === selectedTag))
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'progress') return calcProgress(b.sections) - calcProgress(a.sections)
      if (sortBy === 'difficulty') {
        const order = { beginner: 0, intermediate: 1, advanced: 2 }
        return order[a.difficulty] - order[b.difficulty]
      }
      return 0
    })

    return result
  }, [paths, search, selectedDifficulty, selectedTag, sortBy])

  const hasActiveFilters = selectedDifficulty || selectedTag

  const handleDelete = (id: number) => {
    const path = paths.find((p) => p.id === id)
    if (path && window.confirm(t('learningPathCard.deleteConfirm', { title: path.title }))) {
      removePath(id)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">
            {t('learningPaths.title')}
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            {t('learningPaths.subtitle', { count: paths.length })}
          </p>
        </div>

        <button
          onClick={() => setIsImportOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary)]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('learningPaths.importPath')}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
          <input
            type="text"
            placeholder={t('learningPaths.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-colors"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t('learningPaths.sortBy', { label: opt.label })}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedTag === tag
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
            }`}
          >
            {tag}
          </button>
        ))}

        {hasActiveFilters && (
          <button
            onClick={() => {
              setSelectedDifficulty(null)
              setSelectedTag(null)
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            {t('learningPaths.clearFilters')}
          </button>
        )}
      </div>

      {filteredPaths.length === 0 ? (
        <EmptyState message={t('learningPaths.emptyState')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPaths.map((path) => (
            <LearningPathCard
              key={path.id}
              {...path}
              onDelete={path.source === 'imported' ? handleDelete : undefined}
              onFollow={followPath}
              onUnfollow={unfollowPath}
            />
          ))}
        </div>
      )}

      <ImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
    </div>
  )
}
