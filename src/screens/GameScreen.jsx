import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { GameCanvas } from '../game/render/GameCanvas';
import { SeedBank } from '../components/hud/SeedBank';
import { TopBar } from '../components/hud/TopBar';
import { GameOverModal } from '../components/modals/GameOverModal';
import { VictoryModal } from '../components/modals/VictoryModal';
import { PauseModal } from '../components/modals/PauseModal';

export const GameScreen = ({ onBackToMenu }) => {
  const windowDims = useWindowDimensions();
  const [layoutDims, setLayoutDims] = useState({
    width: windowDims.width,
    height: windowDims.height,
  });

  const handleLayout = (e) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setLayoutDims({ width, height });
    }
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {/* 2D Skia Game Engine Canvas */}
      <GameCanvas width={layoutDims.width} height={layoutDims.height} />

      {/* Floating HUD UI Layer */}
      <View style={styles.hudOverlay} pointerEvents="box-none">
        {/* Top Seed Bank (Left) */}
        <View style={styles.seedBankWrapper} pointerEvents="auto">
          <SeedBank />
        </View>

        {/* Top Bar Stats & Actions (Right) */}
        <View style={styles.topBarWrapper} pointerEvents="auto">
          <TopBar onBackToMenu={onBackToMenu} />
        </View>
      </View>

      {/* Modals */}
      <GameOverModal onRestart={() => {}} onExit={onBackToMenu} />
      <VictoryModal onRestart={() => {}} onExit={onBackToMenu} />
      <PauseModal onExit={onBackToMenu} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b4d1b',
  },
  hudOverlay: {
    ...StyleSheet.absoluteFill,
    paddingTop: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  seedBankWrapper: {
    maxWidth: '70%',
  },
  topBarWrapper: {
    maxWidth: '30%',
  },
});
