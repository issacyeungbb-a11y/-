import React from 'react';
import { Zone } from '../types';

interface Props {
  type: 'victory' | 'gameover';
  zone: Zone | null;
  monstersDefeated: number;
  onGoToMap: () => void;
  onReset: () => void;
}

const ZONE_NAMES: Record<Zone, string> = {
  forest: '迷霧森林',
  castle: '黑暗城堡',
  volcano: '烈焰火山',
};

export const ResultOverlay: React.FC<Props> = ({ type, zone, monstersDefeated, onGoToMap, onReset }) => {
  const isVictory = type === 'victory';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
      <div className="glass rounded-3xl p-8 max-w-sm w-full text-center animate-pop shadow-2xl">
        <div className="text-7xl mb-4">{isVictory ? '🏆' : '💔'}</div>
        <h2 className={`text-3xl font-black mb-2 ${isVictory ? 'text-yellow-400' : 'text-rose-400'}`}>
          {isVictory ? '通關成功！' : '英雄倒下了...'}
        </h2>
        {zone && (
          <p className="text-slate-300 mb-1">
            {isVictory ? `你征服了【${ZONE_NAMES[zone]}】！` : `倒喺【${ZONE_NAMES[zone]}】`}
          </p>
        )}
        <p className="text-slate-400 text-sm mb-6">
          擊敗怪獸：{monstersDefeated} 隻
        </p>

        <div className="flex flex-col gap-3">
          {isVictory ? (
            <>
              <button
                onClick={onGoToMap}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-black py-3 rounded-xl transition-all active:scale-95"
              >
                返回地圖 🗺️
              </button>
              <button
                onClick={onReset}
                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 rounded-xl transition-all active:scale-95"
              >
                重新開始
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onGoToMap}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black py-3 rounded-xl transition-all active:scale-95"
              >
                重返地圖
              </button>
              <button
                onClick={onReset}
                className="w-full bg-rose-700 hover:bg-rose-600 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
              >
                重新開始（重置進度）
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
