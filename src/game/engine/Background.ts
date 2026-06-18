import { GAME_CONFIG, COLORS } from '../config';

interface Star {
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

export class Background {
  private stars: Star[] = [];
  private scrollOffset: number = 0;

  constructor() {
    this.initStars();
  }

  private initStars(): void {
    for (let i = 0; i < GAME_CONFIG.STAR_COUNT; i++) {
      this.stars.push({
        x: Math.random() * GAME_CONFIG.CANVAS_WIDTH,
        y: Math.random() * GAME_CONFIG.CANVAS_HEIGHT * 0.7,
        size: 1 + Math.random() * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.03,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
  }

  update(deltaTime: number, gameSpeed: number): void {
    this.scrollOffset += gameSpeed * deltaTime * 0.3;
    if (this.scrollOffset >= GAME_CONFIG.CANVAS_WIDTH) {
      this.scrollOffset = 0;
    }

    this.stars.forEach((star) => {
      star.twinklePhase += star.twinkleSpeed * deltaTime;
    });
  }

  render(ctx: CanvasRenderingContext2D): void {
    const { CANVAS_WIDTH, CANVAS_HEIGHT } = GAME_CONFIG;
    
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, COLORS.BACKGROUND_TOP);
    gradient.addColorStop(1, COLORS.BACKGROUND_BOTTOM);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    this.stars.forEach((star) => {
      const alpha = 0.3 + Math.sin(star.twinklePhase) * 0.7;
      const x = ((star.x - this.scrollOffset) % CANVAS_WIDTH + CANVAS_WIDTH) % CANVAS_WIDTH;
      
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(Math.floor(x), Math.floor(star.y), star.size, star.size);
      ctx.restore();
    });

    ctx.fillStyle = 'rgba(100, 120, 180, 0.3)';
    this.drawMountain(ctx, 0, CANVAS_HEIGHT - 100, 200, 80);
    this.drawMountain(ctx, 150, CANVAS_HEIGHT - 120, 250, 100);
    this.drawMountain(ctx, 400, CANVAS_HEIGHT - 90, 180, 70);
    this.drawMountain(ctx, 550, CANVAS_HEIGHT - 130, 280, 110);

    ctx.fillStyle = 'rgba(80, 100, 160, 0.4)';
    this.drawMountain(ctx, -50, CANVAS_HEIGHT - 70, 150, 60);
    this.drawMountain(ctx, 100, CANVAS_HEIGHT - 85, 200, 75);
    this.drawMountain(ctx, 350, CANVAS_HEIGHT - 65, 160, 55);
    this.drawMountain(ctx, 500, CANVAS_HEIGHT - 95, 220, 85);
    this.drawMountain(ctx, 700, CANVAS_HEIGHT - 75, 180, 65);
  }

  private drawMountain(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width / 2, y - height);
    ctx.lineTo(x + width, y);
    ctx.closePath();
    ctx.fill();
  }

  renderGround(ctx: CanvasRenderingContext2D, gameSpeed: number): void {
    const { CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_Y } = GAME_CONFIG;
    const groundHeight = CANVAS_HEIGHT - GROUND_Y;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, groundHeight);

    ctx.fillStyle = '#252545';
    for (let i = 0; i < CANVAS_WIDTH; i += 32) {
      const offset = (this.scrollOffset * 2) % 32;
      ctx.fillRect(i - offset, GROUND_Y, 16, groundHeight);
    }

    ctx.fillStyle = '#2d2d55';
    for (let i = 0; i < CANVAS_WIDTH; i += 64) {
      const offset = (this.scrollOffset * 1.5) % 64;
      ctx.fillRect(i - offset, GROUND_Y + 8, 32, 4);
    }
  }
}
