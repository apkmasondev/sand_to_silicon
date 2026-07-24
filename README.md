# From Sand to Silicon — Scroll-Driven Experience

Nowoczesna, interaktywna strona www przedstawiająca proces przemiany krzemu z ziaren piasku w mikrochip/procesor, sterowana w całości ruchem przewijania (scroll-driven video scrubbing).

## Stack technologiczny

- **Framework**: React 19 + TypeScript + Vite
- **Animacje & Scroll**: GSAP 3 + ScrollTrigger
- **Wydajność**: Image Sequence + HTML5 Canvas (Apple-style 60FPS scrolling)
- **Stylizowanie**: CSS Variables + Custom Glassmorphism System
- **Media**: WebP Frame Sequence

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

1. **Scroll-Driven Canvas Scrubbing**: Animacja odtwarza się do przodu podczas scrollowania w dół i cofa przy scrollowaniu w górę — w pełni sterowana przez użytkownika.
2. **Wydajność klasy Apple**: Sekwencja 240 skompresowanych klatek WebP renderowanych natychmiastowo na elemencie `<canvas>`, co gwarantuje stałe 60 FPS nawet na telefonach.
3. **HTML Narrative Overlay**: Teksty etapów umieszczone jako czysty HTML nad animacją.
4. **Pasek postępu i nawigacja**: Responsywny wskaźnik postępu oraz płynna nawigacja po rozdziałach z mobilnym menu drawer.
5. **Dostępność (a11y)**: Obsługa `prefers-reduced-motion` oraz czytników ekranu.
6. **Fallbacki**: Loader z paskiem postępu dla wczytywania klatek WebP i fallback tekstowy przy błędach.
