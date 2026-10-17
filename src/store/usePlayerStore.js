import { create } from 'zustand';

export const usePlayerStore = create((set, get) => ({
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
