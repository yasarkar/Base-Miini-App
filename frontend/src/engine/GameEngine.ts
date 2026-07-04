import { GAME_CONFIG } from "@/lib/constants";
import { Player } from "./Player";
import { ObstacleManager } from "./ObstacleManager";
import { BackgroundRenderer } from "./BackgroundRenderer";
import { CollisionDetector } from "./CollisionDetector";
import { ScoreManager } from "./ScoreManager";
import type { GameScreen } from "./types";

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private player: Player;
  private obstacles: ObstacleManager;
  private background: BackgroundRenderer;
  private scoreManager: ScoreManager;
  private lastTime: number = 0;
  private animationFrameId: number | null = null;
  private screen: GameScreen = "start";
  private onGameOver: ((score: number) => void) | null = null;
  private onScoreUpdate: ((score: number) => void) | null = null;
  private resizeHandler: (() => void) | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2D context");
    this.ctx = ctx;

    this.setupCanvas();
    this.player = new Player(this.canvas.height);
    this.obstacles = new ObstacleManager(this.canvas.width, this.canvas.height);
    this.background = new BackgroundRenderer(this.canvas.width, this.canvas.height);
    this.scoreManager = new ScoreManager();

    this.setupInput();
    this.setupResize();
  }

  private setupCanvas(): void {
    const parent = this.canvas.parentElement;
    if (parent) {
      this.canvas.width = Math.min(GAME_CONFIG.canvasWidth, parent.clientWidth);
      this.canvas.height = Math.min(GAME_CONFIG.canvasHeight, parent.clientHeight);
    } else {
      this.canvas.width = GAME_CONFIG.canvasWidth;
      this.canvas.height = GAME_CONFIG.canvasHeight;
    }
  }

  private setupResize(): void {
    this.resizeHandler = () => {
      const parent = this.canvas.parentElement;
      if (parent) {
        this.canvas.width = Math.min(GAME_CONFIG.canvasWidth, parent.clientWidth);
        this.canvas.height = Math.min(GAME_CONFIG.canvasHeight, parent.clientHeight);
      }
    };
    window.addEventListener("resize", this.resizeHandler);
  }

  private setupInput(): void {
    const handleInput = (e: Event) => {
      e.preventDefault();
      if (this.screen === "start") {
        this.startGame();
      } else if (this.screen === "playing") {
        this.player.jump();
      }
    };

    this.canvas.addEventListener("click", handleInput);
    this.canvas.addEventListener("touchstart", handleInput, { passive: false });
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (this.screen === "start") {
          this.startGame();
        } else if (this.screen === "playing") {
          this.player.jump();
        }
      }
    });
  }

  setCallbacks(onGameOver: (score: number) => void, onScoreUpdate: (score: number) => void): void {
    this.onGameOver = onGameOver;
    this.onScoreUpdate = onScoreUpdate;
  }

  startGame(): void {
    this.screen = "playing";
    this.player.reset(this.canvas.height);
    this.obstacles.reset();
    this.background.reset();
    this.scoreManager.reset();
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  private loop = (currentTime: number): void => {
    const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.05);
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private update(deltaTime: number): void {
    if (this.screen !== "playing") return;

    this.player.update(deltaTime, this.canvas.height);
    this.obstacles.update(deltaTime, this.scoreManager.getSpeed());
    this.background.update(deltaTime, this.scoreManager.getSpeed());
    this.scoreManager.update(deltaTime);

    // Check collisions
    const playerBounds = this.player.getBounds();
    const hitObstacle = CollisionDetector.checkAnyCollision(
      playerBounds,
      this.obstacles.getObstacles()
    );

    if (hitObstacle) {
      this.screen = "gameover";
      this.scoreManager.gameOver();
      if (this.onGameOver) {
        this.onGameOver(this.scoreManager.getScore());
      }
    }

    // Update score callback
    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.scoreManager.getScore());
    }
  }

  private render(): void {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);

    if (this.screen === "start") {
      this.renderStartScreen();
    } else {
      this.background.render(this.ctx);
      this.obstacles.render(this.ctx);
      this.player.render(this.ctx);
      this.scoreManager.render(this.ctx, width);
    }
  }

  private renderStartScreen(): void {
    // Background
    this.background.render(this.ctx);

    // Overlay
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Title
    this.ctx.save();
    this.ctx.textAlign = "center";

    // Title shadow
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.font = "bold 36px monospace";
    this.ctx.fillText("SHELBY'S LEDGER", this.canvas.width / 2 + 2, 102);

    // Title
    this.ctx.fillStyle = "#c9a84c";
    this.ctx.font = "bold 36px monospace";
    this.ctx.fillText("SHELBY'S LEDGER", this.canvas.width / 2, 100);

    // Subtitle
    this.ctx.fillStyle = "#e0e0e0";
    this.ctx.font = "18px monospace";
    this.ctx.fillText("BIRMINGHAM ESCAPE", this.canvas.width / 2, 130);

    // Instructions
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    this.ctx.font = "14px monospace";
    this.ctx.fillText("Press SPACE or Tap to Jump", this.canvas.width / 2, 200);
    this.ctx.fillText("Dodge factory pipes & police blockades", this.canvas.width / 2, 220);

    // Start prompt
    this.ctx.fillStyle = "#c9a84c";
    this.ctx.font = "bold 16px monospace";
    this.ctx.fillText("[ TAP TO START ]", this.canvas.width / 2, 280);

    // High score
    if (this.scoreManager.state.highScore > 0) {
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      this.ctx.font = "12px monospace";
      this.ctx.fillText(`High Score: ${this.scoreManager.state.highScore}`, this.canvas.width / 2, 320);
    }

    this.ctx.restore();
  }

  destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
    }
  }
}