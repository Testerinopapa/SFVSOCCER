import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { KitPreview } from '../components/KitPreview';
import { AI_CLUB_INFO } from '../data/mockData';

interface AIMatchSetupModalProps {
  visible: boolean;
  onClose: () => void;
  onStartMatch: (userUniformNum: 1 | 2, aiUniformNum: 1 | 2, mode: 'unity3d' | 'simulation2d') => void;
}

export const AIMatchSetupModal: React.FC<AIMatchSetupModalProps> = ({
  visible,
  onClose,
  onStartMatch,
}) => {
  const { club } = useApp();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [selectedUniformNum, setSelectedUniformNum] = useState<1 | 2>(1);
  const [matchMode, setMatchMode] = useState<'unity3d' | 'simulation2d'>('unity3d');

  // AI wears white (Uniform 1) unless user is wearing bright/white, in which case AI wears black (Uniform 2)
  const aiUniformNum: 1 | 2 = selectedUniformNum === 1 ? 1 : 2;

  const handleNextOrStart = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else {
      onClose();
      onStartMatch(selectedUniformNum, aiUniformNum, matchMode);
    }
  };

  const startingEleven = club.lineup.map(id => club.squad.find(p => p.id === id)).filter(Boolean);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>JOGAR CONTRA IA (SFV)</Text>
              <Text style={styles.stepIndicator}>
                ETAPA {currentStep} DE 2: {currentStep === 1 ? 'ESCOLHER UNIFORME' : 'CONFIRMAR ESCALAÇÃO'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
            {/* STEP 1: CHOOSE UNIFORM */}
            {currentStep === 1 && (
              <View>
                <Text style={styles.sectionHeader}>Selecione o uniforme do seu clube:</Text>

                <View style={styles.uniformSelectRow}>
                  {/* Option 1: Uniforme 1 */}
                  <TouchableOpacity
                    style={[
                      styles.uniformCard,
                      selectedUniformNum === 1 && styles.uniformCardSelected,
                    ]}
                    onPress={() => setSelectedUniformNum(1)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.uniformCardHeader}>
                      <Text
                        style={[
                          styles.uniformCardTitle,
                          selectedUniformNum === 1 && styles.uniformCardTitleActive,
                        ]}
                      >
                        UNIFORME 1
                      </Text>
                      {selectedUniformNum === 1 && (
                        <Ionicons name="checkmark-circle" size={18} color={THEME.colors.primary} />
                      )}
                    </View>
                    <KitPreview uniform={club.uniform1} size="md" />
                    <Text style={styles.uniformCardFooter}>Titular do Clube</Text>
                  </TouchableOpacity>

                  {/* Option 2: Uniforme 2 */}
                  <TouchableOpacity
                    style={[
                      styles.uniformCard,
                      selectedUniformNum === 2 && styles.uniformCardSelected,
                    ]}
                    onPress={() => setSelectedUniformNum(2)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.uniformCardHeader}>
                      <Text
                        style={[
                          styles.uniformCardTitle,
                          selectedUniformNum === 2 && styles.uniformCardTitleActive,
                        ]}
                      >
                        UNIFORME 2
                      </Text>
                      {selectedUniformNum === 2 && (
                        <Ionicons name="checkmark-circle" size={18} color={THEME.colors.primary} />
                      )}
                    </View>
                    <KitPreview uniform={club.uniform2} size="md" />
                    <Text style={styles.uniformCardFooter}>Reserva do Clube</Text>
                  </TouchableOpacity>
                </View>

                {/* Opponent AI Uniform Preview */}
                <View style={styles.aiOpponentBox}>
                  <Text style={styles.aiOpponentTitle}>Uniforme do Adversário (Time IA SFV):</Text>
                  <View style={styles.aiOpponentRow}>
                    <KitPreview
                      uniform={aiUniformNum === 1 ? AI_CLUB_INFO.uniform1 : AI_CLUB_INFO.uniform2}
                      size="sm"
                    />
                    <View style={styles.aiOpponentTextCol}>
                      <Text style={styles.aiOpponentClubName}>TIME IA: SFV</Text>
                      <Text style={styles.aiOpponentKitDesc}>
                        {aiUniformNum === 1 ? 'Uniforme 1 (Todo Branco)' : 'Uniforme 2 (Todo Preto)'}
                      </Text>
                      <Text style={styles.aiOpponentNote}>
                        O sistema ajusta o contraste de cores para evitar conflito visual em campo.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* STEP 2: CONFIRM LINEUP */}
            {currentStep === 2 && (
              <View>
                {/* Engine Selector */}
                <Text style={styles.sectionHeader}>Selecione o Modo da Partida:</Text>
                <View style={styles.engineChoiceRow}>
                  {/* Option 1: Unity 3D */}
                  <TouchableOpacity
                    style={[
                      styles.engineCard,
                      matchMode === 'unity3d' && styles.engineCardActive,
                    ]}
                    onPress={() => setMatchMode('unity3d')}
                    activeOpacity={0.8}
                  >
                    <View style={styles.engineCardTop}>
                      <MaterialCommunityIcons
                        name="unity"
                        size={22}
                        color={matchMode === 'unity3d' ? THEME.colors.primary : THEME.colors.textSecondary}
                      />
                      <View style={styles.badge3D}>
                        <Text style={styles.badge3DText}>3D • 60 FPS</Text>
                      </View>
                    </View>
                    <Text style={[styles.engineCardTitle, matchMode === 'unity3d' && styles.engineCardTitleActive]}>
                      Soccer Unity 3D
                    </Text>
                    <Text style={styles.engineCardDesc}>
                      Partida 3D em tempo real com física, uniforme e estádio.
                    </Text>
                  </TouchableOpacity>

                  {/* Option 2: 2D Sim */}
                  <TouchableOpacity
                    style={[
                      styles.engineCard,
                      matchMode === 'simulation2d' && styles.engineCardActive,
                    ]}
                    onPress={() => setMatchMode('simulation2d')}
                    activeOpacity={0.8}
                  >
                    <View style={styles.engineCardTop}>
                      <Ionicons
                        name="flash-outline"
                        size={20}
                        color={matchMode === 'simulation2d' ? THEME.colors.primary : THEME.colors.textSecondary}
                      />
                      <View style={styles.badge2D}>
                        <Text style={styles.badge2DText}>SIMULAÇÃO</Text>
                      </View>
                    </View>
                    <Text style={[styles.engineCardTitle, matchMode === 'simulation2d' && styles.engineCardTitleActive]}>
                      Simulador 2D
                    </Text>
                    <Text style={styles.engineCardDesc}>
                      Lances de texto com controle de velocidade 1x/2x/Pular.
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.lineupOverviewRow}>
                  <Text style={styles.sectionHeader}>Onze Titulares Confirmados:</Text>
                  <View style={styles.formationPill}>
                    <Text style={styles.formationPillText}>{club.formation}</Text>
                  </View>
                </View>

                <View style={styles.lineupList}>
                  {startingEleven.map((player, idx) => (
                    <View key={player?.id || idx} style={styles.lineupItem}>
                      <View style={styles.lineupNumBadge}>
                        <Text style={styles.lineupNumText}>{player?.number}</Text>
                      </View>
                      <View style={styles.lineupInfoCol}>
                        <Text style={styles.lineupName} numberOfLines={1}>
                          {player?.name}
                        </Text>
                        <Text style={styles.lineupStats}>
                          Nv {player?.level} • Vel {player?.stats.velocidade} • Fin {player?.stats.finalizacao}
                        </Text>
                      </View>
                      <View style={styles.lineupPosBadge}>
                        <Text style={styles.lineupPosText}>{player?.position}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer Navigation */}
          <View style={styles.footer}>
            {currentStep === 2 && (
              <TouchableOpacity
                style={styles.backStepBtn}
                onPress={() => setCurrentStep(1)}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={18} color={THEME.colors.textSecondary} />
                <Text style={styles.backStepBtnText}>VOLTAR</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.primaryBtn,
                currentStep === 2 && styles.primaryBtnStart,
              ]}
              onPress={handleNextOrStart}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.primaryBtnText,
                  currentStep === 2 && styles.primaryBtnStartText,
                ]}
              >
                {currentStep === 1
                  ? 'CONFIRMAR ESCALAÇÃO'
                  : matchMode === 'unity3d'
                  ? 'JOGAR EM 3D (UNITY)'
                  : 'INICIAR SIMULAÇÃO 2D'}
              </Text>
              <Ionicons
                name={currentStep === 1 ? 'arrow-forward' : 'football'}
                size={18}
                color="#000"
              />
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
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: THEME.colors.card,
    borderTopLeftRadius: THEME.radius.lg,
    borderTopRightRadius: THEME.radius.lg,
    maxHeight: '88%',
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
    color: THEME.colors.text,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  stepIndicator: {
    color: THEME.colors.primary,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 6,
  },
  body: {
    maxHeight: 460,
  },
  bodyContent: {
    padding: THEME.spacing.lg,
  },
  sectionHeader: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  engineChoiceRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: THEME.spacing.lg,
  },
  engineCard: {
    flex: 1,
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.md,
    padding: 12,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
  },
  engineCardActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
  },
  engineCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  badge3D: {
    backgroundColor: 'rgba(0, 230, 118, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  badge3DText: {
    color: THEME.colors.primary,
    fontSize: 9,
    fontWeight: '900',
  },
  badge2D: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.colors.gold,
  },
  badge2DText: {
    color: THEME.colors.gold,
    fontSize: 9,
    fontWeight: '900',
  },
  engineCardTitle: {
    color: THEME.colors.text,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  engineCardTitleActive: {
    color: THEME.colors.primary,
  },
  engineCardDesc: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    lineHeight: 14,
  },
  uniformSelectRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: THEME.spacing.lg,
  },
  uniformCard: {
    flex: 1,
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.md,
    padding: 12,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    alignItems: 'center',
  },
  uniformCardSelected: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
  },
  uniformCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 4,
  },
  uniformCardTitle: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '900',
  },
  uniformCardTitleActive: {
    color: THEME.colors.primary,
  },
  uniformCardFooter: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 6,
  },
  aiOpponentBox: {
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  aiOpponentTitle: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 8,
  },
  aiOpponentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiOpponentTextCol: {
    flex: 1,
  },
  aiOpponentClubName: {
    color: THEME.colors.gold,
    fontSize: 14,
    fontWeight: '900',
  },
  aiOpponentKitDesc: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  aiOpponentNote: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    marginTop: 4,
  },
  lineupOverviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  formationPill: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  formationPillText: {
    color: THEME.colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  lineupList: {
    gap: 6,
  },
  lineupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.sm,
    padding: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  lineupNumBadge: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: THEME.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  lineupNumText: {
    color: THEME.colors.gold,
    fontSize: 11,
    fontWeight: '900',
  },
  lineupInfoCol: {
    flex: 1,
  },
  lineupName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  lineupStats: {
    color: THEME.colors.textMuted,
    fontSize: 9,
    marginTop: 1,
  },
  lineupPosBadge: {
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  lineupPosText: {
    color: THEME.colors.primary,
    fontSize: 10,
    fontWeight: '900',
  },
  footer: {
    flexDirection: 'row',
    padding: THEME.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    gap: 10,
  },
  backStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.cardElevated,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 6,
  },
  backStepBtnText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
  },
  primaryBtn: {
    flex: 1,
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
  primaryBtnStart: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.gold,
    borderWidth: 1.5,
  },
  primaryBtnText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  primaryBtnStartText: {
    fontSize: 14,
  },
});
