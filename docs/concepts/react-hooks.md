# 🪝 React Hooks

Key hooks used in this project.

---

## useEffect

A hook for **side effects** — operations that don't belong in the render itself.

```tsx
useEffect(() => {
  const builtins = loadBuiltinPaths()  // heavy work
  loadBuiltIn(builtins)                // store update
}, [loadBuiltIn])
```

### Why not in the component body?

The component body runs on **every render**. If you put side effects there:

```tsx
function App() {
  const builtins = loadBuiltinPaths()  // ⚠️ runs every render
  loadBuiltIn(builtins)                // ⚠️ runs every render
}
```

Every state change → re-render → re-parse markdown → re-write the store. Wasteful and potentially infinite.

### useEffect vs body vs event handler

| Approach | When it runs | Use case |
|----------|-------------|----------|
| Component body | Every render | Pure calculations for JSX |
| `useEffect` | After render (once or on dep change) | Side effects, data loading, subscriptions |
| Event handler | On user action | Click handlers, form submissions |

### Why not just an `if` in the body?

```tsx
// ❌ Wrong — infinite loop
function LearningPathView() {
  if (path && !path.followed) navigate('/paths')
}

// ✅ Correct — runs after render, only when dependencies change
useEffect(() => {
  if (path && !path.followed) navigate('/paths')
}, [path, navigate])
```

**The problem with `if` in the body:**

```
Render 1:
  → Component body runs
  → if condition is true → navigate('/paths')  ← changes URL
  → URL change = new render!

Render 2:
  → Component body runs again
  → if condition is still true → navigate('/paths')  ← changes URL again
  → URL change = another render!

Render 3: ... → infinite loop
```

**With `useEffect`:**

```
Render 1:
  → Component body runs (no navigate)
  → Render finishes
  → After render: useEffect checks dependencies
  → path changed? Yes → runs navigate
  → URL change = new render

Render 2:
  → Component body runs (no navigate)
  → Render finishes
  → After render: useEffect checks dependencies
  → path changed? No → does NOT run navigate
  → Done! No loop
```

The key difference is **when** the code runs:
- **Body** → runs **during** render → every navigate triggers another render → loop
- **`useEffect`** → runs **after** render → only when dependencies change → no loop

---

## useMemo

Memoizes a computed value. Only recalculates when dependencies change.

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

## Rules of Hooks

Hooks must follow two rules enforced by React.

### Rule 1: Only call hooks at the top level

```tsx
// ✅ Correct
function App() {
  const [x, setX] = useState(0)
  if (condition) {
    // ...
  }
}

// ❌ Wrong — hook inside condition
function App() {
  if (condition) {
    const [x, setX] = useState(0)  // React error
  }
}
```

**Why?** React tracks hooks by **call order** (position in an array). If a hook is conditionally called, the order changes between renders and React associates wrong state to wrong hooks.

### Rule 2: Only call hooks from React functions

- ✅ React components (`function App() {}`)
- ✅ Custom hooks (`function useMyHook() {}`)
- ❌ Regular functions, `useEffect` callbacks, event handlers

```tsx
// ❌ Wrong — hook inside useEffect
useEffect(() => {
  const [x, setX] = useState(0)  // React error
}, [])

// ✅ Correct — hook in component body
function App() {
  const [x, setX] = useState(0)  // OK
  useEffect(() => { /* use x here */ }, [x])
}
```

**Why?** `useEffect` runs asynchronously after render. React has already finished tracking hooks by then. A hook called inside `useEffect` would be invisible to React's tracking system.
