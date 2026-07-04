"use client";

import { useEffect, useRef, useCallback } from "react";
import { GameEngine } from "@/engine/GameEngine";

interface GameCanvasProps {
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

export function GameCanvas({ onGameOver, onScoreUpdate }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // CRITICAL: Call sdk.actions.ready() immediately on mount to bypass Farcaster native splash screen
    const signalReady = async () => {
      try {
        const sdkModule = await import("@farcaster/miniapp-sdk");
        const sdk = sdkModule.default || sdkModule;
        sdk.actions.ready();
        console.log("[GameCanvas] sdk.actions.ready() executed successfully");
      } catch (err) {
        console.warn("[GameCanvas] Failed to call sdk.actions.ready():", err);
      }
    };
    signalReady();

    const engine = new GameEngine(canvas);
    engineRef.current = engine;

    engine.setCallbacks(onGameOver, onScoreUpdate);
    
    // Auto-start the game engine loop directly
    engine.startGame();

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

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