import React from "react";
import { Chapter } from "../data/chapters";

interface ChapterOverlayProps {
  chapters: Chapter[];
  currentProgress: number;
}

export const ChapterOverlay: React.FC<ChapterOverlayProps> = ({ chapters, currentProgress }) => {
  // Find which chapter is currently active
  const activeChapter = chapters.find(
    (chap) => currentProgress >= chap.from && currentProgress <= chap.to
  );

  if (!activeChapter) return null;

  return (
    <article
      key={activeChapter.id}
      className="chapter-copy"
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
