import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { BattleRoyaleCanvas } from '../game/render/BattleRoyaleCanvas';
import { battleRoyaleEngine } from '../game/core/BattleRoyaleEngine';
import { VirtualJoystick } from '../components/controls/VirtualJoystick';
import { CombatControls } from '../components/controls/CombatControls';
import { BattleRoyaleHUD } from '../components/hud/BattleRoyaleHUD';
import { SurvivalResultModal } from '../components/modals/SurvivalResultModal';
import { PauseModal } from '../components/modals/PauseModal';
import { PerkSelectionModal } from '../components/modals/PerkSelectionModal';
import { usePlayerStore } from '../store/usePlayerStore';

export const BattleRoyaleScreen = ({ onBackToMenu }) => {
  const { width, height } = useWindowDimensions();
  const [tick, setTick] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const rewardsClaimedRef = useRef(false);

  const addMatchRewards = usePlayerStore((s) => s.addMatchRewards);
  const selectedWeapon = usePlayerStore((s) => s.selectedWeapon);
  const stats = usePlayerStore((s) => s.stats);

  const startNewMatch = () => {
    rewardsClaimedRef.current = false;
    setShowResult(false);
    setIsPaused(false);
    battleRoyaleEngine.init({
      selectedWeapon,
      hpLevel: stats.maxHealthLevel,
      armorLevel: stats.armorLevel,
      speedLevel: stats.speedLevel,
    });
  };

  useEffect(() => {
    startNewMatch();

    const interval = setInterval(() => {
      setTick((t) => t + 1);

      // Check for match completion
      if (
        (battleRoyaleEngine.isGameOver || battleRoyaleEngine.isVictory) &&
        !rewardsClaimedRef.current
      ) {
        rewardsClaimedRef.current = true;
        const rewards = battleRoyaleEngine.matchRewards;
        const p = battleRoyaleEngine.player;
        addMatchRewards({
          coins: rewards.coins,
          brains: rewards.brains,
          kills: p.kills,
          score: p.score,
          isWin: battleRoyaleEngine.isVictory,
        });
        setShowResult(true);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      battleRoyaleEngine.active = false;
    };
  }, []);

  const handleJoystickMove = ({ vx, vy }) => {
    battleRoyaleEngine.setJoystick(vx, vy);
  };

  return (
    <View style={styles.container}>
      {/* 1. Skia 2D World Canvas */}
      <BattleRoyaleCanvas width={width} height={height} />

      {/* 2. Top & Bottom HUD */}
      <BattleRoyaleHUD
        tick={tick}
        width={width}
        height={height}
        onPause={() => {
          battleRoyaleEngine.isPaused = true;
          setIsPaused(true);
        }}
      />

      {/* 3. Left Controls: Virtual Joystick */}
      <VirtualJoystick onMove={handleJoystickMove} />

      {/* 4. Right Controls: Combat Buttons */}
      <CombatControls playerState={battleRoyaleEngine.player} />

      {/* 5. Pause Modal */}
      <PauseModal
        visible={isPaused}
        onResume={() => {
          battleRoyaleEngine.isPaused = false;
          setIsPaused(false);
        }}
        onRestart={() => {
          startNewMatch();
        }}
        onHome={onBackToMenu}
      />

      {/* 6. Survival Result Modal (Victory / Defeat) */}
      <SurvivalResultModal
        visible={showResult}
        isVictory={battleRoyaleEngine.isVictory}
        kills={battleRoyaleEngine.player.kills}
        rank={battleRoyaleEngine.isVictory ? 1 : battleRoyaleEngine.aliveCount}
        coins={battleRoyaleEngine.matchRewards.coins}
        brains={battleRoyaleEngine.matchRewards.brains}
        score={battleRoyaleEngine.player.score}
        onRestart={startNewMatch}
        onHome={onBackToMenu}
      />

      {/* 7. Roguelike Perk Selection Modal */}
      <PerkSelectionModal
        visible={battleRoyaleEngine.isSelectingPerk}
        perks={battleRoyaleEngine.pendingPerks}
        level={battleRoyaleEngine.player.level}
        onSelectPerk={(perk) => {
          battleRoyaleEngine.applyPerk(perk);
          setTick((t) => t + 1);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b4d1b',
  },
});
