import React from "react";

interface ExperienceLoaderProps {
  isLoading: boolean;
}

export const ExperienceLoader: React.FC<ExperienceLoaderProps> = ({ isLoading }) => {
  return (
    <div
      className={`experience-loader ${!isLoading ? "experience-loader--hidden" : ""}`}
      aria-hidden={!isLoading}
      role="status"
      aria-label="Ładowanie doświadczenia"
    >
      <div className="experience-loader__spinner" />
      <div className="experience-loader__text">Ładowanie doświadczenia</div>
    </div>
  );
};
