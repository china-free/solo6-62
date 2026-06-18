import { GAME_CONFIG, COLORS } from '../config';
import { GameEntity } from './GameEntity';
import { EntityType, Bounds } from '../types';

export class Platform extends GameEntity {
  readonly type: EntityType = EntityType.PLATFORM;
  readonly isMoving: boolean = false;

  constructor(x: number, y: number, width: number) {
    super(x, y, width, GAME_CONFIG.PLATFORM_HEIGHT);
  }

  update(deltaTime: number, gameSpeed: number): void {
    this.moveWithSpeed(deltaTime, gameSpeed);
  }

  render(ctx: CanvasRenderingContext2D): void {
    const x = this.floor(this.x);
    const y = this.floor(this.y);
    
    ctx.fillStyle = COLORS.PLATFORM_DARK;
    ctx.fillRect(x, y + 4, this.width, this.height - 4);
    
    ctx.fillStyle = COLORS.PLATFORM;
    ctx.fillRect(x, y, this.width, 6);
    
    ctx.fillStyle = COLORS.PLATFORM_DARK;
    for (let i = 0; i < this.width; i += 16) {
      ctx.fillRect(x + i + 4, y + 8, 8, 4);
    }
    
    ctx.fillStyle = '#22c55e';
    for (let i = 0; i < this.width; i += 8) {
      const grassHeight = 2 + (i % 3);
      ctx.fillRect(x + i, y - grassHeight, 4, grassHeight);
    }
  }

  getBounds(): Bounds {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}
