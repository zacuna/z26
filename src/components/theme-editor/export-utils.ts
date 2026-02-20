/**
 * Export current theme token values as JSON or CSS snippet.
 * Used by Theme Editor "Export" button — no file system, just string output.
 */

export interface ExportFormat {
  json: (vars: Record<string, string>) => string;
  css: (vars: Record<string, string>) => string;
}

export function exportAsJson(vars: Record<string, string>): string {
  return JSON.stringify(vars, null, 2);
}

export function exportAsCss(vars: Record<string, string>): string {
  const lines = Object.entries(vars).map(
    ([key, value]) => `  ${key}: ${value};`
  );
  return `:root {\n${lines.join("\n")}\n}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
