import React from "react";

interface ReplayButtonProps {
  onReplay: () => void;
}

export const ReplayButton: React.FC<ReplayButtonProps> = ({ onReplay }) => {
  return (
    <button
      type="button"
      className="replay-button"
      onClick={onReplay}
      aria-label="Odtwórz proces powstawania procesora ponownie"
    >
      <span>Odtwórz proces ponownie</span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    </button>
  );
};
