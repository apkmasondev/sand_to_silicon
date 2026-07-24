# From Sand to Silicon — Scroll-Driven Experience

Nowoczesna, interaktywna strona www przedstawiająca proces przemiany krzemu z ziaren piasku w mikrochip/procesor, sterowana w całości ruchem przewijania (scroll-driven video scrubbing).

## Stack technologiczny

- **Framework**: React 19 + TypeScript + Vite
- **Animacje & Scroll**: GSAP 3 + ScrollTrigger
- **Stylizowanie**: CSS Variables + Custom Glassmorphism System
- **Media**: MP4 Video + WebP poster

## Uruchamianie lokalne

```bash
# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev

# Kompilacja produkcyjna
npm run build
```

## Funkcjonalności

1. **Scroll-Driven Video Scrubbing**: Film odtwarza się do przodu podczas scrollowania w dół i cofa przy scrollowaniu w górę.
2. **HTML Narrative Overlay**: Teksty etapów umieszczone jako czysty HTML nad wideo.
3. **Pasek postępu i nawigacja**: Responsywny wskaźnik postępu oraz płynna nawigacja po rozdziałach.
4. **Dostępność (a11y)**: Obsługa `prefers-reduced-motion` oraz czytników ekranu.
5. **Fallbacki**: Ładowany loader z fail-safe timeoutem i bezawaryjną obsługą błędów.
