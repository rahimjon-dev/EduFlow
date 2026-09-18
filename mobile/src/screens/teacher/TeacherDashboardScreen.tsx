import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { Header } from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';
import { Clock, CheckSquare, BookOpen } from 'lucide-react-native';

export const TeacherDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [groups, setGroups] = useState<any[]>([]);
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTeacherData = useCallback(async () => {
    try {
      const [grpRes, hwRes] = await Promise.allSettled([
        apiClient.get<any[]>('/groups'),
        apiClient.get<any[]>('/homework'),
      ]);

      if (grpRes.status === 'fulfilled' && Array.isArray(grpRes.value)) {
        setGroups(grpRes.value);
      }
      if (hwRes.status === 'fulfilled' && Array.isArray(hwRes.value)) {
        setHomeworks(hwRes.value);
      }
    } catch (err: any) {
      console.warn('Teacher dashboard fetch error:', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTeacherData();
  };

  return (
    <View style={styles.container}>
      <Header title="O'qituvchi Kabineti" subtitle={currentUser?.name || "O'qituvchi (Real-Time)"} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        {/* Welcome card */}
        <View style={styles.welcomeBanner}>
          <View style={styles.welcomeTextGroup}>
            <Text style={styles.greeting}>Xush kelibsiz!</Text>
            <Text style={styles.teacherName}>{currentUser?.name}</Text>
            <Text style={styles.bannerDesc}>
              Sizda {groups.length} ta faol guruh va {homeworks.length} ta e'lon qilingan topshiriq mavjud.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.attendanceShortcut}
            onPress={() => navigation.navigate('Attendance')}
          >
            <CheckSquare size={20} color={colors.white} />
            <Text style={styles.attendanceShortcutText}>Davomat qilish</Text>
          </TouchableOpacity>
        </View>

        {/* Classes List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Guruhlar dars grafigi</Text>
          <Text style={styles.dateBadge}>{groups.length} ta guruh</Text>
        </View>

        <View style={styles.classesList}>
          {loading && !refreshing ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : groups.length === 0 ? (
            <Text style={styles.emptyText}>Guruhlar biriktirilmagan</Text>
          ) : (
            groups.map((grp) => {
              const studentsCount = grp._count?.students || grp.students?.length || 0;
              const courseName = grp.course?.name || 'Kurs';

              return (
                <View key={grp.id} style={styles.classCard}>
                  <View style={styles.classTimeBox}>
                    <Clock size={16} color={colors.primary} />
                    <Text style={styles.classTime}>{grp.schedule || 'Dars vaqti belgilanmagan'}</Text>
                  </View>
                  <Text style={styles.classGroup}>{grp.name}</Text>
                  <Text style={styles.classTopic}>{courseName}</Text>
                  <View style={styles.classFooter}>
                    <Text style={styles.classRoom}>Xona: {grp.room || '204-xona'}</Text>
                    <Text style={styles.classStudents}>{studentsCount} ta talaba</Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Homework checking preview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Topshiriqlar holati</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Homework')}>
            <Text style={styles.seeAll}>Barchasi ({homeworks.length})</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hwList}>
          {homeworks.length === 0 ? (
            <Text style={styles.emptyText}>Topshiriqlar e'lon qilinmagan</Text>
          ) : (
            homeworks.slice(0, 5).map((hw) => {
              const groupName = hw.group?.name || 'Guruh';
              const deadline = hw.dueDate ? new Date(hw.dueDate).toLocaleDateString() : '7 kun';

              return (
                <View key={hw.id} style={styles.hwCard}>
                  <View style={styles.hwLeft}>
                    <BookOpen size={20} color={colors.secondary} />
                    <View style={styles.hwText}>
                      <Text style={styles.hwTitle}>{hw.title}</Text>
                      <Text style={styles.hwSub}>{groupName} • Muddat: {deadline}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
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
  welcomeBanner: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  welcomeTextGroup: {
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: 13,
    color: '#E0E7FF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  teacherName: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.white,
    marginTop: 2,
    marginBottom: 6,
  },
  bannerDesc: {
    fontSize: 13,
    color: '#EEF2FF',
    lineHeight: 18,
  },
  attendanceShortcut: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  attendanceShortcutText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  dateBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  classesList: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  classCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  classTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  classTime: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  classGroup: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  classTopic: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  classFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  classRoom: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  classStudents: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  hwList: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  emptyText: {
    textAlign: 'center',
    padding: spacing.md,
    color: colors.textMuted,
    fontSize: 13,
  },
  hwCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  hwLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  hwText: {
    flex: 1,
  },
  hwTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  hwSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
