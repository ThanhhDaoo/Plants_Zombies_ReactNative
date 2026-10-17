import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';

export const TopBar = ({ onBackToMenu }) => {
  const wave = useGameStore((s) => s.wave);
  const totalWaves = useGameStore((s) => s.totalWaves);
  const setGameStatus = useGameStore((s) => s.setGameStatus);
  const coins = usePlayerStore((s) => s.coins);
  const audioEnabled = usePlayerStore((s) => s.audioEnabled);
  const toggleAudio = usePlayerStore((s) => s.toggleAudio);

  return (
    <View style={styles.container}>
      {/* Wave Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          Đợt: {wave} / {totalWaves}
        </Text>
      </View>

      {/* Coins */}
      <View style={[styles.badge, styles.coinsBadge]}>
        <Text style={styles.coinIcon}>🪙</Text>
        <Text style={styles.badgeText}>{coins}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={toggleAudio}>
          <Text style={styles.btnText}>{audioEnabled ? '🔊' : '🔇'}</Text>
        </Pressable>

        <Pressable
          style={styles.actionBtn}
          onPress={() => setGameStatus('paused')}
        >
          <Text style={styles.btnText}>⏸️</Text>
        </Pressable>

        <Pressable
          style={[styles.actionBtn, styles.menuBtn]}
          onPress={onBackToMenu}
        >
          <Text style={styles.menuBtnText}>Menu</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  badge: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#78909c',
  },
  coinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ffd54f',
  },
  coinIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#90a4ae',
    minWidth: 36,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 14,
  },
  menuBtn: {
    backgroundColor: '#37474f',
    borderColor: '#78909c',
  },
  menuBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
});
