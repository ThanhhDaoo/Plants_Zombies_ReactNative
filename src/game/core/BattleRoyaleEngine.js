import { WEAPONS } from '../config/pubgWeapons';
import { PUBG_ZOMBIES } from '../config/pubgZombies';
import { SoundService } from '../../services/audio/SoundService';

export const MAP_CONFIG = {
  WIDTH: 2400,
  HEIGHT: 2400,
  TOTAL_ZOMBIES: 32,
};

class BattleRoyaleEngine {
  constructor() {
    this.active = false;
    this.isPaused = false;
    this.isGameOver = false;
    this.isVictory = false;

    this.player = {
      x: 1200,
      y: 1200,
      radius: 25,
      angle: 0,
      health: 100,
      maxHealth: 100,
      armor: 25,
      maxArmor: 100,
      speed: 4.6,
      speedBoostTimer: 0,
      magnetRadius: 75,
      isDashing: false,
      dashTimer: 0,
      dashCooldown: 0,
      currentWeapon: 'pea_pistol',
      ammo: 24,
      isReloading: false,
      reloadTimer: 0,
      lastShotTime: 0,
      kills: 0,
      score: 0,
      skills: {
        stormCd: 0,
        stormMaxCd: 7000,
        bombCd: 0,
        bombMaxCd: 10000,
      },
      isCharging: false,
      chargeTimer: 0,
      maxChargeTime: 450,
    };

    this.camera = {
      x: 1200,
      y: 1200,
    };

    this.zone = {
      centerX: 1200,
      centerY: 1200,
      radius: 1450,
      targetCenterX: 1200,
      targetCenterY: 1200,
      targetRadius: 900,
      shrinkSpeed: 0.35,
      phase: 1,
      maxPhases: 4,
      countdown: 40,
      isShrinking: false,
      damagePerSec: 4,
    };

    this.zombies = [];
    this.bullets = [];
    this.bombs = [];
    this.enemyProjectiles = [];
    this.shockwaves = [];
    this.crates = [];
    this.groundItems = [];
    this.particles = [];
    this.floatingTexts = [];
    this.matchRewards = { coins: 0, brains: 0, kills: 0 };
    this.joystick = { vx: 0, vy: 0 };
    this.aliveCount = 33;
  }

  init(savedData = {}) {
    this.active = true;
    this.isPaused = false;
    this.isGameOver = false;
    this.isVictory = false;

    const p = this.player;
    p.x = 1200;
    p.y = 1950;
    this.camera.x = 1200;
    this.camera.y = 1950;

    const maxHp = 100 + (savedData.hpLevel ? (savedData.hpLevel - 1) * 25 : 0);
    p.health = maxHp;
    p.maxHealth = maxHp;
    p.armor = 25 + (savedData.armorLevel ? (savedData.armorLevel - 1) * 20 : 0);
    p.maxArmor = 100;
    p.speed = 4.6 + (savedData.speedLevel ? (savedData.speedLevel - 1) * 0.3 : 0);
    p.magnetRadius = 75;

    const weaponId = savedData.selectedWeapon || 'pea_pistol';
    p.currentWeapon = weaponId;
    const wConfig = WEAPONS[weaponId] || WEAPONS.pea_pistol;
    p.ammo = wConfig.magazineSize;
    p.isReloading = false;
    p.kills = 0;
    p.score = 0;
    p.skills = { stormCd: 0, stormMaxCd: 7000, bombCd: 0, bombMaxCd: 10000 };
    p.isDashing = false;
    p.dashCooldown = 0;
    p.isCharging = false;
    p.chargeTimer = 0;

    this.matchRewards = { coins: 0, brains: 0, kills: 0 };
    this.bullets = [];
    this.bombs = [];
    this.enemyProjectiles = [];
    this.shockwaves = [];
    this.particles = [];
    this.floatingTexts = [];
    this.groundItems = [];

    // Reset poison zone
    this.zone.centerX = 1200;
    this.zone.centerY = 1200;
    this.zone.radius = 1450;
    this.zone.targetRadius = 900;
    this.zone.phase = 1;
    this.zone.countdown = 40;
    this.zone.isShrinking = false;

    // Spawn crates & initial zombies
    this.spawnCrates(28);
    this.spawnInitialZombies(32);
    this.aliveCount = 33;
  }

