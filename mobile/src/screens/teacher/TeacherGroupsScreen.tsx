import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';
import { apiClient } from '../../services/apiClient';
import { BookOpen, Clock, MapPin } from 'lucide-react-native';

export const TeacherGroupsScreen: React.FC = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGroups = useCallback(async () => {
    try {
      const res = await apiClient.get<any[]>('/groups');
      if (Array.isArray(res)) {
        setGroups(res);
      }
    } catch (err: any) {
      console.warn('Teacher groups fetch error:', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGroups();
  };

  return (
    <View style={styles.container}>
      <Header title="Mening Guruhlarim" subtitle={`Jami: ${groups.length} ta guruh (Baza)`} />

      {loading && !refreshing ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.secondary} />
          <Text style={styles.loadingText}>Guruhlar yuklanmoqda...</Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.secondary]} />}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Guruhlar biriktirilmagan</Text>
            </View>
          }
          renderItem={({ item }) => {
            const courseName = item.course?.name || 'Kurs';
            const studentsCount = item._count?.students || item.students?.length || 0;
            const schedule = item.schedule || 'Jadval ko‘rsatilmagan';
            const room = item.room || '204-xona';

            return (
              <View style={styles.card}>
                <View style={styles.header}>
                  <View style={styles.iconBox}>
                    <BookOpen size={20} color={colors.primary} />
                  </View>
                  <View style={styles.info}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.course}>{courseName}</Text>
                  </View>
                  <Badge label={`${studentsCount} ta talaba`} variant="primary" size="sm" />
                </View>

                <View style={styles.details}>
                  <View style={styles.row}>
                    <Clock size={14} color={colors.textSecondary} />
                    <Text style={styles.text}>{schedule}</Text>
                  </View>
                  <View style={styles.row}>
                    <MapPin size={14} color={colors.textSecondary} />
                    <Text style={styles.text}>{room}</Text>
                  </View>
                </View>
              </View>
            );
          }}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  course: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  details: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.xs + 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  text: {
    fontSize: 12,
    color: colors.textSecondary,
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
