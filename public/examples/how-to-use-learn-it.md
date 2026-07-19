---
title: How to Use Learn It
description: A comprehensive guide to get started with Learn It, covering how to import and create learning paths.
tags:
  - learn-it
  - tutorial
  - guide
difficulty: beginner
author: Learn It Team
language: en
link: https://github.com/anomalyco/learn-it
date: 2026-07-19
version: 1.0.0
---

---
type: concept
---

## What is Learn It

Learn It is an application for creating and following personalized **Learning Paths**. A Learning Path is a set of educational sections that guide you through a topic.

You can *import* Markdown files with a specific format and the app will transform them into interactive paths with:
- **Concepts** to read
- **Quizzes** to test understanding
- **References** to external resources

---
type: concept
---

## How to import a Learning Path

To import a Learning Path:

1. Click the **Import Learning Path** button on the Dashboard or paths page
2. Select a `.md` file from your computer
3. If the file is *valid*, the path will be added to your library
4. If the file is not valid, you will see an *error* message explaining what is missing

> **Note:** The file must follow the format described in this guide.

---
type: concept
---

## Markdown file structure

A Learning Path file has this structure:

```
---                    ← Global metadata (YAML)
title: ...
tags: [...]
difficulty: ...
author: ...
---

---                    ← Section metadata (YAML)
type: concept
---

## Section Title        ← Markdown content

Section text...

---                    ← Next section metadata
type: quiz
variant: single
---

### Q1: Question?         ← Quiz content
- [ ] Wrong answer
- [x] Correct answer
```

The file is divided into **blocks separated by `---`**. The first block contains global metadata, subsequent blocks are sections.

---
type: quiz
variant: single
---

### Q1: What format is used for metadata in a Learning Path file?

- [ ] JSON
- [x] YAML
- [ ] TOML
- [ ] XML

### Q2: In which block are title, tags, and difficulty defined?

- [ ] In each section
- [ ] In every block
- [x] In the first global metadata block
- [ ] At the end of the file

### Q3: How many section types are there?

- [ ] 2
- [ ] 3
- [x] 4
- [ ] 5

---
type: quiz
variant: multiple
---

### Q4: Which of these are valid section types?

- [x] concept
- [x] quiz
- [ ] video
- [x] reference

### Q5: Which fields are required in global metadata?

- [x] title
- [x] description
- [x] tags
- [ ] link
- [x] difficulty
- [x] author
- [x] language
- [ ] date

---
type: concept
---

## Global metadata

The first YAML block in the file defines the main information of the Learning Path:

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Path title |
| `description` | Yes | Brief description of the learning path |
| `tags` | Yes | List of tags (e.g., `react`, `frontend`) |
| `difficulty` | Yes | `beginner`, `intermediate`, or `advanced` |
| `author` | Yes | Author name |
| `language` | Yes | Language code (e.g., `en`, `it`, `fr`) |
| `link` | No | Author profile URL |
| `date` | No | Creation date (YYYY-MM-DD) |
| `version` | No | Semantic version (e.g., `1.0.0`) |

Tags are written as a YAML list with hyphens:

```yaml
tags:
  - react
  - hooks
  - frontend
```

---
type: concept
---

## Section types

Each section starts with a `---` block containing its metadata. The `type` field is required and can be:

### **concept**
Text content to read. Supports Markdown syntax: **bold**, *italic*, `code`, lists, quotes, and links.

### **exercise**
Practical exercises to complete. Content is in Markdown, same as concepts.

### **quiz**
Single-answer (`variant: single`) or multiple-answer (`variant: multiple`) questions. Questions should be written as `###` headings and answers as lists with `[x]` for correct and `[ ]` for wrong.

### **reference**
External resources and links, written as Markdown lists: `[Text](url)`.

---
type: reference
---

## Useful references

- [Learn It on GitHub](https://github.com/anomalyco/learn-it)
- [Markdown Guide](https://www.markdownguide.org)
- [React Documentation](https://react.dev)
- [YAML Syntax](https://yaml.org)

---
type: quiz
variant: single
---

### Q6: What does `variant: single` indicate in a quiz section?

- [ ] That there is only one question
- [x] That each question has only one correct answer
- [ ] That the quiz is single, without options
- [ ] That you can only answer once

### Q7: How is the correct answer indicated in a quiz?

- [ ] With an asterisk: `- *Answer*`
- [ ] With `[c]`: `- [c] Answer`
- [x] With `[x]`: `- [x] Answer`
- [ ] With `[v]`: `- [v] Answer`

---
type: quiz
variant: multiple
---

### Q8: Which of these are valid metadata for a section?

- [x] type
- [ ] tags
- [x] variant
- [ ] difficulty

### Q9: Which fields are optional in global metadata?

- [x] link
- [ ] title
- [ ] description
- [x] date
- [ ] author
- [x] version
- [ ] tags
- [ ] language

---
type: concept
---

## Tips for creating a good Learning Path

Here are some *suggestions* for creating effective Learning Paths:

1. **Start with an introductory concept** explaining what you will learn
2. **Alternate theory and practice**: alternate concept sections with quizzes/exercises
3. **Use single-answer quizzes** to test precise knowledge
4. **Use multiple-answer quizzes** for more complex concepts
5. **End with references** to resources for further learning

**Happy learning!** 🚀
