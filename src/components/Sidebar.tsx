import { Home, BookOpen, HelpCircle, X } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { LanguageToggle } from './LanguageToggle'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const { t } = useTranslation()

  const navItems = [
    { icon: Home, label: t('nav.dashboard'), path: '/' },
    { icon: BookOpen, label: t('nav.learningPaths'), path: '/paths' },
    { icon: HelpCircle, label: t('nav.faq'), path: '/faq' }
  ]

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-60 bg-[var(--color-surface)] border-r border-[var(--color-border)] z-50
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--color-border)]">
          <span className="text-lg font-bold text-[var(--color-primary)]">
            Learn It
          </span>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-background)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                  ${isActive
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] hover:text-[var(--color-text)]'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--color-border)] flex justify-center">
          <LanguageToggle />
        </div>
      </aside>
    </>
  )
}
