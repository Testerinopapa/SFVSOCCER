import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  PanResponder,
  Animated,
  PanResponderInstance,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { MatchEvent, MatchResult } from '../types';
import { UnityBridgeService } from '../services/unityBridge';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PITCH_WIDTH = Math.min(SCREEN_WIDTH - 24, 370);
const PITCH_HEIGHT = Math.min(SCREEN_HEIGHT * 0.46, 360);

const GOAL_WIDTH = 130;
const GOAL_HEIGHT = 26;
const GOAL_X_MIN = (PITCH_WIDTH - GOAL_WIDTH) / 2;
const GOAL_X_MAX = GOAL_X_MIN + GOAL_WIDTH;
const GOAL_Y = 18;

interface UnityMatchModalProps {
  visible: boolean;
  userUniformNum: 1 | 2;
  aiUniformNum: 1 | 2;
  onFinishMatch: (result: MatchResult) => void;
  onClose: () => void;
}

export const UnityMatchModal: React.FC<UnityMatchModalProps> = ({
  visible,
  userUniformNum,
  aiUniformNum,
  onFinishMatch,
  onClose,
}) => {
  const { club } = useApp();

  // Score & Match State
  const [userScore, setUserScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [matchMinute, setMatchMinute] = useState(10);
  const [matchEvents, setMatchEvents] = useState<MatchEvent[]>([]);
  const [statusMessage, setStatusMessage] = useState('Use o analógico para driblar e chute a gol!');
  const [goalCelebration, setGoalCelebration] = useState(false);
  const [isSprinting, setIsSprinting] = useState(false);

  // Active controlled player ('P1' striker or 'P2' winger)
  const [activePlayer, setActivePlayer] = useState<'P1' | 'P2'>('P1');

  // Positions (in pixels relative to pitch)
  const [p1Pos, setP1Pos] = useState({ x: PITCH_WIDTH * 0.45, y: PITCH_HEIGHT * 0.65 });
  const [p2Pos, setP2Pos] = useState({ x: PITCH_WIDTH * 0.75, y: PITCH_HEIGHT * 0.55 });
  const [defenderPos, setDefenderPos] = useState({ x: PITCH_WIDTH * 0.5, y: PITCH_HEIGHT * 0.38 });
  const [gkPos, setGkPos] = useState({ x: PITCH_WIDTH * 0.5, y: GOAL_Y + 12 });
  const [ballPos, setBallPos] = useState({ x: PITCH_WIDTH * 0.45, y: PITCH_HEIGHT * 0.65 });

  // Joystick visual knob offset
  const [stickOffset, setStickOffset] = useState({ x: 0, y: 0 });

  // Refs for real-time physics loop without React re-render lag
  const p1Ref = useRef(p1Pos);
  const p2Ref = useRef(p2Pos);
  const defRef = useRef(defenderPos);
  const gkRef = useRef(gkPos);
  const ballRef = useRef({ x: ballPos.x, y: ballPos.y, vx: 0, vy: 0, isFree: false, holder: 'P1' as 'P1' | 'P2' | 'NONE' });
  const moveVector = useRef({ x: 0, y: 0 });
  const isSprintingRef = useRef(false);
  const userScoreRef = useRef(userScore);
  const aiScoreRef = useRef(aiScore);
  const celebrationRef = useRef(false);

  const goalAnim = useRef(new Animated.Value(0)).current;

  // Initialize or reset game upon modal open
  useEffect(() => {
    if (visible) {
      setUserScore(0);
      setAiScore(0);
      userScoreRef.current = 0;
      aiScoreRef.current = 0;
      setMatchMinute(10);
      setMatchEvents([]);
      setStatusMessage('Use o analógico para driblar e finalize para o gol!');
      resetPositions('P1');
    }
  }, [visible]);

  const resetPositions = (ballTo: 'P1' | 'P2' = 'P1') => {
    const initP1 = { x: PITCH_WIDTH * 0.45, y: PITCH_HEIGHT * 0.68 };
    const initP2 = { x: PITCH_WIDTH * 0.78, y: PITCH_HEIGHT * 0.52 };
    const initDef = { x: PITCH_WIDTH * 0.5, y: PITCH_HEIGHT * 0.4 };
    const initGk = { x: PITCH_WIDTH * 0.5, y: GOAL_Y + 10 };

    p1Ref.current = initP1;
    p2Ref.current = initP2;
    defRef.current = initDef;
    gkRef.current = initGk;

    const ballInitial = ballTo === 'P1' ? { ...initP1 } : { ...initP2 };
    ballRef.current = {
      x: ballInitial.x,
      y: ballInitial.y - 10,
      vx: 0,
      vy: 0,
      isFree: false,
      holder: ballTo,
    };

    setP1Pos(initP1);
    setP2Pos(initP2);
    setDefenderPos(initDef);
    setGkPos(initGk);
    setBallPos(ballRef.current);
    setActivePlayer(ballTo);
  };

  // Virtual Joystick PanResponder
  const panResponder: PanResponderInstance = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (_, gestureState) => {
        const maxDist = 38;
        const dx = gestureState.dx;
        const dy = gestureState.dy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist === 0) {
          moveVector.current = { x: 0, y: 0 };
          setStickOffset({ x: 0, y: 0 });
          return;
        }

        const clampedDist = Math.min(dist, maxDist);
        const normX = dx / dist;
        const normY = dy / dist;

        moveVector.current = { x: normX, y: normY };
        setStickOffset({
          x: normX * clampedDist,
          y: normY * clampedDist,
        });
      },
      onPanResponderRelease: () => {
        moveVector.current = { x: 0, y: 0 };
        setStickOffset({ x: 0, y: 0 });
      },
    })
  ).current;

  // Real-time Physics & AI Game Loop (Runs at 60 FPS)
  useEffect(() => {
    if (!visible) return;

    const loop = setInterval(() => {
      if (celebrationRef.current) return;

      const baseSpeed = isSprintingRef.current ? 4.8 : 2.8;
      const mv = moveVector.current;

      // 1. Move Active Player
      if (activePlayer === 'P1') {
        const nextX = Math.max(16, Math.min(PITCH_WIDTH - 24, p1Ref.current.x + mv.x * baseSpeed));
        const nextY = Math.max(GOAL_Y + 30, Math.min(PITCH_HEIGHT - 24, p1Ref.current.y + mv.y * baseSpeed));
        p1Ref.current = { x: nextX, y: nextY };
        setP1Pos(p1Ref.current);

        // Teammate P2 makes supporting runs
        const p2TargetY = Math.max(GOAL_Y + 40, p1Ref.current.y - 30);
        p2Ref.current.y += (p2TargetY - p2Ref.current.y) * 0.05;
        setP2Pos({ ...p2Ref.current });
      } else {
        const nextX = Math.max(16, Math.min(PITCH_WIDTH - 24, p2Ref.current.x + mv.x * baseSpeed));
        const nextY = Math.max(GOAL_Y + 30, Math.min(PITCH_HEIGHT - 24, p2Ref.current.y + mv.y * baseSpeed));
        p2Ref.current = { x: nextX, y: nextY };
        setP2Pos(p2Ref.current);
      }

      // 2. Ball Physics (Dribbling or Flying)
      if (!ballRef.current.isFree) {
        const currentController = ballRef.current.holder === 'P1' ? p1Ref.current : p2Ref.current;
        ballRef.current.x = currentController.x;
        ballRef.current.y = currentController.y - 12;
      } else {
        // Free moving ball
        ballRef.current.x += ballRef.current.vx;
        ballRef.current.y += ballRef.current.vy;
        ballRef.current.vx *= 0.94; // friction
        ballRef.current.vy *= 0.94;

        // Check if ball stops
        if (Math.abs(ballRef.current.vx) < 0.2 && Math.abs(ballRef.current.vy) < 0.2) {
          ballRef.current.vx = 0;
          ballRef.current.vy = 0;
          // Nearest player picks it up
          const distToP1 = Math.hypot(ballRef.current.x - p1Ref.current.x, ballRef.current.y - p1Ref.current.y);
          const distToP2 = Math.hypot(ballRef.current.x - p2Ref.current.x, ballRef.current.y - p2Ref.current.y);

          if (distToP1 < 36) {
            ballRef.current.isFree = false;
            ballRef.current.holder = 'P1';
            setActivePlayer('P1');
          } else if (distToP2 < 36) {
            ballRef.current.isFree = false;
            ballRef.current.holder = 'P2';
            setActivePlayer('P2');
          }
        }
      }

      // 3. AI Goalkeeper Movement (tracks ball along the goal line)
      const targetGkX = Math.max(GOAL_X_MIN + 12, Math.min(GOAL_X_MAX - 12, ballRef.current.x));
      gkRef.current.x += (targetGkX - gkRef.current.x) * 0.12;
      setGkPos({ ...gkRef.current });

      // 4. AI Defender Movement (defends central shooting lane)
      const activePlayerPos = activePlayer === 'P1' ? p1Ref.current : p2Ref.current;
      const targetDefX = (activePlayerPos.x + PITCH_WIDTH / 2) / 2;
      const targetDefY = Math.max(GOAL_Y + 50, (activePlayerPos.y + GOAL_Y) / 2);
      defRef.current.x += (targetDefX - defRef.current.x) * 0.04;
      defRef.current.y += (targetDefY - defRef.current.y) * 0.04;
      setDefenderPos({ ...defRef.current });

      // 5. Collision: Goalkeeper Save
      const distBallGk = Math.hypot(ballRef.current.x - gkRef.current.x, ballRef.current.y - gkRef.current.y);
      if (ballRef.current.isFree && distBallGk < 22 && ballRef.current.y < GOAL_Y + 25) {
        ballRef.current.vx = (Math.random() - 0.5) * 6;
        ballRef.current.vy = 8; // bounces away forward
        setStatusMessage('🧤 DEFESAAAÇA DO GOLEIRO ADVERSÁRIO!');
      }

      // 6. Goal Detection
      if (
        ballRef.current.y <= GOAL_Y + 6 &&
        ballRef.current.x >= GOAL_X_MIN + 6 &&
        ballRef.current.x <= GOAL_X_MAX - 6
      ) {
        triggerGoal();
      }

      setBallPos({ ...ballRef.current });
    }, 1000 / 60);

    return () => clearInterval(loop);
  }, [visible, activePlayer]);

  // Goal celebration & score trigger
  const triggerGoal = () => {
    if (celebrationRef.current) return;
    celebrationRef.current = true;
    setGoalCelebration(true);

    const newScore = userScoreRef.current + 1;
    userScoreRef.current = newScore;
    setUserScore(newScore);

    const goalMinute = Math.min(90, matchMinute + Math.floor(Math.random() * 10));
    setMatchMinute(goalMinute);

    const scorerName = activePlayer === 'P1' ? club.lineup[0] ? club.squad.find(p => p.id === club.lineup[0])?.name || 'Lucas Almeida' : 'Lucas Almeida' : 'Rodrigo Couto';

    const newEvent: MatchEvent = {
      minute: goalMinute,
      type: 'gol',
      team: 'user',
      player: scorerName,
      text: `GOLAÇO DO ${club.name}! Finalização precisa no canto da rede!`,
    };
    setMatchEvents(prev => [...prev, newEvent]);
    setStatusMessage(`⚽ GOOOOOOL DO ${club.name.toUpperCase()}! QUE GOLAÇO!`);

    Animated.sequence([
      Animated.timing(goalAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(goalAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.timing(goalAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      setGoalCelebration(false);
      celebrationRef.current = false;
      resetPositions('P1');
    });
  };

  // Shoot Button Action
  const handleShoot = () => {
    if (celebrationRef.current || ballRef.current.isFree) return;

    // Aim toward top corners of the goal
    const targetCornerX = p1Ref.current.x < PITCH_WIDTH / 2 ? GOAL_X_MAX - 10 : GOAL_X_MIN + 10;
    const targetY = GOAL_Y;

    const angle = Math.atan2(targetY - ballRef.current.y, targetCornerX - ballRef.current.x);
    const shootPower = isSprintingRef.current ? 12 : 9.5;

    ballRef.current.isFree = true;
    ballRef.current.holder = 'NONE';
    ballRef.current.vx = Math.cos(angle) * shootPower;
    ballRef.current.vy = Math.sin(angle) * shootPower;

    setStatusMessage('Bateu colocado direto no canto do gol!');
  };

  // Pass Button Action (Tabela com P2)
  const handlePass = () => {
    if (celebrationRef.current || ballRef.current.isFree) return;

    const fromPos = activePlayer === 'P1' ? p1Ref.current : p2Ref.current;
    const toPos = activePlayer === 'P1' ? p2Ref.current : p1Ref.current;
    const targetHolder = activePlayer === 'P1' ? 'P2' : 'P1';

    const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
    const passSpeed = 8;

    ballRef.current.isFree = true;
    ballRef.current.holder = 'NONE';
    ballRef.current.vx = Math.cos(angle) * passSpeed;
    ballRef.current.vy = Math.sin(angle) * passSpeed;

    setStatusMessage(`Passe açucarado para ${targetHolder === 'P2' ? 'o ponta' : 'o centroavante'}!`);

    setTimeout(() => {
      if (ballRef.current.isFree) {
        ballRef.current.isFree = false;
        ballRef.current.holder = targetHolder;
        setActivePlayer(targetHolder);
      }
    }, 450);
  };

  // Sprint Button Action
  const handleSprint = () => {
    if (isSprinting) return;
    setIsSprinting(true);
    isSprintingRef.current = true;
    setStatusMessage('⚡ Arrancada em velocidade máxima!');

    setTimeout(() => {
      setIsSprinting(false);
      isSprintingRef.current = false;
    }, 1800);
  };

  // Finish Match & Send Final Results to SFV Reward System
  const handleFinishMatch = () => {
    const finalUser = userScoreRef.current;
    const finalAi = aiScoreRef.current;

    const finalResult: MatchResult = UnityBridgeService.processMatchResult({
      matchId: `sfv_match_${Date.now()}`,
      userScore: finalUser,
      opponentScore: finalAi,
      opponentName: 'SFV (IA)',
      events: matchEvents.length > 0 ? matchEvents : [
        {
          minute: 34,
          type: 'cartao_amarelo',
          team: 'user',
          player: 'Danilo Pires',
          text: 'Cartão amarelo por falta tática. (-1 SV)',
        },
      ],
      stats: {
        posseUser: 56,
        posseOpp: 44,
        finalizacoesUser: finalUser + 4,
        finalizacoesOpp: finalAi + 3,
        noGolUser: finalUser + 2,
        noGolOpp: finalAi + 1,
        faltasUser: 4,
        faltasOpp: 5,
        cartoesUser: 1,
        cartoesOpp: 1,
      },
    });

    onFinishMatch(finalResult);
  };

  if (!visible) return null;

  const userKitColor = userUniformNum === 1 ? club.uniform1.camisa : club.uniform2.camisa;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <View style={styles.gameEngineInfo}>
            <MaterialCommunityIcons name="soccer" size={20} color={THEME.colors.primary} />
            <Text style={styles.gameEngineTitle}>SFV MATCH ARENA • 3D INTERATIVO</Text>
          </View>

          <TouchableOpacity style={styles.finishTopBtn} onPress={handleFinishMatch} activeOpacity={0.8}>
            <Ionicons name="flag" size={14} color="#000" style={{ marginRight: 4 }} />
            <Text style={styles.finishTopBtnText}>APITO FINAL (90')</Text>
          </TouchableOpacity>
        </View>

        {/* Native Unity 3D Engine Launcher */}
        {UnityBridgeService.isUnityNativeAvailable() && (
          <TouchableOpacity
            style={styles.launchUnityNativeBtn}
            onPress={async () => {
              try {
                const config = UnityBridgeService.buildMatchConfig(club, userUniformNum, aiUniformNum);
                const result = await UnityBridgeService.launchMatch(config);
                onFinishMatch(result);
              } catch (err) {
                console.log('[UnityMatchModal] Native Unity match ended:', err);
              }
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="game-controller" size={16} color="#000" style={{ marginRight: 6 }} />
            <Text style={styles.launchUnityNativeBtnText}>ABRIR MOTOR UNITY 3D NATIVO</Text>
          </TouchableOpacity>
        )}

        {/* Live Scoreboard */}
        <View style={styles.scoreboard}>
          <View style={styles.scoreClubCol}>
            <View style={[styles.clubDot, { backgroundColor: userKitColor }]} />
            <Text style={styles.scoreClubName} numberOfLines={1}>
              {club.name}
            </Text>
          </View>

          <View style={styles.scoreCenterCol}>
            <View style={styles.clockPill}>
              <View style={styles.liveRedDot} />
              <Text style={styles.clockText}>{matchMinute}' AO VIVO</Text>
            </View>
            <View style={styles.scoreDigitsRow}>
              <Text style={styles.scoreDigit}>{userScore}</Text>
              <Text style={styles.scoreDivider}>-</Text>
              <Text style={styles.scoreDigit}>{aiScore}</Text>
            </View>
          </View>

          <View style={styles.scoreClubCol}>
            <View style={[styles.clubDot, { backgroundColor: aiUniformNum === 1 ? '#FFFFFF' : '#111111' }]} />
            <Text style={styles.scoreClubName} numberOfLines={1}>
              SFV (IA)
            </Text>
          </View>
        </View>

        {/* Action Commentary Ticker */}
        <View style={styles.tickerBar}>
          <Ionicons name="megaphone-outline" size={14} color={THEME.colors.gold} style={{ marginRight: 6 }} />
          <Text style={styles.tickerText} numberOfLines={1}>
            {statusMessage}
          </Text>
        </View>

        {/* THE FOOTBALL PITCH (GAME ARENA) */}
        <View style={styles.pitchWrapper}>
          <View style={styles.pitch}>
            {/* Alternating grass stripes */}
            <View style={[styles.grassStripe, { top: 0 }]} />
            <View style={[styles.grassStripe, { top: PITCH_HEIGHT * 0.25 }]} />
            <View style={[styles.grassStripe, { top: PITCH_HEIGHT * 0.5 }]} />
            <View style={[styles.grassStripe, { top: PITCH_HEIGHT * 0.75 }]} />

            {/* Goal Net & Posts */}
            <View style={[styles.goalNet, { left: GOAL_X_MIN, width: GOAL_WIDTH, height: GOAL_HEIGHT, top: 0 }]}>
              <View style={styles.goalPostLeft} />
              <View style={styles.goalCrossbar} />
              <View style={styles.goalPostRight} />
              <View style={styles.goalMeshPattern} />
            </View>

            {/* Field Markings */}
            <View style={[styles.penaltyBox, { left: (PITCH_WIDTH - 210) / 2, width: 210, height: 95 }]} />
            <View style={[styles.goalArea, { left: (PITCH_WIDTH - 150) / 2, width: 150, height: 42 }]} />
            <View style={[styles.penaltySpot, { left: PITCH_WIDTH / 2 - 3, top: 68 }]} />

            {/* AI Goalkeeper */}
            <View
              style={[
                styles.playerNode,
                {
                  left: gkPos.x - 14,
                  top: gkPos.y - 14,
                  backgroundColor: '#FF9100',
                  borderColor: '#FFFFFF',
                },
              ]}
            >
              <Text style={styles.playerNumText}>1</Text>
              <Text style={styles.playerNameLabel}>GL</Text>
            </View>

            {/* AI Defender */}
            <View
              style={[
                styles.playerNode,
                {
                  left: defenderPos.x - 14,
                  top: defenderPos.y - 14,
                  backgroundColor: aiUniformNum === 1 ? '#FFFFFF' : '#222222',
                  borderColor: aiUniformNum === 1 ? '#000000' : '#FFFFFF',
                },
              ]}
            >
              <Text style={[styles.playerNumText, { color: aiUniformNum === 1 ? '#000' : '#FFF' }]}>3</Text>
              <Text style={styles.playerNameLabel}>SFV</Text>
            </View>

            {/* User Teammate (P2) */}
            <TouchableOpacity
              style={[
                styles.playerNode,
                {
                  left: p2Pos.x - 14,
                  top: p2Pos.y - 14,
                  backgroundColor: userKitColor,
                  borderColor: activePlayer === 'P2' ? THEME.colors.gold : '#FFFFFF',
                  borderWidth: activePlayer === 'P2' ? 2.5 : 1.5,
                },
              ]}
              onPress={() => setActivePlayer('P2')}
            >
              <Text style={styles.playerNumText}>11</Text>
              <Text style={styles.playerNameLabel}>RODRIGO</Text>
            </TouchableOpacity>

            {/* User Striker (P1) */}
            <TouchableOpacity
              style={[
                styles.playerNode,
                {
                  left: p1Pos.x - 14,
                  top: p1Pos.y - 14,
                  backgroundColor: userKitColor,
                  borderColor: activePlayer === 'P1' ? THEME.colors.gold : '#FFFFFF',
                  borderWidth: activePlayer === 'P1' ? 2.5 : 1.5,
                },
              ]}
              onPress={() => setActivePlayer('P1')}
            >
              <Text style={styles.playerNumText}>9</Text>
              <Text style={styles.playerNameLabel}>LUCAS</Text>
            </TouchableOpacity>

            {/* THE SOCCER BALL */}
            <View
              style={[
                styles.ballNode,
                {
                  left: ballPos.x - 9,
                  top: ballPos.y - 9,
                },
              ]}
            >
              <Ionicons name="football" size={18} color="#FFFFFF" />
            </View>

            {/* GOAL CELEBRATION OVERLAY BANNER */}
            {goalCelebration && (
              <Animated.View style={[styles.goalFlashOverlay, { opacity: goalAnim }]}>
                <Text style={styles.goalFlashTitle}>⚽ GOOOOOOL! ⚽</Text>
                <Text style={styles.goalFlashSub}>GOLAÇO NO ÂNGULO! (+1 SV)</Text>
              </Animated.View>
            )}
          </View>
        </View>

        {/* ON-SCREEN PLAYABLE CONTROLS */}
        <View style={styles.controlsSection}>
          {/* Virtual Joystick (Analog Movement) */}
          <View style={styles.joystickContainer} {...panResponder.panHandlers}>
            <View style={styles.joystickBase}>
              <View
                style={[
                  styles.joystickKnob,
                  {
                    transform: [
                      { translateX: stickOffset.x },
                      { translateY: stickOffset.y },
                    ],
                  },
                ]}
              >
                <Ionicons name="navigate" size={18} color="#000" />
              </View>
            </View>
            <Text style={styles.joystickLabel}>MOVER ATLETA</Text>
          </View>

          {/* Action Buttons (Shoot, Pass, Sprint) */}
          <View style={styles.buttonsCluster}>
            {/* Sprint Button */}
            <TouchableOpacity
              style={[styles.smallActionBtn, isSprinting && styles.sprintActive]}
              onPress={handleSprint}
              activeOpacity={0.7}
            >
              <Ionicons name="flash" size={18} color={isSprinting ? '#000' : THEME.colors.gold} />
              <Text style={[styles.smallBtnText, isSprinting && { color: '#000' }]}>ARRANCADA</Text>
            </TouchableOpacity>

            {/* Pass Button */}
            <TouchableOpacity
              style={styles.passBtn}
              onPress={handlePass}
              activeOpacity={0.75}
            >
              <MaterialCommunityIcons name="soccer-field" size={20} color="#FFFFFF" />
              <Text style={styles.passBtnText}>TOCAR</Text>
            </TouchableOpacity>

            {/* Shoot Button (Dominant Action) */}
            <TouchableOpacity
              style={styles.shootBtn}
              onPress={handleShoot}
              activeOpacity={0.8}
            >
              <Ionicons name="football" size={26} color="#000000" />
              <Text style={styles.shootBtnText}>CHUTAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070E17',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: THEME.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  gameEngineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gameEngineTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  finishTopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  finishTopBtnText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '900',
  },
  launchUnityNativeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    elevation: 4,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  launchUnityNativeBtnText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  scoreboard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.cardElevated,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 12,
    marginTop: 6,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.35)',
  },
  scoreClubCol: {
    flex: 1,
    alignItems: 'center',
  },
  clubDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  scoreClubName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  scoreCenterCol: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  clockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  liveRedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.primary,
  },
  clockText: {
    color: THEME.colors.primary,
    fontSize: 10,
    fontWeight: '900',
  },
  scoreDigitsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreDigit: {
    color: THEME.colors.gold,
    fontSize: 26,
    fontWeight: '900',
  },
  scoreDivider: {
    color: THEME.colors.textMuted,
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 6,
  },
  tickerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginHorizontal: 12,
    marginTop: 4,
    borderRadius: 4,
  },
  tickerText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
  pitchWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  pitch: {
    width: PITCH_WIDTH,
    height: PITCH_HEIGHT,
    backgroundColor: '#0D4421',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    overflow: 'hidden',
    position: 'relative',
  },
  grassStripe: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: PITCH_HEIGHT * 0.25,
    backgroundColor: 'rgba(255, 255, 255, 0.035)',
  },
  goalNet: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 2,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalPostLeft: {
    position: 'absolute',
    left: -2,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#FFFFFF',
  },
  goalPostRight: {
    position: 'absolute',
    right: -2,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#FFFFFF',
  },
  goalCrossbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: '#FFFFFF',
  },
  goalMeshPattern: {
    width: '100%',
    height: '100%',
    opacity: 0.15,
    backgroundColor: '#FFFFFF',
  },
  penaltyBox: {
    position: 'absolute',
    top: 0,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  goalArea: {
    position: 'absolute',
    top: 0,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  penaltySpot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  playerNode: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  playerNumText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  playerNameLabel: {
    position: 'absolute',
    top: -14,
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  ballNode: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 6,
  },
  goalFlashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 230, 118, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  goalFlashTitle: {
    color: '#000000',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2,
  },
  goalFlashSub: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 6,
  },
  controlsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
    backgroundColor: '#050B12',
  },
  joystickContainer: {
    alignItems: 'center',
  },
  joystickBase: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  joystickKnob: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  joystickLabel: {
    color: THEME.colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  buttonsCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  smallActionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME.colors.cardElevated,
    borderWidth: 1.5,
    borderColor: THEME.colors.gold,
  },
  sprintActive: {
    backgroundColor: THEME.colors.gold,
  },
  smallBtnText: {
    color: THEME.colors.gold,
    fontSize: 8,
    fontWeight: '900',
    marginTop: 2,
  },
  passBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#0D47A1',
    borderWidth: 2,
    borderColor: '#42A5F5',
  },
  passBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 2,
  },
  shootBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: THEME.colors.primary,
    borderWidth: 3,
    borderColor: THEME.colors.gold,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  shootBtnText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 2,
  },
});
