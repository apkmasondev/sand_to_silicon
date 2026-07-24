import { useState, useEffect, useRef } from "react";

interface PreloaderResult {
  images: HTMLImageElement[];
  isLoaded: boolean;
  loadProgress: number; // 0 to 100
  hasError: boolean;
}

const TOTAL_FRAMES = 240;
const ERROR_THRESHOLD = 0.1; // treat >10% failed frames as error

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
    const imgArray: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    const checkComplete = () => {
      if (!isMounted.current) return;
      if (loadedCount + errorCount === TOTAL_FRAMES) {
        if (errorCount > TOTAL_FRAMES * ERROR_THRESHOLD) {
          setHasError(true);
        } else {
          setImages(imgArray);
          setIsLoaded(true);
        }
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, "0");
      img.src = `frames/frame_${frameNum}.webp`;

      img.onload = () => {
        loadedCount++;
        if (isMounted.current) {
          setLoadProgress(Math.round(((loadedCount + errorCount) / TOTAL_FRAMES) * 100));
        }
        checkComplete();
      };

      img.onerror = () => {
        console.warn(`Failed to load frame: frames/frame_${frameNum}.webp`);
        errorCount++;
        if (isMounted.current) {
          setLoadProgress(Math.round(((loadedCount + errorCount) / TOTAL_FRAMES) * 100));
        }
        checkComplete();
      };

      imgArray[i] = img;
    }

    return () => {
      isMounted.current = false;
    };
  }, []);

  return { images, isLoaded, loadProgress, hasError };
}
