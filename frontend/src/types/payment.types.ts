export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE';
export type PaymentType = 'TUITION' | 'REGISTRATION' | 'EXAM_FEE' | 'MATERIALS';
export type PaymentMethod = 'CREDIT_CARD' | 'BANK_TRANSFER' | 'CASH' | 'ONLINE';

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  courseTitle?: string;
  amount: number;
  paymentType: PaymentType;
  date: string;
  dueDate: string;
  status: PaymentStatus;
  method?: PaymentMethod;
  invoiceNumber: string;
  notes?: string;
}

export interface PaymentStats {
  totalRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
}

export interface PaymentFilters {
  search?: string;
  status?: PaymentStatus | 'ALL';
  paymentType?: PaymentType | 'ALL';
  studentId?: string;
}
