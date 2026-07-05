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

    // Charcoal outline
    ctx.strokeStyle = "#09090b";
    ctx.lineWidth = 2.5;

    if (type === "pipe") {
      // Iron factory venting pipe with linear gradients
      const pipeGrad = ctx.createLinearGradient(x, y, x + width, y);
      pipeGrad.addColorStop(0, "#0d0d10");
      pipeGrad.addColorStop(0.25, "#3a3f4a");
      pipeGrad.addColorStop(0.55, "#c59b27"); // polished brass highlight
      pipeGrad.addColorStop(0.85, "#1f1814"); // rust shadow
      pipeGrad.addColorStop(1, "#070709");
      ctx.fillStyle = pipeGrad;
      
      ctx.fillRect(x, y, width, height);
      ctx.strokeRect(x, y, width, height);

      // Pipe top rim
      const rimGrad = ctx.createLinearGradient(x - 3, y, x + width + 3, y);
      rimGrad.addColorStop(0, "#09090b");
      rimGrad.addColorStop(0.5, "#4b5563");
      rimGrad.addColorStop(1, "#09090b");
      ctx.fillStyle = rimGrad;
      ctx.fillRect(x - 3, y - 5, width + 6, 9);
      ctx.strokeRect(x - 3, y - 5, width + 6, 9);

      // Rusty copper rivets along the pipe column
      ctx.fillStyle = "#a07415";
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(x + width / 2, y + 10 + i * 16, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Dynamic animated venting steam puff loop
      const time = performance.now() * 0.003;
      for (let i = 0; i < 3; i++) {
        const offset = (time + i * 0.45) % 1.25;
        const size = 11 + offset * 16;
        const alpha = (1.25 - offset) * 0.28;
        ctx.fillStyle = `rgba(130, 135, 145, ${alpha})`;
        ctx.beginPath();
        ctx.arc(
          x + width / 2 - offset * 18,
          y - 8 - offset * 28,
          size,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    } else {
      // 1920s police warning barricade
      // Barricade legs/posts (weathered wood)
      ctx.fillStyle = "#221a15"; // Garrison wood
      ctx.fillRect(x + 4, y, 6, height);
      ctx.strokeRect(x + 4, y, 6, height);
      ctx.fillRect(x + width - 10, y, 6, height);
      ctx.strokeRect(x + width - 10, y, 6, height);

      // Horizontal plank
      const plankH = 20;
      const plankY = y + 8;
      ctx.fillStyle = "#0f1012";
      ctx.fillRect(x, plankY, width, plankH);
      ctx.strokeRect(x, plankY, width, plankH);

      // 1920s hazard stripes on plank (gold and black stripes)
      ctx.save();
      ctx.beginPath();
      ctx.rect(x + 1, plankY + 1, width - 2, plankH - 2);
      ctx.clip();
      
      ctx.fillStyle = "#c59b27"; // Garrison gold stripes
      for (let sx = x - 20; sx < x + width + 20; sx += 18) {
        ctx.beginPath();
        ctx.moveTo(sx, plankY);
        ctx.lineTo(sx + 10, plankY);
        ctx.lineTo(sx - 2, plankY + plankH);
        ctx.lineTo(sx - 12, plankY + plankH);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Rusty center plate (STOP sign)
      const signW = 32;
      const signH = 14;
      const signX = x + width / 2 - signW / 2;
      const signY = plankY + plankH / 2 - signH / 2;
      
      const signGrad = ctx.createLinearGradient(signX, signY, signX, signY + signH);
      signGrad.addColorStop(0, "#a0281c"); // deep blood/rust red
      signGrad.addColorStop(1, "#5a0f0a");
      ctx.fillStyle = signGrad;
      ctx.fillRect(signX, signY, signW, signH);
      ctx.strokeRect(signX, signY, signW, signH);

      // Tiny sign rivets
      ctx.fillStyle = "#c59b27";
      ctx.beginPath();
      ctx.arc(signX + 1.5, signY + 1.5, 1, 0, Math.PI * 2);
      ctx.arc(signX + signW - 1.5, signY + 1.5, 1, 0, Math.PI * 2);
      ctx.arc(signX + 1.5, signY + signH - 1.5, 1, 0, Math.PI * 2);
      ctx.arc(signX + signW - 1.5, signY + signH - 1.5, 1, 0, Math.PI * 2);
      ctx.fill();

      // Warning text (HALT)
      ctx.font = "bold 8px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "#09090b";
      ctx.fillText("HALT", x + width / 2 + 0.5, signY + signH - 3.5 + 0.5);
      
      ctx.fillStyle = "#e3e3e8";
      ctx.fillText("HALT", x + width / 2, signY + signH - 3.5);
    }

    ctx.restore();
  }

  getObstacles(): Obstacle[] {
    return this.obstacles;
  }
}