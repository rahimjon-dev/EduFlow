import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Linking, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { Header } from '../../components/Header';
import { apiClient } from '../../services/apiClient';
import { mockTeachers } from '../../data/mockData';
import { Search, Phone, Star, BookOpen } from 'lucide-react-native';

export const TeachersListScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTeachers = useCallback(async () => {
    try {
      const res = await apiClient.get<any[]>('/teachers');
      if (Array.isArray(res) && res.length > 0) {
        setTeachers(res);
      } else {
        setTeachers(mockTeachers);
      }
    } catch (err: any) {
      console.warn('Failed to load teachers, using demo data:', err?.message);
      setTeachers(mockTeachers);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTeachers();
  };

  const filtered = teachers.filter((t) => {
    const name = t.user?.fullName || t.fullName || '';
    const email = t.user?.email || t.email || '';
    const phone = t.phone || '';
    const spec = t.specialty || '';

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      spec.toLowerCase().includes(search.toLowerCase()) ||
      phone.includes(search)
    );
  });

  const handleCall = (phone: string) => {
    if (!phone) {
      Alert.alert('Xatolik', 'Telefon raqam mavjud emas');
      return;
    }
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Xatolik', 'Qo‘ng‘iroq qilib bo‘lmadi');
    });
  };

  const renderTeacher = ({ item }: { item: any }) => {
    const name = item.user?.fullName || item.fullName || 'O‘qituvchi';
    const email = item.user?.email || item.email || '';
    const phone = item.phone || '+998 90 123 45 67';
    const specialty = item.specialty || 'Dasturlash';
    const groupsCount = item.groups?.length || item.groupsCount || 0;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.charAt(0)}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Star size={14} color="#EAB308" fill="#EAB308" />
            <Text style={styles.ratingText}>5.0</Text>
          </View>
        </View>

        <View style={styles.subjectsRow}>
          <View style={styles.subjectChip}>
            <Text style={styles.subjectText}>{specialty}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.groupsCount}>{groupsCount} ta guruh biriktirilgan</Text>
          <TouchableOpacity style={styles.callBtn} onPress={() => handleCall(phone)}>
            <Phone size={14} color={colors.primary} />
            <Text style={styles.callText}>{phone}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="O'qituvchilar" subtitle={`Jami: ${filtered.length} nafar (Baza)`} />

      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Search size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Ism, fan yoki telefon bo'yicha..."
            placeholderTextColor={colors.textPlaceholder}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>O'qituvchilar bazadan yuklanmoqda...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderTeacher}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>O'qituvchilar topilmadi</Text>
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
    padding: spacing.lg,
    paddingBottom: 0,
    backgroundColor: colors.background,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 42,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 14,
    color: colors.textPrimary,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.roles.TEACHER.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.roles.TEACHER.color,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  email: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.round,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#854D0E',
  },
  subjectsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: spacing.sm,
  },
  subjectChip: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subjectText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  groupsCount: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.primaryBg,
  },
  callText: {
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
