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

### Performance & Architecture Update (Metoda Apple)
- Migracja z elementu `<video>` na **Image Sequence + `<canvas>`** dla natychmiastowej responsywności scrollowania (gwarantowane stałe 60 FPS na urządzeniach mobilnych, z pominięciem natywnych opóźnień dekodera wideo).
- Wygenerowano 240 wysoce skompresowanych klatek `.webp` (całkowity koszt ładowania to tylko ok. 10 MB z bardzo szybką transmisją).
- Wdrożono `useImageSequencePreloader.ts` do wstępnego wczytania wszystkich klatek przed rozpoczęciem animacji (z licznikiem postępu w procentach na ekranie ładowania).
- Zoptymalizowano `ScrollFilm.tsx` z użyciem `requestAnimationFrame` i `ctx.drawImage` dla ultra-płynnego renderowania.
- Usunięto błędy ScrollTriggera resetującego scroll podczas renderowania dzięki wyizolowaniu pętli Canvas z cyklu życia Reacta (zastosowano `useRef` dla `scrollProgress`).

### Design & Typography Polish
- **Dwutonowa sekcja Hero**: Tytuł `FROM SAND TO SILICON` zyskał piaskowo-bursztynowy gradient (`SAND`) oraz lśniący, złoto-miedziany gradient (`SILICON`), eliminując monolityczną biel.
- **Dopracowane etapy pośrednie (01-06)**: Dodano wyróżnienia słów kluczowych złotym gradientem (`piasku`, `oczyszczony`, `gładka płytka`, `Światło`, `mikrochip`, `procesor`), ujednolicono świecącą kropkę `•` we wszystkich nagłówkach oraz dostosowano interlinię i tracking.
- **Ekran finałowy**: Dodano podtytuł narrative, spójną świecącą kropkę oraz wyróżnienie frazy `współczesny świat.` w złocistej tonacji.
- **Czystość palety barw & paska postępu**: Wycofano chłodny niebieski akcent (`--accent-cool`), zastępując gradient `ProgressRail` ciepłym złoto-miedzianym odcieniem z poświatą (`#F5D799` → `#D7A75A` → `#B88432`). Usunięto nieużywane zmienne z `globals.css`.
