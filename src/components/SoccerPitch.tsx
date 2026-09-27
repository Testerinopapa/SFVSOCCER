import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { FORMATIONS_MAP } from '../data/mockData';
import { Player, Position } from '../types';
import { THEME } from '../constants/theme';

interface SoccerPitchProps {
  formation: string;
  lineup: string[]; // 11 player IDs
  squad: Player[];
  onPressSlot?: (slotIndex: number, currentPosition: Position, currentPlayer?: Player) => void;
  selectedSlot?: number | null;
  jerseyColor?: string;
}

const { width } = Dimensions.get('window');
const PITCH_WIDTH = width - 32;
const PITCH_HEIGHT = PITCH_WIDTH * 1.35; // Standard football pitch aspect ratio

export const SoccerPitch: React.FC<SoccerPitchProps> = ({
  formation,
  lineup,
  squad,
  onPressSlot,
  selectedSlot,
  jerseyColor = THEME.colors.primary,
}) => {
  const currentFormation = FORMATIONS_MAP[formation] || FORMATIONS_MAP['4-3-3'];
  const nodes = currentFormation.nodes;

  const getPlayerForSlot = (index: number): Player | undefined => {
    const playerId = lineup[index];
    return squad.find(p => p.id === playerId);
  };

  return (
    <View style={[styles.container, { width: PITCH_WIDTH, height: PITCH_HEIGHT }]}>
      {/* Grass stripes */}
      <View style={styles.stripesContainer}>
        {[...Array(9)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.stripe,
              { backgroundColor: i % 2 === 0 ? THEME.colors.pitchGrassDark : THEME.colors.pitchGrassLight },
            ]}
          />
        ))}
      </View>

      {/* Pitch Lines */}
      {/* Outer Border */}
      <View style={styles.pitchBorder} />

      {/* Center Line */}
      <View style={styles.centerLine} />

      {/* Center Circle */}
      <View style={styles.centerCircle}>
        <View style={styles.centerSpot} />
      </View>

      {/* Top Penalty Box (Opponent) */}
      <View style={styles.topPenaltyBox} />
      <View style={styles.topGoalArea} />

      {/* Bottom Penalty Box (User Defense & Goalkeeper) */}
      <View style={styles.bottomPenaltyBox} />
      <View style={styles.bottomGoalArea} />
      <View style={styles.bottomPenaltySpot} />
      <View style={styles.bottomPenaltyArc} />

      {/* Corner Arcs */}
      <View style={[styles.cornerArc, styles.cornerTL]} />
      <View style={[styles.cornerArc, styles.cornerTR]} />
      <View style={[styles.cornerArc, styles.cornerBL]} />
      <View style={[styles.cornerArc, styles.cornerBR]} />

      {/* Player Nodes */}
      {nodes.map((node, index) => {
        const player = getPlayerForSlot(index);
        const isSelected = selectedSlot === index;
        const isGoalKeeper = node.role === 'GO';
        const nodeJerseyColor = isGoalKeeper ? '#FFA000' : jerseyColor;

        return (
          <TouchableOpacity
            key={`${node.role}-${index}`}
            style={[
              styles.playerNode,
              {
                left: `${node.x}%`,
                top: `${node.y}%`,
              },
            ]}
            onPress={() => onPressSlot && onPressSlot(index, node.defaultPosition, player)}
            activeOpacity={0.8}
          >
            {/* Jersey Node Circle */}
            <View
              style={[
                styles.nodeCircle,
                { backgroundColor: nodeJerseyColor },
                isSelected && styles.nodeCircleSelected,
              ]}
            >
              <Text style={styles.playerNumber}>
                {player ? player.number : node.defaultPosition}
              </Text>
            </View>

            {/* Position Badge */}
            <View style={styles.roleTag}>
              <Text style={styles.roleText}>{node.role}</Text>
            </View>

            {/* Player Name Pill */}
            <View style={styles.namePill}>
              <Text style={styles.playerName} numberOfLines={1}>
                {player ? player.name.split(' ').slice(-1)[0] : 'Vazio'}
              </Text>
            </View>

            {/* Level Pill */}
            {player && (
              <View style={styles.levelPill}>
                <Text style={styles.levelText}>Nv {player.level}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: THEME.radius.md,
    overflow: 'hidden',
    alignSelf: 'center',
    marginVertical: THEME.spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  stripesContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
  },
  stripe: {
    flex: 1,
    width: '100%',
  },
  pitchBorder: {
    ...StyleSheet.absoluteFillObject,
    margin: 8,
    borderWidth: 1.5,
    borderColor: THEME.colors.pitchLine,
  },
  centerLine: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: '50%',
    height: 1.5,
    backgroundColor: THEME.colors.pitchLine,
  },
  centerCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 90,
    height: 90,
    marginTop: -45,
    marginLeft: -45,
    borderRadius: 45,
    borderWidth: 1.5,
    borderColor: THEME.colors.pitchLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerSpot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.pitchLine,
  },
  topPenaltyBox: {
    position: 'absolute',
    top: 8,
    left: '26%',
    right: '26%',
    height: 55,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: THEME.colors.pitchLine,
  },
  topGoalArea: {
    position: 'absolute',
    top: 8,
    left: '37%',
    right: '37%',
    height: 25,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: THEME.colors.pitchLine,
  },
  bottomPenaltyBox: {
    position: 'absolute',
    bottom: 8,
    left: '26%',
    right: '26%',
    height: 65,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: THEME.colors.pitchLine,
  },
  bottomGoalArea: {
    position: 'absolute',
    bottom: 8,
    left: '37%',
    right: '37%',
    height: 28,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: THEME.colors.pitchLine,
  },
  bottomPenaltySpot: {
    position: 'absolute',
    bottom: 50,
    left: '50%',
    marginLeft: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.pitchLine,
  },
  bottomPenaltyArc: {
    position: 'absolute',
    bottom: 60,
    left: '42%',
    right: '42%',
    height: 18,
    borderTopWidth: 1.5,
    borderColor: THEME.colors.pitchLine,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  cornerArc: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderColor: THEME.colors.pitchLine,
  },
  cornerTL: { top: 8, left: 8, borderRightWidth: 1.5, borderBottomWidth: 1.5, borderBottomRightRadius: 14 },
  cornerTR: { top: 8, right: 8, borderLeftWidth: 1.5, borderBottomWidth: 1.5, borderBottomLeftRadius: 14 },
  cornerBL: { bottom: 8, left: 8, borderRightWidth: 1.5, borderTopWidth: 1.5, borderTopRightRadius: 14 },
  cornerBR: { bottom: 8, right: 8, borderLeftWidth: 1.5, borderTopWidth: 1.5, borderTopLeftRadius: 14 },
  playerNode: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    marginLeft: -32,
    marginTop: -32,
  },
  nodeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 4,
  },
  nodeCircleSelected: {
    borderColor: THEME.colors.gold,
    borderWidth: 3,
    transform: [{ scale: 1.25 }],
  },
  playerNumber: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '900',
  },
  roleTag: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    marginTop: 2,
  },
  roleText: {
    color: THEME.colors.gold,
    fontSize: 8,
    fontWeight: '800',
  },
  namePill: {
    backgroundColor: 'rgba(10, 17, 24, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 1,
    maxWidth: 60,
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
  },
  levelPill: {
    marginTop: 1,
  },
  levelText: {
    color: THEME.colors.primary,
    fontSize: 8,
    fontWeight: '800',
  },
});
