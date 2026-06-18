import React from 'react';
import { COLORS } from '../game/config';

interface StartScreenProps {
  highScore: number;
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ highScore, onStart }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="text-center">
        <h1 
          className="text-5xl font-bold mb-2 tracking-wider"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            color: COLORS.BUTTON,
            textShadow: `0 0 10px ${COLORS.BUTTON}, 0 0 20px ${COLORS.BUTTON}, 0 0 40px ${COLORS.BUTTON}`,
          }}
        >
          像素跑酷
        </h1>
        <p 
          className="text-sm mb-8 tracking-widest"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            color: COLORS.TEXT_SECONDARY,
          }}
        >
          PIXEL RUNNER
        </p>

        <div className="mb-8">
          <p 
            className="text-xs mb-2"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              color: COLORS.TEXT_SECONDARY,
            }}
          >
            最高分
          </p>
          <p 
            className="text-2xl font-bold"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              color: COLORS.TEXT,
            }}
          >
            {highScore}
          </p>
        </div>

        <button
          onClick={onStart}
          className="px-8 py-4 text-lg font-bold transition-all duration-200 hover:scale-110 active:scale-95"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            backgroundColor: COLORS.BUTTON,
            color: '#000',
            border: '4px solid #000',
            boxShadow: `0 0 10px ${COLORS.BUTTON}, 0 4px 0 #b8860b`,
          }}
        >
          开始游戏
        </button>

        <div className="mt-8 text-xs space-y-2">
          <p 
            style={{
              fontFamily: '"Press Start 2P", monospace',
              color: COLORS.TEXT_SECONDARY,
            }}
          >
            按 空格键 或 点击屏幕 跳跃
          </p>
          <p 
            className="mt-2"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              color: COLORS.TEXT_SECONDARY,
            }}
          >
            躲避悬崖和尖刺，收集金币！
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-8">
          <div className="text-center">
            <div 
              className="w-8 h-8 mx-auto mb-2"
              style={{ backgroundColor: COLORS.PLATFORM }}
            />
            <p 
              className="text-xs"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                color: COLORS.TEXT_SECONDARY,
                fontSize: '8px',
              }}
            >
              平台
            </p>
          </div>
          <div className="text-center">
            <div 
              className="w-8 h-8 mx-auto mb-2"
              style={{ 
                width: 0,
                height: 0,
                borderLeft: '16px solid transparent',
                borderRight: '16px solid transparent',
                borderBottom: `32px solid ${COLORS.SPIKE}`,
              }}
            />
            <p 
              className="text-xs"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                color: COLORS.TEXT_SECONDARY,
                fontSize: '8px',
              }}
            >
              尖刺
            </p>
          </div>
          <div className="text-center">
            <div 
              className="w-8 h-8 mx-auto mb-2 rounded-full"
              style={{ backgroundColor: COLORS.COIN }}
            />
            <p 
              className="text-xs"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                color: COLORS.TEXT_SECONDARY,
                fontSize: '8px',
              }}
            >
              金币
            </p>
          </div>
          <div className="text-center">
            <div 
              className="w-8 h-8 mx-auto mb-2"
              style={{ backgroundColor: COLORS.PLATFORM_MOVING }}
            />
            <p 
              className="text-xs"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                color: COLORS.TEXT_SECONDARY,
                fontSize: '8px',
              }}
            >
              移动平台
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
