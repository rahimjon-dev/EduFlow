import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Award, BookMarked, CreditCard, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { LoadingState } from '../../components/ui/LoadingState';
import { gradesService } from '../../services/grades.service';
import { homeworkService } from '../../services/homework.service';
import { scheduleService } from '../../services/schedule.service';
import type { Grade, Homework, ClassSession } from '../../types';

export const StudentDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [gList, hwList, schList] = await Promise.all([
          gradesService.getAll('stu-1'),
          homeworkService.getAll('grp-1'),
          scheduleService.getAll({ dayOfWeek: 'Monday' }),
        ]);
        setGrades(gList);
        setHomeworks(hwList);
        setClasses(schList.slice(0, 2));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingState message={t('common.loading')} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('portal.studentTitle')}
        description={t('portal.studentDesc')}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/student/homework')}
          >
            {t('portal.submitHomework')}
          </Button>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <StatCard
          title={t('portal.attendanceRate')}
          value="96%"
          description={t('portal.highCompliance')}
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconColor="emerald"
        />
        <StatCard
          title={t('portal.averageGrade')}
          value="A+ (96%)"
          description={t('portal.honorsList')}
          icon={<Award className="w-5 h-5" />}
          iconColor="indigo"
        />
        <StatCard
          title={t('portal.dueAssignments')}
          value={homeworks.length}
          description={t('portal.pendingSubmission')}
          icon={<BookMarked className="w-5 h-5" />}
          iconColor="amber"
        />
        <StatCard
          title={t('portal.tuitionBalance')}
          value="$0.00"
          description={t('portal.paidInFull')}
          icon={<CreditCard className="w-5 h-5" />}
          iconColor="sky"
        />
      </div>

      {/* Two columns: Upcoming Classes & Pending Homework */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              {t('portal.upcomingClasses')}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/student/schedule')}>
              {t('portal.fullTimetable')}
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {classes.map((cls) => (
              <div key={cls.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{cls.courseTitle}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{cls.room} • {cls.teacherName}</p>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
                  {cls.startTime} - {cls.endTime}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-amber-600" />
              {t('portal.assignedHomework')}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/student/homework')}>
              {t('common.viewAll')}
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {homeworks.slice(0, 2).map((hw) => (
              <div key={hw.id} className="p-3 rounded-xl border border-slate-200/80 flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-900">{hw.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{hw.description}</p>
                  <span className="text-[10px] text-amber-700 font-semibold block mt-1">{t('homework.due')}: {hw.dueDate}</span>
                </div>
                <StatusBadge status={hw.status} size="sm" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Grade Transcripts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            {t('portal.recentTranscripts')}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/student/grades')}>
            {t('portal.fullReportCard')}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {grades.map((grd) => (
              <div key={grd.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                <div>
                  <p className="font-bold text-slate-900">{grd.examTitle}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{grd.courseTitle} • {grd.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-indigo-600 text-sm">{grd.percentage}%</span>
                  <span className="px-2.5 py-0.5 rounded-md font-bold text-xs bg-indigo-100 text-indigo-700">
                    {grd.letterGrade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
