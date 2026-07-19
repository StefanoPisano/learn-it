---
title: Getting Started with React Hooks
description: A short introductory learning path to learn the basics of React Hooks.
tags:
  - react
  - hooks
  - frontend
difficulty: beginner
author: Jane Doe
language: en
date: 2026-07-19
version: 1.0.0
---

---
type: concept
---

## What are React Hooks?

Hooks are functions that let you use state and lifecycle features in functional components.

**Rules of Hooks:**
- Only call hooks at the top level
- Only call hooks from React functions

---
type: exercise
---

## Exercise: Your First useState

Create a simple counter component:

1. Import `useState` from React
2. Create a state variable `count`
3. Display the count and an increment button

```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>
}
```

---
type: quiz
variant: single
---

### Q1: Is useState synchronous?

- [ ] True
- [x] False

### Q2: Which hook is used for side effects?

- [x] useEffect
- [ ] useState
- [ ] useRef

---
type: reference
---

## References

- [React Docs - Hooks](https://react.dev/reference/react/hooks)
- [Hooks FAQ](https://react.dev/reference/react/hooks#faq)
