import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';
import { apiClient } from '../../services/apiClient';
import { Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react-native';

export const ChildAttendanceScreen: React.FC = () => {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAttendance = useCallback(async () => {
    try {
      const res = await apiClient.get<any[]>('/attendance');
      if (Array.isArray(res)) {
        setAttendance(res);
      }
    } catch (err: any) {
      console.warn('Child attendance fetch error:', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAttendance();
  };

  const presentCount = attendance.filter((a) => a.status === 'PRESENT').length;
  const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 100;

  return (
    <View style={styles.container}>
      <Header title="Farzand Davomati" subtitle="Qatnashish tarixi (Baza)" />

      <View style={styles.rateCard}>
        <View>
          <Text style={styles.rateLabel}>Umumiy qatnashish ko'rsatkichi</Text>
          <Text style={styles.rateSub}>
            {attendanceRate}% (Jami {attendance.length} ta darsdan {presentCount} tasida qatnashgan)
          </Text>
        </View>
        <Text style={styles.rateNumber}>{attendanceRate}%</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Davomat yuklanmoqda...</Text>
        </View>
      ) : (
        <FlatList
          data={attendance}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Hozircha davomat qaydlari kiritilmagan</Text>
            </View>
          }
          renderItem={({ item }) => {
            const isPresent = item.status === 'PRESENT';
            const isLate = item.status === 'LATE';
            const dateStr = item.date
              ? new Date(item.date).toLocaleDateString()
              : item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : 'Bugun';

            const note = isPresent
              ? 'Darsga o‘z vaqtida qatnashdi'
              : isLate
              ? 'Darsga kechikib kirdi'
              : 'Darsda qatnashmadi';

            return (
              <View style={styles.card}>
                <View style={styles.cardLeft}>
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: isPresent ? colors.successBg : isLate ? colors.warningBg : colors.dangerBg },
                    ]}
                  >
                    {isPresent ? (
                      <CheckCircle2 size={18} color={colors.success} />
                    ) : isLate ? (
                      <Clock size={18} color={colors.warning} />
                    ) : (
                      <XCircle size={18} color={colors.danger} />
                    )}
                  </View>
                  <View>
                    <Text style={styles.dateText}>{dateStr}</Text>
                    <Text style={styles.noteText}>{note}</Text>
                  </View>
                </View>

                <Badge
                  label={isPresent ? 'Kelgan' : isLate ? 'Kechikkan' : 'Kelmadi'}
                  variant={isPresent ? 'success' : isLate ? 'warning' : 'danger'}
                  size="sm"
                />
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
  rateCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: spacing.lg,
    marginBottom: 0,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  rateLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  rateSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rateNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.success,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.sm,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  noteText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyBox: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
