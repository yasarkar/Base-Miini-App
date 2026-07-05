import { GAME_CONFIG, COLORS } from "@/lib/constants";
import type { BackgroundLayer } from "./types";

interface RainDrop {
  x: number;
  y: number;
  speed: number;
  length: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
}

export class BackgroundRenderer {
  private layers: BackgroundLayer[] = [];
  private canvasWidth: number;
  private canvasHeight: number;
  private buildings: Array<{ x: number; width: number; height: number; color: string }> = [];
  private clouds: Array<{ x: number; y: number; scale: number; speed: number }> = [];
  private rainDrops: RainDrop[] = [];
  private sparks: Spark[] = [];
  private groundX: number = 0;
  private readonly BUILDING_COUNT = 12;
  private readonly CLOUD_COUNT = 5;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Background layers speed setup
    this.layers = [
      { x: 0, speed: 0.1, color: "rgba(80, 80, 85, 0.08)", height: canvasHeight * 0.4 },
      { x: 0, speed: 0.4, color: "#0d0d10", height: canvasHeight * 0.3 },
      { x: 0, speed: 1.0, color: "#1a120e", height: GAME_CONFIG.groundHeight },
    ];

    this.generateBuildings();
    this.generateClouds();
    this.generateRain();
    this.generateSparks();
  }

  private generateBuildings(): void {
    this.buildings = [];
    const spacing = this.canvasWidth / (this.BUILDING_COUNT - 1);

    for (let i = 0; i < this.BUILDING_COUNT; i++) {
      const width = 50 + Math.random() * 70;
      const height = 70 + Math.random() * 130;
      this.buildings.push({
        x: i * spacing,
        width,
        height,
        color: `hsl(220, 12%, ${5 + Math.random() * 7}%)`, // deeper dark coal color
      });
    }
  }

  private generateClouds(): void {
    this.clouds = [];
    const spacing = this.canvasWidth / this.CLOUD_COUNT;
    for (let i = 0; i < this.CLOUD_COUNT; i++) {
      this.clouds.push({
        x: i * spacing + Math.random() * 50,
        y: 15 + Math.random() * 90,
        scale: 1.0 + Math.random() * 1.0,
        speed: 0.04 + Math.random() * 0.04,
      });
    }
  }

  private generateRain(): void {
    this.rainDrops = [];
    for (let i = 0; i < 45; i++) {
      this.rainDrops.push({
        x: Math.random() * this.canvasWidth,
        y: Math.random() * this.canvasHeight,
        speed: 400 + Math.random() * 200,
        length: 12 + Math.random() * 16,
      });
    }
  }

  private generateSparks(): void {
    this.sparks = [];
    for (let i = 0; i < 20; i++) {
      this.sparks.push(this.createSpark(Math.random() * this.canvasWidth, true));
    }
  }

  private createSpark(startX: number, randomizeY = false): Spark {
    const groundY = this.canvasHeight - GAME_CONFIG.groundHeight;
    const colors = ["#c59b27", "#a07415", "#8c6a12", "#e35e20", "#4b4a4c"]; // embers + soot ash
    return {
      x: startX,
      y: randomizeY ? Math.random() * groundY : groundY - 2,
      vx: -40 - Math.random() * 60,
      vy: -50 - Math.random() * 80,
      size: 1 + Math.random() * 2.2,
      alpha: 0.3 + Math.random() * 0.6,
      life: 0,
      maxLife: 1.5 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  }

  reset(): void {
    this.groundX = 0;
    this.layers.forEach((layer) => (layer.x = 0));
    this.generateBuildings();
    this.generateClouds();
    this.generateRain();
    this.generateSparks();
  }

  update(deltaTime: number, speed: number): void {
    // Parallax clouds movement (0.1x)
    for (const cloud of this.clouds) {
      cloud.x -= speed * 0.1 * deltaTime;
      if (cloud.x + 150 * cloud.scale < 0) {
        cloud.x = this.canvasWidth + 80;
        cloud.y = 15 + Math.random() * 90;
        cloud.scale = 1.0 + Math.random() * 1.0;
      }
    }

    // Parallax buildings movement (0.4x)
    for (const building of this.buildings) {
      building.x -= speed * 0.4 * deltaTime;
      if (building.x + building.width < 0) {
        building.x = this.canvasWidth + Math.random() * 40;
        building.width = 50 + Math.random() * 70;
        building.height = 70 + Math.random() * 130;
        building.color = `hsl(220, 12%, ${5 + Math.random() * 7}%)`;
      }
    }

    // Rain movement (independent wind speed)
    for (const drop of this.rainDrops) {
      drop.y += drop.speed * deltaTime;
      drop.x -= drop.speed * 0.18 * deltaTime; // rain angle
      if (drop.y > this.canvasHeight) {
        drop.y = -20;
        drop.x = Math.random() * (this.canvasWidth + 100);
      }
    }

    // Sparks & soot particle movement
    for (const spark of this.sparks) {
      spark.x += spark.vx * deltaTime;
      spark.y += spark.vy * deltaTime;
      spark.life += deltaTime;
      // Fade out slowly
      spark.alpha = Math.max(0, (1 - spark.life / spark.maxLife) * 0.9);

      if (spark.life >= spark.maxLife || spark.y < 0 || spark.x < -10) {
        Object.assign(spark, this.createSpark(this.canvasWidth + Math.random() * 50));
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

    // Gritty industrial sky gradient (darker and colder)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
    skyGrad.addColorStop(0, "#08080a");
    skyGrad.addColorStop(0.5, "#181412");
    skyGrad.addColorStop(1, "#121215");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.canvasWidth, groundY);

    // Drifting smog clouds (0.1x layer) - warmer rust-colored industrial smog
    ctx.fillStyle = "rgba(197, 155, 39, 0.035)";
    for (const cloud of this.clouds) {
      ctx.beginPath();
      const cx = cloud.x;
      const cy = cloud.y;
      const s = cloud.scale;
      ctx.arc(cx, cy, 35 * s, 0, Math.PI * 2);
      ctx.arc(cx + 30 * s, cy - 12 * s, 42 * s, 0, Math.PI * 2);
      ctx.arc(cx + 60 * s, cy, 30 * s, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mid-ground Factory buildings (0.4x layer)
    this.buildings.forEach((building, index) => {
      ctx.fillStyle = building.color;
      ctx.fillRect(building.x, groundY - building.height, building.width, building.height);

      ctx.strokeStyle = "rgba(0, 0, 0, 0.75)";
      ctx.lineWidth = 2;
      ctx.strokeRect(building.x, groundY - building.height, building.width, building.height);

      // Windows (Warmer Brass Amber glow with soft inner shadow feel)
      ctx.fillStyle = "rgba(197, 155, 39, 0.4)";
      for (let wy = groundY - building.height + 15; wy < groundY - 15; wy += 20) {
        for (let wx = building.x + 8; wx < building.x + building.width - 8; wx += 15) {
          if ((wx + wy) % 3 !== 0) {
            ctx.fillRect(wx, wy, 5, 8);
            
            // Subtle window light glow
            ctx.fillStyle = "rgba(197, 155, 39, 0.08)";
            ctx.beginPath();
            ctx.arc(wx + 2.5, wy + 4, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(197, 155, 39, 0.4)";
          }
        }
      }

      // Chimney stack
      if (index % 3 === 0) {
        const stackW = 8;
        const stackH = 30;
        const stackX = building.x + building.width / 2 - stackW / 2;
        const stackY = groundY - building.height - stackH;

        ctx.fillStyle = "#0a0a0d";
        ctx.fillRect(stackX, stackY, stackW, stackH);

        // Tip copper highlight
        ctx.fillStyle = "#c59b27";
        ctx.fillRect(stackX - 1, stackY, stackW + 2, 2.5);

        // Industrial smoke plume (drifting wind effect)
        ctx.fillStyle = "rgba(60, 60, 65, 0.15)";
        ctx.beginPath();
        ctx.arc(stackX + stackW / 2 - 5, stackY - 8, 9, 0, Math.PI * 2);
        ctx.arc(stackX + stackW / 2 - 15, stackY - 16, 13, 0, Math.PI * 2);
        ctx.arc(stackX + stackW / 2 - 28, stackY - 22, 17, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // WET REFLECTIONS (Rendered before the cobblestone lines are layered over)
    ctx.save();
    this.buildings.forEach((building) => {
      const reflectionGrad = ctx.createLinearGradient(0, groundY, 0, this.canvasHeight);
      reflectionGrad.addColorStop(0, "rgba(197, 155, 39, 0.18)");
      reflectionGrad.addColorStop(0.4, "rgba(197, 155, 39, 0.06)");
      reflectionGrad.addColorStop(1, "transparent");
      ctx.fillStyle = reflectionGrad;
      // Draw vertical reflection matching window coordinates
      ctx.fillRect(building.x + 6, groundY, building.width - 12, GAME_CONFIG.groundHeight);
    });
    ctx.restore();

    // Foreground Cobblestone Ground (1.0x layer)
    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, groundY, this.canvasWidth, GAME_CONFIG.groundHeight);

    ctx.fillStyle = "#1e1612"; // Deep brown brick mortar
    const cobWidth = 44;
    const cobHeight = 11;
    for (let gy = groundY + 2; gy < this.canvasHeight; gy += cobHeight + 2) {
      const rowOffset = ((gy - groundY) / 13) % 2 === 0 ? 0 : 22;
      for (let gx = this.groundX - cobWidth + rowOffset; gx < this.canvasWidth + cobWidth; gx += cobWidth + 4) {
        ctx.fillRect(gx, gy, cobWidth, cobHeight);

        // Wet Cobble Sheen (Highlight at top of bricks)
        ctx.fillStyle = "rgba(120, 130, 150, 0.28)"; // Soot-steel reflection highlight
        ctx.fillRect(gx, gy, cobWidth, 1.5);

        // Bottom dark mortar shadow
        ctx.fillStyle = "#060608";
        ctx.fillRect(gx, gy + cobHeight - 1.5, cobWidth, 1.5);
        
        ctx.fillStyle = "#1e1612";
      }
    }

    // Brass Plated border line dividing sky and cobblestones
    ctx.fillStyle = "#c59b27";
    ctx.fillRect(0, groundY, this.canvasWidth, 3);
    // Subtle glow on the metal strip
    ctx.fillStyle = "rgba(197, 155, 39, 0.35)";
    ctx.fillRect(0, groundY + 3, this.canvasWidth, 1);

    // Sparks & Coal particles drifting upwards
    ctx.save();
    for (const spark of this.sparks) {
      ctx.fillStyle = spark.color;
      ctx.globalAlpha = spark.alpha;
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Rain overlays
    ctx.save();
    ctx.strokeStyle = "rgba(174, 196, 222, 0.16)"; // cold rain blue-gray
    ctx.lineWidth = 1;
    for (const drop of this.rainDrops) {
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - 2.5, drop.y + drop.length);
      ctx.stroke();
    }
    ctx.restore();
  }
}