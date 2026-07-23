import { BookOpen, Pencil, ExternalLink, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Section } from '../store/learningPathStore'

const sectionIcons = {
  concept: BookOpen,
  exercise: Pencil,
  quiz: Pencil,
  reference: ExternalLink,
} as const

function getSectionName(content: string, type: Section['type']): string {
  if (type === 'quiz') return 'Quiz'
  const match = content.match(/^##\s+(.+)/m)
  if (match) return match[1].replace(/\*\*|__|\*|_/g, '').trim()
  const firstLine = content.split('\n').find((l) => l.trim())
  return firstLine?.trim().slice(0, 60) ?? type.charAt(0).toUpperCase() + type.slice(1)
}

interface SectionListProps {
  sections: Section[]
  currentIndex: number
  onNavigate: (index: number) => void
}

export function SectionList({ sections, currentIndex, onNavigate }: SectionListProps) {
  const { t } = useTranslation()

  return (
    <nav className="space-y-1">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3 px-2">
        {t('viewer.sections')}
      </h3>
      {sections.map((section, index) => {
        const Icon = sectionIcons[section.type]
        const isCurrent = index === currentIndex
        const isCompleted = section.completed

        return (
          <button
            key={index}
            onClick={() => onNavigate(index)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${
              isCurrent
                ? 'bg-[var(--color-primary)] text-white font-medium shadow-sm'
                : isCompleted
                  ? 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
                  : 'text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]'
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-white' : isCompleted ? 'text-[var(--color-secondary)]' : 'text-[var(--color-text-secondary)]'}`} />
            <span className="truncate flex-1">{getSectionName(section.content, section.type)}</span>
            {isCompleted && (
              <Check className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-white/80' : 'text-[var(--color-secondary)]'}`} />
            )}
          </button>
        )
      })}
    </nav>
  )
}
