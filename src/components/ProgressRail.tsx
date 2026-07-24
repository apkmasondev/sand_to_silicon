import React from "react";
import { Chapter } from "../data/chapters";

interface ProgressRailProps {
  progress: number; // 0 to 1
  chapters: Chapter[];
  onSelectChapter: (progress: number) => void;
}

export const ProgressRail: React.FC<ProgressRailProps> = ({
  progress,
  chapters,
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
        {chapters.map((chap) => {
          const midPoint = (chap.from + chap.to) / 2;
          const isActive = progress >= chap.from && progress <= chap.to;

          return (
            <button
              key={chap.id}
              type="button"
              className={`progress-rail__dot ${isActive ? "progress-rail__dot--active" : ""}`}
              onClick={() => onSelectChapter(midPoint)}
              title={chap.title}
              aria-label={`Przejdź do etapu: ${chap.eyebrow}`}
            />
          );
        })}
      </div>
    </aside>
  );
};
