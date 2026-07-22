import React, { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { WorldMap } from './components/WorldMap';
import { MonsterCard } from './components/MonsterCard';
import { PlayerStats } from './components/PlayerStats';
import { QuestionPanel } from './components/QuestionPanel';
import { ResultOverlay } from './components/ResultOverlay';
import { getMonsterTaunt, getMathHint } from './services/geminiService';

const App: React.FC = () => {
  const { state, startZone, submitAnswer, goToMap, resetGame } = useGameState();
  const [monsterFlash, setMonsterFlash] = useState(false);
  const [taunt, setTaunt] = useState('');
  const [hint, setHint] = useState('');

  // Fetch monster taunt when a new monster appears
  useEffect(() => {
    if (state.phase === 'battle' && state.monster) {
      setTaunt('');
      setHint('');
      getMonsterTaunt(state.monster.name).then(setTaunt);
    }
  }, [state.monster?.id, state.phase]);

  // Fetch hint when player gets 2 wrong in a row
  useEffect(() => {
    if (state.wrongStreak >= 2 && state.currentQuestion && state.phase === 'battle') {
      getMathHint(state.currentQuestion.display, state.wrongStreak).then(setHint);
    } else if (state.wrongStreak === 0) {
      setHint('');
    }
  }, [state.wrongStreak]);

  // Flash monster on correct answer
  useEffect(() => {
    if (state.lastAnswerCorrect === true) {
      setMonsterFlash(true);
      setTimeout(() => setMonsterFlash(false), 400);
    }
  }, [state.lastAnswerCorrect, state.currentQuestion]);

  const handleSubmit = (answer: number) => {
    submitAnswer(answer);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-start select-none">
      {/* MAP */}
      {state.phase === 'map' && (
        <WorldMap
          clearedZones={state.clearedZones}
          player={state.player}
          onSelectZone={startZone}
        />
      )}

      {/* BATTLE */}
      {state.phase === 'battle' && state.monster && state.currentQuestion && (
        <div className="w-full max-w-lg px-4 py-4 flex flex-col gap-3">
          {/* Top bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={goToMap}
              className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-300 transition-colors"
            >
              ← 地圖
            </button>
            <div className="flex-1">
              <PlayerStats player={state.player} />
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">進度：</span>
            {Array.from({ length: state.totalMonstersInZone }).map((_, i) => (
              <span key={i} className={i < state.monstersDefeated ? 'text-emerald-400' : 'text-slate-600'}>
                {i < state.monstersDefeated ? '💀' : '🟤'}
              </span>
            ))}
            <span className="text-slate-500 ml-auto text-xs">
              {state.monstersDefeated}/{state.totalMonstersInZone}
            </span>
          </div>

          {/* Monster */}
          <MonsterCard monster={state.monster} flashing={monsterFlash} />

          {/* Monster taunt */}
          {taunt && (
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-300 italic text-center">
              💬 「{taunt}」
            </div>
          )}

          {/* Question */}
          <QuestionPanel
            question={state.currentQuestion}
            onSubmit={handleSubmit}
            lastAnswerCorrect={state.lastAnswerCorrect}
            hint={hint}
          />
        </div>
      )}

      {/* VICTORY / GAME OVER */}
      {(state.phase === 'victory' || state.phase === 'gameover') && (
        <ResultOverlay
          type={state.phase}
          zone={state.zone}
          monstersDefeated={state.monstersDefeated}
          onGoToMap={goToMap}
          onReset={resetGame}
        />
      )}
    </div>
  );
};

export default App;
