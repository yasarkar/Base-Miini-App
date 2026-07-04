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

    // Distressed dark border outline
    ctx.strokeStyle = "#121315";
    ctx.lineWidth = 2.5;

    if (type === "pipe") {
      // Factory metallic pipe with linear steel-to-amber gradients
      const pipeGrad = ctx.createLinearGradient(x, y, x + width, y);
      pipeGrad.addColorStop(0, "#2d241e");
      pipeGrad.addColorStop(0.3, "#4b5563");
      pipeGrad.addColorStop(0.7, "#b45309");
      pipeGrad.addColorStop(1, "#121315");
      ctx.fillStyle = pipeGrad;
      
      ctx.fillRect(x, y, width, height);
      ctx.strokeRect(x, y, width, height);

      // Pipe top rim
      const rimGrad = ctx.createLinearGradient(x - 3, y, x + width + 3, y);
      rimGrad.addColorStop(0, "#121315");
      rimGrad.addColorStop(0.5, "#4b5563");
      rimGrad.addColorStop(1, "#121315");
      ctx.fillStyle = rimGrad;
      ctx.fillRect(x - 3, y - 4, width + 6, 8);
      ctx.strokeRect(x - 3, y - 4, width + 6, 8);

      // Pipe rivets
      ctx.fillStyle = "#b45309";
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(x + width / 2, y + 12 + i * 18, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Steam effect
      ctx.fillStyle = "rgba(75, 85, 99, 0.15)";
      ctx.beginPath();
      ctx.arc(x + width / 2, y - 10, 12, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Brick stone blockade roadblock
      const brickGrad = ctx.createLinearGradient(x, y, x, y + height);
      brickGrad.addColorStop(0, "#2d241e");
      brickGrad.addColorStop(1, "#121315");
      ctx.fillStyle = brickGrad;
      
      ctx.fillRect(x, y, width, height);
      ctx.strokeRect(x, y, width, height);

      // Mortar lines
      ctx.strokeStyle = "#4b5563";
      ctx.lineWidth = 1.5;
      
      // Horizontal joints
      const rowH = 10;
      for (let by = y + rowH; by < y + height; by += rowH) {
        ctx.beginPath();
        ctx.moveTo(x, by);
        ctx.lineTo(x + width, by);
        ctx.stroke();
      }
      
      // Vertical joints (alternating offset)
      let rowIndex = 0;
      for (let by = y; by < y + height; by += rowH) {
        const rowOffset = rowIndex % 2 === 0 ? 0 : 10;
        for (let bx = x + rowOffset; bx < x + width; bx += 20) {
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(bx, by + rowH);
          ctx.stroke();
        }
        rowIndex++;
      }

      // Stop text
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      
      ctx.fillStyle = "#121315";
      ctx.fillText("STOP", x + width / 2 + 1, y + height - 8 + 1);
      
      ctx.fillStyle = "#b45309";
      ctx.fillText("STOP", x + width / 2, y + height - 8);
    }

    ctx.restore();
  }

  getObstacles(): Obstacle[] {
    return this.obstacles;
  }
}