import { GAME_CONFIG, COLORS } from '../config';

export class Spike {
  x: number;
  y: number;
  size: number;
  width: number;
  height: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = GAME_CONFIG.SPIKE_SIZE;
    this.width = this.size;
    this.height = this.size;
  }

  update(deltaTime: number, gameSpeed: number): void {
    this.x -= gameSpeed * deltaTime;
  }

  render(ctx: CanvasRenderingContext2D): void {
    const x = Math.floor(this.x);
    const y = Math.floor(this.y);
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

  isOffScreen(): boolean {
    return this.x + this.width < 0;
  }

  getBounds() {
    return {
      x: this.x + 4,
      y: this.y + 4,
      width: this.width - 8,
      height: this.height - 4,
    };
  }
}
