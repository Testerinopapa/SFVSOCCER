import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';

interface BottomNavProps {
  onTabChange?: (tab: 'home' | 'squad' | 'tournaments' | 'market') => void;
  onPlayPress?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onTabChange, onPlayPress }) => {
  const { currentTab, setCurrentTab, setActiveModal } = useApp();

  const handleTabPress = (tab: 'home' | 'squad' | 'tournaments' | 'market') => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setCurrentTab(tab);
    }
  };

  const handlePlay = () => {
    if (onPlayPress) {
      onPlayPress();
    } else {
      setActiveModal('playMenu');
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab: INÍCIO */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleTabPress('home')}
        activeOpacity={0.7}
      >
        <Ionicons
          name={currentTab === 'home' ? 'home' : 'home-outline'}
          size={22}
          color={currentTab === 'home' ? THEME.colors.primary : THEME.colors.textSecondary}
        />
        <Text
          style={[
            styles.navLabel,
            currentTab === 'home' && styles.navLabelActive,
          ]}
        >
          INÍCIO
        </Text>
      </TouchableOpacity>

      {/* Tab: CLUBE */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleTabPress('squad')}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name={currentTab === 'squad' ? 'shield-account' : 'shield-account-outline'}
          size={24}
          color={currentTab === 'squad' ? THEME.colors.primary : THEME.colors.textSecondary}
        />
        <Text
          style={[
            styles.navLabel,
            currentTab === 'squad' && styles.navLabelActive,
          ]}
        >
          CLUBE
        </Text>
      </TouchableOpacity>

      {/* Center Dominant Button: JOGAR */}
      <View style={styles.centerButtonContainer}>
        <TouchableOpacity
          style={styles.centerButton}
          onPress={handlePlay}
          activeOpacity={0.85}
        >
          <View style={styles.centerButtonInner}>
            <Ionicons name="play" size={26} color="#000" style={{ marginLeft: 3 }} />
          </View>
          <Text style={styles.centerButtonText}>JOGAR</Text>
        </TouchableOpacity>
      </View>

      {/* Tab: TORNEIOS */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleTabPress('tournaments')}
        activeOpacity={0.7}
      >
        <Ionicons
          name={currentTab === 'tournaments' ? 'trophy' : 'trophy-outline'}
          size={22}
          color={currentTab === 'tournaments' ? THEME.colors.primary : THEME.colors.textSecondary}
        />
        <Text
          style={[
            styles.navLabel,
            currentTab === 'tournaments' && styles.navLabelActive,
          ]}
        >
          TORNEIOS
        </Text>
      </TouchableOpacity>

      {/* Tab: MERCADO */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleTabPress('market')}
        activeOpacity={0.7}
      >
        <Ionicons
          name={currentTab === 'market' ? 'swap-horizontal' : 'swap-horizontal-outline'}
          size={24}
          color={currentTab === 'market' ? THEME.colors.primary : THEME.colors.textSecondary}
        />
        <Text
          style={[
            styles.navLabel,
            currentTab === 'market' && styles.navLabelActive,
          ]}
        >
          MERCADO
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: THEME.colors.card,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    elevation: 12,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  navLabelActive: {
    color: THEME.colors.primary,
  },
  centerButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
  },
  centerButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 3,
    borderColor: THEME.colors.gold,
  },
  centerButtonText: {
    fontSize: 10,
    fontWeight: '900',
    color: THEME.colors.primary,
    marginTop: 3,
    letterSpacing: 0.5,
  },
});
