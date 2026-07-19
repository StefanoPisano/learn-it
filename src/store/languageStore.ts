import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '../i18n'

export type Language = 'en' | 'it' | 'fr' | 'sv' | 'no' | 'de'

export const languageLabels: Record<Language, string> = {
  en: 'EN',
  it: 'IT',
  fr: 'FR',
  sv: 'SV',
  no: 'NO',
  de: 'DE',
}

interface LanguageState {
  language: Language
  setLanguage: (lang: Language) => void
}

function applyLanguage(lang: Language) {
  i18n.changeLanguage(lang)
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
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
