import React from "react";
import { Chapter } from "../data/chapters";

interface ChapterOverlayProps {
  chapter: Chapter;
  currentProgress: number;
}

export const ChapterOverlay: React.FC<ChapterOverlayProps> = ({ chapter, currentProgress }) => {
  // Obliczenie płynnego fade-in (wejścia) oraz fade-out (wyjścia)
  const duration = chapter.to - chapter.from;
  const fadeWidth = duration * 0.22; // 22% czasu trwania rozdziału na łagodne przejścia

  const distFromStart = currentProgress - chapter.from;
  const distFromEnd = chapter.to - currentProgress;

  let opacity = 1;
  let translateY = 0;

  if (distFromStart < fadeWidth) {
    // Fade in: łagodne wyłanianie się z dołu (opacity 0 -> 1, translateY +18px -> 0px)
    const ratio = Math.max(0, Math.min(1, distFromStart / fadeWidth));
    opacity = ratio;
    translateY = (1 - ratio) * 18;
  } else if (distFromEnd < fadeWidth) {
    // Fade out: łagodne zanikanie w górę (opacity 1 -> 0, translateY 0px -> -18px)
    const ratio = Math.max(0, Math.min(1, distFromEnd / fadeWidth));
    opacity = ratio;
    translateY = (1 - ratio) * -18;
  }

  if (opacity <= 0.001) return null;

  return (
    <article
      key={chapter.id}
      className="chapter-copy"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        willChange: "opacity, transform",
      }}
      /* Ogłaszaniem etapów zajmuje się trwały region live w ScrollFilm — tu
         aria-live powodowałoby podwójne odczyty przy każdej podmianie. */
      aria-hidden="true"
    >
      <div className="chapter-copy__eyebrow">
        <span className="hero-copy__eyebrow-dot" />
        <span>{chapter.eyebrow}</span>
      </div>
      <h2 className="chapter-copy__title">
        {chapter.titleBefore}
        <span className="chapter-copy__highlight">{chapter.highlight}</span>
        {chapter.titleAfter}
      </h2>
      <p className="chapter-copy__description">{chapter.description}</p>
    </article>
  );
};
