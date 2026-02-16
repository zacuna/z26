'use client';

import { useState, useCallback, useRef } from 'react';
import { Button, Card } from '@/design-system/components';
import { useTheme } from '@/components/ThemeProvider';
import styles from './page.module.css';

// ── Token data (mirrors tokens.json structure) ─────────────────────────────

const BASE_COLORS: Record<string, Record<string, string>> = {
  black: {
    '50': 'rgba(0, 0, 0, 0.05)',
    '100': 'rgba(0, 0, 0, 0.1)',
    '200': 'rgba(0, 0, 0, 0.2)',
    '300': 'rgba(0, 0, 0, 0.3)',
    '400': 'rgba(0, 0, 0, 0.4)',
    '500': 'rgba(0, 0, 0, 0.5)',
    '600': 'rgba(0, 0, 0, 0.6)',
    '700': 'rgba(0, 0, 0, 0.7)',
    '800': 'rgba(0, 0, 0, 0.8)',
    '900': 'rgba(0, 0, 0, 0.9)',
    '1000': 'rgba(0, 0, 0, 1)',
  },
  white: {
    '50': 'rgba(255, 255, 255, 0.05)',
    '100': 'rgba(255, 255, 255, 0.1)',
    '200': 'rgba(255, 255, 255, 0.2)',
    '300': 'rgba(255, 255, 255, 0.3)',
    '400': 'rgba(255, 255, 255, 0.4)',
    '500': 'rgba(255, 255, 255, 0.5)',
    '600': 'rgba(255, 255, 255, 0.6)',
    '700': 'rgba(255, 255, 255, 0.7)',
    '800': 'rgba(255, 255, 255, 0.8)',
    '900': 'rgba(255, 255, 255, 0.9)',
    '1000': 'rgba(255, 255, 255, 1)',
  },
  gray: {
    '50': '#f9fafb',
    '100': '#f3f4f6',
    '200': '#e5e7eb',
    '300': '#d1d5db',
    '400': '#9ca3af',
    '500': '#6b7280',
    '600': '#4b5563',
    '700': '#374151',
    '800': '#1f2937',
    '900': '#111827',
  },
  blue: {
    '400': '#60a5fa',
    '500': '#3b82f6',
    '600': '#2563eb',
    '700': '#1d4ed8',
  },
};

const SPACING: Record<string, string> = {
  '0': '0px',
  '50': '2px',
  '100': '4px',
  '200': '8px',
  '300': '12px',
  '400': '16px',
  '500': '20px',
  '600': '24px',
  '800': '32px',
  '1000': '40px',
  '1200': '48px',
  '1600': '64px',
  '2000': '80px',
  '2400': '96px',
};

const BORDER_RADIUS: Record<string, string> = {
  '0': '0px',
  '100': '4px',
  '200': '8px',
  '300': '12px',
  '400': '16px',
  full: '9999px',
};

const FONT_SIZES: Record<string, string> = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '30px',
};

const FONT_WEIGHTS: Record<string, string> = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

const LINE_HEIGHTS: Record<string, string> = {
  tight: '1.2',
  normal: '1.5',
  relaxed: '1.75',
};

const TYPOGRAPHY_RAMP = {
  heading: {
    lg: { fontSize: '3xl', lineHeight: 'tight' },
    md: { fontSize: '2xl', lineHeight: 'tight' },
    sm: { fontSize: 'xl', lineHeight: 'tight' },
  },
  body: {
    lg: { fontSize: 'lg', lineHeight: 'relaxed' },
    md: { fontSize: 'base', lineHeight: 'normal' },
    sm: { fontSize: 'sm', lineHeight: 'normal' },
  },
};

// ── Semantic mapping definitions ───────────────────────────────────────────

/** A semantic token ref like "base.white" or "base.gray.900" */
type SemanticRef = string;

interface SemanticMappings {
  background: { primary: SemanticRef; secondary: SemanticRef; tertiary: SemanticRef };
  text: { primary: SemanticRef; secondary: SemanticRef; tertiary: SemanticRef };
  border: { default: SemanticRef; hover: SemanticRef };
  accent: { primary: SemanticRef; hover: SemanticRef };
}

