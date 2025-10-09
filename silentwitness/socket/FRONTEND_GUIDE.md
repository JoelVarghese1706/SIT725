# Front-End Contributor Guide

This guide explains how to contribute safely to the project’s front-end.

## Folder hints
- **public/** → CSS, JS, images  
- **views/** → Templates (EJS, Pug, etc.)  
- **server.js / app.js** → Entry point for Express

## Branch names
Use short, clear names:
- `feat/ui-<feature>` – new UI feature
- `fix/ui-<issue>` – bug fix
- `docs/ui-<topic>` – documentation

Example: `feat/ui-navbar`, `fix/ui-mobile-layout`

## Commit style
Follow Conventional Commits:
- `feat(ui): add sticky header`
- `fix(ui): correct color contrast`
- `docs(ui): update readme link`

## Accessibility checklist
- [ ] Images have `alt`
- [ ] Forms have `<label>`
- [ ] Color contrast meets WCAG AA
- [ ] Focus outlines visible
- [ ] Uses semantic HTML (`header`, `nav`, `main`, `footer`)

## Testing & preview
Run locally:
```bash
npm run start
