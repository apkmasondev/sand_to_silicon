import { useState, useEffect, RefObject } from "react";

interface VideoMetadataResult {
  isReady: boolean;
  duration: number;
  hasError: boolean;
  errorMessage: string | null;
}

export function useVideoMetadata(videoRef: RefObject<HTMLVideoElement | null>): VideoMetadataResult {
  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Timeout safety fallback: if video doesn't load metadata in 8 seconds
    // We check video.readyState directly (not `isReady` state) to avoid stale closure
    const timeoutId = setTimeout(() => {
      if (video.readyState < 1) {
        console.warn("Video metadata load timeout. Triggering fallback mode.");
        setHasError(true);
        setErrorMessage("Nie udało się załadować wideo w odpowiednim czasie.");
      }
    }, 8000);

    const handleLoadedMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        setDuration(video.duration);
        // Force set to tiny frame to prime decoding pipeline
        try {
          video.currentTime = 0.001;
        } catch {
          // Ignore seeking errors during init
        }
        setIsReady(true);
      } else {
        setHasError(true);
        setErrorMessage("Niepoprawny czas trwania wideo.");
      }
    };

    const handleError = () => {
      setHasError(true);
      setErrorMessage("Wystąpił błąd podczas ładowania pliku wideo.");
    };

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("error", handleError);
    }

    return () => {
      clearTimeout(timeoutId);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("error", handleError);
    };
  }, [videoRef]);

  return { isReady, duration, hasError, errorMessage };
}
