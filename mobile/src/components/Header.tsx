import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, shadows } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Bell, LogOut, Globe } from 'lucide-react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showRoleBadge?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, showRoleBadge = true }) => {
  const insets = useSafeAreaInsets();
  const { currentUser, logout } = useAuth();
  const { language, setLanguage } = useLanguage();

  const roleConfig = currentUser?.role ? colors.roles[currentUser.role] : colors.roles.STUDENT;

  const toggleLanguage = () => {
    const nextLang = language === 'uz' ? 'ru' : language === 'ru' ? 'en' : 'uz';
    setLanguage(nextLang);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.topRow}>
        <View style={styles.titleArea}>
          <View style={styles.brandRow}>
            <Text style={styles.brandText}>EduFlow</Text>
            {showRoleBadge && currentUser?.role && (
              <View style={[styles.roleBadge, { backgroundColor: roleConfig.bg, borderColor: roleConfig.border }]}>
                <Text style={[styles.roleText, { color: roleConfig.color }]}>{roleConfig.label}</Text>
              </View>
            )}
          </View>
          <Text style={styles.screenTitle}>{title}</Text>
          {subtitle && <Text style={styles.screenSubtitle}>{subtitle}</Text>}
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleLanguage}>
            <Globe size={18} color={colors.textSecondary} />
            <Text style={styles.langText}>{language.toUpperCase()}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={logout}>
            <LogOut size={18} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleArea: {
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 2,
  },
  brandText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  roleBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.round,
    borderWidth: 1,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  screenSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
});
