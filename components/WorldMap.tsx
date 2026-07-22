import React from 'react';
import { Zone, ZoneInfo, Player } from '../types';

const ZONES: ZoneInfo[] = [
  {
    id: 'forest',
    name: '迷霧森林',
    emoji: '🌲',
    gradient: 'from-emerald-800 to-emerald-600',
    border: 'border-emerald-500',
    description: '加減法 (1–10)',
    label: '入門',
  },
  {
    id: 'castle',
    name: '黑暗城堡',
    emoji: '🏰',
    gradient: 'from-violet-800 to-violet-600',
    border: 'border-violet-500',
    description: '乘法表 (1–9)',
    label: '進階',
  },
  {
    id: 'volcano',
    name: '烈焰火山',
    emoji: '🌋',
    gradient: 'from-orange-800 to-red-700',
    border: 'border-orange-500',
    description: '混合運算 (大數)',
    label: '終極',
  },
];

interface Props {
  clearedZones: Set<Zone>;
  player: Player;
  onSelectZone: (zone: Zone) => void;
}

export const WorldMap: React.FC<Props> = ({ clearedZones, player, onSelectZone }) => (
  <div className="flex flex-col items-center w-full max-w-lg px-4 py-6">
    <div className="text-center mb-6">
      <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 mb-1">
        數學勇者
      </h1>
      <p className="text-slate-400 text-sm">Math Quest RPG</p>
    </div>

    <div className="glass rounded-2xl px-6 py-3 mb-8 flex items-center gap-6">
      <div className="text-center">
        <p className="text-xs text-slate-400">等級</p>
        <p className="text-2xl font-black text-yellow-400">Lv {player.level}</p>
      </div>
      <div className="flex-1">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>經驗值</span>
          <span>{player.xp % 100}/100</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${player.xp % 100}%` }}
          />
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs text-slate-400">HP</p>
        <p className="text-2xl font-black text-rose-400">{player.hp}</p>
      </div>
    </div>

    <div className="w-full space-y-4">
      {ZONES.map((zone) => {
        const cleared = clearedZones.has(zone.id);
        return (
          <button
            key={zone.id}
            onClick={() => onSelectZone(zone.id)}
            className={`w-full bg-gradient-to-r ${zone.gradient} border ${zone.border} rounded-2xl p-5 flex items-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 shadow-lg relative overflow-hidden`}
          >
            <span className="text-5xl animate-float" style={{ animationDelay: `${ZONES.indexOf(zone) * 0.4}s` }}>
              {zone.emoji}
            </span>
            <div className="text-left flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-black text-xl text-white">{zone.name}</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-white/80">{zone.label}</span>
              </div>
              <p className="text-sm text-white/70">{zone.description}</p>
            </div>
            {cleared && (
              <span className="text-3xl" title="已通關">✅</span>
            )}
          </button>
        );
      })}
    </div>

    <p className="mt-8 text-slate-500 text-xs text-center">
      答題打怪 · 答啱打怪獸 · 答錯扣自己血量
    </p>
  </div>
);
