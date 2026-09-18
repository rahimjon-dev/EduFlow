import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/Button';
import { UserPlus, ArrowLeft } from 'lucide-react-native';
import { UserRole } from '../../types';

export const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password) {
      Alert.alert('Xatolik', 'Iltimos, barcha maydonlarni to‘ldiring');
      return;
    }

    try {
      setLoading(true);
      await login({ email, password });
    } catch (err: any) {
      Alert.alert('Xatolik', err.message || 'Ro‘yxatdan o‘tishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardView}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
          <Text style={styles.backText}>Kirish sahifasi</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('register')}</Text>
          <Text style={styles.cardSubtitle}>EduFlow taʼlim tizimiga aʼzo bo‘ling</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>F.I.Sh</Text>
            <TextInput
              style={styles.input}
              placeholder="Ali Valiyev"
              placeholderTextColor={colors.textPlaceholder}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('email')}</Text>
            <TextInput
              style={styles.input}
              placeholder="namuna@eduflow.uz"
              placeholderTextColor={colors.textPlaceholder}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('password')}</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textPlaceholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rolni tanlang</Text>
            <View style={styles.rolePickerRow}>
              {(['STUDENT', 'TEACHER', 'PARENT'] as UserRole[]).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleChoice, role === r && styles.roleChoiceActive]}
                  onPress={() => setRole(r)}
                >
                  <Text style={[styles.roleChoiceText, role === r && styles.roleChoiceTextActive]}>
                    {r === 'STUDENT' ? 'Talaba' : r === 'TEACHER' ? "O'qituvchi" : 'Ota-ona'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Button
            title={t('register')}
            onPress={handleRegister}
            loading={loading}
            icon={<UserPlus size={18} color={colors.white} />}
            style={styles.regBtn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  rolePickerRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  roleChoice: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleChoiceActive: {
    backgroundColor: colors.primaryBg,
    borderColor: colors.primary,
  },
  roleChoiceText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  roleChoiceTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  regBtn: {
    marginTop: spacing.md,
  },
});
