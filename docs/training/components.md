# 🧩 Components

Documentation for all components in the project.

---

## Layout

**File**: `src/components/Layout.tsx`

Main container that wraps the entire application. Provides a persistent sidebar + header and renders the active page content inside an `<Outlet />`.

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

## EmptyState

**File**: `src/components/EmptyState.tsx`

Displayed when a list has no items to show (e.g., no search results).

### Props

| Prop | Type | Description |
|------|------|-------------|
| `message` | `string` | Message to display |

---

## Dashboard

**File**: `src/pages/Dashboard.tsx`

Home page that displays a grid of `LearningPathCard` components with a search bar and an import button.

### Current State

Uses **mock data** (6 hardcoded learning paths). Includes a search bar that filters by title, description, and tags. Shows `EmptyState` when no results match.

### Layout

- Title + description
- "Import Path" button (top-right)
- Search input (filters cards in real-time)
- Responsive card grid (1 → 2 → 3 columns)
