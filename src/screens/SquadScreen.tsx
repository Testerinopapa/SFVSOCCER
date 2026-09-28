import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Player, Position } from '../types';
import { SoccerPitch } from '../components/SoccerPitch';
import { KitPreview } from '../components/KitPreview';
import { ColorPalettePicker } from '../components/ColorPalettePicker';

const POSITIONS_FILTER: (Position | 'TODOS')[] = [
  'TODOS',
  'GO',
  'ZG',
  'LT',
  'MC',
  'MO',
  'MD',
  'ML',
  'PT',
  'AT',
];

const FORMATION_OPTIONS = ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2'];

export const SquadScreen: React.FC = () => {
  const {
    club,
    updateFormation,
    setSelectedPlayer,
    setActiveModal,
    setSelectedLineupSlot,
    updateUniformItem,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'elenco' | 'formacao' | 'uniformes'>('elenco');
  const [selectedFilter, setSelectedFilter] = useState<Position | 'TODOS'>('TODOS');
  const [searchQuery, setSearchQuery] = useState('');

  // Uniform tab state
  const [activeUniformTab, setActiveUniformTab] = useState<1 | 2>(1);
  const [activeUniformPart, setActiveUniformPart] = useState<'camisa' | 'short' | 'meiao'>('camisa');

  // Filter players
  const filteredPlayers = club.squad.filter(p => {
    const matchesPosition = selectedFilter === 'TODOS' || p.position === selectedFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.number.toString().includes(searchQuery);
    return matchesPosition && matchesSearch;
  });

  const handlePlayerTap = (player: Player) => {
    setSelectedPlayer(player);
    setActiveModal('playerDetail');
  };

  const handlePitchSlotPress = (slotIndex: number) => {
    setSelectedLineupSlot(slotIndex);
    setActiveModal('lineupSelect');
  };

  const handleColorChange = (color: string) => {
    updateUniformItem(activeUniformTab, activeUniformPart, color);
  };

  const currentUniform = activeUniformTab === 1 ? club.uniform1 : club.uniform2;

  return (
    <View style={styles.container}>
      {/* Top Tabs: ELENCO, FORMAÇÃO, UNIFORMES */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'elenco' && styles.tabItemActive]}
          onPress={() => setActiveTab('elenco')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="account-group"
            size={18}
            color={activeTab === 'elenco' ? THEME.colors.primary : THEME.colors.textSecondary}
          />
          <Text style={[styles.tabLabel, activeTab === 'elenco' && styles.tabLabelActive]}>
            ELENCO ({club.squad.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'formacao' && styles.tabItemActive]}
          onPress={() => setActiveTab('formacao')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="soccer-field"
            size={18}
            color={activeTab === 'formacao' ? THEME.colors.primary : THEME.colors.textSecondary}
          />
          <Text style={[styles.tabLabel, activeTab === 'formacao' && styles.tabLabelActive]}>
            FORMAÇÃO
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'uniformes' && styles.tabItemActive]}
          onPress={() => setActiveTab('uniformes')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="tshirt-v"
            size={18}
            color={activeTab === 'uniformes' ? THEME.colors.primary : THEME.colors.textSecondary}
          />
          <Text style={[styles.tabLabel, activeTab === 'uniformes' && styles.tabLabelActive]}>
            UNIFORMES
          </Text>
        </TouchableOpacity>
      </View>

      {/* TAB 1: ELENCO */}
      {activeTab === 'elenco' && (
        <View style={styles.tabContent}>
          {/* Sticky Header: Search & Filter */}
          <View style={styles.stickyFilterContainer}>
            {/* Search Bar */}
            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color={THEME.colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nome ou número..."
                placeholderTextColor={THEME.colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color={THEME.colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Position Filter Pills */}
            <View style={styles.filterWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScrollView}
                contentContainerStyle={styles.filterScroll}
              >
                {POSITIONS_FILTER.map(pos => {
                  const isActive = selectedFilter === pos;
                  return (
                    <TouchableOpacity
                      key={pos}
                      style={[styles.filterPill, isActive && styles.filterPillActive]}
                      onPress={() => setSelectedFilter(pos)}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                        {pos}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>

          {/* Player Cards List */}
          <FlatList
            data={filteredPlayers}
            keyExtractor={item => item.id}
            style={styles.flatList}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isStarting = club.lineup.includes(item.id);

              return (
                <TouchableOpacity
                  style={styles.playerCard}
                  onPress={() => handlePlayerTap(item)}
                  activeOpacity={0.75}
                >
                  {/* Number Badge */}
                  <View style={styles.numberBadge}>
                    <Text style={styles.numberText}>
                      {item.number < 10 ? `0${item.number}` : item.number}
                    </Text>
                  </View>

                  {/* Player Info */}
                  <View style={styles.playerDetails}>
                    <View style={styles.playerNameRow}>
                      <Text style={styles.playerName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      {isStarting && (
                        <View style={styles.startingBadge}>
                          <Text style={styles.startingBadgeText}>TITULAR</Text>
                        </View>
                      )}
                      {item.isListed && (
                        <View style={styles.listedBadge}>
                          <Text style={styles.listedBadgeText}>À VENDA</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.playerMetaRow}>
                      <View style={styles.positionBadge}>
                        <Text style={styles.positionText}>{item.position}</Text>
                      </View>
                      <Text style={styles.levelText}>Nível {item.level}</Text>
                      <View style={styles.xpPill}>
                        <Text style={styles.xpText}>
                          {item.xp}/{item.xpMax} XP
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Ionicons name="chevron-forward" size={18} color={THEME.colors.textSecondary} />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}

      {/* TAB 2: FORMAÇÃO */}
      {activeTab === 'formacao' && (
        <ScrollView contentContainerStyle={styles.formationContainer} showsVerticalScrollIndicator={false}>
          {/* Formation Selector */}
          <View style={styles.formationSelectorBox}>
            <Text style={styles.formationSelectorLabel}>ESCOLHA O ESQUEMA TÁTICO:</Text>
            <View style={styles.formationPillRow}>
              {FORMATION_OPTIONS.map(form => {
                const isSelected = club.formation === form;
                return (
                  <TouchableOpacity
                    key={form}
                    style={[styles.formationOptionPill, isSelected && styles.formationOptionPillActive]}
                    onPress={() => updateFormation(form)}
                  >
                    <Text
                      style={[
                        styles.formationOptionText,
                        isSelected && styles.formationOptionTextActive,
                      ]}
                    >
                      {form}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Tactical Pitch */}
          <SoccerPitch
            formation={club.formation}
            lineup={club.lineup}
            squad={club.squad}
            onPressSlot={handlePitchSlotPress}
            jerseyColor={club.uniform1.camisa}
          />

          <View style={styles.formationHint}>
            <Ionicons name="hand-left-outline" size={16} color={THEME.colors.primary} />
            <Text style={styles.formationHintText}>
              Toque em qualquer posição do campo para escalar um jogador do seu elenco.
            </Text>
          </View>
        </ScrollView>
      )}

      {/* TAB 3: UNIFORMES */}
      {activeTab === 'uniformes' && (
        <ScrollView contentContainerStyle={styles.uniformsContainer} showsVerticalScrollIndicator={false}>
          {/* Toggle Uniform 1 / Uniform 2 */}
          <View style={styles.uniformToggleBar}>
            <TouchableOpacity
              style={[styles.uniformToggleBtn, activeUniformTab === 1 && styles.uniformToggleBtnActive]}
              onPress={() => setActiveUniformTab(1)}
            >
              <Text
                style={[styles.uniformToggleText, activeUniformTab === 1 && styles.uniformToggleTextActive]}
              >
                UNIFORME 1 (TITULAR)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.uniformToggleBtn, activeUniformTab === 2 && styles.uniformToggleBtnActive]}
              onPress={() => setActiveUniformTab(2)}
            >
              <Text
                style={[styles.uniformToggleText, activeUniformTab === 2 && styles.uniformToggleTextActive]}
              >
                UNIFORME 2 (RESERVA)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Live Kit Preview */}
          <View style={styles.uniformPreviewBox}>
            <KitPreview uniform={currentUniform} size="lg" showLabels clubName={club.name} />
          </View>

          {/* Part Selection: Camisa, Short, Meião */}
          <View style={styles.partSelectionRow}>
            {(['camisa', 'short', 'meiao'] as const).map(part => {
              const label = part === 'camisa' ? 'Camisa' : part === 'short' ? 'Short' : 'Meião';
              const isSelected = activeUniformPart === part;
              const color = currentUniform[part];

              return (
                <TouchableOpacity
                  key={part}
                  style={[styles.partBtn, isSelected && styles.partBtnActive]}
                  onPress={() => setActiveUniformPart(part)}
                >
                  <View style={[styles.partDot, { backgroundColor: color }]} />
                  <Text style={[styles.partBtnText, isSelected && styles.partBtnTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Color Palette */}
          <ColorPalettePicker
            title={`Editar Cor: ${activeUniformPart.toUpperCase()}`}
            selectedColor={currentUniform[activeUniformPart]}
            onSelectColor={handleColorChange}
          />

          {/* AI Team Info Note */}
          <View style={styles.aiTeamInfoBox}>
            <Text style={styles.aiTeamInfoTitle}>ADVERSÁRIO DO SISTEMA (TIME IA):</Text>
            <Text style={styles.aiTeamInfoText}>
              O time IA oficial chama-se <Text style={{ color: THEME.colors.gold }}>SFV</Text>. Seus uniformes são pré-definidos: Uniforme 1 todo branco e Uniforme 2 todo preto.
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: THEME.colors.primary,
  },
  tabLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: THEME.colors.primary,
  },
  tabContent: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  stickyFilterContainer: {
    backgroundColor: THEME.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    paddingTop: 4,
    paddingBottom: 8,
    zIndex: 100,
    elevation: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.card,
    marginHorizontal: THEME.spacing.md,
    marginTop: 4,
    marginBottom: 6,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  searchInput: {
    flex: 1,
    color: THEME.colors.text,
    fontSize: 13,
    marginLeft: 8,
  },
  filterWrapper: {
    height: 42,
    justifyContent: 'center',
  },
  filterScrollView: {
    flexGrow: 0,
    height: 38,
  },
  filterScroll: {
    paddingHorizontal: THEME.spacing.md,
    alignItems: 'center',
    gap: 6,
  },
  filterPill: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.card,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPillActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  filterPillText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  filterPillTextActive: {
    color: '#000000',
    fontWeight: '900',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  flatList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: THEME.spacing.md,
    paddingTop: 10,
    paddingBottom: 135,
    gap: 8,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  numberBadge: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: THEME.colors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: THEME.colors.borderLight,
  },
  numberText: {
    color: THEME.colors.gold,
    fontSize: 14,
    fontWeight: '900',
  },
  playerDetails: {
    flex: 1,
  },
  playerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playerName: {
    color: THEME.colors.text,
    fontSize: 14,
    fontWeight: '800',
    flexShrink: 1,
  },
  startingBadge: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  startingBadgeText: {
    color: THEME.colors.primary,
    fontSize: 8,
    fontWeight: '900',
  },
  listedBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  listedBadgeText: {
    color: THEME.colors.gold,
    fontSize: 8,
    fontWeight: '900',
  },
  playerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  positionBadge: {
    backgroundColor: THEME.colors.cardElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  positionText: {
    color: THEME.colors.gold,
    fontSize: 10,
    fontWeight: '900',
  },
  levelText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  xpPill: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  xpText: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  formationContainer: {
    padding: THEME.spacing.md,
    alignItems: 'center',
    paddingBottom: 135,
  },
  formationSelectorBox: {
    width: '100%',
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.sm,
  },
  formationSelectorLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  formationPillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  formationOptionPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.cardElevated,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  formationOptionPillActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  formationOptionText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
  },
  formationOptionTextActive: {
    color: '#000000',
  },
  formationHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
    borderRadius: THEME.radius.md,
    padding: 10,
    marginTop: THEME.spacing.sm,
    width: '100%',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.2)',
  },
  formationHintText: {
    flex: 1,
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  uniformsContainer: {
    padding: THEME.spacing.md,
    paddingBottom: 135,
  },
  uniformToggleBar: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.md,
    padding: 4,
    marginBottom: THEME.spacing.md,
  },
  uniformToggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: THEME.radius.sm,
  },
  uniformToggleBtnActive: {
    backgroundColor: THEME.colors.primary,
  },
  uniformToggleText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
  },
  uniformToggleTextActive: {
    color: '#000000',
  },
  uniformPreviewBox: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  partSelectionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: THEME.spacing.md,
  },
  partBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.card,
    paddingVertical: 10,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 6,
  },
  partBtnActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
  },
  partDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  partBtnText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  partBtnTextActive: {
    color: THEME.colors.primary,
  },
  aiTeamInfoBox: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.md,
    padding: 14,
    marginTop: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  aiTeamInfoTitle: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  aiTeamInfoText: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
  },
});
