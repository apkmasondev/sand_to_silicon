import { useState, useEffect } from "react";

interface PreloaderResult {
  images: HTMLImageElement[];
  isLoaded: boolean;
  loadProgress: number; // 0 to 100
  hasError: boolean;
}

const TOTAL_FRAMES = 240;

export function useImageSequencePreloader(): PreloaderResult {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const imgArray: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, "0");
      img.src = `frames/frame_${frameNum}.webp`;

      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));

        if (loadedCount === TOTAL_FRAMES) {
          setImages(imgArray);
          setIsLoaded(true);
        }
      };

      img.onerror = () => {
        console.warn(`Nie udało się załadować klatki: frames/frame_${frameNum}.webp`);
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          setImages(imgArray);
          setIsLoaded(true);
        }
      };

      imgArray[i] = img;
    }
  }, []);

  return { images, isLoaded, loadProgress, hasError: false };
}
