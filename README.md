# From Sand to Silicon — Scroll-Driven Experience

Nowoczesna, interaktywna strona www przedstawiająca proces przemiany krzemu z ziaren piasku w mikrochip/procesor, sterowana w całości ruchem przewijania. Na stronie nie ma elementu `<video>` — „film” to sekwencja 240 klatek WebP rysowanych po kolei na `<canvas>` (scroll-driven frame scrubbing).

## Stack technologiczny

- **Framework**: React 19 + TypeScript + Vite 6
- **Animacje & Scroll**: GSAP 3 + ScrollTrigger (pin + scrub)
- **Renderowanie**: sekwencja obrazów WebP rysowana na HTML5 `<canvas>` (`ctx.drawImage` w `requestAnimationFrame`)
- **Stylizowanie**: CSS Variables + Custom Glassmorphism System
- **Media**: 240 klatek `public/frames/frame_000.webp` … `frame_239.webp` (ok. 14 MB łącznie)

## Uruchamianie lokalne

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

Dodatkowo `npm run lint` uruchamia samą kontrolę typów (`tsc --noEmit`), a `npm run preview` serwuje zbudowaną wersję z `dist/`.

Wdrożenie na GitHub Pages odbywa się automatycznie przez workflow `.github/workflows/deploy.yml` po pushu na `main`.

## Jak to działa

- Sekcja `.scroll-film` jest przypinana przez ScrollTrigger na dystansie **+700%** (desktop) lub **+500%** (mobile).
- Postęp przypięcia (0–1) mapuje się na indeks klatki: film osiąga ostatnią klatkę przy **88%** postępu, a pozostałe 12% to „wirtualna pauza” na gotowym procesorze, po której od 93% wyłania się karta finałowa.
- Rozdziały narracji mają dwa niezależne parametry: zakres widoczności tekstu (`from`/`to`) oraz docelową klatkę nawigacji (`frame`) — klatki 27, 71, 112, 140, 211 i 238. Oba żyją w `src/data/chapters.ts`.

## Funkcjonalności

1. **Scroll-Driven Canvas Scrubbing**: Sekwencja odtwarza się do przodu podczas scrollowania w dół i cofa przy scrollowaniu w górę — w pełni sterowana przez użytkownika.
2. **Renderowanie na canvasie**: Klatki są w całości wczytywane przed startem i rysowane bez opóźnień dekodera wideo, w trybie „cover” z uwzględnieniem `devicePixelRatio` (ograniczonego do 2×). Kosztem tego podejścia jest wstępne pobranie ok. 14 MB — stąd ekran ładowania.
3. **HTML Narrative Overlay**: Teksty etapów umieszczone jako czysty HTML nad animacją, z płynnym fade-in/fade-out.
4. **Pasek postępu i nawigacja**: Pionowy wskaźnik postępu z kropkami etapów (desktop) lub poziomy pasek (mobile) oraz nawigacja po rozdziałach z mobilnym menu drawer (Escape, pułapka fokusu, zamykanie kliknięciem w tło).
5. **Dostępność (a11y)**: Obsługa `prefers-reduced-motion` (pełna wersja tekstowa zamiast animacji), trwały region `aria-live` ogłaszający kolejne etapy, `aria-current` na aktywnych punktach nawigacji oraz `inert` na niewidocznych warstwach hero/finał.
6. **Fallbacki**: Loader z paskiem postępu (`role="progressbar"`), limit czasu ładowania oraz tekstowy tryb awaryjny, gdy nie uda się wczytać sekwencji klatek.
