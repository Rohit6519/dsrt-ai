import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import {
  readdirSync,
  statSync,
  cpSync,
  existsSync,
  mkdirSync
} from 'node:fs';

function htmlEntries(dir: string, base = dir): Record<string, string> {
  const entries: Record<string, string> = {};

  for (const name of readdirSync(dir)) {
    const full = resolve(dir, name);

    if (statSync(full).isDirectory()) {
      Object.assign(entries, htmlEntries(full, base));
    } else if (name.toLowerCase().endsWith('.html')) {
      const key = full.slice(base.length + 1)
        .replace(/\\/g, '/')
        .replace(/\.html$/i, '');

      entries[key] = full;
    }
  }

  return entries;
}

export default defineConfig({
  root: 'public',
  publicDir: false,

  plugins: [
    {
      name: 'copy-compiled-files',
      closeBundle() {
        const source = resolve('public/compiled');
        const destination = resolve('dist/compiled');

        if (existsSync(source)) {
          mkdirSync(resolve('dist'), { recursive: true });
          cpSync(source, destination, { recursive: true });
          console.log('Compiled JavaScript copied to dist/compiled');
        }
      }
    }
  ],

  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: htmlEntries(resolve('public'))
    }
  }
});