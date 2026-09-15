import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  BookOpen,
  Layers,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  UserPlus,
  PlusCircle,
  Activity,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from '../../i18n';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { LoadingState } from '../../components/ui/LoadingState';
import { reportsService } from '../../services/reports.service';
import { studentsService } from '../../services/students.service';
import { scheduleService } from '../../services/schedule.service';
import type { DashboardOverview, ActivityItem, MonthlyMetric, Student, ClassSession } from '../../types';
import { formatCurrency, getInitials } from '../../utils/formatters';

export const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [monthlyMetrics, setMonthlyMetrics] = useState<MonthlyMetric[]>([]);
  const [recentStudents, setRecentStudents] = useState<Student[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [ovData, actData, metData, stuData, schData] = await Promise.all([
          reportsService.getOverview(),
          reportsService.getRecentActivities(),
          reportsService.getMonthlyMetrics(),
          studentsService.getAll({ page: 1, pageSize: 5 }),
          scheduleService.getAll({ dayOfWeek: 'Monday' }),
        ]);

        setOverview(ovData);
        setActivities(actData);
        setMonthlyMetrics(metData);
        setRecentStudents(stuData.data);
        setUpcomingClasses(schData.slice(0, 3));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading || !overview) {
    return <LoadingState message={t('dashboard.loading')} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('dashboard.title')}
        description={t('dashboard.desc')}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<UserPlus className="w-4 h-4" />}
              onClick={() => navigate('/admin/students')}
            >
              {t('dashboard.addStudent')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusCircle className="w-4 h-4" />}
              onClick={() => navigate('/admin/courses')}
            >
              {t('dashboard.newCourse')}
            </Button>
          </div>
        }
      />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title={t('dashboard.totalStudents')}
          value={overview.totalStudents}
          change={overview.recentStudentsGrowth}
          changeLabel={t('dashboard.vsLastTerm')}
          icon={<Users className="w-5 h-5" />}
          iconColor="indigo"
        />
        <StatCard
          title={t('dashboard.activeTeachers')}
          value={overview.totalTeachers}
          description={t('dashboard.fullAllocation')}
          icon={<UserCheck className="w-5 h-5" />}
          iconColor="emerald"
        />
        <StatCard
          title={t('dashboard.activeCourses')}
          value={overview.activeCourses}
          description={t('dashboard.accreditedSyllabi')}
          icon={<BookOpen className="w-5 h-5" />}
          iconColor="amber"
        />
        <StatCard
          title={t('dashboard.activeGroups')}
          value={overview.activeGroups}
          description={t('dashboard.activeCohortsSchedule')}
          icon={<Layers className="w-5 h-5" />}
          iconColor="sky"
        />
      </div>

      {/* Visual Analytics / Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Growth & Attendance Bar Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>{t('dashboard.enrollmentVelocity')}</CardTitle>
              <p className="text-xs text-slate-500 mt-1">{t('dashboard.enrollmentSubtitle')}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" /> {t('dashboard.netGrowth')}
            </span>
          </CardHeader>
          <CardContent>
            {/* Recharts Bar Representation */}
            <div className="pt-4 pb-2 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  />
                  <Bar dataKey="students" name={t('common.students')} fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 text-center text-xs">
              <div>
                <p className="text-slate-500">{t('dashboard.monthlyRevenue')}</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{formatCurrency(overview.monthlyRevenue)}</p>
              </div>
              <div>
                <p className="text-slate-500">{t('dashboard.avgAttendance')}</p>
                <p className="text-sm font-bold text-emerald-600 mt-0.5">{overview.avgAttendanceRate}%</p>
              </div>
              <div>
                <p className="text-slate-500">{t('dashboard.newEnrollments')}</p>
                <p className="text-sm font-bold text-indigo-600 mt-0.5">+19</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Attendance Metric */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{t('dashboard.quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <Button
                variant="outline"
                className="w-full justify-start text-xs font-medium"
                leftIcon={<Users className="w-4 h-4 text-indigo-600" />}
                onClick={() => navigate('/admin/students')}
              >
                {t('dashboard.manageStudents')}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs font-medium"
                leftIcon={<Calendar className="w-4 h-4 text-emerald-600" />}
                onClick={() => navigate('/admin/attendance')}
              >
                {t('dashboard.launchAttendance')}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs font-medium"
                leftIcon={<Clock className="w-4 h-4 text-sky-600" />}
                onClick={() => navigate('/admin/schedule')}
              >
                {t('dashboard.inspectSchedule')}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs font-medium"
                leftIcon={<Layers className="w-4 h-4 text-amber-600" />}
                onClick={() => navigate('/admin/groups')}
              >
                {t('dashboard.viewCohorts')}
              </Button>
            </CardContent>
          </Card>

          {/* Today's Schedule Mini-widget */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm">{t('dashboard.upcomingClasses')}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/schedule')}>
                {t('common.viewAll')}
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingClasses.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.courseTitle}</p>
                    <p className="text-[11px] text-slate-500">{item.room} • {item.teacherName}</p>
                  </div>
                  <span className="shrink-0 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/50">
                    {item.startTime}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Students & Timeline Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Students Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t('dashboard.recentEnrollments')}</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">{t('students.desc')}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={() => navigate('/admin/students')}
              >
                {t('dashboard.fullRoster')}
              </Button>
            </CardHeader>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('students.studentName')}</TableHead>
                  <TableHead>{t('students.contact')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead>{t('students.enrollmentDate')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {student.avatar ? (
                          <img src={student.avatar} alt="" className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                            {getInitials(`${student.firstName} ${student.lastName}`)}
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{student.firstName} {student.lastName}</p>
                          <p className="text-[11px] text-slate-500">{student.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">{student.phone}</TableCell>
                    <TableCell>
                      <StatusBadge status={student.status} size="sm" />
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">{student.enrollmentDate}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/students/${student.id}`)}
                      >
                        {t('common.view')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Activity Timeline */}
        <div>
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                {t('dashboard.liveActivity')}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="relative pl-5 before:absolute before:left-1.5 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-200 last:before:hidden">
                  <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{act.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{act.description}</p>
                    <span className="text-[10px] text-slate-400 font-medium block mt-1">{act.timestamp}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
