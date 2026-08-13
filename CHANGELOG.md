# CHANGELOG — Portfolio Checkpoint Repair

1. Fixed
   - Three.js animation event typing.
   - GSAP monitor TypeScript narrowing.
   - Resize utility unused imports/parameter.
   - Character loader async Promise anti-pattern.

2. Runtime stability
   - Fixed render-time loading timers.
   - Added cleanup for Lenis, cursor, social icon and animation-frame listeners.
   - Added character animation/timeline cleanup.
   - Added loading-progress cleanup on failure/unmount.
   - Added safe screen-light handling.

3. Routing
   - Added main Suspense fallback.
   - Added wildcard route fallback to the home page.

4. API
   - Kept OpenRouter key server-side.
   - Sanitized provider and unexpected server errors returned to clients.

5. CSS/UI
   - Added global box sizing.
   - Added responsive small-mobile refinements.
   - Added route-loading styling.
   - Added missing-certificate preview fallback.
   - Added chess avatar fallback.

6. Configuration
   - Added safe `.env.example`.
   - Removed secrets and generated/platform-specific artifacts from the deliverable archive.

7. Remaining
   - Personal photo assets are missing from the checkpoint.
   - Certification images/logos/PDFs are missing.
   - Certification credential IDs still use placeholders.
   - Resume link remains to be connected.
