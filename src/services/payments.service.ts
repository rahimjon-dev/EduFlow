import { mockPayments, mockPaymentStats } from '../mocks/payments.mock';
import type { Payment, PaymentFilters, PaymentStats } from '../types';
import { simulateLatency } from './api/apiClient';

class PaymentsService {
  private payments: Payment[] = [...mockPayments];

  async getAll(filters?: PaymentFilters): Promise<Payment[]> {
    await simulateLatency(200);
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
    await simulateLatency(150);
    const paid = this.payments.filter((p) => p.status === 'PAID');
    const pending = this.payments.filter((p) => p.status === 'PENDING');
    const overdue = this.payments.filter((p) => p.status === 'OVERDUE');

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
    await simulateLatency(250);
    const newPayment: Payment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      invoiceNumber: `INV-2024-${String(this.payments.length + 1).padStart(3, '0')}`,
    };
    this.payments.unshift(newPayment);
    return newPayment;
  }

  async updateStatus(id: string, status: Payment['status']): Promise<Payment> {
    await simulateLatency(200);
    const idx = this.payments.findIndex((p) => p.id === id);
    if (idx === -1) {
      throw new Error(`Payment with ID ${id} not found`);
    }
    this.payments[idx].status = status;
    return { ...this.payments[idx] };
  }
}

export const paymentsService = new PaymentsService();
