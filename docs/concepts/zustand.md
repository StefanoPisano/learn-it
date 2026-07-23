# 🐻 Zustand

Zustand is a lightweight state management library for React. It creates stores outside of the component tree.

---

## How `create()` works

```tsx
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,                          // Data → becomes state
  increment: () => set((s) => ({ count: s.count + 1 })),  // Function → ALSO state
}))
```

`create()` calls your function **once** at startup. Everything you return becomes the store's state — data and functions alike. Functions are saved but **not called** until a component invokes them.

---

## How `set()` works

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

---

## Persist middleware

```tsx
persist(
  (set) => ({ ... }),
  { name: 'learn-it-paths' }  // ← localStorage key
)
```

- `name` is the key used in `localStorage.setItem(name, ...)`
- On startup, Zustand reads from localStorage and **overrides** the initial state
- On every state change, Zustand saves to localStorage automatically

---

## Selectors in components

```tsx
// Read data
const paths = useLearningPathStore((state) => state.paths)

// Read a function
const addPath = useLearningPathStore((state) => state.addPath)

// Call the function
addPath({ title: 'New', description: '...', ... })
```

The selector `(state) => state.paths` tells Zustand which part of the state this component needs. The component only re-renders when that specific value changes.

### Extracting vs Calling

```tsx
// Step 1: Extract the function (runs during render)
const loadBuiltIn = useLearningPathStore((state) => state.loadBuiltIn)

// Step 2: Call it (in useEffect, event handler, etc.)
useEffect(() => {
  loadBuiltIn(builtins)  // ← calling the extracted function
}, [loadBuiltIn])
```

These are the **same function** — you're just separating extraction from invocation. This is required because:

1. **Rules of hooks**: `useLearningPathStore(...)` is a hook → must be called at top level
2. **Reactivity**: Using the hook ensures the component re-renders when the store changes
3. **Cleaner code**: Separating concerns (what to use vs when to use it)

### Alternative: `getState()` (not recommended for components)

```tsx
useEffect(() => {
  useLearningPathStore.getState().loadBuiltIn(builtins)
}, [])
```

This works but loses reactivity — the component won't re-render when the store changes. Use selectors instead.

---

## Why Zustand over Context?

| Feature | Zustand | Context |
|---------|---------|---------|
| Boilerplate | Minimal | Provider + context |
| Re-renders | Only subscribers | All consumers |
| Persistence | Built-in middleware | Manual |
| Outside React | ✅ Yes | ❌ No |
