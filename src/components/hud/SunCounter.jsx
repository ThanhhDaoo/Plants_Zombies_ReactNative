import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGameStore } from '../../store/useGameStore';

export const SunCounter = () => {
  const sun = useGameStore((s) => s.sun);

  return (
    <View style={styles.container}>
      <View style={styles.sunIconWrapper}>
        <Text style={styles.sunIcon}>☀️</Text>
      </View>
      <Text style={styles.sunText}>{sun}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 235, 59, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#f57f17',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sunIconWrapper: {
    marginRight: 6,
  },
  sunIcon: {
    fontSize: 20,
  },
  sunText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#3e2723',
    fontVariant: ['tabular-nums'],
  },
});
