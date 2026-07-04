import { GAME_CONFIG, COLORS } from "@/lib/constants";
import type { BackgroundLayer } from "./types";

export class BackgroundRenderer {
  private layers: BackgroundLayer[] = [];
  private canvasWidth: number;
  private canvasHeight: number;
  private buildings: Array<{ x: number; width: number; height: number; color: string }> = [];
  private readonly BUILDING_COUNT = 12;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.layers = [
      { x: 0, speed: 0.1, color: "#0f3460", height: canvasHeight * 0.4 },
      { x: 0, speed: 0.3, color: "#16213e", height: canvasHeight * 0.3 },
      { x: 0, speed: 0.5, color: "#1a1a2e", height: canvasHeight * 0.2 },
    ];

    this.generateBuildings();
  }

  private generateBuildings(): void {
    this.buildings = [];
    const spacing = this.canvasWidth / (this.BUILDING_COUNT - 1);
    const groundY = this.canvasHeight - GAME_CONFIG.groundHeight;

    for (let i = 0; i < this.BUILDING_COUNT; i++) {
      const width = 30 + Math.random() * 50;
      const height = 40 + Math.random() * 100;
      this.buildings.push({
        x: i * spacing,
        width,
        height,
        color: `hsl(220, 30%, ${10 + Math.random() * 15}%)`,
      });
    }
  }

  reset(): void {
    this.layers.forEach((layer) => (layer.x = 0));
    this.generateBuildings();
  }

  update(deltaTime: number, speed: number): void {
    for (const layer of this.layers) {
      layer.x -= speed * layer.speed * deltaTime;
      if (layer.x <= -this.canvasWidth) {
        layer.x += this.canvasWidth;
      }
    }

    // Move buildings
    for (const building of this.buildings) {
      building.x -= speed * 0.2 * deltaTime;
      if (building.x + building.width < 0) {
        building.x = this.canvasWidth + Math.random() * 100;
        building.width = 30 + Math.random() * 50;
        building.height = 40 + Math.random() * 100;
        building.color = `hsl(220, 30%, ${10 + Math.random() * 15}%)`;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const groundY = this.canvasHeight - GAME_CONFIG.groundHeight;

    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, groundY);
    gradient.addColorStop(0, COLORS.skyTop);
    gradient.addColorStop(0.6, COLORS.sky);
    gradient.addColorStop(1, "#0d1b2a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.canvasWidth, groundY);

    // Stars
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    const starSeed = 42;
    for (let i = 0; i < 30; i++) {
      const sx = ((i * 137.5 + starSeed) % this.canvasWidth);
      const sy = ((i * 97.3 + starSeed) % (groundY * 0.6));
      const size = 1 + (i % 3);
      ctx.fillRect(sx, sy, size, size);
    }

    // Moon
    ctx.fillStyle = "rgba(200, 180, 120, 0.8)";
    ctx.beginPath();
    ctx.arc(this.canvasWidth - 100, 50, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(200, 180, 120, 0.1)";
    ctx.beginPath();
    ctx.arc(this.canvasWidth - 100, 50, 35, 0, Math.PI * 2);
    ctx.fill();

    // Factory buildings (silhouettes)
    this.buildings.forEach((building, index) => {
      ctx.fillStyle = building.color;
      ctx.fillRect(building.x, groundY - building.height, building.width, building.height);

      // Windows
      ctx.fillStyle = "rgba(255, 200, 50, 0.3)";
      for (let wy = groundY - building.height + 10; wy < groundY - 10; wy += 15) {
        for (let wx = building.x + 5; wx < building.x + building.width - 5; wx += 12) {
          if (Math.random() > 0.3) {
            ctx.fillRect(wx, wy, 6, 8);
          }
        }
      }

      // Factory chimney
      if (index % 3 === 0) {
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(building.x + building.width / 2 - 3, groundY - building.height - 20, 6, 20);
        // Smoke
        ctx.fillStyle = "rgba(100, 100, 100, 0.15)";
        ctx.beginPath();
        ctx.arc(building.x + building.width / 2, groundY - building.height - 25, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Ground
    ctx.fillStyle = COLORS.ground;
    ctx.fillRect(0, groundY, this.canvasWidth, GAME_CONFIG.groundHeight);

    // Ground line
    ctx.fillStyle = COLORS.groundLine;
    ctx.fillRect(0, groundY, this.canvasWidth, 2);

    // Railroad tracks on ground
    ctx.strokeStyle = "#5a4a3a";
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const trackY = groundY + 15 + i * 12;
      ctx.beginPath();
      ctx.moveTo(0, trackY);
      ctx.lineTo(this.canvasWidth, trackY);
      ctx.stroke();
    }

    // Railroad ties
    ctx.fillStyle = "#3d2b1f";
    const tieSpacing = 30;
    for (let x = 0; x < this.canvasWidth; x += tieSpacing) {
      ctx.fillRect(x, groundY + 12, 4, 30);
    }
  }
}