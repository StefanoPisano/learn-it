import { useState, useMemo } from 'react'
import { Search, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LearningPathCard } from '../components/LearningPathCard'
import { EmptyState } from '../components/EmptyState'
import { ImportModal } from '../components/ImportModal'
import { useLearningPathStore } from '../store/learningPathStore'

export function Dashboard() {
  const { t } = useTranslation()
  const paths = useLearningPathStore((state) => state.paths)
  const [search, setSearch] = useState('')
  const [isImportOpen, setIsImportOpen] = useState(false)

  const filteredPaths = useMemo(() => {
    if (!search.trim()) return paths

    const query = search.toLowerCase()
    return paths.filter(
      (path) =>
        path.title.toLowerCase().includes(query) ||
        path.description.toLowerCase().includes(query) ||
        path.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
  }, [search, paths])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">
            {t('dashboard.title')}
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <button
          onClick={() => setIsImportOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary)]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('dashboard.importPath')}
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
        <input
          type="text"
          placeholder={t('dashboard.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-colors"
        />
      </div>

      {filteredPaths.length === 0 ? (
        <EmptyState message={t('dashboard.emptyState')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPaths.map((path) => (
            <LearningPathCard key={path.id} {...path} />
          ))}
        </div>
      )}

      <ImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
    </div>
  )
}
