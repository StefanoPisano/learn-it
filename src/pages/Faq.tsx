import { useState, type ReactNode } from 'react'
import { ChevronDown, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface FaqItemProps {
  question: string
  answer: ReactNode
}

function FaqItem({ question, answer }: FaqItemProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-colors"
      >
        <span className="font-medium text-[var(--color-text)]">{question}</span>
        <ChevronDown className={`w-5 h-5 text-[var(--color-text-secondary)] shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 py-3 text-sm text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-border)] bg-[var(--color-background)]">
          {answer}
        </div>
      )}
    </div>
  )
}

export function Faq() {
  const { t } = useTranslation()

  const faqItems: { q: string; a: ReactNode }[] = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
    { q: t('faq.q6'), a: t('faq.a6') },
    { q: t('faq.q7'), a: t('faq.a7') },
    { q: t('faq.q8'), a: t('faq.a8') },
    {
      q: t('faq.q9'),
      a: (
        <span>
          {t('faq.a9')}{' '}
          <a
            href={`${import.meta.env.BASE_URL}example-learning-path.md`}
            download
            className="inline-flex items-center gap-1 text-[var(--color-primary)] hover:underline font-medium"
          >
            <Download className="w-4 h-4" />
            example-learning-path.md
          </a>
        </span>
      ),
    },
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
        {t('faq.title')}
      </h2>
      <p className="text-[var(--color-text-secondary)] mb-6">
        {t('faq.subtitle')}
      </p>
      <div className="space-y-3">
        {faqItems.map((item, i) => (
          <FaqItem key={i} question={item.q} answer={item.a} />
        ))}
      </div>
      <p className="mt-8 text-xs text-[var(--color-text-secondary)] text-center">
        {t('faq.footer')}{' '}
        <a
          href="https://github.com/StefanoPisano/learn-it/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-primary)] hover:underline"
        >
          GitHub
        </a>
      </p>
    </div>
  )
}
