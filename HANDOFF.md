# HANDOFF.md — Z26 Design System & Portfolio

> **Read this file first.** This is the single source of context for all AI agents (Claude, Cursor, Claude Code) working on this project.

---

## Project Overview

**Owner:** Zach Acuna — product designer building a portfolio and personal tool ecosystem.

**Goal:** Build a centralized design system and portfolio site that enables rapid iteration on new ideas. The design system is the foundation; everything else (portfolio, tools, playground) consumes it.

**Live URLs:**
- `zachacuna.com` — Portfolio site (currently hosted via Figma, will migrate to this codebase)
- `play.zachacuna.com` — Playground / design system / tools (currently points to this repo on Vercel)

**Repo:** `github.com/zacuna/z26` (public while building the design system foundation; will go private when case study content is added)

---

## Architecture

### Current State (Pre-Migration)
- Next.js 15 + TypeScript + App Router
- Custom token pipeline: `tokens.json` → `build-tokens.js` → `tokens.css` → CSS Modules
- Hand-rolled components (Button, Card, SiteHeader, SideNav, DataTable)
- ThemeProvider with `data-theme` attribute for light/dark mode
- **This entire styling/component layer is being replaced.** Do not build on top of it.

### Target State (Post-Migration)
- Next.js 15 + TypeScript + App Router (unchanged)
- **Tailwind CSS v4** for styling
- **Shadcn UI** for component primitives (owned source code, not a dependency)
- Theme via CSS variables managed through globals.css, mapped in tailwind.config.ts
- Light/dark mode via Shadcn's built-in theme system (replaces custom ThemeProvider)
- **Theme Editor** — browser-based tool for tweaking design tokens in real-time

### Styling Architecture (Three Layers)

```
LAYER 1 — globals.css (defines actual values as CSS variables)
  The ONLY place where raw values (pixel numbers, hex codes, HSL values) appear.
  Contains primitives (--radius-md: 8px) and semantic tokens (--background: 0 0% 100%).

LAYER 2 — tailwind.config.ts (maps Tailwind class names to CSS variables)
  Contains ZERO raw values. Every entry is a var() reference pointing to globals.css.
  Example: borderRadius: { md: "var(--radius-md)" }

LAYER 3 — component files (.tsx) (use Tailwind utility classes)
  Components never see raw values. They use classes like bg-primary, rounded-md, p-4.

Example chain:
  globals.css:          --radius-md: 8px;
  tailwind.config.ts:   borderRadius: { md: "var(--radius-md)" }
  component.tsx:        className="rounded-md"
```

No CSS Modules. No inline styles. No hardcoded values anywhere outside globals.css.

### Target File Structure
```
z26/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── play/
│       ├── page.tsx                 ← Tools index
│       └── design-system/
│           └── page.tsx             ← Component playground + Theme Editor
├── components/
│   ├── ui/                          ← Shadcn components (CLI-generated, customized)
│   │   ├── button.tsx
│   │   ├── table.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── sheet.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── ...
│   ├── theme-editor/                ← Browser-based token editor
│   │   ├── ThemeEditor.tsx
│   │   ├── TokenField.tsx
│   │   └── export-utils.ts
│   ├── app-shell.tsx                ← Site header + side nav + content layout
│   └── theme-provider.tsx           ← Shadcn's theme provider (replaces custom)
├── lib/
│   └── utils.ts                     ← Shadcn utility (cn function)
├── styles/
│   └── globals.css                  ← Tailwind directives + theme CSS variables
├── app/api/
│   └── theme/
│       └── save/
│           └── route.ts             ← DEV-ONLY endpoint for saving theme changes to globals.css
├── tailwind.config.ts               ← Maps Tailwind classes to CSS variables (no raw values)
├── components.json                  ← Shadcn config
├── HANDOFF.md                       ← This file
├── .cursorrules
├── .env.local                       ← Secrets (gitignored)
├── .env.example                     ← Template for env vars
└── .gitignore
```

