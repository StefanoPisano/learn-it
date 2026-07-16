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
5. Keep README.md updated with new features and changes
6. Only document features that are actually implemented
7. Keep docs/design/ specs updated when modifying colors/UI
8. Keep docs/training/ updated when adding new components or concepts

---

## README Guidelines

### Tone & Style
- Use a friendly, engaging, and approachable tone
- Write for developers of all skill levels
- Be concise but informative
- Use active voice

### Structure
- Start with a compelling project description
- Include badges (build status, license, etc.) if applicable
- Use clear section hierarchy (H2 for main sections, H3 for subsections)

### Visual Elements
- Use emoji icons next to section titles for visual appeal
- Example: `## 🚀 How to Run`
- Keep emoji usage consistent throughout

### Required Sections
1. **Project Description** - What the app does, why it exists
2. **Tech Stack** - Technologies and tools used
3. **Features** - Key functionality with brief descriptions
4. **How to Run** - Setup instructions, prerequisites, available scripts
5. **How to Use** - User guide for main features
6. **Documentation** - Links to additional docs (markdown format, etc.)

### Formatting
- Use code blocks for commands and code examples
- Use tables for structured data (scripts, tech stack)
- Use bullet lists for features and steps
- Keep line lengths reasonable for readability

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
