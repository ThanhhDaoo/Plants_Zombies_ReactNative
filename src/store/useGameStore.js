import { create } from 'zustand';
import { GAME_SETTINGS } from '../game/config/game.config';
import { PLANTS_CONFIG } from '../game/config/plants.config';

export const useGameStore = create((set, get) => ({
  sun: GAME_SETTINGS.INITIAL_SUN,
  selectedSeed: null,
  isShovelActive: false,
  gameStatus: 'playing',
  wave: 1,
  totalWaves: GAME_SETTINGS.TOTAL_WAVES,
  score: 0,
  seedCooldowns: {},

  addSun: (amount) => set((state) => ({ sun: state.sun + amount })),

  spendSun: (amount) => {
    if (get().sun >= amount) {
      set((state) => ({ sun: state.sun - amount }));
      return true;
    }
    return false;
  },

  selectSeed: (seed) =>
    set({
      selectedSeed: seed,
      isShovelActive: false,
    }),

  toggleShovel: () =>
    set((state) => ({
      isShovelActive: !state.isShovelActive,
      selectedSeed: null,
    })),

  setGameStatus: (status) => set({ gameStatus: status }),

  triggerSeedCooldown: (type) => {
    const config = PLANTS_CONFIG[type];
    const availableAt = Date.now() + (config ? config.cooldownMs : 5000);
    set((state) => ({
      seedCooldowns: {
        ...state.seedCooldowns,
        [type]: availableAt,
      },
      selectedSeed: null,
    }));
  },

  isSeedReady: (type) => {
    const availableAt = get().seedCooldowns[type] || 0;
    return Date.now() >= availableAt;
  },

  addScore: (points) => set((state) => ({ score: state.score + points })),

  setWave: (wave) => set({ wave }),

  resetGame: () =>
    set({
      sun: GAME_SETTINGS.INITIAL_SUN,
      selectedSeed: null,
      isShovelActive: false,
      gameStatus: 'playing',
      wave: 1,
      score: 0,
      seedCooldowns: {},
    }),
}));
