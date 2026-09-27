import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { DivisionTeam } from '../types';

export const TournamentsScreen: React.FC = () => {
  const { divisionStandings, currentSeason, setActiveModal } = useApp();
  const [selectedDiv, setSelectedDiv] = useState<number>(4);

  const standings: DivisionTeam[] = divisionStandings[selectedDiv] || [];

  return (
    <View style={styles.container}>
      {/* Top Banner / Season */}
      <View style={styles.seasonBanner}>
        <View style={styles.seasonLeft}>
          <Ionicons name="trophy" size={16} color={THEME.colors.gold} />
          <Text style={styles.seasonText}>{currentSeason}</Text>
        </View>

        <View style={styles.headerButtonsRow}>
          <TouchableOpacity
            style={styles.prizesBtn}
            onPress={() => setActiveModal('prizes')}
            activeOpacity={0.8}
          >
            <Ionicons name="gift-outline" size={14} color={THEME.colors.gold} />
            <Text style={styles.prizesBtnText}>Premiações</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.copaBtn}
            onPress={() => setActiveModal('copaCampeoes')}
            activeOpacity={0.8}
          >
            <Ionicons name="medal-outline" size={14} color="#000" />
            <Text style={styles.copaBtnText}>Copa Campeões</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Division Selector Tabs (1ª to 8ª) */}
      <View style={styles.divisionSelectorContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.divisionScroll}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map(divNum => {
            const isSelected = selectedDiv === divNum;
            const isUserDiv = divNum === 4;

            return (
              <TouchableOpacity
                key={divNum}
                style={[
                  styles.divisionTab,
                  isSelected && styles.divisionTabActive,
                  isUserDiv && !isSelected && styles.divisionTabUser,
                ]}
                onPress={() => setSelectedDiv(divNum)}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.divisionTabText,
                    isSelected && styles.divisionTabTextActive,
                    isUserDiv && !isSelected && styles.divisionTabTextUser,
                  ]}
                >
                  {divNum}ª DIVISÃO
                </Text>
                {isUserDiv && (
                  <View style={styles.userDot} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* League Info Bar */}
      <View style={styles.leagueInfoBar}>
        <View style={styles.leagueInfoCol}>
          <Text style={styles.leagueInfoTitle}>{selectedDiv}ª DIVISÃO NACIONAL</Text>
          <Text style={styles.leagueInfoSub}>30 Clubes Participantes • Turno e Returno</Text>
        </View>

        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: THEME.colors.primary }]} />
            <Text style={styles.legendText}>Acesso</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: THEME.colors.redCard }]} />
            <Text style={styles.legendText}>Rebaixamento</Text>
          </View>
        </View>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeaderRow}>
        <Text style={[styles.thText, styles.colPos]}>#</Text>
        <Text style={[styles.thText, styles.colTeam]}>CLUBE</Text>
        <Text style={[styles.thText, styles.colStat, styles.colPts]}>PTS</Text>
        <Text style={[styles.thText, styles.colStat]}>J</Text>
        <Text style={[styles.thText, styles.colStat]}>V</Text>
        <Text style={[styles.thText, styles.colStat]}>E</Text>
        <Text style={[styles.thText, styles.colStat]}>D</Text>
        <Text style={[styles.thText, styles.colStat]}>SG</Text>
      </View>

      {/* Standings Table List */}
      <FlatList
        data={standings}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const position = index + 1;
          const isPromotion = selectedDiv !== 1 && (position === 1 || position === 2);
          const isRelegation = selectedDiv !== 8 && (position >= standings.length - 1);
          const isUser = item.isUser;

          return (
            <View
              style={[
                styles.tableRow,
                isUser && styles.tableRowUser,
                isPromotion && styles.tableRowPromotion,
                isRelegation && styles.tableRowRelegation,
              ]}
            >
              {/* Position with colored bar indicator */}
              <View style={styles.colPosWrapper}>
                <View
                  style={[
                    styles.zoneIndicator,
                    isPromotion && { backgroundColor: THEME.colors.primary },
                    isRelegation && { backgroundColor: THEME.colors.redCard },
                  ]}
                />
                <Text
                  style={[
                    styles.tdPos,
                    isUser && styles.tdUserText,
                    isPromotion && { color: THEME.colors.primary },
                  ]}
                >
                  {position}
                </Text>
              </View>

              {/* Club Name */}
              <View style={styles.colTeamWrapper}>
                <Text
                  style={[
                    styles.tdTeam,
                    isUser && styles.tdUserTeam,
                  ]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                {isUser && (
                  <View style={styles.youBadge}>
                    <Text style={styles.youBadgeText}>VOCÊ</Text>
                  </View>
                )}
              </View>

              {/* Stats */}
              <Text style={[styles.tdStat, styles.tdPts, isUser && styles.tdPtsUser]}>
                {item.points}
              </Text>
              <Text style={styles.tdStat}>{item.played}</Text>
              <Text style={styles.tdStat}>{item.won}</Text>
              <Text style={styles.tdStat}>{item.drawn}</Text>
              <Text style={styles.tdStat}>{item.lost}</Text>
              <Text style={[styles.tdStat, { color: item.goalDiff > 0 ? THEME.colors.primary : item.goalDiff < 0 ? THEME.colors.redCard : THEME.colors.textSecondary }]}>
                {item.goalDiff > 0 ? `+${item.goalDiff}` : item.goalDiff}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  seasonBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: 10,
    backgroundColor: THEME.colors.cardElevated,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  seasonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  seasonText: {
    color: THEME.colors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  prizesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: THEME.radius.sm,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.35)',
  },
  prizesBtnText: {
    color: THEME.colors.gold,
    fontSize: 10,
    fontWeight: '800',
  },
  copaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: THEME.radius.sm,
    gap: 4,
  },
  copaBtnText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '900',
  },
  divisionSelectorContainer: {
    backgroundColor: THEME.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  divisionScroll: {
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: 8,
    gap: 6,
  },
  divisionTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.cardElevated,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  divisionTabActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  divisionTabUser: {
    borderColor: 'rgba(0, 230, 118, 0.5)',
  },
  divisionTabText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
  },
  divisionTabTextActive: {
    color: '#000000',
    fontWeight: '900',
  },
  divisionTabTextUser: {
    color: THEME.colors.primary,
  },
  userDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.gold,
  },
  leagueInfoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: 8,
    backgroundColor: THEME.colors.card,
  },
  leagueInfoCol: {},
  leagueInfoTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  leagueInfoSub: {
    color: THEME.colors.textMuted,
    fontSize: 9,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  legendText: {
    color: THEME.colors.textSecondary,
    fontSize: 9,
    fontWeight: '700',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardElevated,
    paddingVertical: 8,
    paddingHorizontal: THEME.spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: THEME.colors.border,
  },
  thText: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
  },
  colPos: { width: 32, textAlign: 'left' },
  colTeam: { flex: 1, textAlign: 'left', paddingLeft: 6 },
  colStat: { width: 28 },
  colPts: { width: 34, color: THEME.colors.gold },
  listContent: {
    paddingBottom: 110,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: THEME.colors.card,
  },
  tableRowUser: {
    backgroundColor: 'rgba(0, 230, 118, 0.09)',
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.primary,
  },
  tableRowPromotion: {},
  tableRowRelegation: {},
  colPosWrapper: {
    width: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  zoneIndicator: {
    width: 3,
    height: 16,
    borderRadius: 1.5,
    marginRight: 6,
    backgroundColor: 'transparent',
  },
  tdPos: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  tdUserText: {
    color: THEME.colors.primary,
    fontWeight: '900',
  },
  colTeamWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 6,
    gap: 6,
  },
  tdTeam: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
  },
  tdUserTeam: {
    color: THEME.colors.primary,
    fontWeight: '900',
  },
  youBadge: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  youBadgeText: {
    color: '#000000',
    fontSize: 7,
    fontWeight: '900',
  },
  tdStat: {
    width: 28,
    textAlign: 'center',
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  tdPts: {
    width: 34,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  tdPtsUser: {
    color: THEME.colors.gold,
  },
});
