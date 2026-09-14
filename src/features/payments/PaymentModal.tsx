import React, { useState } from 'react';
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
      title="Record Tuition / Fee Payment"
      description="Create a manual invoice or log a student transaction."
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={loading}>
            Record Payment
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Select Student"
          value={formData.studentId}
          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
          options={students.map((s) => ({
            value: s.id,
            label: `${s.firstName} ${s.lastName} (${s.email})`,
          }))}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Amount ($)"
            type="number"
            min="1"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            required
          />
          <Select
            label="Payment Category"
            value={formData.paymentType}
            onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as PaymentType })}
            options={[
              { value: 'TUITION', label: 'Tuition Fee' },
              { value: 'REGISTRATION', label: 'Registration' },
              { value: 'EXAM_FEE', label: 'Exam Fee' },
              { value: 'MATERIALS', label: 'Books / Materials' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Payment Method"
            value={formData.method}
            onChange={(e) => setFormData({ ...formData, method: e.target.value as PaymentMethod })}
            options={[
              { value: 'CREDIT_CARD', label: 'Credit Card / Stripe' },
              { value: 'BANK_TRANSFER', label: 'Bank Wire / ACH' },
              { value: 'ONLINE', label: 'Online Portal' },
              { value: 'CASH', label: 'Cash / On-Site' },
            ]}
          />
          <Select
            label="Initial Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as PaymentStatus })}
            options={[
              { value: 'PAID', label: 'Paid' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'OVERDUE', label: 'Overdue' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Payment Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>

        <Input
          label="Notes / Receipt Reference"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="e.g. Receipt #8839 wire confirmation"
        />
      </form>
    </Modal>
  );
};
