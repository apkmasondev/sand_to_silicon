import React, { useLayoutEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapters } from "../data/chapters";
import { ChapterOverlay } from "./ChapterOverlay";
import { ProgressRail } from "./ProgressRail";
import { ReplayButton } from "./ReplayButton";
import { Navbar } from "./Navbar";
import { ExperienceLoader } from "./ExperienceLoader";
import { useImageSequencePreloader } from "../hooks/useImageSequencePreloader";
import { VideoErrorFallback } from "./VideoErrorFallback";

gsap.registerPlugin(ScrollTrigger);

export const ScrollFilm: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const progressRef = useRef(0);
  const { images, isLoaded, loadProgress, hasError } = useImageSequencePreloader();

  // Draw frame to 2D canvas with cover math
  const drawFrame = useCallback(
    (progress: number) => {
      const canvas = canvasRef.current;
      if (!canvas || images.length === 0) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const frameIndex = Math.min(
        images.length - 1,
        Math.max(0, Math.round(progress * (images.length - 1)))
      );
      const img = images[frameIndex];
      if (!img || !img.complete) return;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.width || 1280;
      const imgHeight = img.height || 720;

      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth = canvasWidth;
      let drawHeight = canvasHeight;
      let drawX = 0;
      let drawY = 0;

      if (canvasRatio > imgRatio) {
        drawHeight = canvasWidth / imgRatio;
        drawY = (canvasHeight - drawHeight) / 2;
      } else {
        drawWidth = canvasHeight * imgRatio;
        drawX = (canvasWidth - drawWidth) / 2;
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    },
    [images]
  );

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    drawFrame(progressRef.current);
  }, [drawFrame]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || !isLoaded) return;

    resizeCanvas();

    const isMobile = window.innerWidth <= 768;
    const scrollDistance = isMobile ? "+=500%" : "+=700%";

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: scrollDistance,
      pin: true,
      scrub: 0.05, // Ultra-responsive scrub for 60/120 FPS feel
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        setScrollProgress(self.progress);
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(() => {
          drawFrame(self.progress);
        });
      },
    });

    triggerRef.current = trigger;

    const handleResize = () => {
      resizeCanvas();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", handleResize);
      trigger.kill();
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isLoaded, drawFrame, resizeCanvas]);

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
    return <VideoErrorFallback message="Nie udało się załadować sekwencji klatek." chapters={chapters} />;
  }

  return (
    <>
      <ExperienceLoader isLoading={!isLoaded} progress={loadProgress} />
      <Navbar currentProgress={scrollProgress} onNavigateToProgress={handleNavigateToProgress} />
      <ProgressRail
        progress={scrollProgress}
        chapters={chapters}
        onSelectChapter={handleNavigateToProgress}
      />

      <section ref={sectionRef} className="scroll-film" aria-label="Interaktywny film transformacji krzemu">
        <h1 className="sr-only">From Sand to Silicon — Jak powstaje procesor</h1>

        <div className="scroll-film__video-wrapper">
          <canvas
            ref={canvasRef}
            className="scroll-film__video"
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
          <h2 className="hero-copy__title">
            FROM <span className="hero-copy__title-sand">SAND</span> TO <span className="hero-copy__title-silicon">SILICON</span>
          </h2>
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
          <div className="finale-copy__eyebrow">
            <span className="hero-copy__eyebrow-dot" />
            <span>06 — PROCESOR GOTOWY</span>
          </div>
          <h2 className="finale-copy__title">
            Z piasku powstaje technologia, która napędza <span className="finale-copy__highlight">współczesny świat.</span>
          </h2>
          <p className="finale-copy__subtitle">
            Setki skomplikowanych etapów, nanometrowa precyzja i czysty krzem. Przeżyj tę transformację raz jeszcze.
          </p>
          <ReplayButton onReplay={() => handleNavigateToProgress(0)} />
        </div>
      </section>
    </>
  );
};
