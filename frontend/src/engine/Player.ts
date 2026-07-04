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

    // Shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(x + 2, y + height - 2, width, 4);

    // Body (Peaky Blinder coat)
    ctx.fillStyle = COLORS.playerCoat;
    ctx.fillRect(x + 5, y + 15, width - 10, height - 20);

    // Coat collar
    ctx.fillStyle = "#2a1e12";
    ctx.fillRect(x + 3, y + 12, width - 6, 6);

    // Legs (running animation)
    const legOffset = isJumping ? 0 : Math.sin(this.state.frame * Math.PI / 2) * 4;
    ctx.fillStyle = "#2d1f0e";
    ctx.fillRect(x + 8, y + height - 15, 8, 15);
    ctx.fillRect(x + width - 16, y + height - 15 + legOffset, 8, 15);

    // Head
    ctx.fillStyle = COLORS.playerHead;
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y + 8, 12, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flat cap (signature Shelby hat)
    ctx.fillStyle = hasFlatCap ? "#8b6914" : COLORS.playerHat;
    ctx.fillRect(x + 6, y - 2, width - 12, 6);
    ctx.fillRect(x + 4, y - 4, width - 8, 3);

    if (hasFlatCap) {
      // Cap peak
      ctx.fillStyle = "#c9a84c";
      ctx.fillRect(x + width - 14, y - 4, 10, 3);
    }

    // Eyes
    ctx.fillStyle = COLORS.playerEye;
    ctx.fillRect(x + 14, y + 5, 4, 4);
    ctx.fillRect(x + 22, y + 5, 4, 4);

    // Intense eyebrows (Shelby stare)
    ctx.strokeStyle = "#1a1a1a";
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