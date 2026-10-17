export type ZombieType = 'normal' | 'cone' | 'bucket' | 'fast' | 'strong';

export interface ZombieConfig {
  type: ZombieType;
  name: string;
  emoji: string;
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
  points: number;
  imageKey: string;
}

export interface ZombieEntity {
  id: string;
  type: ZombieType;
  row: number;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
  eatingPlantId: string | null;
  isSlowed: boolean;
  slowTimer: number;
  active: boolean;
}
