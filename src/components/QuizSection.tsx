import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Section, QuizQuestion } from '../store/learningPathStore'

interface QuizSectionProps {
  section: Section
  onPass?: () => void
}

export function QuizSection({ section, onPass }: QuizSectionProps) {
  const { t } = useTranslation()
  const questions = section.questions ?? []
  const isMultiple = section.variant === 'multiple'

  const [answers, setAnswers] = useState<Record<number, number[]>>({})
  const [checked, setChecked] = useState(false)
  const [passed, setPassed] = useState(false)

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (passed) return

    setAnswers((prev) => {
      const current = prev[questionIndex] ?? []

      if (isMultiple) {
        const next = current.includes(optionIndex)
          ? current.filter((i) => i !== optionIndex)
          : [...current, optionIndex]
        return { ...prev, [questionIndex]: next }
      }

      return { ...prev, [questionIndex]: [optionIndex] }
    })
  }

  const handleCheck = () => {
    const correct = questions.every((q, i) => isQuestionCorrect(q, answers[i] ?? []))
    setChecked(true)
    if (correct) {
      setPassed(true)
      onPass?.()
    }
  }

  const handleRetry = () => {
    setAnswers({})
    setChecked(false)
  }

  const correctCount = questions.filter((q, i) => {
    const selected = answers[i] ?? []
    return isQuestionCorrect(q, selected)
  }).length

  return (
    <div className="space-y-6">
      {questions.map((q, qi) => (
        <QuestionCard
          key={qi}
          question={q}
          index={qi}
          selected={answers[qi] ?? []}
          isMultiple={isMultiple}
          checked={checked}
          passed={passed}
          onSelect={(oi) => handleSelect(qi, oi)}
        />
      ))}

      {!checked && (
        <div className="flex justify-center">
          <button
            onClick={handleCheck}
            disabled={Object.keys(answers).length < questions.length}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t('viewer.checkAnswers')}
          </button>
        </div>
      )}

      {checked && !passed && (
        <div className="flex flex-col items-center gap-3 pt-4 border-t border-[var(--color-border)]">
          <span className="text-sm font-medium text-red-500">
            {correctCount}/{questions.length} {t('viewer.correct')}
          </span>
          <button
            onClick={handleRetry}
            className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors"
          >
            {t('viewer.retry')}
          </button>
        </div>
      )}

      {passed && (
        <div className="flex justify-center pt-4 border-t border-[var(--color-border)]">
          <span className="text-sm font-medium text-[var(--color-secondary)]">
            {questions.length}/{questions.length} {t('viewer.correct')}
          </span>
        </div>
      )}
    </div>
  )
}

function QuestionCard({
  question,
  index,
  selected,
  isMultiple,
  checked,
  passed,
  onSelect,
}: {
  question: QuizQuestion
  index: number
  selected: number[]
  isMultiple: boolean
  checked: boolean
  passed: boolean
  onSelect: (optionIndex: number) => void
}) {
  const disabled = passed

  return (
    <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-4">
      <p className="font-medium text-[var(--color-text)] mb-3">
        {index + 1}. {question.question}
      </p>
      <div className="space-y-2">
        {question.options.map((option, oi) => {
          const isSelected = selected.includes(oi)
          const isCorrect = question.correctIndex === oi
          const showResult = checked && isSelected

          return (
            <label
              key={oi}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer select-none ${
                showResult
                  ? isCorrect
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : checked && isCorrect && !passed
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : passed && isCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
              } ${disabled ? 'cursor-default' : ''}`}
            >
              <input
                type={isMultiple ? 'checkbox' : 'radio'}
                name={`q-${index}`}
                checked={isSelected}
                onChange={() => onSelect(oi)}
                disabled={disabled}
                className="w-4 h-4 border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]/50"
              />
              <span className="text-sm text-[var(--color-text)] flex-1">{option}</span>
              {showResult && (
                isCorrect
                  ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  : <XCircle className="w-4 h-4 text-red-500 shrink-0" />
              )}
              {checked && !passed && !isSelected && isCorrect && (
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              )}
            </label>
          )
        })}
      </div>
    </div>
  )
}

function isQuestionCorrect(question: QuizQuestion, selected: number[]): boolean {
  if (selected.length !== 1) return false
  return selected[0] === question.correctIndex
}
