import React from "react";

interface ExperienceLoaderProps {
  isLoading: boolean;
  progress?: number;
}

export const ExperienceLoader: React.FC<ExperienceLoaderProps> = ({ isLoading, progress = 0 }) => {
  const value = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div
      className={`experience-loader ${!isLoading ? "experience-loader--hidden" : ""}`}
      aria-hidden={!isLoading}
      role="status"
      aria-busy={isLoading}
    >
      <div className="experience-loader__spinner" aria-hidden="true" />

      <div className="experience-loader__text">
        ŁADOWANIE DOŚWIADCZENIA {value}%
      </div>

      <div
        className="experience-loader__bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label="Postęp ładowania klatek animacji"
      >
        <div
          className="experience-loader__bar-fill"
          style={{ "--load-progress": `${value}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
};
