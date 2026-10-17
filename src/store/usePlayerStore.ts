import { create } from 'zustand';
import { PlantType } from '../types/plant.types';

interface PlayerState {
  coins: number;
  brains: number;
  highScore: number;
  unlockedPlants: PlantType[];
  audioEnabled: boolean;
  hapticEnabled: boolean;

  // Actions
  addCoins: (amount: number) => void;
  addBrains: (amount: number) => void;
  setHighScore: (score: number) => void;
  unlockPlant: (plant: PlantType) => void;
  toggleAudio: () => void;
  toggleHaptic: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  coins: 100,
  brains: 0,
  highScore: 0,
  unlockedPlants: [
    'sunflower',
    'peashooter',
    'wallnut',
    'snowpea',
    'repeater',
    'chomper',
    'cherrybomb',
  ],
  audioEnabled: true,
  hapticEnabled: true,

  addCoins: (amount) => set((s) => ({ coins: s.coins + amount })),
  addBrains: (amount) => set((s) => ({ brains: s.brains + amount })),
  setHighScore: (score) => {
    if (score > get().highScore) {
      set({ highScore: score });
    }
  },
  unlockPlant: (plant) => {
    if (!get().unlockedPlants.includes(plant)) {
      set((s) => ({ unlockedPlants: [...s.unlockedPlants, plant] }));
    }
  },
  toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),
  toggleHaptic: () => set((s) => ({ hapticEnabled: !s.hapticEnabled })),
}));
