import { useState } from 'react'
import { Outlet } from 'react-router'
import { Sidebar } from './Sidebar'
import { ThemeToggle } from './ThemeToggle'
import { Menu } from 'lucide-react'

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-60">
        <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
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

        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
