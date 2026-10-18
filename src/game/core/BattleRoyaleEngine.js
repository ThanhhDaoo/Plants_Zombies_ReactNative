import { WEAPONS } from '../config/pubgWeapons';
import { PUBG_ZOMBIES } from '../config/pubgZombies';
import { SoundService } from '../../services/audio/SoundService';
import { getRandomPerks } from '../config/perks.config';

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
    this.isSelectingPerk = false;
    this.pendingPerks = [];

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
      magnetRadius: 85,
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
      exp: 0,
      level: 1,
      expToNextLevel: 50,
      perks: {},
      vampireKillCounter: 0,
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
      trauma: 0,
      shakeX: 0,
      shakeY: 0,
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
    this.acidPatches = [];
    this.matchRewards = { coins: 0, brains: 0, kills: 0 };
    this.joystick = { vx: 0, vy: 0 };
    this.aliveCount = 33;
  }

  init(savedData = {}) {
    this.active = true;
    this.isPaused = false;
    this.isGameOver = false;
    this.isVictory = false;
    this.isSelectingPerk = false;
    this.pendingPerks = [];

    const p = this.player;
    p.x = 1200;
    p.y = 1950;
    this.camera.x = 1200;
    this.camera.y = 1950;
    this.camera.trauma = 0;
    this.camera.shakeX = 0;
    this.camera.shakeY = 0;

    const maxHp = 100 + (savedData.hpLevel ? (savedData.hpLevel - 1) * 25 : 0);
    p.health = maxHp;
    p.maxHealth = maxHp;
    p.armor = 25 + (savedData.armorLevel ? (savedData.armorLevel - 1) * 20 : 0);
    p.maxArmor = 100;
    p.speed = 4.6 + (savedData.speedLevel ? (savedData.speedLevel - 1) * 0.3 : 0);
    p.magnetRadius = 85;

    const weaponId = savedData.selectedWeapon || 'pea_pistol';
    p.currentWeapon = weaponId;
    const wConfig = WEAPONS[weaponId] || WEAPONS.pea_pistol;
    p.ammo = wConfig.magazineSize;
    p.isReloading = false;
    p.kills = 0;
    p.score = 0;
    p.exp = 0;
    p.level = 1;
    p.expToNextLevel = 50;
    p.perks = {};
    p.vampireKillCounter = 0;
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
    this.floatingTexts = [];
    this.acidPatches = [];

    // Safe Zone setup
    this.zone.centerX = 1200;
    this.zone.centerY = 1200;
    this.zone.radius = 1500;
    this.zone.targetRadius = 1000;
    this.zone.phase = 1;
    this.zone.countdown = 40;
    this.zone.isShrinking = false;
    this.zone.damagePerSec = 4;

    this.spawnCrates(28);
    this.spawnInitialZombies(MAP_CONFIG.TOTAL_ZOMBIES);
    this.aliveCount = this.zombies.length + 1;
  }

  addTrauma(amount) {
    this.camera.trauma = Math.min(1.0, this.camera.trauma + amount);
  }

  applyPerk(perk) {
    if (!perk) return;
    const p = this.player;
    p.perks[perk.id] = (p.perks[perk.id] || 0) + 1;

    if (perk.id === 'hyperMagnet') {
      p.magnetRadius *= 2;
    }
    if (perk.id === 'swiftWings') {
      p.speed *= 1.25;
    }
    if (perk.id === 'stormMaster') {
      p.skills.stormMaxCd *= 0.55;
    }

    this.floatingTexts.push({
      id: `perk-${Math.random()}`,
      x: p.x,
      y: p.y - 45,
      text: `✨ ${perk.name}!`,
      color: perk.color || '#00e5ff',
      isCrit: true,
      life: 40,
      vy: -1.2,
    });

    this.isSelectingPerk = false;
    this.pendingPerks = [];
  }

  addExp(amount) {
    const p = this.player;
    p.exp += amount;

    if (p.exp >= p.expToNextLevel) {
      p.exp -= p.expToNextLevel;
      p.level++;
      p.expToNextLevel = Math.round(p.expToNextLevel * 1.45);
      this.pendingPerks = getRandomPerks(3, p.perks);
      this.isSelectingPerk = true;
      this.addTrauma(0.35);
      SoundService.playSunCollect();
    }
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
    if (p.isReloading || p.health <= 0 || this.isSelectingPerk) return;

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
    this.addTrauma(w.isExplosive ? 0.15 : 0.05);

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

      // Double barrel perk: fire extra parallel shot
      if (p.perks.doubleBarrel) {
        const perpAngle = p.angle + Math.PI / 2;
        this.bullets.push({
          id: `bullet-extra-${Math.random()}`,
          x: p.x + Math.cos(p.angle) * 28 + Math.cos(perpAngle) * 12,
          y: p.y + Math.sin(p.angle) * 28 + Math.sin(perpAngle) * 12,
          vx: Math.cos(finalAngle) * w.bulletSpeed,
          vy: Math.sin(finalAngle) * w.bulletSpeed,
          radius: w.bulletRadius * 0.9,
          color: '#ffd600',
          damage: w.damage * 0.75,
          isFire: w.isFire,
          slowEffect: w.slowEffect,
          pierceRemaining: 1,
          life: 45,
        });
      }
    }

    if (p.ammo <= 0) {
      this.triggerReload();
    }
  }

  triggerDash() {
    const p = this.player;
    if (p.dashCooldown > 0 || p.isDashing || p.health <= 0) return;

    p.isDashing = true;
    p.dashTimer = 180;
    p.dashCooldown = 2500;
    SoundService.playPlant();
    this.addTrauma(0.12);

    // Acid trail perk
    if (p.perks.acidTrail) {
      this.acidPatches.push({
        id: `acid-${Math.random()}`,
        x: p.x,
        y: p.y,
        radius: 36,
        damage: 35,
        duration: 3500,
      });
    }
  }

  triggerReload() {
    const p = this.player;
    if (p.isReloading || p.health <= 0) return;

    const w = WEAPONS[p.currentWeapon] || WEAPONS.pea_pistol;
    if (p.ammo === w.magazineSize) return;

    p.isReloading = true;
    const reloadTime = p.perks.swiftWings ? w.reloadTime * 0.65 : w.reloadTime;
    p.reloadTimer = reloadTime;
  }

  triggerPeaStorm() {
    const p = this.player;
    if (p.skills.stormCd > 0 || p.health <= 0) return;

    p.skills.stormCd = p.skills.stormMaxCd;
    SoundService.playExplosion();
    this.addTrauma(0.35);

    // 20 bullets in 360 circle
    const count = 22;
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
        damage: 50,
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

    const targetX = p.x + Math.cos(p.angle) * 90;
    const targetY = p.y + Math.sin(p.angle) * 90;

    this.bombs.push({
      id: `bomb-${Math.random()}`,
      x: targetX,
      y: targetY,
      blastRadius: 170,
      damage: 180,
      fuseTimer: 900,
    });
  }

  startCharging() {
    const p = this.player;
    if (p.isReloading || p.health <= 0 || p.ammo <= 0) return;
    p.isCharging = true;
    p.chargeTimer = 0;
  }

  releaseCharging() {
    const p = this.player;
    if (!p.isCharging) return;
    p.isCharging = false;

    if (p.chargeTimer >= p.maxChargeTime && p.ammo >= 2) {
      p.ammo -= 2;
      SoundService.playExplosion();
      this.addTrauma(0.4);

      // Mega Pea!
      this.bullets.push({
        id: `mega-pea-${Math.random()}`,
        x: p.x + Math.cos(p.angle) * 32,
        y: p.y + Math.sin(p.angle) * 32,
        vx: Math.cos(p.angle) * 18,
        vy: Math.sin(p.angle) * 18,
        radius: 18,
        color: '#00e5ff',
        damage: 140,
        isExplosive: true,
        blastRadius: 120,
        pierceRemaining: 4,
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
    for (let i = 0; i < count; i++) {
      let typeKey = 'normal';
      const r = Math.random();
      if (r < 0.35) typeKey = 'normal';
      else if (r < 0.6) typeKey = 'conehead';
      else if (r < 0.75) typeKey = 'buckethead';
      else if (r < 0.88) typeKey = 'runner';
      else if (r < 0.96) typeKey = 'toxic';
      else typeKey = 'shield';

      if (i === count - 1) typeKey = 'boss';

      const config = PUBG_ZOMBIES[typeKey];
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
        isSlowed: false,
        slowTimer: 0,
        isFrozen: false,
        freezeTimer: 0,
      });
    }
  }

  update(dtMs) {
    if (!this.active || this.isPaused || this.isGameOver || this.isVictory || this.isSelectingPerk) return;
    const dt = Math.min(dtMs / 1000, 0.05);

    const p = this.player;

    // 0. Update Screen Shake Trauma
    if (this.camera.trauma > 0) {
      this.camera.trauma = Math.max(0, this.camera.trauma - dt * 1.4);
      const shakeMag = this.camera.trauma * this.camera.trauma * 22;
      this.camera.shakeX = (Math.random() - 0.5) * shakeMag;
      this.camera.shakeY = (Math.random() - 0.5) * shakeMag;
    } else {
      this.camera.shakeX = 0;
      this.camera.shakeY = 0;
    }

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
        z.phase++;
        if (z.phase <= z.maxPhases) {
          z.countdown = 35;
          z.targetRadius = Math.max(350, z.radius * 0.6);
        }
      }
    }

    // Outside zone damage
    const distToZone = Math.hypot(p.x - z.centerX, p.y - z.centerY);
    if (distToZone > z.radius) {
      p.health -= z.damagePerSec * dt * z.phase;
      this.addTrauma(0.04);
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

          // Giant Slayer perk
          if (p.perks.giantSlayer && (zombie.type === 'buckethead' || zombie.type === 'runner' || zombie.isBoss)) {
            dmg *= 1.4;
          }

          // Critical Hit (15% chance)
          const isCrit = Math.random() < 0.15;
          if (isCrit) dmg *= 2.0;

          zombie.health -= dmg;
          hit = true;
          SoundService.playSplat();
          this.addTrauma(isCrit ? 0.2 : 0.06);

          // Damage Popup
          this.floatingTexts.push({
            id: `dmg-${Math.random()}`,
            x: zombie.x + (Math.random() - 0.5) * 16,
            y: zombie.y - zombie.radius - 8,
            text: isCrit ? `💥 CRIT! -${Math.round(dmg)}` : `-${Math.round(dmg)}`,
            color: isCrit ? '#ffd600' : (b.isFire ? '#ff7043' : (b.slowEffect ? '#40c4ff' : '#ffffff')),
            isCrit,
            life: 28,
            vy: -1.6,
          });

          // Frostbite perk
          if (p.perks.frostbite && Math.random() < 0.3) {
            zombie.isFrozen = true;
            zombie.freezeTimer = Date.now() + 1500;
          } else if (b.slowEffect) {
            zombie.isSlowed = true;
            zombie.slowTimer = Date.now() + (b.slowDuration || 2500);
          }

          // AOE Explosive
          if (b.isExplosive) {
            this.addTrauma(0.25);
            for (const other of this.zombies) {
              if (other !== zombie && Math.hypot(other.x - b.x, other.y - b.y) < (b.blastRadius || 90)) {
                other.health -= dmg * 0.7;
              }
            }
          }

          // Cluster Perk: fragment into 4 pellets
          if (p.perks.cluster && !b.isFragment) {
            for (let k = 0; k < 4; k++) {
              const fragAngle = (k / 4) * Math.PI * 2;
              this.bullets.push({
                id: `frag-${Math.random()}`,
                x: zombie.x,
                y: zombie.y,
                vx: Math.cos(fragAngle) * 9,
                vy: Math.sin(fragAngle) * 9,
                radius: 4,
                color: '#ff9800',
                damage: b.damage * 0.4,
                isFragment: true,
                life: 18,
                pierceRemaining: 1,
              });
            }
          }

          // Ricochet Perk: bounce to nearest zombie
          if (p.perks.ricochet && !b.hasRicocheted) {
            b.hasRicocheted = true;
            let nearest = null;
            let minD = 220;
            for (const other of this.zombies) {
              if (other !== zombie) {
                const d = Math.hypot(other.x - zombie.x, other.y - zombie.y);
                if (d < minD) {
                  minD = d;
                  nearest = other;
                }
              }
            }
            if (nearest) {
              const ang = Math.atan2(nearest.y - zombie.y, nearest.x - zombie.x);
              b.x = zombie.x;
              b.y = zombie.y;
              b.vx = Math.cos(ang) * 14;
              b.vy = Math.sin(ang) * 14;
              b.life = 25;
              b.damage *= 0.8;
              b.pierceRemaining = 1;
              continue;
            }
          }

          b.pierceRemaining = (b.pierceRemaining || 1) - 1;
          if (b.pierceRemaining <= 0) break;
        }
      }

      if (b.life <= 0 || (hit && (!b.pierceRemaining || b.pierceRemaining <= 0))) {
        this.bullets.splice(i, 1);
      }
    }

    this.crates = this.crates.filter((c) => c.health > 0);

    // 5. Update Bombs
    for (let i = this.bombs.length - 1; i >= 0; i--) {
      const bomb = this.bombs[i];
      bomb.fuseTimer -= dtMs;
      if (bomb.fuseTimer <= 0) {
        SoundService.playExplosion();
        this.addTrauma(0.6);

        // Mega Bomb perk: spawn 3 cluster mines
        if (p.perks.megaBomb && !bomb.isClusterChild) {
          for (let m = 0; m < 3; m++) {
            const mAngle = (m / 3) * Math.PI * 2;
            this.bombs.push({
              id: `cluster-bomb-${Math.random()}`,
              x: bomb.x + Math.cos(mAngle) * 75,
              y: bomb.y + Math.sin(mAngle) * 75,
              blastRadius: 110,
              damage: 100,
              fuseTimer: 450 + m * 200,
              isClusterChild: true,
            });
          }
        }

        for (const zombie of this.zombies) {
          if (Math.hypot(zombie.x - bomb.x, zombie.y - bomb.y) < bomb.blastRadius) {
            zombie.health -= bomb.damage;
            this.floatingTexts.push({
              id: `bomb-dmg-${Math.random()}`,
              x: zombie.x,
              y: zombie.y - zombie.radius - 10,
              text: `💥 -${bomb.damage}`,
              color: '#ff1744',
              isCrit: true,
              life: 30,
              vy: -2,
            });
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

    // 6. Update Acid Patches
    for (let i = this.acidPatches.length - 1; i >= 0; i--) {
      const patch = this.acidPatches[i];
      patch.duration -= dtMs;
      if (patch.duration <= 0) {
        this.acidPatches.splice(i, 1);
        continue;
      }
      for (const z of this.zombies) {
        if (Math.hypot(z.x - patch.x, z.y - patch.y) < patch.radius + z.radius) {
          z.health -= patch.damage * dt;
        }
      }
    }

    // 7. Update Zombies
    const now = Date.now();
    for (let i = this.zombies.length - 1; i >= 0; i--) {
      const z = this.zombies[i];

      // Frozen & Slow check
      if (z.isFrozen) {
        if (now > z.freezeTimer) z.isFrozen = false;
        else continue; // cannot move while frozen!
      }
      if (z.isSlowed && now > z.slowTimer) {
        z.isSlowed = false;
      }

      // Death check
      if (z.health <= 0) {
        p.kills++;
        p.score += z.points || 100;
        this.spawnZombieLoot(z);
        this.zombies.splice(i, 1);
        this.aliveCount = this.zombies.length + 1;

        // Vampirism Perk
        if (p.perks.vampirism) {
          p.vampireKillCounter = (p.vampireKillCounter || 0) + 1;
          if (p.vampireKillCounter >= 3) {
            p.vampireKillCounter = 0;
            p.health = Math.min(p.maxHealth, p.health + 15);
            this.floatingTexts.push({
              id: `heal-${Math.random()}`,
              x: p.x,
              y: p.y - 30,
              text: '+15 HP 🩸',
              color: '#e91e63',
              isCrit: true,
              life: 30,
              vy: -1.2,
            });
          }
        }
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
        const dmgTaken = z.damage * dt;

        // Thorn Armor perk
        if (p.perks.thornArmor) {
          z.health -= dmgTaken * 0.6;
        }

        if (p.armor > 0) {
          p.armor -= dmgTaken;
          if (p.armor < 0) {
            p.health += p.armor;
            p.armor = 0;
          }
        } else {
          p.health -= dmgTaken;
        }
        this.addTrauma(0.06);

        if (p.health <= 0) {
          this.isGameOver = true;
        }
      }
    }

    // 8. Update Ground Items & Magnet
    for (let i = this.groundItems.length - 1; i >= 0; i--) {
      const item = this.groundItems[i];
      const dist = Math.hypot(p.x - item.x, p.y - item.y);

      // Magnet pull
      if (dist < p.magnetRadius) {
        const angle = Math.atan2(p.y - item.y, p.x - item.x);
        item.x += Math.cos(angle) * 8.5;
        item.y += Math.sin(angle) * 8.5;
      }

      // Collect
      if (dist < p.radius + 18) {
        if (item.type === 'coin') {
          this.matchRewards.coins += item.value;
          SoundService.playSunCollect();
        } else if (item.type === 'brain') {
          this.matchRewards.brains += item.value;
          SoundService.playSunCollect();
        } else if (item.type === 'heal') {
          p.health = Math.min(p.maxHealth, p.health + 40);
          SoundService.playPlant();
        } else if (item.type === 'armor') {
          p.armor = Math.min(p.maxArmor, p.armor + 40);
          SoundService.playPlant();
        } else if (item.type === 'exp') {
          this.addExp(item.value);
        }
        this.groundItems.splice(i, 1);
      }
    }

    // 9. Update Floating Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.life--;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // 10. Victory Check
    if (this.zombies.length === 0 && p.health > 0) {
      this.isVictory = true;
    }
  }

  breakCrate(crate) {
    this.groundItems.push({
      id: `item-${Math.random()}`,
      x: crate.x + (Math.random() - 0.5) * 20,
      y: crate.y + (Math.random() - 0.5) * 20,
      type: Math.random() < 0.6 ? 'coin' : 'heal',
      value: 15,
      emoji: Math.random() < 0.6 ? '🪙' : '💚',
    });
    // crate also drops EXP
    this.groundItems.push({
      id: `crate-exp-${Math.random()}`,
      x: crate.x + 10,
      y: crate.y,
      type: 'exp',
      value: 20,
      emoji: '✨',
    });
  }

  spawnZombieLoot(zombie) {
    this.groundItems.push({
      id: `loot-coin-${Math.random()}`,
      x: zombie.x,
      y: zombie.y,
      type: 'coin',
      value: 20,
      emoji: '🪙',
    });

    // EXP Orb
    this.groundItems.push({
      id: `loot-exp-${Math.random()}`,
      x: zombie.x + (Math.random() - 0.5) * 14,
      y: zombie.y + (Math.random() - 0.5) * 14,
      type: 'exp',
      value: zombie.isBoss ? 90 : (zombie.type === 'normal' ? 15 : 28),
      emoji: '✨',
    });

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
