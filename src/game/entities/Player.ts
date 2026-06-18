import { GAME_CONFIG, COLORS } from '../config';
import { Physics } from '../engine/Physics';
import { Velocity, PlayerState } from '../types';

export interface PlatformLike {
  x: number;
  y: number;
  width: number;
  height: number;
  isMoving?: boolean;
  getVelocityX?(): number;
  getVelocityY?(): number;
  isHorizontal?(): boolean;
}

export class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: Velocity;
  state: PlayerState;
  isOnGround: boolean;
  currentPlatform: PlatformLike | null;
  animFrame: number;
  animTimer: number;
  readonly frameCount = 4;
  readonly frameDelay = 8;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = GAME_CONFIG.PLAYER_WIDTH;
    this.height = GAME_CONFIG.PLAYER_HEIGHT;
    this.velocity = { vx: 0, vy: 0 };
    this.state = 'running';
    this.isOnGround = false;
    this.currentPlatform = null;
    this.animFrame = 0;
    this.animTimer = 0;
  }

  jump(): void {
    if (this.isOnGround) {
      this.velocity = Physics.jump();
      this.isOnGround = false;
      this.state = 'jumping';
    }
  }

  update(deltaTime: number = 1): void {
    this.velocity = Physics.applyGravity(this.velocity, deltaTime);
    
    const newPos = Physics.updatePosition(this.x, this.y, this.velocity, deltaTime);
    this.x = newPos.x;
    this.y = newPos.y;

    if (this.velocity.vy > 0 && !this.isOnGround) {
      this.state = 'falling';
    } else if (this.isOnGround) {
      this.state = 'running';
    }

    this.animTimer++;
    if (this.animTimer >= this.frameDelay) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % this.frameCount;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    const bodyColor = COLORS.PLAYER;
    const darkColor = COLORS.PLAYER_DARK;
    
    const x = Math.floor(this.x);
    const y = Math.floor(this.y);
    
    ctx.fillStyle = bodyColor;
    
    if (this.state === 'running') {
      this.drawRunning(ctx, x, y);
    } else if (this.state === 'jumping') {
      this.drawJumping(ctx, x, y);
    } else {
      this.drawFalling(ctx, x, y);
    }
    
    ctx.fillStyle = darkColor;
    ctx.fillRect(x + 8, y + 12, 4, 4);
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 18, y + 14, 8, 6);
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 22, y + 16, 3, 3);
    
    ctx.restore();
  }

  private drawRunning(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const bodyColor = COLORS.PLAYER;
    const darkColor = COLORS.PLAYER_DARK;
    
    ctx.fillStyle = bodyColor;
    ctx.fillRect(x + 6, y, 20, 28);
    ctx.fillRect(x + 4, y + 28, 24, 8);
    
    const legOffset = Math.sin(this.animFrame * Math.PI / 2) * 4;
    
    ctx.fillStyle = darkColor;
    ctx.fillRect(x + 6, y + 36, 8, 10 + legOffset);
    ctx.fillRect(x + 18, y + 36, 8, 10 - legOffset);
    
    const armOffset = Math.sin(this.animFrame * Math.PI / 2) * 3;
    ctx.fillStyle = bodyColor;
    ctx.fillRect(x + 2, y + 8, 6, 12 + armOffset);
    ctx.fillRect(x + 24, y + 8, 6, 12 - armOffset);
  }

  private drawJumping(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const bodyColor = COLORS.PLAYER;
    const darkColor = COLORS.PLAYER_DARK;
    
    ctx.fillStyle = bodyColor;
    ctx.fillRect(x + 6, y + 2, 20, 26);
    ctx.fillRect(x + 4, y + 28, 24, 8);
    
    ctx.fillStyle = darkColor;
    ctx.fillRect(x + 8, y + 36, 8, 8);
    ctx.fillRect(x + 16, y + 36, 8, 8);
    
    ctx.fillStyle = bodyColor;
    ctx.fillRect(x - 2, y + 2, 8, 6);
    ctx.fillRect(x + 26, y + 2, 8, 6);
  }

  private drawFalling(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const bodyColor = COLORS.PLAYER;
    const darkColor = COLORS.PLAYER_DARK;
    
    ctx.fillStyle = bodyColor;
    ctx.fillRect(x + 6, y, 20, 28);
    ctx.fillRect(x + 4, y + 28, 24, 8);
    
    ctx.fillStyle = darkColor;
    ctx.fillRect(x + 4, y + 36, 8, 12);
    ctx.fillRect(x + 20, y + 36, 8, 12);
    
    ctx.fillStyle = bodyColor;
    ctx.fillRect(x, y + 12, 8, 8);
    ctx.fillRect(x + 24, y + 12, 8, 8);
  }

  land(platformY: number): void {
    this.y = platformY - this.height;
    this.velocity.vy = 0;
    this.isOnGround = true;
    this.state = 'running';
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
