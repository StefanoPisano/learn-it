import { Link } from 'react-router'
import { Trash2, Plus, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getLanguageDisplay, getLanguageName } from '../utils/languageFlags'
import { difficultyColors } from '../utils/difficultyColors'
import { calcProgress } from '../store/learningPathStore'
import type { Section } from '../store/learningPathStore'

interface LearningPathCardProps {
  id: number
  slug: string
  source: 'builtin' | 'imported'
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  sections?: Section[]
  followed: boolean
  author: string
  language: string
  version?: string
  onDelete?: (id: number) => void
  onFollow?: (id: number) => void
  onUnfollow?: (id: number) => void
}

export function LearningPathCard({
  id,
  source,
  title,
  description,
  difficulty,
  tags,
  sections,
  followed,
  author,
  language,
  version,
  onDelete,
  onFollow,
  onUnfollow,
}: Readonly<LearningPathCardProps>) {
  const { t } = useTranslation()
  const isBuiltin = source === 'builtin'
  const canDelete = !isBuiltin && onDelete
  const progress = calcProgress(sections)

  const rootClassName = followed
    ? 'block bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden'
    : 'block bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] opacity-60 overflow-hidden'

  const content = (
    <>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-[var(--color-text)] line-clamp-1">
            {title}
            {version && <span className="ml-1 text-xs font-normal text-[var(--color-text-secondary)]">v{version}</span>}
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            {isBuiltin && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                {t('learningPathCard.builtIn')}
              </span>
            )}
            <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${difficultyColors[difficulty]}`}>
              {difficulty}
            </span>
          </div>
        </div>

        <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-3">
          {description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-background)] text-[var(--color-text-secondary)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-background)]/50">
        {followed ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[var(--color-text-secondary)]">
                {author} · <span title={getLanguageName(language)}>{getLanguageDisplay(language)}</span>
              </span>
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                {progress}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-1.5 flex-1 bg-[var(--color-border)] rounded-full overflow-hidden mr-3">
                <div
                  className="h-full bg-[var(--color-secondary)] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onUnfollow?.(id) }}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] transition-colors"
                >
                  <Check className="w-3 h-3" />
                  {t('learningPathCard.following')}
                </button>
                {canDelete && (
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(id) }}
                    className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-[var(--color-text-secondary)] hover:text-red-500 transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--color-text-secondary)]">
              {author} · <span title={getLanguageName(language)}>{getLanguageDisplay(language)}</span>
            </span>
            <button
              onClick={() => onFollow?.(id)}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
            >
              <Plus className="w-3 h-3" />
              {t('learningPathCard.follow')}
            </button>
          </div>
        )}
      </div>
    </>
  )

  if (followed) {
    return (
      <Link to={`/paths/${id}`} className={rootClassName}>
        {content}
      </Link>
    )
  }

  return (
    <div className={rootClassName}>
      {content}
    </div>
  )
}
