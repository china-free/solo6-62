const HIGH_SCORE_KEY = 'platformer_high_score';

export class StorageManager {
  private static instance: StorageManager | null = null;

  private constructor() {}

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  getHighScore(): number {
    try {
      const stored = localStorage.getItem(HIGH_SCORE_KEY);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  }

  setHighScore(score: number): void {
    try {
      localStorage.setItem(HIGH_SCORE_KEY, score.toString());
    } catch {
      console.warn('Failed to save high score');
    }
  }

  updateHighScore(currentScore: number): { highScore: number; isNewRecord: boolean } {
    const highScore = this.getHighScore();
    if (currentScore > highScore) {
      this.setHighScore(currentScore);
      return { highScore: currentScore, isNewRecord: true };
    }
    return { highScore, isNewRecord: false };
  }

  clearHighScore(): void {
    try {
      localStorage.removeItem(HIGH_SCORE_KEY);
    } catch {
      console.warn('Failed to clear high score');
    }
  }
}
