import { GRID_CONFIG, getCellCenter } from '../config/grid';
import { PLANTS_CONFIG } from '../config/plants.config';
import { ZOMBIES_CONFIG } from '../config/zombies.config';
import { GAME_SETTINGS } from '../config/game.config';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { SoundService } from '../../services/audio/SoundService';

export class GameWorld {
  constructor() {
    this.plants = [];
    this.zombies = [];
    this.projectiles = [];
    this.suns = [];
    this.lawnMowers = [];

    this.lastNaturalSunTime = 0;
    this.lastWaveTime = 0;
    this.currentWave = 1;
    this.isInitialized = false;
  }

  init() {
    this.plants = [];
    this.zombies = [];
    this.projectiles = [];
    this.suns = [];
    this.lawnMowers = [];
    this.currentWave = 1;
    this.lastNaturalSunTime = Date.now();
    this.lastWaveTime = Date.now();

    for (let r = 0; r < GRID_CONFIG.ROWS; r++) {
      this.lawnMowers.push({
        id: `mower-${r}`,
        row: r,
        x: 10,
        y: r * GRID_CONFIG.CELL_HEIGHT + 25,
        active: false,
        used: false,
        speed: 350,
      });
    }

    this.isInitialized = true;
  }

  update(dt, now) {
    if (!this.isInitialized) return;
    const store = useGameStore.getState();
    if (store.gameStatus !== 'playing') return;

    // 1. Natural Sun Dropping from Sky
    if (now - this.lastNaturalSunTime >= GAME_SETTINGS.NATURAL_SUN_INTERVAL_MS) {
      this.lastNaturalSunTime = now;
      this.spawnNaturalSun();
    }

    // 2. Wave Spawner
    const delay = this.currentWave === 1 ? GAME_SETTINGS.FIRST_ZOMBIE_DELAY_MS : GAME_SETTINGS.WAVE_INTERVAL_MS;
    if (now - this.lastWaveTime >= delay) {
      this.lastWaveTime = now;
      this.spawnWave(this.currentWave);
      if (this.currentWave < GAME_SETTINGS.TOTAL_WAVES) {
        this.currentWave++;
        store.setWave(this.currentWave);
      }
    }

    // 3. Update Suns
    for (const sun of this.suns) {
      if (!sun.collected && sun.y < sun.targetY) {
        sun.y += sun.vy * dt;
        if (sun.y > sun.targetY) sun.y = sun.targetY;
      }
    }

    // 4. Update Plants
    for (let i = this.plants.length - 1; i >= 0; i--) {
      const plant = this.plants[i];
      const cfg = PLANTS_CONFIG[plant.type];
      if (!cfg) continue;

      // Instant explode (CherryBomb)
      if (cfg.instantExplode) {
        if (now - plant.plantedAt >= 1200) {
          SoundService.playExplosion();
          for (const z of this.zombies) {
            const dr = Math.abs(z.row - plant.row);
            const dx = Math.abs(z.x - plant.x);
            if (dr <= 1 && dx <= (cfg.explodeRadius || 150)) {
              z.health -= cfg.damage || 1800;
            }
          }
          this.plants.splice(i, 1);
          continue;
        }
      }

      // Produce Sun (Sunflower)
      if (cfg.producesSun && cfg.sunIntervalMs) {
        if (now - plant.lastProductionTime >= cfg.sunIntervalMs) {
          plant.lastProductionTime = now;
          this.suns.push({
            id: `sun-${Math.random()}`,
            x: plant.x + (Math.random() * 20 - 10),
            y: plant.y - 10,
            targetY: plant.y + 20,
            value: cfg.sunAmount || 25,
            vy: 40,
            collected: false,
            createdAt: now,
          });
        }
      }

      // Shoot Projectiles
      if (cfg.shoots && cfg.shootIntervalMs) {
        const hasZombieInRow = this.zombies.some((z) => z.row === plant.row && z.x > plant.x && z.health > 0);
        if (hasZombieInRow && now - plant.lastShotTime >= cfg.shootIntervalMs) {
          plant.lastShotTime = now;
          SoundService.playShoot();

          this.projectiles.push({
            id: `proj-${Math.random()}`,
            row: plant.row,
            x: plant.x + 35,
            y: plant.y,
            speed: cfg.bulletSpeed || 320,
            damage: cfg.damage || 20,
            slow: !!cfg.slow,
            active: true,
          });

          if (cfg.double) {
            setTimeout(() => {
              this.projectiles.push({
                id: `proj-${Math.random()}`,
                row: plant.row,
                x: plant.x + 35,
                y: plant.y,
                speed: cfg.bulletSpeed || 320,
                damage: cfg.damage || 20,
                slow: !!cfg.slow,
                active: true,
              });
            }, 150);
          }
        }
      }
    }

    // 5. Update Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += p.speed * dt;

      let collided = false;
      for (const z of this.zombies) {
        if (z.row === p.row && z.health > 0 && Math.abs(z.x - p.x) < 25) {
          collided = true;
          z.health -= p.damage;
          SoundService.playSplat();

          if (p.slow) {
            z.isSlowed = true;
            z.slowTimer = now + 4000;
          }
          break;
        }
      }

      if (collided || p.x > GRID_CONFIG.BOARD_WIDTH + 50) {
        this.projectiles.splice(i, 1);
      }
    }

