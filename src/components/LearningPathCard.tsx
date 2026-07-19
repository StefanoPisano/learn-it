interface LearningPathCardProps {
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  progress: number
  author: string
  language: string
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  advanced: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
}

export function LearningPathCard({
  title,
  description,
  difficulty,
  tags,
  progress,
  author,
  language,
}: LearningPathCardProps) {
  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-[var(--color-text)] line-clamp-1">
            {title}
          </h3>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${difficultyColors[difficulty]}`}
          >
            {difficulty}
          </span>
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
            {author} · {language.toUpperCase()}
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
