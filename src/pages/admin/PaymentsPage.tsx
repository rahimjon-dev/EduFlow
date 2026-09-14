import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchInput } from '../../components/common/SearchInput';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { PaymentModal } from '../../features/payments/PaymentModal';
import { paymentsService } from '../../services/payments.service';
import { studentsService } from '../../services/students.service';
import type { Payment, PaymentStatus, PaymentStats, Student } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPaymentsData = useCallback(async () => {
    try {
      setLoading(true);
      const [pList, pStats] = await Promise.all([
        paymentsService.getAll({
          search: search || undefined,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
        }),
        paymentsService.getStats(),
      ]);
      setPayments(pList);
      setStats(pStats);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await studentsService.getAll({ pageSize: 100 });
        setStudents(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    loadStudents();
  }, []);

  useEffect(() => {
    fetchPaymentsData();
  }, [fetchPaymentsData]);

  const handleRecordPayment = async (data: any) => {
    await paymentsService.create(data);
    fetchPaymentsData();
  };

  const handleStatusUpdate = async (id: string, newStatus: PaymentStatus) => {
    await paymentsService.updateStatus(id, newStatus);
    fetchPaymentsData();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tuition Fees & Financial Transactions"
        description="Monitor invoice lifecycles, track unpaid tuition balances, and log student payments."
        actions={
          <Button
            variant="primary"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            onClick={() => setModalOpen(true)}
          >
            Record Payment
          </Button>
        }
      />

      {/* Financial KPIs */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="Total Revenue Collected"
            value={formatCurrency(stats.totalRevenue)}
            description={`${stats.paidCount} cleared transactions`}
            icon={<CheckCircle2 className="w-5 h-5" />}
            iconColor="emerald"
          />
          <StatCard
            title="Pending Invoices"
            value={formatCurrency(stats.pendingAmount)}
            description={`${stats.pendingCount} awaiting transfer`}
            icon={<Clock className="w-5 h-5" />}
            iconColor="amber"
          />
          <StatCard
            title="Overdue Receivables"
            value={formatCurrency(stats.overdueAmount)}
            description={`${stats.overdueCount} require reminder`}
            icon={<AlertTriangle className="w-5 h-5" />}
            iconColor="rose"
          />
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by student name or invoice number..."
          className="w-full sm:w-80"
        />

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            options={[
              { value: 'ALL', label: 'All Payment Statuses' },
              { value: 'PAID', label: 'Paid' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'OVERDUE', label: 'Overdue' },
            ]}
            className="w-44 text-xs py-1.5"
          />
        </div>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <LoadingState message="Loading financial transactions..." />
      ) : payments.length === 0 ? (
        <EmptyState
          title="No transactions found"
          description="Try changing your search parameters or log a new payment."
          actionText="Record Payment"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Course / Item</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Date / Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs font-semibold text-slate-800">
                  {p.invoiceNumber}
                </TableCell>
                <TableCell>
                  <p className="text-xs font-semibold text-slate-900">{p.studentName}</p>
                  <p className="text-[11px] text-slate-400">ID: {p.studentId}</p>
                </TableCell>
                <TableCell className="text-xs text-slate-600">{p.courseTitle || p.paymentType}</TableCell>
                <TableCell className="text-xs font-bold text-slate-900">{formatCurrency(p.amount)}</TableCell>
                <TableCell className="text-xs text-slate-600">{p.method || 'Online'}</TableCell>
                <TableCell className="text-xs text-slate-500">{p.date}</TableCell>
                <TableCell>
                  <StatusBadge status={p.status} size="sm" />
                </TableCell>
                <TableCell className="text-right">
                  {p.status !== 'PAID' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(p.id, 'PAID')}
                    >
                      Mark Paid
                    </Button>
                  ) : (
                    <span className="text-xs text-emerald-600 font-medium">Cleared</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <PaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleRecordPayment}
        students={students}
      />
    </div>
  );
};
