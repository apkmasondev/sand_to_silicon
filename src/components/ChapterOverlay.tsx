import React from "react";
import { Chapter } from "../data/chapters";

interface ChapterOverlayProps {
  chapters: Chapter[];
  currentProgress: number;
}

export const ChapterOverlay: React.FC<ChapterOverlayProps> = ({ chapters, currentProgress }) => {
  // Znajdź aktywny rozdział na podstawie aktualnego postępu
  const activeChapter = chapters.find(
    (chap) => currentProgress >= chap.from && currentProgress <= chap.to
  );

  if (!activeChapter) return null;

  // Obliczenie płynnego fade-in (wejścia) oraz fade-out (wyjścia)
  const duration = activeChapter.to - activeChapter.from;
  const fadeWidth = duration * 0.22; // 22% czasu trwania rozdziału na łagodne przejścia

  const distFromStart = currentProgress - activeChapter.from;
  const distFromEnd = activeChapter.to - currentProgress;

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
      key={activeChapter.id}
      className="chapter-copy"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        willChange: "opacity, transform",
      }}
      aria-live="polite"
    >
      <div className="chapter-copy__eyebrow">
        <span className="hero-copy__eyebrow-dot" />
        <span>{activeChapter.eyebrow}</span>
      </div>
      <h2 className="chapter-copy__title">
        {activeChapter.titleBefore}
        <span className="chapter-copy__highlight">{activeChapter.highlight}</span>
        {activeChapter.titleAfter}
      </h2>
      <p className="chapter-copy__description">{activeChapter.description}</p>
    </article>
  );
};
