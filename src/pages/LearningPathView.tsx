import { useState, useCallback, useMemo, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { ChevronLeft, ChevronRight, ArrowLeft, RotateCcw, CheckCheck, List } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLearningPathStore, calcProgress } from '../store/learningPathStore'
import { SectionRenderer } from '../components/SectionRenderer'
import { SectionList } from '../components/SectionList'
import { getLanguageDisplay, getLanguageName } from '../utils/languageFlags'
import { difficultyColors } from '../utils/difficultyColors'

export function LearningPathView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const path = useLearningPathStore((state) => state.paths.find((p) => p.id === Number(id)))
  const toggleSection = useLearningPathStore((state) => state.toggleSection)

  useEffect(() => {
    if (path && !path.followed) navigate('/paths', { replace: true })
  }, [path, navigate])

  const sections = useMemo(() => path?.sections ?? [], [path?.sections])
  const totalSections = sections.length

  const [quizPassed, setQuizPassed] = useState(false)
  const [sectionListOpen, setSectionListOpen] = useState(false)

  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!path?.sections) return 0
    for (let i = 0; i < path.sections.length; i++) {
      if (!path.sections[i].completed) return i
    }
    return 0
  })

  const currentSection = sections[currentIndex]
  const isQuiz = currentSection?.type === 'quiz'
  const canComplete = isQuiz ? quizPassed : !currentSection?.completed

  const handleMarkComplete = useCallback(() => {
    if (!path) return
    toggleSection(path.id, currentIndex)
    setQuizPassed(false)
    if (currentIndex < totalSections - 1) {
      setCurrentIndex((i) => i + 1)
    }
  }, [path, currentIndex, totalSections, toggleSection])

  const handleReset = useCallback(() => {
    if (!path || !path.sections) return
    if (window.confirm(t('viewer.resetConfirm'))) {
      path.sections.forEach((_, i) => {
        if (sections[i].completed) toggleSection(path.id, i)
      })
      setCurrentIndex(0)
      setQuizPassed(false)
    }
  }, [path, sections, t, toggleSection])

  const handleCompleteAll = useCallback(() => {
    if (!path || !path.sections) return
    path.sections.forEach((s, i) => {
      if (!s.completed) toggleSection(path.id, i)
    })
  }, [path, toggleSection])

  const handleQuizPass = useCallback(() => {
    setQuizPassed(true)
  }, [])

  const progress = calcProgress(sections)

  if (!path || !path.followed) {
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
