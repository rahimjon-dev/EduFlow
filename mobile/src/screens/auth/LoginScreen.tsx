import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/Button';
import { GraduationCap, LogIn, KeyRound, Mail, Shield, BookOpen, User } from 'lucide-react-native';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Xatolik', 'Iltimos, email yoki loginni kiriting');
      return;
    }

    try {
      setLoading(true);
      await login({ email, password });
    } catch (err: any) {
      Alert.alert('Kirishda xatolik', err.message || "Email yoki parol noto'g'ri");
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardView}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand Header */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <GraduationCap size={44} color={colors.white} />
          </View>
          <Text style={styles.brandTitle}>EduFlow</Text>
          <Text style={styles.brandSubtitle}>Yagona taʼlim boshqaruv tizimi (Real-Time)</Text>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('login')}</Text>
          <Text style={styles.cardSubtitle}>Shaxsiy profilingizga kiring</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('email')}</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="admin@eduflow.uz"
                placeholderTextColor={colors.textPlaceholder}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('password')}</Text>
            <View style={styles.inputWrapper}>
              <KeyRound size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={colors.textPlaceholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <Button
            title={t('login')}
            onPress={handleLogin}
            loading={loading}
            icon={<LogIn size={18} color={colors.white} />}
            style={styles.loginBtn}
          />
        </View>

        {/* Real Database Accounts Helper */}
        <View style={styles.accountsSection}>
          <Text style={styles.accountsTitle}>Tizimdagi mavjud hisoblar:</Text>
          <Text style={styles.accountsHint}>Tez to‘ldirish uchun bosing va «Kirish»ni tanlang:</Text>

          <View style={styles.accountsRow}>
            <TouchableOpacity
              style={styles.accountChip}
              onPress={() => fillCredentials('admin@eduflow.uz', '0603')}
            >
              <Shield size={14} color={colors.roles.ADMIN.color} />
              <Text style={styles.accountChipText}>Admin (0603)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.accountChip}
              onPress={() => fillCredentials('teacher1@eduflow.uz', 'teacher123')}
            >
              <BookOpen size={14} color={colors.roles.TEACHER.color} />
              <Text style={styles.accountChipText}>O‘qituvchi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.accountChip}
              onPress={() => fillCredentials('student1@eduflow.uz', 'student123')}
            >
              <User size={14} color={colors.roles.STUDENT.color} />
              <Text style={styles.accountChipText}>Talaba</Text>
            </TouchableOpacity>
          </View>
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
  brandContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.lg,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
    marginBottom: spacing.xl,
  },
  cardTitle: {
    fontSize: 20,
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: colors.textPrimary,
  },
  loginBtn: {
    marginTop: spacing.sm,
  },
  accountsSection: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accountsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  accountsHint: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  accountsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  accountChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  accountChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
