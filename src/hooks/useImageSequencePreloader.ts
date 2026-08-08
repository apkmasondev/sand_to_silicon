import { useState, useEffect, useRef } from "react";
import { FRAME_COUNT } from "../data/chapters";

interface PreloaderResult {
  images: HTMLImageElement[];
  isLoaded: boolean;
  loadProgress: number; // 0 to 100
  hasError: boolean;
}

const ERROR_THRESHOLD = 0.1; // treat >10% failed frames as error
/** Pierwsze klatki są potrzebne natychmiast — reszta może poczekać w kolejce. */
const PRIORITY_FRAMES = 16;
/** Po tym czasie kończymy oczekiwanie, nawet jeśli część żądań utknęła. */
const LOAD_TIMEOUT_MS = 30000;

type PriorityImage = HTMLImageElement & { fetchPriority?: "high" | "low" | "auto" };

export function useImageSequencePreloader(): PreloaderResult {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    let loadedCount = 0;
    let errorCount = 0;
    let settled = false;
    const imgArray: HTMLImageElement[] = new Array(FRAME_COUNT);

    const finish = () => {
      if (settled || !isMounted.current) return;
      settled = true;
      window.clearTimeout(timeoutId);

      // Klatka jest użyteczna tylko wtedy, gdy faktycznie się zdekodowała.
      const missing = imgArray.reduce((acc, img) => (img.complete && img.naturalWidth > 0 ? acc : acc + 1), 0);

      if (missing > FRAME_COUNT * ERROR_THRESHOLD) {
        setHasError(true);
      } else {
        setImages(imgArray);
        setIsLoaded(true);
      }
    };

    const checkComplete = () => {
      if (!isMounted.current) return;
      if (loadedCount + errorCount === FRAME_COUNT) finish();
    };

    const reportProgress = () => {
      if (!isMounted.current) return;
      setLoadProgress(Math.round(((loadedCount + errorCount) / FRAME_COUNT) * 100));
    };

    // Sieć bywa zawodna: jeśli któreś żądanie nigdy nie zwróci load/error,
    // loader kręciłby się w nieskończoność. Kończymy z tym, co mamy.
    const timeoutId = window.setTimeout(() => {
      console.warn(
        `Przekroczono limit ${LOAD_TIMEOUT_MS} ms ładowania klatek (${loadedCount}/${FRAME_COUNT}).`
      );
      finish();
    }, LOAD_TIMEOUT_MS);

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image() as PriorityImage;
      const frameNum = String(i).padStart(3, "0");
      const src = `${import.meta.env.BASE_URL}frames/frame_${frameNum}.webp`;

      img.decoding = "async";
      // Podpowiedź kolejności: początek sekwencji przed resztą taśmy.
      img.fetchPriority = i < PRIORITY_FRAMES ? "high" : "low";

      img.onload = () => {
        loadedCount++;
        reportProgress();
        checkComplete();
      };

      img.onerror = () => {
        console.warn(`Failed to load frame: ${src}`);
        errorCount++;
        reportProgress();
        checkComplete();
      };

      img.src = src;
      imgArray[i] = img;
    }

    return () => {
      isMounted.current = false;
      window.clearTimeout(timeoutId);
      // Odpinamy handlery i przerywamy trwające pobrania, żeby domknięcia
      // (i 240 obrazów) nie wisiały w pamięci po odmontowaniu komponentu.
      for (const img of imgArray) {
        if (!img) continue;
        img.onload = null;
        img.onerror = null;
        if (!img.complete) img.src = "";
      }
    };
  }, []);

  return { images, isLoaded, loadProgress, hasError };
}
