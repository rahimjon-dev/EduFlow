import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, CalendarCheck, Calendar, BookMarked, ArrowRight, Clock, Users } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { LoadingState } from '../../components/ui/LoadingState';
import { groupsService } from '../../services/groups.service';
import { scheduleService } from '../../services/schedule.service';
import { homeworkService } from '../../services/homework.service';
import type { Group, ClassSession, Homework } from '../../types';

export const TeacherDashboardPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [todayClasses, setTodayClasses] = useState<ClassSession[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Marcus Chen (tch-2) or Eleanor Vance (tch-1)
        const [gList, schList, hwList] = await Promise.all([
          groupsService.getAll(),
          scheduleService.getAll({ dayOfWeek: 'Monday' }),
          homeworkService.getAll(),
        ]);
        setGroups(gList.slice(0, 3));
        setTodayClasses(schList.slice(0, 3));
        setHomeworks(hwList.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingState message="Loading teacher workspace..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher Portal & Classroom Command"
        description="Welcome back, Prof. Marcus Chen. Monitor your student cohorts, record roll-call, and review assignments."
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<CalendarCheck className="w-4 h-4" />}
            onClick={() => navigate('/teacher/attendance')}
          >
            Take Roll-Call Attendance
          </Button>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Assigned Cohorts"
          value={groups.length}
          description="Active learning groups"
          icon={<Layers className="w-5 h-5" />}
          iconColor="emerald"
        />
        <StatCard
          title="Today's Classes"
          value={todayClasses.length}
          description="Scheduled lectures & labs"
          icon={<Calendar className="w-5 h-5" />}
          iconColor="indigo"
        />
        <StatCard
          title="Active Homework"
          value={homeworks.length}
          description="Awaiting student submission"
          icon={<BookMarked className="w-5 h-5" />}
          iconColor="amber"
        />
      </div>

      {/* Two columns: Today's Timetable and Active Cohorts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Today's Teaching Schedule
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/teacher/schedule')}>
              Full Timetable
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayClasses.map((item) => (
              <div key={item.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{item.courseTitle}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Cohort: {item.groupName} • Room: {item.room}</p>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
                  {item.startTime} - {item.endTime}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Assigned Cohort Groups */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              My Active Cohort Classes
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/teacher/groups')}>
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {groups.map((group) => (
              <div key={group.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{group.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{group.schedule} • {group.room}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/teacher/attendance')}
                >
                  Roll-Call
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Homework reviews */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Pending Homework & Student Submissions</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/teacher/homework')}>
            Manage All Coursework
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {homeworks.map((hw) => (
              <div key={hw.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
                <p className="text-xs font-bold text-slate-900">{hw.title}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{hw.description}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                  <span>Due: {hw.dueDate}</span>
                  <span className="text-emerald-600 font-semibold">{hw.submissionsCount} / {hw.totalStudents} Submitted</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
