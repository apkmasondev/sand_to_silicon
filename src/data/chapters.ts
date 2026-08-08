/** Liczba klatek sekwencji WebP w `public/frames` (frame_000 … frame_239). */
export const FRAME_COUNT = 240;

/**
 * Film osiąga ostatnią klatkę przy 88% dystansu scrolla — pozostałe 12%
 * to wirtualna pauza (zamrożona ostatnia klatka) przed kartą finałową.
 */
export const FILM_SCROLL_RATIO = 0.88;

/** Zamienia indeks klatki (0 … FRAME_COUNT-1) na postęp scrolla (0 … 1). */
export function frameToProgress(frame: number): number {
  return (frame / (FRAME_COUNT - 1)) * FILM_SCROLL_RATIO;
}

export interface Chapter {
  id: string;
  /** Klatka docelowa nawigacji (ProgressRail / Navbar). */
  frame: number;
  /** Początek zakresu widoczności tekstu rozdziału (progress 0.0–1.0). */
  from: number;
  /** Koniec zakresu widoczności tekstu rozdziału (progress 0.0–1.0). */
  to: number;
  eyebrow: string;
  titleBefore?: string;
  highlight: string;
  titleAfter?: string;
  description: string;
}

/**
 * Zakresy `from`/`to` sterują wyłącznie widocznością tekstu i muszą pozostać
 * ciągłe oraz rozłączne — inaczej narracja znika (dziura) albo dwa rozdziały
 * są aktywne jednocześnie. Punkty nawigacji trzyma osobne pole `frame`,
 * dzięki czemu dostrajanie klatek nie rozjeżdża już zakresów narracji.
 */
export const chapters: Chapter[] = [
  {
    id: "sand",
    frame: 27,
    from: 0.04,
    to: 0.1588,
    eyebrow: "01 — SUROWIEC",
    titleBefore: "Wszystko zaczyna się od ",
    highlight: "piasku.",
    description: "Krzem występuje w minerałach otaczających nas każdego dnia. To pierwszy krok w drodze do zaawansowanej mikroelektroniki."
  },
  {
    id: "purification",
    frame: 71,
    from: 0.1588,
    to: 0.3640,
    eyebrow: "02 — OCZYSZCZANIE",
    titleBefore: "Krzem zostaje ",
    highlight: "oczyszczony.",
    description: "Materiał musi osiągnąć niezwykle wysoką czystość chemiczną, zanim stanie się podstawą nowoczesnego mikrochipa."
  },
  {
    id: "wafer",
    frame: 112,
    from: 0.3640,
    to: 0.4608,
    eyebrow: "03 — WAFER",
    titleBefore: "Powstaje idealnie ",
    highlight: "gładka płytka.",
    description: "Monokryształ krzemu jest precyzyjnie cięty na cienkie plastry i polerowany do uzyskania niemal lustrzanej powierzchni."
  },
  {
    id: "pattern",
    frame: 140,
    from: 0.4608,
    to: 0.6880,
    eyebrow: "04 — WZÓR",
    highlight: "Światło ",
    titleAfter: "zapisuje strukturę układu.",
    description: "Metodą fotolitografii niezwykle precyzyjny wzór wyznacza miejsca mikroskopijnych tranzystorów i ścieżek prądowych."
  },
  {
    id: "transistors",
    frame: 211,
    from: 0.6880,
    to: 0.8350,
    eyebrow: "05 — TRANZYSTORY",
    titleBefore: "Warstwa po warstwie powstaje ",
    highlight: "mikrochip.",
    description: "Miliardy miniaturowych przełączników układają się w przestrzenną sieć połączeń o nanometrowej dokładności."
  },
  {
    id: "processor",
    frame: 238,
    from: 0.8350,
    to: 0.9150,
    eyebrow: "06 — PROCESOR",
    titleBefore: "Z piasku powstaje ",
    highlight: "procesor.",
    description: "Gotowy układ półprzewodnikowy trafia do urządzeń technologicznych, które napędzają nasz cyfrowy świat."
  }
];

/** Postęp scrolla, do którego prowadzi nawigacja danego rozdziału. */
export function chapterNavProgress(chapter: Chapter): number {
  return frameToProgress(chapter.frame);
}

/**
 * Jedno źródło prawdy o aktywnym rozdziale — używane zarówno przez narrację,
 * jak i przez pasek postępu, żeby oba widoki nie mogły się rozjechać.
 * Zwraca -1, gdy postęp jest poza zakresami rozdziałów (hero / finał).
 */
export function getActiveChapterIndex(list: Chapter[], progress: number): number {
  return list.findIndex((chap, index) =>
    index === list.length - 1
      ? progress >= chap.from && progress <= chap.to
      : progress >= chap.from && progress < chap.to
  );
}

export function getFullTitle(chapter: Chapter): string {
  return `${chapter.titleBefore ?? ""}${chapter.highlight}${chapter.titleAfter ?? ""}`;
}
