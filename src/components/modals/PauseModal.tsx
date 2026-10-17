import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { useGameStore } from '../../store/useGameStore';
import { gameWorld } from '../../game/core/GameWorld';

interface Props {
  onExit: () => void;
}

export const PauseModal: React.FC<Props> = ({ onExit }) => {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const setGameStatus = useGameStore((s) => s.setGameStatus);
  const resetGame = useGameStore((s) => s.resetGame);

  if (gameStatus !== 'paused') return null;

  const handleResume = () => {
    setGameStatus('playing');
  };

  const handleRestart = () => {
    resetGame();
    gameWorld.init();
    setGameStatus('playing');
  };

  return (
    <Modal transparent animationType="fade" visible={gameStatus === 'paused'}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>⏸️ TRẬN ĐẤU TẠM DỪNG</Text>

          <View style={styles.buttonList}>
            <Pressable
              style={[styles.btn, styles.resumeBtn]}
              onPress={handleResume}
            >
              <Text style={styles.resumeBtnText}>Tiếp Tục Chơi ▶️</Text>
            </Pressable>

            <Pressable
              style={[styles.btn, styles.secondaryBtn]}
              onPress={handleRestart}
            >
              <Text style={styles.btnText}>Chơi Lại Từ Đầu 🔄</Text>
            </Pressable>

            <Pressable
              style={[styles.btn, styles.exitBtn]}
              onPress={onExit}
            >
              <Text style={styles.btnText}>Thoát Ra Menu 🏠</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#37474f',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: 320,
    maxWidth: '90%',
    borderWidth: 2,
    borderColor: '#78909c',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 20,
  },
  buttonList: {
    width: '100%',
    gap: 10,
  },
  btn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  resumeBtn: {
    backgroundColor: '#43a047',
  },
  resumeBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 15,
  },
  secondaryBtn: {
    backgroundColor: '#546e7a',
  },
  exitBtn: {
    backgroundColor: '#c62828',
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
