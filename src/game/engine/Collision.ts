import { Bounds, CollisionResult, CollisionType, IGameEntity, EntityType } from '../types';

export interface Collidable {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Collision {
  static checkAABB(a: Collidable, b: Collidable): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  static checkTopCollision(
    player: Collidable,
    playerVy: number,
    platform: Collidable
  ): boolean {
    const playerBottom = player.y + player.height;
    const playerPrevBottom = playerBottom - playerVy;
    
    return (
      playerVy >= 0 &&
      playerPrevBottom <= platform.y + 5 &&
      playerBottom >= platform.y &&
      player.x + player.width > platform.x &&
      player.x < platform.x + platform.width
    );
  }

  static checkSpikeCollision(
    player: Collidable,
    spike: Collidable
  ): boolean {
    const shrink = 4;
    const shrunkPlayer = {
      x: player.x + shrink,
      y: player.y + shrink,
      width: player.width - shrink * 2,
      height: player.height - shrink * 2,
    };
    return this.checkAABB(shrunkPlayer, spike);
  }

  static checkCoinCollision(
    player: Collidable,
    coin: Collidable
  ): boolean {
    return this.checkAABB(player, coin);
  }

  static isBelowScreen(y: number, height: number, screenHeight: number): boolean {
    return y > screenHeight + height;
  }

  static getDistance(a: { x: number; y: number }, b: { x: number; y: number }): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static checkPlatformCollision(
    player: Collidable,
    playerVy: number,
    platforms: IGameEntity[]
  ): CollisionResult {
    for (const platform of platforms) {
      if (
        platform.type === EntityType.PLATFORM ||
        platform.type === EntityType.MOVING_PLATFORM
      ) {
        if (this.checkTopCollision(player, playerVy, platform.getBounds())) {
          return {
            type: CollisionType.LAND,
            entity: platform,
          };
        }
      }
    }
    return { type: CollisionType.NONE };
  }

  static checkHazardCollision(
    player: Collidable,
    hazards: IGameEntity[]
  ): CollisionResult {
    for (const hazard of hazards) {
      if (hazard.type === EntityType.SPIKE) {
        if (this.checkSpikeCollision(player, hazard.getBounds())) {
          return {
            type: CollisionType.DEATH,
            entity: hazard,
          };
        }
      }
    }
    return { type: CollisionType.NONE };
  }

  static checkCollectibleCollision(
    player: Collidable,
    collectibles: IGameEntity[]
  ): CollisionResult {
    for (const collectible of collectibles) {
      if (collectible.type === EntityType.COIN) {
        const coin = collectible as unknown as { collected: boolean };
        if (!coin.collected && this.checkCoinCollision(player, collectible.getBounds())) {
          return {
            type: CollisionType.COLLECT,
            entity: collectible,
          };
        }
      }
    }
    return { type: CollisionType.NONE };
  }
}
