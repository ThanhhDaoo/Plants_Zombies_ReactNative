import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

export const PauseModal = ({ visible, onResume, onRestart, onHome }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>⏸️ TRẬN ĐẤU TẠM DỪNG</Text>
        <Text style={styles.subtitle}>Chiến trường sinh tồn đang tạm dừng</Text>

        <View style={styles.buttonList}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.btn, styles.resumeBtn]}
            onPress={onResume}
          >
            <Text style={styles.resumeBtnText}>TIẾP TỤC CHIẾN ĐẤU ▶️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.btn, styles.secondaryBtn]}
            onPress={onRestart}
          >
            <Text style={styles.btnText}>CHƠI LẠI TRẬN NÀY 🔄</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.btn, styles.exitBtn]}
            onPress={onHome}
          >
            <Text style={styles.btnText}>VỀ PHÒNG CHỜ (MENU) 🏠</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 9999,
  },
  card: {
    width: '80%',
    maxWidth: 440,
    backgroundColor: '#1b261b',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#4caf50',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#81c784',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    color: '#a5d6a7',
    marginTop: 4,
    marginBottom: 20,
  },
  buttonList: {
    width: '100%',
    gap: 12,
  },
  btn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumeBtn: {
    backgroundColor: '#2e7d32',
    borderWidth: 1.5,
    borderColor: '#81c784',
  },
  resumeBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  exitBtn: {
    backgroundColor: 'rgba(211, 47, 47, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(239, 83, 80, 0.6)',
  },
  btnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
