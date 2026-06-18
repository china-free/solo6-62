import { GAME_CONFIG, COLORS } from '../config';
import { Platform } from './Platform';

export class MovingPlatform extends Platform {
  readonly isMoving: boolean = true;
  private baseY: number;
  private moveRange: number;
  private moveSpeed: number;
  private time: number = 0;
  private horizontalMove: boolean;
  private baseX: number;

  constructor(
    x: number,
    y: number,
    width: number,
    moveRange: number = 60,
    moveSpeed: number = 0.02,
    horizontal: boolean = false
  ) {
    super(x, y, width);
    this.baseX = x;
    this.baseY = y;
    this.moveRange = moveRange;
    this.moveSpeed = moveSpeed;
    this.horizontalMove = horizontal;
  }

  update(deltaTime: number, gameSpeed: number): void {
    this.time += deltaTime;
    const offset = Math.sin(this.time * this.moveSpeed) * this.moveRange;
    
    if (this.horizontalMove) {
      this.baseX -= gameSpeed * deltaTime;
      this.x = this.baseX + offset;
    } else {
      this.x -= gameSpeed * deltaTime;
      this.baseX = this.x;
      this.y = this.baseY + offset;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const x = Math.floor(this.x);
    const y = Math.floor(this.y);
    
    ctx.fillStyle = COLORS.PLATFORM_MOVING_DARK;
    ctx.fillRect(x, y + 4, this.width, this.height - 4);
    
    ctx.fillStyle = COLORS.PLATFORM_MOVING;
    ctx.fillRect(x, y, this.width, 6);
    
    ctx.fillStyle = COLORS.PLATFORM_MOVING_DARK;
    for (let i = 0; i < this.width; i += 16) {
      ctx.fillRect(x + i + 4, y + 8, 8, 4);
    }
    
    ctx.fillStyle = '#60a5fa';
    for (let i = 0; i < this.width; i += 8) {
      const indicatorHeight = 2 + (i % 3);
      ctx.fillRect(x + i, y - indicatorHeight, 4, indicatorHeight);
    }
    
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    if (this.horizontalMove) {
      ctx.moveTo(x - this.moveRange, y + this.height / 2);
      ctx.lineTo(x + this.width + this.moveRange, y + this.height / 2);
    } else {
      ctx.moveTo(x + this.width / 2, y - this.moveRange);
      ctx.lineTo(x + this.width / 2, y + this.height + this.moveRange);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  getVelocityY(): number {
    if (!this.horizontalMove) {
      const prevOffset = Math.sin((this.time - 1) * this.moveSpeed) * this.moveRange;
      const currOffset = Math.sin(this.time * this.moveSpeed) * this.moveRange;
      return currOffset - prevOffset;
    }
    return 0;
  }
}
