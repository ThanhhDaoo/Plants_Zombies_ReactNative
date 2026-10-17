import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { useGameStore } from '../../store/useGameStore';
import { gameWorld } from '../../game/core/GameWorld';

export const GameOverModal = ({ onRestart, onExit }) => {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const score = useGameStore((s) => s.score);
  const resetGame = useGameStore((s) => s.resetGame);

  if (gameStatus !== 'gameover') return null;

  const handleRestart = () => {
    resetGame();
    gameWorld.init();
    if (onRestart) onRestart();
  };

  return (
    <Modal transparent animationType="fade" visible={gameStatus === 'gameover'}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>💀 ZOMBIE ĐÃ ĂN NÃO BẠN!</Text>
          <Text style={styles.subtitle}>
            Lũ xác sống đã tràn qua hàng rào sân sau...
          </Text>

          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>ĐIỂM SỐ ĐẠT ĐƯỢC</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.btn, styles.primaryBtn]}
              onPress={handleRestart}
            >
              <Text style={styles.primaryBtnText}>Chơi Lại 🔄</Text>
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
    backgroundColor: '#263238',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: 380,
    maxWidth: '90%',
    borderWidth: 3,
    borderColor: '#c62828',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ff5252',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#cfd8dc',
    textAlign: 'center',
    marginBottom: 16,
  },
  scoreBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  scoreLabel: {
    fontSize: 11,
    color: '#90a4ae',
    fontWeight: '700',
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffd54f',
    marginTop: 2,
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
    backgroundColor: '#d32f2f',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  },
  secondaryBtn: {
    backgroundColor: '#37474f',
  },
  secondaryBtnText: {
    color: '#eceff1',
    fontWeight: '700',
    fontSize: 14,
  },
});
