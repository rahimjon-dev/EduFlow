import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { Header } from '../../components/Header';
import { apiClient } from '../../services/apiClient';
import { Clock, MapPin, User, BookOpen } from 'lucide-react-native';

export const ScheduleScreen: React.FC = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSchedule = useCallback(async () => {
    try {
      const res = await apiClient.get<any[]>('/groups');
      if (Array.isArray(res)) {
        setGroups(res);
      }
    } catch (err: any) {
      console.warn('Schedule fetch error:', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSchedule();
  };

  return (
    <View style={styles.container}>
      <Header title="Dars Jadvali" subtitle={`O‘quv guruhlari jadvali (Baza)`} />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        {loading && !refreshing ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Jadval yuklanmoqda...</Text>
          </View>
        ) : groups.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Hozircha dars jadvallari kiritilmagan</Text>
          </View>
        ) : (
          groups.map((grp) => {
            const courseName = grp.course?.name || 'Asosiy Kurs';
            const teacherName = grp.teacher?.user?.fullName || 'Tayinlanmagan';
            const schedule = grp.schedule || 'Dush-Chor-Jum 14:00 - 16:00';
            const room = grp.room || '204-xona';

            return (
              <View key={grp.id} style={styles.card}>
                <View style={styles.timeTag}>
                  <Clock size={16} color={colors.primary} />
                  <Text style={styles.timeText}>{schedule}</Text>
                </View>

                <Text style={styles.subject}>{grp.name} • {courseName}</Text>

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <User size={14} color={colors.textSecondary} />
                    <Text style={styles.metaText}>{teacherName}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MapPin size={14} color={colors.textSecondary} />
                    <Text style={styles.metaText}>{room}</Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerBox: {
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xs,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  subject: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyBox: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
