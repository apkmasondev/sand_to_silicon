# Dziennik zmian (Changelog)

Wszystkie istotne zmiany wprowadzone w projekcie będą dokumentowane w tym pliku.

## [1.0.1] - 2026-08-09

Audyt kodu i poprawności działania (GSAP/ScrollTrigger, canvas, ładowanie klatek, a11y, RWD).

### 🐛 Poprawki błędów
- **Dziura i nakładka w zakresach rozdziałów**: dostrajanie punktów nawigacji do klatek wideo rozjechało zakresy narracji — między 57% a 69% postępu nie pojawiał się żaden tekst, a w przedziale 83,5–86,6% dwa rozdziały były aktywne jednocześnie (tekst „06 — PROCESOR” wskakiwał potem skokowo, z pominięciem fade-inu, a na pasku postępu świeciły dwie kropki). Punkty nawigacji przeniesiono do osobnego pola `frame`, dzięki czemu zakresy `from`/`to` są znów ciągłe i rozłączne. Docelowe klatki (27, 71, 112, 140, 211, 238) pozostały bez zmian.
- **Kropki na pasku postępu w złym miejscu**: markery były rozłożone równomiernie (`space-between`) *pod* torem paska, zamiast leżeć na nim w pozycji odpowiadającej etapowi. Teraz każda kropka stoi dokładnie tam, dokąd prowadzi.
- **ScrollTrigger nie sprzątał po sobie**: `trigger.kill()` bez `revert` zostawiał w DOM spacer pinowania i style sekcji — zamieniono na `kill(true)`.
- **Podwójne przeliczanie przy zmianie rozmiaru**: ręczny listener wołał `ScrollTrigger.refresh()`, mimo że ScrollTrigger sam odświeża się przy `resize`; przerysowanie canvasu podpięto do zdarzenia `refresh`, a osobny, ograniczony do `requestAnimationFrame` listener obsługuje wyłącznie skalowanie bufora.
- **Przeciek pamięci w preloaderze**: przy odmontowaniu 240 obrazów zostawało z aktywnymi handlerami i trwającymi pobraniami; teraz handlery są odpinane, a niedokończone żądania przerywane.
- **Loader mógł kręcić się w nieskończoność**: jeśli któreś żądanie nigdy nie zwróciło `load` ani `error`, warunek zakończenia nie był spełniany. Dodano limit 30 s i weryfikację `naturalWidth` (obraz „complete”, ale pusty, nie liczy się już jako wczytany).
- **Niedziałający fokus w mobilnym drawerze**: `transition: all` rozciągało w czasie zmianę `visibility`, przez co pierwszy przycisk menu był przez ~0,3 s niefokusowalny; przejścia ograniczono do właściwości wizualnych.
- **Karta finału nie osiągała pełnej nieprzezroczystości** (0,9938 zamiast 1) i pozostawała w kolejności Tab, mimo że była niewidoczna.
- **Proporcje klatki liczone z `img.width`** z fallbackiem 1280×720 — zamieniono na `naturalWidth`/`naturalHeight`.

### ♿ Dostępność
- Trwały region `aria-live` w `ScrollFilm` ogłasza kolejne etapy (poprzednio region powstawał razem z treścią, więc czytniki go nie odczytywały); z widocznej narracji usunięto duplikujące `aria-live`.
- Mobilny drawer: `aria-controls`, zamykanie klawiszem Escape z powrotem fokusu na hamburger, pułapka fokusu dla Tab/Shift+Tab, zamykanie kliknięciem w tło oraz `touch-action: none` blokujące przewijanie filmu pod nakładką.
- Niewidoczne warstwy hero i finału oznaczone `inert`, kropki paska postępu dostały `aria-current`.
- Loader: prawdziwy `role="progressbar"` z `aria-valuenow` i widocznym paskiem postępu.
- Globalne zabezpieczenie `@media (prefers-reduced-motion: reduce)` wyłączające animacje i przejścia.

### ⚡ Wydajność
- Kwantyzacja postępu (0,001) ogranicza przerysowania drzewa Reacta przy każdym ticku ScrollTriggera.
- `devicePixelRatio` ograniczony do 2× i bufor canvasu przypisywany tylko przy realnej zmianie rozmiaru.
- Podpowiedzi kolejności ładowania: pierwsze 16 klatek z `fetchPriority: high`, reszta `low`, wszystkie z `decoding: async`.
- Ścieżki klatek budowane z `import.meta.env.BASE_URL` (poprawne działanie pod dowolnym `base`).

### 📄 Dokumentacja
- README doprowadzone do zgodności z kodem: brak elementu `<video>`, realny rozmiar sekwencji (~14 MB, nie 10 MB), opis mechaniki 88%/12%, rozdzielenie zakresów narracji od klatek nawigacji, `npm run lint`, wdrożenie na GitHub Pages.

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
- **Stonowany nagłówek Hero (Apple Pro)**: Tytuł `FROM SAND TO SILICON` zyskał szlachetny, szampański krem dla słowa `SAND` oraz przydymioną miedź dla `SILICON` (zamiast jaskrawej żółci), zapewniając doskonały kontrast na tle ziaren kwarcu.
- **Wyróżnienie słów kluczowych (01-06)**: Wyznaczono najważniejsze słowa w nagłówkach etapów (`piasku`, `oczyszczony`, `gładka płytka`, `Światło`, `mikrochip`, `procesor`), ujednolicono świecącą kropkę `•` oraz dostosowano interlinię i tracking.
- **Ekran finałowy**: Dodano spójny podtytuł narracyjny, świecącą kropkę, nagłówek `FINAŁ — PROCESOR GOTOWY` (eliminujący duplikację numerka 06) oraz złociste wyróżnienie słów `współczesny świat.`.
- **Płynna animacja narracji (Fade In / Fade Out)**: Zamiast skokowej podmiany tekstów, dodano matematycznie obliczane łagodne wyłanianie się tekstu z dołu (`opacity 0→1`, `translateY +18px→0`) przy wejściu oraz zanikanie w górę (`opacity 1→0`, `translateY 0→-18px`) przy wyjściu z każdego rozdziału.
- **Wirtualna pauza i przesunięcie finału**: Animacja wideo osiąga swoją finałową klatkę przy 88% scrolla i zostaje zamrożona na kolejne 12% dystansu. Daje to czysty, beztekstowy oddech (91–93%), po którym od 93% łagodnie wyłania się karta finałowa `FINAŁ — PROCESOR GOTOWY`.
- **Precyzyjna synchronizacja klatek na osi nawigacji**: Dostosowano zakresy rozdziałów i punkty nawigacyjne na `ProgressRail` oraz w `Navbar` do wyznaczonych klatek wideo: Surowiec (Klatka 27, powiązany z przyciskiem Proces), Oczyszczanie (Klatka 71), Wafer (Klatka 112), Wzór (Klatka 140), Tranzystory (Klatka 211) oraz Procesor (Klatka 238).
