import React, { useState } from 'react';
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
import { CupMatch } from '../types';

interface CopaCampeõesModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CopaCampeõesModal: React.FC<CopaCampeõesModalProps> = ({ visible, onClose }) => {
  const { cupMatches, club } = useApp();
  const [selectedStage, setSelectedStage] = useState<'oitavas' | 'quartas' | 'semifinal' | 'final'>('quartas');

  const matchesForStage = cupMatches.filter(m => m.stage === selectedStage);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>🏆 COPA DOS CAMPEÕES SFV</Text>
              <Text style={styles.subtitle}>Mata-mata dos 16 melhores clubes do Brasil (1º e 2º de cada divisão)</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Stage Tabs (Oitavas, Quartas, Semifinal, Final) */}
          <View style={styles.stageTabs}>
            {(['oitavas', 'quartas', 'semifinal', 'final'] as const).map(stage => {
              const label =
                stage === 'oitavas'
                  ? 'Oitavas (16)'
                  : stage === 'quartas'
                  ? 'Quartas (8)'
                  : stage === 'semifinal'
                  ? 'Semifinais (4)'
                  : 'Grande Final';
              const isSelected = selectedStage === stage;

              return (
                <TouchableOpacity
                  key={stage}
                  style={[styles.stageTab, isSelected && styles.stageTabActive]}
                  onPress={() => setSelectedStage(stage)}
                >
                  <Text style={[styles.stageTabText, isSelected && styles.stageTabTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Match Cards List */}
          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
            {matchesForStage.map((match: CupMatch) => {
              const hasUserA = match.teamA.includes(club.name);
              const hasUserB = match.teamB.includes(club.name);
              const hasUser = hasUserA || hasUserB;

              return (
                <View
                  key={match.id}
                  style={[
                    styles.matchBracketCard,
                    hasUser && styles.matchBracketCardUser,
                  ]}
                >
                  <View style={styles.bracketCardHeader}>
                    <Text style={styles.bracketRoundName}>{match.roundName}</Text>
                    <View style={styles.winnerBadge}>
                      <Text style={styles.winnerText}>Vencedor: {match.winner}</Text>
                    </View>
                  </View>

                  {/* Team A */}
                  <View style={[styles.teamRow, hasUserA && styles.teamRowUser]}>
                    <Text style={[styles.teamName, hasUserA && styles.teamNameUser]} numberOfLines={1}>
                      {match.teamA}
                    </Text>
                    <Text style={[styles.teamScore, match.scoreA > match.scoreB && styles.teamScoreWinner]}>
                      {match.scoreA}
                    </Text>
                  </View>

                  <View style={styles.matchDivider} />

                  {/* Team B */}
                  <View style={[styles.teamRow, hasUserB && styles.teamRowUser]}>
                    <Text style={[styles.teamName, hasUserB && styles.teamNameUser]} numberOfLines={1}>
                      {match.teamB}
                    </Text>
                    <Text style={[styles.teamScore, match.scoreB > match.scoreA && styles.teamScoreWinner]}>
                      {match.scoreB}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.closeBtnFooter} onPress={onClose}>
              <Text style={styles.closeBtnFooterText}>VOLTAR</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    justifyContent: 'center',
    padding: THEME.spacing.md,
  },
  card: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    maxHeight: '90%',
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
    fontSize: 14,
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
  stageTabs: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.cardElevated,
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  stageTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: THEME.radius.sm,
  },
  stageTabActive: {
    backgroundColor: THEME.colors.primary,
  },
  stageTabText: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
  },
  stageTabTextActive: {
    color: '#000000',
    fontWeight: '900',
  },
  body: {
    maxHeight: 460,
  },
  bodyContent: {
    padding: THEME.spacing.md,
    gap: 10,
  },
  matchBracketCard: {
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  matchBracketCardUser: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
  },
  bracketCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bracketRoundName: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
  },
  winnerBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  winnerText: {
    color: THEME.colors.gold,
    fontSize: 9,
    fontWeight: '800',
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  teamRowUser: {},
  teamName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  teamNameUser: {
    color: THEME.colors.primary,
    fontWeight: '900',
  },
  teamScore: {
    color: THEME.colors.textSecondary,
    fontSize: 14,
    fontWeight: '800',
    minWidth: 24,
    textAlign: 'right',
  },
  teamScoreWinner: {
    color: THEME.colors.gold,
    fontWeight: '900',
  },
  matchDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 4,
  },
  footer: {
    padding: THEME.spacing.md,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  closeBtnFooter: {
    backgroundColor: THEME.colors.cardElevated,
    height: 42,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnFooterText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
