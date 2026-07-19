import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '../store/themeStore'

export function ThemeToggle() {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-[var(--color-background)] transition-colors"
      aria-label={t('theme.toggleLabel', { mode: theme === 'light' ? 'dark' : 'light' })}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-[var(--color-text-secondary)]" />
      ) : (
        <Sun className="w-5 h-5 text-[var(--color-text-secondary)]" />
      )}
    </button>
  )
}
