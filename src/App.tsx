import React from "react";
import { ScrollFilm } from "./components/ScrollFilm";
import { ReducedMotionFallback } from "./components/ReducedMotionFallback";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { chapters } from "./data/chapters";
import "./styles/globals.css";
import "./styles/experience.css";

export const App: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <ReducedMotionFallback chapters={chapters} />;
  }

  return <ScrollFilm />;
};

export default App;
