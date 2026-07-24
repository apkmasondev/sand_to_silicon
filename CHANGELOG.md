# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-07-24

### Added
- Created `AGENTS.md` and `.agents/AGENTS.md` containing project goals, rules, and priorities for the AI agent.
- Created React 19 + Vite + TypeScript application with GSAP ScrollTrigger integration.
- Implemented `ScrollFilm.tsx` component driving video `currentTime` via scroll scrubbing.
- Added `ChapterOverlay.tsx` with 6 interactive Polish narrative stages from raw sand to completed processor.
- Implemented `ProgressRail.tsx` responsive progress bar with section dots.
- Added `Navbar.tsx` header with quick section navigation.
- Created `ReplayButton.tsx` finale card action scrolling back to start.
- Implemented accessibility support for `prefers-reduced-motion` via `useReducedMotion.ts` and `ReducedMotionFallback.tsx`.
- Added `VideoErrorFallback.tsx` and `ExperienceLoader.tsx` for robust state handling.
- Added SVG Favicon, Open Graph, and Twitter Cards to `index.html`.

### Improved & Audited
- Preserved both `sand-to-silicon-master.mp4` (original source) and `sand-to-silicon-scrub.mp4` (GOP=1 optimized scrub file).
- Implemented frame quantization at 24 FPS in `ScrollFilm.tsx` to round `currentTime` to discrete frame timestamps (`frame / 24`) and debounce redundant seek operations.
- Safe clamping of `currentTime` to `[0.001s, duration - 0.01s]` preventing EOF black screen stutter.
- Added dynamic window `resize` handler for GSAP `ScrollTrigger.refresh()`.
- Tuned GSAP ScrollTrigger `scrub: 0.15` for optimal balance between immediate response and smooth motion.
- Set exact target frame 24 (`progress: 24 / 239`, 1.02s) for the "Proces" navbar button.
- Upgraded initial Hero screen styling with radial dark backdrop glow and glassmorphic contrast.
- Redesigned finale screen to be completely non-blocking, revealing the central processor with a premium glassmorphism action button.
- Verified mobile responsiveness at 375x812 viewport (top progress bar, fluid text scaling, zero horizontal overflow).
- Conducted full audit: zero TypeScript/Vite compilation warnings, zero browser console errors.
