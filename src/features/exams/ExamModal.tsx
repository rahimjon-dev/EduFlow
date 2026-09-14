import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import type { Course, Group, ExamStatus } from '../../types';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  courses: Course[];
  groups: Group[];
}

export const ExamModal: React.FC<ExamModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  courses,
  groups,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    courseId: courses[0]?.id || '',
    groupId: groups[0]?.id || '',
    date: '2024-04-10',
    time: '10:00 AM',
    durationMinutes: 90,
    totalMarks: 100,
    passingMarks: 65,
    room: 'Lab Alpha (302)',
    status: 'UPCOMING' as ExamStatus,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Exam title is required');
      return;
    }
    const c = courses.find((course) => course.id === formData.courseId);
    const g = groups.find((group) => group.id === formData.groupId);

    try {
      setLoading(true);
      await onSubmit({
        ...formData,
        courseTitle: c ? c.title : 'Course',
        groupName: g ? g.name : 'Group',
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
      title="Schedule Academic Examination"
      description="Set date, time slot, duration, and test room details."
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={loading}>
            Schedule Exam
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Exam Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={error}
          placeholder="e.g. Midterm: React Architecture"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Target Course"
            value={formData.courseId}
            onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
            options={courses.map((c) => ({ value: c.id, label: c.title }))}
          />
          <Select
            label="Target Group"
            value={formData.groupId}
            onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
            options={groups.map((g) => ({ value: g.id, label: g.name }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <Input
            label="Start Time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            placeholder="10:00 AM"
          />
          <Input
            label="Duration (Mins)"
            type="number"
            value={formData.durationMinutes}
            onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Total Marks"
            type="number"
            value={formData.totalMarks}
            onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
          />
          <Input
            label="Passing Marks"
            type="number"
            value={formData.passingMarks}
            onChange={(e) => setFormData({ ...formData, passingMarks: Number(e.target.value) })}
          />
          <Input
            label="Room / Hall"
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            placeholder="Lab Alpha (302)"
          />
        </div>
      </form>
    </Modal>
  );
};
