export enum AppMode {
  LOGIN = 'LOGIN', // New login screen
  MENU = 'MENU',
  DRILL_SELECT = 'DRILL_SELECT', // Select which number (1-9) to practice
  DRILL_PLAY = 'DRILL_PLAY', // Sequential practice (e.g. 2x1, 2x2...)
  GRID_CHALLENGE = 'GRID_CHALLENGE', // Full table filling
  BOSS = 'BOSS', // Word problem by AI (Deprecated/Replaced by 3D Vertical)
  VERTICAL_SELECT = 'VERTICAL_SELECT', // Select difficulty for vertical math
  VERTICAL_PLAY = 'VERTICAL_PLAY', // The actual vertical game (2D x 1D)
  VERTICAL_3D_PLAY = 'VERTICAL_3D_PLAY', // 3D x 1D Vertical game
}

export interface Problem {
  factorA: number;
  factorB: number;
  answer: number;
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export interface Student {
  id: number;
  classInfo: string;
  name: string;
  group: 1 | 2 | 3;
}