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

2. **Wydajność klasy Apple**: Rozbicie wideo na sekwencję 240 skompresowanych klatek WebP renderowanych natychmiastowo na elemencie `<canvas>`, co gwarantuje stałe 60 FPS (nawet na telefonach), ponieważ dekompresja WebP i rysowanie na canvasie jest sprzętowo akcelerowane i nie wymaga uruchamiania dekodera wideo.
3. **HTML Narrative Overlay**: Teksty etapów umieszczone jako czysty HTML nad animacją.
4. **Pasek postępu i nawigacja**: Responsywny wskaźnik postępu oraz płynna nawigacja po rozdziałach (teraz także ukryte mobilne menu typu drawer).
5. **Dostępność (a11y)**: Obsługa `prefers-reduced-motion` oraz czytników ekranu.
6. **Fallbacki**: Ładowany loader z paskiem postępu dla wczytywania klatek WebP.
