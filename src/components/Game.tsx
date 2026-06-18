import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GAME_CONFIG } from '../game/config';
import { GameStatus, IGameEntity } from '../game/types';
import { Player, Platform, MovingPlatform, Spike, Coin } from '../game/entities';
import { Background, ParticleSystem, LevelGenerator, Collision } from '../game/engine';
import { ScoreManager, StorageManager } from '../game/managers';
import { StartScreen } from './StartScreen';
import { GameOverScreen } from './GameOverScreen';
import { HUD } from './HUD';

export const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const storageManager = StorageManager.getInstance();

  const gameStateRef = useRef<{
    status: GameStatus;
    player: Player | null;
    platforms: (Platform | MovingPlatform)[];
    spikes: Spike[];
    coinsArr: Coin[];
    background: Background;
    particles: ParticleSystem;
    levelGenerator: LevelGenerator;
    scoreManager: ScoreManager;
    animationId: number | null;
    lastTime: number;
  }>({
    status: 'menu',
    player: null,
    platforms: [],
    spikes: [],
    coinsArr: [],
    background: new Background(),
    particles: new ParticleSystem(),
    levelGenerator: new LevelGenerator(),
    scoreManager: new ScoreManager(),
    animationId: null,
    lastTime: 0,
  });

  const [uiState, setUiState] = useState<{
    status: GameStatus;
    distance: number;
    coins: number;
    totalScore: number;
    highScore: number;
    gameSpeed: number;
    isNewHighScore: boolean;
  }>({
    status: 'menu',
    distance: 0,
    coins: 0,
    totalScore: 0,
    highScore: 0,
    gameSpeed: GAME_CONFIG.BASE_SPEED,
    isNewHighScore: false,
  });

  const updateEntities = useCallback((entities: IGameEntity[], deltaTime: number, gameSpeed: number): void => {
    for (const entity of entities) {
      entity.update(deltaTime, gameSpeed);
    }
  }, []);

  const filterOffScreenEntities = useCallback(<T extends IGameEntity>(entities: T[]): T[] => {
    return entities.filter((e) => !e.isOffScreen());
  }, []);

  const initGame = useCallback(() => {
    const state = gameStateRef.current;
    state.player = new Player(
      GAME_CONFIG.PLAYER_START_X,
      GAME_CONFIG.GROUND_Y - GAME_CONFIG.PLAYER_HEIGHT
    );
    state.levelGenerator.reset();
    state.platforms = state.levelGenerator.generateInitialPlatforms();
    state.spikes = [];
    state.coinsArr = [];
    state.particles.clear();
    state.scoreManager.reset();
    state.scoreManager.setHighScore(storageManager.getHighScore());

    state.platforms.forEach((platform) => {
      const spikes = state.levelGenerator.generateSpikes(platform);
      const coins = state.levelGenerator.generateCoins(platform);
      state.spikes.push(...spikes);
      state.coinsArr.push(...coins);
    });
  }, [storageManager]);

  const startGame = useCallback(() => {
    initGame();
    gameStateRef.current.status = 'playing';
    const sm = gameStateRef.current.scoreManager;
    setUiState((prev) => ({
      ...prev,
      status: 'playing',
      distance: sm.getDistance(),
      coins: sm.getCoins(),
      totalScore: sm.getTotalScore(),
      highScore: sm.getHighScore(),
      gameSpeed: GAME_CONFIG.BASE_SPEED,
      isNewHighScore: false,
    }));
  }, [initGame]);

  const endGame = useCallback(() => {
    const state = gameStateRef.current;
    state.status = 'gameover';
    
    if (state.player) {
      state.particles.emitDeath(
        state.player.x + state.player.width / 2,
        state.player.y + state.player.height / 2
      );
    }

    const finalScore = state.scoreManager.getTotalScore();
    const { highScore, isNewRecord } = storageManager.updateHighScore(finalScore);
    state.scoreManager.setHighScore(highScore);

    setUiState((prev) => ({
      ...prev,
      status: 'gameover',
      distance: state.scoreManager.getDistance(),
      coins: state.scoreManager.getCoins(),
      totalScore: finalScore,
      highScore: highScore,
      isNewHighScore: isNewRecord,
    }));
  }, [storageManager]);

  const goToMenu = useCallback(() => {
    gameStateRef.current.status = 'menu';
    gameStateRef.current.particles.clear();
    setUiState((prev) => ({
      ...prev,
      status: 'menu',
    }));
  }, []);

  const handleJump = useCallback(() => {
    const state = gameStateRef.current;
    if (state.status === 'playing' && state.player) {
      if (state.player.isOnGround) {
        state.particles.emitJump(state.player.x, state.player.y);
      }
      state.player.jump();
    } else if (state.status === 'menu') {
      startGame();
    }
  }, [startGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        handleJump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleJump]);

  useEffect(() => {
    const highScore = storageManager.getHighScore();
    gameStateRef.current.scoreManager.setHighScore(highScore);
    setUiState((prev) => ({ ...prev, highScore }));
  }, [storageManager]);

  const handlePlatformCollisions = useCallback((player: Player): void => {
    const state = gameStateRef.current;
    for (const platform of state.platforms) {
      if (Collision.checkTopCollision(player.getBounds(), player.velocity.vy, platform.getBounds())) {
        player.land(platform.y);
        player.currentPlatform = platform;
        break;
      }
    }
  }, []);

  const handleSpikeCollisions = useCallback((player: Player): boolean => {
    const state = gameStateRef.current;
    for (const spike of state.spikes) {
      if (Collision.checkSpikeCollision(player.getBounds(), spike.getBounds())) {
        return true;
      }
    }
    return false;
  }, []);

  const handleCoinCollisions = useCallback((player: Player): number => {
    const state = gameStateRef.current;
    let collected = 0;
    for (const coin of state.coinsArr) {
      if (coin.collected) continue;
      if (Collision.checkCoinCollision(player.getBounds(), coin.getBounds())) {
        coin.collect();
        collected++;
        state.particles.emitCoinCollect(
          coin.x + coin.width / 2,
          coin.y + coin.height / 2
        );
      }
    }
    return collected;
  }, []);

  const followMovingPlatform = useCallback((player: Player): void => {
    const prevPlatform = player.currentPlatform;
    const wasOnGround = player.isOnGround;

    if (prevPlatform && prevPlatform instanceof MovingPlatform && wasOnGround) {
      player.x += prevPlatform.getVelocityX();
      player.y += prevPlatform.getVelocityY();
    }
  }, []);

  const generateNewEntities = useCallback((): void => {
    const state = gameStateRef.current;
    while (state.levelGenerator.shouldGenerateNewPlatform()) {
      const newPlatform = state.levelGenerator.generateNextPlatform();
      if (newPlatform) {
        state.platforms.push(newPlatform);
        const spikes = state.levelGenerator.generateSpikes(newPlatform);
        const coins = state.levelGenerator.generateCoins(newPlatform);
        state.spikes.push(...spikes);
        state.coinsArr.push(...coins);
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;

    const gameLoop = (currentTime: number) => {
      const deltaTime = state.lastTime ? (currentTime - state.lastTime) / 16.67 : 1;
      state.lastTime = currentTime;

      ctx.imageSmoothingEnabled = false;

      state.background.update(deltaTime, state.scoreManager.calculateGameSpeed());
      state.background.render(ctx);

      if (state.status === 'playing' || state.status === 'gameover') {
        if (state.status === 'playing' && state.player) {
          const gameSpeed = state.scoreManager.calculateGameSpeed();
          state.levelGenerator.setDifficulty(state.scoreManager.getDistance());

          state.scoreManager.addDistance(gameSpeed, deltaTime);

          const player = state.player;

          updateEntities(state.platforms as unknown as IGameEntity[], deltaTime, gameSpeed);

          followMovingPlatform(player);

          player.update(deltaTime);
          player.isOnGround = false;
          player.currentPlatform = null;

          handlePlatformCollisions(player);

          updateEntities(state.spikes as unknown as IGameEntity[], deltaTime, gameSpeed);
          if (handleSpikeCollisions(player)) {
            endGame();
          }

          updateEntities(state.coinsArr as unknown as IGameEntity[], deltaTime, gameSpeed);
          const coinsCollected = handleCoinCollisions(player);
          for (let i = 0; i < coinsCollected; i++) {
            state.scoreManager.addCoin();
          }

          if (Collision.isBelowScreen(player.y, player.height, GAME_CONFIG.CANVAS_HEIGHT)) {
            endGame();
          }

          state.platforms = filterOffScreenEntities(state.platforms as unknown as IGameEntity[]) as (Platform | MovingPlatform)[];
          state.spikes = filterOffScreenEntities(state.spikes as unknown as IGameEntity[]) as Spike[];
          state.coinsArr = filterOffScreenEntities(state.coinsArr as unknown as IGameEntity[]) as Coin[];

          generateNewEntities();

          setUiState((prev) => ({
            ...prev,
            distance: state.scoreManager.getDistance(),
            coins: state.scoreManager.getCoins(),
            totalScore: state.scoreManager.getTotalScore(),
            gameSpeed: gameSpeed,
          }));
        }

        state.particles.update(deltaTime);

        state.background.renderGround(ctx, state.scoreManager.calculateGameSpeed());

        state.platforms.forEach((platform) => platform.render(ctx));
        state.spikes.forEach((spike) => spike.render(ctx));
        state.coinsArr.forEach((coin) => coin.render(ctx));

        if (state.player && state.status !== 'gameover') {
          state.player.render(ctx);
        }

        state.particles.render(ctx);
      }

      state.animationId = requestAnimationFrame(gameLoop);
    };

    state.animationId = requestAnimationFrame(gameLoop);

    return () => {
      if (state.animationId) {
        cancelAnimationFrame(state.animationId);
      }
    };
  }, [endGame, updateEntities, filterOffScreenEntities, followMovingPlatform, handlePlatformCollisions, handleSpikeCollisions, handleCoinCollisions, generateNewEntities]);

  const handleCanvasClick = () => {
    if (uiState.status === 'playing') {
      handleJump();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleJump();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div 
        className="relative"
        style={{
          width: '100%',
          maxWidth: GAME_CONFIG.CANVAS_WIDTH,
          aspectRatio: `${GAME_CONFIG.CANVAS_WIDTH} / ${GAME_CONFIG.CANVAS_HEIGHT}`,
        }}
      >
        <canvas
          ref={canvasRef}
          width={GAME_CONFIG.CANVAS_WIDTH}
          height={GAME_CONFIG.CANVAS_HEIGHT}
          onClick={handleCanvasClick}
          onTouchStart={handleTouchStart}
          className="w-full h-full block cursor-pointer"
          style={{ 
            imageRendering: 'pixelated',
            touchAction: 'none',
          }}
        />

        {uiState.status === 'menu' && (
          <StartScreen highScore={uiState.highScore} onStart={startGame} />
        )}

        {uiState.status === 'playing' && (
          <HUD
            score={uiState.distance}
            coins={uiState.coins}
            highScore={uiState.highScore}
            gameSpeed={uiState.gameSpeed}
          />
        )}

        {uiState.status === 'gameover' && (
          <GameOverScreen
            score={uiState.distance}
            coins={uiState.coins}
            highScore={uiState.highScore}
            isNewHighScore={uiState.isNewHighScore}
            onRestart={startGame}
            onMenu={goToMenu}
          />
        )}
      </div>
    </div>
  );
};
