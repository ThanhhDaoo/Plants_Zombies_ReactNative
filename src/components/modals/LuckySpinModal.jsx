import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { usePlayerStore } from '../../store/usePlayerStore';

const PRIZES = [
  { id: 0, text: '100 Xu', type: 'coins', value: 100, emoji: '🪙', color: '#ffb300' },
  { id: 1, text: '2 Não', type: 'brains', value: 2, emoji: '🧠', color: '#ec407a' },
  { id: 2, text: '250 Xu', type: 'coins', value: 250, emoji: '🪙', color: '#ffa000' },
  { id: 3, text: '50 Xu', type: 'coins', value: 50, emoji: '🪙', color: '#ffe082' },
  { id: 4, text: '500 Xu VIP', type: 'coins', value: 500, emoji: '💰', color: '#ff6f00' },
  { id: 5, text: '5 Não VIP', type: 'brains', value: 5, emoji: '🧠', color: '#ab47bc' },
  { id: 6, text: '150 Xu', type: 'coins', value: 150, emoji: '🪙', color: '#ffca28' },
  { id: 7, text: '3 Não', type: 'brains', value: 3, emoji: '🧠', color: '#f06292' },
];

export const LuckySpinModal = ({ visible, onClose }) => {
  const coins = usePlayerStore((s) => s.coins);
  const brains = usePlayerStore((s) => s.brains);
  const spinLuckyWheel = usePlayerStore((s) => s.spinLuckyWheel);
  const canFreeSpin = usePlayerStore((s) => s.canFreeSpin);

  const [spinning, setSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState(null);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const currentAngle = useRef(0);

  if (!visible) return null;

  const isFree = canFreeSpin();
  const spinCost = 80; // 80 coins if not free
  const canSpin = !spinning && (isFree || coins >= spinCost);

  const handleSpin = () => {
    if (!canSpin) return;

    if (!isFree) {
      usePlayerStore.setState((s) => ({ coins: s.coins - spinCost }));
    }

    setSpinning(true);
    setWonPrize(null);

    const { prize, index } = spinLuckyWheel();

    // 8 slices, each slice is 360/8 = 45 degrees
    // Slice 0 center is at 0 deg (or top: -90 deg depending on orientation)
    // To land on index, target angle should align needle with that slice
    const sliceAngle = 360 / 8;
    const targetSliceCenter = index * sliceAngle;
    const extraRounds = 5 * 360; // 5 full spins
    const targetAngle = currentAngle.current + extraRounds + (360 - (targetSliceCenter % 360));

    Animated.timing(spinAnim, {
      toValue: targetAngle,
      duration: 3800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      currentAngle.current = targetAngle % 360;
      setSpinning(false);
      setWonPrize(prize);
    });
  };

  const spinInterpolation = spinAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerIcon}>🎰</Text>
            <View>
              <Text style={styles.headerTitle}>VÒNG QUAY MAY MẮN</Text>
              <Text style={styles.headerSub}>Miễn phí mỗi 12 giờ • Cơ hội trúng Hũ Vàng & Não VIP</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            disabled={spinning}
            activeOpacity={0.7}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.body}>
          {/* Wheel Section */}
          <View style={styles.wheelArea}>
            {/* Top Pointer */}
            <View style={styles.needlePointer}>
              <Text style={styles.needleText}>▼</Text>
            </View>

            {/* Rotating Wheel Disk */}
            <Animated.View
              style={[
                styles.wheelDisk,
                { transform: [{ rotate: spinInterpolation }] },
              ]}
            >
              {PRIZES.map((p, idx) => {
                const angle = idx * 45;
                return (
                  <View
                    key={p.id}
                    style={[
                      styles.sliceContainer,
                      { transform: [{ rotate: `${angle}deg` }] },
                    ]}
                  >
                    <View style={[styles.slicePill, { backgroundColor: p.color }]}>
                      <Text style={styles.sliceEmoji}>{p.emoji}</Text>
                      <Text style={styles.sliceLabel}>{p.text}</Text>
                    </View>
                  </View>
                );
              })}
              {/* Wheel Center Hub */}
              <View style={styles.wheelCenterHub}>
                <Text style={styles.hubIcon}>⭐</Text>
              </View>
            </Animated.View>
          </View>

          {/* Controls & Prize Announcement */}
          <View style={styles.controlArea}>
            <View style={styles.walletBox}>
              <Text style={styles.walletText}>Tài khoản: <Text style={styles.goldText}>{coins} 🪙</Text> • <Text style={styles.pinkText}>{brains} 🧠</Text></Text>
            </View>

            {wonPrize ? (
              <View style={styles.prizeWonBox}>
                <Text style={styles.prizeWonTitle}>🎉 CHÚC MỪNG BẠN NHẬN ĐƯỢC!</Text>
                <View style={styles.wonPill}>
                  <Text style={styles.wonEmoji}>{wonPrize.emoji}</Text>
                  <Text style={styles.wonText}>{wonPrize.text}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.statusBox}>
                <Text style={styles.statusText}>
                  {isFree
                    ? '✨ LƯỢT QUAY MIỄN PHÍ ĐANG SẴN SÀNG!'
                    : `Chi phí quay: ${spinCost} Xu`}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.spinButton,
                !canSpin && styles.spinButtonDisabled,
              ]}
              onPress={handleSpin}
              disabled={!canSpin}
              activeOpacity={0.8}
            >
              <Text style={styles.spinButtonText}>
                {spinning ? 'ĐANG QUAY...' : isFree ? 'QUAY MIỄN PHÍ 🎁' : `QUAY NGAY (${spinCost} 🪙)`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 5, 15, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  container: {
    width: '100%',
    maxHeight: '94%',
    backgroundColor: '#1f1338',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ab47bc',
    padding: 16,
    shadowColor: '#ab47bc',
    shadowOpacity: 0.45,
    shadowRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(171, 71, 188, 0.3)',
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    fontSize: 28,
  },
  headerTitle: {
    color: '#f3e5f5',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerSub: {
    color: '#ce93d8',
    fontSize: 11,
    fontWeight: '500',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  wheelArea: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 250,
    height: 250,
  },
  needlePointer: {
    position: 'absolute',
    top: -12,
    zIndex: 10,
  },
  needleText: {
    color: '#ff1744',
    fontSize: 30,
    textShadowColor: '#ffffff',
    textShadowRadius: 6,
  },
  wheelDisk: {
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: '#2e1b4d',
    borderWidth: 5,
    borderColor: '#ffd54f',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  sliceContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingTop: 10,
  },
  slicePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  sliceEmoji: {
    fontSize: 16,
  },
  sliceLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1a0933',
  },
  wheelCenterHub: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffd54f',
    borderWidth: 3,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ffd54f',
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  hubIcon: {
    fontSize: 20,
  },
  controlArea: {
    flex: 1,
    paddingLeft: 30,
    justifyContent: 'center',
    gap: 12,
  },
  walletBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  walletText: {
    color: '#e0e0e0',
    fontSize: 12,
    fontWeight: '600',
  },
  goldText: {
    color: '#ffd54f',
    fontWeight: 'bold',
  },
  pinkText: {
    color: '#f48fb1',
    fontWeight: 'bold',
  },
  prizeWonBox: {
    backgroundColor: 'rgba(76, 175, 80, 0.25)',
    borderWidth: 1.5,
    borderColor: '#66bb6a',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  prizeWonTitle: {
    color: '#a5d6a7',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  wonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wonEmoji: {
    fontSize: 24,
  },
  wonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  statusBox: {
    backgroundColor: 'rgba(171, 71, 188, 0.2)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(171, 71, 188, 0.4)',
  },
  statusText: {
    color: '#f3e5f5',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  spinButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#ff9800',
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  spinButtonDisabled: {
    backgroundColor: '#424242',
    opacity: 0.6,
    shadowOpacity: 0,
  },
  spinButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
