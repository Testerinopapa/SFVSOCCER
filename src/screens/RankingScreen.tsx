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
import { RANKING_GERAL_MOCK } from '../data/mockData';

interface RankingScreenProps {
  visible: boolean;
  onClose: () => void;
}

export const RankingScreen: React.FC<RankingScreenProps> = ({ visible, onClose }) => {
  const { club } = useApp();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>RANKING GERAL BRASILEIRO SFV</Text>
              <Text style={styles.subtitle}>Classificação unificada de todos os clubes virtuais</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Table Header */}
          <View style={styles.thRow}>
            <Text style={[styles.thText, styles.colRank]}>#</Text>
            <Text style={[styles.thText, styles.colClub]}>CLUBE</Text>
            <Text style={[styles.thText, styles.colDiv]}>DIV</Text>
            <Text style={[styles.thText, styles.colWin]}>VIT</Text>
            <Text style={[styles.thText, styles.colPts]}>PTS</Text>
          </View>

          {/* Ranking List */}
          <FlatList
            data={RANKING_GERAL_MOCK}
            keyExtractor={item => `${item.rank}-${item.name}`}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isUser = item.isUser || item.name.includes(club.name);
              const isTop3 = item.rank <= 3;
              const medalColor = item.rank === 1 ? '#FFD700' : item.rank === 2 ? '#C0C0C0' : '#CD7F32';

              return (
                <View style={[styles.row, isUser && styles.rowUser]}>
                  {/* Rank */}
                  <View style={styles.colRank}>
                    {isTop3 ? (
                      <View style={[styles.rankMedal, { backgroundColor: medalColor }]}>
                        <Text style={styles.rankMedalText}>{item.rank}</Text>
                      </View>
                    ) : (
                      <Text style={[styles.rankText, isUser && styles.userText]}>{item.rank}º</Text>
                    )}
                  </View>

                  {/* Club */}
                  <View style={styles.colClub}>
                    <Text style={[styles.clubName, isUser && styles.userText]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    {isUser && (
                      <View style={styles.userBadge}>
                        <Text style={styles.userBadgeText}>SEU CLUBE</Text>
                      </View>
                    )}
                  </View>

                  {/* Division */}
                  <Text style={styles.colDiv}>{item.division}ª</Text>

                  {/* Wins */}
                  <Text style={styles.colWin}>{item.victories}</Text>

                  {/* Points */}
                  <Text style={[styles.colPts, styles.ptsText, isUser && styles.userPtsText]}>
                    {item.points}
                  </Text>
                </View>
              );
            }}
          />

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.closeBtnFooter} onPress={onClose}>
              <Text style={styles.closeBtnFooterText}>VOLTAR</Text>
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
    padding: THEME.spacing.md,
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
  thRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardElevated,
    paddingVertical: 8,
    paddingHorizontal: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  thText: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
  colRank: { width: 36, alignItems: 'center' },
  colClub: { flex: 1, textAlign: 'left', paddingLeft: 6, flexDirection: 'row', alignItems: 'center', gap: 6 },
  colDiv: { width: 36, textAlign: 'center', color: THEME.colors.textSecondary, fontSize: 11, fontWeight: '700' },
  colWin: { width: 36, textAlign: 'center', color: THEME.colors.textSecondary, fontSize: 11, fontWeight: '700' },
  colPts: { width: 42, textAlign: 'center' },
  listContent: {
    paddingBottom: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  rowUser: {
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.primary,
  },
  rankMedal: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankMedalText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '900',
  },
  rankText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  clubName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
  },
  userText: {
    color: THEME.colors.primary,
    fontWeight: '900',
  },
  userBadge: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  userBadgeText: {
    color: '#000000',
    fontSize: 7,
    fontWeight: '900',
  },
  ptsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  userPtsText: {
    color: THEME.colors.gold,
  },
  footer: {
    padding: THEME.spacing.md,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  closeBtnFooter: {
    backgroundColor: THEME.colors.cardElevated,
    height: 42,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnFooterText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