const INITIAL_LIGHT_MAPPINGS: SemanticMappings = {
  background: { primary: 'base.white.1000', secondary: 'base.gray.50', tertiary: 'base.gray.100' },
  text: { primary: 'base.gray.900', secondary: 'base.gray.600', tertiary: 'base.gray.400' },
  border: { default: 'base.gray.200', hover: 'base.gray.300' },
  accent: { primary: 'base.blue.500', hover: 'base.blue.600' },
};

const INITIAL_DARK_MAPPINGS: SemanticMappings = {
  background: { primary: 'base.gray.900', secondary: 'base.gray.800', tertiary: 'base.gray.700' },
  text: { primary: 'base.gray.50', secondary: 'base.gray.300', tertiary: 'base.gray.500' },
  border: { default: 'base.gray.700', hover: 'base.gray.600' },
  accent: { primary: 'base.blue.400', hover: 'base.blue.500' },
};

/** All available primitive color options for the dropdowns */
function buildPrimitiveOptions(
  obj: Record<string, Record<string, string> | string>,
  prefix = 'base',
): { ref: string; label: string; hex: string }[] {
  const out: { ref: string; label: string; hex: string }[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const ref = `${prefix}.${k}`;
    if (typeof v === 'string') {
      out.push({ ref, label: ref, hex: v as string });
    } else {
      out.push(...buildPrimitiveOptions(v as Record<string, string>, ref));
    }
  }
  return out;
}

const PRIMITIVE_OPTIONS = buildPrimitiveOptions(BASE_COLORS as Record<string, Record<string, string> | string>);

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Flatten base colors into { 'color-white-1000': 'rgba(...)', 'color-gray-50': '#f9..' } */
function flattenBaseColors(
  obj: Record<string, Record<string, string> | string>,
  prefix = 'color',
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = `${prefix}-${k}`;
    if (typeof v === 'string') {
      out[key] = v;
    } else {
      Object.assign(out, flattenBaseColors(v as Record<string, string>, key));
    }
  }
  return out;
}

/** Parse any color (hex or rgba) into { r, g, b, a } */
function parseColor(color: string): { r: number; g: number; b: number; a: number } | null {
  // Try hex
  const hexMatch = color.match(/^#([0-9a-fA-F]{6})$/);
  if (hexMatch) {
    const c = hexMatch[1];
    return {
      r: parseInt(c.substring(0, 2), 16),
      g: parseInt(c.substring(2, 4), 16),
      b: parseInt(c.substring(4, 6), 16),
      a: 1,
    };
  }
  // Try rgba
  const rgbaMatch = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/);
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1], 10),
      g: parseInt(rgbaMatch[2], 10),
      b: parseInt(rgbaMatch[3], 10),
      a: rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1,
    };
  }
  return null;
}

function contrastColor(color: string): string {
  const parsed = parseColor(color);
  if (!parsed) return '#000000';
  // For semi-transparent colors, blend against white background
  const bg = 255;
  const r = parsed.r * parsed.a + bg * (1 - parsed.a);
  const g = parsed.g * parsed.a + bg * (1 - parsed.a);
  const b = parsed.b * parsed.a + bg * (1 - parsed.a);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.5 ? '#000000' : '#ffffff';
}

function isValidColor(v: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(v) || /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/.test(v);
}

/**
 * Convert a semantic ref like "base.white" or "base.gray.50" to the
 * CSS custom property name used in the primitives layer.
 * "base.white" → "color-white"
 * "base.gray.50" → "color-gray-50"
 */
function refToCSSProp(ref: string): string {
  // Strip the leading "base." and join with dashes
  return 'color-' + ref.replace(/^base\./, '').replace(/\./g, '-');
}

/**
 * Resolve a semantic ref to its current hex value using the live colors state.
 */
function resolveRefHex(ref: string, colors: Record<string, string>): string {
  const cssProp = refToCSSProp(ref);
  return colors[cssProp] || '#000000';
}

/**
 * Convert a semantic ref to the JSON reference format.
 * "base.white" → "{color.base.white}"
 * "base.gray.50" → "{color.base.gray.50}"
 */
