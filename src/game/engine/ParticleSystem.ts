import { Particle } from '../types';
import { GAME_CONFIG, COLORS } from '../config';

export class ParticleSystem {
  private particles: Particle[] = [];

  emitCoinCollect(x: number, y: number): void {
    for (let i = 0; i < GAME_CONFIG.PARTICLE_COUNT; i++) {
      const angle = (Math.PI * 2 * i) / GAME_CONFIG.PARTICLE_COUNT;
      const speed = 2 + Math.random() * 3;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 1,
        maxLife: 1,
        color: i % 2 === 0 ? COLORS.COIN : COLORS.COIN_DARK,
        size: 3 + Math.random() * 3,
      });
    }
  }

  emitJump(x: number, y: number): void {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: x + 16,
        y: y + GAME_CONFIG.PLAYER_HEIGHT,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 2,
        life: 0.5,
        maxLife: 0.5,
        color: 'rgba(255, 255, 255, 0.6)',
        size: 2 + Math.random() * 2,
      });
    }
  }

  emitDeath(x: number, y: number): void {
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        life: 1.5,
        maxLife: 1.5,
        color: i % 2 === 0 ? COLORS.PLAYER : COLORS.PLAYER_DARK,
        size: 4 + Math.random() * 4,
      });
    }
  }

  update(deltaTime: number): void {
    this.particles = this.particles.filter((p) => {
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.vy += 0.2 * deltaTime;
      p.life -= 0.02 * deltaTime;
      return p.life > 0;
    });
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.fillRect(
        Math.floor(p.x - p.size / 2),
        Math.floor(p.y - p.size / 2),
        p.size,
        p.size
      );
      ctx.restore();
    });
  }

  clear(): void {
    this.particles = [];
  }
}
