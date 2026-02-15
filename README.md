# Portfolio Foundation

Your minimal, dependency-free design system foundation. Code is the source of truth.

## Philosophy

- **Code → Figma** (not Figma → Code)
- **Zero bloat** (no Tailwind, no shadcn, no unnecessary dependencies)
- **Design tokens** drive everything
- **Light/dark mode** built-in from day one
- **Scalable** but minimal to start

## Structure

```
portfolio-foundation/
├── tokens/
│   └── tokens.json          # Single source of truth for design decisions
├── scripts/
│   └── build-tokens.js      # Transforms JSON → CSS custom properties
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # Shared components (ThemeProvider, etc.)
│   ├── design-system/
│   │   └── components/      # Your design system components
│   └── styles/
│       ├── globals.css      # Global styles
│       └── tokens.css       # Auto-generated from tokens.json
└── package.json
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Tokens

```bash
npm run tokens
```

This reads `tokens/tokens.json` and generates `src/styles/tokens.css` with CSS custom properties.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your foundation.

### 4. Toggle the Theme

Click the theme toggle button to switch between light and dark mode. All components automatically adapt.

## Workflow

### Adding New Design Tokens

1. Edit `tokens/tokens.json`
2. Run `npm run tokens` (or it runs automatically with `npm run dev`)
3. Use the new tokens in your components via CSS custom properties

Example:
```css
.myComponent {
  color: var(--color-text-primary);
  padding: var(--spacing-md);
  border-radius: var(--borderRadius-lg);
}
```

### Creating New Components

1. Create component in `src/design-system/components/YourComponent/`
2. Use CSS Modules for styling
3. Reference design tokens via CSS custom properties
4. Export from `src/design-system/components/index.ts`

### Theme System

The theme system uses data attributes:
- Light theme: default (`:root`)
- Dark theme: `[data-theme="dark"]`

The `ThemeProvider` component handles:
- Theme state management
- localStorage persistence
- Preventing flash of unstyled content

## Design Tokens Reference

All tokens are in `tokens/tokens.json`:

- **Colors**: Base colors + light/dark semantic tokens
- **Spacing**: xs, sm, md, lg, xl, 2xl
- **Border Radius**: sm, md, lg, full
- **Font Size**: xs, sm, base, lg, xl, 2xl, 3xl
- **Font Weight**: normal, medium, semibold, bold
- **Line Height**: tight, normal, relaxed

### Token References

Tokens can reference other tokens using `{path.to.token}` syntax:

```json
{
  "color": {
    "base": {
      "blue": "#3b82f6"
    },
    "light": {
      "accent": "{color.base.blue}"
    }
  }
}
```

## Figma Integration (Optional)

To use these tokens in Figma:

1. Use a plugin like "Variables Import" or "Export/Import Variables"
2. Import `tokens/tokens.json` to Figma Variables
3. Design in Figma using those Variables
4. Code remains the source of truth

This is **one-way**: Code → Figma, not bidirectional.

## Building for Production

```bash
npm run build
npm start
```

## Scripts

- `npm run dev` - Start development server (auto-generates tokens)
- `npm run build` - Build for production
- `npm run tokens` - Manually generate CSS from tokens
- `npm run tokens:watch` - Watch tokens.json for changes

## Next Steps

1. Add more components (Input, Select, Modal, etc.)
2. Add playground tools under `src/app/playground/`
3. Deploy to Vercel
4. (Optional) Import tokens to Figma for visual design

## Philosophy Reminder

**Code is the source of truth.** Figma is a dependency, not a requirement. If Figma dies tomorrow, your tokens and components still work.
