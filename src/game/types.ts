export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  vx: number;
  vy: number;
}

export interface Entity extends Position {
  width: number;
  height: number;
  update: (deltaTime: number, gameSpeed: number) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
}

export interface GameState {
  score: number;
  coins: number;
  highScore: number;
  isPlaying: boolean;
  isGameOver: boolean;
  gameSpeed: number;
}

export type GameStatus = 'menu' | 'playing' | 'gameover';

export type PlayerState = 'running' | 'jumping' | 'falling';

export interface PlatformData {
  x: number;
  y: number;
  width: number;
  height: number;
  isMoving?: boolean;
  moveRange?: number;
  moveSpeed?: number;
}

export interface SpikeData {
  x: number;
  y: number;
  size: number;
}

export interface CoinData {
  x: number;
  y: number;
  size: number;
  collected: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export type GameAction =
  | { type: 'START' }
  | { type: 'JUMP' }
  | { type: 'GAME_OVER' }
  | { type: 'COLLECT_COIN' }
  | { type: 'RESTART' };
