import React from 'react';
import { Monster } from '../types';

interface Props {
  monster: Monster;
  flashing: boolean;
}

export const MonsterCard: React.FC<Props> = ({ monster, flashing }) => {
  const hpPct = (monster.hp / monster.maxHp) * 100;
  const hpColor = hpPct > 60 ? 'from-rose-500 to-red-400' : hpPct > 30 ? 'from-orange-500 to-amber-400' : 'from-yellow-400 to-lime-400';

  return (
    <div className={`glass rounded-2xl p-5 flex flex-col items-center gap-3 transition-all duration-150 ${flashing ? 'ring-2 ring-yellow-400 bg-yellow-400/10' : ''}`}>
      <div className={`text-7xl select-none ${flashing ? 'animate-shake' : 'animate-float'}`}>
        {monster.emoji}
      </div>
      <div className="text-center">
        <p className="font-black text-lg text-white">{monster.name}</p>
        <p className="text-xs text-slate-400 mt-0.5">{monster.description}</p>
      </div>
      <div className="w-full">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>怪獸血量</span>
          <span>{monster.hp} / {monster.maxHp}</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${hpColor} rounded-full transition-all duration-500`}
            style={{ width: `${Math.max(0, hpPct)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
