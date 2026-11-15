---
name: Obsidian Gold Academic
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#d8c3ad'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#a08e7a'
  outline-variant: '#534434'
  surface-tint: '#ffb95f'
  primary: '#ffc174'
  on-primary: '#472a00'
  primary-container: '#f59e0b'
  on-primary-container: '#613b00'
  inverse-primary: '#855300'
  secondary: '#7bd0ff'
  on-secondary: '#00354a'
  secondary-container: '#00a6e0'
  on-secondary-container: '#00374d'
  tertiary: '#56e5a9'
  on-tertiary: '#003824'
  tertiary-container: '#30c88f'
  on-tertiary-container: '#004e34'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffddb8'
  primary-fixed-dim: '#ffb95f'
  on-primary-fixed: '#2a1700'
  on-primary-fixed-variant: '#653e00'
  secondary-fixed: '#c4e7ff'
  secondary-fixed-dim: '#7bd0ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c69'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
  surface-canvas: '#020617'
  surface-card: '#0B0F17'
  surface-elevated: '#0F172A'
  surface-subtle: '#1E293B'
  border-subtle: '#1E293B'
  border-glass: rgba(255, 255, 255, 0.08)
  accent-gold-hover: '#D97706'
  accent-gold-light: '#FBBF24'
  indicator-danger: '#F43F5E'
  text-primary: '#F8FAFC'
  text-muted: '#64748B'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  mono-timer:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.12em
  label-nav:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies intense academic rigor, laser focus, and premium digital mentorship tailored for Chartered Accountancy aspirants. It balances ruthless productivity with a calm, nocturnal sanctuary aesthetic designed to minimize optical fatigue over 12-hour study grinds.

The design movement merges **Dark Modernism** with **Glassmorphism** and high-contrast educational telemetry:
- Deep obsidian and midnight navy backdrops eliminate glare and screen fatigue.
- High-chroma amber and gold key moments spotlight critical milestones, revision timers, and primary calls to action without visual chaos.
- Functional cyan, emerald, and rose accents provide high-signal syllabus status telemetry (revision status, pass-rate analytics, test countdowns).
- Crisp typography and razor-sharp, low-opacity borders deliver executive-level clarity fit for future finance leaders.

## Colors

The palette revolves around deep void depths offset by incandescent amber and cool analytical indicators:

- **Primary (`#F59E0B` Amber Gold)**: Reserved for primary action drivers, live countdown timers, active navigation indicators, and key exam goals.
- **Secondary (`#38BDF8` Sky Blue)**: Used for search affordances, secondary tooltips, universal lookup, and analytical line metrics.
- **Tertiary (`#10B981` Emerald)**: Signifies verified preparation states, target completion badges, and high-confidence metrics.
- **Neutrals (`#020617` Canvas to `#94A3B8` Slate Text)**: Form a tiered hierarchy of dark slate and obsidian tones. Text employs `#F8FAFC` for high-contrast reading, stepping down to `#94A3B8` and `#64748B` for secondary annotations and metadata.

## Typography

The typographic hierarchy combines the warm clarity of **Plus Jakarta Sans** with the structural precision of **JetBrains Mono**:

- **Plus Jakarta Sans** leads headlines and UI copy. Generous x-height and geometric forms ensure effortless scanning through technical accounting passages, questions, and revision notes.
- **JetBrains Mono** powers precision elements: exam target countdowns, keyboard hotkey indicators (`⌘K`), timing telemetry (`1 D : 12 H : 52 M`), and numerical dashboard charts.
- Section overlines, category separators, and sidebar group labels leverage `label-caps` in uppercase format with wide tracking (`0.12em`) to cleanly separate functional domains.

## Layout & Spacing

This design system uses a flexible, modular layout rooted in an 8pt base grid:

- **Desktop (≥ 1280px)**: Persistent left sidebar (260px fixed width), a high-utility persistent top utility pill/header, and a fluid main dashboard spanning 12 columns with 24px gutters.
- **Tablet (768px – 1279px)**: Collapsed navigation rail (72px icon view) with dynamic overlay drawers, single-column main content, and 16px gutters.
- **Mobile (< 768px)**: Bottom action bar, modal search sheet triggered via top status pill, stacked cards, and full-width metric modules with 16px lateral canvas margins.
- **Rhythm**: Internal card padding standardizes to `space-md` (16px) or `space-lg` (24px). Compact navigation bars and chips lock strictly to `space-xs` (4px) and `space-sm` (8px) increments.

## Elevation & Depth

Visual hierarchy operates via luminous boundaries, dark glass textures, and subtle amber highlights:

- **Level 0 (Canvas)**: Solid deep obsidian `#020617` base.
- **Level 1 (Panels & Sidebar)**: `#0B0F17` framed by a subtle 1px border (`#1E293B` or `rgba(255, 255, 255, 0.05)`).
- **Level 2 (Glass Cards & Modules)**: Translucent `#0F172A` with backdrop blur (`blur(12px)`) and a delicate white specular top rim (`rgba(255, 255, 255, 0.08)`).
- **Level 3 (Interactive Modals & Floats)**: `#1E293B` elevated with diffused drop shadows (`0 16px 36px -8px rgba(0, 0, 0, 0.65)`).
- **Glow Accents**: Active study timers, badges, and primary action buttons emit a soft, localized amber bloom (`box-shadow: 0 0 20px -4px rgba(245, 158, 11, 0.25)`).

## Shapes

The system relies on balanced roundedness (`roundedness: 2`) with specialized pill geometries for contextual telemetry:

- **Cards and Containers**: Uniform `12px` to `16px` border-radius (`rounded-lg` to `rounded-xl`) to soften dense analytical interfaces.
- **Pills and Badges**: Fully rounded (`9999px`) for countdown chips, syllabus status tags, group identifiers, and compact primary buttons.
- **Inputs & Action Triggers**: `10px` to `12px` for comfortable finger/cursor targets that blend smoothly with card contours.

## Components

### Buttons
- **Primary CTA**: Rich amber fill (`#F59E0B`), bold dark text (`#020617`), subtle inner top highlight, and `rounded-full` or `rounded-lg` geometry. Hover shifts to `#D97706` with subtle amber aura.
- **Secondary Ghost**: Transparent surface with `1px solid rgba(255, 255, 255, 0.12)`, text `#F8FAFC`, hover states elevating to `#1E293B`.
- **Icon Actions**: 36px–40px squares or circles with translucent backing (`rgba(255, 255, 255, 0.03)`), `#94A3B8` icon color, switching to amber or sky blue on active hover.

### Chips & Badges
- **Exam Countdown Pill**: Dark navy pill housing JetBrains Mono figures, amber highlight digits (`#F59E0B`), and a glowing status indicator dot.
- **Syllabus Category Badges**: Dual-tone pills with low-opacity chromatic backgrounds (`rgba(56, 189, 248, 0.1)` for blue, `rgba(16, 185, 129, 0.1)` for green) matched to sharp 11px uppercase labels.

### Inputs & Search Bars
- **Universal Lookup (`⌘K`)**: Dark slate field (`#0B0F17`), subtle border (`#1E293B`), leading search glyph in sky blue, trailing keyboard shortcut pill in monospaced muted gray. Expands into a luminous glass search dialog upon focus.

### Cards
- **Syllabus / Metric Cards**: Obsidian container (`#0F172A`) with rounded 16px corners, 1px frosted glass border, high-contrast headline, and modular progress tracker bars.

### Progress & Timers
- **Grind Clock / Revision Trackers**: Monospace-centered numeric display bordered by circular SVG progress tracks in amber or emerald, accompanied by start/pause controls.