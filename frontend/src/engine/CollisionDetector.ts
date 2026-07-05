import type { Obstacle, PlayerState } from "./types";

export class CollisionDetector {
  static checkCollision(player: PlayerState, obstacle: Obstacle): boolean {
    const px = player.x;
    const py = player.y;
    const pw = player.width;
    const ph = player.height;

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