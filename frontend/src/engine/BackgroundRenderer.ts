import { GAME_CONFIG, COLORS } from "@/lib/constants";
import type { BackgroundLayer } from "./types";

export class BackgroundRenderer {
  private layers: BackgroundLayer[] = [];
  private canvasWidth: number;
  private canvasHeight: number;
  private buildings: Array<{ x: number; width: number; height: number; color: string }> = [];
  private clouds: Array<{ x: number; y: number; scale: number; speed: number }> = [];
  private groundX: number = 0;
  private readonly BUILDING_COUNT = 12;
  private readonly CLOUD_COUNT = 5;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Background layers speed setup
    this.layers = [
      { x: 0, speed: 0.1, color: "rgba(100, 100, 100, 0.1)", height: canvasHeight * 0.4 },
      { x: 0, speed: 0.4, color: "#121315", height: canvasHeight * 0.3 },
      { x: 0, speed: 1.0, color: "#2d241e", height: GAME_CONFIG.groundHeight },
    ];

    this.generateBuildings();
    this.generateClouds();
  }

  private generateBuildings(): void {
    this.buildings = [];
    const spacing = this.canvasWidth / (this.BUILDING_COUNT - 1);
    const groundY = this.canvasHeight - GAME_CONFIG.groundHeight;

    for (let i = 0; i < this.BUILDING_COUNT; i++) {
      const width = 45 + Math.random() * 60;
      const height = 60 + Math.random() * 120;
      this.buildings.push({
        x: i * spacing,
        width,
        height,
        color: `hsl(220, 15%, ${8 + Math.random() * 8}%)`,
      });
    }
  }

  private generateClouds(): void {
    this.clouds = [];
    const spacing = this.canvasWidth / this.CLOUD_COUNT;
    for (let i = 0; i < this.CLOUD_COUNT; i++) {
      this.clouds.push({
        x: i * spacing + Math.random() * 50,
        y: 20 + Math.random() * 80,
        scale: 0.8 + Math.random() * 0.8,
        speed: 0.05 + Math.random() * 0.05,
      });
    }
  }

  reset(): void {
    this.groundX = 0;
    this.layers.forEach((layer) => (layer.x = 0));
    this.generateBuildings();
    this.generateClouds();
  }

  update(deltaTime: number, speed: number): void {
    // Parallax clouds movement (0.1x)
    for (const cloud of this.clouds) {
      cloud.x -= speed * 0.1 * deltaTime;
      if (cloud.x + 100 * cloud.scale < 0) {
        cloud.x = this.canvasWidth + 50;
        cloud.y = 20 + Math.random() * 80;
        cloud.scale = 0.8 + Math.random() * 0.8;
      }
    }

    // Parallax buildings movement (0.4x)
    for (const building of this.buildings) {
      building.x -= speed * 0.4 * deltaTime;
      if (building.x + building.width < 0) {
        building.x = this.canvasWidth + Math.random() * 50;
        building.width = 45 + Math.random() * 60;
        building.height = 60 + Math.random() * 120;
        building.color = `hsl(220, 15%, ${8 + Math.random() * 8}%)`;
      }
    }

    // Foreground cobblestone ground movement (1.0x)
    this.groundX -= speed * 1.0 * deltaTime;
    if (this.groundX <= -44) {
      this.groundX += 44;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const groundY = this.canvasHeight - GAME_CONFIG.groundHeight;

    // Gritty industrial sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
    skyGrad.addColorStop(0, "#121315");
    skyGrad.addColorStop(0.5, "#2d241e");
    skyGrad.addColorStop(1, "#181a1e");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.canvasWidth, groundY);

    // Drifting smog clouds (0.1x layer)
    ctx.fillStyle = "rgba(180, 83, 9, 0.04)";
    for (const cloud of this.clouds) {
      ctx.beginPath();
      const cx = cloud.x;
      const cy = cloud.y;
      const s = cloud.scale;
      ctx.arc(cx, cy, 30 * s, 0, Math.PI * 2);
      ctx.arc(cx + 25 * s, cy - 10 * s, 35 * s, 0, Math.PI * 2);
      ctx.arc(cx + 50 * s, cy, 25 * s, 0, Math.PI * 2);
      ctx.fill();
    }

    // floating soot particles
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    for (let i = 0; i < 20; i++) {
      const sx = ((i * 149.3) % this.canvasWidth);
      const sy = ((i * 73.1) % (groundY * 0.7));
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }

    // Mid-ground Factory buildings (0.4x layer)
    this.buildings.forEach((building, index) => {
      ctx.fillStyle = building.color;
      ctx.fillRect(building.x, groundY - building.height, building.width, building.height);

      ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(building.x, groundY - building.height, building.width, building.height);

      // Windows (Garrison amber glow)
      ctx.fillStyle = "rgba(180, 83, 9, 0.25)";
      for (let wy = groundY - building.height + 15; wy < groundY - 15; wy += 20) {
        for (let wx = building.x + 8; wx < building.x + building.width - 8; wx += 15) {
          if ((wx + wy) % 3 !== 0) {
            ctx.fillRect(wx, wy, 5, 8);
          }
        }
      }

      // Chimney stack
      if (index % 3 === 0) {
        const stackW = 8;
        const stackH = 25;
        const stackX = building.x + building.width / 2 - stackW / 2;
        const stackY = groundY - building.height - stackH;

        ctx.fillStyle = "#121315";
        ctx.fillRect(stackX, stackY, stackW, stackH);

        // Tip highlight
        ctx.fillStyle = "#b45309";
        ctx.fillRect(stackX - 1, stackY, stackW + 2, 2);

        // Industrial smoke
        ctx.fillStyle = "rgba(75, 85, 99, 0.12)";
        ctx.beginPath();
        ctx.arc(stackX + stackW / 2, stackY - 6, 8, 0, Math.PI * 2);
        ctx.arc(stackX + stackW / 2 + 5, stackY - 14, 11, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Foreground Brick / Cobblestone Ground (1.0x layer)
    ctx.fillStyle = "#121315";
    ctx.fillRect(0, groundY, this.canvasWidth, GAME_CONFIG.groundHeight);

    ctx.fillStyle = "#2d241e";
    const cobWidth = 40;
    const cobHeight = 10;
    for (let gy = groundY + 2; gy < this.canvasHeight; gy += cobHeight + 2) {
      const rowOffset = ((gy - groundY) / 12) % 2 === 0 ? 0 : 20;
      for (let gx = this.groundX - cobWidth + rowOffset; gx < this.canvasWidth + cobWidth; gx += cobWidth + 4) {
        ctx.fillRect(gx, gy, cobWidth, cobHeight);

        // Highlight
        ctx.fillStyle = "#4b5563";
        ctx.fillRect(gx, gy, cobWidth, 1.5);

        // Shadow
        ctx.fillStyle = "#121315";
        ctx.fillRect(gx, gy + cobHeight - 1.5, cobWidth, 1.5);
        
        ctx.fillStyle = "#2d241e";
      }
    }

    // Border line
    ctx.fillStyle = "#b45309";
    ctx.fillRect(0, groundY, this.canvasWidth, 2.5);
  }
}