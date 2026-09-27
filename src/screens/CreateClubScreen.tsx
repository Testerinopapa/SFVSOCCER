import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Uniform } from '../types';
import { KitPreview } from '../components/KitPreview';
import { ColorPalettePicker } from '../components/ColorPalettePicker';

interface CreateClubScreenProps {
  onBackToLogin: () => void;
}

export const CreateClubScreen: React.FC<CreateClubScreenProps> = ({ onBackToLogin }) => {
  const { createClub } = useApp();
  const [clubName, setClubName] = useState('');
  const [password, setPassword] = useState('');

  // Uniform 1
  const [u1, setU1] = useState<Uniform>({
    camisa: '#00E676',
    short: '#111111',
    meiao: '#00E676',
  });

  // Uniform 2
  const [u2, setU2] = useState<Uniform>({
    camisa: '#FFD700',
    short: '#001F3F',
    meiao: '#FFFFFF',
  });

  const [activeUniformTab, setActiveUniformTab] = useState<1 | 2>(1);
  const [activePart, setActivePart] = useState<'camisa' | 'short' | 'meiao'>('camisa');

  const handleCreate = () => {
    if (!clubName.trim()) {
      Alert.alert('Atenção', 'Informe o nome do clube.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Atenção', 'Informe uma senha para proteger o acesso.');
      return;
    }

    createClub(clubName, password, u1, u2);
  };

  const handleColorChange = (color: string) => {
    if (activeUniformTab === 1) {
      setU1(prev => ({ ...prev, [activePart]: color }));
    } else {
      setU2(prev => ({ ...prev, [activePart]: color }));
    }
  };

  const currentUniform = activeUniformTab === 1 ? u1 : u2;
  const currentColor = currentUniform[activePart];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBackToLogin}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CRIAR NOVO CLUBE</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1. Identidade do Clube</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>NOME DO CLUBE</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="shield-outline" size={18} color={THEME.colors.textSecondary} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                placeholder="Ex: SFV Furacão"
                placeholderTextColor={THEME.colors.textMuted}
                value={clubName}
                onChangeText={setClubName}
                autoCapitalize="characters"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>SENHA</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="key-outline" size={18} color={THEME.colors.textSecondary} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                placeholder="Defina uma senha"
                placeholderTextColor={THEME.colors.textMuted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>
        </View>

        {/* Uniform Configuration */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>2. Personalizar Uniformes</Text>

          {/* Toggle Uniform 1 / Uniform 2 */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabButton, activeUniformTab === 1 && styles.tabButtonActive]}
              onPress={() => setActiveUniformTab(1)}
            >
              <Text style={[styles.tabText, activeUniformTab === 1 && styles.tabTextActive]}>
                UNIFORME 1 (TITULAR)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeUniformTab === 2 && styles.tabButtonActive]}
              onPress={() => setActiveUniformTab(2)}
            >
              <Text style={[styles.tabText, activeUniformTab === 2 && styles.tabTextActive]}>
                UNIFORME 2 (RESERVA)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Kit Preview */}
          <View style={styles.previewBox}>
            <KitPreview uniform={currentUniform} size="md" showLabels />
          </View>

          {/* Part Selector: Camisa, Short, Meião */}
          <View style={styles.partSelector}>
            {(['camisa', 'short', 'meiao'] as const).map(part => {
              const label = part === 'camisa' ? 'Camisa' : part === 'short' ? 'Short' : 'Meião';
              const isSelected = activePart === part;
              const partColor = currentUniform[part];

              return (
                <TouchableOpacity
                  key={part}
                  style={[styles.partBtn, isSelected && styles.partBtnActive]}
                  onPress={() => setActivePart(part)}
                >
                  <View style={[styles.partColorThumb, { backgroundColor: partColor }]} />
                  <Text style={[styles.partBtnText, isSelected && styles.partBtnTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Color Palette */}
          <ColorPalettePicker
            title={`Escolha a cor: ${activePart.toUpperCase()}`}
            selectedColor={currentColor}
            onSelectColor={handleColorChange}
          />
        </View>

        {/* Auto Generated Squad Note */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle-outline" size={20} color={THEME.colors.primary} />
          <Text style={styles.infoBannerText}>
            Ao criar o clube, um elenco profissional balanceado com 30 jogadores será gerado automaticamente.
          </Text>
        </View>

        {/* Create Club Submit */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreate} activeOpacity={0.85}>
          <Text style={styles.createButtonText}>CRIAR CLUBE</Text>
          <Ionicons name="checkmark-circle" size={20} color="#000" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: THEME.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    color: THEME.colors.text,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  scrollContent: {
    padding: THEME.spacing.lg,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.lg,
  },
  sectionTitle: {
    color: THEME.colors.gold,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: THEME.spacing.md,
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: THEME.spacing.md,
  },
  inputLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 12,
    height: 46,
  },
  input: {
    flex: 1,
    color: THEME.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.md,
    padding: 4,
    marginBottom: THEME.spacing.md,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: THEME.radius.sm,
  },
  tabButtonActive: {
    backgroundColor: THEME.colors.primary,
  },
  tabText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
  },
  tabTextActive: {
    color: '#000000',
  },
  previewBox: {
    backgroundColor: THEME.colors.backgroundDark,
    borderRadius: THEME.radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  partSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: THEME.spacing.md,
  },
  partBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.cardElevated,
    paddingVertical: 10,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  partBtnActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
  },
  partColorThumb: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  partBtnText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  partBtnTextActive: {
    color: THEME.colors.primary,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
    borderRadius: THEME.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.25)',
    marginBottom: THEME.spacing.xl,
  },
  infoBannerText: {
    flex: 1,
    color: THEME.colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 10,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: THEME.colors.primary,
    height: 52,
    borderRadius: THEME.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  createButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
