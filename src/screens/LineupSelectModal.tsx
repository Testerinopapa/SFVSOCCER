import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Player } from '../types';
import { FORMATIONS_MAP } from '../data/mockData';

interface LineupSelectModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LineupSelectModal: React.FC<LineupSelectModalProps> = ({ visible, onClose }) => {
  const { club, selectedLineupSlot, setLineupPlayer } = useApp();

  if (selectedLineupSlot === null) return null;

  const currentFormation = FORMATIONS_MAP[club.formation] || FORMATIONS_MAP['4-3-3'];
  const targetNode = currentFormation.nodes[selectedLineupSlot];
  const targetRole = targetNode?.role || 'JOGADOR';

  const handleSelect = (player: Player) => {
    setLineupPlayer(selectedLineupSlot, player.id);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>ESCALAR PARA: {targetRole}</Text>
              <Text style={styles.subtitle}>Escolha um atleta do seu elenco para esta posição</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* List of squad players */}
          <FlatList
            data={club.squad}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isCurrentInSlot = club.lineup[selectedLineupSlot] === item.id;
              const isStartingElsewhere = club.lineup.includes(item.id) && !isCurrentInSlot;
              const isMatchingPosition = item.position === targetRole;

              return (
                <TouchableOpacity
                  style={[
                    styles.playerRow,
                    isCurrentInSlot && styles.playerRowActive,
                  ]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.numberBox}>
                    <Text style={styles.numberText}>{item.number}</Text>
                  </View>

                  <View style={styles.infoCol}>
                    <View style={styles.nameRow}>
                      <Text style={styles.nameText}>{item.name}</Text>
                      {isCurrentInSlot && (
                        <View style={styles.badgeSelected}>
                          <Text style={styles.badgeSelectedText}>ATUAL</Text>
                        </View>
                      )}
                      {isStartingElsewhere && (
                        <View style={styles.badgeSwap}>
                          <Text style={styles.badgeSwapText}>TROCA</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.metaRow}>
                      <Text
                        style={[
                          styles.posText,
                          isMatchingPosition && { color: THEME.colors.primary },
                        ]}
                      >
                        {item.position}
                      </Text>
                      <Text style={styles.levelText}>Nv {item.level}</Text>
                      <Text style={styles.statSummary}>
                        Vel {item.stats.velocidade} • Fin {item.stats.finalizacao} • Def {item.stats.defesa}
                      </Text>
                    </View>
                  </View>

                  <Ionicons
                    name={isCurrentInSlot ? 'checkmark-circle' : 'add-circle-outline'}
                    size={24}
                    color={isCurrentInSlot ? THEME.colors.primary : THEME.colors.textSecondary}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: THEME.colors.card,
    borderTopLeftRadius: THEME.radius.lg,
    borderTopRightRadius: THEME.radius.lg,
    maxHeight: '75%',
    borderWidth: 1,
    borderColor: THEME.colors.border,
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
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  listContent: {
    padding: THEME.spacing.md,
    gap: 8,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  playerRowActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
  },
  numberBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: THEME.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  numberText: {
    color: THEME.colors.gold,
    fontSize: 13,
    fontWeight: '900',
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  badgeSelected: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  badgeSelectedText: {
    color: '#000000',
    fontSize: 8,
    fontWeight: '900',
  },
  badgeSwap: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  badgeSwapText: {
    color: THEME.colors.gold,
    fontSize: 8,
    fontWeight: '900',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  posText: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
  },
  levelText: {
    color: THEME.colors.gold,
    fontSize: 10,
    fontWeight: '700',
  },
  statSummary: {
    color: THEME.colors.textMuted,
    fontSize: 10,
  },
});
