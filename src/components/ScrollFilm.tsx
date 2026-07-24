import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapters } from "../data/chapters";
import { ChapterOverlay } from "./ChapterOverlay";
import { ProgressRail } from "./ProgressRail";
import { ReplayButton } from "./ReplayButton";
import { Navbar } from "./Navbar";
import { ExperienceLoader } from "./ExperienceLoader";
import { useVideoMetadata } from "../hooks/useVideoMetadata";
import { VideoErrorFallback } from "./VideoErrorFallback";

gsap.registerPlugin(ScrollTrigger);

export const ScrollFilm: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const { isReady, hasError, errorMessage } = useVideoMetadata(videoRef);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;

    if (!section || !video || !isReady) return;

    // Responsive end scroll length
    const isMobile = window.innerWidth <= 768;
    const scrollDistance = isMobile ? "+=500%" : "+=700%";

    const updateVideoTime = (progress: number) => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        const fps = 24;
        const frameCount = Math.floor(video.duration * fps);
        const frame = Math.round(progress * Math.max(0, frameCount - 1));
        // Clamp target time safely between 0.001s and duration - 0.01s to avoid EOF stutter
        const targetTime = Math.min(video.duration - 0.01, Math.max(0.001, frame / fps));

        if (Math.abs(video.currentTime - targetTime) >= 1 / (fps * 2)) {
          video.currentTime = targetTime;
        }
      });
    };

    // Render initial frame 0 immediately upon ready
    updateVideoTime(0);

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: scrollDistance,
      pin: true,
      scrub: 0.15,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
        updateVideoTime(self.progress);
      },
    });

    triggerRef.current = trigger;

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    // Refresh triggers to ensure correct layout dimensions
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", handleResize);
      trigger.kill();
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isReady]);

  // Handler to scroll smoothly to target progress position
  // Uses ScrollTrigger's own start/end to compute correct scroll position
  // (plain scrollHeight math is wrong when GSAP pins the section)
  const handleNavigateToProgress = (targetProgress: number) => {
    const st = triggerRef.current;
    if (!st) return;

    const targetScrollY = st.start + targetProgress * (st.end - st.start);

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  };

  if (hasError) {
    return <VideoErrorFallback message={errorMessage || undefined} chapters={chapters} />;
  }

  return (
    <>
      <ExperienceLoader isLoading={!isReady} />
      <Navbar currentProgress={scrollProgress} onNavigateToProgress={handleNavigateToProgress} />
      <ProgressRail
        progress={scrollProgress}
        chapters={chapters}
        onSelectChapter={handleNavigateToProgress}
      />

      <section ref={sectionRef} className="scroll-film" aria-label="Interaktywny film transformacji krzemu">
        <h1 className="sr-only">From Sand to Silicon — Jak powstaje procesor</h1>

        <div className="scroll-film__video-wrapper">
          <video
            ref={videoRef}
            className="scroll-film__video"
            src="media/sand-to-silicon-scrub.mp4"
            poster="media/sand-to-silicon-poster.webp"
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
          <div className="scroll-film__vignette" />
        </div>

        {/* Hero Banner (visible at start progress < 0.08) */}
        <div
          className="hero-copy"
          style={{
            opacity: scrollProgress < 0.08 ? 1 - scrollProgress * 12.5 : 0,
            transform: `translateY(${scrollProgress * -40}px)`,
            pointerEvents: scrollProgress < 0.08 ? "auto" : "none",
          }}
        >
          <div className="hero-copy__eyebrow">
            <span className="hero-copy__eyebrow-dot" />
            <span>DOŚWIADCZENIE INTERAKTYWNE</span>
          </div>
          <h2 className="hero-copy__title">FROM SAND TO SILICON</h2>
          <p className="hero-copy__subtitle">
            Od ziaren piasku do serca cyfrowego świata. Zobacz przemianę krzemu w zaawansowany procesor.
          </p>
          <div className="hero-copy__scroll-hint">
            <span>Przewiń, aby rozpocząć</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Chapter Overlay Narrative (progress 0.08 to 0.92) */}
        {scrollProgress >= 0.08 && scrollProgress <= 0.92 && (
          <ChapterOverlay chapters={chapters} currentProgress={scrollProgress} />
        )}

        {/* Finale Overlay Card (progress > 0.92) */}
        <div
          className="finale-copy"
          style={{
            opacity: scrollProgress > 0.92 ? (scrollProgress - 0.92) * 12.5 : 0,
            transform: `translateY(${scrollProgress > 0.92 ? (1 - (scrollProgress - 0.92) * 12.5) * 20 : 20}px)`,
            pointerEvents: scrollProgress > 0.92 ? "auto" : "none",
          }}
        >
          <div className="finale-copy__eyebrow">06 — PROCESOR GOTOWY</div>
          <h2 className="finale-copy__title">
            Z piasku powstaje technologia, która napędza współczesny świat.
          </h2>
          <ReplayButton onReplay={() => handleNavigateToProgress(0)} />
        </div>
      </section>
    </>
  );
};
