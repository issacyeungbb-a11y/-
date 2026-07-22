import { useState, useCallback } from 'react';
import { GameState, Zone, Player, Question } from '../types';
import { ZONE_MONSTERS, MONSTERS_PER_ZONE } from '../data/monsters';

const PLAYER_DAMAGE = 20;
const MONSTER_DAMAGE = 30;

const INITIAL_PLAYER: Player = { hp: 100, maxHp: 100, xp: 0, level: 1 };

function generateQuestion(zone: Zone): Question {
  let a: number, b: number, answer: number;
  const op = zone === 'forest'
    ? (Math.random() < 0.5 ? '+' : '-')
    : zone === 'castle'
    ? '×'
    : ['+', '-', '×'][Math.floor(Math.random() * 3)] as '+' | '-' | '×';

  if (zone === 'forest') {
    a = Math.floor(Math.random() * 10) + 1;
    if (op === '-') {
      b = Math.floor(Math.random() * a) + 1;
      answer = a - b;
    } else {
      b = Math.floor(Math.random() * 10) + 1;
      answer = a + b;
    }
  } else if (zone === 'castle') {
    a = Math.floor(Math.random() * 9) + 1;
    b = Math.floor(Math.random() * 9) + 1;
    answer = a * b;
  } else {
    if (op === '×') {
      a = Math.floor(Math.random() * 11) + 2;
      b = Math.floor(Math.random() * 11) + 2;
      answer = a * b;
    } else if (op === '+') {
      a = Math.floor(Math.random() * 90) + 10;
      b = Math.floor(Math.random() * 90) + 10;
      answer = a + b;
    } else {
      a = Math.floor(Math.random() * 90) + 20;
      b = Math.floor(Math.random() * (a - 1)) + 1;
      answer = a - b;
    }
  }

  return { a, b, operation: op as Question['operation'], answer, display: `${a} ${op} ${b} = ?` };
}

const INITIAL_STATE: GameState = {
  phase: 'map',
  zone: null,
  player: INITIAL_PLAYER,
  monster: null,
  currentQuestion: null,
  monstersDefeated: 0,
  totalMonstersInZone: MONSTERS_PER_ZONE,
  wrongStreak: 0,
  lastAnswerCorrect: null,
  clearedZones: new Set<Zone>(),
};

export function useGameState() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  const startZone = useCallback((zone: Zone) => {
    const monster = { ...ZONE_MONSTERS[zone][0] };
    setState((prev: GameState) => ({
      ...prev,
      phase: 'battle',
      zone,
      monster,
      currentQuestion: generateQuestion(zone),
      monstersDefeated: 0,
      wrongStreak: 0,
      lastAnswerCorrect: null,
      player: prev.phase === 'gameover'
        ? INITIAL_PLAYER
        : { ...prev.player, hp: Math.min(prev.player.maxHp, prev.player.hp + 30) },
    }));
  }, []);

  const submitAnswer = useCallback((answer: number) => {
    setState((prev: GameState) => {
      if (!prev.monster || !prev.currentQuestion || !prev.zone) return prev;
      const correct = answer === prev.currentQuestion.answer;

      if (correct) {
        const newMonsterHp = prev.monster.hp - MONSTER_DAMAGE;
        if (newMonsterHp <= 0) {
          const newDefeated = prev.monstersDefeated + 1;
          const xpGain = 10;
          const newXp = prev.player.xp + xpGain;
          const newLevel = Math.floor(newXp / 100) + 1;
          const newPlayer = { ...prev.player, xp: newXp, level: newLevel };

          if (newDefeated >= MONSTERS_PER_ZONE) {
            const cleared = new Set(prev.clearedZones);
            cleared.add(prev.zone);
            return { ...prev, phase: 'victory', monster: null, currentQuestion: null, monstersDefeated: newDefeated, clearedZones: cleared, player: newPlayer, wrongStreak: 0, lastAnswerCorrect: true };
          }

          const nextMonster = { ...ZONE_MONSTERS[prev.zone][newDefeated] };
          return { ...prev, monster: nextMonster, currentQuestion: generateQuestion(prev.zone), monstersDefeated: newDefeated, player: newPlayer, wrongStreak: 0, lastAnswerCorrect: true };
        }

        return { ...prev, monster: { ...prev.monster, hp: newMonsterHp }, currentQuestion: generateQuestion(prev.zone), wrongStreak: 0, lastAnswerCorrect: true };
      } else {
        const newHp = prev.player.hp - PLAYER_DAMAGE;
        if (newHp <= 0) {
          return { ...prev, phase: 'gameover', player: { ...prev.player, hp: 0 }, wrongStreak: prev.wrongStreak + 1, lastAnswerCorrect: false };
        }
        return { ...prev, player: { ...prev.player, hp: newHp }, wrongStreak: prev.wrongStreak + 1, lastAnswerCorrect: false };
      }
    });
  }, []);

  const goToMap = useCallback(() => {
    setState((prev: GameState) => ({ ...prev, phase: 'map', zone: null, monster: null, currentQuestion: null, lastAnswerCorrect: null }));
  }, []);

  const resetGame = useCallback(() => {
    setState({ ...INITIAL_STATE, clearedZones: new Set<Zone>() });
  }, []);

  return { state, startZone, submitAnswer, goToMap, resetGame };
}
