# AGENTS.md - Learn It Project Rules

## Project Overview
A personal skill-learning tracker built with React + TypeScript + Vite.
Hosted on GitHub Pages. No backend.

---

## AI Assistant Rules

### Responsibilities
- Write code, components, and tests as requested
- Suggest improvements and refactoring
- Explain design decisions when asked

### Restrictions
- NEVER commit, push, or make git changes
- NEVER merge PRs or modify git history
- Wait for human review before proceeding to next task
- Ask for clarification when requirements are ambiguous

### Workflow
1. Understand the task before writing code
2. Write clean, typed, documented code
3. Run lint/typecheck before presenting changes
4. Explain what was done and why

---

## Frontend Rules

### Code Style
- Use functional components with hooks (no class components)
- Prefer named exports over default exports
- Use TypeScript strict mode
- No `any` types - use proper typing
- Follow existing file naming: PascalCase for components, camelCase for utilities

### Architecture
- Feature-based folder structure under `src/features/`
- Shared components in `src/components/`
- Types in `src/types/`
- Custom hooks in `src/hooks/`
- Keep components small and focused (single responsibility)

### State Management
- Use Zustand for global state (skills, categories)
- Use React state for local UI state (forms, modals)
- Persist important data to localStorage

### Components
- Props interface defined in same file or in `types/`
- Use React.FC or explicit return types
- Extract reusable logic to custom hooks
- Avoid inline functions in JSX when possible

### Git & Commits
- Follow Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`
- One logical change per commit
- Write clear, concise commit messages

### Testing
- Write tests for critical functionality
- Test components in isolation
- Mock external dependencies

---

## Markdown Import Rules
- Format specification: See `docs/markdown-format.md`
- Validation: Required fields must be present
- User must preview before importing
