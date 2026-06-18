import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GAME_CONFIG } from '../game/config';
import { GameStatus } from '../game/types';
import { Player } from '../game/entities/Player';
import { Platform } from '../game/entities/Platform';
import { MovingPlatform } from '../game/entities/MovingPlatform';
import { Spike } from '../game/entities/Spike';
import { Coin } from '../game/entities/Coin';
import { Background } from '../game/engine/Background';
import { ParticleSystem } from '../game/engine/ParticleSystem';
import { LevelGenerator, PlatformType } from '../game/engine/LevelGenerator';
import { Collision } from '../game/engine/Collision';
import { getHighScore, updateHighScore } from '../utils/storage';
import { StartScreen } from './StartScreen';
import { GameOverScreen } from './GameOverScreen';
import { HUD } from './HUD';

export const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<{
    status: GameStatus;
    score: number;
    coins: number;
    highScore: number;
    gameSpeed: number;
    player: Player | null;
    platforms: PlatformType[];
    spikes: Spike[];
    coinsArr: Coin[];
    background: Background;
    particles: ParticleSystem;
    levelGenerator: LevelGenerator;
    animationId: number | null;
    lastTime: number;
    scoreAccumulator: number;
  }>({
    status: 'menu',
    score: 0,
    coins: 0,
    highScore: 0,
    gameSpeed: GAME_CONFIG.BASE_SPEED,
    player: null,
    platforms: [],
    spikes: [],
    coinsArr: [],
    background: new Background(),
    particles: new ParticleSystem(),
    levelGenerator: new LevelGenerator(),
    animationId: null,
    lastTime: 0,
    scoreAccumulator: 0,
  });

  const [uiState, setUiState] = useState<{
    status: GameStatus;
    score: number;
    coins: number;
    highScore: number;
    gameSpeed: number;
    isNewHighScore: boolean;
  }>({
    status: 'menu',
    score: 0,
    coins: 0,
    highScore: 0,
    gameSpeed: GAME_CONFIG.BASE_SPEED,
    isNewHighScore: false,
  });

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
    state.score = 0;
    state.coins = 0;
    state.gameSpeed = GAME_CONFIG.BASE_SPEED;
    state.scoreAccumulator = 0;
    state.highScore = getHighScore();

    state.platforms.forEach((platform) => {
      const spikes = state.levelGenerator.generateSpikes(platform);
      const coins = state.levelGenerator.generateCoins(platform);
      state.spikes.push(...spikes);
      state.coinsArr.push(...coins);
    });
  }, []);

  const startGame = useCallback(() => {
    initGame();
    gameStateRef.current.status = 'playing';
    setUiState((prev) => ({
      ...prev,
      status: 'playing',
      score: 0,
      coins: 0,
      highScore: gameStateRef.current.highScore,
      gameSpeed: GAME_CONFIG.BASE_SPEED,
      isNewHighScore: false,
    }));
  }, [initGame]);

  const endGame = useCallback(() => {
    const state = gameStateRef.current;
    state.status = 'gameover';
    
    if (state.player) {
      state.particles.emitDeath(state.player.x + state.player.width / 2, state.player.y + state.player.height / 2);
    }

    const finalScore = state.score + state.coins * 10;
    const newHighScore = updateHighScore(finalScore);
    const isNewHighScore = finalScore > state.highScore;

    setUiState((prev) => ({
      ...prev,
      status: 'gameover',
      score: finalScore,
      highScore: newHighScore,
      isNewHighScore,
    }));

    gameStateRef.current.highScore = newHighScore;
  }, []);

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
    const state = gameStateRef.current;
    state.highScore = getHighScore();
    setUiState((prev) => ({ ...prev, highScore: state.highScore }));
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

      state.background.update(deltaTime, state.gameSpeed);
      state.background.render(ctx);

      if (state.status === 'playing' || state.status === 'gameover') {
        if (state.status === 'playing') {
          state.gameSpeed = Math.min(
            GAME_CONFIG.BASE_SPEED + state.score * GAME_CONFIG.SPEED_INCREMENT,
            GAME_CONFIG.MAX_SPEED
          );
          state.levelGenerator.setDifficulty(state.score);

          state.scoreAccumulator += state.gameSpeed * deltaTime;
          if (state.scoreAccumulator >= 10) {
            state.score += Math.floor(state.scoreAccumulator / 10);
            state.scoreAccumulator = state.scoreAccumulator % 10;
          }

          if (state.player) {
            state.player.update(deltaTime);
            state.player.isOnGround = false;

            for (const platform of state.platforms) {
              platform.update(deltaTime, state.gameSpeed);

              if (Collision.checkTopCollision(state.player.getBounds(), state.player.velocity.vy, platform.getBounds())) {
                let platformY = platform.y;
                if (platform instanceof MovingPlatform) {
                  platformY += platform.getVelocityY();
                }
                state.player.land(platformY);
                break;
              }
            }

            for (const spike of state.spikes) {
              spike.update(deltaTime, state.gameSpeed);
              if (Collision.checkSpikeCollision(state.player.getBounds(), spike.getBounds())) {
                endGame();
                break;
              }
            }

            for (const coin of state.coinsArr) {
              if (coin.collected) continue;
              coin.update(deltaTime, state.gameSpeed);
              if (Collision.checkCoinCollision(state.player.getBounds(), coin.getBounds())) {
                coin.collect();
                state.coins++;
                state.particles.emitCoinCollect(
                  coin.x + coin.width / 2,
                  coin.y + coin.height / 2
                );
              }
            }

            if (Collision.isBelowScreen(state.player.y, state.player.height, GAME_CONFIG.CANVAS_HEIGHT)) {
              endGame();
            }
          }

          state.platforms = state.platforms.filter((p) => !p.isOffScreen());
          state.spikes = state.spikes.filter((s) => !s.isOffScreen());
          state.coinsArr = state.coinsArr.filter((c) => !c.isOffScreen() || c.collected);

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

          setUiState((prev) => ({
            ...prev,
            score: state.score + state.coins * 10,
            coins: state.coins,
            gameSpeed: state.gameSpeed,
          }));
        }

        state.particles.update(deltaTime);

        state.background.renderGround(ctx, state.gameSpeed);

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
  }, [endGame]);

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
            score={uiState.score}
            coins={uiState.coins}
            highScore={uiState.highScore}
            gameSpeed={uiState.gameSpeed}
          />
        )}

        {uiState.status === 'gameover' && (
          <GameOverScreen
            score={uiState.score}
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