### Future State (When Portfolio Content Is Added)
The repo will go private. The design system may be extracted into a separate public repo (`z26-design-system`) that the portfolio site imports. MDX files for case studies will live in a `content/` directory. The domain `zachacuna.com` will point to this app.

---

## Design Token Architecture

### Two-Tier Token System

**Primitives** — The raw values available in the system. Defined as CSS variables in `globals.css`. These are the only values that should ever be used. No hardcoded/magic numbers anywhere.

```
primitives:
  colors: full palette with named stops
  spacing: 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
  radius: 0, 4, 8, 12, 16, 9999
  fontSize: 12, 14, 16, 18, 24, 32, 40
  fontWeight: 400, 500, 600, 700
  lineHeight: 1.2, 1.5, 1.75
  shadow: sm, md, lg
  zIndex: base(0), dropdown(100), sticky(200), sidebar(300), header(400), modal(500), tooltip(600)
```

**Semantic Tokens** — Named assignments that reference primitives. Also defined as CSS variables in `globals.css`, scoped by theme.

```
semantic:
  color-background → light value in :root / dark value in .dark
  color-foreground → light value in :root / dark value in .dark
  color-border → light value in :root / dark value in .dark
  ... etc
```

### Rule: No Hardcoded Values
Every value in every component must reference a token via Tailwind utility classes. If a value doesn't exist in the primitives, add it to globals.css first — never use a raw number. The Theme Editor UI enforces this by only offering dropdowns of existing primitive values.

---

## Theme Editor

### Concept
A browser-based panel for editing semantic token assignments in real-time. Lives at `/play/design-system`. Changes are made in-memory via `document.documentElement.style.setProperty()` — no file system involvement during exploration.

### Public vs Local Behavior
- **Public visitors** see the Theme Editor and can play with it. Changes happen in real-time in the browser. Nothing persists when they navigate away. No save button is shown. This is a live demo of the design system — a portfolio piece visitors can interact with.
- **Local development** has an additional "Save to File" button that writes the current token values to `globals.css`. The dev server hot-reloads and the changes are baked in. The developer (Zach) then does a manual git commit whenever ready. This bridges the gap between "I like what I see in the browser" and having to manually copy values into a file.

### Modes
1. **Explore** — Tweak values, see instant changes, zero side effects. Reset button reverts to the values currently saved in globals.css. Available to everyone (public and local).
2. **Export** — Generate a config snippet to manually copy into globals.css. Available to everyone.
3. **Save to File** (local dev only) — Write the current token values directly to `globals.css` via a local API route. The dev server hot-reloads automatically. Git commits are handled manually by the developer, separate from this feature.

### Important Terminology Note
"Save to File" means writing token values to `globals.css` on the local file system. It does NOT mean a git commit. The developer reviews changes and commits to git manually whenever ready. AI agents working on this project: do not conflate saving to file with committing to version control. These are separate actions.

### Security Requirements for Save to File
- The `/api/theme/save` route must ONLY exist when `NODE_ENV === 'development'`
- The route must validate a password from `THEME_EDITOR_PASSWORD` env var
- The save button must not render in production builds (compile-time check, not just UI hiding)
- Use `process.env.NODE_ENV === 'development'` as a server-side guard — this cannot be spoofed in Next.js
- The API route file should include a comment explaining the security model
- Three layers of protection: the button doesn't exist in production (compile-time removal) + the endpoint rejects all requests in production (runtime check) + the endpoint requires a password even in development

### Constraint Enforcement
- Color fields show only colors from the primitive palette (not a free-form picker)
- Spacing fields show only values from the spacing scale (dropdown, not text input)
- Radius fields show only defined radius values
- Font fields show only defined font sizes/weights
- If a new primitive value is needed, it must be added to `globals.css` first

---

## Migration Phases

