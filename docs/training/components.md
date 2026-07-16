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

## Dashboard

**File**: `src/pages/Dashboard.tsx`

Home page that displays a grid of `LearningPathCard` components with a search bar and an import button.

### Current State

Uses **mock data** (6 hardcoded learning paths). No real state management yet.

### Layout

- Title + description
- "Import Path" button (top-right)
- Search input
- Responsive card grid (1 → 2 → 3 columns)
