import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import type { Course, Group, HomeworkStatus } from '../../types';

interface HomeworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  courses: Course[];
  groups: Group[];
}

export const HomeworkModal: React.FC<HomeworkModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  courses,
  groups,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: courses[0]?.id || '',
    groupId: groups[0]?.id || '',
    dueDate: '2024-03-25',
    maxPoints: 50,
    status: 'ACTIVE' as HomeworkStatus,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
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
        teacherId: g?.teacherId || 'tch-1',
        teacherName: 'Faculty Instructor',
        totalStudents: g?.studentsCount || 15,
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
      title="Create Homework Assignment"
      description="Publish an assignment specification with due date and grading points."
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={loading}>
            Publish Homework
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Assignment Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={error}
          placeholder="e.g. Lab Exercise 4: Async State Management"
          required
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Instructions / Description</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed instructions, submission requirements, and rubrics..."
            className="block w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Associated Course"
            value={formData.courseId}
            onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
            options={courses.map((c) => ({ value: c.id, label: c.title }))}
          />
          <Select
            label="Assigned Group"
            value={formData.groupId}
            onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
            options={groups.map((g) => ({ value: g.id, label: g.name }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
          />
          <Input
            label="Max Points"
            type="number"
            value={formData.maxPoints}
            onChange={(e) => setFormData({ ...formData, maxPoints: Number(e.target.value) })}
            required
          />
        </div>
      </form>
    </Modal>
  );
};
