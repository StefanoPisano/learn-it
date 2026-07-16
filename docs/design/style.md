# 🎨 Design System

Design specifications for the Learn It application.

---

## Style Direction

**Modern-Minimalist**: Clean layouts, subtle depth, generous spacing.

---

## Color Palette

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

| Level | Value | Usage |
|-------|-------|-------|
| Sm | `0 1px 3px rgba(0,0,0,0.1)` | Cards (default) |
| Md | `0 4px 12px rgba(0,0,0,0.15)` | Cards (hover), modals |
| Lg | `0 8px 24px rgba(0,0,0,0.2)` | Dropdowns, tooltips |

---

## Animations

- **Duration**: 200ms
- **Easing**: ease
- **Hover transitions**: box-shadow, background-color

---

## Accessibility

- Minimum contrast ratio of 4.5:1 for text
- Never rely on color alone to convey information
- Use text labels, icons, or patterns as secondary indicators
