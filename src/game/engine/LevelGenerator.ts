import { GAME_CONFIG } from '../config';
import { Platform } from '../entities/Platform';
import { MovingPlatform } from '../entities/MovingPlatform';
import { Spike } from '../entities/Spike';
import { Coin } from '../entities/Coin';

export type PlatformType = Platform | MovingPlatform;

export class LevelGenerator {
  private lastPlatformEnd: number = 0;
  private difficulty: number = 0;

  reset(): void {
    this.lastPlatformEnd = 0;
    this.difficulty = 0;
  }

  setDifficulty(score: number): void {
    this.difficulty = Math.min(score / 500, 1);
  }

  generateInitialPlatforms(): PlatformType[] {
    const platforms: PlatformType[] = [];
    
    platforms.push(new Platform(0, GAME_CONFIG.GROUND_Y, 400));
    this.lastPlatformEnd = 400;

    for (let i = 0; i < 3; i++) {
      const platform = this.generateNextPlatform();
      if (platform) {
        platforms.push(platform);
      }
    }

    return platforms;
  }

  generateNextPlatform(): PlatformType | null {
    const {
      MIN_PLATFORM_WIDTH,
      MAX_PLATFORM_WIDTH,
      MIN_GAP,
      MAX_GAP,
      GROUND_Y,
    } = GAME_CONFIG;

    const minGap = MIN_GAP + this.difficulty * 30;
    const maxGap = MAX_GAP + this.difficulty * 50;
    const gap = minGap + Math.random() * (maxGap - minGap);

    const minWidth = Math.max(MIN_PLATFORM_WIDTH - this.difficulty * 50, 80);
    const maxWidth = MAX_PLATFORM_WIDTH - this.difficulty * 80;
    const width = minWidth + Math.random() * (maxWidth - minWidth);

    const x = this.lastPlatformEnd + gap;

    const movingChance = 0.15 + this.difficulty * 0.2;
    const isMoving = Math.random() < movingChance;

    let platform: PlatformType;
    if (isMoving) {
      const horizontal = Math.random() < 0.5;
      const moveRange = 40 + Math.random() * 40;
      const moveSpeed = 0.015 + Math.random() * 0.015;
      platform = new MovingPlatform(x, GROUND_Y, width, moveRange, moveSpeed, horizontal);
    } else {
      platform = new Platform(x, GROUND_Y, width);
    }

    this.lastPlatformEnd = x + width;
    return platform;
  }

  generateSpikes(platform: PlatformType): Spike[] {
    const spikes: Spike[] = [];
    
    if (platform.width < 120) return spikes;
    
    const spikeChance = 0.3 + this.difficulty * 0.3;
    if (Math.random() < spikeChance && !platform.isMoving) {
      const spikeCount = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < spikeCount; i++) {
        const spikeX = platform.x + 40 + i * (GAME_CONFIG.SPIKE_SIZE + 10);
        if (spikeX + GAME_CONFIG.SPIKE_SIZE < platform.x + platform.width - 40) {
          spikes.push(new Spike(spikeX, platform.y - GAME_CONFIG.SPIKE_SIZE));
        }
      }
    }

    return spikes;
  }

  generateCoins(platform: PlatformType): Coin[] {
    const coins: Coin[] = [];
    const coinChance = 0.6;
    
    if (Math.random() < coinChance) {
      const coinCount = 1 + Math.floor(Math.random() * 3);
      const startX = platform.x + platform.width / 2 - (coinCount - 1) * 20;
      
      for (let i = 0; i < coinCount; i++) {
        const coinX = startX + i * 40;
        const heightVariation = Math.random() < 0.5 ? -40 : -80;
        coins.push(new Coin(coinX, platform.y + heightVariation));
      }
    }

    return coins;
  }

  shouldGenerateNewPlatform(): boolean {
    return this.lastPlatformEnd < GAME_CONFIG.CANVAS_WIDTH + 200;
  }
}