    // 6. Update Zombies
    for (let i = this.zombies.length - 1; i >= 0; i--) {
      const z = this.zombies[i];

      if (z.isSlowed && now > z.slowTimer) {
        z.isSlowed = false;
      }

      if (z.health <= 0) {
        const zCfg = ZOMBIES_CONFIG[z.type] || ZOMBIES_CONFIG.normal;
        store.addScore(zCfg.points);
        usePlayerStore.getState().addCoins(Math.floor(zCfg.points / 10));
        this.zombies.splice(i, 1);
        continue;
      }

      const eatingPlant = this.plants.find(
        (p) => p.row === z.row && Math.abs(p.x - z.x) < 30
      );

      if (eatingPlant) {
        z.eatingPlantId = eatingPlant.id;
        eatingPlant.health -= z.damage * dt;
        if (eatingPlant.health <= 0) {
          this.plants = this.plants.filter((p) => p.id !== eatingPlant.id);
          z.eatingPlantId = null;
        }
      } else {
        z.eatingPlantId = null;
        const currentSpeed = z.isSlowed ? z.speed * 0.5 : z.speed;
        z.x -= currentSpeed * dt;
      }

      if (z.x < 50) {
        const mower = this.lawnMowers.find((m) => m.row === z.row && !m.used);
        if (mower) {
          mower.active = true;
          SoundService.playLawnMower();
        } else if (z.x < 0) {
          store.setGameStatus('gameover');
          return;
        }
      }
    }

    // 7. Update LawnMowers
    for (const mower of this.lawnMowers) {
      if (mower.active && !mower.used) {
        mower.x += mower.speed * dt;
        for (const z of this.zombies) {
          if (z.row === mower.row && Math.abs(z.x - mower.x) < 40) {
            z.health = 0;
          }
        }
        if (mower.x > GRID_CONFIG.BOARD_WIDTH + 100) {
          mower.active = false;
          mower.used = true;
        }
      }
    }

    // 8. Victory Check
    if (this.currentWave >= GAME_SETTINGS.TOTAL_WAVES && this.zombies.length === 0) {
      store.setGameStatus('victory');
      usePlayerStore.getState().addCoins(GAME_SETTINGS.VICTORY_BONUS_COINS);
    }
  }

  spawnNaturalSun() {
    const rx = 100 + Math.random() * (GRID_CONFIG.BOARD_WIDTH - 250);
    const targetY = 80 + Math.random() * (GRID_CONFIG.BOARD_HEIGHT - 120);
    this.suns.push({
      id: `sun-${Math.random()}`,
      x: rx,
      y: -20,
      targetY,
      value: GAME_SETTINGS.NATURAL_SUN_AMOUNT,
      vy: 60,
      collected: false,
      createdAt: Date.now(),
    });
  }

  spawnWave(waveIndex) {
    const count = 1 + Math.floor(waveIndex * 1.5);
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const row = Math.floor(Math.random() * GRID_CONFIG.ROWS);
        let type = 'normal';
        if (waveIndex >= 2 && Math.random() < 0.4) type = 'cone';
        if (waveIndex >= 4 && Math.random() < 0.3) type = 'bucket';
        if (waveIndex >= 5 && Math.random() < 0.25) type = 'fast';
        if (waveIndex >= 7 && Math.random() < 0.2) type = 'strong';

        this.spawnZombie(type, row, GRID_CONFIG.BOARD_WIDTH + 20 + i * 40);
      }, i * 1200);
    }
  }

  spawnZombie(type, row, startX) {
    const cfg = ZOMBIES_CONFIG[type] || ZOMBIES_CONFIG.normal;
    const center = getCellCenter(row, 0);
    this.zombies.push({
      id: `zombie-${Math.random()}`,
      type,
      row,
      x: startX || GRID_CONFIG.BOARD_WIDTH + 30,
      y: center.y,
      health: cfg.health,
      maxHealth: cfg.maxHealth,
      speed: cfg.speed,
      damage: cfg.damage,
      eatingPlantId: null,
      isSlowed: false,
      slowTimer: 0,
      active: true,
    });
  }

  plantAt(row, col, type) {
    const store = useGameStore.getState();
    const cfg = PLANTS_CONFIG[type];
    if (!cfg) return false;

    const occupied = this.plants.some((p) => p.row === row && p.col === col);
    if (occupied) return false;

    if (!store.spendSun(cfg.cost)) return false;

    store.triggerSeedCooldown(type);
    SoundService.playPlant();

    const center = getCellCenter(row, col);
    this.plants.push({
      id: `plant-${Math.random()}`,
      type,
      row,
      col,
      x: center.x,
      y: center.y,
      health: cfg.health,
      maxHealth: cfg.maxHealth,
      lastShotTime: 0,
      lastProductionTime: Date.now(),
      plantedAt: Date.now(),
    });
    return true;
  }

  removePlantAt(row, col) {
    this.plants = this.plants.filter((p) => !(p.row === row && p.col === col));
  }

  collectSun(sunId) {
    const sunIndex = this.suns.findIndex((s) => s.id === sunId && !s.collected);
    if (sunIndex !== -1) {
      const sun = this.suns[sunIndex];
      sun.collected = true;
      SoundService.playSunCollect();
      useGameStore.getState().addSun(sun.value);
      this.suns.splice(sunIndex, 1);
    }
  }
}

export const gameWorld = new GameWorld();
