# Dziennik zmian (Changelog)

Wszystkie istotne zmiany wprowadzone w projekcie będą dokumentowane w tym pliku.

## [1.0.0] - 2026-07-24

### 🚀 Architektura i funkcjonalności bazowe
- Zainicjalizowano projekt w stosie **React 19 + TypeScript + Vite** z integracją **GSAP ScrollTrigger**.
- Zbudowano główny komponent `ScrollFilm.tsx` obsługujący interaktywne odtwarzanie sterowane ruchem przewijania.
- Dodano komponent `ChapterOverlay.tsx` prezentujący 6 polskich etapów narracyjnych od surowego piasku do gotowego procesora.
- Stworzono responsywny wskaźnik postępu `ProgressRail.tsx` z kropkami sekcji oraz płynny nagłówek `Navbar.tsx` z mobilnym drawerem.
- Dodano przycisk `ReplayButton.tsx` umożliwiający ponowne odtworzenie całej historii z poziomu finału.
- Wdrożono obsługę dostępności (a11y): ulepszono wsparcie czytników ekranu oraz dodano `ReducedMotionFallback.tsx` dla ustawień `prefers-reduced-motion`.
- Dodano mechanizmy bezpiecznego ładowania `ExperienceLoader.tsx` oraz awaryjny tryb tekstowy `VideoErrorFallback.tsx`.
- Skonfigurowano SVG Favicon, Open Graph oraz karty Twitter w `index.html`.

### ⚡ Optymalizacja wydajności (Metoda Apple 60 FPS)
- Przeprowadzono migrację z elementu `<video>` na układ **Sekwencja obrazów WebP + HTML5 `<canvas>`**, co gwarantuje stałe 60 FPS na wszystkich urządzeniach mobilnych (z pominięciem natywnych opóźnień dekodera wideo).
- Wygenerowano sekwencję 240 skompresowanych klatek `.webp` (całkowity rozmiar ok. 10 MB).
- Dodano hook `useImageSequencePreloader.ts` do płynnego wstępnego ładowania klatek z procentowym wskaźnikiem postępu.
- Zoptymalizowano renderowanie na płótnie `<canvas>` z wykorzystaniem `requestAnimationFrame`, `ctx.drawImage` oraz dopasowaniem proporcji klatek (cover fill).
- Naprawiono błąd zamykania i odnawiania ScrollTriggera przy odświeżaniu renderowania dzięki wyizolowaniu postępu do `useRef`.

### 🎨 Design, typografia i spójność wizualna
- **Dwutonowy nagłówek Hero**: Tytuł `FROM SAND TO SILICON` otrzymał ciepły, piaskowo-bursztynowy gradient dla słowa `SAND` oraz lśniący, złoto-miedziany gradient dla słowa `SILICON`.
- **Wyróżnienie słów kluczowych (01-06)**: Wyznaczono najważniejsze słowa w nagłówkach etapów (`piasku`, `oczyszczony`, `gładka płytka`, `Światło`, `mikrochip`, `procesor`), ujednolicono świecącą kropkę `•` oraz dostosowano interlinię i tracking.
- **Ekran finałowy**: Dodano spójny podtytuł narracyjny, świecącą kropkę oraz złociste wyróżnienie słów `współczesny świat.`.
- **Harmonizacja palety barw**: Zastąpiono dawny niebieski akcent w `ProgressRail` ciepłym, złoto-miedzianym gradientem z poświatą (`#F5D799` → `#D7A75A` → `#B88432`). Usunięto nieużywane zmienne z `globals.css`.
