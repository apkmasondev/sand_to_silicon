import React, { useLayoutEffect, useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  chapters,
  FILM_SCROLL_RATIO,
  getActiveChapterIndex,
  getFullTitle,
} from "../data/chapters";
import { ChapterOverlay } from "./ChapterOverlay";
import { ProgressRail } from "./ProgressRail";
import { ReplayButton } from "./ReplayButton";
import { Navbar } from "./Navbar";
import { ExperienceLoader } from "./ExperienceLoader";
import { useImageSequencePreloader } from "../hooks/useImageSequencePreloader";
import { VideoErrorFallback } from "./VideoErrorFallback";

gsap.registerPlugin(ScrollTrigger);

/** Powyżej 2x DPR zysk wizualny jest niezauważalny, a koszt rysowania rośnie kwadratowo. */
const MAX_DPR = 2;
/**
 * Postęp ze ScrollTriggera zmienia się przy każdym ticku rAF. Bez kwantyzacji
 * każdy tick przerysowywałby całe drzewo Reacta; 0.001 to wciąż ok. 1/4 klatki.
 */
const PROGRESS_STEP = 0.001;

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

      // Film odtwarza się do 88% scrolla, a przez pozostałe 12% przytrzymywana jest ostatnia klatka gotowego procesora (efekt pauzy/oddechu)
      const videoProgress = Math.min(1, progress / FILM_SCROLL_RATIO);

      const frameIndex = Math.min(
        images.length - 1,
        Math.max(0, Math.round(videoProgress * (images.length - 1)))
      );
      const img = images[frameIndex];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

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

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const rect = canvas.getBoundingClientRect();
    const width = Math.round(rect.width * dpr);
    const height = Math.round(rect.height * dpr);
    if (width === 0 || height === 0) return;

    // Przypisanie width/height czyści bufor, więc robimy je tylko przy realnej zmianie.
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

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
        setScrollProgress((prev) =>
          Math.abs(self.progress - prev) >= PROGRESS_STEP || self.progress === 0 || self.progress === 1
            ? self.progress
            : prev
        );
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(() => {
          animationFrameRef.current = null;
          drawFrame(progressRef.current);
        });
      },
    });

    triggerRef.current = trigger;

    // ScrollTrigger sam odświeża się przy `resize` (autoRefreshEvents), więc
    // wystarczy dorysować klatkę po jego przeliczeniu — ręczny refresh
    // powodowałby podwójne pomiary i zacięcia przy pasku adresu na mobile.
    ScrollTrigger.addEventListener("refresh", resizeCanvas);
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.removeEventListener("refresh", resizeCanvas);
      // revert = true usuwa spacer pinowania i przywraca style sekcji.
      trigger.kill(true);
      triggerRef.current = null;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isLoaded, drawFrame, resizeCanvas]);

  // Zmiana rozmiaru okna bez refreshu ScrollTriggera (np. pasek adresu na
  // mobile przy `100dvh`) też musi przeskalować bufor canvasu.
  useEffect(() => {
    let frame: number | null = null;
    const handleResize = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = null;
        resizeCanvas();
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [resizeCanvas]);

  const handleNavigateToProgress = useCallback((targetProgress: number) => {
    const st = triggerRef.current;
    if (!st) return;

    const clamped = Math.min(1, Math.max(0, targetProgress));
    const targetScrollY = st.start + clamped * (st.end - st.start);

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  }, []);

  const activeChapterIndex = getActiveChapterIndex(chapters, scrollProgress);
  const activeChapter = activeChapterIndex >= 0 ? chapters[activeChapterIndex] : null;

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
        activeIndex={activeChapterIndex}
        onSelectChapter={handleNavigateToProgress}
      />

      <section ref={sectionRef} className="scroll-film" aria-label="Interaktywny film transformacji krzemu">
        <h1 className="sr-only">From Sand to Silicon — Jak powstaje procesor</h1>

        {/*
          Trwały region live: musi istnieć w DOM zanim zmieni się jego treść,
          inaczej czytniki ekranu nie ogłoszą kolejnych etapów narracji.
        */}
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {activeChapter ? `${activeChapter.eyebrow}. ${getFullTitle(activeChapter)} ${activeChapter.description}` : ""}
        </p>

        <div className="scroll-film__video-wrapper">
          <canvas
            ref={canvasRef}
            className="scroll-film__video"
            aria-hidden="true"
          />
          <div className="scroll-film__vignette" />
        </div>

        {/* Hero Banner (visible at start progress < 0.04) */}
        <div
          className="hero-copy"
          style={{
            opacity: scrollProgress < 0.04 ? Math.max(0, 1 - scrollProgress * 25) : 0,
            transform: `translateY(${scrollProgress * -40}px)`,
            pointerEvents: scrollProgress < 0.04 ? "auto" : "none",
          }}
          inert={scrollProgress >= 0.04}
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Chapter Overlay Narrative */}
        {activeChapter && (
          <ChapterOverlay chapter={activeChapter} currentProgress={scrollProgress} />
        )}

        {/* Finale Overlay Card (progress > 0.93) */}
        <div
          className="finale-copy"
          style={{
            opacity: scrollProgress > 0.93 ? Math.min(1, (scrollProgress - 0.93) / 0.07) : 0,
            transform: `translateY(${scrollProgress > 0.93 ? Math.max(0, 1 - (scrollProgress - 0.93) / 0.07) * 20 : 20}px)`,
            pointerEvents: scrollProgress > 0.93 ? "auto" : "none",
          }}
          /* inert wycina niewidoczną kartę finału także z kolejności Tab i z drzewa a11y */
          inert={scrollProgress <= 0.93}
        >
          <div className="finale-copy__eyebrow">
            <span className="hero-copy__eyebrow-dot" />
            <span>FINAŁ — PROCESOR GOTOWY</span>
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
