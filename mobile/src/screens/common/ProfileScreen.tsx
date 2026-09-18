import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, Language } from '../../context/LanguageContext';
import { setCustomApiUrl, getApiUrl } from '../../services/apiClient';
import { User, Globe, Server, LogOut, Shield, Calendar, Phone, Mail } from 'lucide-react-native';

export const ProfileScreen: React.FC = () => {
  const { currentUser, logout, refreshProfile } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [serverUrl, setServerUrl] = useState(getApiUrl());
  const [editingServer, setEditingServer] = useState(false);

  const handleSaveServer = async () => {
    if (!serverUrl.trim()) return;
    await setCustomApiUrl(serverUrl.trim());
    setEditingServer(false);
    await refreshProfile();
    Alert.alert('Saqlandi', `API server manzili o'zgartirildi: ${serverUrl}`);
  };

  const roleLabels = {
    ADMIN: 'Bosh Administrator',
    TEACHER: "O'qituvchi",
    STUDENT: 'Talaba',
    PARENT: 'Ota-ona',
  };

  const roleName = currentUser?.role ? roleLabels[currentUser.role] || currentUser.role : 'Foydalanuvchi';

  return (
    <View style={styles.container}>
      <Header title="Mening Profilim" subtitle="Foydalanuvchi ma'lumotlari" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{currentUser?.name?.charAt(0) || 'U'}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{currentUser?.name || 'Foydalanuvchi'}</Text>
            <Text style={styles.userEmail}>{currentUser?.email}</Text>
            <View style={{ marginTop: 6, alignSelf: 'flex-start' }}>
              <Badge
                label={roleName}
                variant={currentUser?.role === 'ADMIN' ? 'primary' : currentUser?.role === 'TEACHER' ? 'secondary' : 'info'}
                size="sm"
              />
            </View>
          </View>
        </View>

        {/* Account Details Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Akkaunt Ma'lumotlari</Text>
          
          <View style={styles.detailRow}>
            <Mail size={16} color={colors.textSecondary} />
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailVal}>{currentUser?.email || '-'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Shield size={16} color={colors.textSecondary} />
            <Text style={styles.detailLabel}>Huquq:</Text>
            <Text style={styles.detailVal}>{roleName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Calendar size={16} color={colors.textSecondary} />
            <Text style={styles.detailLabel}>Ro'yxatdan o'tgan:</Text>
            <Text style={styles.detailVal}>
              {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Faol'}
            </Text>
          </View>
        </View>

        {/* Language Selection */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Globe size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Tilni tanlash / Выбор языка</Text>
          </View>

          <View style={styles.langRow}>
            {(
              [
                { code: 'uz', label: "O'zbekcha" },
                { code: 'ru', label: 'Русский' },
                { code: 'en', label: 'English' },
              ] as const
            ).map((l) => (
              <TouchableOpacity
                key={l.code}
                style={[styles.langBtn, language === l.code && styles.langBtnActive]}
                onPress={() => setLanguage(l.code as Language)}
              >
                <Text style={[styles.langBtnText, language === l.code && styles.langBtnTextActive]}>
                  {l.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Server Host Setup */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Server size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Backend API Serveri</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Mobil qurilmadan ma'lumotlar bazasiga ulanish manzili:
          </Text>

          {editingServer ? (
            <View style={styles.serverEditBox}>
              <TextInput
                style={styles.serverInput}
                value={serverUrl}
                onChangeText={setServerUrl}
                placeholder="http://192.168.1.xxx:5000/api"
                autoCapitalize="none"
              />
              <Button title="Saqlash" onPress={handleSaveServer} size="sm" />
            </View>
          ) : (
            <View style={styles.serverDisplayRow}>
              <Text style={styles.serverUrlText} numberOfLines={1}>{serverUrl}</Text>
              <TouchableOpacity onPress={() => setEditingServer(true)} style={styles.editBtn}>
                <Text style={styles.editBtnText}>O'zgartirish</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Logout */}
        <Button
          title={t('logout')}
          onPress={logout}
          variant="danger"
          icon={<LogOut size={18} color={colors.white} />}
          style={{ marginTop: spacing.md }}
        />

        <Text style={styles.versionText}>EduFlow Mobile v1.0.0 • Real-Time Database Mode</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 1,
  },
  sectionCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    width: 130,
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  langRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  langBtn: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  langBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  langBtnTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  serverDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: spacing.sm + 2,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serverUrlText: {
    fontSize: 13,
    color: colors.textPrimary,
    flex: 1,
  },
  editBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  serverEditBox: {
    gap: spacing.sm,
  },
  serverInput: {
    height: 42,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: 13,
    backgroundColor: colors.background,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xl,
  },
});
