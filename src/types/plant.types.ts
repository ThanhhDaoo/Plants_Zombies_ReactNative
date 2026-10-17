export type PlantType =
  | 'sunflower'
  | 'peashooter'
  | 'wallnut'
  | 'snowpea'
  | 'repeater'
  | 'chomper'
  | 'cherrybomb';

export interface PlantConfig {
  type: PlantType;
  name: string;
  emoji: string;
  cost: number;
  health: number;
  maxHealth: number;
  cooldownMs: number;
  description: string;
  shoots?: boolean;
  damage?: number;
  shootIntervalMs?: number;
  bulletSpeed?: number;
  producesSun?: boolean;
  sunAmount?: number;
  sunIntervalMs?: number;
  slow?: boolean;
  double?: boolean;
  instantExplode?: boolean;
  explodeRadius?: number;
}

export interface PlantEntity {
  id: string;
  type: PlantType;
  row: number;
  col: number;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  lastShotTime: number;
  lastProductionTime: number;
  plantedAt: number;
}

export interface ProjectileEntity {
  id: string;
  row: number;
  x: number;
  y: number;
  speed: number;
  damage: number;
  slow: boolean;
  active: boolean;
}
