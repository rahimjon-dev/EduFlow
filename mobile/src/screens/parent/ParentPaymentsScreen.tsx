import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { CheckCircle, CreditCard, Download, ArrowUpRight } from 'lucide-react-native';

const paymentHistory = [
  { id: '1', month: 'Sentyabr 2026', amount: '1,200,000 so‘m', date: '01.09.2026', status: 'PAID', invoiceNo: 'INV-2026-091' },
  { id: '2', month: 'Avgust 2026', amount: '1,200,000 so‘m', date: '02.08.2026', status: 'PAID', invoiceNo: 'INV-2026-081' },
  { id: '3', month: 'Iyul 2026', amount: '1,200,000 so‘m', date: '01.07.2026', status: 'PAID', invoiceNo: 'INV-2026-071' },
];

export const ParentPaymentsScreen: React.FC = () => {
  const handlePay = () => {
    Alert.alert(
      'To‘lov Tizimi',
      'Hozirda barcha to‘lovlar to‘liq amalga oshirilgan. Yangi hisob 1-oktyabrda shakllanadi.',
      [{ text: 'Tushunarli' }]
    );
  };

  const handleDownloadInvoice = (invNo: string) => {
    Alert.alert('Kvitansiya', `${invNo} raqamli elektron to‘lov cheki muvaffaqiyatli yuklab olindi!`);
  };

  return (
    <View style={styles.container}>
      <Header title="O'quv To'lovlari" subtitle="Ali Valiyev • Frontend Kursi" />

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceTop}>
          <Text style={styles.balanceLabel}>Joriy holat</Text>
          <Badge label="To‘langan" variant="success" size="sm" />
        </View>
        <Text style={styles.balanceAmount}>0 so'm</Text>
        <Text style={styles.balanceNote}>Sizning hisobingizda qarzdorlik mavjud emas.</Text>

        <Button
          title="To'lov Qilish (Click / Payme)"
          onPress={handlePay}
          icon={<CreditCard size={18} color={colors.white} />}
          style={{ marginTop: spacing.md }}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>To'lovlar Tarixi</Text>
      </View>

      <FlatList
        data={paymentHistory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <View style={styles.checkCircle}>
                <CheckCircle size={20} color={colors.success} />
              </View>
              <View>
                <Text style={styles.monthText}>{item.month}</Text>
                <Text style={styles.invText}>{item.invoiceNo} • {item.date}</Text>
              </View>
            </View>

            <View style={styles.cardRight}>
              <Text style={styles.amountText}>{item.amount}</Text>
              <TouchableOpacity
                style={styles.downloadBtn}
                onPress={() => handleDownloadInvoice(item.invoiceNo)}
              >
                <Download size={12} color={colors.primary} />
                <Text style={styles.downloadText}>Chek</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  balanceCard: {
    backgroundColor: colors.white,
    margin: spacing.lg,
    marginBottom: 0,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  balanceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  balanceLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  balanceAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.success,
    marginBottom: 2,
  },
  balanceNote: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
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
  checkCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  invText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.primaryBg,
  },
  downloadText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
});
