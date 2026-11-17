import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readdirSync, statSync } from 'node:fs';

function htmlEntries(dir: string, base = dir): Record<string, string> {
  const entries: Record<string, string> = {};
  for (const name of readdirSync(dir)) {
    const full = resolve(dir, name);
    if (statSync(full).isDirectory()) Object.assign(entries, htmlEntries(full, base));
    else if (name.toLowerCase().endsWith('.html')) {
      const key = full.slice(base.length + 1).replace(/\\/g, '/').replace(/\.html$/i, '');
      entries[key] = full;
    }
  }
  return entries;
}

export default defineConfig({
  root: 'public',
  publicDir: false,
  build: { outDir: '../dist', emptyOutDir: true,
    rollupOptions: { input: htmlEntries(resolve('public')) } }
});
