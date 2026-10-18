import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { usePlayerStore } from '../../store/usePlayerStore';

export const ZenGardenModal = ({ visible, onClose }) => {
  const coins = usePlayerStore((s) => s.coins);
  const brains = usePlayerStore((s) => s.brains);
  const zenGarden = usePlayerStore((s) => s.zenGarden);
  const getZenRewards = usePlayerStore((s) => s.getZenRewards);
  const harvestZenGarden = usePlayerStore((s) => s.harvestZenGarden);
  const upgradeZenPlot = usePlayerStore((s) => s.upgradeZenPlot);

  const [rewards, setRewards] = useState({ coins: 0, brains: 0, elapsedHours: '0.0' });
  const [harvestMsg, setHarvestMsg] = useState(null);

  // Recalculate accumulated rewards on open and every 5 seconds
  useEffect(() => {
    if (!visible) return;
    const update = () => {
      setRewards(getZenRewards());
    };
    update();
    const timer = setInterval(update, 5000);
    return () => clearInterval(timer);
  }, [visible, zenGarden]);

  if (!visible) return null;

  const handleHarvest = () => {
    const res = harvestZenGarden();
    if (res.coins > 0 || res.brains > 0) {
      setHarvestMsg(`+${res.coins} 🪙 và +${res.brains} 🧠!`);
      setRewards(getZenRewards());
      setTimeout(() => setHarvestMsg(null), 2500);
    }
  };

  const handleUpgrade = (index) => {
    upgradeZenPlot(index);
    setRewards(getZenRewards());
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerIcon}>🌻</Text>
            <View>
              <Text style={styles.headerTitle}>VƯỜN ZEN SINH THÁI</Text>
              <Text style={styles.headerSub}>Tích luỹ Xu & Não tự động khi Offline (Tối đa 12h)</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Harvest Summary Banner */}
        <View style={styles.harvestBanner}>
          <View style={styles.harvestInfo}>
            <Text style={styles.harvestTimeText}>⏱️ Thời gian tích luỹ: <Text style={styles.highlight}>{rewards.elapsedHours} giờ</Text></Text>
            <View style={styles.rewardBadges}>
              <View style={styles.rewardBadge}>
                <Text style={styles.badgeEmoji}>🪙</Text>
                <Text style={styles.badgeAmount}>+{rewards.coins} Xu</Text>
              </View>
              <View style={[styles.rewardBadge, styles.brainBadge]}>
                <Text style={styles.badgeEmoji}>🧠</Text>
                <Text style={styles.badgeAmount}>+{rewards.brains} Não</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.harvestBtn,
              (rewards.coins <= 0 && rewards.brains <= 0) && styles.harvestBtnDisabled,
            ]}
            onPress={handleHarvest}
            disabled={rewards.coins <= 0 && rewards.brains <= 0}
            activeOpacity={0.8}
          >
            <Text style={styles.harvestBtnText}>🌻 THU HOẠCH NGAY</Text>
          </TouchableOpacity>
        </View>

        {harvestMsg && (
          <View style={styles.toast}>
            <Text style={styles.toastText}>🎉 Thu hoạch thành công: {harvestMsg}</Text>
          </View>
        )}

        {/* Plants Plots Grid */}
        <Text style={styles.sectionTitle}>🌱 CÁC CHẬU CÂY TRONG VƯỜN</Text>
        <ScrollView style={styles.plotsScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.plotsGrid}>
            {zenGarden.plots.map((plot, idx) => {
              const upgradeCost = plot.level * 120;
              const canUpgrade = plot.level < 5 && coins >= upgradeCost;

              return (
                <View key={plot.id} style={styles.plotCard}>
                  <View style={styles.plotEmojiCircle}>
                    <Text style={styles.plotEmoji}>{plot.emoji}</Text>
                  </View>
                  <View style={styles.plotDetails}>
                    <View style={styles.plotHeaderRow}>
                      <Text style={styles.plotName}>{plot.name}</Text>
                      <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>Cấp {plot.level}/5</Text>
                      </View>
                    </View>

                    <Text style={styles.plotRate}>
                      Sản xuất: <Text style={styles.rateHighlight}>+{plot.coinRate * plot.level} 🪙/h</Text>
                      {plot.brainRate > 0 ? ` • +${(plot.brainRate * plot.level).toFixed(1)} 🧠/h` : ''}
                    </Text>

                    <TouchableOpacity
                      style={[styles.upgradeBtn, !canUpgrade && styles.upgradeBtnDisabled]}
                      onPress={() => handleUpgrade(idx)}
                      disabled={!canUpgrade}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.upgradeBtnText}>
                        {plot.level >= 5 ? '★ TỐI ĐA' : `Nâng Cấp: ${upgradeCost} 🪙`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 12, 10, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  container: {
    width: '100%',
    maxHeight: '94%',
    backgroundColor: '#1b3022',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4caf50',
    padding: 16,
    shadowColor: '#4caf50',
    shadowOpacity: 0.35,
    shadowRadius: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(76, 175, 80, 0.3)',
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
    color: '#a5d6a7',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerSub: {
    color: '#81c784',
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
  harvestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(20, 50, 30, 0.9)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#81c784',
    marginBottom: 10,
  },
  harvestInfo: {
    flex: 1,
  },
  harvestTimeText: {
    color: '#e8f5e9',
    fontSize: 12,
    marginBottom: 4,
  },
  highlight: {
    color: '#ffd54f',
    fontWeight: 'bold',
  },
  rewardBadges: {
    flexDirection: 'row',
    gap: 10,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 213, 79, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffd54f',
    gap: 4,
  },
  brainBadge: {
    backgroundColor: 'rgba(244, 143, 177, 0.15)',
    borderColor: '#f48fb1',
  },
  badgeEmoji: {
    fontSize: 14,
  },
  badgeAmount: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  harvestBtn: {
    backgroundColor: '#ffb300',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#ffb300',
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  harvestBtnDisabled: {
    backgroundColor: '#424242',
    opacity: 0.5,
  },
  harvestBtnText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  toast: {
    backgroundColor: 'rgba(76, 175, 80, 0.95)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginBottom: 8,
  },
  toastText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  sectionTitle: {
    color: '#c8e6c9',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  plotsScroll: {
    flex: 1,
  },
  plotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  plotCard: {
    width: '48.5%',
    backgroundColor: 'rgba(10, 30, 20, 0.65)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  plotEmojiCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  plotEmoji: {
    fontSize: 24,
  },
  plotDetails: {
    flex: 1,
  },
  plotHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plotName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  levelBadge: {
    backgroundColor: '#388e3c',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  levelText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  plotRate: {
    color: '#a5d6a7',
    fontSize: 10,
    marginVertical: 4,
  },
  rateHighlight: {
    color: '#ffd54f',
    fontWeight: 'bold',
  },
  upgradeBtn: {
    backgroundColor: '#4caf50',
    paddingVertical: 5,
    borderRadius: 6,
    alignItems: 'center',
  },
  upgradeBtnDisabled: {
    backgroundColor: '#37474f',
    opacity: 0.6,
  },
  upgradeBtnText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
