import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { battleRoyaleEngine } from '../../game/core/BattleRoyaleEngine';
import { WEAPONS } from '../../game/config/pubgWeapons';

export const BattleRoyaleHUD = ({ onPause, tick, width, height }) => {
  const p = battleRoyaleEngine.player;
  const z = battleRoyaleEngine.zone;
  const rewards = battleRoyaleEngine.matchRewards;
  const aliveCount = battleRoyaleEngine.aliveCount;
  const wConfig = WEAPONS[p.currentWeapon] || WEAPONS.pea_pistol;

  const hpRatio = Math.max(0, Math.min(1, p.health / p.maxHealth));
  const armorRatio = Math.max(0, Math.min(1, p.armor / p.maxArmor));
  const expRatio = Math.max(0, Math.min(1, (p.exp || 0) / (p.expToNextLevel || 50)));

  const formatTime = (seconds) => {
    const s = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.hudOverlay} pointerEvents="box-none">
      {/* Top Header Bar */}
      <View style={styles.topBar}>
        {/* Alive Counter */}
        <View style={styles.statBadge}>
          <Text style={styles.statLabel}>SỐNG SÓT</Text>
          <View style={styles.row}>
            <Text style={styles.statIcon}>🧟</Text>
            <Text style={styles.statValueGreen}>{aliveCount}</Text>
          </View>
        </View>

        {/* Zone Phase & Countdown */}
        <View style={[styles.zoneBadge, z.isShrinking && styles.zoneShrinking]}>
          <Text style={styles.zonePhaseText}>
            {z.isShrinking ? '⚠️ VÒNG BO ĐANG THU!' : `VÒNG BO ${z.phase}/${z.maxPhases}`}
          </Text>
          <Text style={styles.zoneTimeText}>
            {z.isShrinking ? 'CẨN THẬN!' : formatTime(z.countdown)}
          </Text>
        </View>

        {/* Kills & Loot Badge */}
        <View style={styles.topRight}>
          <View style={styles.statBadge}>
            <Text style={styles.statLabel}>HẠ GỤC</Text>
            <View style={styles.row}>
              <Text style={styles.statIcon}>💀</Text>
              <Text style={styles.statValueRed}>{p.kills}</Text>
            </View>
          </View>

          <View style={styles.rewardPills}>
            <View style={styles.pill}>
              <Text style={styles.pillIcon}>🪙</Text>
              <Text style={styles.pillText}>{rewards.coins}</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillIcon}>🧠</Text>
              <Text style={styles.pillText}>{rewards.brains}</Text>
            </View>
          </View>

          {/* Claim Perk Badge */}
          {(battleRoyaleEngine.pendingPerkPicks || 0) > 0 && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.perkBadge}
              onPress={() => battleRoyaleEngine.openPerkSelection()}
            >
              <Text style={styles.perkBadgeStar}>⭐</Text>
              <Text style={styles.perkBadgeText}>
                LÊN CẤP (+{battleRoyaleEngine.pendingPerkPicks})
              </Text>
              <View style={styles.perkBadgeHintTag}>
                <Text style={styles.perkBadgeHint}>CHỌN THẺ</Text>
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.pauseBtn} onPress={onPause}>
            <Text style={styles.pauseIcon}>⏸️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dr. Zomboss Boss Health Bar */}
      {battleRoyaleEngine.boss && battleRoyaleEngine.boss.health > 0 && (
        <View style={styles.bossBarRow} pointerEvents="none">
          <View style={styles.bossBadge}>
            <Text style={styles.bossIcon}>👹</Text>
            <Text style={styles.bossName}>DR. ZOMBOSS MECH TITAN</Text>
            <Text style={styles.bossHpText}>
              {Math.max(0, Math.round(battleRoyaleEngine.boss.health))}/{battleRoyaleEngine.boss.maxHealth} HP
            </Text>
          </View>
          <View style={styles.bossTrack}>
            <View
              style={[
                styles.bossFill,
                {
                  width: `${Math.max(0, Math.min(1, battleRoyaleEngine.boss.health / battleRoyaleEngine.boss.maxHealth)) * 100}%`,
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* EXP Level Progress Bar */}
      <View style={styles.expBarRow} pointerEvents="none">
        <View style={styles.expBadge}>
          <Text style={styles.expBadgeText}>⭐ LV.{p.level || 1}</Text>
        </View>
        <View style={styles.expTrack}>
          <View style={[styles.expFill, { width: `${expRatio * 100}%` }]} />
        </View>
        <Text style={styles.expText}>
          {p.exp || 0}/{p.expToNextLevel || 50} EXP
        </Text>
      </View>

      {/* Floating Damage Text Popups */}
      {width && height && battleRoyaleEngine.floatingTexts.map((ft) => {
        const sx = ft.x - battleRoyaleEngine.camera.x + width / 2 + (battleRoyaleEngine.camera.shakeX || 0);
        const sy = ft.y - battleRoyaleEngine.camera.y + height / 2 + (battleRoyaleEngine.camera.shakeY || 0);
        return (
          <View
            key={ft.id}
            pointerEvents="none"
            style={[
              styles.floatingBox,
              {
                left: sx - 40,
                top: sy,
                opacity: Math.min(1, ft.life / 8),
              },
            ]}
          >
            <Text
              style={[
                styles.floatingTxt,
                { color: ft.color || '#ffffff' },
                ft.isCrit && styles.floatingTxtCrit,
              ]}
            >
              {ft.text}
            </Text>
          </View>
        );
      })}

      {/* Bottom Status: Health & Armor */}
      <View style={styles.bottomStats} pointerEvents="none">
        {/* Health Bar */}
        <View style={styles.barContainer}>
          <View style={styles.barLabelRow}>
            <Text style={styles.barTitle}>❤️ MÁU</Text>
            <Text style={styles.barNum}>
              {Math.max(0, Math.round(p.health))}/{p.maxHealth}
            </Text>
          </View>
          <View style={styles.barTrack}>
            <View style={[styles.barFillHp, { width: `${hpRatio * 100}%` }]} />
          </View>
        </View>

        {/* Armor Bar */}
        <View style={styles.barContainer}>
          <View style={styles.barLabelRow}>
            <Text style={styles.barTitle}>🛡️ GIÁP</Text>
            <Text style={styles.barNum}>
              {Math.max(0, Math.round(p.armor))}/{p.maxArmor}
            </Text>
          </View>
          <View style={styles.barTrack}>
            <View style={[styles.barFillArmor, { width: `${armorRatio * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Weapon Info Badge (Placed near bottom center) */}
      <View style={styles.weaponBadge} pointerEvents="none">
        <Text style={styles.weaponEmoji}>{wConfig.emoji}</Text>
        <View>
          <Text style={styles.weaponName}>{wConfig.name}</Text>
          <Text style={[styles.weaponAmmo, p.isReloading && styles.ammoReloading]}>
            {p.isReloading ? '🔄 ĐANG NẠP...' : `🔫 ${p.ammo} / ${wConfig.magazineSize}`}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hudOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 48,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statBadge: {
    backgroundColor: 'rgba(10, 15, 10, 0.75)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9,
    color: '#bdbdbd',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 16,
  },
  statValueGreen: {
    fontSize: 18,
    fontWeight: '900',
    color: '#69f0ae',
  },
  statValueRed: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ff5252',
  },
  zoneBadge: {
    backgroundColor: 'rgba(33, 33, 33, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#42a5f5',
    alignItems: 'center',
  },
  zoneShrinking: {
    backgroundColor: 'rgba(183, 28, 28, 0.85)',
    borderColor: '#ff5252',
  },
  zonePhaseText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '800',
  },
  zoneTimeText: {
    fontSize: 14,
    color: '#ffd54f',
    fontWeight: '900',
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardPills: {
    flexDirection: 'column',
    gap: 3,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  pillIcon: {
    fontSize: 12,
  },
  pillText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pauseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  pauseIcon: {
    fontSize: 16,
  },
  perkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e65100',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#ffe082',
    gap: 5,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
  },
  perkBadgeStar: {
    fontSize: 14,
  },
  perkBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  perkBadgeHintTag: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  perkBadgeHint: {
    color: '#ffe082',
    fontSize: 9,
    fontWeight: '800',
  },
  bottomStats: {
    position: 'absolute',
    bottom: 24,
    left: 170, // right of joystick
    width: 170,
    gap: 6,
  },
  barContainer: {
    backgroundColor: 'rgba(10, 15, 10, 0.8)',
    padding: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  barTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  barNum: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  barTrack: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFillHp: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 4,
  },
  barFillArmor: {
    height: '100%',
    backgroundColor: '#00e5ff',
    borderRadius: 4,
  },
  weaponBadge: {
    position: 'absolute',
    bottom: 24,
    right: 230, // left of combat buttons
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 15, 10, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 215, 64, 0.4)',
    gap: 10,
  },
  weaponEmoji: {
    fontSize: 26,
  },
  weaponName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffd54f',
  },
  weaponAmmo: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
  ammoReloading: {
    color: '#ff9800',
  },
  expBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    paddingHorizontal: 8,
  },
  expBadge: {
    backgroundColor: '#0288d1',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4fc3f7',
  },
  expBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
  expTrack: {
    flex: 1,
    height: 7,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 229, 255, 0.4)',
  },
  expFill: {
    height: '100%',
    backgroundColor: '#00e5ff',
    borderRadius: 4,
  },
  expText: {
    fontSize: 9,
    color: '#81d4fa',
    fontWeight: 'bold',
  },
  floatingBox: {
    position: 'absolute',
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingTxt: {
    fontSize: 13,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowRadius: 3,
  },
  floatingTxtCrit: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffd600',
    textShadowColor: '#d50000',
    textShadowRadius: 6,
  },
  bossBarRow: {
    position: 'absolute',
    top: 48,
    left: '15%',
    right: '15%',
    backgroundColor: 'rgba(10, 0, 20, 0.85)',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e91e63',
    padding: 6,
    gap: 4,
    shadowColor: '#e91e63',
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  bossBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bossIcon: {
    fontSize: 14,
  },
  bossName: {
    color: '#f48fb1',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  bossHpText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bossTrack: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bossFill: {
    height: '100%',
    backgroundColor: '#e91e63',
    borderRadius: 4,
  },
});
