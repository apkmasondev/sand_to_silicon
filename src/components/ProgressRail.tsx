import React from "react";
import { Chapter, chapterNavProgress, getFullTitle } from "../data/chapters";

interface ProgressRailProps {
  progress: number; // 0 to 1
  chapters: Chapter[];
  /** Indeks aktywnego rozdziału wyliczony w jednym miejscu (-1 = hero/finał). */
  activeIndex: number;
  onSelectChapter: (progress: number) => void;
}

export const ProgressRail: React.FC<ProgressRailProps> = ({
  progress,
  chapters,
  activeIndex,
  onSelectChapter,
}) => {
  const percentage = Math.min(100, Math.max(0, progress * 100));

  return (
    <aside className="progress-rail" aria-label="Postęp transformacji krzemu">
      <div className="progress-rail__track">
        <div
          className="progress-rail__fill"
          style={{ "--progress": `${percentage}%` } as React.CSSProperties}
        />
      </div>

      <div className="progress-rail__markers">
        {chapters.map((chap, index) => {
          const navProgress = chapterNavProgress(chap);
          const isActive = index === activeIndex;

          return (
            <button
              key={chap.id}
              type="button"
              className={`progress-rail__dot ${isActive ? "progress-rail__dot--active" : ""}`}
              // Kropka siedzi dokładnie tam, dokąd prowadzi — inaczej pozycja
              // na osi nie ma nic wspólnego z etapem, do którego skacze.
              style={{ "--dot-position": `${navProgress * 100}%` } as React.CSSProperties}
              onClick={() => onSelectChapter(navProgress)}
              title={getFullTitle(chap)}
              aria-label={`Przejdź do etapu: ${chap.eyebrow}`}
              aria-current={isActive ? "step" : undefined}
            />
          );
        })}
      </div>
    </aside>
  );
};
