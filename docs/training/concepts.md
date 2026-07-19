# 🧠 Concepts

Key React and React Router concepts used in this project.

---

## BrowserRouter

`BrowserRouter` is a React Router component that enables client-side routing. It uses the browser's History API to manage URLs without full page reloads.

```tsx
<BrowserRouter basename="/learn-it">
  <Routes>
    <Route path="/" element={<Dashboard />} />
  </Routes>
</BrowserRouter>
```

### basename

The `basename` prop tells the router that the app is served under a sub-path (e.g., GitHub Pages at `/learn-it/`). All route paths are relative to this basename.

| URL in browser | basename | Route path | Match? |
|----------------|----------|------------|--------|
| `/learn-it/` | `/learn-it` | `/` | ✅ |
| `/learn-it/paths` | `/learn-it` | `/paths` | ✅ |
| `/learn-it/settings` | `/learn-it` | `/settings` | ✅ |
| `/other/` | `/learn-it` | `/` | ❌ |

Without `basename`, the router would try to match the full URL (`/learn-it/paths`) against route paths (`/paths`), which would never match.

---

## Nested Routes (Layout Routes)

React Router supports nesting routes inside other routes. A **parent route without a `path`** acts as a layout wrapper.

```tsx
<Route element={<Layout />}>          {/* Parent: no path → matches all */}
  <Route path="/" element={<Dashboard />} />     {/* Child */}
  <Route path="/paths" element={<Paths />} />    {/* Child */}
</Route>
```

### How it works

1. The parent route (`<Layout />`) renders for **every** URL
2. It contains an `<Outlet />` placeholder
3. The matching child route renders **inside** that Outlet

### Visual

```
URL: /learn-it/paths

<Route element={<Layout />}>     → match ✅
  │
  ├── Sidebar
  ├── Header
  └── <Outlet />
        │
        └── <Paths />            → match ✅ (rendered here)
```

---

## Outlet

`Outlet` is a React Router component that acts as a placeholder inside a layout component. It renders the child route that matches the current URL.

```tsx
// Layout.tsx
function Layout() {
  return (
    <div>
      <Sidebar />
      <main>
        <Outlet />  {/* ← Child route renders here */}
      </main>
    </div>
  )
}
```

Without `Outlet`, the child routes would have nowhere to render.

---

## Link

`Link` is React Router's component for client-side navigation. It prevents full page reloads and updates the URL via the History API.

```tsx
import { Link } from 'react-router'

<Link to="/paths">Learning Paths</Link>
```

### Link vs `<a>`

| Feature | `<Link>` | `<a>` |
|---------|----------|-------|
| Page reload | ❌ No | ✅ Yes |
| Client-side routing | ✅ Yes | ❌ No |
| Works without JS | ❌ No | ✅ Yes |
| Use for | Internal navigation | External links |

---

## useLocation

A React Router hook that returns the current URL location object.

```tsx
import { useLocation } from 'react-router'

function Sidebar() {
  const location = useLocation()
  // location.pathname → "/learn-it/paths"
}
```

Commonly used to highlight the active navigation link by comparing `location.pathname` with each link's `path`.

---

## Zustand

Zustand is a lightweight state management library for React. It creates stores outside of the component tree.

### How `create()` works

```tsx
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,                          // Data → becomes state
  increment: () => set((s) => ({ count: s.count + 1 })),  // Function → ALSO state
}))
```

`create()` calls your function **once** at startup. Everything you return becomes the store's state — data and functions alike. Functions are saved but **not called** until a component invokes them.

### How `set()` works

`set()` is the only way to update the state. What you return from `set()` **is** the new state (merged with the previous one).

```tsx
// ✅ Correct: return the new state
set((state) => ({ paths: [...state.paths, newPath] }))

// ❌ Wrong: returning nothing → state unchanged
set(() => { console.log('hello') })

// ❌ Wrong: returning wrong type → state becomes that type
set(() => ({ paths: "hello" }))  // paths is now a string
```

Key rules:
- `set()` **overwrites** — it does not concatenate or merge arrays automatically
- You must spread existing state if you want to keep it: `[...state.paths, newItem]`
- If you don't call `set()`, the state doesn't change and components don't re-render

### Persist middleware

