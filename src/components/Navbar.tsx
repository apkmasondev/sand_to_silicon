import React, { useEffect, useRef, useState } from "react";
import { chapters, chapterNavProgress } from "../data/chapters";

interface NavbarProps {
  currentProgress?: number;
  onNavigateToProgress: (progress: number) => void;
}

const DRAWER_ID = "experience-nav-drawer";
/** „Proces” prowadzi do pierwszego rozdziału narracji (klatka 27). */
const PROCESS_PROGRESS = chapterNavProgress(chapters[0]);

export const Navbar: React.FC<NavbarProps> = ({ currentProgress = 0, onNavigateToProgress }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  const isStart = currentProgress < 0.08;
  const isProces = currentProgress >= 0.08 && currentProgress < 0.92;
  const isFinal = currentProgress >= 0.92;

  const handleSelect = (progress: number) => {
    onNavigateToProgress(progress);
    setIsOpen(false);
  };

  // Otwarty drawer przykrywa cały ekran — bez Escape i bez przeniesienia
  // fokusu użytkownik klawiatury zostaje uwięziony za nakładką.
  useEffect(() => {
    if (!isOpen) return;

    // Odczyt offsetHeight wymusza przeliczenie stylów: bez tego drawer ma
    // wciąż `visibility: hidden` ze stanu zamkniętego, a focus() na
    // niewidocznym elemencie po cichu nie zadziała.
    const drawer = drawerRef.current;
    if (drawer) {
      void drawer.offsetHeight;
      drawer.querySelector<HTMLButtonElement>("button")?.focus();
    }

    const focusables = (): HTMLElement[] => [
      ...(hamburgerRef.current ? [hamburgerRef.current] : []),
      ...Array.from(drawerRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? []),
    ];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        hamburgerRef.current?.focus();
        return;
      }

      // Nakładka zasłania całą stronę, więc Tab musi krążyć w jej obrębie.
      if (event.key === "Tab") {
        const items = focusables();
        if (items.length === 0) return;
        const current = items.indexOf(document.activeElement as HTMLElement);
        const next = event.shiftKey
          ? (current <= 0 ? items.length - 1 : current - 1)
          : (current === -1 || current === items.length - 1 ? 0 : current + 1);
        event.preventDefault();
        items[next].focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <header className="experience-nav">
      <a href="#top" className="experience-nav__brand" onClick={(e) => { e.preventDefault(); handleSelect(0); }}>
        <span className="experience-nav__logo-dot" />
        <span>Sand to Silicon</span>
      </a>

      {/* Mobile Hamburger Button */}
      <button
        ref={hamburgerRef}
        type="button"
        className={`experience-nav__hamburger ${isOpen ? "experience-nav__hamburger--open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
        aria-expanded={isOpen}
        aria-controls={DRAWER_ID}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      <nav
        ref={drawerRef}
        id={DRAWER_ID}
        className={`experience-nav__drawer ${isOpen ? "experience-nav__drawer--open" : ""}`}
        aria-label="Nawigacja po doświadczeniu"
        // Kliknięcie w tło nakładki zamyka menu (na desktopie drawer to
        // `display: contents`, więc zdarzenie nigdy tu nie trafia).
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsOpen(false);
        }}
      >
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
              onClick={() => handleSelect(PROCESS_PROGRESS)}
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
