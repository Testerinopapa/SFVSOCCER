import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const { club, setCurrentTab, setActiveModal, currentSeason } = useApp();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Banner / Season Info */}
      <View style={styles.seasonBanner}>
        <Ionicons name="calendar-outline" size={14} color={THEME.colors.gold} style={{ marginRight: 6 }} />
        <Text style={styles.seasonText}>TEMPORADA ATUAL: {currentSeason}</Text>
      </View>

      {/* Hero Dominant Action: JOGAR */}
      <TouchableOpacity
        style={styles.heroPlayButton}
        onPress={() => setActiveModal('playMenu')}
        activeOpacity={0.88}
      >
        <View style={styles.heroPlayContent}>
          <View style={styles.heroPlayIconWrapper}>
            <Ionicons name="play" size={34} color="#000" style={{ marginLeft: 4 }} />
          </View>
          <View style={styles.heroPlayTextWrapper}>
            <Text style={styles.heroPlayBadge}>SIMULADOR DE PARTIDAS</Text>
            <Text style={styles.heroPlayTitle}>JOGAR AGORA</Text>
            <Text style={styles.heroPlaySubtitle}>Partida contra IA • Valendo SV e Classificação</Text>
          </View>
          <Ionicons name="chevron-forward" size={26} color={THEME.colors.gold} />
        </View>
      </TouchableOpacity>

      {/* Próxima Partida Card */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>PRÓXIMA PARTIDA</Text>
        <TouchableOpacity onPress={() => setActiveModal('upcoming')}>
          <Text style={styles.sectionLink}>Ver Todas</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.matchCard}
        onPress={() => setActiveModal('matchSetup')}
        activeOpacity={0.85}
      >
        <View style={styles.matchCardHeader}>
          <View style={styles.matchBadgeDiv}>
            <Text style={styles.matchBadgeDivText}>4ª DIVISÃO</Text>
          </View>
          <View style={styles.matchDatePill}>
            <Ionicons name="time-outline" size={12} color={THEME.colors.textSecondary} style={{ marginRight: 4 }} />
            <Text style={styles.matchDateText}>27 SET • 20:00</Text>
          </View>
        </View>

        <View style={styles.matchTeamsRow}>
          {/* Home Team */}
          <View style={styles.teamColumn}>
            <View style={[styles.teamCrest, { borderColor: club.uniform1.camisa }]}>
              <Text style={styles.teamCrestText}>{club.name.replace('SFV ', '').slice(0, 3)}</Text>
            </View>
            <Text style={styles.teamName} numberOfLines={1}>
              {club.name}
            </Text>
            <Text style={styles.teamRankText}>2º colocado</Text>
          </View>

          {/* Versus */}
          <View style={styles.versusColumn}>
            <Text style={styles.versusText}>VS</Text>
            <View style={styles.simulatedTag}>
              <Text style={styles.simulatedTagText}>OFICIAL</Text>
            </View>
          </View>

          {/* Away Team */}
          <View style={styles.teamColumn}>
            <View style={[styles.teamCrest, { borderColor: '#00B0FF' }]}>
              <Text style={styles.teamCrestText}>UNI</Text>
            </View>
            <Text style={styles.teamName} numberOfLines={1}>
              SFV União
            </Text>
            <Text style={styles.teamRankText}>1º colocado</Text>
          </View>
        </View>

        <View style={styles.matchCardFooter}>
          <Text style={styles.matchFooterPrompt}>Toque para iniciar a preparação da partida</Text>
          <Ionicons name="arrow-forward-circle" size={18} color={THEME.colors.primary} />
        </View>
      </TouchableOpacity>

      {/* Main Hub Grid */}
      <Text style={styles.sectionTitle}>CENTRAL DO CLUBE</Text>
      <View style={styles.hubGrid}>
        {/* Card: Meu Clube */}
        <TouchableOpacity
          style={styles.hubCard}
          onPress={() => setCurrentTab('squad')}
          activeOpacity={0.8}
        >
          <View style={[styles.hubIconBg, { backgroundColor: 'rgba(0, 230, 118, 0.15)' }]}>
            <MaterialCommunityIcons name="tshirt-crew" size={26} color={THEME.colors.primary} />
          </View>
          <Text style={styles.hubCardTitle}>MEU CLUBE</Text>
          <Text style={styles.hubCardSubtitle}>Elenco, tática 4-3-3 e uniformes</Text>
        </TouchableOpacity>

        {/* Card: Torneios */}
        <TouchableOpacity
          style={styles.hubCard}
          onPress={() => setCurrentTab('tournaments')}
          activeOpacity={0.8}
        >
          <View style={[styles.hubIconBg, { backgroundColor: 'rgba(255, 215, 0, 0.15)' }]}>
            <Ionicons name="trophy" size={26} color={THEME.colors.gold} />
          </View>
          <Text style={styles.hubCardTitle}>TORNEIOS</Text>
          <Text style={styles.hubCardSubtitle}>8 divisões e Copa dos Campeões</Text>
        </TouchableOpacity>

        {/* Card: Mercado */}
        <TouchableOpacity
          style={styles.hubCard}
          onPress={() => setCurrentTab('market')}
          activeOpacity={0.8}
        >
          <View style={[styles.hubIconBg, { backgroundColor: 'rgba(0, 176, 255, 0.15)' }]}>
            <Ionicons name="swap-horizontal" size={26} color={THEME.colors.blueAccent} />
          </View>
          <Text style={styles.hubCardTitle}>MERCADO</Text>
          <Text style={styles.hubCardSubtitle}>Comprar e vender atletas</Text>
        </TouchableOpacity>

        {/* Card: Vídeos Recompensas */}
        <TouchableOpacity
          style={styles.hubCard}
          onPress={() => setActiveModal('videos')}
          activeOpacity={0.8}
        >
          <View style={[styles.hubIconBg, { backgroundColor: 'rgba(255, 61, 0, 0.15)' }]}>
            <Ionicons name="play-circle" size={26} color="#FF6E40" />
          </View>
          <View style={styles.hubBadgeHot}>
            <Text style={styles.hubBadgeHotText}>+25 XP</Text>
          </View>
          <Text style={styles.hubCardTitle}>VÍDEOS</Text>
          <Text style={styles.hubCardSubtitle}>Evolua o nível dos seus jogadores</Text>
        </TouchableOpacity>

        {/* Card: Ranking Geral */}
        <TouchableOpacity
          style={styles.hubCard}
          onPress={() => setActiveModal('ranking')}
          activeOpacity={0.8}
        >
          <View style={[styles.hubIconBg, { backgroundColor: 'rgba(186, 104, 200, 0.15)' }]}>
            <Ionicons name="podium" size={26} color="#CE93D8" />
          </View>
          <Text style={styles.hubCardTitle}>RANKING</Text>
          <Text style={styles.hubCardSubtitle}>Classificação geral global</Text>
        </TouchableOpacity>

        {/* Card: Próximas Partidas */}
        <TouchableOpacity
          style={styles.hubCard}
          onPress={() => setActiveModal('upcoming')}
          activeOpacity={0.8}
        >
          <View style={[styles.hubIconBg, { backgroundColor: 'rgba(77, 208, 225, 0.15)' }]}>
            <Ionicons name="calendar" size={26} color="#4DD0E1" />
          </View>
          <Text style={styles.hubCardTitle}>PARTIDAS</Text>
          <Text style={styles.hubCardSubtitle}>Calendário de rodadas</Text>
        </TouchableOpacity>
      </View>

      {/* Economy Overview Bar */}
      <View style={styles.economyBar}>
        <View style={styles.economyItem}>
          <Text style={styles.economyValue}>{club.balanceSV} SV</Text>
          <Text style={styles.economyLabel}>SALDO DISPONÍVEL</Text>
        </View>
        <View style={styles.economyDivider} />
        <View style={styles.economyItem}>
          <Text style={styles.economyValue}>{club.squad.length}</Text>
          <Text style={styles.economyLabel}>JOGADORES NO CLUBE</Text>
        </View>
        <View style={styles.economyDivider} />
        <View style={styles.economyItem}>
          <Text style={styles.economyValue}>{club.formation}</Text>
          <Text style={styles.economyLabel}>FORMAÇÃO TÁTICA</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    padding: THEME.spacing.lg,
    paddingBottom: 110,
  },
  seasonBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: THEME.radius.sm,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.25)',
  },
  seasonText: {
    color: THEME.colors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroPlayButton: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    borderWidth: 2,
    borderColor: THEME.colors.primary,
    marginBottom: THEME.spacing.xl,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  heroPlayContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroPlayIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: THEME.colors.gold,
  },
  heroPlayTextWrapper: {
    flex: 1,
  },
  heroPlayBadge: {
    color: THEME.colors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  heroPlayTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 1,
  },
  heroPlaySubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  sectionTitle: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  sectionLink: {
    color: THEME.colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  matchCard: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  matchCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  matchBadgeDiv: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
  },
  matchBadgeDivText: {
    color: THEME.colors.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  matchDatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  matchDateText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  matchTeamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  teamColumn: {
    flex: 1,
    alignItems: 'center',
  },
  teamCrest: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME.colors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 6,
  },
  teamCrestText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  teamName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  teamRankText: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  versusColumn: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  versusText: {
    color: THEME.colors.gold,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  simulatedTag: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
    marginTop: 4,
  },
  simulatedTagText: {
    color: THEME.colors.gold,
    fontSize: 9,
    fontWeight: '800',
  },
  matchCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingTop: 10,
    marginTop: 12,
    gap: 6,
  },
  matchFooterPrompt: {
    color: THEME.colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  hubGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: THEME.spacing.sm,
    marginBottom: THEME.spacing.xl,
  },
  hubCard: {
    width: (width - 32 - 12) / 2,
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    position: 'relative',
  },
  hubIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  hubBadgeHot: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF3D00',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hubBadgeHotText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  hubCardTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  hubCardSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
    lineHeight: 14,
  },
  economyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  economyItem: {
    flex: 1,
    alignItems: 'center',
  },
  economyValue: {
    color: THEME.colors.gold,
    fontSize: 15,
    fontWeight: '900',
  },
  economyLabel: {
    color: THEME.colors.textMuted,
    fontSize: 8,
    fontWeight: '800',
    marginTop: 2,
    textAlign: 'center',
  },
  economyDivider: {
    width: 1,
    height: 24,
    backgroundColor: THEME.colors.border,
  },
});
