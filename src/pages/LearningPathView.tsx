import { useState, useCallback, useRef, useMemo } from 'react'
import { useParams, Link } from 'react-router'
import { ChevronLeft, ChevronRight, ArrowLeft, RotateCcw, CheckCheck, List } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLearningPathStore } from '../store/learningPathStore'
import { SectionRenderer } from '../components/SectionRenderer'
import { SectionList } from '../components/SectionList'
import { getLanguageDisplay, getLanguageName } from '../utils/languageFlags'

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  advanced: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
}

function getInitialCompleted(progress: number, total: number): Set<number> {
  const completed = new Set<number>()
  const estimated = Math.round((progress / 100) * total)
  for (let i = 0; i < estimated; i++) completed.add(i)
  return completed
}

export function LearningPathView() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const path = useLearningPathStore((state) => state.paths.find((p) => p.id === Number(id)))
  const updatePath = useLearningPathStore((state) => state.updatePath)

  const sections = useMemo(() => path?.sections ?? [], [path?.sections])
  const totalSections = sections.length

  const [completedSections, setCompletedSections] = useState<Set<number>>(
    () => path ? getInitialCompleted(path.progress, totalSections) : new Set(),
  )
  const [quizPassed, setQuizPassed] = useState(false)
  const [sectionListOpen, setSectionListOpen] = useState(false)
  const lastWrittenProgress = useRef(path?.progress ?? 0)

  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!path) return 0
    const completed = getInitialCompleted(path.progress, totalSections)
    for (let i = 0; i < totalSections; i++) {
      if (!completed.has(i)) return i
    }
    return 0
  })

  const currentSection = sections[currentIndex]
  const isQuiz = currentSection?.type === 'quiz'
  const canComplete = isQuiz ? quizPassed : !completedSections.has(currentIndex)

  const handleMarkComplete = useCallback(() => {
    setCompletedSections((prev) => {
      const next = new Set(prev)
      next.add(currentIndex)
      return next
    })
    setQuizPassed(false)
    if (currentIndex < totalSections - 1) {
      setCurrentIndex((i) => i + 1)
    }
  }, [currentIndex, totalSections])

  const handleReset = useCallback(() => {
    if (!path) return
    if (window.confirm(t('viewer.resetConfirm'))) {
      setCompletedSections(new Set())
      setCurrentIndex(0)
      setQuizPassed(false)
      lastWrittenProgress.current = 0
      updatePath(path.id, { progress: 0 })
    }
  }, [path, t, updatePath])

  const handleCompleteAll = useCallback(() => {
    if (!path) return
    const all = new Set<number>(sections.map((_, i) => i))
    setCompletedSections(all)
    lastWrittenProgress.current = 100
    updatePath(path.id, { progress: 100 })
  }, [path, sections, updatePath])

  const handleQuizPass = useCallback(() => {
    setQuizPassed(true)
  }, [])

  const progress = totalSections > 0
    ? Math.round((completedSections.size / totalSections) * 100)
    : 0

  if (progress !== lastWrittenProgress.current && path) {
    lastWrittenProgress.current = progress
    updatePath(path.id, { progress })
  }

  if (!path) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <p className="text-[var(--color-text-secondary)] mb-4">Learning path not found.</p>
        <Link
          to="/paths"
          className="text-[var(--color-primary)] hover:underline"
        >
          {t('viewer.backToPaths')}
        </Link>
      </div>
    )
  }

  const sectionType = currentSection?.type

  return (
    <div className="max-w-6xl mx-auto overflow-x-hidden">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/paths"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{t('viewer.backToPaths')}</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setSectionListOpen((o) => !o)}
            className="lg:hidden flex items-center justify-center p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] rounded-lg transition-colors"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleCompleteAll}
            disabled={progress === 100}
            className="flex items-center justify-center p-1.5 text-[var(--color-secondary)] hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {sectionListOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setSectionListOpen(false)}>
            <div
              className="absolute left-0 top-0 bottom-0 w-72 bg-[var(--color-background)] p-4 overflow-y-auto shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[var(--color-text)]">{t('viewer.sections')}</h3>
                <button onClick={() => setSectionListOpen(false)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                  ✕
                </button>
              </div>
              <SectionList
                sections={sections}
                completedSections={completedSections}
                currentIndex={currentIndex}
                onNavigate={(i) => { setCurrentIndex(i); setQuizPassed(false); setSectionListOpen(false) }}
              />
            </div>
          </div>
        )}

        <aside className="hidden lg:block w-64 shrink-0 sticky top-20 self-start">
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-3">
            <SectionList
              sections={sections}
              completedSections={completedSections}
              currentIndex={currentIndex}
              onNavigate={(i) => { setCurrentIndex(i); setQuizPassed(false) }}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="mb-8">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="text-3xl font-bold text-[var(--color-text)]">
                {path.title}
              </h1>
              <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${difficultyColors[path.difficulty]}`}>
                {path.difficulty}
              </span>
            </div>
            <p className="text-[var(--color-text-secondary)] mb-3">
              {path.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
              <span>{path.author}</span>
              <span>·</span>
              <span title={getLanguageName(path.language)}>{getLanguageDisplay(path.language)}</span>
              {path.date && (
                <>
                  <span>·</span>
                  <span>{path.date}</span>
                </>
              )}
            </div>
          </div>

          {totalSections > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] mb-2">
                <span>{t('viewer.sectionProgress', { current: currentIndex + 1, total: totalSections })}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-secondary)] rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / totalSections) * 100}%` }}
                />
              </div>
            </div>
          )}

          {currentSection && (
            <div className="mb-8">
              <div className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wide mb-2">
                {t(`viewer.sectionType.${sectionType}`)}
              </div>
              <SectionRenderer
                key={currentIndex}
                section={currentSection}
                onQuizPass={handleQuizPass}
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-[var(--color-border)]">
            <button
              onClick={() => setCurrentIndex((i) => i - 1)}
              disabled={currentIndex === 0}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:border-[var(--color-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleMarkComplete}
              disabled={!canComplete}
              className="px-5 py-2 text-sm font-medium text-white bg-[var(--color-secondary)] rounded-lg hover:bg-[var(--color-secondary)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('viewer.markComplete')}
            </button>

            <button
              onClick={() => {
                setQuizPassed(false)
                setCurrentIndex((i) => i + 1)
              }}
              disabled={currentIndex >= totalSections - 1}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:border-[var(--color-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
