import { GAME_CONFIG, COLORS } from '../config';
import { GameEntity } from './GameEntity';
import { EntityType, Bounds } from '../types';

export class Spike extends GameEntity {
  readonly type: EntityType = EntityType.SPIKE;
  size: number;

  constructor(x: number, y: number) {
    super(x, y, GAME_CONFIG.SPIKE_SIZE, GAME_CONFIG.SPIKE_SIZE);
    this.size = GAME_CONFIG.SPIKE_SIZE;
  }

  update(deltaTime: number, gameSpeed: number): void {
    this.moveWithSpeed(deltaTime, gameSpeed);
  }

  render(ctx: CanvasRenderingContext2D): void {
    const x = this.floor(this.x);
    const y = this.floor(this.y);
    const size = this.size;
    
    ctx.fillStyle = COLORS.SPIKE_DARK;
    ctx.beginPath();
    ctx.moveTo(x, y + size);
    ctx.lineTo(x + size / 2, y + 4);
    ctx.lineTo(x + size, y + size);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = COLORS.SPIKE;
    ctx.beginPath();
    ctx.moveTo(x + 2, y + size);
    ctx.lineTo(x + size / 2, y);
    ctx.lineTo(x + size - 2, y + size);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.moveTo(x + size / 2 - 2, y + 4);
    ctx.lineTo(x + size / 2, y + 8);
    ctx.lineTo(x + size / 2 - 6, y + size - 4);
    ctx.closePath();
    ctx.fill();
  }

  getBounds(): Bounds {
    return {
      x: this.x + 4,
      y: this.y + 4,
      width: this.width - 8,
      height: this.height - 4,
    };
  }
}
