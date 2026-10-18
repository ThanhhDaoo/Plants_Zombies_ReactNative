// Inventory, Armory & Progression System for PvZ Survival
import { WEAPONS } from './pubgWeapons.js';

const STORAGE_KEY = 'pvz_survival_save_v1';



// Default player progression state
const DEFAULT_DATA = {
  coins: 450,          // Starting bonus coins for fun
  brains: 5,           // Starting brains
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
    plasma_repeater: 1
  },
  stats: {
    maxHealthLevel: 1,   // Base: 100, +25 per lvl (max 5)
    armorLevel: 1,       // Base: 25, +20 per lvl (max 5)
    speedLevel: 1,       // Base: 4.6, +0.3 per lvl (max 5)
    magnetLevel: 1       // Base: 50px, +30px per lvl (max 5)
  },
  lastSpinTime: 0,
  gameMode: 'battle_royale', // 'battle_royale' | 'boss_raid'
};

class InventoryManager {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_DATA,
          ...parsed,
          weaponLevels: { ...DEFAULT_DATA.weaponLevels, ...(parsed.weaponLevels || {}) },
          stats: { ...DEFAULT_DATA.stats, ...(parsed.stats || {}) },
        };
      }
    } catch (e) {
      console.warn('Failed to load survival save data:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Failed to save survival data:', e);
    }
  }

  getCoins() {
    return this.data.coins;
  }

  getBrains() {
    return this.data.brains;
  }

  getGameMode() {
    return this.data.gameMode || 'battle_royale';
  }

  setGameMode(mode) {
    this.data.gameMode = mode;
    this.saveData();
  }

  addRewards(coins, brains, kills = 0, score = 0, isWin = false) {
    this.data.coins += Math.max(0, coins);
    this.data.brains += Math.max(0, brains);
    this.data.totalKills += Math.max(0, kills);
    if (score > this.data.highScore) {
      this.data.highScore = score;
    }
    if (isWin) {
      this.data.topRank++;
    }
    this.saveData();
  }

  isWeaponUnlocked(id) {
    return this.data.unlockedWeapons.includes(id);
  }

  getSelectedWeapon() {
    return this.data.selectedWeapon || 'pea_pistol';
  }

  setSelectedWeapon(id) {
    if (this.isWeaponUnlocked(id)) {
      this.data.selectedWeapon = id;
      this.saveData();
      return true;
    }
    return false;
  }

  getWeaponLevel(id) {
    return this.data.weaponLevels[id] || 1;
  }

  unlockWeapon(id, coinCost, brainCost = 0) {
    if (this.isWeaponUnlocked(id)) return false;
    if (this.data.coins >= coinCost && this.data.brains >= brainCost) {
      this.data.coins -= coinCost;
      this.data.brains -= brainCost;
      this.data.unlockedWeapons.push(id);
      this.data.weaponLevels[id] = 1;
      this.saveData();
      return true;
    }
    return false;
  }

  upgradeWeapon(id, coinCost) {
    const curLevel = this.getWeaponLevel(id);
    if (curLevel >= 5) return false;
    if (this.data.coins >= coinCost) {
      this.data.coins -= coinCost;
      this.data.weaponLevels[id] = curLevel + 1;
      this.saveData();
      return true;
    }
    return false;
  }

  getStatLevel(statKey) {
    return this.data.stats[statKey] || 1;
  }

  upgradeStat(statKey, coinCost) {
    const curLevel = this.getStatLevel(statKey);
    if (curLevel >= 5) return false;
    if (this.data.coins >= coinCost) {
      this.data.coins -= coinCost;
      this.data.stats[statKey] = curLevel + 1;
      this.saveData();
      return true;
    }
    return false;
  }

  // Calculate actual player stats with upgrades applied
  calculatePlayerStats() {
    const hpLvl = this.getStatLevel('maxHealthLevel');
    const armorLvl = this.getStatLevel('armorLevel');
    const speedLvl = this.getStatLevel('speedLevel');
    const magnetLvl = this.getStatLevel('magnetLevel');

    let baseHp = 100 + (hpLvl - 1) * 25;
    let baseArmor = 25 + (armorLvl - 1) * 20;
    let baseSpeed = 4.6 + (speedLvl - 1) * 0.35;
    let baseMagnet = 50 + (magnetLvl - 1) * 35;

    // Skin bonuses
    if (this.data.selectedSkin === 'ninja') baseSpeed *= 1.10;
    if (this.data.selectedSkin === 'cyberpunk') baseArmor += 25;

    // Pet bonuses
    if (this.data.selectedPet === 'mini_sunflower') baseMagnet = 240;

    return {
      maxHealth: baseHp,
      initialArmor: baseArmor,
      maxArmor: 100 + (armorLvl - 1) * 20,
      speed: baseSpeed,
      magnetRadius: baseMagnet
    };
  }

  // Calculate weapon stats with its upgrade level applied
  getEffectiveWeapon(weaponId) {
    const base = WEAPONS[weaponId] || WEAPONS.pea_pistol;
    const level = this.getWeaponLevel(weaponId);
    let multiplier = 1 + (level - 1) * 0.22; // +22% DMG per level

    // Cowboy skin bonus
    if (this.data.selectedSkin === 'cowboy' && weaponId === 'pea_pistol') {
      multiplier *= 1.20;
    }

    return {
      ...base,
      level,
      damage: Math.round(base.damage * multiplier),
      magazineSize: Math.round(base.magazineSize * (1 + (level - 1) * 0.15)),
      fireRate: Math.max(70, Math.round(base.fireRate * (1 - (level - 1) * 0.05)))
    };
  }



  // Lucky Wheel
  canFreeSpin() {
    const last = this.data.lastSpinTime || 0;
    return Date.now() - last >= 1000 * 3600 * 12; // 12h free
  }

  spinLuckyWheel() {
    const PRIZES = [
      { text: '100 Xu', type: 'coins', value: 100, emoji: '🪙', color: '#ffb300' },
      { text: '2 Não', type: 'brains', value: 2, emoji: '🧠', color: '#ec407a' },
      { text: '250 Xu', type: 'coins', value: 250, emoji: '🪙', color: '#ffa000' },
      { text: '50 Xu', type: 'coins', value: 50, emoji: '🪙', color: '#ffe082' },
      { text: '500 Xu VIP', type: 'coins', value: 500, emoji: '💰', color: '#ff6f00' },
      { text: '5 Não VIP', type: 'brains', value: 5, emoji: '🧠', color: '#ab47bc' },
      { text: '150 Xu', type: 'coins', value: 150, emoji: '🪙', color: '#ffca28' },
      { text: '3 Não', type: 'brains', value: 3, emoji: '🧠', color: '#f06292' },
    ];

    const randomIndex = Math.floor(Math.random() * PRIZES.length);
    const won = PRIZES[randomIndex];

    this.data.lastSpinTime = Date.now();
    if (won.type === 'coins') this.data.coins += won.value;
    if (won.type === 'brains') this.data.brains += won.value;
    this.saveData();

    return { prize: won, index: randomIndex };
  }
}

export const inventory = new InventoryManager();
