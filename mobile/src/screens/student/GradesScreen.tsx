import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { Header } from '../../components/Header';
import { apiClient } from '../../services/apiClient';
import { Award, Calendar, MessageSquare } from 'lucide-react-native';

export const GradesScreen: React.FC = () => {
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGrades = useCallback(async () => {
    try {
      const res = await apiClient.get<any[]>('/grades');
      if (Array.isArray(res)) {
        setGrades(res);
      }
    } catch (err: any) {
      console.warn('Failed to load grades:', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGrades();
  };

  const averageScore =
    grades.length > 0
      ? (grades.reduce((acc, g) => acc + (Number(g.score) || 0), 0) / grades.length).toFixed(1)
      : '0.0';

  const renderGrade = ({ item }: { item: any }) => {
    const subject = item.subject || item.course?.name || 'Fan';
    const score = item.score !== undefined ? item.score : 100;
    const feedback = item.feedback || null;
    const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Bugun';

    return (
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.subjectBox}>
            <Text style={styles.subject}>{subject}</Text>
            <Text style={styles.topic}>Nazorat ishi / Baholash</Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.score}>{score}</Text>
            <Text style={styles.maxScore}>/ 100</Text>
          </View>
        </View>

        {feedback && (
          <View style={styles.feedbackBox}>
            <MessageSquare size={14} color={colors.primary} />
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        )}

        <View style={styles.footerRow}>
          <View style={styles.footerItem}>
            <Award size={12} color={colors.textSecondary} />
            <Text style={styles.footerText}>Akademik natija</Text>
          </View>
          <View style={styles.footerItem}>
            <Calendar size={12} color={colors.textSecondary} />
            <Text style={styles.footerText}>{dateStr}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Baholar Daftari" subtitle={`O'rtacha ko‘rsatkich: ${averageScore} (Baza)`} />

      <View style={styles.gpaBanner}>
        <View>
          <Text style={styles.gpaLabel}>Umumiy O'zlashtirish (GPA)</Text>
          <Text style={styles.gpaStatus}>Haqiqiy baholar asosida</Text>
        </View>
        <Text style={styles.gpaNumber}>{averageScore}</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Baholar yuklanmoqda...</Text>
        </View>
      ) : (
        <FlatList
          data={grades}
          keyExtractor={(item) => item.id}
          renderItem={renderGrade}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Hozircha baholar qo'yilmagan</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  gpaBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    margin: spacing.lg,
    marginBottom: 0,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  gpaLabel: {
    fontSize: 12,
    color: '#E0E7FF',
    fontWeight: '600',
  },
  gpaStatus: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '800',
    marginTop: 2,
  },
  gpaNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.white,
  },
  list: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  subjectBox: {
    flex: 1,
  },
  subject: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  topic: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: colors.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  score: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary,
  },
  maxScore: {
    fontSize: 10,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  feedbackText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.xs + 2,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  emptyBox: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
