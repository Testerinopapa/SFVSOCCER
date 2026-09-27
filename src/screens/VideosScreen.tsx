import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Player } from '../types';

interface VideosScreenProps {
  visible: boolean;
  onClose: () => void;
}

export const VideosScreen: React.FC<VideosScreenProps> = ({ visible, onClose }) => {
  const { club, addXPToPlayer } = useApp();

  const [isPlayingAd, setIsPlayingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [rewardUnlocked, setRewardUnlocked] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    if (isPlayingAd) {
      setAdCountdown(5);
      const timer = setInterval(() => {
        setAdCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsPlayingAd(false);
            setRewardUnlocked(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isPlayingAd]);

  const handleStartVideo = () => {
    setRewardUnlocked(false);
    setSelectedPlayer(null);
    setIsPlayingAd(true);
  };

  const handleApplyXP = () => {
    if (!selectedPlayer) {
      Alert.alert('Atenção', 'Selecione um jogador para receber os +25 XP.');
      return;
    }

    const res = addXPToPlayer(selectedPlayer.id, 25);
    setRewardUnlocked(false);

    if (res.leveledUp) {
      Alert.alert(
        '🎉 NÍVEL AUMENTOU!',
        `Parabéns! ${selectedPlayer.name} atingiu a meta de experiência e agora é NÍVEL ${res.newLevel}! Seus atributos foram aprimorados.`
      );
    } else {
      Alert.alert(
        'Recompensa Aplicada!',
        `+25 XP adicionados com sucesso ao jogador ${selectedPlayer.name}.`
      );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>VÍDEOS & RECOMPENSAS</Text>
              <Text style={styles.subtitle}>Assista e evolua seus jogadores</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setIsPlayingAd(false);
                setRewardUnlocked(false);
                onClose();
              }}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={24} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* STATE 1: AD PLAYBACK SIMULATION */}
          {isPlayingAd ? (
            <View style={styles.videoSimContainer}>
              <View style={styles.videoPlaceholder}>
                <Ionicons name="film-outline" size={54} color={THEME.colors.primary} />
                <Text style={styles.videoAdTitle}>EXIBINDO VÍDEO PROMOCIONAL</Text>
                <Text style={styles.videoAdSub}>Simulação de anúncio de recompensa do protótipo</Text>

                <View style={styles.countdownPill}>
                  <Text style={styles.countdownText}>
                    Aguarde {adCountdown}s para liberar +25 XP...
                  </Text>
                </View>

                {/* Progress bar */}
                <View style={styles.adProgressBarBg}>
                  <View
                    style={[
                      styles.adProgressBarFill,
                      { width: `${((5 - adCountdown) / 5) * 100}%` },
                    ]}
                  />
                </View>
              </View>
            </View>
          ) : rewardUnlocked ? (
            /* STATE 2: REWARD UNLOCKED - CHOOSE PLAYER */
            <View style={styles.rewardContainer}>
              <View style={styles.rewardUnlockedBanner}>
                <Ionicons name="checkmark-circle" size={28} color={THEME.colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rewardUnlockedTitle}>RECOMPENSA LIBERADA!</Text>
                  <Text style={styles.rewardUnlockedSub}>
                    Escolha um jogador do elenco para receber os <Text style={{ color: THEME.colors.primary, fontWeight: '900' }}>+25 XP</Text>:
                  </Text>
                </View>
              </View>

              <FlatList
                data={club.squad}
                keyExtractor={item => item.id}
                style={styles.squadPickList}
                contentContainerStyle={{ gap: 6, paddingVertical: 4 }}
                renderItem={({ item }) => {
                  const isSelected = selectedPlayer?.id === item.id;
                  const willLevelUp = item.xp + 25 >= item.xpMax && item.level < 10;

                  return (
                    <TouchableOpacity
                      style={[styles.playerPickRow, isSelected && styles.playerPickRowActive]}
                      onPress={() => setSelectedPlayer(item)}
                    >
                      <View style={styles.playerNum}>
                        <Text style={styles.playerNumText}>{item.number}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={styles.pickName}>{item.name}</Text>
                          <Text style={styles.pickPos}>{item.position}</Text>
                          {willLevelUp && (
                            <View style={styles.levelUpSoonBadge}>
                              <Text style={styles.levelUpSoonText}>SOBE DE NÍVEL!</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.pickXp}>
                          Nível {item.level} • {item.xp} / {item.xpMax} XP (+25)
                        </Text>
                      </View>
                      <Ionicons
                        name={isSelected ? 'checkmark-circle' : 'radio-button-off'}
                        size={22}
                        color={isSelected ? THEME.colors.primary : THEME.colors.textMuted}
                      />
                    </TouchableOpacity>
                  );
                }}
              />

              <TouchableOpacity
                style={[styles.applyBtn, !selectedPlayer && styles.applyBtnDisabled]}
                onPress={handleApplyXP}
                disabled={!selectedPlayer}
              >
                <Text style={styles.applyBtnText}>EVOLUIR JOGADOR (+25 XP)</Text>
                <Ionicons name="sparkles" size={18} color="#000" />
              </TouchableOpacity>
            </View>
          ) : (
            /* STATE 3: DEFAULT VIDEO PROMPT */
            <View style={styles.defaultBody}>
              <View style={styles.promoCard}>
                <View style={styles.promoIconCircle}>
                  <Ionicons name="videocam" size={32} color={THEME.colors.primary} />
                </View>
                <Text style={styles.promoTitle}>TREINAMENTO EM VÍDEO</Text>
                <Text style={styles.promoSubtitle}>
                  Assista a vídeos demonstrativos e acumule pontos de experiência para transformar seus atletas em lendas do futebol virtual.
                </Text>

                <View style={styles.rewardPill}>
                  <Text style={styles.rewardPillText}>RECOMPENSA: +25 XP POR VÍDEO</Text>
                </View>

                <TouchableOpacity
                  style={styles.watchBtn}
                  onPress={handleStartVideo}
                  activeOpacity={0.85}
                >
                  <Ionicons name="play-circle" size={24} color="#000" />
                  <Text style={styles.watchBtnText}>ASSISTIR VÍDEO (5s)</Text>
                </TouchableOpacity>

                <Text style={styles.disclaimerText}>
                  * Protótipo com simulação offline de 5 segundos para avaliação de fluxo e evolução de atletas.
                </Text>
              </View>
            </View>
          )}
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
  defaultBody: {
    padding: THEME.spacing.lg,
  },
  promoCard: {
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.md,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  promoIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  promoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  promoSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 6,
    marginBottom: 14,
  },
  rewardPill: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.35)',
    marginBottom: 16,
  },
  rewardPillText: {
    color: THEME.colors.gold,
    fontSize: 11,
    fontWeight: '900',
  },
  watchBtn: {
    backgroundColor: THEME.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    height: 50,
    borderRadius: THEME.radius.md,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  watchBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  disclaimerText: {
    color: THEME.colors.textMuted,
    fontSize: 9,
    textAlign: 'center',
    marginTop: 14,
  },
  videoSimContainer: {
    padding: 24,
    minHeight: 280,
    justifyContent: 'center',
  },
  videoPlaceholder: {
    backgroundColor: THEME.colors.backgroundDark,
    borderRadius: THEME.radius.lg,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  videoAdTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 14,
    letterSpacing: 0.5,
  },
  videoAdSub: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  countdownPill: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: THEME.radius.full,
    marginTop: 20,
    marginBottom: 14,
  },
  countdownText: {
    color: THEME.colors.gold,
    fontSize: 12,
    fontWeight: '900',
  },
  adProgressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  adProgressBarFill: {
    height: '100%',
    backgroundColor: THEME.colors.primary,
  },
  rewardContainer: {
    padding: THEME.spacing.md,
    maxHeight: 460,
  },
  rewardUnlockedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    borderRadius: THEME.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    gap: 10,
    marginBottom: 10,
  },
  rewardUnlockedTitle: {
    color: THEME.colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  rewardUnlockedSub: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  squadPickList: {
    maxHeight: 260,
  },
  playerPickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  playerPickRowActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
  },
  playerNum: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: THEME.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  playerNumText: {
    color: THEME.colors.gold,
    fontSize: 11,
    fontWeight: '900',
  },
  pickName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  pickPos: {
    color: THEME.colors.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  levelUpSoonBadge: {
    backgroundColor: '#FF3D00',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  levelUpSoonText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  pickXp: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  applyBtn: {
    backgroundColor: THEME.colors.primary,
    height: 48,
    borderRadius: THEME.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  applyBtnDisabled: {
    backgroundColor: THEME.colors.cardElevated,
    opacity: 0.5,
  },
  applyBtnText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
