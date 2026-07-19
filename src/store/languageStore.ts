import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '../i18n'

type Language = 'en' | 'it'

interface LanguageState {
  language: Language
  toggleLanguage: () => void
  setLanguage: (lang: Language) => void
}

function applyLanguage(lang: Language) {
  i18n.changeLanguage(lang)
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      toggleLanguage: () =>
        set((state) => {
          const next = state.language === 'en' ? 'it' : 'en'
          applyLanguage(next)
          return { language: next }
        }),
      setLanguage: (lang) => {
        applyLanguage(lang)
        set({ language: lang })
      },
    }),
    {
      name: 'learn-it-language',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyLanguage(state.language)
        }
      },
    },
  ),
)