function refToJsonRef(ref: string): string {
  return `{color.${ref}}`;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function DesignSystemPlayground() {
  const { theme, toggleTheme } = useTheme();

  // Editable primitive color state
  const [colors, setColors] = useState<Record<string, string>>(() =>
    flattenBaseColors(BASE_COLORS),
  );

  // Editable spacing
  const [spacing, setSpacing] = useState<Record<string, string>>({ ...SPACING });

  // Editable font sizes
  const [fontSizes, setFontSizes] = useState<Record<string, string>>({ ...FONT_SIZES });

  // Google Fonts state
  const [fontUrl, setFontUrl] = useState('');
  const [loadedFamilies, setLoadedFamilies] = useState<string[]>([]);
  const [headingFont, setHeadingFont] = useState('');
  const [bodyFont, setBodyFont] = useState('');
  const fontLinkRef = useRef<HTMLLinkElement | null>(null);

  // Theme mappings state
  const [lightMappings, setLightMappings] = useState<SemanticMappings>(
    () => JSON.parse(JSON.stringify(INITIAL_LIGHT_MAPPINGS)),
  );
  const [darkMappings, setDarkMappings] = useState<SemanticMappings>(
    () => JSON.parse(JSON.stringify(INITIAL_DARK_MAPPINGS)),
  );
  const [mappingThemeTab, setMappingThemeTab] = useState<'light' | 'dark'>('light');

  // Active main tab
  const [activeTab, setActiveTab] = useState<
    'foundations' | 'components' | 'fonts' | 'mappings'
  >('foundations');

  // ── Live CSS update ────────────────────────────────────────────────────

  const setCSSVar = useCallback((prop: string, value: string) => {
    document.documentElement.style.setProperty(`--${prop}`, value);
  }, []);

  const handleColorChange = useCallback(
    (key: string, value: string) => {
      setColors((prev) => ({ ...prev, [key]: value }));
      if (isValidColor(value)) {
        setCSSVar(key, value);
      }
    },
    [setCSSVar],
  );

  /** Convert a color to hex for color picker (best effort) */
  const toHexForPicker = (color: string): string => {
    const parsed = parseColor(color);
    if (!parsed) return '#000000';
    const r = Math.round(parsed.r).toString(16).padStart(2, '0');
    const g = Math.round(parsed.g).toString(16).padStart(2, '0');
    const b = Math.round(parsed.b).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  const handleSpacingChange = useCallback(
    (key: string, value: string) => {
      setSpacing((prev) => ({ ...prev, [key]: value }));
      setCSSVar(`spacing-${key}`, value);
    },
    [setCSSVar],
  );

  const handleFontSizeChange = useCallback(
    (key: string, value: string) => {
      setFontSizes((prev) => ({ ...prev, [key]: value }));
      setCSSVar(`fontSize-${key}`, value);
    },
    [setCSSVar],
  );

  // ── Theme mapping change handler ───────────────────────────────────────

  const handleMappingChange = useCallback(
    (
      themeKey: 'light' | 'dark',
      category: keyof SemanticMappings,
      token: string,
      newRef: string,
    ) => {
      const setter = themeKey === 'light' ? setLightMappings : setDarkMappings;
      setter((prev) => {
        const updated = JSON.parse(JSON.stringify(prev)) as SemanticMappings;
        (updated[category] as Record<string, string>)[token] = newRef;
        return updated;
      });

      // Build CSS property name: "color-background-primary", "color-text-secondary", etc.
      const cssProp = `color-${category}-${token}`;

      // Resolve the ref to get the actual CSS var name for the primitive
      // We set the semantic token to point at the primitive's CSS var
      const primitiveCSSVar = `--${refToCSSProp(newRef)}`;

      // Only apply live if this is the currently active theme
      if (themeKey === theme) {
        setCSSVar(cssProp, `var(${primitiveCSSVar})`);
      }
    },
    [theme, setCSSVar],
  );

  // ── Google Fonts loader ────────────────────────────────────────────────

  const loadGoogleFonts = useCallback(() => {
    let url = fontUrl.trim();

    // Extract URL from <link> tag if pasted
    const hrefMatch = url.match(/href="([^"]+)"/);
    if (hrefMatch) url = hrefMatch[1];

    if (!url.includes('fonts.googleapis.com')) return;

    // Remove old link if exists
    if (fontLinkRef.current) {
      fontLinkRef.current.remove();
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
    fontLinkRef.current = link;

    // Extract family names from URL
    const familyParam = new URL(url).searchParams.get('family');
    if (familyParam) {
      const families = familyParam.split('|').map((f) => {
        return f.split(':')[0].replace(/\+/g, ' ');
      });
      setLoadedFamilies(families);
    }
  }, [fontUrl]);

  const applyHeadingFont = useCallback(
    (family: string) => {
      setHeadingFont(family);
      if (family) {
        setCSSVar('fontFamily-heading', `'${family}', sans-serif`);
      }
    },
    [setCSSVar],
  );

  const applyBodyFont = useCallback(
    (family: string) => {
      setBodyFont(family);
      if (family) {
        setCSSVar('fontFamily-body', `'${family}', sans-serif`);
        document.body.style.fontFamily = `'${family}', sans-serif`;
      }
    },
    [setCSSVar],
  );

  // ── Download tokens.json ───────────────────────────────────────────────

  const downloadTokens = useCallback(() => {
    // Rebuild the base colors object from flat state
    const rebuildNested = (
      flat: Record<string, string>,
    ): Record<string, unknown> => {
      const out: Record<string, unknown> = {};
      for (const [flatKey, val] of Object.entries(flat)) {
        const parts = flatKey.replace(/^color-/, '').split('-');
        let cursor: Record<string, unknown> = out;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!cursor[parts[i]] || typeof cursor[parts[i]] !== 'object') {
            cursor[parts[i]] = {};
          }
          cursor = cursor[parts[i]] as Record<string, unknown>;
        }
        cursor[parts[parts.length - 1]] = val;
      }
      return out;
    };

    const baseColors = rebuildNested(colors);

    // Build semantic refs from the live mapping state
    const buildSemanticRefs = (mappings: SemanticMappings) => {
      const result: Record<string, Record<string, string>> = {};
      for (const [category, tokens] of Object.entries(mappings)) {
        result[category] = {};
        for (const [token, ref] of Object.entries(tokens as Record<string, string>)) {
          result[category][token] = refToJsonRef(ref);
        }
      }
      return result;
    };

    const typo: Record<string, Record<string, Record<string, string>>> = {};
    for (const [category, sizes] of Object.entries(TYPOGRAPHY_RAMP)) {
      typo[category] = {};
      for (const [size, refs] of Object.entries(sizes)) {
        typo[category][size] = {
          fontSize: `{fontSize.${refs.fontSize}}`,
          lineHeight: `{lineHeight.${refs.lineHeight}}`,
        };
      }
    }

    const exportData = {
      color: {
        base: baseColors,
        light: buildSemanticRefs(lightMappings),
        dark: buildSemanticRefs(darkMappings),
      },
      spacing,
      borderRadius: BORDER_RADIUS,
      fontSize: fontSizes,
      fontWeight: FONT_WEIGHTS,
      lineHeight: LINE_HEIGHTS,
      fontFamily: {
        heading: headingFont
          ? `'${headingFont}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
          : "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        body: bodyFont
          ? `'${bodyFont}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
          : "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      },
      typography: typo,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tokens.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [colors, spacing, fontSizes, headingFont, bodyFont, lightMappings, darkMappings]);

  // ── Render helpers ─────────────────────────────────────────────────────

  const renderColorGrid = () => {
    const entries = Object.entries(colors);
    return (
      <div className={styles.colorGrid}>
        {entries.map(([key, hex]) => (
          <div key={key} className={styles.swatch}>
            <div
              className={styles.swatchPreview}
              style={{
                backgroundColor: hex,
                color: isValidColor(hex) ? contrastColor(hex) : '#000',
              }}
            >
              <span className={styles.swatchLabel}>--{key}</span>
            </div>
            <input
              type="color"
              value={isValidColor(hex) ? toHexForPicker(hex) : '#000000'}
              onChange={(e) => handleColorChange(key, e.target.value)}
              className={styles.colorPicker}
            />
            <input
              type="text"
              value={hex}
              onChange={(e) => handleColorChange(key, e.target.value)}
              className={styles.hexInput}
              spellCheck={false}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderSpacingScale = () => (
    <div className={styles.scaleList}>
      {Object.entries(spacing).map(([key, value]) => (
        <div key={key} className={styles.scaleRow}>
          <code className={styles.scaleLabel}>--spacing-{key}</code>
          <div
            className={styles.spacingBar}
            style={{ width: value, minWidth: 4 }}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => handleSpacingChange(key, e.target.value)}
            className={styles.scaleInput}
          />
        </div>
      ))}
    </div>
  );

  const renderFontSizes = () => (
    <div className={styles.scaleList}>
      {Object.entries(fontSizes).map(([key, value]) => (
        <div key={key} className={styles.scaleRow}>
          <code className={styles.scaleLabel}>--fontSize-{key}</code>
          <span
            className={styles.fontSample}
            style={{ fontSize: value, lineHeight: 1.2 }}
          >
            Aa
          </span>
          <input
            type="text"
            value={value}
            onChange={(e) => handleFontSizeChange(key, e.target.value)}
            className={styles.scaleInput}
          />
        </div>
      ))}
    </div>
  );

  const renderTypographyRamp = () => (
    <div className={styles.typoRamp}>
      {Object.entries(TYPOGRAPHY_RAMP).map(([category, sizes]) => (
        <div key={category} className={styles.typoCategory}>
          <h4 className={styles.typoCategoryLabel}>{category}</h4>
          {Object.entries(sizes).map(([size, refs]) => (
            <div
              key={size}
              className={styles.typoSample}
              style={{
                fontSize: `var(--fontSize-${refs.fontSize})`,
                lineHeight: `var(--lineHeight-${refs.lineHeight})`,
                fontFamily:
                  category === 'heading'
                    ? 'var(--fontFamily-heading)'
                    : 'var(--fontFamily-body)',
              }}
            >
              <span className={styles.typoSizeTag}>{size}</span>
              The quick brown fox jumps over the lazy dog
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderBorderRadius = () => (
    <div className={styles.radiusRow}>
      {Object.entries(BORDER_RADIUS).map(([key, value]) => (
        <div key={key} className={styles.radiusItem}>
          <div
            className={styles.radiusBox}
            style={{ borderRadius: value }}
          />
          <code className={styles.radiusLabel}>{key}</code>
          <span className={styles.radiusValue}>{value}</span>
        </div>
      ))}
    </div>
  );

  const renderComponentPreview = () => (
    <div className={styles.componentSection}>
      <div className={styles.componentBlock}>
        <h4>Button Variants</h4>
        <div className={styles.componentRow}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>

      <div className={styles.componentBlock}>
        <h4>Button Sizes</h4>
        <div className={styles.componentRow}>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
        </div>
      </div>

      <div className={styles.componentBlock}>
        <h4>Disabled States</h4>
        <div className={styles.componentRow}>
          <Button variant="primary" disabled>Primary</Button>
          <Button variant="secondary" disabled>Secondary</Button>
          <Button variant="ghost" disabled>Ghost</Button>
        </div>
      </div>

      <div className={styles.componentBlock}>
        <h4>Cards</h4>
        <div className={styles.cardRow}>
          <Card padding="sm">
            <h5 style={{ fontFamily: 'var(--fontFamily-heading)', fontSize: 'var(--fontSize-lg)', marginBottom: 'var(--spacing-100)' }}>Small Card</h5>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fontSize-sm)' }}>
              Using small padding tokens.
            </p>
          </Card>
          <Card padding="md">
            <h5 style={{ fontFamily: 'var(--fontFamily-heading)', fontSize: 'var(--fontSize-lg)', marginBottom: 'var(--spacing-100)' }}>Medium Card</h5>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fontSize-sm)' }}>
              Using medium padding tokens.
            </p>
          </Card>
          <Card padding="lg">
            <h5 style={{ fontFamily: 'var(--fontFamily-heading)', fontSize: 'var(--fontSize-lg)', marginBottom: 'var(--spacing-100)' }}>Large Card</h5>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fontSize-sm)' }}>
              Using large padding tokens.
            </p>
          </Card>
        </div>
      </div>

      <div className={styles.componentBlock}>
        <h4>Card with Content</h4>
        <Card padding="lg">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-400)' }}>
            <h3 style={{
              fontFamily: 'var(--fontFamily-heading)',
              fontSize: 'var(--typography-heading-md-fontSize)',
              lineHeight: 'var(--typography-heading-md-lineHeight)',
            }}>
              Design System Preview
            </h3>
            <p style={{
              fontFamily: 'var(--fontFamily-body)',
              fontSize: 'var(--typography-body-md-fontSize)',
              lineHeight: 'var(--typography-body-md-lineHeight)',
              color: 'var(--color-text-secondary)',
            }}>
              This card demonstrates your typography ramp, color tokens, and spacing
              working together. Edit any primitive value in the Foundations panel and
              watch everything update in real-time.
            </p>
            <div style={{ display: 'flex', gap: 'var(--spacing-200)' }}>
              <Button variant="primary" size="sm">Action</Button>
              <Button variant="ghost" size="sm">Cancel</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderFontTester = () => (
    <div className={styles.fontTester}>
      <div className={styles.fontInputGroup}>
        <label className={styles.fieldLabel}>Google Fonts URL or {'<link>'} tag</label>
        <div className={styles.fontUrlRow}>
          <input
            type="text"
            value={fontUrl}
            onChange={(e) => setFontUrl(e.target.value)}
            placeholder="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
            className={styles.fontUrlInput}
            spellCheck={false}
          />
          <Button variant="primary" size="sm" onClick={loadGoogleFonts}>
            Load
          </Button>
        </div>
      </div>

      {loadedFamilies.length > 0 && (
        <div className={styles.fontControls}>
          <div className={styles.fontSelectGroup}>
            <label className={styles.fieldLabel}>Heading font</label>
            <select
              value={headingFont}
              onChange={(e) => applyHeadingFont(e.target.value)}
              className={styles.fontSelect}
            >
              <option value="">Default (Inter)</option>
              {loadedFamilies.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.fontSelectGroup}>
            <label className={styles.fieldLabel}>Body font</label>
            <select
              value={bodyFont}
              onChange={(e) => applyBodyFont(e.target.value)}
              className={styles.fontSelect}
            >
              <option value="">Default (Inter)</option>
              {loadedFamilies.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className={styles.fontPreview}>
        <div style={{ fontFamily: 'var(--fontFamily-heading)' }}>
          <p style={{ fontSize: 'var(--fontSize-3xl)', lineHeight: 'var(--lineHeight-tight)', fontWeight: 'var(--fontWeight-bold)' }}>
            Heading Large
          </p>
          <p style={{ fontSize: 'var(--fontSize-2xl)', lineHeight: 'var(--lineHeight-tight)', fontWeight: 'var(--fontWeight-semibold)' }}>
            Heading Medium
          </p>
          <p style={{ fontSize: 'var(--fontSize-xl)', lineHeight: 'var(--lineHeight-tight)', fontWeight: 'var(--fontWeight-medium)' }}>
            Heading Small
          </p>
        </div>
        <div style={{ fontFamily: 'var(--fontFamily-body)', marginTop: 'var(--spacing-400)' }}>
          <p style={{ fontSize: 'var(--fontSize-lg)', lineHeight: 'var(--lineHeight-relaxed)' }}>
            Body Large &mdash; The quick brown fox jumps over the lazy dog.
          </p>
          <p style={{ fontSize: 'var(--fontSize-base)', lineHeight: 'var(--lineHeight-normal)' }}>
            Body Medium &mdash; The quick brown fox jumps over the lazy dog.
          </p>
          <p style={{ fontSize: 'var(--fontSize-sm)', lineHeight: 'var(--lineHeight-normal)' }}>
            Body Small &mdash; The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      </div>
    </div>
  );

  // ── Theme Mappings renderer ────────────────────────────────────────────

  const renderMappingCategory = (
    themeKey: 'light' | 'dark',
    category: keyof SemanticMappings,
    label: string,
    mappings: SemanticMappings,
  ) => {
    const tokens = mappings[category] as Record<string, string>;

    return (
      <div className={styles.mappingCategory}>
        <h4 className={styles.mappingCategoryLabel}>{label}</h4>
        <div className={styles.mappingList}>
          {Object.entries(tokens).map(([tokenName, currentRef]) => {
            const resolvedHex = resolveRefHex(currentRef, colors);
            return (
              <div key={tokenName} className={styles.mappingRow}>
                <div className={styles.mappingTokenInfo}>
                  <code className={styles.mappingTokenName}>
                    {category}.{tokenName}
                  </code>
                  <span
                    className={styles.mappingPreviewDot}
                    style={{ backgroundColor: resolvedHex }}
                  />
                  <span className={styles.mappingHex}>{resolvedHex}</span>
                </div>
                <div className={styles.mappingArrow}>&rarr;</div>
                <select
                  className={styles.mappingSelect}
                  value={currentRef}
                  onChange={(e) =>
                    handleMappingChange(themeKey, category, tokenName, e.target.value)
                  }
                >
                  {PRIMITIVE_OPTIONS.map((opt) => (
                    <option key={opt.ref} value={opt.ref}>
                      {opt.label} ({opt.hex})
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderThemeMappings = () => {
    const currentMappings =
      mappingThemeTab === 'light' ? lightMappings : darkMappings;

    return (
      <div className={styles.mappingsEditor}>
        {/* Light / Dark sub-tabs */}
        <div className={styles.mappingThemeTabs}>
          <button
            className={`${styles.mappingThemeTab} ${
              mappingThemeTab === 'light' ? styles.mappingThemeTabActive : ''
            }`}
            onClick={() => setMappingThemeTab('light')}
          >
            Light Theme
          </button>
          <button
            className={`${styles.mappingThemeTab} ${
              mappingThemeTab === 'dark' ? styles.mappingThemeTabActive : ''
            }`}
            onClick={() => setMappingThemeTab('dark')}
          >
            Dark Theme
          </button>
        </div>

        {/* Mapping categories */}
        <div className={styles.mappingCategories}>
          {renderMappingCategory(
            mappingThemeTab,
            'background',
            'Background Colors',
            currentMappings,
          )}
          {renderMappingCategory(
            mappingThemeTab,
            'text',
            'Text Colors',
            currentMappings,
          )}
          {renderMappingCategory(
            mappingThemeTab,
            'border',
            'Border Colors',
            currentMappings,
          )}
          {renderMappingCategory(
            mappingThemeTab,
            'accent',
            'Accent Colors',
            currentMappings,
          )}
        </div>
      </div>
    );
  };

  // ── Layout ─────────────────────────────────────────────────────────────

  return (
    <div className={styles.layout}>
      {/* Toolbar */}
      <header className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <a href="/" className={styles.backLink}>&larr; Home</a>
          <h1 className={styles.title}>Design System</h1>
        </div>
        <div className={styles.toolbarRight}>
          <Button variant="secondary" size="sm" onClick={toggleTheme}>
            {theme === 'light' ? '\u{1F319}' : '\u{2600}\u{FE0F}'} {theme}
          </Button>
          <Button variant="primary" size="sm" onClick={downloadTokens}>
            Download tokens.json
          </Button>
        </div>
      </header>

      {/* Tab bar */}
      <nav className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'foundations' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('foundations')}
        >
          Foundations
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'mappings' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('mappings')}
        >
          Theme Mappings
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'components' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('components')}
        >
          Components
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'fonts' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('fonts')}
        >
          Google Fonts
        </button>
      </nav>

      {/* Content */}
      <main className={styles.content}>
        {activeTab === 'foundations' && (
          <>
            <section className={styles.panel}>
              <h3 className={styles.panelTitle}>Colors</h3>
              <p className={styles.panelDesc}>
                Edit any primitive color. Semantic and component tokens reference
                these via <code>var()</code> and update automatically.
              </p>
              {renderColorGrid()}
            </section>

            <section className={styles.panel}>
              <h3 className={styles.panelTitle}>Spacing</h3>
              {renderSpacingScale()}
            </section>

            <section className={styles.panel}>
              <h3 className={styles.panelTitle}>Font Sizes</h3>
              {renderFontSizes()}
            </section>

            <section className={styles.panel}>
              <h3 className={styles.panelTitle}>Border Radius</h3>
              {renderBorderRadius()}
            </section>

            <section className={styles.panel}>
              <h3 className={styles.panelTitle}>Typography Ramp</h3>
              {renderTypographyRamp()}
            </section>
          </>
        )}

        {activeTab === 'mappings' && (
          <section className={styles.panel}>
            <h3 className={styles.panelTitle}>Theme Mappings</h3>
            <p className={styles.panelDesc}>
              Control which primitive color each semantic token maps to.
              Changes apply live to all components using that token.
            </p>
            {renderThemeMappings()}
          </section>
        )}

        {activeTab === 'components' && (
          <section className={styles.panel}>
            <h3 className={styles.panelTitle}>Component Preview</h3>
            <p className={styles.panelDesc}>
              Live preview of all design system components. Changes to
              Foundations and Theme Mappings update everything here in real-time.
            </p>
            {renderComponentPreview()}
          </section>
        )}

        {activeTab === 'fonts' && (
          <section className={styles.panel}>
            <h3 className={styles.panelTitle}>Google Fonts Tester</h3>
            <p className={styles.panelDesc}>
              Paste a Google Fonts URL or embed tag, load the fonts, then assign
              them to heading and body roles.
            </p>
            {renderFontTester()}
          </section>
        )}
      </main>
    </div>
  );
}
