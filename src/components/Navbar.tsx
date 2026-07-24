import React, { useState } from "react";

interface NavbarProps {
  currentProgress?: number;
  onNavigateToProgress: (progress: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentProgress = 0, onNavigateToProgress }) => {
  const [isOpen, setIsOpen] = useState(false);

  const isStart = currentProgress < 0.08;
  const isProces = currentProgress >= 0.08 && currentProgress < 0.92;
  const isFinal = currentProgress >= 0.92;

  const handleSelect = (progress: number) => {
    onNavigateToProgress(progress);
    setIsOpen(false);
  };

  return (
    <header className="experience-nav">
      <a href="#top" className="experience-nav__brand" onClick={(e) => { e.preventDefault(); handleSelect(0); }}>
        <span className="experience-nav__logo-dot" />
        <span>Sand to Silicon</span>
      </a>

      {/* Mobile Hamburger Button */}
      <button
        type="button"
        className={`experience-nav__hamburger ${isOpen ? "experience-nav__hamburger--open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
        aria-expanded={isOpen}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`experience-nav__drawer ${isOpen ? "experience-nav__drawer--open" : ""}`} aria-label="Nawigacja po doświadczeniu">
        <ul className="experience-nav__menu">
          <li>
            <button
              type="button"
              className={`experience-nav__button ${isStart ? "experience-nav__button--active" : ""}`}
              aria-current={isStart ? "step" : undefined}
              onClick={() => handleSelect(0)}
            >
              Start
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`experience-nav__button ${isProces ? "experience-nav__button--active" : ""}`}
              aria-current={isProces ? "step" : undefined}
              onClick={() => handleSelect(24 / 239)}
            >
              Proces
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`experience-nav__button ${isFinal ? "experience-nav__button--active" : ""}`}
              aria-current={isFinal ? "step" : undefined}
              onClick={() => handleSelect(1.0)}
            >
              Finał
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};
