import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Player } from '../types';

interface SellPlayerModalProps {
  visible: boolean;
  onClose: () => void;
  preselectedPlayer?: Player | null;
}

export const SellPlayerModal: React.FC<SellPlayerModalProps> = ({
  visible,
  onClose,
  preselectedPlayer,
}) => {
  const { club, listPlayerForSale } = useApp();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(preselectedPlayer || null);
  const [priceInput, setPriceInput] = useState('100');

  // Available players (not already listed)
  const availablePlayers = club.squad.filter(p => !p.isListed);

  const handleConfirmSale = () => {
    if (!selectedPlayer) {
      Alert.alert('Atenção', 'Selecione um jogador para anunciar.');
      return;
    }

    const price = parseInt(priceInput, 10);
    if (isNaN(price) || price < 1) {
      Alert.alert('Atenção', 'O preço mínimo de venda é de 1 SV.');
      return;
    }

    const res = listPlayerForSale(selectedPlayer.id, price);
    if (res.success) {
      Alert.alert('Anunciado!', res.message);
      onClose();
    } else {
      Alert.alert('Erro', res.message);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>ANUNCIAR JOGADOR NO MERCADO</Text>
              <Text style={styles.subtitle}>Defina o valor em SV para colocar à venda</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Selected Player Box / Selector */}
          <View style={styles.body}>
            <Text style={styles.stepLabel}>1. SELECIONE O JOGADOR DO ELENCO:</Text>

            <View style={styles.playerPickerList}>
              <FlatList
                data={availablePlayers}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
                renderItem={({ item }) => {
                  const isSelected = selectedPlayer?.id === item.id;
                  return (
                    <TouchableOpacity
                      style={[styles.playerItemCard, isSelected && styles.playerItemCardActive]}
                      onPress={() => setSelectedPlayer(item)}
                    >
                      <View style={styles.playerItemNum}>
                        <Text style={styles.playerItemNumText}>{item.number}</Text>
                      </View>
                      <Text style={styles.playerItemName} numberOfLines={1}>
                        {item.name.split(' ').slice(-1)[0]}
                      </Text>
                      <Text style={styles.playerItemPos}>{item.position} • Nv {item.level}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            {selectedPlayer && (
              <View style={styles.chosenPlayerBox}>
                <View style={styles.chosenInfo}>
                  <Text style={styles.chosenName}>{selectedPlayer.name}</Text>
                  <Text style={styles.chosenMeta}>
                    #{selectedPlayer.number} • {selectedPlayer.position} • Nível {selectedPlayer.level}
                  </Text>
                </View>
              </View>
            )}

            {/* Price input */}
            <Text style={styles.stepLabel}>2. PREÇO DE VENDA (EM SV):</Text>
            <View style={styles.priceInputWrapper}>
              <TextInput
                style={styles.priceInput}
                keyboardType="numeric"
                value={priceInput}
                onChangeText={setPriceInput}
                placeholder="100"
                placeholderTextColor={THEME.colors.textMuted}
              />
              <Text style={styles.svSuffix}>SV</Text>
            </View>
            <Text style={styles.minPriceHint}>Preço mínimo obrigatório: 1 SV. Sem limite máximo.</Text>
          </View>

          {/* Submit Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleConfirmSale}
              activeOpacity={0.85}
            >
              <Text style={styles.submitBtnText}>COLOCAR À VENDA</Text>
              <Ionicons name="pricetag" size={18} color="#000" />
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: THEME.colors.card,
    borderTopLeftRadius: THEME.radius.lg,
    borderTopRightRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingBottom: 20,
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
    color: THEME.colors.text,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  body: {
    padding: THEME.spacing.lg,
  },
  stepLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  playerPickerList: {
    marginBottom: 14,
  },
  playerItemCard: {
    width: 80,
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.md,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
  },
  playerItemCardActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
  },
  playerItemNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: THEME.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  playerItemNumText: {
    color: THEME.colors.gold,
    fontSize: 12,
    fontWeight: '900',
  },
  playerItemName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  playerItemPos: {
    color: THEME.colors.textMuted,
    fontSize: 9,
    marginTop: 2,
  },
  chosenPlayerBox: {
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    marginBottom: 16,
  },
  chosenInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chosenName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  chosenMeta: {
    color: THEME.colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  priceInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 16,
    height: 50,
  },
  priceInput: {
    flex: 1,
    color: THEME.colors.gold,
    fontSize: 20,
    fontWeight: '900',
  },
  svSuffix: {
    color: THEME.colors.gold,
    fontSize: 14,
    fontWeight: '900',
    marginLeft: 6,
  },
  minPriceHint: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    marginTop: 6,
  },
  footer: {
    paddingHorizontal: THEME.spacing.lg,
  },
  submitBtn: {
    backgroundColor: THEME.colors.primary,
    height: 48,
    borderRadius: THEME.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  submitBtnText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
