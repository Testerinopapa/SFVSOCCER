import React from 'react';
import { View, StyleSheet, Platform, requireNativeComponent, Text } from 'react-native';
import { THEME } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

let NativeBannerView: any = null;
if (Platform.OS === 'android') {
  try {
    NativeBannerView = requireNativeComponent('SFVBannerView');
  } catch (err) {
    console.log('[BannerAd] SFVBannerView native component not registered yet in this environment.');
    NativeBannerView = null;
  }
}

interface BannerAdProps {
  visible?: boolean;
}

export const BannerAd: React.FC<BannerAdProps> = ({ visible = true }) => {
  if (!visible) return null;

  return (
    <View style={styles.bannerWrapper}>
      {NativeBannerView ? (
        <View style={styles.nativeContainer}>
          <NativeBannerView style={styles.nativeAdView} />
        </View>
      ) : (
        <View style={styles.fallbackContainer}>
          <View style={styles.testBadge}>
            <Text style={styles.testBadgeText}>TEST AD</Text>
          </View>
          <Ionicons name="megaphone-outline" size={14} color={THEME.colors.textSecondary} style={{ marginRight: 6 }} />
          <Text style={styles.fallbackText}>Google Mobile Ads • Banner 320x50</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bannerWrapper: {
    width: '100%',
    height: 54,
    backgroundColor: '#0A0E12',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: THEME.colors.border,
    zIndex: 99,
  },
  nativeContainer: {
    width: 320,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#12181F',
    borderRadius: 4,
    overflow: 'hidden',
  },
  nativeAdView: {
    width: 320,
    height: 50,
  },
  fallbackContainer: {
    width: 320,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E1318',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  testBadge: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    marginRight: 8,
  },
  testBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#000',
  },
  fallbackText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
});
