import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

export const SurvivalResultModal = ({
  visible,
  isVictory,
  kills = 0,
  rank = 1,
  coins = 0,
  brains = 0,
  score = 0,
  onRestart,
  onHome,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
        <View style={[styles.modalCard, isVictory ? styles.cardVictory : styles.cardDefeat]}>
          {/* Header Banner */}
          <Text style={styles.headerIcon}>{isVictory ? '🏆' : '💀'}</Text>
          <Text style={[styles.headerTitle, isVictory ? styles.textVictory : styles.textDefeat]}>
            {isVictory ? 'TOP #1 CHIẾN THẮNG!' : 'BẠN ĐÃ BỊ HẠ GỤC'}
          </Text>
          <Text style={styles.subTitle}>
            {isVictory
              ? 'Chiến binh Đậu đã quét sạch toàn bộ Zombie và thống trị bãi cỏ!'
              : 'Hãy nâng cấp vũ khí, gia tăng Giáp và thử lại nhé!'}
          </Text>

          {/* Match Stats Summary */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>Thứ Hạng</Text>
              <Text style={styles.statBoxVal}>#{rank} / 33</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>Hạ Gục</Text>
              <Text style={styles.statBoxVal}>{kills} Zombie</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>Xu Nhận</Text>
              <Text style={styles.statBoxValYellow}>+{coins} 🪙</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>Não Nhận</Text>
              <Text style={styles.statBoxValPink}>+{brains} 🧠</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.btn, styles.btnPrimary]}
              onPress={onRestart}
            >
              <Text style={styles.btnPrimaryText}>CHƠI LẠI NGAY ⚔️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.btn, styles.btnSecondary]}
              onPress={onHome}
            >
              <Text style={styles.btnSecondaryText}>VỀ PHÒNG CHỜ 🏠</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 9999,
  },
  modalCard: {
    width: '90%',
    maxWidth: 580,
    backgroundColor: '#1b241b',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2.5,
  },
  cardVictory: {
    borderColor: '#ffd54f',
    shadowColor: '#ffd54f',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  cardDefeat: {
    borderColor: '#ef5350',
    shadowColor: '#d32f2f',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  headerIcon: {
    fontSize: 28,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },
  textVictory: {
    color: '#ffd54f',
  },
  textDefeat: {
    color: '#ff5252',
  },
  subTitle: {
    fontSize: 11,
    color: '#bdbdbd',
    textAlign: 'center',
    marginVertical: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  statBoxLabel: {
    fontSize: 10,
    color: '#9e9e9e',
    fontWeight: '600',
  },
  statBoxVal: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    marginTop: 2,
  },
  statBoxValYellow: {
    fontSize: 14,
    color: '#ffd54f',
    fontWeight: 'bold',
    marginTop: 2,
  },
  statBoxValPink: {
    fontSize: 14,
    color: '#f48fb1',
    fontWeight: 'bold',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 4,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: '#43a047',
    borderWidth: 2,
    borderColor: '#81c784',
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  btnSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  btnSecondaryText: {
    color: '#e0e0e0',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
