import { GAME_CONFIG, COLORS } from '../config';

export class Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  readonly isMoving: boolean = false;

  constructor(x: number, y: number, width: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = GAME_CONFIG.PLATFORM_HEIGHT;
  }

  update(deltaTime: number, gameSpeed: number): void {
    this.x -= gameSpeed * deltaTime;
  }

  render(ctx: CanvasRenderingContext2D): void {
    const x = Math.floor(this.x);
    const y = Math.floor(this.y);
    
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

  isOffScreen(): boolean {
    return this.x + this.width < 0;
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}
