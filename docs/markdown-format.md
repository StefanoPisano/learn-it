# Markdown Format Specification

This document describes the markdown format for Learning Paths in the Learn Me application.

---

## Overview

A Learning Path is a markdown file with:
1. **Global metadata** - Information about the learning path (title, tags, difficulty, etc.)
2. **Sections** - Individual learning units with their own metadata

---

## Global Metadata

The first `---` block contains global metadata:

```yaml
---
title: React Hooks
tags:
  - frontend
  - react
  - hooks
difficulty: intermediate
author: John Doe
link: https://github.com/johndoe
date: 2026-07-14
version: 1.0.0
---
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes      | Name of the learning path |
| `tags` | Yes      | List of hashtags (e.g., frontend, react, hooks) |
| `difficulty` | Yes      | `beginner`, `intermediate`, or `advanced` |
| `author` | Yes      | Author's name |
| `link` | No       | URL to author's profile (GitHub, portfolio, etc.) |
| `date` | No       | Creation or publication date (YYYY-MM-DD) |
| `version` | No       | Semantic version (e.g., 1.0.0) |

---

## Section Metadata

Each section starts with a metadata block:

```yaml
---
type: concept
variant: single  # only for quizzes
---
```

| Field | Required | Description |
|-------|----------|-------------|
| `type` | Yes | `concept`, `exercise`, `quiz`, or `reference` |
| `variant` | Only for quizzes | `single` (one correct answer) or `multiple` |

---

## Section Types

### Concept
Content to read and learn.

```markdown
---
type: concept
---

## What are Hooks

Hooks are functions that let you use state and lifecycle features.
```

### Exercise
Practical activities to complete.

```markdown
---
type: exercise
---

## Exercise 1: Counter

Create a counter component using useState.
```

### Quiz
Knowledge check questions.

**Single choice (one correct answer):**
```markdown
---
type: quiz
variant: single
---

### Q1: Is useState synchronous?
- [ ] True
- [x] False
```

**Multiple choice (one correct answer):**
```markdown
---
type: quiz
variant: multiple
---

### Q2: Which hook is used for side effects?
- [x] useEffect
- [ ] useState
- [ ] useRef
```

### Reference
Links and resources.

```markdown
---
type: reference
---

## References

- [React Docs](https://react.dev)
```

---

## Parsing Rules

1. **Section boundaries** - A section ends where the next section's metadata begins
2. **Title** - Derived from the heading (`##` or `###`) after the metadata block
3. **Content** - Everything between metadata blocks belongs to that section
4. **Quiz answers** - Marked with `[x]` for correct, `[ ]` for incorrect

---

## Complete Example

````markdown
---
title: React Hooks
tags:
  - frontend
  - react
  - hooks
difficulty: intermediate
author: John Doe
link: https://github.com/johndoe
date: 2026-07-14
version: 1.0.0
---

---
type: concept
---

## What are Hooks

Hooks are functions that let you use state and lifecycle features in functional components.

**Key points:**
- Only call hooks at the top level
- Only call hooks from React functions

---
type: exercise
---

## Exercise 1: Counter

Create a counter component using useState.

**Steps:**
1. Import useState from React
2. Create a state variable `count`
3. Display count and increment button

---
type: quiz
variant: single
---

### Q1: Is useState synchronous?
- [ ] True
- [x] False

---
type: quiz
variant: multiple
---

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
````

---

## Validation Rules

- `title` and `tags` are required in global metadata
- `tags` must be a list (at least one tag)
- `type` is required in section metadata
- Quiz sections must have at least one question
- Quiz questions must have exactly one correct answer (`[x]`)
- `variant` is required for quiz sections
