import React from "react";
import { Chapter } from "../data/chapters";

interface VideoErrorFallbackProps {
  message?: string;
  chapters: Chapter[];
}

export const VideoErrorFallback: React.FC<VideoErrorFallbackProps> = ({ message, chapters }) => {
  return (
    <main className="video-error-fallback" style={{ padding: "120px 24px 80px", maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
      <header style={{ marginBottom: "48px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", color: "var(--accent-warm)", marginBottom: "16px" }}>
          From Sand to Silicon
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginBottom: "24px" }}>
          {message || "Tryb tekstowy — nie udało się zainicjować odtwarzacza wideo."}
        </p>
      </header>

      <section style={{ display: "flex", flexDirection: "column", gap: "24px", textAlign: "left" }}>
        {chapters.map((chap) => (
          <article
            key={chap.id}
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <div style={{ color: "var(--accent-warm)", fontSize: "0.8rem", letterSpacing: "0.2em", marginBottom: "6px" }}>
              {chap.eyebrow}
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", marginBottom: "8px" }}>
              {chap.title}
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              {chap.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
};
