import { create } from 'zustand';
import { WEAPONS } from '../game/config/pubgWeapons';

export const SKINS_CONFIG = {
  default: { id: 'default', name: 'Đậu Tân Binh', emoji: '🌱', cost: 0, desc: 'Chiến binh đậu nguyên bản' },
  ninja: { id: 'ninja', name: 'Đậu Ninja', emoji: '🥷', cost: 350, desc: 'Lướt né để lại khúc gỗ thế thân, +10% tốc độ chạy' },
  cowboy: { id: 'cowboy', name: 'Đậu Cao Bồi', emoji: '🤠', cost: 500, desc: 'Đội mũ phớt miền tây, tăng +15% sát thương súng lục' },
  cyberpunk: { id: 'cyberpunk', name: 'Đậu Cyberpunk', emoji: '⚡', cost: 800, desc: 'Giáp công nghệ neon, tăng +20 Giáp khởi đầu' },
  arctic: { id: 'arctic', name: 'Đậu Bắc Cực', emoji: '❄️', cost: 650, desc: 'Hào quang sương giá, làm chậm quái tiếp cận' },
};

export const PETS_CONFIG = {
  mini_sunflower: { id: 'mini_sunflower', name: 'Sunflower Nhí', emoji: '🌻', cost: 400, desc: 'Bay theo nhặt xu và não trong bán kính 200px' },
  mini_wallnut: { id: 'mini_wallnut', name: 'Wall-nut Bảo Hộ', emoji: '🥥', cost: 600, desc: 'Khiên óc chó xoay quanh đỡ 1 đòn cắn mỗi 12 giây' },
  mini_shroom: { id: 'mini_shroom', name: 'Nấm Độc Mini', emoji: '🍄', cost: 500, desc: 'Phun đám khói độc làm chậm kẻ thù bám đuổi' },
};

export const usePlayerStore = create((set, get) => ({
  coins: 450,
  brains: 5,
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
    maxHealthLevel: 1,
    armorLevel: 1,
    speedLevel: 1,
  },
  audioEnabled: true,
  hapticEnabled: true,

  // Skins & Pets
  selectedSkin: 'default',
  unlockedSkins: ['default'],
  selectedPet: null,
  unlockedPets: [],

  // Zen Garden (Idle AFK Rewards)
  zenGarden: {
    lastHarvest: Date.now() - 3600 * 1000 * 2.5, // 2.5h accumulated initially for instant fun
    plots: [
      { id: 'sunflower', name: 'Hoa Hướng Dương', emoji: '🌻', level: 1, coinRate: 30, brainRate: 0 },
      { id: 'marigold', name: 'Cúc Vạn Thọ', emoji: '🌼', level: 1, coinRate: 45, brainRate: 0 },
      { id: 'nightshroom', name: 'Nấm Mặt Trăng', emoji: '🍄', level: 1, coinRate: 10, brainRate: 0.35 },
      { id: 'goldentree', name: 'Cây Vàng Đột Biến', emoji: '🌳', level: 1, coinRate: 70, brainRate: 0.6 },
    ],
  },

  // Lucky Wheel
  lastSpinTime: 0,

  // Calculate accumulated Zen Garden rewards
  getZenRewards: () => {
    const zg = get().zenGarden;
    const now = Date.now();
    const elapsedHours = Math.min(12, Math.max(0, (now - zg.lastHarvest) / (1000 * 3600)));

    let totalCoins = 0;
    let totalBrains = 0;

    for (const plot of zg.plots) {
      totalCoins += plot.coinRate * plot.level * elapsedHours;
      totalBrains += plot.brainRate * plot.level * elapsedHours;
    }

    return {
      coins: Math.floor(totalCoins),
      brains: Math.floor(totalBrains),
      elapsedHours: elapsedHours.toFixed(1),
    };
  },

  harvestZenGarden: () => {
    const rewards = get().getZenRewards();
    if (rewards.coins <= 0 && rewards.brains <= 0) return { coins: 0, brains: 0 };

    set((state) => ({
      coins: state.coins + rewards.coins,
      brains: state.brains + rewards.brains,
      zenGarden: {
        ...state.zenGarden,
        lastHarvest: Date.now(),
      },
    }));

    return rewards;
  },

  upgradeZenPlot: (index) => {
    const state = get();
    const plot = state.zenGarden.plots[index];
    if (!plot || plot.level >= 5) return false;
    const cost = plot.level * 120;
    if (state.coins >= cost) {
      const newPlots = [...state.zenGarden.plots];
      newPlots[index] = { ...plot, level: plot.level + 1 };
      set({
        coins: state.coins - cost,
        zenGarden: {
          ...state.zenGarden,
          plots: newPlots,
        },
      });
      return true;
    }
    return false;
  },

  // Lucky Spin
  canFreeSpin: () => {
    const last = get().lastSpinTime;
    return Date.now() - last >= 1000 * 3600 * 12; // Free every 12 hours
  },

  spinLuckyWheel: () => {
    const state = get();
    const PRIZES = [
      { text: '100 Xu', type: 'coins', value: 100, emoji: '🪙', color: '#ffd54f' },
      { text: '2 Não', type: 'brains', value: 2, emoji: '🧠', color: '#f48fb1' },
      { text: '250 Xu', type: 'coins', value: 250, emoji: '🪙', color: '#ffb300' },
      { text: '50 Xu', type: 'coins', value: 50, emoji: '🪙', color: '#ffe082' },
      { text: '500 Xu VIP', type: 'coins', value: 500, emoji: '💰', color: '#ff6f00' },
      { text: '5 Não', type: 'brains', value: 5, emoji: '🧠', color: '#ec407a' },
      { text: '150 Xu', type: 'coins', value: 150, emoji: '🪙', color: '#ffca28' },
      { text: '3 Não VIP', type: 'brains', value: 3, emoji: '🧠', color: '#ab47bc' },
    ];

    const randomIndex = Math.floor(Math.random() * PRIZES.length);
    const won = PRIZES[randomIndex];

    const updates = { lastSpinTime: Date.now() };
    if (won.type === 'coins') updates.coins = state.coins + won.value;
    if (won.type === 'brains') updates.brains = state.brains + won.value;

    set(updates);
    return { prize: won, index: randomIndex };
  },

  // Skins
  selectSkin: (id) => {
    if (get().unlockedSkins.includes(id)) {
      set({ selectedSkin: id });
      return true;
    }
    return false;
  },

  unlockSkin: (id) => {
    const state = get();
    const config = SKINS_CONFIG[id];
    if (!config) return false;
    if (state.coins >= config.cost && !state.unlockedSkins.includes(id)) {
      set({
        coins: state.coins - config.cost,
        unlockedSkins: [...state.unlockedSkins, id],
        selectedSkin: id,
      });
      return true;
    }
    return false;
  },

  // Pets
  selectPet: (id) => {
    if (!id || get().unlockedPets.includes(id)) {
      set({ selectedPet: id });
      return true;
    }
    return false;
  },

  unlockPet: (id) => {
    const state = get();
    const config = PETS_CONFIG[id];
    if (!config) return false;
    if (state.coins >= config.cost && !state.unlockedPets.includes(id)) {
      set({
        coins: state.coins - config.cost,
        unlockedPets: [...state.unlockedPets, id],
        selectedPet: id,
      });
      return true;
    }
    return false;
  },

  // Match Rewards
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
