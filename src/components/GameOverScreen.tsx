import React from 'react';
import { COLORS } from '../game/config';

interface GameOverScreenProps {
  score: number;
  coins: number;
  highScore: number;
  isNewHighScore: boolean;
  onRestart: () => void;
  onMenu: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  coins,
  highScore,
  isNewHighScore,
  onRestart,
  onMenu,
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="text-center p-8" style={{ border: `4px solid ${COLORS.TEXT}` }}>
        <h2 
          className="text-3xl font-bold mb-6 tracking-wider"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            color: COLORS.SPIKE,
            textShadow: `0 0 10px ${COLORS.SPIKE}`,
          }}
        >
          游戏结束
        </h2>

        {isNewHighScore && (
          <p 
            className="text-lg mb-4 animate-pulse"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              color: COLORS.BUTTON,
              textShadow: `0 0 10px ${COLORS.BUTTON}`,
            }}
          >
            🎉 新纪录！🎉
          </p>
        )}

        <div className="space-y-4 mb-8">
          <div>
            <p 
              className="text-xs mb-1"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              奔跑距离
            </p>
            <p 
              className="text-2xl font-bold"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                color: COLORS.TEXT,
              }}
            >
              {score} m
            </p>
          </div>

          <div>
            <p 
              className="text-xs mb-1"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              收集金币
            </p>
            <p 
              className="text-xl font-bold"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                color: COLORS.COIN,
              }}
            >
              {coins}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-600">
            <p 
              className="text-xs mb-1"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              最高分
            </p>
            <p 
              className="text-xl font-bold"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                color: COLORS.BUTTON,
              }}
            >
              {highScore}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="px-6 py-3 text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              backgroundColor: COLORS.BUTTON,
              color: '#000',
              border: '4px solid #000',
              boxShadow: `0 0 10px ${COLORS.BUTTON}`,
            }}
          >
            再来一次
          </button>

          <button
            onClick={onMenu}
            className="px-6 py-3 text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              backgroundColor: 'transparent',
              color: COLORS.TEXT,
              border: `4px solid ${COLORS.TEXT}`,
            }}
          >
            返回主菜单
          </button>
        </div>
      </div>
    </div>
  );
};
