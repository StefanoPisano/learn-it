import { Trash2 } from 'lucide-react'
import { getLanguageDisplay, getLanguageName } from '../utils/languageFlags'

interface LearningPathCardProps {
  id: number
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  progress: number
  author: string
  language: string
  onDelete?: (id: number) => void
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  advanced: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
}

export function LearningPathCard({
  id,
  title,
  description,
  difficulty,
  tags,
  progress,
  author,
  language,
  onDelete,
}: LearningPathCardProps) {
  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-[var(--color-text)] line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${difficultyColors[difficulty]}`}
            >
              {difficulty}
            </span>
            {onDelete && (
              <button
                onClick={() => onDelete(id)}
                className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-[var(--color-text-secondary)] hover:text-red-500 transition-colors"
                aria-label="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
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
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[var(--color-text-secondary)]">
            {author} · <span title={getLanguageName(language)}>{getLanguageDisplay(language)}</span>
          </span>
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">
            {progress}%
          </span>
        </div>
        <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-secondary)] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
