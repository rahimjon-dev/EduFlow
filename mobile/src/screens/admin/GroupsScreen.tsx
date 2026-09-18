import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';
import { apiClient } from '../../services/apiClient';
import { mockGroups } from '../../data/mockData';
import { BookOpen, Users, Clock, MapPin } from 'lucide-react-native';

export const GroupsScreen: React.FC = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGroups = useCallback(async () => {
    try {
      const res = await apiClient.get<any[]>('/groups');
      if (Array.isArray(res) && res.length > 0) {
        setGroups(res);
      } else {
        setGroups(mockGroups);
      }
    } catch (err: any) {
      console.warn('Failed to load groups, using demo data:', err?.message);
      setGroups(mockGroups);
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

  const renderGroup = ({ item }: { item: any }) => {
    const courseName = item.course?.name || 'Asosiy Kurs';
    const teacherName = item.teacher?.user?.fullName || 'Tayinlanmagan';
    const studentsCount = item._count?.students || item.students?.length || 0;
    const schedule = item.schedule || 'Jadval ko‘rsatilmagan';
    const room = item.room || '204-xona';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconBox}>
            <BookOpen size={20} color={colors.primary} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.courseName}>{courseName}</Text>
          </View>
          <Badge label={`${studentsCount} talaba`} variant="primary" size="sm" />
        </View>

        <View style={styles.detailsBox}>
          <View style={styles.detailRow}>
            <Users size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>
              O'qituvchi: <Text style={styles.boldText}>{teacherName}</Text>
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Clock size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>{schedule}</Text>
          </View>

          <View style={styles.detailRow}>
            <MapPin size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>Xona: {room}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Guruhlar va Darslar" subtitle={`Jami: ${groups.length} ta guruh (Baza)`} />

      {loading && !refreshing ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Guruhlar yuklanmoqda...</Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={renderGroup}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Guruhlar topilmadi</Text>
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
  list: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardHeader: {
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
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  courseName: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  detailsBox: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.xs + 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  boldText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
