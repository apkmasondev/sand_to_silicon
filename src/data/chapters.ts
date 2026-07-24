export interface Chapter {
  id: string;
  from: number; // progress (0.0 to 1.0)
  to: number;   // progress (0.0 to 1.0)
  eyebrow: string;
  title: string;
  description: string;
}

export const chapters: Chapter[] = [
  {
    id: "sand",
    from: 0.08,
    to: 0.24,
    eyebrow: "01 — SUROWIEC",
    title: "Wszystko zaczyna się od piasku.",
    description: "Krzem występuje w minerałach otaczających nas każdego dnia. To pierwszy krok w drodze do zaawansowanej mikroelektroniki."
  },
  {
    id: "purification",
    from: 0.24,
    to: 0.40,
    eyebrow: "02 — OCZYSZCZANIE",
    title: "Krzem zostaje oczyszczony.",
    description: "Materiał musi osiągnąć niezwykle wysoką czystość chemiczną, zanim stanie się podstawą nowoczesnego mikrochipa."
  },
  {
    id: "wafer",
    from: 0.40,
    to: 0.56,
    eyebrow: "03 — WAFER",
    title: "Powstaje idealnie gładka płytka.",
    description: "Monokryształ krzemu jest precyzyjnie cięty na cienkie plastry i polerowany do uzbrojenia w niemal lustrzaną powierzchnię."
  },
  {
    id: "pattern",
    from: 0.56,
    to: 0.72,
    eyebrow: "04 — WZÓR",
    title: "Światło zapisuje strukturę układu.",
    description: "Metodą fotolitografii niezwykle precyzyjny wzór wyznacza miejsca mikroskopijnych tranzystorów i ścieżek prądowych."
  },
  {
    id: "transistors",
    from: 0.72,
    to: 0.88,
    eyebrow: "05 — TRANZYSTORY",
    title: "Warstwa po warstwie powstaje mikrochip.",
    description: "Miliardy miniaturowych przełączników układają się w przestrzenną sieć połączeń o nanometrowej dokładności."
  },
  {
    id: "processor",
    from: 0.88,
    to: 0.94,
    eyebrow: "06 — PROCESOR",
    title: "Z piasku powstaje procesor.",
    description: "Gotowy układ półprzewodnikowy trafia do urządzeń technologicznych, które napędzają nasz cyfrowy świat."
  }
];
