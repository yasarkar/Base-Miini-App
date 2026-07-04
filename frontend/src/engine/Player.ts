import { PLAYER, GAME_CONFIG, COLORS } from "@/lib/constants";
import type { PlayerState } from "./types";

export class Player {
  public state: PlayerState;
  private runFrameTimer: number = 0;
  private readonly RUN_FRAME_INTERVAL = 0.15;
  private readonly RUN_FRAMES = 4;

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
  }

  update(deltaTime: number, canvasHeight: number): void {
    // Apply gravity
    this.state.velocityY += GAME_CONFIG.gravity * deltaTime;
    this.state.y += this.state.velocityY * deltaTime;

    const groundY = canvasHeight - GAME_CONFIG.groundHeight - this.state.height;

    // Ground collision
    if (this.state.y >= groundY) {
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
    } else {
      this.state.frame = 0; // Jumping frame
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const { x, y, width, height, isJumping, hasFlatCap } = this.state;

    ctx.save();

    // Shadow on ground
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(x + 2, y + height - 2, width, 4);

    // Simulated bold pixel-art outline (coal black)
    ctx.strokeStyle = "#121315";
    ctx.lineWidth = 2.5;

    // Body/Coat (gradient whiskey brown to coal black)
    const coatGrad = ctx.createLinearGradient(x + 5, y + 15, x + 5, y + height - 5);
    coatGrad.addColorStop(0, "#2d241e");
    coatGrad.addColorStop(1, "#121315");
    ctx.fillStyle = coatGrad;
    ctx.fillRect(x + 5, y + 15, width - 10, height - 20);

    // Pixel scanline overlay on coat for retro shading
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    for (let slY = y + 16; slY < y + height - 6; slY += 4) {
      ctx.fillRect(x + 5, slY, width - 10, 2);
    }
    
    // Stroke outline around the coat
    ctx.strokeRect(x + 5, y + 15, width - 10, height - 20);

    // Coat collar
    ctx.fillStyle = "#121315";
    ctx.fillRect(x + 3, y + 12, width - 6, 6);
    ctx.strokeRect(x + 3, y + 12, width - 6, 6);

    // Legs (running animation)
    const legOffset = isJumping ? 0 : Math.sin(this.state.frame * Math.PI / 2) * 4;
    ctx.fillStyle = "#2d241e";
    
    // Left leg
    ctx.fillRect(x + 8, y + height - 15, 8, 15);
    ctx.strokeRect(x + 8, y + height - 15, 8, 15);
    
    // Right leg
    ctx.fillRect(x + width - 16, y + height - 15 + legOffset, 8, 15);
    ctx.strokeRect(x + width - 16, y + height - 15 + legOffset, 8, 15);

    // Head
    ctx.fillStyle = COLORS.playerHead;
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y + 8, 12, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y + 8, 12, 10, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Flat cap (signature Shelby hat)
    const capColor = hasFlatCap ? "#b45309" : "#4b5563";
    const capTopColor = hasFlatCap ? "#e87a24" : "#6b7280";
    
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

    // Eyes
    ctx.fillStyle = COLORS.playerEye;
    ctx.fillRect(x + 14, y + 5, 4, 4);
    ctx.fillRect(x + 22, y + 5, 4, 4);

    // Intense eyebrows (Shelby stare)
    ctx.strokeStyle = "#121315";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 12, y + 2);
    ctx.lineTo(x + 18, y + 4);
    ctx.moveTo(x + 22, y + 4);
    ctx.lineTo(x + 28, y + 2);
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