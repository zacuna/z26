#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Transforms design tokens JSON to CSS custom properties
 * Handles token references like {color.base.white}
 */

function resolveTokenReferences(value, tokens) {
  if (typeof value !== 'string') return value;
  
  const referenceRegex = /\{([^}]+)\}/g;
  let resolved = value;
  let match;
  
  while ((match = referenceRegex.exec(value)) !== null) {
    const path = match[1].split('.');
    let tokenValue = tokens;
    
    for (const key of path) {
      tokenValue = tokenValue?.[key];
    }
    
    if (tokenValue && typeof tokenValue === 'string') {
      resolved = resolved.replace(match[0], tokenValue);
    }
  }
  
  // Recursively resolve if there are still references
  if (resolved !== value && referenceRegex.test(resolved)) {
    return resolveTokenReferences(resolved, tokens);
  }
  
  return resolved;
}

function flattenTokens(obj, prefix = '', tokens) {
  let result = {};
  
  for (const key in obj) {
    const value = obj[key];
    const newPrefix = prefix ? `${prefix}-${key}` : key;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenTokens(value, newPrefix, tokens));
    } else {
      const resolved = resolveTokenReferences(value, tokens);
      result[newPrefix] = resolved;
    }
  }
  
  return result;
}

function generateCSS(tokens) {
  let css = '/* Auto-generated from tokens/tokens.json - DO NOT EDIT MANUALLY */\n\n';
  
  // Generate base tokens (always available)
  css += ':root {\n';
  const baseTokens = flattenTokens({ 
    spacing: tokens.spacing,
    borderRadius: tokens.borderRadius,
    fontSize: tokens.fontSize,
    fontWeight: tokens.fontWeight,
    lineHeight: tokens.lineHeight,
    color: tokens.color.base
  }, '', tokens);
  
  for (const [key, value] of Object.entries(baseTokens)) {
    css += `  --${key}: ${value};\n`;
  }
  css += '}\n\n';
  
  // Generate light theme (default)
  css += ':root {\n';
  const lightTokens = flattenTokens({ color: tokens.color.light }, '', tokens);
  for (const [key, value] of Object.entries(lightTokens)) {
    css += `  --${key}: ${value};\n`;
  }
  css += '}\n\n';
  
  // Generate dark theme
  css += '[data-theme="dark"] {\n';
  const darkTokens = flattenTokens({ color: tokens.color.dark }, '', tokens);
  for (const [key, value] of Object.entries(darkTokens)) {
    css += `  --${key}: ${value};\n`;
  }
  css += '}\n';
  
  return css;
}

// Main execution
const tokensPath = path.join(__dirname, '../tokens/tokens.json');
const outputPath = path.join(__dirname, '../src/styles/tokens.css');

try {
  const tokensJson = fs.readFileSync(tokensPath, 'utf8');
  const tokens = JSON.parse(tokensJson);
  
  const css = generateCSS(tokens);
  
  // Ensure output directory exists
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
