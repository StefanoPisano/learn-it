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

Zustand is a lightweight state management library for React. It provides a simple way to create stores outside of the component tree.

### Theme Store

**File**: `src/store/themeStore.ts`

```tsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    { name: 'learn-it-theme' },  // localStorage key
  ),
)
```

### How it works

1. **Store creation** — `create()` defines state and actions
2. **Persist middleware** — automatically saves to localStorage
3. **`onRehydrateStorage`** — runs after localStorage is read, applies the theme to `<html>`
4. **Component usage** — `useThemeStore()` returns the current state and actions

### Why Zustand over Context?

| Feature | Zustand | Context |
|---------|---------|---------|
| Boilerplate | Minimal | Provider + context |
| Re-renders | Only subscribers | All consumers |
| Persistence | Built-in middleware | Manual |
| outside React | ✅ Yes | ❌ No |

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
  if (!search.trim()) return mockLearningPaths

  const query = search.toLowerCase()
  return mockLearningPaths.filter(
    (path) =>
      path.title.toLowerCase().includes(query) ||
      path.description.toLowerCase().includes(query) ||
      path.tags.some((tag) => tag.toLowerCase().includes(query)),
  )
}, [search])  // ← Only recalculates when search changes
```

### When to use it

- **Expensive calculations** — filtering, sorting, aggregating large lists
- **Avoiding unnecessary re-renders** — passing stable references to child components

### When NOT to use it

- Simple derivations (e.g., `const double = count * 2`)
- Values that change every render anyway
- Premature optimization — React is already fast for most cases
