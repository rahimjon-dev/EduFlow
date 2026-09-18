import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, TextInput, RefreshControl, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { apiClient } from '../../services/apiClient';
import { Plus, BookOpen, Calendar, X } from 'lucide-react-native';

export const TeacherHomeworkScreen: React.FC = () => {
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [creating, setCreating] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [hwRes, grpRes] = await Promise.allSettled([
        apiClient.get<any[]>('/homework'),
        apiClient.get<any[]>('/groups'),
      ]);

      if (hwRes.status === 'fulfilled' && Array.isArray(hwRes.value)) {
        setHomeworks(hwRes.value);
      }
      if (grpRes.status === 'fulfilled' && Array.isArray(grpRes.value)) {
        setGroups(grpRes.value);
        if (grpRes.value.length > 0 && !selectedGroupId) {
          setSelectedGroupId(grpRes.value[0].id);
        }
      }
    } catch (err: any) {
      console.warn('Homework fetch error:', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedGroupId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) {
      Alert.alert('Xatolik', 'Iltimos, vazifa nomini kiriting');
      return;
    }
    if (!selectedGroupId) {
      Alert.alert('Xatolik', 'Iltimos, guruhni tanlang');
      return;
    }

    try {
      setCreating(true);
      const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      await apiClient.post('/homework', {
        title: newTitle.trim(),
        description: newDesc.trim() || 'Vazifani o‘z vaqtida bajaring.',
        groupId: selectedGroupId,
        dueDate,
      });

      Alert.alert('Muvaffaqiyatli', 'Yangi uy vazifasi maʼlumotlar bazasiga saqlandi!');
      setModalVisible(false);
      setNewTitle('');
      setNewDesc('');
      await fetchData();
    } catch (err: any) {
      Alert.alert('Xatolik', err?.message || 'Vazifani yaratib bo‘lmadi');
    } finally {
      setCreating(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const groupName = item.group?.name || 'Guruh';
    const courseName = item.group?.course?.name || 'Asosiy Kurs';
    const deadlineStr = item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '7 kun ichida';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconBox}>
            <BookOpen size={20} color={colors.secondary} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{courseName} • {groupName}</Text>
          </View>
          <Badge label={groupName} variant="secondary" size="sm" />
        </View>

        <Text style={styles.desc}>{item.description || 'Qo‘shimcha tavsif kiritilmagan.'}</Text>

        <View style={styles.footer}>
          <View style={styles.deadlineRow}>
            <Calendar size={14} color={colors.textSecondary} />
            <Text style={styles.deadlineText}>Muddat: {deadlineStr}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Uy Vazifalari" subtitle={`Jami: ${homeworks.length} ta topshiriq (Baza)`} />

      <View style={styles.createBar}>
        <Button
          title="Yangi Vazifa Qo'shish"
          onPress={() => setModalVisible(true)}
          icon={<Plus size={18} color={colors.white} />}
          variant="secondary"
        />
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.secondary} />
          <Text style={styles.loadingText}>Vazifalar yuklanmoqda...</Text>
        </View>
      ) : (
        <FlatList
          data={homeworks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.secondary]} />}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Hozircha vazifalar mavjud emas</Text>
            </View>
          }
        />
      )}

      {/* Modal for creating homework */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yangi Uy Vazifasi</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Biriktiriladigan guruh</Text>
              <View style={styles.groupChipsRow}>
                {groups.map((g) => (
                  <TouchableOpacity
                    key={g.id}
                    style={[styles.groupChip, selectedGroupId === g.id && styles.groupChipActive]}
                    onPress={() => setSelectedGroupId(g.id)}
                  >
                    <Text style={[styles.groupChipText, selectedGroupId === g.id && styles.groupChipTextActive]}>
                      {g.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vazifa nomi</Text>
              <TextInput
                style={styles.input}
                placeholder="Masalan: API bilan integratsiya"
                placeholderTextColor={colors.textPlaceholder}
                value={newTitle}
                onChangeText={setNewTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tavsif va ko‘rsatmalar</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Vazifa talablari..."
                placeholderTextColor={colors.textPlaceholder}
                value={newDesc}
                onChangeText={setNewDesc}
                multiline
                numberOfLines={3}
              />
            </View>

            <Button
              title="Vazifani E'lon Qilish"
              onPress={handleCreate}
              loading={creating}
              variant="secondary"
              style={{ marginTop: spacing.md }}
            />
          </View>
        </View>
      </Modal>
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
  createBar: {
    padding: spacing.lg,
    paddingBottom: 0,
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
    backgroundColor: colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
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
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deadlineText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyBox: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  groupChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  groupChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  groupChipActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  groupChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  groupChipTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: 14,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
});
