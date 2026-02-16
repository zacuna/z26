#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Transforms design tokens JSON to CSS custom properties.
 *
 * Three-tier output:
 *   1. Primitives  – raw values       (--color-black: #000000)
 *   2. Semantic    – var() references  (--color-background-primary: var(--color-white))
 *   3. Typography  – var() references  (--typography-heading-lg-fontSize: var(--fontSize-3xl))
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert a dotted token path (e.g. "color.base.gray.50") to the CSS custom
 * property name that the primitive layer would produce.
 *
 * "color.base.gray.50"  →  "color-gray-50"   (strip "base" – it's a namespace)
 * "fontSize.3xl"        →  "fontSize-3xl"
 * "lineHeight.tight"    →  "lineHeight-tight"
 */
function tokenPathToCSSVar(refPath) {
  const parts = refPath.split('.');

  // Strip the "base" segment that only exists as a JSON namespace for colors
  if (parts[0] === 'color' && parts[1] === 'base') {
    return `--color-${parts.slice(2).join('-')}`;
  }

  return `--${parts.join('-')}`;
}

/**
 * Given a token value string that may contain references like {color.base.blue.500},
 * return a var() expression pointing at the primitive CSS variable.
 *
 * If the entire value is a single reference, return var(--…).
 * If there are no references, return the raw value unchanged.
 */
function referenceToVar(value) {
  if (typeof value !== 'string') return value;

  const refRegex = /^\{([^}]+)\}$/;
  const match = value.match(refRegex);
  if (match) {
    return `var(${tokenPathToCSSVar(match[1])})`;
  }

  // No reference – return raw value
  return value;
}

/**
 * Flatten an object tree into { 'prefix-key': value } pairs.
 * Leaf values are kept as-is (no resolution).
 */
function flatten(obj, prefix = '') {
  const result = {};

  for (const key of Object.keys(obj)) {
    const val = obj[key];
    const prop = prefix ? `${prefix}-${key}` : key;

    if (val && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(result, flatten(val, prop));
    } else {
      result[prop] = val;
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// CSS Generation
// ---------------------------------------------------------------------------

function generateCSS(tokens) {
  let css = '/* Auto-generated from tokens/tokens.json — DO NOT EDIT MANUALLY */\n\n';

  // ── 1. Primitive tokens (raw values) ──────────────────────────────────
  css += '/* ── Primitive tokens ─────────────────────────────────────── */\n';
  css += ':root {\n';

  const primitives = flatten({
    spacing: tokens.spacing,
    borderRadius: tokens.borderRadius,
    fontSize: tokens.fontSize,
    fontWeight: tokens.fontWeight,
    lineHeight: tokens.lineHeight,
    fontFamily: tokens.fontFamily,
    color: tokens.color.base,        // base colors are primitives
    shadow: tokens.shadow,
    zIndex: tokens.zIndex,
    transition: tokens.transition,
    size: tokens.size,
  });

  for (const [key, value] of Object.entries(primitives)) {
    css += `  --${key}: ${value};\n`;
  }

  css += '}\n\n';

  // ── 2. Semantic tokens – light theme (default) ────────────────────────
  css += '/* ── Semantic tokens · light (default) ─────────────────────── */\n';
  css += ':root {\n';

  const lightFlat = flatten({ color: tokens.color.light });
  for (const [key, rawValue] of Object.entries(lightFlat)) {
    css += `  --${key}: ${referenceToVar(rawValue)};\n`;
  }

  css += '}\n\n';

  // ── 3. Semantic tokens – dark theme ───────────────────────────────────
  css += '/* ── Semantic tokens · dark ────────────────────────────────── */\n';
  css += '[data-theme="dark"] {\n';

  const darkFlat = flatten({ color: tokens.color.dark });
  for (const [key, rawValue] of Object.entries(darkFlat)) {
    css += `  --${key}: ${referenceToVar(rawValue)};\n`;
  }

  css += '}\n\n';

  // ── 4. Typography composite tokens ────────────────────────────────────
  if (tokens.typography) {
    css += '/* ── Typography tokens ────────────────────────────────────── */\n';
    css += ':root {\n';

    const typoFlat = flatten({ typography: tokens.typography });
    for (const [key, rawValue] of Object.entries(typoFlat)) {
      css += `  --${key}: ${referenceToVar(rawValue)};\n`;
    }

    css += '}\n';
  }

  return css;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const tokensPath = path.join(__dirname, '../tokens/tokens.json');
const outputPath = path.join(__dirname, '../src/styles/tokens.css');

try {
  const tokensJson = fs.readFileSync(tokensPath, 'utf8');
  const tokens = JSON.parse(tokensJson);

  const css = generateCSS(tokens);

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, css);
  console.log('✅ Tokens successfully transformed to CSS');
  console.log(`📄 Output: ${outputPath}`);
} catch (error) {
  console.error('❌ Error transforming tokens:', error.message);
  process.exit(1);
}
