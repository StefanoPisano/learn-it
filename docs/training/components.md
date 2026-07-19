# 🧩 Components

Documentation for all components in the project.

---

## Layout

**File**: `src/components/Layout.tsx`

Main container that wraps the entire application. Provides a persistent sidebar + header and renders the active page content inside an `<Outlet />`. The `<main>` element has `overflow-x-hidden` to prevent horizontal scroll from wide content (e.g., markdown tables).

### Structure

```
┌─────────────┬──────────────────────────┐
│             │  Header (hamburger mobile)│
│  Sidebar    ├──────────────────────────┤
│  (240px)    │                          │
│             │  <Outlet />              │
│             │  (page content)          │
│             │                          │
└─────────────┴──────────────────────────┘
```

### Behavior

| Breakpoint | Sidebar | Hamburger |
|------------|---------|-----------|
| Mobile (< 768px) | Hidden, overlay | Visible |
| Desktop (≥ 1024px) | Always visible | Hidden |

### Props

None — it's a route layout component that uses `<Outlet />` to render child routes.

### Layout Structure

```
┌─────────────┬──────────────────────────┐
│             │  Header                  │
│  Sidebar    │  (hamburger + title +   │
│  (240px)    │   ThemeToggle)           │
│             ├──────────────────────────┤
│             │                          │
│             │  <Outlet />              │
│             │  (page content)          │
│             │                          │
└─────────────┴──────────────────────────┘
```

---

## Sidebar

**File**: `src/components/Sidebar.tsx`

Left-side navigation with links to all app sections. On mobile it slides in as an overlay with a backdrop.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Controls sidebar visibility (mobile only) |
| `onClose` | `() => void` | Callback to close the sidebar |

### Navigation Items

Defined as a static array inside the file. Each item has:
- `icon` — Lucide icon component
- `label` — Display text
- `path` — Route path (relative to basename)

Active link is highlighted with the primary color.

---

## LearningPathCard

**File**: `src/components/LearningPathCard.tsx`

Card component that displays a learning path summary with title, difficulty badge, tags, author, and progress bar.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Learning path title |
| `description` | `string` | Short description (max 2 lines) |
| `difficulty` | `'beginner' \| 'intermediate' \| 'advanced'` | Difficulty level |
| `tags` | `string[]` | List of tags |
| `progress` | `number` | Completion percentage (0-100) |
| `author` | `string` | Author name |
| `link?` | `string` | Optional external URL |

### Visual Sections

| Section | Content |
|---------|---------|
| **Header** | Title + difficulty badge |
| **Body** | Description + tags |
| **Footer** | Author + progress bar |

---

## ThemeToggle

**File**: `src/components/ThemeToggle.tsx`

Button that toggles between light and dark mode. Displays a moon icon in light mode and a sun icon in dark mode. Uses the Zustand theme store to persist the preference.

### Behavior

- Click toggles theme
- Preference saved to localStorage
- Applied immediately to `<html>` element via CSS class `dark`
- On page load, theme is restored from localStorage (or falls back to system preference)

### Props

None — reads and writes state via `useThemeStore`.

---

## LanguageToggle

**File**: `src/components/LanguageToggle.tsx`

Button that toggles between English and Italian. Displays "EN" or "IT" based on current language.

### Behavior

- Click toggles between EN and IT
- Preference saved to localStorage via `useLanguageStore`
- i18next language is updated immediately
- Uses `useTranslation` hook for localized labels

### Props

None — reads and writes state via `useLanguageStore` and `i18next`.

---

## ImportModal

**File**: `src/components/ImportModal.tsx`

Modal dialog for importing Learning Paths from Markdown files. Supports drag & drop and file browser.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Controls modal visibility |
| `onClose` | `() => void` | Callback to close the modal |

### States

| State | Description |
|-------|-------------|
| `idle` | Shows drag & drop area and file browser |
| `parsing` | Loading spinner while parsing the file |
| `preview` | Shows parsed data (title, description, difficulty, tags, author) for confirmation |
| `importing` | Saving the path to the store |
| `success` | Confirmation message, auto-closes after 1.5s |
| `error` | Error message with retry button |

### Validation

| Rule | Error Message |
|------|---------------|
| Not a `.md` file | "File must be a Markdown (.md) file" |
| File > 50KB | "File exceeds 50KB limit. Try splitting the learning path into two separate files." |
| Parse error | Shows the specific parsing error |

### Flow

1. User drops or selects a `.md` file
2. File is validated (extension + size)
3. File content is parsed by `parseMarkdown`
4. Parsed data is displayed in preview
5. User confirms → `addPath` is called → path is saved to store (localStorage)
6. Modal auto-closes after success

---

## EmptyState

**File**: `src/components/EmptyState.tsx`

Displayed when a list has no items to show (e.g., no search results).

### Props

| Prop | Type | Description |
|------|------|-------------|
| `message` | `string` | Message to display |

---

## SectionList

**File**: `src/components/SectionList.tsx`

Vertical navigation list showing all sections of a learning path with type-specific icons, current section highlighting, and completed/incomplete styling.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `sections` | `Section[]` | List of sections to display |
| `completedSections` | `Set<number>` | Set of completed section indices |
| `currentIndex` | `number` | Index of the currently active section |
| `onNavigate` | `(index: number) => void` | Callback when a section is clicked |

### Behavior

| State | Icon | Text Color | Background |
|-------|------|------------|------------|
| **Current** | Type icon (white) | White | Primary color |
| **Completed** | Type icon (secondary) | Secondary | Transparent |
| **Incomplete** | Type icon (secondary) | Primary text | Transparent |

Section name is extracted from the first `##` heading in the content. Falls back to capitalized type name (e.g., "Concept", "Reference"). Quiz sections always show "Quiz".

### Section Icons

| Type | Icon |
|------|------|
| `concept` | `BookOpen` |
| `exercise` | `Pencil` |
| `quiz` | `Pencil` |
| `reference` | `ExternalLink` |

### Integration

- **Desktop (≥ 1024px)**: rendered in a sticky sidebar (`<aside>`, 256px width)
- **Mobile (< 1024px)**: hidden by default, opens as a slide-in overlay panel

---

## Dashboard

**File**: `src/pages/Dashboard.tsx`

Home page that displays a grid of `LearningPathCard` components with a search bar and an import button.

### Data Source

Uses `useLearningPathStore` to read learning paths from the shared Zustand store.

### Layout

- Title + description
- "Import Path" button (top-right)
- Search input (filters cards in real-time)
- Responsive card grid (1 → 2 → 3 columns)

---

## LearningPaths

**File**: `src/pages/LearningPaths.tsx`

Full list view with advanced filtering and sorting capabilities.

### Data Source

Uses `useLearningPathStore` to read learning paths from the shared Zustand store.

### Features

| Feature | Description |
|---------|-------------|
| **Search** | Filter by title, description, and tags |
| **Difficulty filter** | Filter by beginner/intermediate/advanced |
| **Tag filter** | Filter by specific tags (auto-generated from data) |
| **Sorting** | Sort by title, progress, or difficulty |
| **Clear filters** | Reset all active filters at once |

### Layout

- Title + path count
- "Import Path" button (top-right)
- Search bar + sort dropdown (side by side on desktop)
- Filter chips (difficulty + tags + clear button)
- Responsive card grid (1 → 2 → 3 columns)
