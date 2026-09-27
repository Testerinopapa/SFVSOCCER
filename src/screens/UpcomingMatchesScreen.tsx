import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { UPCOMING_MATCHES_MOCK } from '../data/mockData';

interface UpcomingMatchesScreenProps {
  visible: boolean;
  onClose: () => void;
}

export const UpcomingMatchesScreen: React.FC<UpcomingMatchesScreenProps> = ({
  visible,
  onClose,
}) => {
  const { club } = useApp();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>CALENDÁRIO DE PARTIDAS</Text>
              <Text style={styles.subtitle}>Próximas rodadas das ligas oficiais SFV</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* List of upcoming matches */}
          <FlatList
            data={UPCOMING_MATCHES_MOCK}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const hasUser = item.homeTeam.includes(club.name) || item.awayTeam.includes(club.name);

              return (
                <View style={[styles.matchCard, hasUser && styles.matchCardUser]}>
                  <View style={styles.cardTop}>
                    <View style={styles.divPill}>
                      <Text style={styles.divText}>{item.division}</Text>
                    </View>
                    <View style={styles.timePill}>
                      <Ionicons name="calendar-outline" size={12} color={THEME.colors.gold} style={{ marginRight: 4 }} />
                      <Text style={styles.timeText}>{item.date} • {item.time}</Text>
                    </View>
                  </View>

                  <View style={styles.matchTeamsRow}>
                    <View style={styles.teamSide}>
                      <Text
                        style={[styles.teamName, item.homeTeam.includes(club.name) && styles.teamNameUser]}
                        numberOfLines={1}
                      >
                        {item.homeTeam}
                      </Text>
                    </View>

                    <View style={styles.vsBox}>
                      <Text style={styles.vsText}>X</Text>
                    </View>

                    <View style={styles.teamSide}>
                      <Text
                        style={[styles.teamName, item.awayTeam.includes(club.name) && styles.teamNameUser]}
                        numberOfLines={1}
                      >
                        {item.awayTeam}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }}
          />

          <View style={styles.footer}>
            <TouchableOpacity style={styles.closeFooterBtn} onPress={onClose}>
              <Text style={styles.closeFooterBtnText}>VOLTAR</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    padding: THEME.spacing.md,
  },
  card: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    maxHeight: '85%',
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
  listContent: {
    padding: THEME.spacing.md,
    gap: 10,
  },
  matchCard: {
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  matchCardUser: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  divPill: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  divText: {
    color: THEME.colors.primary,
    fontSize: 9,
    fontWeight: '800',
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: THEME.colors.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  matchTeamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamSide: {
    flex: 1,
  },
  teamName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  teamNameUser: {
    color: THEME.colors.primary,
    fontWeight: '900',
  },
  vsBox: {
    paddingHorizontal: 8,
  },
  vsText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '900',
  },
  footer: {
    padding: THEME.spacing.md,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  closeFooterBtn: {
    backgroundColor: THEME.colors.cardElevated,
    height: 42,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeFooterBtnText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
