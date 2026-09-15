import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import type { Course, CourseStatus, Teacher } from '../../types';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Course | null;
  teachers: Teacher[];
}

export const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  teachers,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '12 Weeks',
    price: 1200,
    teacherId: '',
    status: 'ACTIVE' as CourseStatus,
    category: 'Software Engineering',
    level: 'INTERMEDIATE' as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
    maxStudents: 25,
    thumbnail: 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=600&auto=format&fit=crop&q=80',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        duration: initialData.duration || '12 Weeks',
        price: initialData.price || 1000,
        teacherId: initialData.teacherId || (teachers[0]?.id ?? ''),
        status: initialData.status || 'ACTIVE',
        category: initialData.category || 'Software Engineering',
        level: initialData.level || 'INTERMEDIATE',
        maxStudents: initialData.maxStudents || 25,
        thumbnail: initialData.thumbnail || 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=600&auto=format&fit=crop&q=80',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        duration: '12 Weeks',
        price: 1200,
        teacherId: teachers[0]?.id || '',
        status: 'ACTIVE',
        category: 'Software Engineering',
        level: 'INTERMEDIATE',
        maxStudents: 25,
        thumbnail: 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=600&auto=format&fit=crop&q=80',
      });
    }
    setErrors({});
  }, [initialData, isOpen, teachers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = t('courses.titleRequired');
    if (!formData.description.trim()) newErrors.description = t('courses.descRequired');

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
      title={initialData ? t('courses.editCourse') : t('courses.newCourse')}
      description={t('courses.modalDesc')}
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={loading}>
            {initialData ? t('courses.saveChanges') : t('courses.publishCourse')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('courses.courseTitle')}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          placeholder="Advanced Reactive Systems with TypeScript"
          required
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">{t('courses.description')}</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={t('courses.descPlaceholder')}
            className="block w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            required
          />
          {errors.description && <p className="text-xs text-rose-600">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label={t('courses.duration')}
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="14 Weeks"
          />
          <Input
            label={`${t('courses.tuition')} ($)`}
            type="number"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          />
          <Input
            label={t('courses.maxEnrollment')}
            type="number"
            min="5"
            max="100"
            value={formData.maxStudents}
            onChange={(e) => setFormData({ ...formData, maxStudents: Number(e.target.value) })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label={t('courses.category')}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: 'Software Engineering', label: 'Software Engineering' },
              { value: 'Data & AI', label: 'Data & AI' },
              { value: 'Computer Science', label: 'Computer Science' },
              { value: 'Design', label: 'Design' },
              { value: 'Cloud & DevOps', label: 'Cloud & DevOps' },
              { value: 'Mobile Development', label: 'Mobile Development' },
              { value: 'Professional Skills', label: 'Professional Skills' },
              { value: 'Cyber Security', label: 'Cyber Security' },
            ]}
          />
          <Select
            label={t('courses.instructor')}
            value={formData.teacherId}
            onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
            options={teachers.map((t) => ({
              value: t.id,
              label: `${t.firstName} ${t.lastName} (${t.specialization})`,
            }))}
          />
          <Select
            label={t('common.status')}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as CourseStatus })}
            options={[
              { value: 'ACTIVE', label: t('common.active') },
              { value: 'UPCOMING', label: t('common.upcoming') },
              { value: 'ARCHIVED', label: t('common.archived') },
            ]}
          />
        </div>
      </form>
    </Modal>
  );
};
