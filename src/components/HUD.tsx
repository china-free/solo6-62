import React from 'react';
import { COLORS } from '../game/config';

interface HUDProps {
  score: number;
  coins: number;
  highScore: number;
  gameSpeed: number;
}

export const HUD: React.FC<HUDProps> = ({ score, coins, highScore, gameSpeed }) => {
  const speedPercent = Math.min((gameSpeed / 12) * 100, 100);

  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none">
      <div 
        className="px-4 py-2 rounded"
        style={{ backgroundColor: COLORS.HUD_BG }}
      >
        <p 
          className="text-xs mb-1"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            color: COLORS.TEXT_SECONDARY,
            fontSize: '10px',
          }}
        >
          距离
        </p>
        <p 
          className="text-lg font-bold"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            color: COLORS.TEXT,
          }}
        >
          {score} m
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div 
          className="px-4 py-2 rounded flex items-center gap-2"
          style={{ backgroundColor: COLORS.HUD_BG }}
        >
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: COLORS.COIN }}
          />
          <p 
            className="text-lg font-bold"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              color: COLORS.COIN,
            }}
          >
            {coins}
          </p>
        </div>

        <div 
          className="px-3 py-1 rounded"
          style={{ backgroundColor: COLORS.HUD_BG }}
        >
          <p 
            className="text-xs"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              color: COLORS.TEXT_SECONDARY,
              fontSize: '8px',
            }}
          >
            最高: {highScore}
          </p>
        </div>
      </div>

      <div 
        className="px-4 py-2 rounded"
        style={{ backgroundColor: COLORS.HUD_BG }}
      >
        <p 
          className="text-xs mb-1"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            color: COLORS.TEXT_SECONDARY,
            fontSize: '10px',
          }}
        >
          速度
        </p>
        <div className="w-20 h-3 bg-gray-700 rounded overflow-hidden">
          <div 
            className="h-full transition-all duration-300"
            style={{
              width: `${speedPercent}%`,
              backgroundColor: speedPercent > 80 ? COLORS.SPIKE : COLORS.PLATFORM,
            }}
          />
        </div>
      </div>
    </div>
  );
};