  setJoystick(vx, vy) {
    this.joystick.vx = vx;
    this.joystick.vy = vy;
    if (Math.hypot(vx, vy) > 0.1) {
      this.player.angle = Math.atan2(vy, vx);
    }
  }

  setAimAngle(angle) {
    this.player.angle = angle;
  }

  triggerFire() {
    const p = this.player;
    if (p.isReloading || p.health <= 0) return;

    if (p.ammo <= 0) {
      this.triggerReload();
      return;
    }

    const w = WEAPONS[p.currentWeapon] || WEAPONS.pea_pistol;
    const now = Date.now();
    if (now - p.lastShotTime < w.fireRate) return;
    p.lastShotTime = now;
    p.ammo--;

    SoundService.playShoot();

    // Spawn pellets
    for (let i = 0; i < w.pellets; i++) {
      const spreadAngle = (Math.random() - 0.5) * w.spread;
      const finalAngle = p.angle + spreadAngle;

      this.bullets.push({
        id: `bullet-${Math.random()}`,
        x: p.x + Math.cos(p.angle) * 28,
        y: p.y + Math.sin(p.angle) * 28,
        vx: Math.cos(finalAngle) * w.bulletSpeed,
        vy: Math.sin(finalAngle) * w.bulletSpeed,
        radius: w.bulletRadius,
        color: w.bulletColor,
        damage: w.damage,
        isFire: w.isFire,
        slowEffect: w.slowEffect,
        slowDuration: w.slowDuration,
        isExplosive: w.isExplosive,
        blastRadius: w.blastRadius,
        isPlasma: w.isPlasma,
        pierceRemaining: w.pierceCount || 1,
        life: 50,
      });
    }

    if (p.ammo <= 0) {
      this.triggerReload();
    }
  }

  triggerDash() {
    const p = this.player;
    if (p.dashCooldown > 0 || p.isDashing || p.health <= 0) return;

    p.isDashing = true;
    p.dashTimer = 180; // 180ms dash
    p.dashCooldown = 2500; // 2.5s cooldown
    SoundService.playPlant();
  }

  triggerReload() {
    const p = this.player;
    if (p.isReloading || p.health <= 0) return;

    const w = WEAPONS[p.currentWeapon] || WEAPONS.pea_pistol;
    if (p.ammo === w.magazineSize) return;

    p.isReloading = true;
    p.reloadTimer = w.reloadTime;
  }

