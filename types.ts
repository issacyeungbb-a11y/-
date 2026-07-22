export type Zone = 'forest' | 'castle' | 'volcano';
export type GamePhase = 'map' | 'battle' | 'victory' | 'gameover';
export type Operation = '+' | '-' | '×';

export interface Question {
  a: number;
  b: number;
  operation: Operation;
  answer: number;
  display: string;
}

export interface Monster {
  id: string;
  name: string;
  emoji: string;
  hp: number;
  maxHp: number;
  description: string;
  zone: Zone;
}

export interface Player {
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
}

export interface ZoneInfo {
  id: Zone;
  name: string;
  emoji: string;
  gradient: string;
  border: string;
  description: string;
  label: string;
}

export interface GameState {
  phase: GamePhase;
  zone: Zone | null;
  player: Player;
  monster: Monster | null;
  currentQuestion: Question | null;
  monstersDefeated: number;
  totalMonstersInZone: number;
  wrongStreak: number;
  lastAnswerCorrect: boolean | null;
  clearedZones: Set<Zone>;
}
