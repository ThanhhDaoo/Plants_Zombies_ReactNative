import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useGameStore } from '../../store/useGameStore';

export const ShovelButton: React.FC = () => {
  const isShovelActive = useGameStore((s) => s.isShovelActive);
  const toggleShovel = useGameStore((s) => s.toggleShovel);

  return (
    <Pressable
      style={[styles.button, isShovelActive && styles.buttonActive]}
      onPress={toggleShovel}
    >
      <Text style={styles.icon}>🪴</Text>
      <Text style={styles.label}>Đào Cây</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 75,
    backgroundColor: '#5d4037',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3e2723',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  buttonActive: {
    borderColor: '#ff5722',
    backgroundColor: '#8d6e63',
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
  },
  icon: {
    fontSize: 26,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
    marginTop: 4,
  },
});
