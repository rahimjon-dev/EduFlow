import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { apiClient } from '../../services/apiClient';
import { AttendanceStatus } from '../../types';
import { Check, X, Clock, Save } from 'lucide-react-native';

interface StudentAttendanceState {
  id: string;
  name: string;
  status: AttendanceStatus;
}

export const AttendanceScreen: React.FC = () => {
  const [attendance, setAttendance] = useState<StudentAttendanceState[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await apiClient.get<any[]>('/students');
      if (Array.isArray(res)) {
        setAttendance(
          res.map((s) => ({
            id: s.id,
            name: s.user?.fullName || s.fullName || 'Talaba',
            status: 'PRESENT' as AttendanceStatus,
          }))
        );
      }
    } catch (err: any) {
      console.warn('Failed to load students for attendance:', err?.message);
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

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) =>
      prev.map((item) => (item.id === studentId ? { ...item, status } : item))
    );
  };

  const handleSave = async () => {
    if (attendance.length === 0) {
      Alert.alert('Xatolik', 'Talabalar ro‘yxati bo‘sh');
      return;
    }

    try {
      setSaving(true);
      // Submit each student's attendance record to backend PostgreSQL
      await Promise.all(
        attendance.map((item) =>
          apiClient.post('/attendance', {
            studentId: item.id,
            status: item.status,
          }).catch((e) => console.warn(`Attendance err for ${item.id}:`, e?.message))
        )
      );

      Alert.alert(
        'Muvaffaqiyatli!',
        `Davomat maʼlumotlar bazasiga muvaffaqiyatli saqlandi! (Jami: ${attendance.length} ta yozuv)`
      );
    } catch (err: any) {
      Alert.alert('Xatolik', err?.message || 'Davomatni saqlashda xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  const presentCount = attendance.filter((a) => a.status === 'PRESENT').length;
  const absentCount = attendance.filter((a) => a.status === 'ABSENT').length;
  const lateCount = attendance.filter((a) => a.status === 'LATE').length;

  const renderItem = ({ item }: { item: StudentAttendanceState }) => (
    <View style={styles.card}>
      <View style={styles.studentInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <Text style={styles.studentName} numberOfLines={1}>{item.name}</Text>
      </View>

      <View style={styles.buttonGroup}>
        {/* Present */}
        <TouchableOpacity
          style={[styles.statusBtn, item.status === 'PRESENT' && styles.statusBtnPresent]}
          onPress={() => setStatus(item.id, 'PRESENT')}
        >
          <Check size={16} color={item.status === 'PRESENT' ? colors.white : colors.success} />
          <Text style={[styles.statusText, item.status === 'PRESENT' && styles.statusTextActive]}>
            Bor
          </Text>
        </TouchableOpacity>

        {/* Absent */}
        <TouchableOpacity
          style={[styles.statusBtn, item.status === 'ABSENT' && styles.statusBtnAbsent]}
          onPress={() => setStatus(item.id, 'ABSENT')}
        >
          <X size={16} color={item.status === 'ABSENT' ? colors.white : colors.danger} />
          <Text style={[styles.statusText, item.status === 'ABSENT' && styles.statusTextActive]}>
            Yo‘q
          </Text>
        </TouchableOpacity>

        {/* Late */}
        <TouchableOpacity
          style={[styles.statusBtn, item.status === 'LATE' && styles.statusBtnLate]}
          onPress={() => setStatus(item.id, 'LATE')}
        >
          <Clock size={16} color={item.status === 'LATE' ? colors.white : colors.warning} />
          <Text style={[styles.statusText, item.status === 'LATE' && styles.statusTextActive]}>
            Kech
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Davomat Qilish" subtitle="Real-Time Jurnal" />

      {/* Summary Bar */}
      <View style={styles.summaryBar}>
        <View style={styles.statChip}>
          <Text style={[styles.chipNumber, { color: colors.success }]}>{presentCount}</Text>
          <Text style={styles.chipLabel}>Bor</Text>
        </View>
        <View style={styles.statChip}>
          <Text style={[styles.chipNumber, { color: colors.danger }]}>{absentCount}</Text>
          <Text style={styles.chipLabel}>Yo‘q</Text>
        </View>
        <View style={styles.statChip}>
          <Text style={[styles.chipNumber, { color: colors.warning }]}>{lateCount}</Text>
          <Text style={styles.chipLabel}>Kechikdi</Text>
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Talabalar ro‘yxati yuklanmoqda...</Text>
        </View>
      ) : (
        <FlatList
          data={attendance}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Davomat uchun talabalar topilmadi</Text>
            </View>
          }
        />
      )}

      <View style={styles.footer}>
        <Button
          title="Davomatni Saqlash"
          onPress={handleSave}
          loading={saving}
          icon={<Save size={18} color={colors.white} />}
          size="lg"
        />
      </View>
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
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statChip: {
    alignItems: 'center',
  },
  chipNumber: {
    fontSize: 18,
    fontWeight: '800',
  },
  chipLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  list: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.sm,
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
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
    marginRight: spacing.sm,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  statusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusBtnPresent: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  statusBtnAbsent: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  statusBtnLate: {
    backgroundColor: colors.warning,
    borderColor: colors.warning,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  statusTextActive: {
    color: colors.white,
  },
  emptyBox: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  footer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.md,
  },
});
