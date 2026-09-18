import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';
import { apiClient } from '../../services/apiClient';
import { BookOpen, Calendar, UploadCloud, CheckCircle } from 'lucide-react-native';

export const StudentHomeworkScreen: React.FC = () => {
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submittedIds, setSubmittedIds] = useState<Record<string, boolean>>({});

  const fetchHomeworks = useCallback(async () => {
    try {
      const res = await apiClient.get<any[]>('/homework');
      if (Array.isArray(res)) {
        setHomeworks(res);
      }
    } catch (err: any) {
      console.warn('Student homework fetch error:', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeworks();
  }, [fetchHomeworks]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeworks();
  };

  const handleSubmit = (id: string) => {
    setSubmittedIds((prev) => ({ ...prev, [id]: true }));
    Alert.alert('Muvaffaqiyatli', 'Vazifa topshirildi deb belgilandi!');
  };

  const renderItem = ({ item }: { item: any }) => {
    const isSubmitted = !!submittedIds[item.id];
    const groupName = item.group?.name || 'Guruh';
    const courseName = item.group?.course?.name || 'Asosiy Kurs';
    const deadlineStr = item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'Belgilanmagan';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconBox}>
            <BookOpen size={20} color={colors.primary} />
          </View>
          <View style={styles.info}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subject}>{courseName} • {groupName}</Text>
          </View>
          <Badge
            label={isSubmitted ? 'Topshirildi' : 'Kutilmoqda'}
            variant={isSubmitted ? 'success' : 'warning'}
          />
        </View>

        <Text style={styles.desc}>{item.description || 'Vazifani o‘z vaqtida yuklang.'}</Text>

        <View style={styles.footer}>
          <View style={styles.deadlineRow}>
            <Calendar size={14} color={colors.textSecondary} />
            <Text style={styles.deadline}>Muddat: {deadlineStr}</Text>
          </View>

          {!isSubmitted ? (
            <TouchableOpacity style={styles.submitBtn} onPress={() => handleSubmit(item.id)}>
              <UploadCloud size={14} color={colors.white} />
              <Text style={styles.submitBtnText}>Topshirish</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.submittedBadge}>
              <CheckCircle size={14} color={colors.success} />
              <Text style={styles.submittedText}>Yuborilgan</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Uy Vazifalari" subtitle={`Jami: ${homeworks.length} ta topshiriq (Baza)`} />

      {loading && !refreshing ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Topshiriqlar yuklanmoqda...</Text>
        </View>
      ) : (
        <FlatList
          data={homeworks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Hozircha uy vazifalari mavjud emas</Text>
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
  iconBox: {
    width: 38,
    height: 38,
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
  subject: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  desc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deadline: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  submitBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  submittedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  submittedText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
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
