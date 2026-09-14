import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import type { Group, GroupStatus, Course, Teacher } from '../../types';

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Group | null;
  courses: Course[];
  teachers: Teacher[];
}

export const GroupModal: React.FC<GroupModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  courses,
  teachers,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    courseId: '',
    teacherId: '',
    schedule: 'Mon, Wed 10:00 - 12:00 PM',
    room: 'Lab Alpha (302)',
    capacity: 20,
    status: 'ACTIVE' as GroupStatus,
    startDate: '2024-03-01',
    endDate: '2024-07-01',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        courseId: initialData.courseId || (courses[0]?.id ?? ''),
        teacherId: initialData.teacherId || (teachers[0]?.id ?? ''),
        schedule: initialData.schedule || 'Mon, Wed 10:00 - 12:00 PM',
        room: initialData.room || 'Lab Alpha (302)',
        capacity: initialData.capacity || 20,
        status: initialData.status || 'ACTIVE',
        startDate: initialData.startDate || '2024-03-01',
        endDate: initialData.endDate || '2024-07-01',
      });
    } else {
      setFormData({
        name: '',
        courseId: courses[0]?.id || '',
        teacherId: teachers[0]?.id || '',
        schedule: 'Mon, Wed 10:00 - 12:00 PM',
        room: 'Lab Alpha (302)',
        capacity: 20,
        status: 'ACTIVE',
        startDate: '2024-03-01',
        endDate: '2024-07-01',
      });
    }
    setErrors({});
  }, [initialData, isOpen, courses, teachers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Group name is required';
    if (!formData.room.trim()) newErrors.room = 'Classroom room is required';
    if (!formData.schedule.trim()) newErrors.schedule = 'Schedule description is required';

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
      title={initialData ? 'Edit Class Cohort / Group' : 'Create New Group'}
      description="Configure group cohort, classroom allocation, and assigned teacher."
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={loading}>
            {initialData ? 'Save Changes' : 'Create Group'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Group / Cohort Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          placeholder="e.g. FSW-Cohort-24C"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Associated Course"
            value={formData.courseId}
            onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
            options={courses.map((c) => ({ value: c.id, label: c.title }))}
          />
          <Select
            label="Assigned Instructor"
            value={formData.teacherId}
            onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
            options={teachers.map((t) => ({
              value: t.id,
              label: `${t.firstName} ${t.lastName}`,
            }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Meeting Schedule"
            value={formData.schedule}
            onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
            placeholder="e.g. Mon, Wed 10:00 - 12:00 PM"
            required
          />
          <Input
            label="Assigned Room / Lab"
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            placeholder="e.g. Lab Alpha (302)"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Class Capacity (Seats)"
            type="number"
            min="5"
            max="60"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
          />
          <Select
            label="Cohort Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as GroupStatus })}
            options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'UPCOMING', label: 'Upcoming' },
              { value: 'COMPLETED', label: 'Completed' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};
