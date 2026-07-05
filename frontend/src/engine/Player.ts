import { PLAYER, GAME_CONFIG, COLORS } from "@/lib/constants";
import type { PlayerState } from "./types";

interface SplashParticle {
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

export class Player {
  public state: PlayerState;
  private runFrameTimer: number = 0;
  private readonly RUN_FRAME_INTERVAL = 0.14;
  private readonly RUN_FRAMES = 4;
  private splashes: SplashParticle[] = [];

  constructor(canvasHeight: number) {
    let unlocked = false;
    try {
      unlocked = typeof window !== "undefined" && localStorage.getItem("shelby_flat_cap_unlocked") === "true";
    } catch (e) {
      console.error("Failed to read flat cap state:", e);
    }

    this.state = {
      x: PLAYER.x,
      y: canvasHeight - GAME_CONFIG.groundHeight - PLAYER.height,
      width: PLAYER.width,
      height: PLAYER.height,
      velocityY: 0,
      isJumping: false,
      isGrounded: true,
      frame: 0,
      hasFlatCap: unlocked,
    };
  }

  reset(canvasHeight: number): void {
    this.state.y = canvasHeight - GAME_CONFIG.groundHeight - PLAYER.height;
    this.state.velocityY = 0;
    this.state.isJumping = false;
    this.state.isGrounded = true;
    this.state.frame = 0;
    this.runFrameTimer = 0;
    this.splashes = [];
    try {
      this.state.hasFlatCap = typeof window !== "undefined" && localStorage.getItem("shelby_flat_cap_unlocked") === "true";
    } catch (e) {
      console.error("Failed to read flat cap state:", e);
    }
  }

  jump(): void {
    if (!this.state.isGrounded) return;
    this.state.velocityY = GAME_CONFIG.jumpForce;
    this.state.isJumping = true;
    this.state.isGrounded = false;

    // Jumping kick-off splash
    const groundY = this.state.y + this.state.height;
    for (let i = 0; i < 6; i++) {
      this.splashes.push({
        x: this.state.x + 6 + Math.random() * 12,
        y: groundY - 4,
        vx: -80 - Math.random() * 50,
        vy: -30 - Math.random() * 40,
        size: 1.5 + Math.random() * 2,
        alpha: 0.7,
        life: 0,
        maxLife: 0.3 + Math.random() * 0.2,
        color: "rgba(174, 196, 222, 0.6)",
      });
    }
  }

