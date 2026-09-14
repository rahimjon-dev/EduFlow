import React, { useState, useEffect, useCallback } from 'react';
import { FileCheck2, PlusCircle, Calendar, Clock, MapPin } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { ExamModal } from '../../features/exams/ExamModal';
import { examsService } from '../../services/exams.service';
import { coursesService } from '../../services/courses.service';
import { groupsService } from '../../services/groups.service';
import type { Exam, Course, Group } from '../../types';

export const ExamsPage: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      const data = await examsService.getAll();
      setExams(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [cList, gList] = await Promise.all([
          coursesService.getAll(),
          groupsService.getAll(),
        ]);
        setCourses(cList);
        setGroups(gList);
      } catch (e) {
        console.error(e);
      }
    };
    loadMetadata();
    fetchExams();
  }, [fetchExams]);

  const handleCreateExam = async (data: any) => {
    await examsService.create(data);
    fetchExams();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Examinations & Assessments"
        description="Schedule midterm reviews, final practical exams, and track testing hall reservations."
        actions={
          <Button
            variant="primary"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            onClick={() => setModalOpen(true)}
          >
            Schedule Exam
          </Button>
        }
      />

      {loading ? (
        <LoadingState message="Loading exam schedules..." />
      ) : exams.length === 0 ? (
        <EmptyState
          title="No exams scheduled"
          description="There are currently no examinations on the academic calendar."
          actionText="Schedule First Exam"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <Card key={exam.id} hover className="flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm line-clamp-1">{exam.title}</CardTitle>
                    <p className="text-xs font-medium text-indigo-600 mt-1">{exam.courseTitle}</p>
                  </div>
                  <StatusBadge status={exam.status} size="sm" />
                </div>
              </CardHeader>

              <CardContent className="space-y-2.5 pt-0 text-xs text-slate-600">
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{exam.date} at {exam.time} ({exam.durationMinutes} mins)</span>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Room: <strong>{exam.room}</strong></span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <span>Target: <strong className="text-slate-700">{exam.groupName}</strong></span>
                  <span>Passing: <strong className="text-emerald-700">{exam.passingMarks}/{exam.totalMarks}</strong></span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ExamModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateExam}
        courses={courses}
        groups={groups}
      />
    </div>
  );
};
