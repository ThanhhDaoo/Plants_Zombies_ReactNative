import { create } from 'zustand';
import { WEAPONS } from '../game/config/pubgWeapons';

export const usePlayerStore = create((set, get) => ({
  coins: 200,
  brains: 2,
  highScore: 0,
  topRank: 0,
  totalKills: 0,
  selectedWeapon: 'pea_pistol',
  unlockedWeapons: ['pea_pistol'],
  weaponLevels: {
    pea_pistol: 1,
    threepeater: 1,
    snow_sniper: 1,
    fire_gatling: 1,
    melon_launcher: 1,
    plasma_repeater: 1,
  },
  stats: {
    maxHealthLevel: 1, // Base 100, +25 per lvl (max 5)
    armorLevel: 1,     // Base 25, +20 per lvl (max 5)
    speedLevel: 1,     // Base 4.6, +0.3 per lvl (max 5)
  },
  audioEnabled: true,
  hapticEnabled: true,

  // Add match earnings
  addMatchRewards: ({ coins = 0, brains = 0, kills = 0, score = 0, isWin = false }) => {
    set((state) => {
      const newCoins = state.coins + Math.max(0, coins);
      const newBrains = state.brains + Math.max(0, brains);
      const newKills = state.totalKills + Math.max(0, kills);
      const newHighScore = Math.max(state.highScore, score);
      const newTopRank = isWin ? state.topRank + 1 : state.topRank;
      return {
        coins: newCoins,
        brains: newBrains,
        totalKills: newKills,
        highScore: newHighScore,
        topRank: newTopRank,
      };
    });
  },

  selectWeapon: (id) => {
    if (get().unlockedWeapons.includes(id)) {
      set({ selectedWeapon: id });
      return true;
    }
    return false;
  },

  unlockWeapon: (id) => {
    const state = get();
    const config = WEAPONS[id];
    if (!config) return false;
    if (state.coins >= config.cost && !state.unlockedWeapons.includes(id)) {
      set({
        coins: state.coins - config.cost,
        unlockedWeapons: [...state.unlockedWeapons, id],
        selectedWeapon: id,
      });
      return true;
    }
    return false;
  },

  upgradeWeapon: (id) => {
    const state = get();
    const currentLevel = state.weaponLevels[id] || 1;
    if (currentLevel >= 5) return false;
    const upgradeCost = currentLevel * 150;
    if (state.coins >= upgradeCost) {
      set({
        coins: state.coins - upgradeCost,
        weaponLevels: {
          ...state.weaponLevels,
          [id]: currentLevel + 1,
        },
      });
      return true;
    }
    return false;
  },

  upgradeStat: (statKey) => {
    const state = get();
    const currentLevel = state.stats[statKey] || 1;
    if (currentLevel >= 5) return false;
    const cost = currentLevel * 100;
    if (state.coins >= cost) {
      set({
        coins: state.coins - cost,
        stats: {
          ...state.stats,
          [statKey]: currentLevel + 1,
        },
      });
      return true;
    }
    return false;
  },

  toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),
  toggleHaptic: () => set((s) => ({ hapticEnabled: !s.hapticEnabled })),
}));