```tsx
persist(
  (set) => ({ ... }),
  { name: 'learn-it-paths' }  // ← localStorage key
)
```

- `name` is the key used in `localStorage.setItem(name, ...)`
- On startup, Zustand reads from localStorage and **overrides** the initial state
- On every state change, Zustand saves to localStorage automatically

### Selectors in components

```tsx
// Read data
const paths = useLearningPathStore((state) => state.paths)

// Read a function
const addPath = useLearningPathStore((state) => state.addPath)

// Call the function
addPath({ title: 'New', description: '...', ... })
```

The selector `(state) => state.paths` tells Zustand which part of the state this component needs. The component only re-renders when that specific value changes.

### Why Zustand over Context?

| Feature | Zustand | Context |
|---------|---------|---------|
| Boilerplate | Minimal | Provider + context |
| Re-renders | Only subscribers | All consumers |
| Persistence | Built-in middleware | Manual |
| outside React | ✅ Yes | ❌ No |

---

### Theme Store

**File**: `src/store/themeStore.ts`

```tsx
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
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

### Learning Path Store

**File**: `src/store/learningPathStore.ts`

Stores all learning paths with CRUD operations. Used by both Dashboard and LearningPaths pages.

```tsx
export interface LearningPath {
  id: number
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  progress: number
  author: string
  language: string
  link?: string
  date?: string
  version?: string
  sections?: Section[]
}

export const useLearningPathStore = create<LearningPathState>()(
  persist(
    (set) => ({
      paths: [],

      addPath: (path) => set((state) => ({
        paths: [...state.paths, { ...path, id: nextId }],
      })),

      removePath: (id) => set((state) => ({
        paths: state.paths.filter((p) => p.id !== id),
      })),

      updatePath: (id, updates) => set((state) => ({
        paths: state.paths.map((p) => p.id === id ? { ...p, ...updates } : p),
      })),
    }),
    {
      name: 'learn-it-paths',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
```

How each action works:

| Action | What `set()` returns | Effect |
|--------|---------------------|--------|
| `addPath(path)` | `{ paths: [...state.paths, newPath] }` | Appends to array |
| `removePath(id)` | `{ paths: state.paths.filter(...) }` | Removes from array |
| `updatePath(id, updates)` | `{ paths: state.paths.map(...) }` | Updates one item |

---

## Dark Mode

The dark mode system has three layers:

### 1. CSS Variables (`index.css`)

```css
:root { --color-background: #F8FAFC; }     /* Light */
.dark { --color-background: #0F172A; }     /* Dark */
```

### 2. Tailwind `dark:` prefix

Used for component-specific overrides (e.g., difficulty badges):

```html
<span class="bg-green-100 dark:bg-green-900/30">...</span>
```

In Tailwind CSS v4, dark mode uses `prefers-color-scheme` by default. Since this app uses a `.dark` class on `<html>`, we configure class-based dark mode in `index.css`:

```css
@custom-variant dark (&:is(.dark *));
```

This makes `dark:` utilities activate when an element is inside a `.dark` ancestor.

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

## useMemo

A React hook that memoizes a computed value. It only recalculates when its dependencies change.

```tsx
const filteredPaths = useMemo(() => {
  if (!search.trim()) return paths

  const query = search.toLowerCase()
  return paths.filter(
    (path) =>
      path.title.toLowerCase().includes(query) ||
      path.description.toLowerCase().includes(query) ||
      path.tags.some((tag) => tag.toLowerCase().includes(query)),
  )
}, [search, paths])  // ← Only recalculates when search or paths change
```

### When to use it

- **Expensive calculations** — filtering, sorting, aggregating large lists
- **Avoiding unnecessary re-renders** — passing stable references to child components

### When NOT to use it

- Simple derivations (e.g., `const double = count * 2`)
- Values that change every render anyway
- Premature optimization — React is already fast for most cases

---

## Internationalization (i18n)

The app uses `react-i18next` for multi-language support (English and Italian).

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
  return <h1>{t('dashboard.title')}</h1>
}
```

### Translation files

- `src/i18n/locales/en.json` — English translations
- `src/i18n/locales/it.json` — Italian translations

Keys are organized by feature: `dashboard.*`, `import.*`, `parser.*`, etc.

### Language persistence

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

The language preference is saved to localStorage and restored on page load.
