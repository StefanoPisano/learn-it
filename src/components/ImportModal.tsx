import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { parseMarkdown, ParseError } from '../utils/markdownParser'
import { getLanguageDisplay, getLanguageName } from '../utils/languageFlags'
import { useLearningPathStore } from '../store/learningPathStore'
import type { ParsedLearningPath } from '../utils/markdownParser'

const MAX_FILE_SIZE = 50 * 1024 // 50KB

type ModalState = 'idle' | 'fileSelected' | 'parsing' | 'preview' | 'importing' | 'success' | 'error'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const { t } = useTranslation()
  const addPath = useLearningPathStore((state) => state.addPath)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<ModalState>('idle')
  const [parsedData, setParsedData] = useState<ParsedLearningPath | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isDragOver, setIsDragOver] = useState(false)

  const resetState = useCallback(() => {
    setState('idle')
    setParsedData(null)
    setErrorMessage('')
  }, [])

  const handleClose = useCallback(() => {
    resetState()
    onClose()
  }, [resetState, onClose])

  useEffect(() => {
    if (!isOpen) {
      resetState()
    }
  }, [isOpen, resetState])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, handleClose])

  const validateFile = (file: File): string | null => {
    if (!file.name.endsWith('.md')) {
      return t('import.invalidFormat')
    }
    if (file.size > MAX_FILE_SIZE) {
      return t('import.fileTooLarge')
    }
    return null
  }

  const processFile = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setErrorMessage(validationError)
      setState('error')
      return
    }

    setState('parsing')

    try {
      const content = await file.text()
      const parsed = parseMarkdown(content)
      setParsedData(parsed)
      setState('preview')
    } catch (error) {
      if (error instanceof ParseError) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage(t('import.error'))
      }
      setState('error')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleImport = async () => {
    if (!parsedData) return

    setState('importing')

    try {
      addPath({
        title: parsedData.title,
        description: parsedData.description,
        difficulty: parsedData.difficulty,
        tags: parsedData.tags,
        author: parsedData.author,
        language: parsedData.language,
        link: parsedData.link,
        date: parsedData.date,
        version: parsedData.version,
        sections: parsedData.sections,
      })
      setState('success')
      setTimeout(handleClose, 1500)
    } catch {
      setErrorMessage(t('import.error'))
      setState('error')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-[var(--color-surface)] rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            {t('import.title')}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-[var(--color-background)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>
        </div>

        <div className="p-4">
          {state === 'idle' && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragOver
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                  : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                }
              `}
            >
              <Upload className="w-10 h-10 mx-auto mb-3 text-[var(--color-text-secondary)]" />
              <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                {t('import.dragDrop')}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {t('import.maxSize')}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".md"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {state === 'parsing' && (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-sm text-[var(--color-text-secondary)]">
                {t('import.parsing')}
              </p>
            </div>
          )}

          {state === 'preview' && parsedData && (
            <div>
              <h3 className="text-sm font-medium text-[var(--color-text)] mb-3">
                {t('import.preview')}
              </h3>
              <div className="bg-[var(--color-background)] rounded-lg p-4 space-y-3">
                <div>
                  <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                    {t('import.fields.title')}
                  </span>
                  <p className="text-sm text-[var(--color-text)]">{parsedData.title}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                    {t('import.fields.description')}
                  </span>
                  <p className="text-sm text-[var(--color-text)] line-clamp-2">{parsedData.description}</p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                      {t('import.fields.difficulty')}
                    </span>
                    <p className="text-sm text-[var(--color-text)]">{parsedData.difficulty}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                      {t('import.fields.author')}
                    </span>
                    <p className="text-sm text-[var(--color-text)]">{parsedData.author}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                      {t('import.fields.language')}
                    </span>
                    <p className="text-sm text-[var(--color-text)]">{getLanguageDisplay(parsedData.language)} {getLanguageName(parsedData.language)}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                    {t('import.fields.tags')}
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {parsedData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-surface)] text-[var(--color-text-secondary)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {state === 'importing' && (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-sm text-[var(--color-text-secondary)]">
                {t('import.confirmImport')}...
              </p>
            </div>
          )}

          {state === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-4" />
              <p className="text-sm text-[var(--color-text)]">
                {t('import.success')}
              </p>
            </div>
          )}

          {state === 'error' && (
            <div className="text-center py-8">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
              <p className="text-sm text-[var(--color-text)] mb-4">
                {errorMessage}
              </p>
              <button
                onClick={resetState}
                className="px-4 py-2 text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-colors"
              >
                {t('import.browse')}
              </button>
            </div>
          )}
        </div>

        {(state === 'preview' || state === 'error') && (
          <div className="flex justify-end gap-3 p-4 border-t border-[var(--color-border)]">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] rounded-lg transition-colors"
            >
              {t('import.cancel')}
            </button>
            {state === 'preview' && (
              <button
                onClick={handleImport}
                className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors"
              >
                {t('import.confirmImport')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
