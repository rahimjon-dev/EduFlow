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
    return <LoadingState message="Aggregating academy telemetry and statistics..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Dashboard"
        description="Comprehensive overview of student enrollment, faculty allocations, and operational metrics."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<UserPlus className="w-4 h-4" />}
              onClick={() => navigate('/admin/students')}
            >
              Add Student
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusCircle className="w-4 h-4" />}
              onClick={() => navigate('/admin/courses')}
            >
              New Course
            </Button>
          </div>
        }
      />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Students"
          value={overview.totalStudents}
          change={overview.recentStudentsGrowth}
          changeLabel="vs last term"
          icon={<Users className="w-5 h-5" />}
          iconColor="indigo"
        />
        <StatCard
          title="Active Teachers"
          value={overview.totalTeachers}
          description="100% full department allocation"
          icon={<UserCheck className="w-5 h-5" />}
          iconColor="emerald"
        />
        <StatCard
          title="Active Courses"
          value={overview.activeCourses}
          description="8 accredited syllabi"
          icon={<BookOpen className="w-5 h-5" />}
          iconColor="amber"
        />
        <StatCard
          title="Active Cohorts"
          value={overview.activeGroups}
          description="12 synchronized groups"
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
              <CardTitle>Enrollment Velocity & Retention</CardTitle>
              <p className="text-xs text-slate-500 mt-1">Monthly student growth trend for the past 6 months</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" /> +55% Net Growth
            </span>
          </CardHeader>
          <CardContent>
            {/* Visual Custom Responsive Bar Representation */}
            <div className="pt-4 pb-2">
              <div className="h-48 flex items-end justify-between gap-2 sm:gap-6 px-2">
                {monthlyMetrics.map((item) => {
                  const heightPercent = Math.round((item.students / 160) * 100);
                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="relative w-full flex justify-center items-end h-36">
                        <div
                          className="w-full max-w-[36px] bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md transition-all duration-300 group-hover:from-indigo-700 group-hover:to-indigo-500 shadow-xs"
                          style={{ height: `${heightPercent}%` }}
                        >
                          {/* Tooltip on hover */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-semibold py-0.5 px-2 rounded whitespace-nowrap pointer-events-none shadow-md">
                            {item.students} Students
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-600">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 text-center text-xs">
              <div>
                <p className="text-slate-500">Monthly Revenue</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{formatCurrency(overview.monthlyRevenue)}</p>
              </div>
              <div>
                <p className="text-slate-500">Average Attendance</p>
                <p className="text-sm font-bold text-emerald-600 mt-0.5">{overview.avgAttendanceRate}%</p>
              </div>
              <div>
                <p className="text-slate-500">New Enrollments</p>
                <p className="text-sm font-bold text-indigo-600 mt-0.5">+19 this mo.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Attendance Metric */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Administrative Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <Button
                variant="outline"
                className="w-full justify-start text-xs font-medium"
                leftIcon={<Users className="w-4 h-4 text-indigo-600" />}
                onClick={() => navigate('/admin/students')}
              >
                Manage Student Records
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs font-medium"
                leftIcon={<Calendar className="w-4 h-4 text-emerald-600" />}
                onClick={() => navigate('/admin/attendance')}
              >
                Launch Roll-Call Attendance
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs font-medium"
                leftIcon={<Clock className="w-4 h-4 text-sky-600" />}
                onClick={() => navigate('/admin/schedule')}
              >
                Inspect Timetable Schedule
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs font-medium"
                leftIcon={<Layers className="w-4 h-4 text-amber-600" />}
                onClick={() => navigate('/admin/groups')}
              >
                View Cohort Classes
              </Button>
            </CardContent>
          </Card>

          {/* Today's Schedule Mini-widget */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm">Upcoming Classes Today</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/schedule')}>
                View All
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
                <CardTitle>Recent Student Enrollments</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Latest registrations into academy programs</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={() => navigate('/admin/students')}
              >
                Full Roster
              </Button>
            </CardHeader>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead className="text-right">Action</TableHead>
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
                        View
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
                Live System Activity
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
