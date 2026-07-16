# 🎨 Design System

Design specifications for the Learn It application.

---

## Style Direction

**Modern-Minimalist**: Clean layouts, subtle depth, generous spacing.

---

## Color Palette

### Light Mode (Default)

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary | Blue | `#2563EB` | Buttons, links, header |
| Secondary | Green | `#10B981` | Progress bar, success states |
| Accent | Orange | `#F59E0B` | Badges, CTAs, highlights |
| Background | Light gray | `#F8FAFC` | Main background |
| Surface | White | `#FFFFFF` | Cards, modals |
| Text | Near-black | `#1E293B` | Primary text |
| Text secondary | Gray | `#64748B` | Captions, placeholders |
| Border | Light gray | `#E2E8F0` | Card borders, dividers |

### Dark Mode

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary | Blue | `#3B82F6` | Buttons, links, header |
| Secondary | Green | `#34D399` | Progress bar, success states |
| Accent | Orange | `#FBBF24` | Badges, CTAs, highlights |
| Background | Dark gray | `#0F172A` | Main background |
| Surface | Dark slate | `#1E293B` | Cards, modals |
| Text | White | `#F8FAFC` | Primary text |
| Text secondary | Gray | `#94A3B8` | Captions, placeholders |
| Border | Dark gray | `#334155` | Card borders, dividers |

### 60-30-10 Rule
- **60%** - Dominant color (background, main content area)
- **30%** - Secondary color (text, borders)
- **10%** - Accent color (buttons, badges, highlights)

---

## Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 | Inter | 30px | Bold (700) |
| H2 | Inter | 24px | Semibold (600) |
| H3 | Inter | 20px | Semibold (600) |
| Body | Inter | 16px | Regular (400) |
| Small | Inter | 14px | Regular (400) |

---

## Spacing

| Level | Value | Usage |
|-------|-------|-------|
| xs | 4px | Inline elements |
| sm | 8px | Small gaps |
| md | 16px | Standard padding |
| lg | 24px | Section padding |
| xl | 32px | Page margins |

---

## Border Radius

| Element | Radius |
|---------|--------|
| Card | 12px |
| Button | 8px |
| Input | 8px |
| Badge | 16px (pill) |
| Avatar | 50% (circle) |

---

## Shadows

| Level | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| Sm | `0 1px 3px rgba(0,0,0,0.1)` | `0 1px 3px rgba(0,0,0,0.3)` | Cards (default) |
| Md | `0 4px 12px rgba(0,0,0,0.15)` | `0 4px 12px rgba(0,0,0,0.4)` | Cards (hover), modals |
| Lg | `0 8px 24px rgba(0,0,0,0.2)` | `0 8px 24px rgba(0,0,0,0.5)` | Dropdowns, tooltips |

---

## Dark Mode

- Toggle in header (sun/moon icon)
- Persist preference to localStorage
- Use Tailwind `dark:` prefix for dark mode styles
- System preference as default (`prefers-color-scheme`)

---

## Animations

- **Duration**: 200ms
- **Easing**: ease
- **Hover transitions**: box-shadow, background-color
- **Theme transitions**: background-color, color (300ms for smooth dark mode toggle)

---

## Icons

- **Library**: [Lucide](https://lucide.dev)
- **Style**: Stroke, minimalist
- **Default size**: 24px
- **Color**: Inherit from parent (currentColor)

---

## Navigation

### Layout
- **Sidebar**: Left side, 240px width
- **Desktop**: Always visible
- **Mobile**: Hidden by default, toggle via hamburger button

### Breakpoints
| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | < 768px | Sidebar hidden, hamburger toggle |
| Tablet | ≥ 768px | Sidebar collapsible |
| Desktop | ≥ 1024px | Sidebar always visible |

### Mobile Sidebar
- Overlay on top of content
- Close on tap outside or swipe left
- Backdrop with blur effect

---

## Components

### Learning Path Card

| Section | Content |
|---------|---------|
| **Header** | Title, difficulty badge |
| **Body** | Tags, short description |
| **Footer** | Progress bar, author, date |

### Empty States

- Icon + text pattern
- Large Lucide icon (48px)
- Descriptive message below
- Optional action button (e.g., "Import your first Learning Path")

---

## Loading States

### Skeleton
- Use for initial content load (e.g., learning path list)
- Pulse animation
- Match the layout of the actual content

### Spinner
- Use for inline actions (e.g., save, delete)
- Small size, inside the button

### Progress Bar
- Use for long operations with calculable progress (e.g., markdown import)

---

## Error Handling

### Toast
- Temporary errors (network, save failed)
- Auto-dismiss after 5 seconds
- Position: top-right
- Types: error (red), success (green), info (blue)

### Inline Errors
- Form validation errors
- Display below the input field

### Error Page
- Critical errors (404, 500)
- Full page with icon + message + retry button

---

## Accessibility

- Minimum contrast ratio of 4.5:1 for text
- Never rely on color alone to convey information
- Use text labels, icons, or patterns as secondary indicators
