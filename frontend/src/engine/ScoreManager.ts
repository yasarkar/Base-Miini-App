import { GAME_CONFIG } from "@/lib/constants";
import type { GameState } from "./types";

export class ScoreManager {
  public state: GameState;
  private scoreAccumulator: number = 0;

  constructor() {
    this.state = {
      score: 0,
      isRunning: false,
      isGameOver: false,
      speed: GAME_CONFIG.baseSpeed,
      distance: 0,
      highScore: 0,
    };
  }

  reset(): void {
    this.state.score = 0;
    this.state.isRunning = true;
    this.state.isGameOver = false;
    this.state.speed = GAME_CONFIG.baseSpeed;
    this.state.distance = 0;
    this.scoreAccumulator = 0;
  }

  update(deltaTime: number): void {
    if (!this.state.isRunning || this.state.isGameOver) return;

    // Accumulate distance
    this.state.distance += this.state.speed * deltaTime;

    // Score based on distance
    this.scoreAccumulator += this.state.speed * deltaTime * 0.01;
    if (this.scoreAccumulator >= 1) {
      this.state.score += Math.floor(this.scoreAccumulator);
      this.scoreAccumulator -= Math.floor(this.scoreAccumulator);
    }

    // Gradually increase speed
    if (this.state.speed < GAME_CONFIG.maxSpeed) {
      this.state.speed += GAME_CONFIG.speedIncrement;
    }
  }

  gameOver(): void {
    this.state.isRunning = false;
    this.state.isGameOver = true;
    if (this.state.score > this.state.highScore) {
      this.state.highScore = this.state.score;
    }
  }

  getScore(): number {
    return this.state.score;
  }

  getSpeed(): number {
    return this.state.speed;
  }

  getDistance(): number {
    return Math.floor(this.state.distance);
  }

  render(ctx: CanvasRenderingContext2D, canvasWidth: number): void {
    ctx.save();

    // Score text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px monospace";
    ctx.textAlign = "right";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 4;
    ctx.fillText(`SCORE: ${this.state.score}`, canvasWidth - 20, 30);
    ctx.shadowBlur = 0;

    // Speed indicator
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "12px monospace";
    ctx.fillText(`SPEED: ${Math.floor(this.state.speed)}`, canvasWidth - 20, 48);

    // High score
    if (this.state.highScore > 0) {
      ctx.fillStyle = "rgba(201, 168, 76, 0.7)";
      ctx.font = "12px monospace";
      ctx.fillText(`BEST: ${this.state.highScore}`, canvasWidth - 20, 64);
    }

    ctx.restore();
  }
}