import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { usePlayerStore } from '../store/usePlayerStore';
import { useGameStore } from '../store/useGameStore';
import { gameWorld } from '../game/core/GameWorld';

interface Props {
  onStartGame: () => void;
}

export const HomeScreen: React.FC<Props> = ({ onStartGame }) => {
  const coins = usePlayerStore((s) => s.coins);
  const brains = usePlayerStore((s) => s.brains);
  const highScore = usePlayerStore((s) => s.highScore);
  const resetGame = useGameStore((s) => s.resetGame);

  const handleStartClassic = () => {
    resetGame();
    gameWorld.init();
    onStartGame();
  };

  return (
    <ImageBackground
      source={require('../../assets/game/lawn_bg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.darkOverlay}>
        {/* Top Header / Currencies */}
        <View style={styles.header}>
          <View style={styles.brandTitleBox}>
            <Text style={styles.brandIcon}>🌱</Text>
            <View>
              <Text style={styles.gameTitle}>PLANTS VS ZOMBIES</Text>
              <Text style={styles.gameSubtitle}>React Native Mobile Edition</Text>
            </View>
          </View>

          <View style={styles.currencies}>
            <View style={styles.currencyPill}>
              <Text style={styles.currencyIcon}>🪙</Text>
              <Text style={styles.currencyVal}>{coins}</Text>
            </View>
            <View style={[styles.currencyPill, styles.brainPill]}>
              <Text style={styles.currencyIcon}>🧠</Text>
              <Text style={styles.currencyVal}>{brains}</Text>
            </View>
            <View style={[styles.currencyPill, styles.trophyPill]}>
              <Text style={styles.currencyIcon}>🏆</Text>
              <Text style={styles.currencyVal}>{highScore}</Text>
            </View>
          </View>
        </View>

        {/* Main Content Area */}
        <View style={styles.mainLayout}>
          {/* Left Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>CHIẾN BINH THỰC VẬT</Text>
            </View>
            <Text style={styles.heroEmoji}>🌱</Text>
            <Text style={styles.heroName}>ĐẬU BẮN TỈA</Text>
            <Text style={styles.heroDesc}>
              Bắn những viên đạn đậu siêu tốc ngăn chặn bầy Zombie xâm chiếm khu vườn!
            </Text>
          </View>

          {/* Center Play Button & Modes */}
          <View style={styles.centerActions}>
            <Pressable
              style={({ pressed }) => [
                styles.playBtn,
                pressed && styles.playBtnPressed,
              ]}
              onPress={handleStartClassic}
            >
              <Text style={styles.playBtnIcon}>⚔️</Text>
              <Text style={styles.playBtnText}>BẮT ĐẦU CHIẾN ĐẤU</Text>
              <Text style={styles.playBtnSub}>Chế độ Sân Cỏ Cổ Điển (5x9)</Text>
            </Pressable>

            {/* Quick Plant Preview Bar */}
            <View style={styles.plantPreviewRow}>
              <View style={styles.previewItem}>
                <Text style={styles.previewEmoji}>🌻</Text>
                <Text style={styles.previewCost}>50</Text>
              </View>
              <View style={styles.previewItem}>
                <Text style={styles.previewEmoji}>🌱</Text>
                <Text style={styles.previewCost}>100</Text>
              </View>
              <View style={styles.previewItem}>
                <Text style={styles.previewEmoji}>🥥</Text>
                <Text style={styles.previewCost}>50</Text>
              </View>
              <View style={styles.previewItem}>
                <Text style={styles.previewEmoji}>❄️</Text>
                <Text style={styles.previewCost}>175</Text>
              </View>
              <View style={styles.previewItem}>
                <Text style={styles.previewEmoji}>🌾</Text>
                <Text style={styles.previewCost}>200</Text>
              </View>
              <View style={styles.previewItem}>
                <Text style={styles.previewEmoji}>🍒</Text>
                <Text style={styles.previewCost}>150</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  darkOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 25, 12, 0.75)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandIcon: {
    fontSize: 32,
  },
  gameTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#81c784',
    letterSpacing: 1.5,
  },
  gameSubtitle: {
    fontSize: 12,
    color: '#c8e6c9',
    fontWeight: '700',
  },
  currencies: {
    flexDirection: 'row',
    gap: 10,
  },
  currencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#ffd54f',
    gap: 6,
  },
  brainPill: {
    borderColor: '#f48fb1',
  },
  trophyPill: {
    borderColor: '#81d4fa',
  },
  currencyIcon: {
    fontSize: 16,
  },
  currencyVal: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    marginTop: 10,
  },
  heroCard: {
    width: 220,
    backgroundColor: 'rgba(38, 50, 56, 0.9)',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4caf50',
  },
  heroBadge: {
    backgroundColor: '#388e3c',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  heroBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  heroEmoji: {
    fontSize: 60,
    marginVertical: 4,
  },
  heroName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
  },
  heroDesc: {
    color: '#b0bec5',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  centerActions: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  playBtn: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 36,
    paddingVertical: 18,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffd600',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  playBtnPressed: {
    transform: [{ scale: 0.96 }],
    backgroundColor: '#1b5e20',
  },
  playBtnIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  playBtnText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  playBtnSub: {
    color: '#c8e6c9',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  plantPreviewRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#78909c',
  },
  previewItem: {
    alignItems: 'center',
  },
  previewEmoji: {
    fontSize: 22,
  },
  previewCost: {
    color: '#ffd54f',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 2,
  },
});
