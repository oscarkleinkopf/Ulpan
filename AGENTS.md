# Ulpan Hibrit

Web app (Spanish UI) para aprender hebreo desde cero. See `README.md` for the product overview.

## Cursor Cloud specific instructions

Single service: a static client-side SPA. There is no backend, database, or auth — user progress is stored in the browser's `localStorage` and pronunciation uses the browser Web Speech API (unavailable in headless/CI, so audio can't be verified without a real browser).

- Stack: `Vite 8` + `React 19` + `react-router-dom` + `TypeScript`, linted with `oxlint`. The Netlify Vite plugin only emulates Netlify features locally; nothing server-side is currently used.
- Node: requires `>= 22.12` (Vite 8). The VM default Node satisfies this.
- Commands are defined in `package.json` `scripts`: `npm run dev` (Vite dev server on port 5173), `npm run build` (`tsc -b && vite build`, output to `dist/`), `npm run lint` (`oxlint`; prints nothing on success), `npm run preview` (serve the production build).
- `npm run dev` does not auto-open a browser and binds to localhost only; pass `-- --host` to expose it on the network if needed.
