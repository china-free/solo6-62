export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  vx: number;
  vy: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum EntityType {
  PLAYER = 'player',
  PLATFORM = 'platform',
  MOVING_PLATFORM = 'moving_platform',
  SPIKE = 'spike',
  COIN = 'coin',
  PARTICLE = 'particle',
}

export enum CollisionType {
  NONE = 'none',
  LAND = 'land',
  DEATH = 'death',
  COLLECT = 'collect',
}

export interface CollisionResult {
  type: CollisionType;
  entity?: IGameEntity;
}

export type GameStatus = 'menu' | 'playing' | 'gameover';

export type PlayerState = 'running' | 'jumping' | 'falling';

export interface IGameEntity extends Bounds {
  readonly type: EntityType;
  update(deltaTime: number, gameSpeed: number): void;
  render(ctx: CanvasRenderingContext2D): void;
  isOffScreen(): boolean;
  getBounds(): Bounds;
}

export interface IScoreData {
  distance: number;
  coins: number;
  total: number;
}

export interface PlatformLike extends Bounds {
  isMoving?: boolean;
  getVelocityX?(): number;
  getVelocityY?(): number;
  isHorizontal?(): boolean;
}

export interface Particle extends Position {
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
