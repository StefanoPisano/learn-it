import { useTranslation } from 'react-i18next'
import { useLanguageStore } from '../store/languageStore'

export function LanguageToggle() {
  const { t } = useTranslation()
  const { language, toggleLanguage } = useLanguageStore()

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-lg hover:bg-[var(--color-background)] transition-colors text-sm font-medium text-[var(--color-text-secondary)]"
      aria-label={t('theme.toggleLabel', { mode: language === 'en' ? 'IT' : 'EN' })}
    >
      {language === 'en' ? 'EN' : 'IT'}
    </button>
  )
}
