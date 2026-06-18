import { EntityType, Bounds, IGameEntity } from '../types';
import { GAME_CONFIG } from '../config';

export abstract class GameEntity implements IGameEntity {
  x: number;
  y: number;
  width: number;
  height: number;
  abstract readonly type: EntityType;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  abstract update(deltaTime: number, gameSpeed: number): void;

  abstract render(ctx: CanvasRenderingContext2D): void;

  isOffScreen(): boolean {
    return this.x + this.width < 0;
  }

  getBounds(): Bounds {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  moveWithSpeed(deltaTime: number, gameSpeed: number): void {
    this.x -= gameSpeed * deltaTime;
  }

  protected floor(value: number): number {
    return Math.floor(value);
  }
}
