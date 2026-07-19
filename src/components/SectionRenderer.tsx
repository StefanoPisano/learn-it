import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Section } from '../store/learningPathStore'
import { QuizSection } from './QuizSection'

interface SectionRendererProps {
  section: Section
  onQuizPass?: () => void
}

export function SectionRenderer({ section, onQuizPass }: SectionRendererProps) {
  if (section.type === 'quiz') {
    return <QuizSection section={section} onPass={onQuizPass} />
  }

  if (section.type === 'reference' && section.links) {
    return (
      <div className="prose prose-[var(--color-text)] dark:prose-invert max-w-none overflow-x-auto">
        <Markdown remarkPlugins={[remarkGfm]}>{section.content}</Markdown>
        <ul className="mt-4 space-y-2">
          {section.links.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-primary)] hover:underline"
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="prose prose-[var(--color-text)] dark:prose-invert max-w-none overflow-x-auto">
      <Markdown remarkPlugins={[remarkGfm]}>{section.content}</Markdown>
    </div>
  )
}
