import { IScoreData } from '../types';
import { GAME_CONFIG } from '../config';

export const COIN_SCORE_VALUE = 10;
export const DISTANCE_SCORE_SCALE = 10;

export class ScoreManager {
  private distance: number = 0;
  private coins: number = 0;
  private distanceAccumulator: number = 0;
  private highScore: number = 0;
  private isNewHighScore: boolean = false;

  constructor(highScore: number = 0) {
    this.highScore = highScore;
  }

  reset(): void {
    this.distance = 0;
    this.coins = 0;
    this.distanceAccumulator = 0;
    this.isNewHighScore = false;
  }

  addDistance(gameSpeed: number, deltaTime: number): void {
    this.distanceAccumulator += gameSpeed * deltaTime;
    if (this.distanceAccumulator >= DISTANCE_SCORE_SCALE) {
      this.distance += Math.floor(this.distanceAccumulator / DISTANCE_SCORE_SCALE);
      this.distanceAccumulator = this.distanceAccumulator % DISTANCE_SCORE_SCALE;
    }
  }

  addCoin(): void {
    this.coins++;
  }

  getDistance(): number {
    return this.distance;
  }

  getCoins(): number {
    return this.coins;
  }

  getCoinScore(): number {
    return this.coins * COIN_SCORE_VALUE;
  }

  getTotalScore(): number {
    return this.distance + this.getCoinScore();
  }

  getScoreData(): IScoreData {
    return {
      distance: this.distance,
      coins: this.coins,
      total: this.getTotalScore(),
    };
  }

  getHighScore(): number {
    return this.highScore;
  }

  setHighScore(highScore: number): void {
    this.highScore = highScore;
  }

  checkNewHighScore(): boolean {
    const total = this.getTotalScore();
    if (total > this.highScore) {
      this.highScore = total;
      this.isNewHighScore = true;
      return true;
    }
    return false;
  }

  hasNewHighScore(): boolean {
    return this.isNewHighScore;
  }

  calculateGameSpeed(): number {
    return Math.min(
      GAME_CONFIG.BASE_SPEED + this.distance * GAME_CONFIG.SPEED_INCREMENT,
      GAME_CONFIG.MAX_SPEED
    );
  }
}
