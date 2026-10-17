import React, { useEffect, useState } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { PlantType } from '../../types/plant.types';
import { PLANTS_CONFIG } from '../../game/config/plants.config';
import { useGameStore } from '../../store/useGameStore';

interface Props {
  type: PlantType;
}

export const SeedPacket: React.FC<Props> = ({ type }) => {
  const config = PLANTS_CONFIG[type];
  const sun = useGameStore((s) => s.sun);
  const selectedSeed = useGameStore((s) => s.selectedSeed);
  const selectSeed = useGameStore((s) => s.selectSeed);
  const cooldownUntil = useGameStore((s) => s.seedCooldowns[type] || 0);

  const [remainingCooldown, setRemainingCooldown] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.max(0, cooldownUntil - Date.now());
      setRemainingCooldown(diff);
    }, 100);
    return () => clearInterval(interval);
  }, [cooldownUntil]);

  const isSelected = selectedSeed === type;
  const isAffordable = sun >= config.cost;
  const isReady = remainingCooldown <= 0;
  const canSelect = isAffordable && isReady;

  const handlePress = () => {
    if (isSelected) {
      selectSeed(null);
    } else if (canSelect) {
      selectSeed(type);
    }
  };

  const cooldownRatio = config.cooldownMs > 0 ? remainingCooldown / config.cooldownMs : 0;

  return (
    <Pressable
      style={[
        styles.packet,
        isSelected && styles.packetSelected,
        !canSelect && styles.packetDisabled,
      ]}
      onPress={handlePress}
    >
      <Text style={styles.emoji}>{config.emoji}</Text>
      <Text style={styles.cost}>{config.cost}</Text>

      {/* Cooldown Mask Overlay */}
      {remainingCooldown > 0 && (
        <View
          style={[
            styles.cooldownOverlay,
            { height: `${Math.min(100, cooldownRatio * 100)}%` },
          ]}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  packet: {
    width: 60,
    height: 75,
    backgroundColor: '#8d6e63',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4e342e',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    marginRight: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  packetSelected: {
    borderColor: '#ffd600',
    borderWidth: 3,
    transform: [{ translateY: -4 }],
  },
  packetDisabled: {
    opacity: 0.55,
  },
  emoji: {
    fontSize: 26,
    marginTop: 2,
  },
  cost: {
    fontSize: 13,
    fontWeight: '900',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    width: '100%',
    textAlign: 'center',
    paddingVertical: 1,
  },
  cooldownOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
});
