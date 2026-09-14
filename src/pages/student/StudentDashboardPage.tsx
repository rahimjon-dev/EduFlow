import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Award, BookMarked, CreditCard, Clock, CheckCircle2 } from 'lucide-react';
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
  const [grades, setGrades] = useState<Grade[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Load for demo student Alexander Wright (stu-1)
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

  if (loading) return <LoadingState message="Loading your learner dashboard..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Portal & Learning Hub"
        description="Welcome, Alexander Wright. Enrolled in Modern Full-Stack Web Development (Cohort 24A)."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/student/homework')}
          >
            Submit Homework
          </Button>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <StatCard
          title="Attendance Rate"
          value="96%"
          description="High compliance badge"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconColor="emerald"
        />
        <StatCard
          title="Average Grade"
          value="A+ (96%)"
          description="Dean's honors list"
          icon={<Award className="w-5 h-5" />}
          iconColor="indigo"
        />
        <StatCard
          title="Due Assignments"
          value={homeworks.length}
          description="Pending submission"
          icon={<BookMarked className="w-5 h-5" />}
          iconColor="amber"
        />
        <StatCard
          title="Tuition Balance"
          value="$0.00"
          description="Paid in full"
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
              Upcoming Classes
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/student/schedule')}>
              Full Timetable
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
              Assigned Homework & Coursework
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/student/homework')}>
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {homeworks.slice(0, 2).map((hw) => (
              <div key={hw.id} className="p-3 rounded-xl border border-slate-200/80 flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-900">{hw.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{hw.description}</p>
                  <span className="text-[10px] text-amber-700 font-semibold block mt-1">Due: {hw.dueDate}</span>
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
            Recent Grade Transcripts
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/student/grades')}>
            Full Report Card
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {grades.map((grd) => (
              <div key={grd.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                <div>
                  <p className="font-bold text-slate-900">{grd.examTitle}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{grd.courseTitle} • Evaluated on {grd.date}</p>
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
