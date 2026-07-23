# 🗂️ Project Structure

A high-level overview of how React works and how this project is organized.

---

## Basic

React is a JavaScript library for building user interfaces. The core idea is simple:

1. **Components** — Small, reusable functions that return JSX (HTML-like syntax)
2. **Props** — Data passed into components (like function arguments)
3. **State** — Internal data that changes over time (triggers re-renders)
4. **Rendering** — When state or props change, React calls the component function again and updates the DOM

```
User clicks button
  → State changes
    → React re-renders affected components
      → DOM updates
```

### JSX

JSX looks like HTML but lives inside JavaScript. It's syntactic sugar for `React.createElement()`:

```tsx
// This JSX:
<h1>{title}</h1>

// Becomes this:
React.createElement('h1', null, title)
```

### Components

A component is just a function that returns JSX:

```tsx
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}</h1>
}
```

### Hooks

Hooks are special functions that let you "hook into" React features. They always start with `use`:

| Hook | Purpose |
|------|---------|
| `useState` | Add state to a component |
| `useEffect` | Run side effects (API calls, subscriptions, DOM manipulation) |
| `useMemo` | Memoize expensive calculations |
| `useCallback` | Memoize functions |
| `useRef` | Hold a mutable value that doesn't trigger re-renders |

### Rendering lifecycle

```
1. Component function runs
2. JSX is evaluated with current props/state
3. React updates the DOM if needed
4. useEffect callbacks run (after paint)
5. User interacts → state changes → go to step 1
```

---

## Project Structure

```
src/
├── main.tsx                 ← Entry point: mounts React to the DOM
├── App.tsx                  ← Root component: defines routes
├── index.css                ← Global CSS variables + Tailwind config
│
├── components/              ← Reusable UI pieces
├── pages/                   ← Route-level components (one per route)
├── store/                   ← Zustand state management
├── utils/                   ← Pure functions, no React dependency
├── lib/                     ← Business logic, parsing, data loading
├── i18n/                    ← Internationalization setup + translations
│   ├── index.ts
│   └── locales/             ← JSON files per language (en.json, it.json, ...)
├── assets/                  ← Static files (images, SVGs)
└── learning-paths/          ← Built-in markdown learning paths
```

---

## What Goes Where

### `components/` — Reusable UI

Pieces of interface used in multiple places. No route logic, no data fetching.

| File | What it is |
|------|-----------|
| `Layout.tsx` | App shell (sidebar + header + outlet) |
| `Sidebar.tsx` | Navigation menu |
| `LearningPathCard.tsx` | Card showing a learning path summary |
| `ImportModal.tsx` | Modal for importing markdown files |
| `SectionList.tsx` | Section navigation in the viewer |
| `SectionRenderer.tsx` | Renders a single section (concept/quiz/reference) |
| `QuizSection.tsx` | Quiz UI with answer selection |
| `EmptyState.tsx` | Placeholder when a list is empty |
| `ThemeToggle.tsx` | Light/dark mode toggle |
| `LanguageToggle.tsx` | EN/IT language toggle |

**Rule of thumb**: If it's used in 2+ places → `components/`. If it's specific to one route → `pages/`.

### `pages/` — Route components

One component per route. Can contain `components/` but not the other way around.

| File | Route | What it does |
|------|-------|-------------|
| `MyCourses.tsx` | `/` | Dashboard of followed learning paths |
| `LearningPaths.tsx` | `/paths` | Browse all available learning paths |
| `LearningPathView.tsx` | `/paths/:id` | Course viewer (sections, quizzes, progress) |
| `Faq.tsx` | `/faq` | FAQ page |

### `store/` — Global state

Zustand stores. One store per domain concern.

| File | Manages |
|------|---------|
| `learningPathStore.ts` | Learning paths, sections, progress, CRUD operations |
| `themeStore.ts` | Light/dark mode preference |
| `languageStore.ts` | Language preference |

### `utils/` — Pure functions

Utility functions with no React dependency. No hooks, no JSX, no side effects.

| File | What it does |
|------|-------------|
| `difficultyColors.ts` | Maps difficulty levels to Tailwind color classes |
| `languageFlags.ts` | Maps language codes to flag emojis and display names |
| `markdownParser.ts` | Parses markdown files into structured section data |

### `lib/` — Business logic

More complex logic that doesn't fit in `utils/` — data loading, parsing pipelines.

| File | What it does |
|------|-------------|
| `builtin-paths.ts` | Loads and parses built-in markdown learning paths |

### `i18n/` — Internationalization

| Path | What it does |
|------|-------------|
| `index.ts` | i18next setup (detector, fallback language) |
| `locales/*.json` | Translation strings per language |

### `assets/` — Static files

Images, SVGs, fonts. Referenced via import or absolute URL.

### `learning-paths/` — Built-in content

Markdown files that ship with the app. Organized by category (e.g., `languages/norwegian/`).

---

## Data Flow

```
learning-paths/*.md
       ↓  lib/builtin-paths.ts (parsing)
   Store (Zustand)
       ↓  selectors (useLearningPathStore)
   Pages
       ↓  props
   Components
```

1. Markdown files are parsed at startup by `lib/builtin-paths.ts`
2. Parsed data is loaded into the Zustand store via `loadBuiltIn()`
3. Pages read from the store with selectors
4. Pages pass data down to components via props
5. User actions (click, toggle) call store functions → state updates → re-render

---

## Adding New Code

### New component

```
src/components/NewComponent.tsx
```

- Functional component with explicit return type
- Props interface in the same file or in `types/`
- Use named export

### New page

```
src/pages/NewPage.tsx
```

- Add route in `App.tsx`
- Add nav item in `Sidebar.tsx`
- Add i18n keys for the nav label

### New store

```
src/store/newStore.ts
```

- One concern per store
- Use `persist` middleware for data that should survive page reload
- Export the hook: `export const useNewStore = create<NewState>()(...)`

### New utility

```
src/utils/newUtil.ts
```

- Pure function, no React imports
- Export individual functions, not objects
