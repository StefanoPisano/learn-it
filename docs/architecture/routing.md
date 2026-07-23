# 🧭 Routing

React Router setup and navigation patterns used in this project.

---

## BrowserRouter

`BrowserRouter` enables client-side routing using the browser's History API. No full page reloads.

```tsx
// App.tsx
<BrowserRouter basename="/learn-it">
  <Routes>
    <Route path="/" element={<MyCourses />} />
    <Route path="/paths" element={<LearningPaths />} />
    <Route path="/paths/:id" element={<LearningPathView />} />
    <Route path="/faq" element={<Faq />} />
  </Routes>
</BrowserRouter>
```

### basename

The `basename` prop tells the router the app is served under a sub-path (GitHub Pages at `/learn-it/`).

| URL in browser | basename | Route path | Match? |
|----------------|----------|------------|--------|
| `/learn-it/` | `/learn-it` | `/` | ✅ |
| `/learn-it/paths` | `/learn-it` | `/paths` | ✅ |
| `/other/` | `/learn-it` | `/` | ❌ |

---

## Nested Routes (Layout Routes)

A parent route **without a `path`** acts as a layout wrapper for all its children.

```tsx
<Route element={<Layout />}>          {/* Parent: no path → matches all */}
  <Route path="/" element={<MyCourses />} />     {/* Child */}
  <Route path="/paths" element={<LearningPaths />} />    {/* Child */}
</Route>
```

### How it works

1. The parent route (`<Layout />`) renders for **every** URL
2. It contains an `<Outlet />` placeholder
3. The matching child route renders **inside** that Outlet

```
URL: /learn-it/paths

<Route element={<Layout />}>     → match ✅
  │
  ├── Sidebar
  ├── Header
  └── <Outlet />
        │
        └── <LearningPaths />    → match ✅ (rendered here)
```

---

## Outlet

Placeholder inside a layout component. Renders the child route that matches the current URL.

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

Without `Outlet`, child routes have nowhere to render.

---

## Link

Client-side navigation without page reloads.

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

Returns the current URL location object.

```tsx
import { useLocation } from 'react-router'

function Sidebar() {
  const location = useLocation()
  // location.pathname → "/learn-it/paths"
}
```

Used to highlight the active navigation link.

---

## useParams

Extracts dynamic parameters from the URL.

```tsx
import { useParams } from 'react-router'

// Route: <Route path="/paths/:id" element={<LearningPathView />} />
// URL:   /learn-it/paths/42

function LearningPathView() {
  const { id } = useParams<{ id: string }>()
  // id → "42"
}
```

### How it works

The `:id` in the route definition is a **dynamic segment**. Whatever value appears in the URL becomes a parameter.

| URL | Route | Params |
|-----|-------|--------|
| `/paths/42` | `/paths/:id` | `{ id: "42" }` |
| `/paths/react-hooks` | `/paths/:id` | `{ id: "react-hooks" }` |
| `/paths/` | `/paths/:id` | No match |

### Generic type

```tsx
const { id } = useParams<{ id: string }>()
```

The `<{ id: string }>` is a TypeScript generic — it tells TypeScript the parameter name and type. Without it, `id` would be `string | undefined`.

---

## useNavigate

Programmatic navigation — changing the URL without a `<Link>`.

```tsx
import { useNavigate } from 'react-router'

function MyComponent() {
  const navigate = useNavigate()

  navigate('/paths')           // go to a route
  navigate(-1)                 // go back
  navigate(1)                  // go forward
  navigate('/paths', { replace: true })  // replace history (no back)
}
```

### When to use it

- **After an action** — after deleting a path, navigate to the list
- **Conditional redirect** — if user doesn't follow the path, redirect
- **Back button** — `navigate(-1)` is equivalent to browser back

### Example in this project

In `LearningPathView.tsx`:

```tsx
useEffect(() => {
  if (path && !path.followed) navigate('/paths', { replace: true })
}, [path, navigate])
```

---

## React Context (Provider / Consumer)

React Context lets components access data from ancestor components without passing props through every level.

### Provider and Consumer

| Role | Component | What it does |
|------|-----------|-------------|
| **Provider** | `BrowserRouter` | Creates and provides the routing context |
| **Consumer** | `Link`, `Outlet`, `useLocation` | Reads from the routing context |

### Tree-based, not file-based

Context works based on the **component tree at runtime**, not the file system:

```tsx
// App.tsx
<BrowserRouter>                          {/* Provider */}
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<MyCourses />} />
    </Route>
  </Routes>
</BrowserRouter>
```

```tsx
// MyCourses.tsx (different file)
function MyCourses() {
  return <Link to="/paths">Browse</Link>  {/* Consumer — works ✅ */}
}
```

At runtime, `MyCourses` is rendered **inside** `BrowserRouter`:

```
BrowserRouter (context provider)
  └── Routes
        └── Layout
              └── <Outlet />
                    └── MyCourses (different file, but descendant in tree)
                          └── <Link> ← finds the context ✅
```

### Rule of thumb

All React Router components (`Link`, `Outlet`, `useLocation`, `useNavigate`, etc.) must be descendants of `BrowserRouter` in the component tree. The file they're defined in doesn't matter — only their position at runtime.
