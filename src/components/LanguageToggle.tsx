import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguageStore, languageLabels, type Language } from '../store/languageStore'

const languageFlags: Record<Language, string> = {
  en: '🇬🇧',
  it: '🇮🇹',
  fr: '🇫🇷',
  sv: '🇸🇪',
  no: '🇳🇴',
  de: '🇩🇪',
}

const languages: Language[] = ['en', 'it', 'fr', 'sv', 'no', 'de']

export function LanguageToggle() {
  const { t } = useTranslation()
  const { language, setLanguage } = useLanguageStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-[var(--color-background)] transition-colors text-sm font-medium text-[var(--color-text-secondary)]"
        aria-label={t('theme.toggleLabel', { mode: languageLabels[language] })}
      >
        <span className="text-base leading-none">{languageFlags[language]}</span>
      </button>
      {open && (
        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 w-36 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 py-1">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => { setLanguage(lang); setOpen(false) }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                lang === language
                  ? 'bg-[var(--color-primary)] text-white font-medium'
                  : 'text-[var(--color-text)] hover:bg-[var(--color-background)]'
              }`}
            >
              <span className="text-base leading-none">{languageFlags[lang]}</span>
              <span>{languageLabels[lang]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
