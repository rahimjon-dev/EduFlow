import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';
import { apiClient } from '../../services/apiClient';
import { DollarSign, Clock, AlertTriangle, CheckCircle } from 'lucide-react-native';

export const FinanceScreen: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    try {
      const res = await apiClient.get<any[]>('/payments');
      if (Array.isArray(res)) {
        setPayments(res);
      } else {
        setPayments([]);
      }
    } catch (err: any) {
      console.warn('Failed to load payments:', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPayments();
  };

  const totalCollected = payments
    .filter((p) => p.status === 'PAID')
    .reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

  const totalPending = payments
    .filter((p) => p.status !== 'PAID')
    .reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

  const handleMarkPaid = async (id: string) => {
    try {
      setUpdatingId(id);
      // Real PATCH call to backend database
      await apiClient.patch(`/payments/${id}`, { status: 'PAID' });
      Alert.alert('Muvaffaqiyatli', 'To‘lov qabul qilindi va maʼlumotlar bazasiga saqlandi!');
      await fetchPayments();
    } catch (err: any) {
      Alert.alert('Xatolik', err?.message || 'To‘lovni qabul qilib bo‘lmadi');
    } finally {
      setUpdatingId(null);
    }
  };

  const renderPayment = ({ item }: { item: any }) => {
    const isPaid = item.status === 'PAID';
    const isOverdue = item.status === 'OVERDUE';
    const studentName = item.student?.user?.fullName || 'Talaba';
    const amount = Number(item.amount) || 0;
    const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Bugun';

    return (
      <View style={styles.paymentCard}>
        <View style={styles.cardLeft}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: isPaid ? colors.successBg : isOverdue ? colors.dangerBg : colors.warningBg },
            ]}
          >
            {isPaid ? (
              <CheckCircle size={18} color={colors.success} />
            ) : isOverdue ? (
              <AlertTriangle size={18} color={colors.danger} />
            ) : (
              <Clock size={18} color={colors.warning} />
            )}
          </View>
          <View>
            <Text style={styles.studentName}>{studentName}</Text>
            <Text style={styles.dateText}>{dateStr} • Kurs to'lovi</Text>
          </View>
        </View>

        <View style={styles.cardRight}>
          <Text style={styles.amountText}>{amount.toLocaleString()} so‘m</Text>
          <View style={styles.statusActionRow}>
            <Badge
              label={isPaid ? 'To‘langan' : isOverdue ? 'Muddati o‘tgan' : 'Kutilmoqda'}
              variant={isPaid ? 'success' : isOverdue ? 'danger' : 'warning'}
              size="sm"
            />
            {!isPaid && (
              <TouchableOpacity
                style={styles.payBtn}
                onPress={() => handleMarkPaid(item.id)}
                disabled={updatingId === item.id}
              >
                {updatingId === item.id ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Text style={styles.payBtnText}>Qabul qilish</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const formatMln = (val: number) => {
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + ' mln so\'m';
    }
    return val.toLocaleString() + ' so\'m';
  };

  return (
    <View style={styles.container}>
      <Header title="Moliya va To'lovlar" subtitle="Tushumlar va qarzdorlik nazorati (Baza)" />

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Jami Yig'ilgan</Text>
          <Text style={[styles.summaryValue, { color: colors.success }]}>
            {formatMln(totalCollected)}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Kutilayotgan / Qarz</Text>
          <Text style={[styles.summaryValue, { color: colors.danger }]}>
            {formatMln(totalPending)}
          </Text>
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>To'lovlar yuklanmoqda...</Text>
        </View>
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id}
          renderItem={renderPayment}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>To'lovlar topilmadi</Text>
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
  summaryContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: 0,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  list: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  paymentCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.sm,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dateText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statusActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  payBtn: {
    backgroundColor: colors.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.xs,
  },
  payBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
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
