import React from "react";

interface ExperienceLoaderProps {
  isLoading: boolean;
  progress?: number;
}

export const ExperienceLoader: React.FC<ExperienceLoaderProps> = ({ isLoading, progress = 0 }) => {
  return (
    <div
      className={`experience-loader ${!isLoading ? "experience-loader--hidden" : ""}`}
      aria-hidden={!isLoading}
      role="status"
      aria-label="Ładowanie doświadczenia"
    >
      <div className="experience-loader__spinner" />
      <div className="experience-loader__text">
        ŁADOWANIE DOŚWIADCZENIA {progress > 0 ? `${progress}%` : ""}
      </div>
    </div>
  );
};
