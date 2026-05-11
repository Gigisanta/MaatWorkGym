/**
 * CSS Variable Generator
 * Generates CSS variables from design tokens
 * Run: npx tsx scripts/generate-css-variables.ts
 */

import { tokens } from '../src/design-system/tokens';
import fs from 'fs';
import path from 'path';

const outputPath = path.join(process.cwd(), 'src/design-system/generated.css');

function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function generateCssVariables(): string {
  const lines: string[] = [
    '/* Auto-generated CSS variables from design tokens */',
    '/* Do not edit manually - run: npx tsx scripts/generate-css-variables.ts */',
    '',
    ':root {',
  ];

  // Colors
  lines.push('  /* Colors */');
  for (const [key, value] of Object.entries(tokens.colors)) {
    if (typeof value === 'string') {
      lines.push(`  --color-${toKebabCase(key)}: ${value};`);
    } else if (typeof value === 'object') {
      lines.push(`  /* ${key} */`);
      for (const [subKey, subValue] of Object.entries(value)) {
        if (typeof subValue === 'string') {
          lines.push(`  --color-${toKebabCase(key)}-${toKebabCase(subKey)}: ${subValue};`);
        }
      }
    }
  }

  lines.push('');
  lines.push('  /* Typography */');
  lines.push(`  --font-heading: ${tokens.typography.fontHeading};`);
  lines.push(`  --font-body: ${tokens.typography.fontBody};`);
  lines.push(`  --font-mono: ${tokens.typography.fontMono};`);

  lines.push('');
  lines.push('  /* Spacing */');
  for (const [key, value] of Object.entries(tokens.spacing)) {
    lines.push(`  --spacing-${key}: ${value}px;`);
  }

  lines.push('');
  lines.push('  /* Border Radius */');
  for (const [key, value] of Object.entries(tokens.radius)) {
    lines.push(`  --radius-${key}: ${value}px;`);
  }

  lines.push('');
  lines.push('  /* Shadows */');
  for (const [key, value] of Object.entries(tokens.shadows)) {
    lines.push(`  --shadow-${key}: ${value};`);
  }

  lines.push('');
  lines.push('  /* Z-Index */');
  for (const [key, value] of Object.entries(tokens.zIndex)) {
    lines.push(`  --zindex-${key}: ${value};`);
  }

  lines.push('}');
  lines.push('');
  lines.push('.dark {');

  // Dark mode overrides (same values for now, can be customized)
  for (const [key, value] of Object.entries(tokens.colors)) {
    if (typeof value === 'string' && key.startsWith('bg')) {
      lines.push(`  --color-${toKebabCase(key)}: ${value};`);
    }
  }

  lines.push('}');

  return lines.join('\n');
}

const css = generateCssVariables();
fs.writeFileSync(outputPath, css, 'utf-8');
console.log(`Generated CSS variables: ${outputPath}`);