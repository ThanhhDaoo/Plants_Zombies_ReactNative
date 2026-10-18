import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const PerkSelectionModal = ({ visible, perks = [], level = 1, onSelectPerk, onCloseLater }) => {
  if (!visible || !perks || perks.length === 0) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.cardContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerIcon}>⭐</Text>
            <Text style={styles.headerTitle}>THĂNG CẤP CHIẾN BINH!</Text>
            {onCloseLater && (
              <TouchableOpacity style={styles.closeLaterBtn} onPress={onCloseLater}>
                <Text style={styles.closeLaterTxt}>✕ Chọn sau</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.headerSub}>Chọn 1 trong 3 Đột Biến Roguelike để cường hóa sức mạnh:</Text>
        </View>

        {/* 3 Perk Cards Row */}
        <View style={styles.perkRow}>
          {perks.map((perk) => {
            const isEpic = perk.rarity === 'epic';
            const isRare = perk.rarity === 'rare';

            let borderColor = '#81c784';
            let badgeText = 'THƯỜNG';
            let badgeBg = 'rgba(76, 175, 80, 0.4)';

            if (isEpic) {
              borderColor = '#ff9100';
              badgeText = 'SỬ THI ★★★';
              badgeBg = 'rgba(255, 145, 0, 0.4)';
            } else if (isRare) {
              borderColor = '#00e5ff';
              badgeText = 'HIẾM ★★';
              badgeBg = 'rgba(0, 229, 255, 0.35)';
            }

            return (
              <TouchableOpacity
                key={perk.id}
                activeOpacity={0.8}
                style={[
                  styles.perkCard,
                  { borderColor },
                  isEpic && styles.cardEpicGlow,
                  isRare && styles.cardRareGlow,
                ]}
                onPress={() => onSelectPerk(perk)}
              >
                {/* Rarity Pill */}
                <View style={[styles.rarityPill, { backgroundColor: badgeBg }]}>
                  <Text style={[styles.rarityText, { color: borderColor }]}>{badgeText}</Text>
                </View>

                {/* Emoji Avatar */}
                <View style={styles.perkEmojiContainer}>
                  <Text style={styles.perkEmoji}>{perk.emoji}</Text>
                </View>

                {/* Name */}
                <Text style={styles.perkName}>{perk.name}</Text>

                {/* Description */}
                <Text style={styles.perkDesc}>{perk.desc}</Text>

                {/* Select Button Indicator */}
                <View style={[styles.selectBtn, { backgroundColor: borderColor }]}>
                  <Text style={styles.selectBtnText}>CHỌN ĐỘT BIẾN</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 15, 5, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
    zIndex: 9999,
    elevation: 9999,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 680,
    alignItems: 'center',
    elevation: 10000,
  },
  header: {
    alignItems: 'center',
    marginBottom: 14,
    width: '100%',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  headerIcon: {
    fontSize: 26,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffd54f',
    letterSpacing: 1.5,
  },
  closeLaterBtn: {
    position: 'absolute',
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  closeLaterTxt: {
    color: '#e0e0e0',
    fontSize: 12,
    fontWeight: '700',
  },
  headerSub: {
    fontSize: 11,
    color: '#a5d6a7',
    fontWeight: '600',
    marginTop: 2,
  },
  perkRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  perkCard: {
    flex: 1,
    backgroundColor: '#1b261b',
    borderRadius: 14,
    borderWidth: 2,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 180,
  },
  cardEpicGlow: {
    shadowColor: '#ff9100',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 6,
  },
  cardRareGlow: {
    shadowColor: '#00e5ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  rarityPill: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 6,
  },
  rarityText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  perkEmojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  perkEmoji: {
    fontSize: 26,
  },
  perkName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  perkDesc: {
    fontSize: 10,
    color: '#b0bec5',
    textAlign: 'center',
    lineHeight: 13,
    marginBottom: 10,
    flex: 1,
  },
  selectBtn: {
    width: '100%',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectBtnText: {
    color: '#111111',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
