export interface Vector2D {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlayerState {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  isJumping: boolean;
  isGrounded: boolean;
  frame: number;
  hasFlatCap: boolean;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "pipe" | "barricade";
  passed: boolean;
}

export interface GameState {
  score: number;
  isRunning: boolean;
  isGameOver: boolean;
  speed: number;
  distance: number;
  highScore: number;
}

export interface BackgroundLayer {
  x: number;
  speed: number;
  color: string;
  height: number;
}

export type GameScreen = "start" | "playing" | "gameover";

export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  gravity: number;
  jumpForce: number;
  baseSpeed: number;
  maxSpeed: number;
  speedIncrement: number;
  obstacleSpawnInterval: number;
  groundHeight: number;
}