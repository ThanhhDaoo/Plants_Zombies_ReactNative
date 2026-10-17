import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { battleRoyaleEngine } from '../../game/core/BattleRoyaleEngine';
import { WEAPONS } from '../../game/config/pubgWeapons';

export const BattleRoyaleHUD = ({ onPause, tick }) => {
  const p = battleRoyaleEngine.player;
  const z = battleRoyaleEngine.zone;
  const rewards = battleRoyaleEngine.matchRewards;
  const aliveCount = battleRoyaleEngine.aliveCount;
  const wConfig = WEAPONS[p.currentWeapon] || WEAPONS.pea_pistol;

  const hpRatio = Math.max(0, Math.min(1, p.health / p.maxHealth));
  const armorRatio = Math.max(0, Math.min(1, p.armor / p.maxArmor));

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

          <TouchableOpacity style={styles.pauseBtn} onPress={onPause}>
            <Text style={styles.pauseIcon}>⏸️</Text>
          </TouchableOpacity>
        </View>
      </View>

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
});
