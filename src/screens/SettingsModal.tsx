import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const { club, resetDemoData, logout } = useApp();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [fastSimulation, setFastSimulation] = useState(false);

  const handleResetDemo = () => {
    Alert.alert(
      'Redefinir Demonstração',
      'Tem certeza que deseja restaurar os dados iniciais do protótipo? O saldo será resetado para 850 SV e as alterações do clube voltarão ao padrão.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar',
          style: 'destructive',
          onPress: async () => {
            await resetDemoData();
            onClose();
            Alert.alert('Sucesso', 'Dados de demonstração restaurados com sucesso!');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Sair do Clube', 'Deseja encerrar a sessão atual?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          logout();
          onClose();
        },
      },
    ]);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>CONFIGURAÇÕES DO JOGO</Text>
              <Text style={styles.subtitle}>Super Futebol Virtual • Protótipo MVP</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Club Identity Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CONTA & CLUBE</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Clube Conectado</Text>
                <Text style={styles.infoValue}>{club.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Divisão Atual</Text>
                <Text style={styles.infoValue}>{club.division}ª Divisão Nacional</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Saldo em Carteira</Text>
                <Text style={[styles.infoValue, { color: THEME.colors.gold }]}>
                  {club.balanceSV} SV
                </Text>
              </View>
            </View>

            {/* Audio & Feedback */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PREFERÊNCIAS DE JOGO</Text>
              <View style={styles.toggleRow}>
                <View>
                  <Text style={styles.toggleLabel}>Efeitos Sonoros de Estádio</Text>
                  <Text style={styles.toggleSub}>Gols, apitos e torcida</Text>
                </View>
                <Switch
                  value={soundEnabled}
                  onValueChange={setSoundEnabled}
                  trackColor={{ false: THEME.colors.border, true: THEME.colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.toggleRow}>
                <View>
                  <Text style={styles.toggleLabel}>Vibração Háptica</Text>
                  <Text style={styles.toggleSub}>Alertas de lances capitais e cartões</Text>
                </View>
                <Switch
                  value={vibrationEnabled}
                  onValueChange={setVibrationEnabled}
                  trackColor={{ false: THEME.colors.border, true: THEME.colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.toggleRow}>
                <View>
                  <Text style={styles.toggleLabel}>Simulação Acelerada Padrão</Text>
                  <Text style={styles.toggleSub}>Iniciar partidas em velocidade 2x</Text>
                </View>
                <Switch
                  value={fastSimulation}
                  onValueChange={setFastSimulation}
                  trackColor={{ false: THEME.colors.border, true: THEME.colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* Prototype Reset Option */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>GESTÃO DO PROTÓTIPO</Text>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetDemo}
                activeOpacity={0.85}
              >
                <Ionicons name="refresh-circle" size={22} color={THEME.colors.gold} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.resetButtonTitle}>REDEFINIR DEMONSTRAÇÃO</Text>
                  <Text style={styles.resetButtonSub}>
                    Restaura o estado inicial com SFV Welton e 850 SV
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* System Info */}
            <View style={styles.aboutBox}>
              <Text style={styles.aboutTitle}>SUPER FUTEBOL VIRTUAL (SFV)</Text>
              <Text style={styles.aboutVersion}>Versão 1.0.0 (MVP Local Android)</Text>
              <Text style={styles.aboutText}>
                Este protótipo roda 100% isolado localmente no dispositivo para validação de experiência, design e regras de economia SV antes da integração com os servidores finais.
              </Text>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
              <Ionicons name="log-out-outline" size={18} color={THEME.colors.redCard} />
              <Text style={styles.logoutBtnText}>SAIR DO CLUBE</Text>
            </TouchableOpacity>
          </ScrollView>
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
    color: THEME.colors.text,
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
  body: {
    padding: THEME.spacing.lg,
  },
  section: {
    marginBottom: THEME.spacing.lg,
  },
  sectionTitle: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.cardElevated,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.sm,
    marginBottom: 4,
  },
  infoLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardElevated,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.sm,
    marginBottom: 6,
  },
  toggleLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  toggleSub: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: THEME.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    gap: 12,
  },
  resetButtonTitle: {
    color: THEME.colors.gold,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  resetButtonSub: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  aboutBox: {
    backgroundColor: THEME.colors.backgroundDark,
    borderRadius: THEME.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  aboutTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  aboutVersion: {
    color: THEME.colors.primary,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  aboutText: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 14,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 61, 0, 0.4)',
    backgroundColor: 'rgba(255, 61, 0, 0.08)',
    gap: 8,
    marginBottom: 10,
  },
  logoutBtnText: {
    color: THEME.colors.redCard,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
