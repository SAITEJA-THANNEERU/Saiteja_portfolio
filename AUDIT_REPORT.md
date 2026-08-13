# Portfolio Website — Engineering Audit & Repair Report

## Project Understanding

This checkpoint is a React + TypeScript + Vite portfolio with:

- React 18
- TypeScript
- Vite
- React Router
- Three.js / React Three Fiber / Drei
- GSAP + ScrollTrigger
- Lenis smooth scrolling
- Custom encrypted GLB loading with Draco
- HTML5 chess page using `chess.js` + a Web Worker engine
- OpenRouter-backed portfolio chat API
- Vercel Analytics / Speed Insights
- Static project/certification data

### Main application flow

`src/main.tsx`
→ `App.tsx`
→ React Router
→ `/` loads `LoadingProvider` + `MainContainer`
→ `MainContainer` renders navigation, landing, about, services, career, tech stack, certifications, work, CTA and contact sections
→ desktop additionally mounts the Three.js character scene.

`/myworks` renders the complete project list.

`/play` renders the chess UI and portfolio chat. Chat requests go to `/api/chat`, which calls OpenRouter server-side.

## Baseline Findings

The checkpoint was not production-build clean.

Initial TypeScript build errors:

1. `animationUtils.ts`: incorrect Three.js animation event typing.
2. `resizeUtils.ts`: unused imports and unused character parameter.
3. `GsapScroll.ts`: TypeScript control-flow narrowing made the monitor object resolve to `never`.

The checkpoint's bundled `node_modules` is also Windows-specific. On this Linux validation environment, Vite/Rollup and esbuild could not run because their Linux native optional packages were absent. This is a checkpoint packaging/environment issue, not a source-code TypeScript error.

## Repairs Made

### TypeScript / Build Safety

- Corrected Three.js animation finished-event typing.
- Removed dead imports/parameters from the resize utility.
- Fixed monitor object narrowing in GSAP code.
- Added safe screen-light handling so a missing/invalid light material cannot crash the render loop.
- Added touch-event guards for missing touch points.
- Refactored character loading to remove an async Promise executor.
- Added animation cleanup for intro listeners and delayed blink timers.
- Added character progress cleanup on load failure/unmount.
- Added cleanup for the character flicker timeline and ScrollTriggers.

### React Lifecycle / Runtime Stability

- Fixed the loading component's state updates that were being scheduled during render.
- Added cleanup for loading timers.
- Split loading context/hook from the provider to keep Fast Refresh clean.
- Added cleanup for Lenis animation frames, navigation listeners and resize listeners.
- Added cleanup for social-icon mouse listeners and animation frames.
- Added cleanup for the custom cursor listeners/animation frame.
- Added cleanup for the mobile initial animation timer.
- Added a Suspense fallback for the main lazy-loaded application.
- Added a wildcard route that returns visitors to `/` instead of rendering a blank page.

### API

- Preserved the server-side OpenRouter API-key architecture.
- Changed upstream provider failures to return a generic user-safe message instead of exposing the provider response.
- Changed unexpected API errors to return a generic public error while retaining server-side logging.

### Assets / UI Resilience

The checkpoint does not contain several assets referenced by the source:

- `/images/mypicnbg.png`
- `/images/mypic.jpeg`
- certification logos
- certification preview images
- certification PDF files

No fake personal photo or fake certificate was created.

Instead:

- missing mobile profile photo now fails gracefully instead of showing a broken image;
- chess player photo has an initials fallback;
- certification preview images have a visual fallback state.

The actual certificate files and personal photos still need to be supplied to make those links fully functional.

### CSS / UI

- Added a global `box-sizing` reset for predictable responsive sizing.
- Added consistent form-control font inheritance.
- Added a proper lazy-route loading state.
- Added small-mobile responsive refinements to the My Works page.
- Added small-mobile spacing constraints to the Play page.
- Added a styled fallback state for unavailable certificate previews.
- Preserved the existing dark/purple visual language, animations, layouts and responsive structure.

## Validation Performed

### Passed

- TypeScript project build/typecheck: `npx tsc -b`
- ESLint: `npm run lint`
- Direct ESLint validation after repairs: passed with no errors/warnings.
- Local API server startup: passed.
- `GET /api/chat`: correctly returns `405 Method Not Allowed`.
- `POST /api/chat` with missing messages: correctly returns `400`.
- Local asset-reference audit was performed.

### Blocked

Production Vite build could not be executed in this validation container because the uploaded checkpoint contains Windows-native `node_modules` binaries while the validation environment is Linux.

Observed environment error:

`Cannot find module @rollup/rollup-linux-x64-gnu`

The same platform mismatch also affects the bundled Windows esbuild binary.

The final repaired archive intentionally excludes `node_modules` and `dist`. A clean `npm install` / `npm ci` on the target development/deployment environment should install the correct platform-native packages.

## Important Remaining Issues

1. **Personal photo assets are missing.**
   Supply the intended files at:
   - `public/images/mypicnbg.png`
   - `public/images/mypic.jpeg`

2. **Certification assets are missing.**
   Supply the referenced organization logos, certificate preview images and PDFs under `public/certifications/`.

3. **Certification credential IDs are placeholders.**
   `ADD_CREDENTIAL_ID` is still present in the certification data and should be replaced with the real credential IDs.

4. **Resume button has no real resume file/link.**
   The current `RESUME` control remains a placeholder and should be connected to the actual resume when supplied.

5. **Some dependencies appear unused by the current source.**
   They were intentionally not removed because the project may rely on them for future/indirect functionality and the audit requirement was to preserve the existing architecture.

## Deliverable Packaging

The repaired archive excludes:

- `node_modules/` — platform-specific generated dependencies
- `dist/` — stale generated build output
- `.env`
- `.env.local`
- `.vercel/`

It includes:

- source code
- public assets present in the checkpoint
- package manifests and lockfile
- safe `.env.example`
- repaired configuration
- audit report
