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
import { MatchResult } from '../types';

interface MatchResultModalProps {
  visible: boolean;
  result: MatchResult | null;
  onContinue: () => void;
}

export const MatchResultModal: React.FC<MatchResultModalProps> = ({
  visible,
  result,
  onContinue,
}) => {
  const { club } = useApp();

  if (!result) return null;

  const isWin = result.userScore > result.opponentScore;
  const isDraw = result.userScore === result.opponentScore;

  const outcomeTitle = isWin ? 'VITÓRIA HISTÓRICA!' : isDraw ? 'EMPATE DISPUTADO' : 'DERROTA COM HONRA';
  const outcomeColor = isWin ? THEME.colors.primary : isDraw ? THEME.colors.gold : THEME.colors.textSecondary;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header Banner */}
          <View style={[styles.headerBanner, { borderColor: outcomeColor }]}>
            <Ionicons
              name={isWin ? 'trophy' : isDraw ? 'shield' : 'football'}
              size={24}
              color={outcomeColor}
            />
            <Text style={[styles.outcomeText, { color: outcomeColor }]}>{outcomeTitle}</Text>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Scoreboard Result */}
            <View style={styles.scoreRow}>
              <View style={styles.clubCol}>
                <Text style={styles.clubName} numberOfLines={1}>
                  {club.name}
                </Text>
                <Text style={styles.scoreNumber}>{result.userScore}</Text>
              </View>

              <Text style={styles.scoreDivider}>X</Text>

              <View style={styles.clubCol}>
                <Text style={styles.clubName} numberOfLines={1}>
                  {result.opponentName}
                </Text>
                <Text style={styles.scoreNumber}>{result.opponentScore}</Text>
              </View>
            </View>

            {/* RECOMPENSAS EM SV */}
            <View style={styles.rewardsSection}>
              <View style={styles.rewardsHeader}>
                <Ionicons name="sparkles" size={16} color={THEME.colors.gold} />
                <Text style={styles.rewardsTitle}>EXTRATO DE RECOMPENSAS SV</Text>
              </View>

              <View style={styles.rewardLine}>
                <Text style={styles.rewardLabel}>
                  {result.rewards.goalsUser} {result.rewards.goalsUser === 1 ? 'gol marcado' : 'gols marcados'} (+1 SV cada)
                </Text>
                <Text style={styles.rewardValuePos}>+{result.rewards.goalSV} SV</Text>
              </View>

              <View style={styles.rewardLine}>
                <Text style={styles.rewardLabel}>{result.rewards.resultText}</Text>
                <Text style={styles.rewardValuePos}>+{result.rewards.resultSV} SV</Text>
              </View>

              {result.rewards.yellowCount > 0 && (
                <View style={styles.rewardLine}>
                  <Text style={styles.rewardLabel}>
                    {result.rewards.yellowCount} {result.rewards.yellowCount === 1 ? 'cartão amarelo' : 'cartões amarelos'} (-1 SV)
                  </Text>
                  <Text style={styles.rewardValueNeg}>-{result.rewards.yellowPenaltySV} SV</Text>
                </View>
              )}

              {result.rewards.redCount > 0 && (
                <View style={styles.rewardLine}>
                  <Text style={styles.rewardLabel}>
                    {result.rewards.redCount} {result.rewards.redCount === 1 ? 'cartão vermelho' : 'cartões vermelhos'} (-2 SV)
                  </Text>
                  <Text style={styles.rewardValueNeg}>-{result.rewards.redPenaltySV} SV</Text>
                </View>
              )}

              <View style={styles.rewardTotalDivider} />

              <View style={styles.rewardTotalRow}>
                <Text style={styles.rewardTotalLabel}>SALDO DA PARTIDA</Text>
                <Text style={styles.rewardTotalValue}>+{result.rewards.totalSV} SV</Text>
              </View>
            </View>

            {/* ESTATÍSTICAS DA PARTIDA */}
            <View style={styles.statsSection}>
              <Text style={styles.statsHeader}>ESTATÍSTICAS DA PARTIDA</Text>

              {/* Posse de Bola */}
              <View style={styles.statItem}>
                <View style={styles.statValuesRow}>
                  <Text style={styles.statValLeft}>{result.stats.posseUser}%</Text>
                  <Text style={styles.statName}>Posse de Bola</Text>
                  <Text style={styles.statValRight}>{result.stats.posseOpp}%</Text>
                </View>
                <View style={styles.barContainer}>
                  <View style={[styles.barLeft, { width: `${result.stats.posseUser}%` }]} />
                  <View style={[styles.barRight, { width: `${result.stats.posseOpp}%` }]} />
                </View>
              </View>

              {/* Finalizações */}
              <View style={styles.statItem}>
                <View style={styles.statValuesRow}>
                  <Text style={styles.statValLeft}>{result.stats.finalizacoesUser}</Text>
                  <Text style={styles.statName}>Finalizações</Text>
                  <Text style={styles.statValRight}>{result.stats.finalizacoesOpp}</Text>
                </View>
              </View>

              {/* Finalizações no Gol */}
              <View style={styles.statItem}>
                <View style={styles.statValuesRow}>
                  <Text style={styles.statValLeft}>{result.stats.noGolUser}</Text>
                  <Text style={styles.statName}>No Gol</Text>
                  <Text style={styles.statValRight}>{result.stats.noGolOpp}</Text>
                </View>
              </View>

              {/* Faltas */}
              <View style={styles.statItem}>
                <View style={styles.statValuesRow}>
                  <Text style={styles.statValLeft}>{result.stats.faltasUser}</Text>
                  <Text style={styles.statName}>Faltas Cometidas</Text>
                  <Text style={styles.statValRight}>{result.stats.faltasOpp}</Text>
                </View>
              </View>

              {/* Cartões */}
              <View style={styles.statItem}>
                <View style={styles.statValuesRow}>
                  <Text style={styles.statValLeft}>{result.stats.cartoesUser}</Text>
                  <Text style={styles.statName}>Cartões</Text>
                  <Text style={styles.statValRight}>{result.stats.cartoesOpp}</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Button: Continuar */}
          <TouchableOpacity style={styles.continueButton} onPress={onContinue} activeOpacity={0.85}>
            <Text style={styles.continueButtonText}>CONTINUAR</Text>
            <Ionicons name="arrow-forward" size={18} color="#000" />
          </TouchableOpacity>
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
    padding: THEME.spacing.lg,
  },
  card: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: 16,
  },
  headerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    gap: 8,
    marginBottom: 12,
  },
  outcomeText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  scrollBody: {
    flexShrink: 1,
    maxHeight: 420,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.md,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  clubCol: {
    flex: 1,
    alignItems: 'center',
  },
  clubName: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  scoreNumber: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
  },
  scoreDivider: {
    color: THEME.colors.gold,
    fontSize: 20,
    fontWeight: '900',
    paddingHorizontal: 10,
  },
  rewardsSection: {
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    borderRadius: THEME.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    marginBottom: 12,
  },
  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  rewardsTitle: {
    color: THEME.colors.gold,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  rewardLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  rewardLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  rewardValuePos: {
    color: THEME.colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  rewardValueNeg: {
    color: THEME.colors.redCard,
    fontSize: 12,
    fontWeight: '800',
  },
  rewardTotalDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.25)',
    marginVertical: 8,
  },
  rewardTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardTotalLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  rewardTotalValue: {
    color: THEME.colors.gold,
    fontSize: 16,
    fontWeight: '900',
  },
  statsSection: {
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 12,
  },
  statsHeader: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 10,
    textAlign: 'center',
  },
  statItem: {
    marginVertical: 4,
  },
  statValuesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  statValLeft: {
    color: THEME.colors.primary,
    fontSize: 12,
    fontWeight: '800',
    width: 40,
  },
  statName: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },
  statValRight: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    width: 40,
    textAlign: 'right',
  },
  barContainer: {
    height: 4,
    flexDirection: 'row',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 2,
  },
  barLeft: {
    backgroundColor: THEME.colors.primary,
  },
  barRight: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  continueButton: {
    flexShrink: 0,
    backgroundColor: THEME.colors.primary,
    height: 48,
    borderRadius: THEME.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  continueButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
