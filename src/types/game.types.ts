export type GameMode = 'classic' | 'survival';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover' | 'victory';

export interface GridPosition {
  row: number; // 0 to 4
  col: number; // 0 to 8
}

export interface PixelPosition {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect extends PixelPosition, Size {}

export interface SunItem {
  id: string;
  x: number;
  y: number;
  targetY: number;
  value: number;
  vy: number;
  collected: boolean;
  createdAt: number;
}

export interface LawnMowerEntity {
  id: string;
  row: number;
  x: number;
  y: number;
  active: boolean;
  used: boolean;
  speed: number;
}
