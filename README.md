# DSRT AI Website — TypeScript + Node.js

The existing website is migrated to a TypeScript-based build workflow while preserving its HTML markup, CSS, images, page structure, and visual design.

## Requirements
- Node.js 20+
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (usually http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```
The production output is generated in `dist/`.

## Migration details
- Inline browser JavaScript from the HTML pages has been moved into TypeScript files under `src/legacy/pages/`.
- Shared motion scripts are now TypeScript under `src/legacy/assets/js/`.
- TypeScript compiles to classic browser JavaScript, preserving the original script order and global-script behavior.
- Vite provides the Node.js-powered development server and multi-page build.
- Original HTML, CSS, images, icons, page names, and relative asset structure are retained.

## Note
HTML and CSS remain HTML and CSS because they define the page structure and design. TypeScript handles the browser logic, while Node.js tooling handles development and builds. This avoids an unnecessary framework rewrite and protects the existing design.
