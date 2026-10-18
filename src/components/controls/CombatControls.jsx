import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { battleRoyaleEngine } from '../../game/core/BattleRoyaleEngine';

export const CombatControls = ({ playerState }) => {
  const p = playerState || battleRoyaleEngine.player;
  const fireIntervalRef = useRef(null);

  const stormCdSec = Math.ceil((p.skills?.stormCd || 0) / 1000);
  const bombCdSec = Math.ceil((p.skills?.bombCd || 0) / 1000);
  const dashCdSec = Math.ceil((p.dashCooldown || 0) / 1000);

  useEffect(() => {
    return () => {
      if (fireIntervalRef.current) clearInterval(fireIntervalRef.current);
    };
  }, []);

  const handleFireStart = () => {
    battleRoyaleEngine.triggerFire();
    if (fireIntervalRef.current) clearInterval(fireIntervalRef.current);
    fireIntervalRef.current = setInterval(() => {
      battleRoyaleEngine.triggerFire();
    }, 130);
  };

  const handleFireEnd = () => {
    if (fireIntervalRef.current) {
      clearInterval(fireIntervalRef.current);
      fireIntervalRef.current = null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Cluster of action and skill buttons */}
      <View style={styles.buttonCluster}>
        {/* Row 1: Skill 1 (Cherry Bomb) & Skill 2 (Pea Storm) */}
        <View style={styles.skillRow}>
          {/* Cherry Bomb */}
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={bombCdSec > 0}
            style={[styles.skillBtn, bombCdSec > 0 && styles.btnDisabled]}
            onPress={() => battleRoyaleEngine.triggerCherryBomb()}
          >
            <Text style={styles.skillEmoji}>🍒</Text>
            {bombCdSec > 0 ? (
              <View style={styles.cdOverlay}>
                <Text style={styles.cdText}>{bombCdSec}s</Text>
              </View>
            ) : null}
            <Text style={styles.btnLabel}>Bom</Text>
          </TouchableOpacity>

          {/* Pea Storm 360 */}
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={stormCdSec > 0}
            style={[styles.skillBtn, stormCdSec > 0 && styles.btnDisabled]}
            onPress={() => battleRoyaleEngine.triggerPeaStorm()}
          >
            <Text style={styles.skillEmoji}>🌪️</Text>
            {stormCdSec > 0 ? (
              <View style={styles.cdOverlay}>
                <Text style={styles.cdText}>{stormCdSec}s</Text>
              </View>
            ) : null}
            <Text style={styles.btnLabel}>Bão Đậu</Text>
          </TouchableOpacity>
        </View>

        {/* Row 2: Reload & Dash */}
        <View style={styles.actionRow}>
          {/* Reload Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={p.isReloading}
            style={[styles.actionBtn, styles.reloadBtn, p.isReloading && styles.btnDisabled]}
            onPress={() => battleRoyaleEngine.triggerReload()}
          >
            <Text style={styles.actionEmoji}>🔄</Text>
            <Text style={styles.btnLabel}>{p.isReloading ? 'Nạp...' : 'Nạp'}</Text>
          </TouchableOpacity>

          {/* Dash Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={dashCdSec > 0}
            style={[styles.actionBtn, styles.dashBtn, dashCdSec > 0 && styles.btnDisabled]}
            onPress={() => battleRoyaleEngine.triggerDash()}
          >
            <Text style={styles.actionEmoji}>⚡</Text>
            {dashCdSec > 0 ? (
              <View style={styles.cdOverlay}>
                <Text style={styles.cdText}>{dashCdSec}s</Text>
              </View>
            ) : null}
            <Text style={styles.btnLabel}>Lướt</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Fire / Rapid-Fire Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={handleFireStart}
        onPressOut={handleFireEnd}
        style={styles.fireBtn}
      >
        <Text style={styles.fireEmoji}>🎯</Text>
        <Text style={styles.fireText}>BẮN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 48,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
    zIndex: 100,
  },
  buttonCluster: {
    gap: 10,
    alignItems: 'flex-end',
  },
  skillRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  skillBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(211, 47, 47, 0.75)',
    borderWidth: 2,
    borderColor: '#ff8a80',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  actionBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  reloadBtn: {
    backgroundColor: 'rgba(2, 136, 209, 0.75)',
    borderWidth: 2,
    borderColor: '#81d4fa',
  },
  dashBtn: {
    backgroundColor: 'rgba(245, 124, 0, 0.8)',
    borderWidth: 2,
    borderColor: '#ffcc80',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  skillEmoji: {
    fontSize: 22,
  },
  actionEmoji: {
    fontSize: 22,
  },
  btnLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 2,
    marginTop: -2,
  },
  cdOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cdText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  fireBtn: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: 'rgba(229, 57, 53, 0.9)',
    borderWidth: 3.5,
    borderColor: '#ff8a80',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#d32f2f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  fireBtnCharging: {
    backgroundColor: 'rgba(0, 229, 255, 0.95)',
    borderColor: '#ffffff',
    transform: [{ scale: 1.1 }],
  },
  fireEmoji: {
    fontSize: 30,
  },
  fireText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1,
    marginTop: -4,
  },
});
