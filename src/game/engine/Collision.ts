import { Position } from '../types';

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

  static getDistance(a: Position, b: Position): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
