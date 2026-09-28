import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { MatchEvent, MatchResult } from '../types';
import { AdService } from '../ads';

interface MatchSimulationModalProps {
  visible: boolean;
  onFinishMatch: (result: MatchResult) => void;
  userUniformNum: 1 | 2;
  aiUniformNum: 1 | 2;
}

export const MatchSimulationModal: React.FC<MatchSimulationModalProps> = ({
  visible,
  onFinishMatch,
  userUniformNum,
  aiUniformNum,
}) => {
  const { club } = useApp();

  const [currentMinute, setCurrentMinute] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [speed, setSpeed] = useState<1 | 2>(1);
  const [goalFlash, setGoalFlash] = useState<string | null>(null);

  const flashAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // Generate randomized match scenario upon open
  const matchScenarioRef = useRef<{
    finalUserScore: number;
    finalAiScore: number;
    timeline: MatchEvent[];
  }>({
    finalUserScore: 2,
    finalAiScore: 1,
    timeline: [],
  });

  const [isHalftime, setIsHalftime] = useState(false);
  const halftimeTriggeredRef = useRef(false);

  useEffect(() => {
    if (visible) {
      setCurrentMinute(0);
      setUserScore(0);
      setAiScore(0);
      setEvents([]);
      setGoalFlash(null);
      setIsHalftime(false);
      halftimeTriggeredRef.current = false;

      // Random outcome generation: 55% Win, 25% Draw, 20% Loss for engaging prototype feel
      const roll = Math.random();
      let uScore = 2;
      let aScore = 1;

      if (roll < 0.55) {
        // Win
        uScore = Math.floor(Math.random() * 3) + 1; // 1 to 3
        aScore = Math.max(0, uScore - (Math.floor(Math.random() * 2) + 1));
      } else if (roll < 0.8) {
        // Draw
        uScore = Math.floor(Math.random() * 3);
        aScore = uScore;
      } else {
        // Loss
        aScore = Math.floor(Math.random() * 3) + 1;
        uScore = Math.max(0, aScore - (Math.floor(Math.random() * 2) + 1));
      }

      // Generate events along 90 mins
      const startingPlayers = club.lineup
        .map(id => club.squad.find(p => p.id === id))
        .filter(Boolean);
      const attackPlayers = startingPlayers.filter(p => ['AT', 'PT', 'MO', 'MC'].includes(p?.position || ''));
      const getRandomUserScorer = () =>
        attackPlayers[Math.floor(Math.random() * attackPlayers.length)]?.name || 'Lucas Almeida';

      const timeline: MatchEvent[] = [];

      // User goals
      for (let i = 0; i < uScore; i++) {
        const min = Math.floor(Math.random() * 75) + 8;
        timeline.push({
          minute: min,
          type: 'gol',
          team: 'user',
          player: getRandomUserScorer(),
          text: `GOL DO ${club.name}! Finalização espetacular na gaveta!`,
        });
      }

      // AI goals
      for (let i = 0; i < aScore; i++) {
        const min = Math.floor(Math.random() * 75) + 10;
        timeline.push({
          minute: min,
          type: 'gol',
          team: 'opponent',
          player: 'SFV IA',
          text: 'GOL DO SFV! Contra-ataque veloz empata ou amplia o placar.',
        });
      }

      // Yellow Cards (0 to 2)
      const yellowCount = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < yellowCount; i++) {
        const pName = startingPlayers[Math.floor(Math.random() * startingPlayers.length)]?.name || 'Marcos Silva';
        timeline.push({
          minute: Math.floor(Math.random() * 60) + 15,
          type: 'cartao_amarelo',
          team: 'user',
          player: pName,
          text: `Cartão Amarelo para ${pName} por falta tática. (-1 SV)`,
        });
      }

      // Red Card rare chance (10%)
      if (Math.random() < 0.12) {
        timeline.push({
          minute: 74,
          type: 'cartao_vermelho',
          team: 'user',
          player: 'Danilo Pires',
          text: 'Cartão Vermelho direto para Danilo Pires! Falta dura. (-2 SV)',
        });
      }

      // Substitution
      timeline.push({
        minute: 62,
        type: 'substituicao',
        team: 'user',
        text: 'Substituição no SFV Welton: entra sangue novo para pressionar.',
      });

      // Sort timeline by minute
      timeline.sort((a, b) => a.minute - b.minute);

      matchScenarioRef.current = {
        finalUserScore: uScore,
        finalAiScore: aScore,
        timeline,
      };
    }
  }, [visible]);

  // Simulation timer
  useEffect(() => {
    if (!visible || isHalftime) return;

    const intervalTime = speed === 1 ? 160 : 80;

    const timer = setInterval(() => {
      setCurrentMinute(prev => {
        // Stop timer at 45' for halftime
        if (prev >= 44 && !halftimeTriggeredRef.current) {
          halftimeTriggeredRef.current = true;
          setIsHalftime(true);
          return 45;
        }

        const nextMin = prev + 1;

        // Check if any event happens at this minute
        const eventsAtMinute = matchScenarioRef.current.timeline.filter(e => e.minute === nextMin);
        if (eventsAtMinute.length > 0) {
          setEvents(curr => [...curr, ...eventsAtMinute]);

          eventsAtMinute.forEach(e => {
            if (e.type === 'gol') {
              if (e.team === 'user') {
                setUserScore(s => s + 1);
                triggerGoalFlash(`${club.name} MARCOU!`);
              } else {
                setAiScore(s => s + 1);
                triggerGoalFlash('GOL DO SFV IA!');
              }
            }
          });
        }

        if (nextMin >= 90) {
          clearInterval(timer);
          setTimeout(async () => {
            try {
              await AdService.showMatchVideo('post_match');
            } catch (e) {
              console.warn('[MatchSimulationModal] Post-match ad error:', e);
            } finally {
              finishSimulation();
            }
          }, 600);
          return 90;
        }

        return nextMin;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [visible, speed, isHalftime]);

  // Dedicated Halftime Video Ad Trigger
  useEffect(() => {
    if (!visible) return;
    if (isHalftime) {
      console.log('[MatchSimulationModal] Halftime reached, presenting video ad...');
      AdService.showMatchVideo('halftime').finally(() => {
        console.log('[MatchSimulationModal] Halftime ad finished. Resuming second half.');
        setIsHalftime(false);
      });
    }
  }, [visible, isHalftime]);

  const triggerGoalFlash = (text: string) => {
    setGoalFlash(text);
    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(flashAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start(() => setGoalFlash(null));
  };

  const finishSimulation = () => {
    const { finalUserScore, finalAiScore, timeline } = matchScenarioRef.current;

    const yellowCount = timeline.filter(e => e.team === 'user' && e.type === 'cartao_amarelo').length;
    const redCount = timeline.filter(e => e.team === 'user' && e.type === 'cartao_vermelho').length;

    // Rules from prompt:
    // 1 SV per goal
    // 3 SV for victory
    // 1 SV for each club in draw
    // 1 SV fair play consolation for losing club that did not abandon
    // -1 SV yellow card
    // -2 SV red card
    const goalSV = finalUserScore * 1;
    let resultSV = 0;
    let resultText = '';

    if (finalUserScore > finalAiScore) {
      resultSV = 3;
      resultText = 'Vitória Oficial (+3 SV)';
    } else if (finalUserScore === finalAiScore) {
      resultSV = 1;
      resultText = 'Empate Oficial (+1 SV)';
    } else {
      resultSV = 1;
      resultText = 'Consolação Fair Play (+1 SV)';
    }

    const yellowPenaltySV = yellowCount * 1;
    const redPenaltySV = redCount * 2;
    const totalSV = Math.max(0, goalSV + resultSV - yellowPenaltySV - redPenaltySV);

    const matchResultData: MatchResult = {
      userScore: finalUserScore,
      opponentScore: finalAiScore,
      opponentName: 'SFV (IA)',
      events: timeline,
      stats: {
        posseUser: Math.floor(Math.random() * 14) + 48, // 48 - 62%
        posseOpp: 0,
        finalizacoesUser: finalUserScore + Math.floor(Math.random() * 5) + 3,
        finalizacoesOpp: finalAiScore + Math.floor(Math.random() * 4) + 2,
        noGolUser: finalUserScore + Math.floor(Math.random() * 3),
        noGolOpp: finalAiScore + Math.floor(Math.random() * 2),
        faltasUser: yellowCount * 2 + Math.floor(Math.random() * 4) + 2,
        faltasOpp: Math.floor(Math.random() * 6) + 4,
        cartoesUser: yellowCount + redCount,
        cartoesOpp: Math.floor(Math.random() * 2),
      },
      rewards: {
        goalsUser: finalUserScore,
        goalSV,
        resultSV,
        resultText,
        yellowCount,
        yellowPenaltySV,
        redCount,
        redPenaltySV,
        totalSV,
      },
    };

    matchResultData.stats.posseOpp = 100 - matchResultData.stats.posseUser;

    onFinishMatch(matchResultData);
  };

  const handleSkipToEnd = async () => {
    setCurrentMinute(90);
    setUserScore(matchScenarioRef.current.finalUserScore);
    setAiScore(matchScenarioRef.current.finalAiScore);
    setEvents(matchScenarioRef.current.timeline);
    try {
      await AdService.showMatchVideo('post_match');
    } catch (e) {
      console.warn('[MatchSimulationModal] Skip post-match ad error:', e);
    } finally {
      finishSimulation();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header Scoreboard */}
          <View style={styles.scoreboard}>
            {/* User Club */}
            <View style={styles.scoreClubCol}>
              <View style={[styles.scoreKitCircle, { backgroundColor: club.uniform1.camisa }]} />
              <Text style={styles.scoreClubName} numberOfLines={1}>
                {club.name}
              </Text>
            </View>

            {/* Live Score & Clock */}
            <View style={styles.scoreCenter}>
              <View style={styles.clockPill}>
                <Ionicons name="stopwatch-outline" size={12} color={THEME.colors.gold} style={{ marginRight: 4 }} />
                <Text style={styles.clockText}>
                  {currentMinute < 10 ? `0${currentMinute}` : currentMinute}:00
                </Text>
              </View>

              <View style={styles.scoreNumbersRow}>
                <Text style={styles.scoreDigit}>{userScore}</Text>
                <Text style={styles.scoreDivider}>-</Text>
                <Text style={styles.scoreDigit}>{aiScore}</Text>
              </View>
            </View>

            {/* AI Club */}
            <View style={styles.scoreClubCol}>
              <View style={[styles.scoreKitCircle, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#000' }]} />
              <Text style={styles.scoreClubName} numberOfLines={1}>
                SFV (IA)
              </Text>
            </View>
          </View>

          {/* Goal Flash Overlay */}
          {goalFlash && (
            <Animated.View style={[styles.goalFlashBanner, { opacity: flashAnim }]}>
              <Text style={styles.goalFlashText}>⚽ {goalFlash} ⚽</Text>
            </Animated.View>
          )}

          {/* Simulation Events Feed */}
          <View style={styles.feedBox}>
            <View style={styles.feedHeader}>
              <Text style={styles.feedTitle}>LANCES DA PARTIDA EM TEMPO REAL</Text>
              {currentMinute < 90 && (
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>AO VIVO</Text>
                </View>
              )}
            </View>

            <ScrollView
              ref={scrollViewRef}
              style={styles.eventsScroll}
              contentContainerStyle={styles.eventsScrollContent}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {events.length === 0 ? (
                <View style={styles.emptyFeed}>
                  <Ionicons name="football-outline" size={32} color={THEME.colors.borderLight} />
                  <Text style={styles.emptyFeedText}>A partida está começando! Rolou a bola no gramado...</Text>
                </View>
              ) : (
                events.map((ev, idx) => {
                  const isGoal = ev.type === 'gol';
                  const isYellow = ev.type === 'cartao_amarelo';
                  const isRed = ev.type === 'cartao_vermelho';

                  return (
                    <View
                      key={`${ev.minute}-${idx}`}
                      style={[
                        styles.eventRow,
                        isGoal && styles.eventRowGoal,
                        isYellow && styles.eventRowYellow,
                        isRed && styles.eventRowRed,
                      ]}
                    >
                      <View style={styles.minuteBadge}>
                        <Text style={styles.minuteText}>{ev.minute}'</Text>
                      </View>

                      <View style={styles.eventIcon}>
                        {isGoal && <Text style={{ fontSize: 18 }}>⚽</Text>}
                        {isYellow && <View style={styles.cardYellow} />}
                        {isRed && <View style={styles.cardRed} />}
                        {ev.type === 'substituicao' && (
                          <MaterialCommunityIcons name="swap-horizontal" size={18} color={THEME.colors.primary} />
                        )}
                      </View>

                      <View style={styles.eventTextCol}>
                        <Text style={styles.eventDesc}>{ev.text}</Text>
                        {ev.player && <Text style={styles.eventPlayer}>{ev.player}</Text>}
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
          </View>

          {/* Simulation Controls (Speed 1x, 2x, Skip) */}
          <View style={styles.controlsBar}>
            <View style={styles.speedToggle}>
              <TouchableOpacity
                style={[styles.speedBtn, speed === 1 && styles.speedBtnActive]}
                onPress={() => setSpeed(1)}
              >
                <Text style={[styles.speedText, speed === 1 && styles.speedTextActive]}>1x</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.speedBtn, speed === 2 && styles.speedBtnActive]}
                onPress={() => setSpeed(2)}
              >
                <Text style={[styles.speedText, speed === 2 && styles.speedTextActive]}>2x</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkipToEnd}
              activeOpacity={0.8}
            >
              <Ionicons name="play-forward" size={16} color={THEME.colors.gold} style={{ marginRight: 6 }} />
              <Text style={styles.skipButtonText}>Avançar para o Fim</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.md,
  },
  container: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    maxHeight: '92%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  scoreboard: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.cardElevated,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  scoreClubCol: {
    flex: 1,
    alignItems: 'center',
  },
  scoreKitCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  scoreClubName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  scoreCenter: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  clockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 3,
  },
  clockText: {
    color: THEME.colors.gold,
    fontSize: 11,
    fontWeight: '900',
  },
  scoreNumbersRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreDigit: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    minWidth: 26,
    textAlign: 'center',
  },
  scoreDivider: {
    color: THEME.colors.textMuted,
    fontSize: 20,
    fontWeight: '700',
    marginHorizontal: 6,
  },
  goalFlashBanner: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalFlashText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  feedBox: {
    flex: 1,
    minHeight: 100,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: THEME.colors.cardElevated,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  feedTitle: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 61, 0, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3D00',
    marginRight: 4,
  },
  liveText: {
    color: '#FF3D00',
    fontSize: 9,
    fontWeight: '900',
  },
  eventsScroll: {
    flex: 1,
    padding: 12,
  },
  eventsScrollContent: {
    gap: 8,
    paddingBottom: 20,
  },
  emptyFeed: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyFeedText: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  eventRowGoal: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
  },
  eventRowYellow: {
    borderColor: THEME.colors.yellowCard,
    backgroundColor: 'rgba(255, 234, 0, 0.1)',
  },
  eventRowRed: {
    borderColor: THEME.colors.redCard,
    backgroundColor: 'rgba(255, 61, 0, 0.12)',
  },
  minuteBadge: {
    width: 32,
    paddingVertical: 3,
    backgroundColor: THEME.colors.card,
    borderRadius: 4,
    alignItems: 'center',
    marginRight: 10,
  },
  minuteText: {
    color: THEME.colors.gold,
    fontSize: 11,
    fontWeight: '900',
  },
  eventIcon: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardYellow: {
    width: 12,
    height: 16,
    borderRadius: 2,
    backgroundColor: THEME.colors.yellowCard,
  },
  cardRed: {
    width: 12,
    height: 16,
    borderRadius: 2,
    backgroundColor: THEME.colors.redCard,
  },
  eventTextCol: {
    flex: 1,
  },
  eventDesc: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  eventPlayer: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  controlsBar: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    backgroundColor: THEME.colors.cardElevated,
  },
  speedToggle: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.sm,
    padding: 2,
  },
  speedBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  speedBtnActive: {
    backgroundColor: THEME.colors.primary,
  },
  speedText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
  },
  speedTextActive: {
    color: '#000000',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.35)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: THEME.radius.md,
  },
  skipButtonText: {
    color: THEME.colors.gold,
    fontSize: 11,
    fontWeight: '800',
  },
});