  triggerPeaStorm() {
    const p = this.player;
    if (p.skills.stormCd > 0 || p.health <= 0) return;

    p.skills.stormCd = p.skills.stormMaxCd;
    SoundService.playExplosion();

    // 20 bullets in 360 circle
    const count = 20;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      this.bullets.push({
        id: `storm-${Math.random()}`,
        x: p.x,
        y: p.y,
        vx: Math.cos(angle) * 16,
        vy: Math.sin(angle) * 16,
        radius: 7,
        color: '#76ff03',
        damage: 45,
        pierceRemaining: 2,
        life: 45,
      });
    }
  }

  triggerCherryBomb() {
    const p = this.player;
    if (p.skills.bombCd > 0 || p.health <= 0) return;

    p.skills.bombCd = p.skills.bombMaxCd;
    SoundService.playPlant();

    // Throw bomb 120px ahead
    this.bombs.push({
      id: `bomb-${Math.random()}`,
      x: p.x + Math.cos(p.angle) * 130,
      y: p.y + Math.sin(p.angle) * 130,
      radius: 20,
      fuseTimer: 1200,
      blastRadius: 160,
      damage: 320,
    });
  }

  startCharging() {
    const p = this.player;
    if (p.health <= 0 || p.isReloading) return;
    p.isCharging = true;
    p.chargeTimer = 0;
  }

  releaseCharging() {
    const p = this.player;
    if (!p.isCharging) return;
    p.isCharging = false;

    if (p.chargeTimer >= p.maxChargeTime) {
      // Fire Mega Pea
      SoundService.playExplosion();
      this.bullets.push({
        id: `mega-${Math.random()}`,
        x: p.x + Math.cos(p.angle) * 32,
        y: p.y + Math.sin(p.angle) * 32,
        vx: Math.cos(p.angle) * 22,
        vy: Math.sin(p.angle) * 22,
        radius: 18,
        color: '#00e5ff',
        damage: 180,
        isExplosive: true,
        blastRadius: 110,
        pierceRemaining: 5,
        life: 60,
      });
    } else {
      this.triggerFire();
    }
    p.chargeTimer = 0;
  }

  spawnCrates(count) {
    this.crates = [];
    for (let i = 0; i < count; i++) {
      this.crates.push({
        id: `crate-${i}`,
        x: 200 + Math.random() * (MAP_CONFIG.WIDTH - 400),
        y: 200 + Math.random() * (MAP_CONFIG.HEIGHT - 400),
        radius: 24,
        health: 40,
        maxHealth: 40,
      });
    }
  }

  spawnInitialZombies(count) {
    this.zombies = [];
    const keys = Object.keys(PUBG_ZOMBIES);

    for (let i = 0; i < count; i++) {
      let typeKey = 'normal';
      const r = Math.random();
      if (r < 0.4) typeKey = 'normal';
      else if (r < 0.65) typeKey = 'conehead';
      else if (r < 0.8) typeKey = 'buckethead';
      else if (r < 0.9) typeKey = 'runner';
      else if (r < 0.97) typeKey = 'toxic';
      else typeKey = 'shield';

      // Titan boss at center
      if (i === count - 1) typeKey = 'boss';

      const config = PUBG_ZOMBIES[typeKey];
      // Random position around map away from player
      let zx = 1200;
      let zy = 1200;
      while (Math.hypot(zx - 1200, zy - 1950) < 450) {
        zx = 250 + Math.random() * (MAP_CONFIG.WIDTH - 500);
        zy = 250 + Math.random() * (MAP_CONFIG.HEIGHT - 500);
      }

      this.zombies.push({
        id: `zombie-${i}`,
        type: typeKey,
        x: zx,
        y: zy,
        radius: config.radius,
        health: config.health,
        maxHealth: config.health,
        speed: config.speed,
        damage: config.damage,
        color: config.color,
        isRanged: config.isRanged,
        hasShield: config.hasShield,
        isBoss: config.isBoss,
        shootTimer: 0,
        slamTimer: 0,
        isSlowed: false,
        slowTimer: 0,
      });
    }
  }

  update(dtMs) {
    if (!this.active || this.isPaused || this.isGameOver || this.isVictory) return;
    const dt = Math.min(dtMs / 1000, 0.05);

    const p = this.player;

    // 1. Skill & Dash cooldowns
    if (p.skills.stormCd > 0) p.skills.stormCd = Math.max(0, p.skills.stormCd - dtMs);
    if (p.skills.bombCd > 0) p.skills.bombCd = Math.max(0, p.skills.bombCd - dtMs);
    if (p.dashCooldown > 0) p.dashCooldown = Math.max(0, p.dashCooldown - dtMs);

    if (p.isDashing) {
      p.dashTimer -= dtMs;
      if (p.dashTimer <= 0) p.isDashing = false;
    }

    if (p.isCharging) {
      p.chargeTimer += dtMs;
    }

    if (p.isReloading) {
      p.reloadTimer -= dtMs;
      if (p.reloadTimer <= 0) {
        p.isReloading = false;
        const w = WEAPONS[p.currentWeapon] || WEAPONS.pea_pistol;
        p.ammo = w.magazineSize;
      }
    }

    // 2. Player Movement
    const currentSpeed = p.isDashing ? p.speed * 3.2 : p.speed;
    p.x += this.joystick.vx * currentSpeed;
    p.y += this.joystick.vy * currentSpeed;

    p.x = Math.max(50, Math.min(MAP_CONFIG.WIDTH - 50, p.x));
    p.y = Math.max(50, Math.min(MAP_CONFIG.HEIGHT - 50, p.y));

    // Camera follow
    this.camera.x += (p.x - this.camera.x) * 0.12;
    this.camera.y += (p.y - this.camera.y) * 0.12;

    // 3. Zone / Vòng Bo
    const z = this.zone;
    if (!z.isShrinking) {
      z.countdown -= dt;
      if (z.countdown <= 0) {
        z.isShrinking = true;
      }
    } else {
      z.radius -= z.shrinkSpeed * dt * 50;
      if (z.radius <= z.targetRadius) {
        z.radius = z.targetRadius;
        z.isShrinking = false;
        if (z.phase < z.maxPhases) {
          z.phase++;
          z.countdown = 35;
          z.targetRadius = Math.max(250, z.radius - 350);
          z.damagePerSec += 3;
        }
      }
    }

    // Outside zone damage
    const distToZone = Math.hypot(p.x - z.centerX, p.y - z.centerY);
    if (distToZone > z.radius) {
      p.health -= z.damagePerSec * dt;
      if (p.health <= 0) {
        this.isGameOver = true;
      }
    }

    // 4. Update Bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx;
      b.y += b.vy;
      b.life--;

      let hit = false;

      // Hit Crates
      for (const crate of this.crates) {
        if (Math.hypot(crate.x - b.x, crate.y - b.y) < crate.radius + b.radius) {
          crate.health -= b.damage;
          hit = true;
          if (crate.health <= 0) {
            this.breakCrate(crate);
          }
          break;
        }
      }

      // Hit Zombies
      for (const zombie of this.zombies) {
        if (Math.hypot(zombie.x - b.x, zombie.y - b.y) < zombie.radius + b.radius) {
          let dmg = b.damage;
          if (zombie.hasShield) dmg *= 0.2;
          if (zombie.damageReduction) dmg *= (1 - zombie.damageReduction);

          zombie.health -= dmg;
          hit = true;
          SoundService.playSplat();

          if (b.slowEffect) {
            zombie.isSlowed = true;
            zombie.slowTimer = Date.now() + (b.slowDuration || 2500);
          }

          if (b.isExplosive) {
            // AOE damage
            for (const other of this.zombies) {
              if (Math.hypot(other.x - b.x, other.y - b.y) < (b.blastRadius || 90)) {
                other.health -= dmg * 0.7;
              }
            }
          }

          b.pierceRemaining = (b.pierceRemaining || 1) - 1;
          if (b.pierceRemaining <= 0) {
            break;
          }
        }
      }

      if (b.life <= 0 || (hit && (!b.pierceRemaining || b.pierceRemaining <= 0))) {
        this.bullets.splice(i, 1);
      }
    }

    // Remove broken crates
    this.crates = this.crates.filter((c) => c.health > 0);

    // 5. Update Bombs
    for (let i = this.bombs.length - 1; i >= 0; i--) {
      const bomb = this.bombs[i];
      bomb.fuseTimer -= dtMs;
      if (bomb.fuseTimer <= 0) {
        SoundService.playExplosion();
        for (const zombie of this.zombies) {
          if (Math.hypot(zombie.x - bomb.x, zombie.y - bomb.y) < bomb.blastRadius) {
            zombie.health -= bomb.damage;
          }
        }
        for (const crate of this.crates) {
          if (Math.hypot(crate.x - bomb.x, crate.y - bomb.y) < bomb.blastRadius) {
            crate.health = 0;
            this.breakCrate(crate);
          }
        }
        this.bombs.splice(i, 1);
      }
    }

    // 6. Update Zombies
    for (let i = this.zombies.length - 1; i >= 0; i--) {
      const z = this.zombies[i];

      // Slow check
      if (z.isSlowed && Date.now() > z.slowTimer) {
        z.isSlowed = false;
      }

      // Death check
      if (z.health <= 0) {
        p.kills++;
        p.score += z.points || 100;
        this.spawnZombieLoot(z);
        this.zombies.splice(i, 1);
        this.aliveCount = this.zombies.length + 1;
        continue;
      }

      // Chase player
      const angleToPlayer = Math.atan2(p.y - z.y, p.x - z.x);
      const spd = z.isSlowed ? z.speed * 0.5 : z.speed;
      z.x += Math.cos(angleToPlayer) * spd;
      z.y += Math.sin(angleToPlayer) * spd;

      // Melee attack
      const dist = Math.hypot(p.x - z.x, p.y - z.y);
      if (dist < p.radius + z.radius) {
        // Attack player
        if (p.armor > 0) {
          p.armor -= z.damage * dt;
          if (p.armor < 0) {
            p.health += p.armor;
            p.armor = 0;
          }
        } else {
          p.health -= z.damage * dt;
        }

        if (p.health <= 0) {
          this.isGameOver = true;
        }
      }
    }

    // 7. Update Ground Items & Magnet
    for (let i = this.groundItems.length - 1; i >= 0; i--) {
      const item = this.groundItems[i];
      const dist = Math.hypot(p.x - item.x, p.y - item.y);

      // Magnet pull
      if (dist < p.magnetRadius) {
        const angle = Math.atan2(p.y - item.y, p.x - item.x);
        item.x += Math.cos(angle) * 7;
        item.y += Math.sin(angle) * 7;
      }

      // Collect
      if (dist < p.radius + 15) {
        SoundService.playSunCollect();
        if (item.type === 'coin') {
          this.matchRewards.coins += item.value;
        } else if (item.type === 'brain') {
          this.matchRewards.brains += item.value;
        } else if (item.type === 'heal') {
          p.health = Math.min(p.maxHealth, p.health + 40);
        } else if (item.type === 'armor') {
          p.armor = Math.min(p.maxArmor, p.armor + 40);
        }
        this.groundItems.splice(i, 1);
      }
    }

    // 8. Victory Check
    if (this.zombies.length === 0 && p.health > 0) {
      this.isVictory = true;
    }
  }

  breakCrate(crate) {
    // Drop coin or heal
    this.groundItems.push({
      id: `item-${Math.random()}`,
      x: crate.x + (Math.random() - 0.5) * 20,
      y: crate.y + (Math.random() - 0.5) * 20,
      type: Math.random() < 0.6 ? 'coin' : 'heal',
      value: 15,
      emoji: Math.random() < 0.6 ? '🪙' : '💚',
    });
  }

  spawnZombieLoot(zombie) {
    // Coins
    this.groundItems.push({
      id: `loot-coin-${Math.random()}`,
      x: zombie.x,
      y: zombie.y,
      type: 'coin',
      value: 20,
      emoji: '🪙',
    });

    // Brain drop for elite/boss
    if (zombie.type === 'toxic' || zombie.type === 'shield' || zombie.type === 'boss') {
      this.groundItems.push({
        id: `loot-brain-${Math.random()}`,
        x: zombie.x + 15,
        y: zombie.y,
        type: 'brain',
        value: 1,
        emoji: '🧠',
      });
    }
  }
}

export const battleRoyaleEngine = new BattleRoyaleEngine();
