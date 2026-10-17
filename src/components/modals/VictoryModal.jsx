import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { useGameStore } from '../../store/useGameStore';
import { gameWorld } from '../../game/core/GameWorld';
import { GAME_SETTINGS } from '../../game/config/game.config';

export const VictoryModal = ({ onRestart, onExit }) => {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const score = useGameStore((s) => s.score);
  const resetGame = useGameStore((s) => s.resetGame);

  if (gameStatus !== 'victory') return null;

  const handleRestart = () => {
    resetGame();
    gameWorld.init();
    if (onRestart) onRestart();
  };

  return (
    <Modal transparent animationType="fade" visible={gameStatus === 'victory'}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>🏆 CHIẾN THẮNG HUY HOÀNG!</Text>
          <Text style={styles.subtitle}>
            Bạn đã bảo vệ thành công khu vườn khỏi toàn bộ các đợt Zombie!
          </Text>

          <View style={styles.rewardBox}>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardLabel}>ĐIỂM SỐ</Text>
              <Text style={styles.rewardValue}>{score}</Text>
            </View>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardLabel}>THƯỞNG VÀNG</Text>
              <Text style={[styles.rewardValue, styles.goldValue]}>
                +{GAME_SETTINGS.VICTORY_BONUS_COINS} 🪙
              </Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.btn, styles.primaryBtn]}
              onPress={handleRestart}
            >
              <Text style={styles.primaryBtnText}>Chơi Tiếp 🌟</Text>
            </Pressable>

            <Pressable style={[styles.btn, styles.secondaryBtn]} onPress={onExit}>
              <Text style={styles.secondaryBtnText}>Về Trang Chủ 🏠</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#1b5e20',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: 400,
    maxWidth: '90%',
    borderWidth: 3,
    borderColor: '#ffd600',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffea00',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#e8f5e9',
    textAlign: 'center',
    marginBottom: 16,
  },
  rewardBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '100%',
  },
  rewardItem: {
    alignItems: 'center',
  },
  rewardLabel: {
    fontSize: 11,
    color: '#c8e6c9',
    fontWeight: '700',
  },
  rewardValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    marginTop: 2,
  },
  goldValue: {
    color: '#ffd54f',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtn: {
    backgroundColor: '#ffb300',
  },
  primaryBtnText: {
    color: '#212121',
    fontWeight: '900',
    fontSize: 14,
  },
  secondaryBtn: {
    backgroundColor: '#2e7d32',
  },
  secondaryBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
