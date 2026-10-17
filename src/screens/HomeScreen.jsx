import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Modal,
} from 'react-native';
import { usePlayerStore } from '../store/usePlayerStore';
import { WEAPONS } from '../game/config/pubgWeapons';

export const HomeScreen = ({ onStartGame }) => {
  const coins = usePlayerStore((s) => s.coins);
  const brains = usePlayerStore((s) => s.brains);
  const topRank = usePlayerStore((s) => s.topRank);
  const totalKills = usePlayerStore((s) => s.totalKills);
  const highScore = usePlayerStore((s) => s.highScore);
  const selectedWeapon = usePlayerStore((s) => s.selectedWeapon);
  const unlockedWeapons = usePlayerStore((s) => s.unlockedWeapons);
  const weaponLevels = usePlayerStore((s) => s.weaponLevels);
  const stats = usePlayerStore((s) => s.stats);

  const selectWeapon = usePlayerStore((s) => s.selectWeapon);
  const unlockWeapon = usePlayerStore((s) => s.unlockWeapon);
  const upgradeWeapon = usePlayerStore((s) => s.upgradeWeapon);
  const upgradeStat = usePlayerStore((s) => s.upgradeStat);

  const [armoryVisible, setArmoryVisible] = useState(false);

  // Compute Rank Title based on score and kills
  const rankScore = (highScore || 0) + (totalKills || 0) * 50;
  let rankTitle = 'Tân Binh Đậu 🌱';
  if (rankScore >= 2000) rankTitle = 'Đậu Đại Tướng 🌟';
  else if (rankScore >= 1000) rankTitle = 'Đậu Tinh Anh ⚡';
  else if (rankScore >= 400) rankTitle = 'Đậu Biệt Kích 🌲';
  else if (rankScore >= 100) rankTitle = 'Chiến Binh Đậu 🛡️';

  const equippedConfig = WEAPONS[selectedWeapon] || WEAPONS.pea_pistol;
  const equippedLevel = weaponLevels[selectedWeapon] || 1;

  const currentHp = 100 + ((stats?.maxHealthLevel || 1) - 1) * 25;
  const currentArmor = 25 + ((stats?.armorLevel || 1) - 1) * 20;
  const currentSpeed = (4.6 + ((stats?.speedLevel || 1) - 1) * 0.3).toFixed(1);

  return (
    <ImageBackground
      source={require('../../assets/game/lawn_bg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.darkOverlay}>
        {/* Top Header Bar */}
        <View style={styles.header}>
          <View style={styles.titleBox}>
            <Text style={styles.titleIcon}>🌱</Text>
            <View>
              <Text style={styles.mainTitle}>PLANTS VS ZOMBIES</Text>
              <Text style={styles.subTitle}>BATTLE ROYALE • CHIẾN TRƯỜNG SINH TỒN</Text>
            </View>
          </View>

          {/* Currencies & Badges */}
          <View style={styles.currencies}>
            <View style={styles.currPill}>
              <Text style={styles.currIcon}>🪙</Text>
              <Text style={styles.currText}>{coins}</Text>
            </View>
            <View style={[styles.currPill, styles.brainPill]}>
              <Text style={styles.currIcon}>🧠</Text>
              <Text style={styles.currText}>{brains}</Text>
            </View>
            <View style={[styles.currPill, styles.rankPill]}>
              <Text style={styles.currIcon}>🏆</Text>
              <Text style={styles.currText}>TOP #1: {topRank}</Text>
            </View>
          </View>
        </View>

        {/* Center Main Stage */}
        <View style={styles.stageLayout}>
          {/* Left Column: Hero Character Showcase */}
          <View style={styles.card}>
            <View style={styles.badgeRow}>
              <Text style={styles.badgeText}>{rankTitle}</Text>
            </View>

            <View style={styles.heroAvatarContainer}>
              <View style={styles.heroAura} />
              <Text style={styles.heroAvatar}>🌱</Text>
            </View>

            <Text style={styles.heroName}>ĐẬU CHIẾN BINH</Text>
            <Text style={styles.heroSub}>Sẵn sàng sinh tồn trong vòng bo</Text>

            {/* Hero Stats */}
            <View style={styles.statList}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>❤️ Máu cơ bản</Text>
                <Text style={styles.statVal}>{currentHp} HP</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>🛡️ Giáp bảo hộ</Text>
                <Text style={styles.statVal}>{currentArmor} Shield</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>⚡ Tốc độ chạy</Text>
                <Text style={styles.statVal}>{currentSpeed}</Text>
              </View>
            </View>
          </View>

          {/* Middle Column: Play Action & Match Info */}
          <View style={styles.centerCard}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.playBtn}
              onPress={onStartGame}
            >
              <Text style={styles.playIcon}>⚔️</Text>
              <Text style={styles.playText}>CHIẾN ĐẤU NGAY</Text>
              <Text style={styles.playSubText}>Vòng Bo 4 Giai Đoạn • 32 Zombie AI</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.armoryBtn}
              onPress={() => setArmoryVisible(true)}
            >
              <Text style={styles.armoryBtnIcon}>🛡️</Text>
              <Text style={styles.armoryBtnText}>KHO VŨ KHÍ & NÂNG CẤP</Text>
            </TouchableOpacity>

            <View style={styles.tipsBox}>
              <Text style={styles.tipsTitle}>💡 MẸO SINH TỒN</Text>
              <Text style={styles.tipsContent}>
                • Giữ nút BẮN để tụ lực bắn Siêu Đậu Mega 💥{'\n'}
                • Phá thùng gỗ để nhặt Túi Máu & Xu 🪙{'\n'}
                • Luôn để ý thời gian vòng bo thu hẹp ⏱️
              </Text>
            </View>
          </View>

          {/* Right Column: Equipped Weapon Showcase */}
          <View style={styles.card}>
            <View style={styles.badgeRow}>
              <Text style={styles.badgeText}>VŨ KHÍ TRANG BỊ</Text>
            </View>

            <View style={styles.weaponAvatarContainer}>
              <Text style={styles.weaponAvatar}>{equippedConfig.emoji}</Text>
            </View>

            <Text style={styles.weaponName}>{equippedConfig.name}</Text>
            <Text style={styles.weaponLevel}>Cấp độ {equippedLevel} ★</Text>

            <View style={styles.statList}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>🎯 Sát thương</Text>
                <Text style={styles.statVal}>{equippedConfig.damage} DMG</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>🔫 Băng đạn</Text>
                <Text style={styles.statVal}>{equippedConfig.magazineSize} viên</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>⏱️ Thời gian nạp</Text>
                <Text style={styles.statVal}>{(equippedConfig.reloadTime / 1000).toFixed(1)}s</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Armory & Upgrade Modal */}
        {armoryVisible && (
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>🛡️ KHO VŨ KHÍ & NÂNG CẤP</Text>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setArmoryVisible(false)}
                >
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {/* 1. Attribute Upgrades Section */}
                <Text style={styles.sectionHeader}>⭐ NÂNG CẤP THUỘC TÍNH CHIẾN BINH</Text>
                <View style={styles.upgradeGrid}>
                  {/* Max HP Upgrade */}
                  <View style={styles.upgradeItem}>
                    <Text style={styles.upgradeName}>❤️ Máu Tối Đa (Cấp {stats.maxHealthLevel}/5)</Text>
                    <Text style={styles.upgradeDesc}>Tăng +25 Máu mỗi cấp</Text>
                    <TouchableOpacity
                      disabled={stats.maxHealthLevel >= 5 || coins < stats.maxHealthLevel * 100}
                      style={[
                        styles.upgradeActionBtn,
                        (stats.maxHealthLevel >= 5 || coins < stats.maxHealthLevel * 100) &&
                          styles.btnDisabled,
                      ]}
                      onPress={() => upgradeStat('maxHealthLevel')}
                    >
                      <Text style={styles.upgradeActionText}>
                        {stats.maxHealthLevel >= 5
                          ? 'TỐI ĐA'
                          : `Nâng: ${stats.maxHealthLevel * 100} 🪙`}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Armor Upgrade */}
                  <View style={styles.upgradeItem}>
                    <Text style={styles.upgradeName}>🛡️ Giáp Phòng Thủ (Cấp {stats.armorLevel}/5)</Text>
                    <Text style={styles.upgradeDesc}>Tăng +20 Giáp mỗi cấp</Text>
                    <TouchableOpacity
                      disabled={stats.armorLevel >= 5 || coins < stats.armorLevel * 100}
                      style={[
                        styles.upgradeActionBtn,
                        (stats.armorLevel >= 5 || coins < stats.armorLevel * 100) &&
                          styles.btnDisabled,
                      ]}
                      onPress={() => upgradeStat('armorLevel')}
                    >
                      <Text style={styles.upgradeActionText}>
                        {stats.armorLevel >= 5
                          ? 'TỐI ĐA'
                          : `Nâng: ${stats.armorLevel * 100} 🪙`}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Speed Upgrade */}
                  <View style={styles.upgradeItem}>
                    <Text style={styles.upgradeName}>⚡ Tốc Độ Di Chuyển (Cấp {stats.speedLevel}/5)</Text>
                    <Text style={styles.upgradeDesc}>Tăng +0.3 Tốc độ</Text>
                    <TouchableOpacity
                      disabled={stats.speedLevel >= 5 || coins < stats.speedLevel * 100}
                      style={[
                        styles.upgradeActionBtn,
                        (stats.speedLevel >= 5 || coins < stats.speedLevel * 100) &&
                          styles.btnDisabled,
                      ]}
                      onPress={() => upgradeStat('speedLevel')}
                    >
                      <Text style={styles.upgradeActionText}>
                        {stats.speedLevel >= 5
                          ? 'TỐI ĐA'
                          : `Nâng: ${stats.speedLevel * 100} 🪙`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 2. Weapon Arsenal Section */}
                <Text style={styles.sectionHeader}>🔫 KHO SÚNG ĐẬU CHIẾN</Text>
                <View style={styles.weaponList}>
                  {Object.keys(WEAPONS).map((wId) => {
                    const w = WEAPONS[wId];
                    const isUnlocked = unlockedWeapons.includes(wId);
                    const isEquipped = selectedWeapon === wId;
                    const lvl = weaponLevels[wId] || 1;
                    const upgradeCost = lvl * 150;

                    return (
                      <View key={wId} style={[styles.weaponCard, isEquipped && styles.weaponCardActive]}>
                        <View style={styles.weaponCardLeft}>
                          <Text style={styles.weaponItemEmoji}>{w.emoji}</Text>
                          <View>
                            <Text style={styles.weaponItemName}>{w.name}</Text>
                            <Text style={styles.weaponItemDesc}>{w.desc}</Text>
                            <Text style={styles.weaponItemStats}>
                              DMG: {w.damage} • Băng đạn: {w.magazineSize}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.weaponCardRight}>
                          {isUnlocked ? (
                            <>
                              <TouchableOpacity
                                style={[styles.selectBtn, isEquipped && styles.selectBtnActive]}
                                onPress={() => selectWeapon(wId)}
                              >
                                <Text style={styles.selectBtnText}>
                                  {isEquipped ? 'ĐANG DÙNG' : 'CHỌN'}
                                </Text>
                              </TouchableOpacity>

                              {lvl < 5 && (
                                <TouchableOpacity
                                  disabled={coins < upgradeCost}
                                  style={[
                                    styles.weaponUpgradeBtn,
                                    coins < upgradeCost && styles.btnDisabled,
                                  ]}
                                  onPress={() => upgradeWeapon(wId)}
                                >
                                  <Text style={styles.weaponUpgradeText}>
                                    ★ Cấp {lvl + 1} ({upgradeCost} 🪙)
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </>
                          ) : (
                            <TouchableOpacity
                              disabled={coins < w.cost}
                              style={[
                                styles.unlockBtn,
                                coins < w.cost && styles.btnDisabled,
                              ]}
                              onPress={() => unlockWeapon(wId)}
                            >
                              <Text style={styles.unlockBtnText}>MỞ KHÓA ({w.cost} 🪙)</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 15, 5, 0.88)',
    paddingHorizontal: 54,
    paddingTop: 12,
    paddingBottom: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(76, 175, 80, 0.3)',
    paddingBottom: 10,
  },
  titleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleIcon: {
    fontSize: 28,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#a5d6a7',
    letterSpacing: 1.5,
  },
  subTitle: {
    fontSize: 10,
    color: '#81c784',
    fontWeight: '700',
  },
  currencies: {
    flexDirection: 'row',
    gap: 10,
    marginRight: 44,
  },
  currPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 64, 0.5)',
    gap: 6,
  },
  brainPill: {
    borderColor: 'rgba(244, 143, 177, 0.5)',
  },
  rankPill: {
    borderColor: 'rgba(100, 181, 246, 0.5)',
  },
  currIcon: {
    fontSize: 14,
  },
  currText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  stageLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  card: {
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(15, 25, 15, 0.75)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(76, 175, 80, 0.35)',
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerCard: {
    flex: 1.2,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  badgeRow: {
    backgroundColor: 'rgba(46, 125, 50, 0.6)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  badgeText: {
    color: '#e8f5e9',
    fontSize: 11,
    fontWeight: 'bold',
  },
  heroAvatarContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  heroAura: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    backgroundColor: 'rgba(76, 175, 80, 0.25)',
    borderWidth: 1.5,
    borderColor: '#81c784',
  },
  heroAvatar: {
    fontSize: 42,
  },
  heroName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
  },
  heroSub: {
    fontSize: 10,
    color: '#a5d6a7',
    marginBottom: 6,
  },
  weaponAvatarContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  weaponAvatar: {
    fontSize: 42,
  },
  weaponName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffd54f',
  },
  weaponLevel: {
    fontSize: 11,
    color: '#ffe082',
    fontWeight: 'bold',
  },
  statList: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 10,
    padding: 8,
    gap: 4,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 11,
    color: '#bdbdbd',
  },
  statVal: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  playBtn: {
    width: '100%',
    backgroundColor: '#2e7d32',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#81c784',
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  playIcon: {
    fontSize: 28,
  },
  playText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
    marginTop: 2,
  },
  playSubText: {
    fontSize: 10,
    color: '#c8e6c9',
    fontWeight: '600',
    marginTop: 2,
  },
  armoryBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 179, 0, 0.85)',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ffe082',
    gap: 8,
  },
  armoryBtnIcon: {
    fontSize: 18,
  },
  armoryBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1a1a1a',
  },
  tipsBox: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tipsTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffd54f',
    marginBottom: 2,
  },
  tipsContent: {
    fontSize: 10,
    color: '#b0bec5',
    lineHeight: 14,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 9999,
  },
  modalCard: {
    width: '92%',
    maxWidth: 700,
    height: '90%',
    backgroundColor: '#1b261b',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4caf50',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    paddingBottom: 10,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#81c784',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBody: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffd54f',
    marginVertical: 8,
  },
  upgradeGrid: {
    gap: 8,
    marginBottom: 16,
  },
  upgradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  upgradeName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  upgradeDesc: {
    fontSize: 10,
    color: '#9e9e9e',
    marginTop: 2,
  },
  upgradeActionBtn: {
    backgroundColor: '#388e3c',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  upgradeActionText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  weaponList: {
    gap: 8,
    paddingBottom: 20,
  },
  weaponCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  weaponCardActive: {
    borderColor: '#ffd54f',
    backgroundColor: 'rgba(46, 125, 50, 0.25)',
  },
  weaponCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  weaponItemEmoji: {
    fontSize: 28,
  },
  weaponItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  weaponItemDesc: {
    fontSize: 10,
    color: '#bdbdbd',
  },
  weaponItemStats: {
    fontSize: 10,
    color: '#81c784',
    marginTop: 2,
  },
  weaponCardRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  selectBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  selectBtnActive: {
    backgroundColor: '#43a047',
  },
  selectBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  weaponUpgradeBtn: {
    backgroundColor: '#f57c00',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  weaponUpgradeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  unlockBtn: {
    backgroundColor: '#d32f2f',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  unlockBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  btnDisabled: {
    opacity: 0.4,
  },
});
