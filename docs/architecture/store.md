# 🗄️ Store

Zustand stores, data models, dark mode, and internationalization.

---

## Learning Path Store

**File**: `src/store/learningPathStore.ts`

The main store. Manages all learning paths with CRUD operations and section completion tracking.

### Data Model

```tsx
export interface Section {
  type: 'concept' | 'exercise' | 'quiz' | 'reference'
  variant?: 'single' | 'multiple'
  content: string
  completed: boolean
  questions?: QuizQuestion[]
  links?: ReferenceLink[]
}

export interface LearningPath {
  id: number
  slug: string
  source: 'builtin' | 'imported'
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  followed: boolean
  author: string
  language: string
  link?: string
  date?: string
  version?: string
  sections?: Section[]
}
```

### Progress calculation

Progress is not stored — it's calculated on the fly:

```tsx
export function calcProgress(sections: Section[] | undefined): number {
  if (!sections || sections.length === 0) return 0
  return Math.round((sections.filter((s) => s.completed).length / sections.length) * 100)
}
```

`completed` lives on each `Section`, not on `LearningPath`.

### Actions

| Action | What `set()` returns | Effect |
|--------|---------------------|--------|
| `addPath(path)` | `{ paths: [...state.paths, newPath] }` | Appends to array |
| `removePath(id)` | `{ paths: state.paths.filter(...) }` | Removes from array |
| `updatePath(id, updates)` | `{ paths: state.paths.map(...) }` | Updates one item |
| `followPath(id)` | `{ paths: state.paths.map(...) }` | Sets `followed: true` |
| `unfollowPath(id)` | `{ paths: state.paths.map(...) }` | Sets `followed: false`, resets all sections |
| `toggleSection(pathId, idx)` | `{ paths: state.paths.map(...) }` | Flips `section.completed` |
| `loadBuiltIn(builtinPaths)` | `{ paths: [...newPaths, ...importedPaths] }` | Loads/preserves built-in paths |

### Persistence

```tsx
persist(
  (set) => ({ ... }),
  {
    name: 'learn-it-paths',
    storage: createJSONStorage(() => localStorage),
  },
)
```

- On startup: Zustand reads from localStorage and overrides initial state
- On every state change: Zustand saves to localStorage automatically

---

## Theme Store

**File**: `src/store/themeStore.ts`

```tsx
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
    }),
    { name: 'learn-it-theme' },
  ),
)
```

How it works:
1. `toggleTheme` returns `{ theme: 'dark' }` → Zustand overwrites `theme`
2. `persist` saves to localStorage under `'learn-it-theme'`
3. On next page load, Zustand reads localStorage → theme is restored
4. `onRehydrateStorage` applies the CSS class `dark` to `<html>` before React mounts

---

## Dark Mode

The dark mode system has three layers:

### 1. CSS Variables (`index.css`)

```css
:root { --color-background: #F8FAFC; }     /* Light */
.dark { --color-background: #0F172A; }     /* Dark */
```

### 2. Tailwind `dark:` prefix

Used for component-specific overrides:

```html
<span class="bg-green-100 dark:bg-green-900/30">...</span>
```

In Tailwind CSS v4, dark mode uses `prefers-color-scheme` by default. Since this app uses a `.dark` class on `<html>`, we configure class-based dark mode in `index.css`:

```css
@custom-variant dark (&:is(.dark *));
```

### 3. Theme Toggle + localStorage

```
User clicks toggle
  → useThemeStore.toggleTheme()
    → adds/removes "dark" class on <html>
      → CSS variables switch
        → all components update automatically

On page load:
  → index.html script reads localStorage
    → applies "dark" class before React loads
      → no flash of wrong theme (FOUC)
```

---

## Language Store

**File**: `src/store/languageStore.ts`

```tsx
export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => {
        set({ language })
        i18n.changeLanguage(language)
      },
    }),
    { name: 'learn-it-language' },
  ),
)
```

Language preference is saved to localStorage and restored on page load.

---

## Internationalization (i18n)

The app uses `react-i18next` for multi-language support.

### Setup

**File**: `src/i18n/index.ts`

```tsx
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import it from './locales/it.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, it: { translation: it } },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })
```

### How it works

1. `LanguageDetector` reads the user's preferred language from localStorage
2. `initReactI18next` connects i18n to React components
3. `useTranslation()` hook provides the `t()` function for translations

### Using translations in components

```tsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()
  return <h1>{t('myCourses.title')}</h1>
}
```

### Translation files

- `src/i18n/locales/en.json` — English translations
- `src/i18n/locales/it.json` — Italian translations
- `src/i18n/locales/de.json` — German
- `src/i18n/locales/fr.json` — French
- `src/i18n/locales/no.json` — Norwegian
- `src/i18n/locales/sv.json` — Swedish

Keys are organized by feature: `myCourses.*`, `import.*`, `parser.*`, etc.
