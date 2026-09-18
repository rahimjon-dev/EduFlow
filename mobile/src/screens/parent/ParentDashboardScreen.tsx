import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';
import { Award, Phone, CheckCircle2, ChevronRight } from 'lucide-react-native';

export const ParentDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchParentData = useCallback(async () => {
    try {
      const [stRes, grRes, payRes] = await Promise.allSettled([
        apiClient.get<any[]>('/students'),
        apiClient.get<any[]>('/grades'),
        apiClient.get<any[]>('/payments'),
      ]);

      if (stRes.status === 'fulfilled' && Array.isArray(stRes.value)) {
        setStudents(stRes.value);
      }
      if (grRes.status === 'fulfilled' && Array.isArray(grRes.value)) {
        setGrades(grRes.value);
      }
      if (payRes.status === 'fulfilled' && Array.isArray(payRes.value)) {
        setPayments(payRes.value);
      }
    } catch (err: any) {
      console.warn('Parent dashboard error:', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchParentData();
  }, [fetchParentData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchParentData();
  };

  const child = students.length > 0 ? students[0] : null;
  const childName = child?.user?.fullName || child?.fullName || 'Ali Valiyev';
  const childCourse = child?.group?.course?.name || 'Frontend Dasturlash';
  const childGroup = child?.group?.name || 'FN-24/1';
  const childTeacher = child?.group?.teacher?.user?.fullName || 'Anvar Narzullayev';
  const teacherPhone = child?.group?.teacher?.phone || '+998909991122';

  const averageScore =
    grades.length > 0
      ? (grades.reduce((acc, g) => acc + (Number(g.score) || 0), 0) / grades.length).toFixed(1)
      : '95.0';

  const pendingDebt = payments
    .filter((p) => p.status !== 'PAID')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const handleCallTeacher = () => {
    Linking.openURL(`tel:${teacherPhone}`).catch(() => {
      Alert.alert('Xatolik', 'Qo‘ng‘iroq qilib bo‘lmadi');
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Ota-ona Nazorati" subtitle={currentUser?.name || 'Ota-ona (Real-Time)'} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        {/* Child Profile Card */}
        <View style={styles.childCard}>
          <View style={styles.childHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{childName.charAt(0)}</Text>
            </View>
            <View style={styles.childInfo}>
              <Text style={styles.childName}>{childName}</Text>
              <Text style={styles.childCourse}>{childCourse} • {childGroup}</Text>
              <Text style={styles.childTeacher}>Ustoz: {childTeacher}</Text>
            </View>
            <TouchableOpacity style={styles.callBtn} onPress={handleCallTeacher}>
              <Phone size={16} color={colors.white} />
            </TouchableOpacity>
          </View>

          {/* Quick Stats Grid */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>100%</Text>
              <Text style={styles.statLabel}>Davomat</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{averageScore}</Text>
              <Text style={styles.statLabel}>O'rtacha Baho</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: pendingDebt > 0 ? colors.danger : colors.success }]}>
                {pendingDebt.toLocaleString()} so'm
              </Text>
              <Text style={styles.statLabel}>Qarzdorlik</Text>
            </View>
          </View>
        </View>

        {/* Today's Status Banner */}
        <View style={styles.todayBanner}>
          <View style={styles.todayIconBox}>
            <CheckCircle2 size={24} color={colors.success} />
          </View>
          <View style={styles.todayTextGroup}>
            <Text style={styles.todayTitle}>Farzandingiz darslarga qatnashmoqda</Text>
            <Text style={styles.todayDesc}>Barcha o‘quv mashg‘ulotlari faol holatda</Text>
          </View>
        </View>

        {/* Recent Grades */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Farzandingizning oxirgi baholari</Text>
        </View>

        <View style={styles.gradesList}>
          {loading && !refreshing ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : grades.length === 0 ? (
            <Text style={styles.emptyText}>Hozircha baholar mavjud emas</Text>
          ) : (
            grades.slice(0, 3).map((g) => (
              <View key={g.id} style={styles.gradeCard}>
                <View style={styles.gradeLeft}>
                  <Award size={18} color={colors.primary} />
                  <View>
                    <Text style={styles.gradeSubject}>{g.subject || 'Nazorat ishi'}</Text>
                    <Text style={styles.gradeTopic}>Dars natijasi</Text>
                  </View>
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreVal}>{g.score}</Text>
                  <Text style={styles.maxVal}>/ 100</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Quick Navigation Cards */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('ChildAttendance')}
          >
            <Text style={styles.navTitle}>Davomat Tarixi</Text>
            <Text style={styles.navDesc}>Qatnashish grafigi</Text>
            <ChevronRight size={18} color={colors.primary} style={styles.navIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('Payments')}
          >
            <Text style={styles.navTitle}>To'lovlar</Text>
            <Text style={styles.navDesc}>To'lovlar va hisoblar</Text>
            <ChevronRight size={18} color={colors.primary} style={styles.navIcon} />
          </TouchableOpacity>
        </View>
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
  childCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  childHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.roles.PARENT.bg,
    borderWidth: 1.5,
    borderColor: colors.roles.PARENT.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.roles.PARENT.color,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  childCourse: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  childTeacher: {
    fontSize: 11,
    color: colors.primary,
    marginTop: 2,
    fontWeight: '600',
  },
  callBtn: {
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: '70%',
    backgroundColor: colors.borderDark,
  },
  todayBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successBg,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: spacing.xl,
  },
  todayIconBox: {
    marginRight: spacing.md,
  },
  todayTextGroup: {
    flex: 1,
  },
  todayTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.successText,
  },
  todayDesc: {
    fontSize: 12,
    color: colors.successText,
    marginTop: 2,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  gradesList: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  emptyText: {
    textAlign: 'center',
    padding: spacing.md,
    color: colors.textMuted,
    fontSize: 13,
  },
  gradeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  gradeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  gradeSubject: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  gradeTopic: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: colors.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  scoreVal: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.primary,
  },
  maxVal: {
    fontSize: 10,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  navRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  navCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
    ...shadows.sm,
  },
  navTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  navDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  navIcon: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
  },
});
