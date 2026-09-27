import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';

interface PlayMenuModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectAIMatch: () => void;
}

export const PlayMenuModal: React.FC<PlayMenuModalProps> = ({
  visible,
  onClose,
  onSelectAIMatch,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>MODO DE JOGO</Text>
              <Text style={styles.subtitle}>Escolha como deseja disputar sua partida</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {/* OPTION 1: JOGAR CONTRA IA (Active) */}
            <TouchableOpacity
              style={styles.activePlayCard}
              onPress={() => {
                onClose();
                onSelectAIMatch();
              }}
              activeOpacity={0.85}
            >
              <View style={styles.cardIconBoxActive}>
                <Ionicons name="hardware-chip-outline" size={32} color="#000" />
              </View>
              <View style={styles.cardContent}>
                <View style={styles.statusPillActive}>
                  <Text style={styles.statusPillActiveText}>DISPONÍVEL NO PROTÓTIPO</Text>
                </View>
                <Text style={styles.cardTitle}>JOGAR CONTRA IA</Text>
                <Text style={styles.cardDescription}>
                  Simulação completa contra o clube oficial SFV com eventos ao vivo e premiação em SV.
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color={THEME.colors.primary} />
            </TouchableOpacity>

            {/* OPTION 2: PARTIDA DE TORNEIO (Disabled prototype concept) */}
            <View style={styles.disabledPlayCard}>
              <View style={styles.cardIconBoxDisabled}>
                <Ionicons name="trophy-outline" size={28} color={THEME.colors.textMuted} />
              </View>
              <View style={styles.cardContent}>
                <View style={styles.statusPillDisabled}>
                  <Text style={styles.statusPillDisabledText}>Disponível na versão online</Text>
                </View>
                <Text style={styles.cardTitleDisabled}>PARTIDA DE TORNEIO</Text>
                <Text style={styles.cardDescriptionDisabled}>
                  Jogos oficiais de rodada da liga de divisão com pontuação para acesso.
                </Text>
              </View>
              <Ionicons name="lock-closed" size={20} color={THEME.colors.textMuted} />
            </View>

            {/* OPTION 3: AMISTOSO MULTIPLAYER (Disabled prototype concept) */}
            <View style={styles.disabledPlayCard}>
              <View style={styles.cardIconBoxDisabled}>
                <MaterialCommunityIcons name="account-multiple" size={28} color={THEME.colors.textMuted} />
              </View>
              <View style={styles.cardContent}>
                <View style={styles.statusPillDisabled}>
                  <Text style={styles.statusPillDisabledText}>Disponível na versão online</Text>
                </View>
                <Text style={styles.cardTitleDisabled}>AMISTOSO MULTIPLAYER</Text>
                <Text style={styles.cardDescriptionDisabled}>
                  Desafie outros donos de clubes em partidas amistosas customizadas.
                </Text>
              </View>
              <Ionicons name="lock-closed" size={20} color={THEME.colors.textMuted} />
            </View>
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
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: THEME.colors.card,
    borderTopLeftRadius: THEME.radius.lg,
    borderTopRightRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingBottom: 24,
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
    fontSize: 16,
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
    gap: 12,
  },
  activePlayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 2,
    borderColor: THEME.colors.primary,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  cardIconBoxActive: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  statusPillActive: {
    backgroundColor: 'rgba(0, 230, 118, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  statusPillActiveText: {
    color: THEME.colors.primary,
    fontSize: 9,
    fontWeight: '900',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardDescription: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  disabledPlayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(19, 34, 53, 0.5)',
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    opacity: 0.7,
  },
  cardIconBoxDisabled: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME.colors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  statusPillDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  statusPillDisabledText: {
    color: THEME.colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
  },
  cardTitleDisabled: {
    color: THEME.colors.textSecondary,
    fontSize: 14,
    fontWeight: '800',
  },
  cardDescriptionDisabled: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
});
