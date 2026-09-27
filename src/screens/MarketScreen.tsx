import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { MarketPlayer, Position } from '../types';

const FILTER_POSITIONS: (Position | 'TODOS')[] = [
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

export const MarketScreen: React.FC = () => {
  const {
    club,
    marketListings,
    myListings,
    buyMarketPlayer,
    simulateSale,
    cancelListing,
    setActiveModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'comprar' | 'vender'>('comprar');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPos, setSelectedPos] = useState<Position | 'TODOS'>('TODOS');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const filteredMarket = marketListings.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPos = selectedPos === 'TODOS' || p.position === selectedPos;
    const matchesPrice = maxPrice === null || p.priceSV <= maxPrice;
    return matchesSearch && matchesPos && matchesPrice;
  });

  const handleBuy = (player: MarketPlayer) => {
    Alert.alert(
      'Confirmar Contratação',
      `Deseja contratar ${player.name} (${player.position}, Nv ${player.level}) por ${player.priceSV} SV?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Comprar',
          onPress: () => {
            const res = buyMarketPlayer(player);
            Alert.alert(res.success ? 'Sucesso!' : 'Aviso', res.message);
          },
        },
      ]
    );
  };

  const handleSimulateSale = (playerId: string, playerName: string, price?: number) => {
    Alert.alert(
      'Simulação de Venda Local',
      `Simular que outro clube comprou ${playerName} por ${price || 0} SV? O valor será creditado no seu saldo imediatamente.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar Venda',
          onPress: () => {
            simulateSale(playerId);
            Alert.alert('Venda Concluída!', `Atleta vendido! +${price || 0} SV adicionados ao seu saldo.`);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Tabs: COMPRAR / VENDER */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'comprar' && styles.tabBtnActive]}
          onPress={() => setActiveTab('comprar')}
        >
          <Ionicons
            name="cart-outline"
            size={18}
            color={activeTab === 'comprar' ? THEME.colors.primary : THEME.colors.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'comprar' && styles.tabTextActive]}>
            COMPRAR ATLETAS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'vender' && styles.tabBtnActive]}
          onPress={() => setActiveTab('vender')}
        >
          <Ionicons
            name="pricetags-outline"
            size={18}
            color={activeTab === 'vender' ? THEME.colors.primary : THEME.colors.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'vender' && styles.tabTextActive]}>
            MEUS ANÚNCIOS ({myListings.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* TAB 1: COMPRAR */}
      {activeTab === 'comprar' && (
        <View style={{ flex: 1 }}>
          {/* Search Box */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={THEME.colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar jogador no mercado..."
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

          {/* Position Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {FILTER_POSITIONS.map(pos => {
              const isSelected = selectedPos === pos;
              return (
                <TouchableOpacity
                  key={pos}
                  style={[styles.posFilterPill, isSelected && styles.posFilterPillActive]}
                  onPress={() => setSelectedPos(pos)}
                >
                  <Text style={[styles.posFilterText, isSelected && styles.posFilterTextActive]}>
                    {pos}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Market List */}
          <FlatList
            data={filteredMarket}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="alert-circle-outline" size={36} color={THEME.colors.textMuted} />
                <Text style={styles.emptyText}>Nenhum jogador encontrado com os filtros atuais.</Text>
              </View>
            }
            renderItem={({ item }) => {
              const canAfford = club.balanceSV >= item.priceSV;

              return (
                <View style={styles.marketCard}>
                  <View style={styles.marketCardLeft}>
                    <View style={styles.playerNumBox}>
                      <Text style={styles.playerNumText}>{item.number}</Text>
                    </View>
                    <View style={styles.playerInfoCol}>
                      <View style={styles.nameRow}>
                        <Text style={styles.marketPlayerName}>{item.name}</Text>
                        <View style={styles.posBadge}>
                          <Text style={styles.posBadgeText}>{item.position}</Text>
                        </View>
                      </View>
                      <Text style={styles.marketMeta}>
                        Nível {item.level} • Vel {item.stats.velocidade} • Fin {item.stats.finalizacao}
                      </Text>
                      {item.sellerClub && (
                        <Text style={styles.sellerClubText}>Vendedor: {item.sellerClub}</Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.marketCardRight}>
                    <View style={styles.pricePill}>
                      <Text style={styles.priceVal}>{item.priceSV}</Text>
                      <Text style={styles.priceCurrency}>SV</Text>
                    </View>

                    <TouchableOpacity
                      style={[styles.buyBtn, !canAfford && styles.buyBtnDisabled]}
                      onPress={() => handleBuy(item)}
                      activeOpacity={0.8}
                      disabled={!canAfford}
                    >
                      <Text style={[styles.buyBtnText, !canAfford && styles.buyBtnTextDisabled]}>
                        {canAfford ? 'COMPRAR' : 'SEM SALDO'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        </View>
      )}

      {/* TAB 2: VENDER / MEUS ANÚNCIOS */}
      {activeTab === 'vender' && (
        <View style={{ flex: 1 }}>
          <View style={styles.venderHeaderBox}>
            <View>
              <Text style={styles.venderHeaderTitle}>NEGOCIAÇÃO DE ATLETAS</Text>
              <Text style={styles.venderHeaderSubtitle}>
                Venda jogadores do seu elenco para arrecadar Super Virtual (SV)
              </Text>
            </View>

            <TouchableOpacity
              style={styles.anunciarNovoBtn}
              onPress={() => setActiveModal('sellPlayer')}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={18} color="#000" />
              <Text style={styles.anunciarNovoBtnText}>Anunciar Jogador</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={myListings}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="pricetag-outline" size={44} color={THEME.colors.textMuted} />
                <Text style={styles.emptyText}>Você não tem nenhum jogador anunciado no momento.</Text>
                <TouchableOpacity
                  style={styles.emptyActionBtn}
                  onPress={() => setActiveModal('sellPlayer')}
                >
                  <Text style={styles.emptyActionBtnText}>Escolher Jogador do Elenco</Text>
                </TouchableOpacity>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.myListingCard}>
                <View style={styles.myListingLeft}>
                  <View style={styles.playerNumBox}>
                    <Text style={styles.playerNumText}>{item.number}</Text>
                  </View>
                  <View>
                    <View style={styles.nameRow}>
                      <Text style={styles.marketPlayerName}>{item.name}</Text>
                      <View style={styles.posBadge}>
                        <Text style={styles.posBadgeText}>{item.position}</Text>
                      </View>
                    </View>
                    <Text style={styles.marketMeta}>Nível {item.level}</Text>
                    <Text style={styles.myListingPrice}>
                      Preço pedido: <Text style={{ color: THEME.colors.gold }}>{item.listPrice} SV</Text>
                    </Text>
                  </View>
                </View>

                <View style={styles.myListingActions}>
                  <TouchableOpacity
                    style={styles.simulateSaleBtn}
                    onPress={() => handleSimulateSale(item.id, item.name, item.listPrice)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="checkmark-done" size={16} color="#000" />
                    <Text style={styles.simulateSaleBtnText}>Simular Venda</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelListingBtn}
                    onPress={() => cancelListing(item.id)}
                  >
                    <Text style={styles.cancelListingText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
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
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: THEME.colors.primary,
  },
  tabText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: THEME.colors.primary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.card,
    marginHorizontal: THEME.spacing.md,
    marginTop: THEME.spacing.md,
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
  filterScroll: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    gap: 6,
  },
  posFilterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.card,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  posFilterPillActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  posFilterText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  posFilterTextActive: {
    color: '#000000',
    fontWeight: '900',
  },
  listContent: {
    padding: THEME.spacing.md,
    gap: 10,
    paddingBottom: 110,
  },
  marketCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  marketCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerNumBox: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: THEME.colors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: THEME.colors.borderLight,
  },
  playerNumText: {
    color: THEME.colors.gold,
    fontSize: 13,
    fontWeight: '900',
  },
  playerInfoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  marketPlayerName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    flexShrink: 1,
  },
  posBadge: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  posBadgeText: {
    color: THEME.colors.primary,
    fontSize: 9,
    fontWeight: '900',
  },
  marketMeta: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  sellerClubText: {
    color: THEME.colors.textSecondary,
    fontSize: 9,
    marginTop: 2,
  },
  marketCardRight: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  pricePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  priceVal: {
    color: THEME.colors.gold,
    fontSize: 13,
    fontWeight: '900',
  },
  priceCurrency: {
    color: THEME.colors.gold,
    fontSize: 9,
    fontWeight: '700',
    marginLeft: 3,
  },
  buyBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radius.sm,
  },
  buyBtnDisabled: {
    backgroundColor: THEME.colors.cardElevated,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  buyBtnText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  buyBtnTextDisabled: {
    color: THEME.colors.textMuted,
  },
  venderHeaderBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.card,
    margin: THEME.spacing.md,
    padding: 14,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  venderHeaderTitle: {
    color: THEME.colors.text,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  venderHeaderSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
    maxWidth: 200,
  },
  anunciarNovoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: THEME.radius.sm,
    gap: 4,
  },
  anunciarNovoBtnText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '900',
  },
  myListingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  myListingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  myListingPrice: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  myListingActions: {
    alignItems: 'flex-end',
    gap: 6,
  },
  simulateSaleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: THEME.radius.sm,
    gap: 4,
  },
  simulateSaleBtnText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '900',
  },
  cancelListingBtn: {
    paddingVertical: 2,
  },
  cancelListingText: {
    color: THEME.colors.redCard,
    fontSize: 10,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyText: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18,
  },
  emptyActionBtn: {
    backgroundColor: THEME.colors.cardElevated,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: THEME.radius.md,
    marginTop: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  emptyActionBtnText: {
    color: THEME.colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
});
