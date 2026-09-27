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
import { useApp } from '../context/AppContext';
import { Player } from '../types';

interface PlayerDetailModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenSellModal: (player: Player) => void;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({
  visible,
  onClose,
  onOpenSellModal,
}) => {
  const { selectedPlayer, club, setLineupPlayer } = useApp();

  if (!selectedPlayer) return null;

  const isStarting = club.lineup.includes(selectedPlayer.id);
  const xpPercentage = Math.min(100, Math.round((selectedPlayer.xp / selectedPlayer.xpMax) * 100));

  const stats = [
    { label: 'Velocidade', value: selectedPlayer.stats.velocidade, color: '#00E676' },
    { label: 'Passe', value: selectedPlayer.stats.passe, color: '#00B0FF' },
    { label: 'Finalização', value: selectedPlayer.stats.finalizacao, color: '#FFD700' },
    { label: 'Defesa', value: selectedPlayer.stats.defesa, color: '#BA68C8' },
    { label: 'Físico', value: selectedPlayer.stats.fisico, color: '#FF7043' },
  ];

  const handleEscalar = () => {
    // If not starting, insert into lineup (first available slot or slot matching position)
    if (!isStarting) {
      setLineupPlayer(0, selectedPlayer.id);
    }
    onClose();
  };

  const handleSellPress = () => {
    onClose();
    onOpenSellModal(selectedPlayer);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>
                  #{selectedPlayer.number < 10 ? `0${selectedPlayer.number}` : selectedPlayer.number}
                </Text>
              </View>
              <View>
                <Text style={styles.playerName}>{selectedPlayer.name}</Text>
                <View style={styles.badgeRow}>
                  <View style={styles.positionBadge}>
                    <Text style={styles.positionText}>{selectedPlayer.position}</Text>
                  </View>
                  <Text style={styles.levelText}>Nível {selectedPlayer.level}</Text>
                  {isStarting && (
                    <View style={styles.titularBadge}>
                      <Text style={styles.titularBadgeText}>TITULAR</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={24} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* XP Progression Section */}
            <View style={styles.xpCard}>
              <View style={styles.xpHeader}>
                <Text style={styles.xpLabel}>PROGRESSO DE EXPERIÊNCIA (XP)</Text>
                <Text style={styles.xpValue}>
                  {selectedPlayer.xp} / {selectedPlayer.xpMax} XP ({xpPercentage}%)
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${xpPercentage}%` }]} />
              </View>
              <Text style={styles.xpHint}>
                Assista a vídeos na aba Vídeos para adicionar +25 XP e subir de nível.
              </Text>
            </View>

            {/* Stats Breakdown */}
            <Text style={styles.statsTitle}>ATRIBUTOS DO ATLETA</Text>
            <View style={styles.statsContainer}>
              {stats.map(s => (
                <View key={s.label} style={styles.statRow}>
                  <Text style={styles.statLabel}>{s.label}</Text>
                  <View style={styles.statBarWrapper}>
                    <View style={styles.statBarBg}>
                      <View style={[styles.statBarFill, { width: `${s.value}%`, backgroundColor: s.color }]} />
                    </View>
                  </View>
                  <Text style={[styles.statNumber, { color: s.color }]}>{s.value}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footerButtons}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.btnEscalar, isStarting && styles.btnEscalarActive]}
              onPress={handleEscalar}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isStarting ? 'checkmark-circle' : 'shirt-outline'}
                size={18}
                color={isStarting ? '#000' : THEME.colors.primary}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.btnText, isStarting && styles.btnTextEscalarActive]}>
                {isStarting ? 'ESCALADO NO TIME' : 'ESCALAR'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.btnVender]}
              onPress={handleSellPress}
              activeOpacity={0.8}
            >
              <Ionicons name="pricetag-outline" size={18} color={THEME.colors.gold} style={{ marginRight: 6 }} />
              <Text style={[styles.btnText, { color: THEME.colors.gold }]}>
                {selectedPlayer.isListed ? 'VER ANÚNCIO' : 'COLOCAR À VENDA'}
              </Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    padding: THEME.spacing.lg,
  },
  modalCard: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: THEME.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  numberBadge: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: THEME.colors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: THEME.colors.borderLight,
  },
  numberText: {
    color: THEME.colors.gold,
    fontSize: 16,
    fontWeight: '900',
  },
  playerName: {
    color: THEME.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  positionBadge: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
  },
  positionText: {
    color: THEME.colors.primary,
    fontSize: 10,
    fontWeight: '900',
  },
  levelText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  titularBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  titularBadgeText: {
    color: THEME.colors.gold,
    fontSize: 9,
    fontWeight: '900',
  },
  closeBtn: {
    padding: 6,
  },
  body: {
    padding: THEME.spacing.lg,
  },
  xpCard: {
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.lg,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  xpLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  xpValue: {
    color: THEME.colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: THEME.colors.primary,
    borderRadius: 5,
  },
  xpHint: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    marginTop: 6,
  },
  statsTitle: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  statsContainer: {
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  statLabel: {
    width: 90,
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  statBarWrapper: {
    flex: 1,
    marginHorizontal: 10,
  },
  statBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statNumber: {
    width: 28,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '900',
  },
  footerButtons: {
    flexDirection: 'row',
    padding: THEME.spacing.md,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    backgroundColor: THEME.colors.cardElevated,
  },
  actionBtn: {
    flex: 1,
    height: 46,
    borderRadius: THEME.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  btnEscalar: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
  },
  btnEscalarActive: {
    backgroundColor: THEME.colors.primary,
  },
  btnVender: {
    borderColor: THEME.colors.gold,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  btnText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  btnTextEscalarActive: {
    color: '#000000',
  },
});
