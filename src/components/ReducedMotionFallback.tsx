import React from "react";
import { Chapter } from "../data/chapters";

interface ReducedMotionFallbackProps {
  chapters: Chapter[];
}

export const ReducedMotionFallback: React.FC<ReducedMotionFallbackProps> = ({ chapters }) => {
  return (
    <main className="reduced-motion-view" style={{ padding: "120px 24px 80px", maxWidth: "900px", margin: "0 auto" }}>
      <header style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", marginBottom: "16px" }}>
          From Sand to Silicon
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
          Od ziaren piasku do serca cyfrowego świata. Przegląd etapów powstawania procesora.
        </p>
      </header>

      <section style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {chapters.map((chap) => (
          <article
            key={chap.id}
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "16px",
              padding: "32px",
            }}
          >
            <div style={{ color: "var(--accent-warm)", fontSize: "0.85rem", letterSpacing: "0.2em", marginBottom: "8px", fontWeight: 600 }}>
              {chap.eyebrow}
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "12px" }}>
              {chap.title}
            </h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {chap.description}
            </p>
          </article>
        ))}
      </section>

      <footer style={{ textAlign: "center", marginTop: "60px" }}>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Z piasku powstaje technologia, która napędza współczesny świat.
        </p>
      </footer>
    </main>
  );
};