### Phase 1 — Clean Foundation
- [ ] Delete: `tokens/`, `scripts/`, `src/styles/tokens.css`, all CSS Module files
- [ ] Delete: all components in `src/design-system/`
- [ ] Delete: `nodemon` dependency
- [ ] Install: Tailwind CSS v4, configure for Next.js 15
- [ ] Set up: primitives as CSS variables in globals.css (the ONLY file with raw values)
- [ ] Set up: tailwind.config.ts mapping class names to CSS variables (no raw values in this file)
- [ ] Set up: semantic color tokens for light/dark theme in globals.css
- [ ] Install: Shadcn CLI, run init
- [ ] Restructure: `src/` directory to match target file structure
- [ ] Verify: dev server runs without crashing
- [ ] Create: `.env.example` with `THEME_EDITOR_PASSWORD=`

### Phase 2 — Core Components
- [ ] Add via Shadcn CLI: Button, Table, Navigation Menu, Sheet, Dropdown Menu, Toggle
- [ ] Customize component styling with theme CSS variables
- [ ] Build: App Shell (header + side nav + content area)
- [ ] Build: Theme toggle using next-themes
- [ ] Verify: light/dark mode works end to end
- [ ] Accessibility pass on all components

### Phase 3 — Theme Editor
- [ ] Build: ThemeEditor component that reads current CSS variables
- [ ] Build: TokenField components (dropdowns constrained to primitives)
- [ ] Build: Real-time preview via setProperty
- [ ] Build: Export function (generates config snippet)
- [ ] Build: `/api/theme/save` route (dev-only, password-protected)
- [ ] Build: "Save to File" button with security guards (writes to globals.css; developer handles git separately)
- [ ] Build: Reset button
- [ ] Wire up: `/play/design-system` page with playground + Theme Editor
- [ ] Ensure: public visitors can use Theme Editor without save functionality

### Phase 4 — Polish & Lock Down
- [ ] Component playground page showing all components in all states
- [ ] README update
- [ ] Final accessibility audit
- [ ] Verify production build excludes save-to-file functionality entirely
- [ ] Deploy to Vercel, confirm play.zachacuna.com works

---

## Coding Conventions

See `.cursorrules` for the full set. Key points:

- **Never hardcode values.** Always use Tailwind classes that map to design tokens. Raw values only exist in globals.css.
- **tailwind.config.ts contains only var() references.** No raw pixel values, hex codes, or numbers.
- **Components go in `components/ui/`** (Shadcn-managed) or `components/` (custom compositions).
- **Use `cn()` utility** for conditional class merging (Shadcn pattern).
- **TypeScript strict mode.** All props typed, no `any`.
- **Accessibility:** WCAG AA minimum. Shadcn/Radix handles most of this; verify contrast ratios against your specific color tokens.
- **No CSS Modules.** Tailwind utility classes only.
- **Server Components by default.** Only add `'use client'` when you need interactivity.

---

## Agent Workflow

### Planning & Strategy → Claude (claude.ai, this project)
- Architecture decisions, migration planning, code review
- Share context by pointing to the public GitHub repo or pasting snippets

### Implementation → Cursor (Pro account)
- Code generation, file creation, component building
- Cursor reads `.cursorrules` automatically for conventions
- Start each session by reading `HANDOFF.md`

### Heavy Lifting → Claude Code (when token budget allows)
- Complex multi-file refactors, debugging, testing
- Point to `HANDOFF.md` for context

### Keeping In Sync
After any agent session that makes changes, update the changelog below with:
- Date
- Agent used
- What changed
- Any issues or next steps

---

## Changelog

| Date | Agent | Changes | Notes |
|------|-------|---------|-------|
| 2/20/2026 | Claude (claude.ai) | Created HANDOFF.md, .cursorrules, migration plan | Ready to begin Phase 1 |
| | | | |

---

## Known Issues

- Dev server crashes were caused by token build script + file watchers creating rebuild loops. This is resolved by the migration to Tailwind (no custom build scripts).
- `play.zachacuna.com` currently shows old test content (button variants, card demos). Will be replaced by the new playground after migration.

---

## Environment Variables

See `.env.example` for the template. Current vars:

| Variable | Purpose | Required |
|----------|---------|----------|
| `THEME_EDITOR_PASSWORD` | Password for dev-only theme save-to-file endpoint | Dev only |
