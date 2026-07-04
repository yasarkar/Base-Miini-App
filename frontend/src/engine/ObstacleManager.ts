import { OBSTACLE, GAME_CONFIG, COLORS } from "@/lib/constants";
import type { Obstacle } from "./types";

export class ObstacleManager {
  public obstacles: Obstacle[] = [];
  private spawnTimer: number = 0;
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  reset(): void {
    this.obstacles = [];
    this.spawnTimer = 0;
  }

  update(deltaTime: number, speed: number): void {
    // Spawn new obstacles
    this.spawnTimer += deltaTime;
    const interval = Math.max(0.8, GAME_CONFIG.obstacleSpawnInterval - speed * 0.001);

    if (this.spawnTimer >= interval) {
      this.spawnTimer = 0;
      this.spawnObstacle();
    }

    // Move obstacles
    for (const obstacle of this.obstacles) {
      obstacle.x -= speed * deltaTime;
    }

    // Remove off-screen obstacles
    this.obstacles = this.obstacles.filter((o) => o.x + o.width > -50);
  }

  private spawnObstacle(): void {
    const type: "pipe" | "barricade" = Math.random() > 0.5 ? "pipe" : "barricade";
    const groundY = this.canvasHeight - GAME_CONFIG.groundHeight;

    let width: number, height: number;

    if (type === "pipe") {
      width = OBSTACLE.pipeWidth;
      height = OBSTACLE.pipeHeight;
    } else {
      width = OBSTACLE.barricadeWidth;
      height = OBSTACLE.barricadeHeight;
    }

    this.obstacles.push({
      x: this.canvasWidth,
      y: groundY - height,
      width,
      height,
      type,
      passed: false,
    });
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const obstacle of this.obstacles) {
      this.renderObstacle(ctx, obstacle);
    }
  }

  private renderObstacle(ctx: CanvasRenderingContext2D, obstacle: Obstacle): void {
    const { x, y, width, height, type } = obstacle;

    ctx.save();

    if (type === "pipe") {
      // Factory pipe
      ctx.fillStyle = COLORS.pipe;
      ctx.fillRect(x, y, width, height);

      // Pipe highlight
      ctx.fillStyle = COLORS.pipeHighlight;
      ctx.fillRect(x + 4, y, 6, height);

      // Pipe top rim
      ctx.fillStyle = "#6c7a7d";
      ctx.fillRect(x - 3, y - 4, width + 6, 8);

      // Pipe rivets
      ctx.fillStyle = "#5a6869";
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(x + width / 2, y + 10 + i * 15, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Steam effect
      ctx.fillStyle = "rgba(200, 200, 200, 0.15)";
      ctx.beginPath();
      ctx.arc(x + width / 2, y - 10, 12, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Police barricade
      ctx.fillStyle = COLORS.barricade;
      ctx.fillRect(x, y, width, height);

      // Stripes
      ctx.fillStyle = COLORS.barricadeStripe;
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(x + 4, y + 4 + i * 12, width - 8, 6);
      }

      // Barricade legs
      ctx.fillStyle = "#8e44ad";
      ctx.fillRect(x + 4, y + height, 6, 8);
      ctx.fillRect(x + width - 10, y + height, 6, 8);

      // "POLICE" text
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 8px monospace";
      ctx.textAlign = "center";
      ctx.fillText("POLICE", x + width / 2, y + height - 8);
    }

    ctx.restore();
  }

  getObstacles(): Obstacle[] {
    return this.obstacles;
  }
}