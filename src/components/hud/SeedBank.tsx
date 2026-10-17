import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SunCounter } from './SunCounter';
import { SeedPacket } from './SeedPacket';
import { ShovelButton } from './ShovelButton';
import { usePlayerStore } from '../../store/usePlayerStore';

export const SeedBank: React.FC = () => {
  const unlockedPlants = usePlayerStore((s) => s.unlockedPlants);

  return (
    <View style={styles.container}>
      <SunCounter />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.packetList}
      >
        {unlockedPlants.map((plant) => (
          <SeedPacket key={plant} type={plant} />
        ))}
      </ScrollView>
      <ShovelButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(62, 39, 35, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#271714',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 8,
  },
  packetList: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});
