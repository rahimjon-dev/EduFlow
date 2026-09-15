import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import type { Teacher, TeacherStatus } from '../../types';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Teacher | null;
}

export const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    qualification: '',
    experienceYears: 5,
    status: 'ACTIVE' as TeacherStatus,
    bio: '',
    courses: [] as string[],
    groups: [] as string[],
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
        specialization: initialData.specialization || '',
        qualification: initialData.qualification || '',
        experienceYears: initialData.experienceYears || 5,
        status: initialData.status || 'ACTIVE',
        bio: initialData.bio || '',
        courses: initialData.courses || [],
        groups: initialData.groups || [],
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialization: '',
        qualification: '',
        experienceYears: 5,
        status: 'ACTIVE',
        bio: '',
        courses: [],
        groups: [],
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = t('teachers.firstNameRequired');
    if (!formData.lastName.trim()) newErrors.lastName = t('teachers.lastNameRequired');
    if (!formData.email.trim()) newErrors.email = t('teachers.emailRequired');
    if (!formData.specialization.trim()) newErrors.specialization = t('teachers.specializationRequired');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        ...formData,
        joinDate: initialData?.joinDate || new Date().toISOString().split('T')[0],
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
      title={initialData ? t('teachers.editTeacher') : t('teachers.newTeacher')}
      description={t('teachers.modalDesc')}
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={loading}>
            {initialData ? t('common.save') : t('teachers.addTeacher')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('teachers.firstName')}
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            error={errors.firstName}
            placeholder="Marcus"
            required
          />
          <Input
            label={t('teachers.lastName')}
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            error={errors.lastName}
            placeholder="Chen"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('teachers.email')}
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            placeholder="instructor@eduflow.edu"
            required
          />
          <Input
            label={t('teachers.phone')}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('teachers.specialization')}
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            error={errors.specialization}
            placeholder="Applied Machine Learning"
            required
          />
          <Input
            label={t('teachers.qualification')}
            value={formData.qualification}
            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
            placeholder="Ph.D. in Computer Science"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('teachers.experienceYears')}
            type="number"
            min="0"
            max="40"
            value={formData.experienceYears}
            onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
          />
          <Select
            label={t('common.status')}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as TeacherStatus })}
            options={[
              { value: 'ACTIVE', label: t('common.active') },
              { value: 'ON_LEAVE', label: t('common.onLeave') },
              { value: 'INACTIVE', label: t('common.inactive') },
            ]}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">{t('teachers.bio')}</label>
          <textarea
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder={t('teachers.bioPlaceholder')}
            className="block w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </form>
    </Modal>
  );
};
