import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';
import { Award, Clock, BookOpen } from 'lucide-react-native';

export const StudentDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [grades, setGrades] = useState<any[]>([]);
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStudentData = useCallback(async () => {
    try {
      const [grRes, hwRes, grpRes] = await Promise.allSettled([
        apiClient.get<any[]>('/grades'),
        apiClient.get<any[]>('/homework'),
        apiClient.get<any[]>('/groups'),
      ]);

      if (grRes.status === 'fulfilled' && Array.isArray(grRes.value)) {
        setGrades(grRes.value);
      }
      if (hwRes.status === 'fulfilled' && Array.isArray(hwRes.value)) {
        setHomeworks(hwRes.value);
      }
      if (grpRes.status === 'fulfilled' && Array.isArray(grpRes.value)) {
        setGroups(grpRes.value);
      }
    } catch (err: any) {
      console.warn('Student dashboard error:', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStudentData();
  };

  const averageScore =
    grades.length > 0
      ? (grades.reduce((acc, g) => acc + (Number(g.score) || 0), 0) / grades.length).toFixed(1)
      : '0.0';

  const firstGroup = groups.length > 0 ? groups[0] : null;

  return (
    <View style={styles.container}>
      <Header title="Mening Kabinetim" subtitle={currentUser?.name || 'Talaba (Real-Time)'} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        {/* Student Profile Overview Card */}
        <View style={styles.studentCard}>
          <View style={styles.studentTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{currentUser?.name?.charAt(0) || 'T'}</Text>
            </View>
            <View style={styles.studentMeta}>
              <Text style={styles.studentName}>{currentUser?.name || 'Talaba'}</Text>
              <Text style={styles.groupName}>
                {firstGroup ? `${firstGroup.name} • ${firstGroup.course?.name || 'Dasturlash'}` : 'EduFlow Talabasi'}
              </Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>100%</Text>
              <Text style={styles.metricLabel}>Davomat</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>{averageScore}</Text>
              <Text style={styles.metricLabel}>O'rtacha Baho</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>{homeworks.length}</Text>
              <Text style={styles.metricLabel}>Vazifalar</Text>
            </View>
          </View>
        </View>

        {/* Next Lesson Box */}
        {firstGroup && (
          <View style={styles.nextLessonBox}>
            <View style={styles.nextLessonHeader}>
              <Clock size={18} color={colors.accent} />
              <Text style={styles.nextLessonTitle}>Faol guruh darsi</Text>
            </View>
            <Text style={styles.nextLessonSubject}>{firstGroup.course?.name || firstGroup.name}</Text>
            <Text style={styles.nextLessonTime}>{firstGroup.schedule || 'Jadval bo‘yicha'}</Text>
            <Text style={styles.nextLessonTeacher}>
              Ustoz: {firstGroup.teacher?.user?.fullName || 'Tayinlangan ustoz'} • {firstGroup.room || '204-xona'}
            </Text>
          </View>
        )}

        {/* Recent Grades */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Oxirgi baholar</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Grades')}>
            <Text style={styles.seeAll}>Barchasi ({grades.length})</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gradesList}>
          {loading && !refreshing ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : grades.length === 0 ? (
            <Text style={styles.emptyText}>Hozircha baholar qo‘yilmagan</Text>
          ) : (
            grades.slice(0, 3).map((g) => (
              <View key={g.id} style={styles.gradeCard}>
                <View style={styles.gradeLeft}>
                  <Award size={20} color={colors.primary} />
                  <View>
                    <Text style={styles.gradeSubject}>{g.subject || 'Nazorat ishi'}</Text>
                    <Text style={styles.gradeTopic}>Akademik baho</Text>
                  </View>
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>{g.score}</Text>
                  <Text style={styles.maxScore}>/ 100</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Pending Homework */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mening vazifalarim</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Homework')}>
            <Text style={styles.seeAll}>Barchasi ({homeworks.length})</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hwList}>
          {homeworks.length === 0 ? (
            <Text style={styles.emptyText}>Hozircha uy vazifalari mavjud emas</Text>
          ) : (
            homeworks.slice(0, 3).map((hw) => {
              const deadline = hw.dueDate ? new Date(hw.dueDate).toLocaleDateString() : '7 kun';
              return (
                <View key={hw.id} style={styles.hwCard}>
                  <View style={styles.hwInfo}>
                    <Text style={styles.hwTitle}>{hw.title}</Text>
                    <Text style={styles.hwDeadline}>Muddat: {deadline}</Text>
                  </View>
                  <Badge label="Faol" variant="warning" size="sm" />
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
  studentCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  studentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.roles.STUDENT.bg,
    borderWidth: 1.5,
    borderColor: colors.roles.STUDENT.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.roles.STUDENT.color,
  },
  studentMeta: {
    flex: 1,
  },
  studentName: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  groupName: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: '70%',
    backgroundColor: colors.borderDark,
  },
  nextLessonBox: {
    backgroundColor: colors.accentBg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#A5F3FC',
    marginBottom: spacing.xl,
  },
  nextLessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  nextLessonTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0891B2',
    textTransform: 'uppercase',
  },
  nextLessonSubject: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  nextLessonTime: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  nextLessonTeacher: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0891B2',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
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
    alignItems: 'center',
    justifyContent: 'space-between',
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
  scoreText: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.primary,
  },
  maxScore: {
    fontSize: 10,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  hwList: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadows.sm,
  },
  hwCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  hwInfo: {
    flex: 1,
  },
  hwTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  hwDeadline: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
