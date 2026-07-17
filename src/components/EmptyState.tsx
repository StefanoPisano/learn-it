import { SearchX } from 'lucide-react'

interface EmptyStateProps {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <SearchX className="w-12 h-12 text-[var(--color-text-secondary)] mb-4" />
      <p className="text-[var(--color-text-secondary)]">{message}</p>
    </div>
  )
}
