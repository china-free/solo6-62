import { GAME_CONFIG } from '../config';
import { Velocity } from '../types';

export class Physics {
  static applyGravity(velocity: Velocity, deltaTime: number = 1): Velocity {
    return {
      vx: velocity.vx,
      vy: velocity.vy + GAME_CONFIG.GRAVITY * deltaTime,
    };
  }

  static jump(): Velocity {
    return {
      vx: 0,
      vy: GAME_CONFIG.JUMP_FORCE,
    };
  }

  static updatePosition(
    x: number,
    y: number,
    velocity: Velocity,
    deltaTime: number = 1
  ): { x: number; y: number } {
    return {
      x: x + velocity.vx * deltaTime,
      y: y + velocity.vy * deltaTime,
    };
  }

  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  static lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }
}
