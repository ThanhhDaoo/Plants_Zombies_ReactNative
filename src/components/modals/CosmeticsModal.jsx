import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { usePlayerStore, SKINS_CONFIG, PETS_CONFIG } from '../../store/usePlayerStore';

export const CosmeticsModal = ({ visible, onClose }) => {
  const coins = usePlayerStore((s) => s.coins);
  const selectedSkin = usePlayerStore((s) => s.selectedSkin);
  const unlockedSkins = usePlayerStore((s) => s.unlockedSkins);
  const selectSkin = usePlayerStore((s) => s.selectSkin);
  const unlockSkin = usePlayerStore((s) => s.unlockSkin);

  const selectedPet = usePlayerStore((s) => s.selectedPet);
  const unlockedPets = usePlayerStore((s) => s.unlockedPets);
  const selectPet = usePlayerStore((s) => s.selectPet);
  const unlockPet = usePlayerStore((s) => s.unlockPet);

  const [activeTab, setActiveTab] = useState('skins'); // 'skins' | 'pets'

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerIcon}>✨</Text>
            <View>
              <Text style={styles.headerTitle}>NGOẠI TRANG & TRỢ THỦ</Text>
              <Text style={styles.headerSub}>Tùy biến skin nhân vật & thú cưng đồng hành trong trận</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'skins' && styles.activeTabBtn]}
            onPress={() => setActiveTab('skins')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'skins' && styles.activeTabText]}>
              👕 NGOẠI TRANG CHIẾN BINH ({unlockedSkins.length}/{Object.keys(SKINS_CONFIG).length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'pets' && styles.activeTabBtn]}
            onPress={() => setActiveTab('pets')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'pets' && styles.activeTabText]}>
              🐾 THÚ CƯNG ĐỒNG HÀNH ({unlockedPets.length}/{Object.keys(PETS_CONFIG).length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Body */}
        <ScrollView style={styles.bodyScroll} showsVerticalScrollIndicator={false}>
          {activeTab === 'skins' ? (
            <View style={styles.grid}>
              {Object.values(SKINS_CONFIG).map((skin) => {
                const isUnlocked = unlockedSkins.includes(skin.id);
                const isEquipped = selectedSkin === skin.id;
                const canAfford = coins >= skin.cost;

                return (
                  <View
                    key={skin.id}
                    style={[
                      styles.card,
                      isEquipped && styles.cardEquipped,
                    ]}
                  >
                    <View style={styles.cardHeader}>
                      <View style={styles.avatarCircle}>
                        <Text style={styles.avatarEmoji}>{skin.emoji}</Text>
                      </View>
                      <View style={styles.cardTitleBox}>
                        <Text style={styles.itemName}>{skin.name}</Text>
                        <Text style={styles.itemDesc}>{skin.desc}</Text>
                      </View>
                    </View>

                    <View style={styles.cardFooter}>
                      {isEquipped ? (
                        <View style={styles.equippedBadge}>
                          <Text style={styles.equippedText}>✓ ĐANG DÙNG</Text>
                        </View>
                      ) : isUnlocked ? (
                        <TouchableOpacity
                          style={styles.equipBtn}
                          onPress={() => selectSkin(skin.id)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.equipBtnText}>TRANG BỊ</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[styles.buyBtn, !canAfford && styles.btnDisabled]}
                          onPress={() => unlockSkin(skin.id)}
                          disabled={!canAfford}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.buyBtnText}>MỞ KHÓA: {skin.cost} 🪙</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.grid}>
              {Object.values(PETS_CONFIG).map((pet) => {
                const isUnlocked = unlockedPets.includes(pet.id);
                const isEquipped = selectedPet === pet.id;
                const canAfford = coins >= pet.cost;

                return (
                  <View
                    key={pet.id}
                    style={[
                      styles.card,
                      isEquipped && styles.cardEquipped,
                    ]}
                  >
                    <View style={styles.cardHeader}>
                      <View style={[styles.avatarCircle, styles.petCircle]}>
                        <Text style={styles.avatarEmoji}>{pet.emoji}</Text>
                      </View>
                      <View style={styles.cardTitleBox}>
                        <Text style={styles.itemName}>{pet.name}</Text>
                        <Text style={styles.itemDesc}>{pet.desc}</Text>
                      </View>
                    </View>

                    <View style={styles.cardFooter}>
                      {isEquipped ? (
                        <TouchableOpacity
                          style={styles.unequipBtn}
                          onPress={() => selectPet(null)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.unequipBtnText}>✓ ĐANG DÙNG (BỎ CHỌN)</Text>
                        </TouchableOpacity>
                      ) : isUnlocked ? (
                        <TouchableOpacity
                          style={styles.equipBtn}
                          onPress={() => selectPet(pet.id)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.equipBtnText}>ĐỒNG HÀNH</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[styles.buyBtn, !canAfford && styles.btnDisabled]}
                          onPress={() => unlockPet(pet.id)}
                          disabled={!canAfford}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.buyBtnText}>MỞ KHÓA: {pet.cost} 🪙</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 10, 20, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  container: {
    width: '100%',
    maxHeight: '94%',
    backgroundColor: '#131e33',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#3f51b5',
    padding: 16,
    shadowColor: '#3f51b5',
    shadowOpacity: 0.45,
    shadowRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(63, 81, 181, 0.3)',
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
    color: '#e8eaf6',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerSub: {
    color: '#9fa8da',
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
  tabBar: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeTabBtn: {
    backgroundColor: '#3949ab',
    borderColor: '#7986cb',
  },
  tabText: {
    color: '#9fa8da',
    fontSize: 11,
    fontWeight: '700',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '900',
  },
  bodyScroll: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  card: {
    width: '48.5%',
    backgroundColor: 'rgba(20, 30, 50, 0.7)',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(63, 81, 181, 0.3)',
    justifyContent: 'space-between',
  },
  cardEquipped: {
    borderColor: '#4caf50',
    backgroundColor: 'rgba(46, 125, 50, 0.25)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(63, 81, 181, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5c6bc0',
  },
  petCircle: {
    backgroundColor: 'rgba(255, 179, 0, 0.25)',
    borderColor: '#ffb300',
  },
  avatarEmoji: {
    fontSize: 22,
  },
  cardTitleBox: {
    flex: 1,
  },
  itemName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  itemDesc: {
    color: '#90caf9',
    fontSize: 10,
    marginTop: 2,
    lineHeight: 14,
  },
  cardFooter: {
    marginTop: 4,
  },
  equippedBadge: {
    backgroundColor: '#388e3c',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  equippedText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  equipBtn: {
    backgroundColor: '#1e88e5',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  equipBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  unequipBtn: {
    backgroundColor: '#558b2f',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  unequipBtnText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  buyBtn: {
    backgroundColor: '#ff9800',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  btnDisabled: {
    backgroundColor: '#424242',
    opacity: 0.6,
  },
});
