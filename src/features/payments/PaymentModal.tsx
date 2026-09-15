import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import type { PaymentStatus, PaymentType, PaymentMethod, Student } from '../../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  students: Student[];
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  students,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    studentId: students[0]?.id || '',
    amount: 600,
    paymentType: 'TUITION' as PaymentType,
    method: 'CREDIT_CARD' as PaymentMethod,
    status: 'PAID' as PaymentStatus,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedStudent = students.find((s) => s.id === formData.studentId);
    try {
      setLoading(true);
      await onSubmit({
        ...formData,
        studentName: selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : 'Student',
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('payments.modalTitle')}
      description={t('payments.modalDesc')}
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={loading}>
            {t('payments.recordPaymentBtn')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label={t('payments.selectStudent')}
          value={formData.studentId}
          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
          options={students.map((s) => ({
            value: s.id,
            label: `${s.firstName} ${s.lastName} (${s.email})`,
          }))}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={`${t('payments.amount')} ($)`}
            type="number"
            min="1"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            required
          />
          <Select
            label={t('payments.paymentCategory')}
            value={formData.paymentType}
            onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as PaymentType })}
            options={[
              { value: 'TUITION', label: t('payments.tuitionFee') },
              { value: 'REGISTRATION', label: t('payments.registrationFee') },
              { value: 'EXAM_FEE', label: t('payments.examFee') },
              { value: 'MATERIALS', label: t('payments.materialsFee') },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label={t('payments.paymentMethod')}
            value={formData.method}
            onChange={(e) => setFormData({ ...formData, method: e.target.value as PaymentMethod })}
            options={[
              { value: 'CREDIT_CARD', label: t('payments.creditCard') },
              { value: 'BANK_TRANSFER', label: t('payments.bankTransfer') },
              { value: 'ONLINE', label: t('payments.onlinePortal') },
              { value: 'CASH', label: t('payments.cash') },
            ]}
          />
          <Select
            label={t('common.status')}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as PaymentStatus })}
            options={[
              { value: 'PAID', label: t('common.paid') },
              { value: 'PENDING', label: t('common.pending') },
              { value: 'OVERDUE', label: t('common.overdue') },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('payments.paymentDate')}
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <Input
            label={t('payments.dueDate')}
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>

        <Input
          label={t('payments.notesRef')}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Receipt #8839"
        />
      </form>
    </Modal>
  );
};
