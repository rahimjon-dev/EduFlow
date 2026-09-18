import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, Linking, RefreshControl, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';
import { apiClient } from '../../services/apiClient';
import { Search, Phone, Mail, Award, CheckCircle } from 'lucide-react-native';

export const StudentsListScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'PAYMENT_PENDING' | 'INACTIVE'>('ALL');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await apiClient.get<any[]>('/students');
      if (Array.isArray(res)) {
        setStudents(res);
      } else {
        setStudents([]);
      }
    } catch (err: any) {
      console.warn('Failed to load students:', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStudents();
  };

  const filtered = students.filter((s) => {
    const name = s.user?.fullName || s.fullName || '';
    const course = s.group?.course?.name || s.group?.name || '';
    const group = s.group?.name || '';
    const phone = s.phone || '';
    const email = s.user?.email || '';

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      course.toLowerCase().includes(search.toLowerCase()) ||
      group.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      phone.includes(search);

    const matchesFilter = filter === 'ALL' || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleCall = (phone: string) => {
    if (!phone) {
      Alert.alert('Xatolik', 'Telefon raqam mavjud emas');
      return;
    }
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Xatolik', 'Qo‘ng‘iroqni amalga oshirib bo‘lmadi');
    });
  };

  const renderStudent = ({ item }: { item: any }) => {
    const name = item.user?.fullName || item.fullName || 'Talaba';
    const course = item.group?.course?.name || item.group?.name || 'Asosiy Kurs';
    const group = item.group?.name || 'Guruh biriktirilmagan';
    const phone = item.phone || '+998 90 000 00 00';
    const balance = Number(item.balance) || 0;
    const isDebt = balance < 0;
    const status = item.status || 'ACTIVE';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.charAt(0)}</Text>
          </View>
          <View style={styles.nameBlock}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.course}>{course} • {group}</Text>
          </View>
          <Badge
            label={status === 'ACTIVE' ? 'Faol' : status === 'PAYMENT_PENDING' ? 'Kutilmoqda' : 'Nofaol'}
            variant={status === 'ACTIVE' ? 'success' : status === 'PAYMENT_PENDING' ? 'warning' : 'danger'}
          />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Davomat</Text>
            <Text style={styles.statVal}>{item.attendanceRate || 95}%</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Balans</Text>
            <Text style={[styles.statVal, isDebt ? styles.debt : styles.balanceOk]}>
              {balance.toLocaleString()} so‘m
            </Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.contactBtn} onPress={() => handleCall(phone)}>
            <Phone size={14} color={colors.primary} />
            <Text style={styles.contactText}>{phone}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Talabalar Ro'yxati" subtitle={`Jami: ${filtered.length} ta (Baza)`} />

      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Search size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Ism, guruh yoki telefon bo'yicha..."
            placeholderTextColor={colors.textPlaceholder}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {(['ALL', 'ACTIVE', 'PAYMENT_PENDING', 'INACTIVE'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterPill, filter === f && styles.filterPillActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'ALL' ? 'Barchasi' : f === 'ACTIVE' ? 'Faollar' : f === 'PAYMENT_PENDING' ? 'Qarzdorlar' : 'Nofaol'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Talabalar bazadan yuklanmoqda...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderStudent}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Talabalar topilmadi</Text>
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
  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 42,
    marginBottom: spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 14,
    color: colors.textPrimary,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  filterPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  listContent: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  nameBlock: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  course: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  statVal: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  debt: {
    color: colors.danger,
  },
  balanceOk: {
    color: colors.success,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: colors.borderDark,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    justifyContent: 'flex-start',
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryBg,
  },
  contactText: {
    fontSize: 12,
    fontWeight: '600',
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