  update(deltaTime: number, canvasHeight: number): void {
    // Apply gravity
    this.state.velocityY += GAME_CONFIG.gravity * deltaTime;
    this.state.y += this.state.velocityY * deltaTime;

    const groundY = canvasHeight - GAME_CONFIG.groundHeight - this.state.height;

    // Ground collision & landing splash
    if (this.state.y >= groundY) {
      if (this.state.isJumping) {
        // Landing splash!
        for (let i = 0; i < 10; i++) {
          this.splashes.push({
            x: this.state.x + this.state.width / 2 + (Math.random() - 0.5) * 16,
            y: groundY + this.state.height - 4,
            vx: (Math.random() - 0.5) * 120 - 40,
            vy: -40 - Math.random() * 70,
            size: 2 + Math.random() * 2.5,
            alpha: 0.8,
            life: 0,
            maxLife: 0.35 + Math.random() * 0.25,
            color: "rgba(174, 196, 222, 0.75)",
          });
        }
      }
      this.state.y = groundY;
      this.state.velocityY = 0;
      this.state.isJumping = false;
      this.state.isGrounded = true;
    }

    // Ceiling collision
    if (this.state.y < 0) {
      this.state.y = 0;
      this.state.velocityY = 0;
    }

    // Run animation
    if (this.state.isGrounded) {
      this.runFrameTimer += deltaTime;
      if (this.runFrameTimer >= this.RUN_FRAME_INTERVAL) {
        this.runFrameTimer = 0;
        this.state.frame = (this.state.frame + 1) % this.RUN_FRAMES;
      }

      // Spawn rain-water splashes behind feet
      if (Math.random() < 0.25) {
        this.splashes.push({
          x: this.state.x + 4 + Math.random() * 10,
          y: groundY + this.state.height - 3,
          vx: -110 - Math.random() * 50,
          vy: -15 - Math.random() * 25,
          size: 1.2 + Math.random() * 1.8,
          alpha: 0.55,
          life: 0,
          maxLife: 0.25 + Math.random() * 0.15,
          color: "rgba(174, 196, 222, 0.5)",
        });
      }
    } else {
      this.state.frame = 0; // Jumping frame
    }

    // Premium flat cap spark trail
    if (this.state.hasFlatCap && Math.random() < 0.35) {
      this.splashes.push({
        x: this.state.x + 8 + Math.random() * 12,
        y: this.state.y,
        vx: -60 - Math.random() * 30,
        vy: -10 - Math.random() * 20,
        size: 1.5 + Math.random() * 1.5,
        alpha: 0.8,
        life: 0,
        maxLife: 0.4 + Math.random() * 0.3,
        color: Math.random() > 0.5 ? "#c59b27" : "#e35e20", // gold & fire embers
      });
    }

    // Update splash/spark particles
    for (let i = this.splashes.length - 1; i >= 0; i--) {
      const p = this.splashes[i];
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      
      // If it's a splash (water), apply gravity
      if (p.color.startsWith("rgba")) {
        p.vy += 220 * deltaTime;
      } else {
        // Ember/spark floats slightly
        p.vy -= 10 * deltaTime;
      }

      p.life += deltaTime;
      p.alpha = Math.max(0, (1 - p.life / p.maxLife) * 0.8);
      if (p.life >= p.maxLife) {
        this.splashes.splice(i, 1);
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const { x, y, width, height, isJumping, hasFlatCap } = this.state;

    // Draw active splashes/trails first
    ctx.save();
    for (const p of this.splashes) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.save();

    // Dark wet shadow on cobblestones
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(x + 2, y + height - 2, width, 4);

    // Bold charcoal outlines
    ctx.strokeStyle = "#09090b";
    ctx.lineWidth = 2.5;

    // Body/Coat (gradient: dark mahogany wood/whiskey to charcoal black)
    const coatGrad = ctx.createLinearGradient(x + 5, y + 15, x + 5, y + height - 5);
    coatGrad.addColorStop(0, "#221a15"); // Garrison wood
    coatGrad.addColorStop(0.4, "#16161a");
    coatGrad.addColorStop(1, "#09090b");
    ctx.fillStyle = coatGrad;
    ctx.fillRect(x + 5, y + 15, width - 10, height - 20);

    // Pixel scanline shading overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    for (let slY = y + 16; slY < y + height - 6; slY += 4) {
      ctx.fillRect(x + 5, slY, width - 10, 2);
    }
    
    // Stroke outline around the coat
    ctx.strokeRect(x + 5, y + 15, width - 10, height - 20);

    // Coat collar (Gunmetal steel color)
    ctx.fillStyle = "#121215";
    ctx.fillRect(x + 3, y + 12, width - 6, 6);
    ctx.strokeRect(x + 3, y + 12, width - 6, 6);

    // Legs running animation
    const legOffset = isJumping ? 0 : Math.sin(this.state.frame * Math.PI / 2) * 4;
    ctx.fillStyle = "#221a15";
    
    // Left leg
    ctx.fillRect(x + 8, y + height - 15, 8, 15);
    ctx.strokeRect(x + 8, y + height - 15, 8, 15);
    
    // Right leg
    ctx.fillRect(x + width - 16, y + height - 15 + legOffset, 8, 15);
    ctx.strokeRect(x + width - 16, y + height - 15 + legOffset, 8, 15);

    // Head (Classic peach tone)
    ctx.fillStyle = COLORS.playerHead;
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y + 8, 12, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y + 8, 12, 10, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Flat cap (signature Shelby hat)
    const capColor = hasFlatCap ? "#c59b27" : "#3f444f"; // Garrison Amber gold or Industrial Slate
    const capTopColor = hasFlatCap ? "#e5bc4b" : "#5f6676";
    
    ctx.fillStyle = capColor;
    ctx.fillRect(x + 6, y - 2, width - 12, 6);
    ctx.strokeRect(x + 6, y - 2, width - 12, 6);
    
    ctx.fillStyle = capTopColor;
    ctx.fillRect(x + 4, y - 4, width - 8, 3);
    ctx.strokeRect(x + 4, y - 4, width - 8, 3);

    // Cap peak
    ctx.fillStyle = capColor;
    ctx.fillRect(x + width - 14, y - 4, 10, 3);
    ctx.strokeRect(x + width - 14, y - 4, 10, 3);

    // Steel blue eyes
    ctx.fillStyle = "#5c85b8";
    ctx.fillRect(x + 14, y + 5, 4, 4);
    ctx.fillRect(x + 22, y + 5, 4, 4);

    // Intense eyebrows (Shelby stare)
    ctx.strokeStyle = "#09090b";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(x + 12, y + 2.5);
    ctx.lineTo(x + 18, y + 4.5);
    ctx.moveTo(x + 22, y + 4.5);
    ctx.lineTo(x + 28, y + 2.5);
    ctx.stroke();

    ctx.restore();
  }

  getBounds() {
    return {
      x: this.state.x + 4,
      y: this.state.y + 4,
      width: this.state.width - 8,
      height: this.state.height - 6,
    };
  }
}