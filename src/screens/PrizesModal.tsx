import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { PRIZES_TABLE } from '../data/mockData';

interface PrizesModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PrizesModal: React.FC<PrizesModalProps> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>PREMIAÇÕES OFICIAIS DAS DIVISÕES</Text>
              <Text style={styles.subtitle}>Valores pagos em Super Virtual (SV) no fim da temporada</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(divNum => {
              const prize = PRIZES_TABLE[divNum];
              const isCurrentDiv = divNum === 4;

              return (
                <View
                  key={divNum}
                  style={[
                    styles.divPrizeCard,
                    isCurrentDiv && styles.divPrizeCardCurrent,
                  ]}
                >
                  <View style={styles.divPrizeHeader}>
                    <Text
                      style={[
                        styles.divPrizeTitle,
                        isCurrentDiv && { color: THEME.colors.primary },
                      ]}
                    >
                      {divNum}ª DIVISÃO
                    </Text>
                    {isCurrentDiv && (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentBadgeText}>SUA DIVISÃO</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.podiumRow}>
                    <View style={styles.podiumItem}>
                      <View style={[styles.medal, { backgroundColor: '#FFD700' }]}>
                        <Text style={styles.medalText}>1º</Text>
                      </View>
                      <Text style={styles.prizeVal}>{prize[1]} SV</Text>
                      <Text style={styles.prizeRankLabel}>Campeão</Text>
                    </View>

                    <View style={styles.podiumItem}>
                      <View style={[styles.medal, { backgroundColor: '#C0C0C0' }]}>
                        <Text style={styles.medalText}>2º</Text>
                      </View>
                      <Text style={styles.prizeVal}>{prize[2]} SV</Text>
                      <Text style={styles.prizeRankLabel}>Vice</Text>
                    </View>

                    <View style={styles.podiumItem}>
                      <View style={[styles.medal, { backgroundColor: '#CD7F32' }]}>
                        <Text style={styles.medalText}>3º</Text>
                      </View>
                      <Text style={styles.prizeVal}>{prize[3]} SV</Text>
                      <Text style={styles.prizeRankLabel}>3º Lugar</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.closeActionBtn} onPress={onClose}>
              <Text style={styles.closeActionBtnText}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    padding: THEME.spacing.md,
  },
  card: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: THEME.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  title: {
    color: THEME.colors.gold,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: THEME.spacing.md,
  },
  divPrizeCard: {
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.md,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  divPrizeCardCurrent: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
  },
  divPrizeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  divPrizeTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  currentBadge: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currentBadgeText: {
    color: '#000000',
    fontSize: 8,
    fontWeight: '900',
  },
  podiumRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  podiumItem: {
    alignItems: 'center',
    flex: 1,
  },
  medal: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  medalText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '900',
  },
  prizeVal: {
    color: THEME.colors.gold,
    fontSize: 13,
    fontWeight: '900',
  },
  prizeRankLabel: {
    color: THEME.colors.textMuted,
    fontSize: 9,
    marginTop: 1,
  },
  footer: {
    padding: THEME.spacing.md,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  closeActionBtn: {
    backgroundColor: THEME.colors.cardElevated,
    height: 44,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  closeActionBtnText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
