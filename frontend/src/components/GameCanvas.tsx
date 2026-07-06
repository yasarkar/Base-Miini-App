"use client";

import { useEffect, useRef, useCallback } from "react";
import { GameEngine } from "@/engine/GameEngine";

interface GameCanvasProps {
  onGameOver: (score: number, duration: number) => void;
  onScoreUpdate: (score: number) => void;
}

export function GameCanvas({ onGameOver, onScoreUpdate }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new GameEngine(canvas);
    engineRef.current = engine;
    
    // Auto-start the game engine loop directly
    engine.startGame();

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Dynamically update callback references in the engine when they change,
  // preventing closures from holding stale references without restarting the game.
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setCallbacks(onGameOver, onScoreUpdate);
    }
  }, [onGameOver, onScoreUpdate]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-pointer"
      style={{
        maxWidth: "800px",
        maxHeight: "400px",
        margin: "auto",
        display: "block",
      }}
    />
  );
}