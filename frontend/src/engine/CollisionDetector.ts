import type { Obstacle, PlayerState } from "./types";

export class CollisionDetector {
  static checkCollision(player: PlayerState, obstacle: Obstacle): boolean {
    const px = player.x + 4;
    const py = player.y + 4;
    const pw = player.width - 8;
    const ph = player.height - 6;

    const ox = obstacle.x;
    const oy = obstacle.y;
    const ow = obstacle.width;
    const oh = obstacle.height;

    // AABB collision check
    return px < ox + ow && px + pw > ox && py < oy + oh && py + ph > oy;
  }

  static checkAnyCollision(
    playerBounds: { x: number; y: number; width: number; height: number },
    obstacles: Obstacle[]
  ): Obstacle | null {
    for (const obstacle of obstacles) {
      if (this.checkCollision(
        { ...playerBounds } as PlayerState,
        obstacle
      )) {
        return obstacle;
      }
    }
    return null;
  }
}