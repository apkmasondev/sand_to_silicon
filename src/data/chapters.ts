export interface Chapter {
  id: string;
  from: number; // progress (0.0 to 1.0)
  to: number;   // progress (0.0 to 1.0)
  eyebrow: string;
  titleBefore?: string;
  highlight: string;
  titleAfter?: string;
  description: string;
}

export const chapters: Chapter[] = [
  {
    id: "sand",
    from: 0.04,
    to: 0.1588,
    eyebrow: "01 — SUROWIEC",
    titleBefore: "Wszystko zaczyna się od ",
    highlight: "piasku.",
    description: "Krzem występuje w minerałach otaczających nas każdego dnia. To pierwszy krok w drodze do zaawansowanej mikroelektroniki."
  },
  {
    id: "purification",
    from: 0.1588,
    to: 0.3640,
    eyebrow: "02 — OCZYSZCZANIE",
    titleBefore: "Krzem zostaje ",
    highlight: "oczyszczony.",
    description: "Materiał musi osiągnąć niezwykle wysoką czystość chemiczną, zanim stanie się podstawą nowoczesnego mikrochipa."
  },
  {
    id: "wafer",
    from: 0.3640,
    to: 0.4608,
    eyebrow: "03 — WAFER",
    titleBefore: "Powstaje idealnie ",
    highlight: "gładka płytka.",
    description: "Monokryształ krzemu jest precyzyjnie cięty na cienkie plastry i polerowany do uzyskania niemal lustrzanej powierzchni."
  },
  {
    id: "pattern",
    from: 0.4608,
    to: 0.5702,
    eyebrow: "04 — WZÓR",
    highlight: "Światło ",
    titleAfter: "zapisuje strukturę układu.",
    description: "Metodą fotolitografii niezwykle precyzyjny wzór wyznacza miejsca mikroskopijnych tranzystorów i ścieżek prądowych."
  },
  {
    id: "transistors",
    from: 0.6880,
    to: 0.8658,
    eyebrow: "05 — TRANZYSTORY",
    titleBefore: "Warstwa po warstwie powstaje ",
    highlight: "mikrochip.",
    description: "Miliardy miniaturowych przełączników układają się w przestrzenną sieć połączeń o nanometrowej dokładności."
  },
  {
    id: "processor",
    from: 0.8350,
    to: 0.9150,
    eyebrow: "06 — PROCESOR",
    titleBefore: "Z piasku powstaje ",
    highlight: "procesor.",
    description: "Gotowy układ półprzewodnikowy trafia do urządzeń technologicznych, które napędzają nasz cyfrowy świat."
  }
];
