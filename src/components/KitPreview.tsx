import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Uniform } from '../types';
import { THEME } from '../constants/theme';

interface KitPreviewProps {
  uniform: Uniform;
  size?: 'sm' | 'md' | 'lg';
  clubName?: string;
  showLabels?: boolean;
}

export const KitPreview: React.FC<KitPreviewProps> = ({
  uniform,
  size = 'md',
  clubName,
  showLabels = false,
}) => {
  const scale = size === 'sm' ? 0.65 : size === 'lg' ? 1.25 : 1.0;

  return (
    <View style={[styles.wrapper, { transform: [{ scale }] }]}>
      {/* Jersey / Camisa */}
      <View style={styles.jerseyContainer}>
        {/* Sleeves */}
        <View style={[styles.sleeveLeft, { backgroundColor: uniform.camisa }]} />
        <View style={[styles.sleeveRight, { backgroundColor: uniform.camisa }]} />

        {/* Torso */}
        <View style={[styles.torso, { backgroundColor: uniform.camisa }]}>
          {/* Collar */}
          <View style={styles.collar} />
          {/* Crest / Star */}
          <View style={styles.crest}>
            <Text style={styles.crestText}>★</Text>
          </View>
          {/* Subtle jersey stripe / design */}
          <View style={styles.jerseyStripe} />
          {/* Center chest sponsor mockup */}
          <Text style={styles.sponsorText}>SFV</Text>
        </View>
      </View>

      {/* Shorts */}
      <View style={styles.shortsContainer}>
        <View style={[styles.shortsLegLeft, { backgroundColor: uniform.short }]} />
        <View style={styles.shortsGap} />
        <View style={[styles.shortsLegRight, { backgroundColor: uniform.short }]} />
      </View>

      {/* Socks / Meião */}
      <View style={styles.socksContainer}>
        <View style={[styles.sock, { backgroundColor: uniform.meiao }]}>
          <View style={styles.sockBand} />
        </View>
        <View style={{ width: 14 }} />
        <View style={[styles.sock, { backgroundColor: uniform.meiao }]}>
          <View style={styles.sockBand} />
        </View>
      </View>

      {showLabels && (
        <View style={styles.labelsRow}>
          <View style={styles.labelBadge}>
            <View style={[styles.colorDot, { backgroundColor: uniform.camisa }]} />
            <Text style={styles.labelText}>Camisa</Text>
          </View>
          <View style={styles.labelBadge}>
            <View style={[styles.colorDot, { backgroundColor: uniform.short }]} />
            <Text style={styles.labelText}>Short</Text>
          </View>
          <View style={styles.labelBadge}>
            <View style={[styles.colorDot, { backgroundColor: uniform.meiao }]} />
            <Text style={styles.labelText}>Meião</Text>
          </View>
        </View>
      )}

      {clubName && <Text style={styles.clubNameTag}>{clubName}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  jerseyContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: 100,
    height: 70,
    zIndex: 3,
  },
  sleeveLeft: {
    width: 22,
    height: 38,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 4,
    transform: [{ rotate: '25deg' }],
    marginTop: 4,
    marginRight: -6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.25)',
  },
  sleeveRight: {
    width: 22,
    height: 38,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 4,
    transform: [{ rotate: '-25deg' }],
    marginTop: 4,
    marginLeft: -6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.25)',
  },
  torso: {
    width: 58,
    height: 64,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.3)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  collar: {
    width: 20,
    height: 10,
    backgroundColor: '#0A1118',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  crest: {
    position: 'absolute',
    left: 6,
    top: 14,
  },
  crestText: {
    color: THEME.colors.gold,
    fontSize: 10,
    fontWeight: '900',
  },
  jerseyStripe: {
    position: 'absolute',
    width: 8,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    top: 0,
  },
  sponsorText: {
    marginTop: 18,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  shortsContainer: {
    flexDirection: 'row',
    marginTop: -2,
    zIndex: 2,
  },
  shortsLegLeft: {
    width: 26,
    height: 30,
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.25)',
  },
  shortsGap: {
    width: 4,
  },
  shortsLegRight: {
    width: 26,
    height: 30,
    borderBottomRightRadius: 4,
    borderTopRightRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.25)',
  },
  socksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  sock: {
    width: 14,
    height: 32,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  sockBand: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  labelsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  labelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#000',
  },
  labelText: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },
  clubNameTag: {
    color: THEME.colors.text,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 6,
    letterSpacing: 0.5,
  },
});
