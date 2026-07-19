import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { LearningPathCard } from '../components/LearningPathCard'
import { EmptyState } from '../components/EmptyState'
import { useLearningPathStore } from '../store/learningPathStore'

export function Dashboard() {
  const { t } = useTranslation()
  const paths = useLearningPathStore((state) => state.paths)
  const unfollowPath = useLearningPathStore((state) => state.unfollowPath)
  const [search, setSearch] = useState('')

  const followedPaths = useMemo(() => paths.filter((p) => p.followed), [paths])

  const filteredPaths = useMemo(() => {
    if (!search.trim()) return followedPaths
    const query = search.toLowerCase()
    return followedPaths.filter(
      (path) =>
        path.title.toLowerCase().includes(query) ||
        path.description.toLowerCase().includes(query) ||
        path.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
  }, [search, followedPaths])

  const handleUnfollow = (id: number) => {
    const path = paths.find((p) => p.id === id)
    if (path && window.confirm(t('dashboard.unfollowConfirm', { title: path.title }))) {
      unfollowPath(id)
    }
  }

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

        <Link
          to="/paths"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 rounded-lg hover:bg-[var(--color-primary)]/20 transition-colors"
        >
          {t('dashboard.browsePaths')}
        </Link>
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
        <EmptyState message={followedPaths.length === 0 ? t('dashboard.emptyStateFollowed') : t('dashboard.emptyState')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPaths.map((path) => (
            <LearningPathCard
              key={path.id}
              {...path}
              onUnfollow={handleUnfollow}
            />
          ))}
        </div>
      )}
    </div>
  )
}
