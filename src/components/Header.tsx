import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { THEME } from '../constants/theme';

interface HeaderProps {
  onOpenSettings?: () => void;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, title, showBack, onBack }) => {
  const { club, setActiveModal } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBack ? (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.clubInfo}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.clubName} numberOfLines={1}>
                {title || club.name}
              </Text>
              <View style={styles.divisionBadge}>
                <Text style={styles.divisionText}>{club.division}ª DIVISÃO</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <View style={styles.rightSection}>
        <View style={styles.balanceContainer}>
          <View style={styles.coinBadge}>
            <Text style={styles.coinSymbol}>$</Text>
          </View>
          <Text style={styles.balanceText}>{club.balanceSV.toLocaleString('pt-BR')}</Text>
          <Text style={styles.currencyLabel}>SV</Text>
        </View>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => (onOpenSettings ? onOpenSettings() : setActiveModal('settings'))}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-sharp" size={20} color={THEME.colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: THEME.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: THEME.spacing.xs,
    marginRight: THEME.spacing.sm,
  },
  clubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: THEME.spacing.sm,
  },
  clubName: {
    color: THEME.colors.text,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  divisionBadge: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
  },
  divisionText: {
    color: THEME.colors.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.35)',
  },
  coinBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: THEME.colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  coinSymbol: {
    color: '#000',
    fontSize: 11,
    fontWeight: '900',
  },
  balanceText: {
    color: THEME.colors.gold,
    fontSize: 14,
    fontWeight: '800',
  },
  currencyLabel: {
    color: THEME.colors.gold,
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 3,
    opacity: 0.85,
  },
  settingsButton: {
    padding: 8,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.cardElevated,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
});
