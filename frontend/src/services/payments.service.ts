import { mockPayments } from '../data/payments';
import type { Payment, PaymentFilters, PaymentStats } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { apiClient, simulateLatency } from './api/apiClient';

class PaymentsService {
  private payments: Payment[] = loadFromStorage('payments', mockPayments);

  private save() {
    saveToStorage('payments', this.payments);
  }

  async getAll(filters?: PaymentFilters): Promise<Payment[]> {
    try {
      const apiPayments = await apiClient.get<any[]>('/payments', {
        ...(filters?.studentId ? { studentId: filters.studentId } : {}),
        ...(filters?.status && filters.status !== 'ALL' ? { status: filters.status } : {}),
      });

      if (Array.isArray(apiPayments) && apiPayments.length > 0) {
        const mapped: Payment[] = apiPayments.map((p) => ({
          id: p.id,
          studentId: p.studentId,
          studentName: p.student?.user?.fullName || 'Talaba',
          courseTitle: p.student?.group?.course?.name || 'Zamonaviy Dasturlash Kursi',
          amount: Number(p.amount) || 1200000,
          date: p.paidAt
            ? new Date(p.paidAt).toISOString().split('T')[0]
            : (p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : '2026-02-15'),
          dueDate: '2026-03-01',
          status: p.status === 'PAID' ? 'PAID' : (p.status === 'PENDING' ? 'PENDING' : 'OVERDUE'),
          paymentType: 'TUITION',
          invoiceNumber: `INV-2026-${p.id.slice(0, 4).toUpperCase()}`,
        }));

        let result = [...mapped];
        if (filters?.search) {
          const q = filters.search.toLowerCase();
          result = result.filter(
            (p) =>
              p.studentName.toLowerCase().includes(q) ||
              p.invoiceNumber.toLowerCase().includes(q) ||
              (p.courseTitle && p.courseTitle.toLowerCase().includes(q))
          );
        }
        return result;
      }
    } catch {
      // Fallback
    }

    await simulateLatency(150);
    let result = [...this.payments];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.studentName.toLowerCase().includes(q) ||
          p.invoiceNumber.toLowerCase().includes(q) ||
          (p.courseTitle && p.courseTitle.toLowerCase().includes(q))
      );
    }

    if (filters?.status && filters.status !== 'ALL') {
      result = result.filter((p) => p.status === filters.status);
    }

    if (filters?.paymentType && filters.paymentType !== 'ALL') {
      result = result.filter((p) => p.paymentType === filters.paymentType);
    }

    if (filters?.studentId) {
      result = result.filter((p) => p.studentId === filters.studentId);
    }

    return result;
  }

  async getStats(): Promise<PaymentStats> {
    await simulateLatency(100);
    const all = await this.getAll();
    const paid = all.filter((p) => p.status === 'PAID');
    const pending = all.filter((p) => p.status === 'PENDING');
    const overdue = all.filter((p) => p.status === 'OVERDUE');

    return {
      totalRevenue: paid.reduce((acc, curr) => acc + curr.amount, 0),
      pendingAmount: pending.reduce((acc, curr) => acc + curr.amount, 0),
      overdueAmount: overdue.reduce((acc, curr) => acc + curr.amount, 0),
      paidCount: paid.length,
      pendingCount: pending.length,
      overdueCount: overdue.length,
    };
  }

  async create(paymentData: Omit<Payment, 'id' | 'invoiceNumber'>): Promise<Payment> {
    try {
      const created = await apiClient.post<any>('/payments', {
        studentId: paymentData.studentId,
        amount: paymentData.amount,
        status: paymentData.status,
      });
      if (created && created.id) {
        const paymentObj: Payment = {
          ...paymentData,
          id: created.id,
          invoiceNumber: `INV-2026-${created.id.slice(0, 4).toUpperCase()}`,
        };
        this.payments.unshift(paymentObj);
        this.save();
        return paymentObj;
      }
    } catch {
      // Fallback
    }

    await simulateLatency(200);
    const newPayment: Payment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      invoiceNumber: `INV-2026-${String(this.payments.length + 1).padStart(3, '0')}`,
    };
    this.payments.unshift(newPayment);
    this.save();
    return newPayment;
  }

  async updateStatus(id: string, status: Payment['status']): Promise<Payment> {
    try {
      await apiClient.patch(`/payments/${id}`, { status });
    } catch {
      // Fallback
    }

    await simulateLatency(150);
    const idx = this.payments.findIndex((p) => p.id === id);
    if (idx === -1) {
      throw new Error(`Payment with ID ${id} not found`);
    }
    this.payments[idx].status = status;
    this.save();
    return { ...this.payments[idx] };
  }
}

export const paymentsService = new PaymentsService();
