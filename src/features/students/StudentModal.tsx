import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import type { Student, StudentStatus } from '../../types';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Student | null;
  courses: { id: string; title: string }[];
  groups: { id: string; name: string }[];
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  courses,
  groups,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    courseId: '',
    groupId: '',
    status: 'ACTIVE' as StudentStatus,
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
    address: '',
    dateOfBirth: '2004-01-01',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        courseId: initialData.courseId || (courses[0]?.id ?? ''),
        groupId: initialData.groupId || (groups[0]?.id ?? ''),
        status: initialData.status || 'ACTIVE',
        parentName: initialData.parentName || '',
        parentPhone: initialData.parentPhone || '',
        parentEmail: initialData.parentEmail || '',
        gender: initialData.gender || 'MALE',
        address: initialData.address || '',
        dateOfBirth: initialData.dateOfBirth || '2004-01-01',
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        courseId: courses[0]?.id || '',
        groupId: groups[0]?.id || '',
        status: 'ACTIVE',
        parentName: '',
        parentPhone: '',
        parentEmail: '',
        gender: 'MALE',
        address: '',
        dateOfBirth: '2004-01-01',
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen, courses, groups]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = t('students.firstNameRequired');
    if (!formData.lastName.trim()) newErrors.lastName = t('students.lastNameRequired');
    if (!formData.email.trim()) newErrors.email = t('students.emailRequired');
    if (!formData.phone.trim()) newErrors.phone = t('students.phoneRequired');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t('students.editStudent') : t('students.newStudent')}
      description={t('students.modalDesc')}
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={loading}>
            {initialData ? t('common.save') : t('students.addStudent')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('students.firstName')}
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            error={errors.firstName}
            placeholder="Liam"
            required
          />
          <Input
            label={t('students.lastName')}
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            error={errors.lastName}
            placeholder="Johnson"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('students.email')}
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            placeholder="student@example.com"
            required
          />
          <Input
            label={t('students.phone')}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={errors.phone}
            placeholder="+1 (555) 000-0000"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label={t('students.enrolledCourse')}
            value={formData.courseId}
            onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
            options={courses.map((c) => ({ value: c.id, label: c.title }))}
          />
          <Select
            label={t('students.assignedGroup')}
            value={formData.groupId}
            onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
            options={groups.map((g) => ({ value: g.id, label: g.name }))}
          />
          <Select
            label={t('common.status')}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as StudentStatus })}
            options={[
              { value: 'ACTIVE', label: t('common.active') },
              { value: 'INACTIVE', label: t('common.inactive') },
              { value: 'GRADUATED', label: t('common.graduated') },
              { value: 'SUSPENDED', label: t('common.suspended') },
            ]}
          />
        </div>

        <div className="pt-2 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">{t('students.guardianRecord')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('students.parentName')}
              value={formData.parentName}
              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
              placeholder="David Johnson"
            />
            <Input
              label={t('students.parentPhone')}
              value={formData.parentPhone}
              onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
              placeholder="+1 (555) 911-0000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('students.address')}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder={t('students.addressPlaceholder')}
          />
          <Input
            label={t('students.dateOfBirth')}
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};
