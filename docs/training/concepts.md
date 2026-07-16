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
