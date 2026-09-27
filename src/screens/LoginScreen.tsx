import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';

interface LoginScreenProps {
  onGoToCreateClub: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onGoToCreateClub }) => {
  const { login, loginDemo } = useApp();
  const [clubName, setClubName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!clubName.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o nome do clube.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Atenção', 'Por favor, informe sua senha.');
      return;
    }
    const success = login(clubName, password);
    if (!success) {
      Alert.alert('Erro', 'Não foi possível entrar com os dados informados.');
    }
  };

  const handleDemoLogin = () => {
    loginDemo();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Logo and Titles */}
        <View style={styles.brandingSection}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appTitle}>SUPER FUTEBOL VIRTUAL</Text>
          <Text style={styles.tagline}>A Nova Era do Futebol Virtual Móvel</Text>
        </View>

        {/* Login Form Box */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Acesse o seu Clube</Text>

          {/* Club Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>NOME DO CLUBE</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="shield-outline" size={20} color={THEME.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ex: SFV Welton"
                placeholderTextColor={THEME.colors.textMuted}
                value={clubName}
                onChangeText={setClubName}
                autoCapitalize="characters"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>SENHA</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={THEME.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor={THEME.colors.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={THEME.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} activeOpacity={0.85}>
            <Text style={styles.primaryButtonText}>ENTRAR</Text>
            <Ionicons name="arrow-forward" size={18} color="#000" />
          </TouchableOpacity>

          {/* Create Club Button */}
          <TouchableOpacity style={styles.secondaryButton} onPress={onGoToCreateClub} activeOpacity={0.85}>
            <Text style={styles.secondaryButtonText}>CRIAR CLUBE</Text>
          </TouchableOpacity>
        </View>

        {/* Demo Fast Access Option */}
        <View style={styles.demoSection}>
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>MODO DE AVALIAÇÃO</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.demoButton} onPress={handleDemoLogin} activeOpacity={0.85}>
            <Ionicons name="flash" size={18} color={THEME.colors.gold} style={{ marginRight: 8 }} />
            <Text style={styles.demoButtonText}>Entrar com clube de demonstração</Text>
          </TouchableOpacity>
          <Text style={styles.demoSubtext}>Acesso imediato com o clube pré-configurado SFV Welton (850 SV)</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.xxl,
  },
  brandingSection: {
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: THEME.spacing.md,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME.colors.text,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 12,
    color: THEME.colors.primary,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  formCard: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.xl,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.lg,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: THEME.spacing.lg,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.textSecondary,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: THEME.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  eyeIcon: {
    padding: 6,
  },
  primaryButton: {
    backgroundColor: THEME.colors.primary,
    height: 48,
    borderRadius: THEME.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: THEME.spacing.sm,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    marginRight: 6,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    height: 44,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: THEME.colors.borderLight,
  },
  secondaryButtonText: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  demoSection: {
    marginTop: THEME.spacing.xxl,
    alignItems: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: THEME.colors.border,
  },
  dividerText: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    paddingHorizontal: 12,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: THEME.radius.md,
    width: '100%',
  },
  demoButtonText: {
    color: THEME.colors.gold,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  demoSubtext: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 6,
  },
});
