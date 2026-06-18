import { GAME_CONFIG, COLORS } from '../config';
import { GameEntity } from './GameEntity';
import { EntityType, Bounds } from '../types';

export class Coin extends GameEntity {
  readonly type: EntityType = EntityType.COIN;
  size: number;
  collected: boolean = false;
  private animTime: number = 0;

  constructor(x: number, y: number) {
    super(x, y, GAME_CONFIG.COIN_SIZE, GAME_CONFIG.COIN_SIZE);
    this.size = GAME_CONFIG.COIN_SIZE;
  }

  update(deltaTime: number, gameSpeed: number): void {
    this.moveWithSpeed(deltaTime, gameSpeed);
    this.animTime += deltaTime * 0.1;
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.collected) return;
    
    const x = this.floor(this.x);
    const y = this.floor(this.y);
    const size = this.size;
    const centerX = x + size / 2;
    const centerY = y + size / 2;
    
    const scale = 0.8 + Math.sin(this.animTime) * 0.2;
    const radius = (size / 2) * scale;
    
    ctx.save();
    
    ctx.shadowColor = COLORS.COIN;
    ctx.shadowBlur = 8;
    
    ctx.fillStyle = COLORS.COIN_DARK;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = COLORS.COIN;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = COLORS.COIN_DARK;
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', centerX, centerY);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(centerX - 3, centerY - 3, radius / 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  collect(): void {
    this.collected = true;
  }

  isOffScreen(): boolean {
    return this.x + this.width < 0 || this.collected;
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
