import React from 'react';
import { Player } from '../types';

interface Props {
  player: Player;
}

export const PlayerStats: React.FC<Props> = ({ player }) => {
  const hpPct = (player.hp / player.maxHp) * 100;
  const hpColor = hpPct > 60 ? 'from-emerald-500 to-green-400' : hpPct > 30 ? 'from-yellow-500 to-amber-400' : 'from-rose-600 to-red-500';

  return (
    <div className="glass rounded-xl px-4 py-3 flex items-center gap-4 w-full">
      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-black text-white shrink-0">
        ⚔️
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-bold text-slate-200">勇者</span>
          <span className="text-xs text-slate-400">Lv {player.level}</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${hpColor} rounded-full transition-all duration-500`}
            style={{ width: `${Math.max(0, hpPct)}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-0.5">HP {player.hp} / {player.maxHp}</p>
      </div>
    </div>
  );
};
