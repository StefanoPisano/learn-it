import { useState } from 'react'
import { Outlet } from 'react-router'
import { Sidebar } from './Sidebar'
import { ThemeToggle } from './ThemeToggle'
import { Menu } from 'lucide-react'

export function Layout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex">
      <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

      <main className="flex-1 lg:ml-60 overflow-x-hidden flex flex-col min-h-screen">
        <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-background)] transition-colors"
            >
              <Menu className="w-6 h-6 text-[var(--color-text)]" />
            </button>
            <h1 className="ml-4 text-xl font-semibold text-[var(--color-text)]">
              Learn It
            </h1>
          </div>
          <ThemeToggle />
        </header>

        <div className="p-4 lg:p-6 flex-1">
          <Outlet />
        </div>

        <footer className="py-6 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-text-secondary)]">
          <p>
            Developed by{' '}
            <a
              href="https://stefanopisano.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-primary)] hover:underline"
            >
              Stefano Pisano
            </a>
          </p>
          <p className="mt-1">
            Source code is under{' '}
            <a
              href={`${import.meta.env.BASE_URL}LICENSE`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-primary)] hover:underline"
            >
              GNU General Public License v3.0
            </a>
          </p>
          <p className="mt-1">&copy; {new Date().getFullYear()}</p>
        </footer>
      </main>
    </div>
  )
}
