import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Calendar, Users, Trash2 } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { HomeworkModal } from '../../features/homework/HomeworkModal';
import { homeworkService } from '../../services/homework.service';
import { coursesService } from '../../services/courses.service';
import { groupsService } from '../../services/groups.service';
import type { Homework, Course, Group } from '../../types';

export const HomeworkPage: React.FC = () => {
  const { t } = useTranslation();
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchHomeworks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await homeworkService.getAll();
      setHomeworks(data);
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
    fetchHomeworks();
  }, [fetchHomeworks]);

  const handleCreateHomework = async (data: any) => {
    await homeworkService.create(data);
    fetchHomeworks();
  };

  const handleDelete = async (id: string) => {
    await homeworkService.delete(id);
    fetchHomeworks();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('homework.title')}
        description={t('homework.desc')}
        actions={
          <Button
            variant="primary"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            onClick={() => setModalOpen(true)}
          >
            {t('homework.assignHomework')}
          </Button>
        }
      />

      {loading ? (
        <LoadingState message={t('homework.loadingHomework')} />
      ) : homeworks.length === 0 ? (
        <EmptyState
          title={t('homework.noHomework')}
          description={t('homework.noHomeworkDesc')}
          actionText={t('homework.assignFirstHomework')}
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {homeworks.map((hw) => (
            <Card key={hw.id} hover className="flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{hw.title}</CardTitle>
                    <p className="text-xs font-medium text-indigo-600 mt-1">
                      {hw.courseTitle} • {hw.groupName}
                    </p>
                  </div>
                  <StatusBadge status={hw.status} size="sm" />
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-0 text-xs text-slate-600">
                <p className="leading-relaxed text-slate-500 line-clamp-3">{hw.description}</p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('homework.due')}: <strong>{hw.dueDate}</strong></span>
                  </div>
                  <span className="text-slate-500 font-medium">{t('homework.maxPoints')}: <strong>{hw.maxPoints} {t('homework.points')}</strong></span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span>{t('courses.instructor')}: <strong className="text-slate-700">{hw.teacherName}</strong></span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <Users className="w-3.5 h-3.5" />
                    {hw.submissionsCount || 0} / {hw.totalStudents || 15} {t('homework.submitted')}
                  </span>
                </div>
              </CardContent>

              <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-rose-50 text-rose-600"
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={() => handleDelete(hw.id)}
                >
                  {t('common.delete')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <HomeworkModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateHomework}
        courses={courses}
        groups={groups}
      />
    </div>
  );
};
