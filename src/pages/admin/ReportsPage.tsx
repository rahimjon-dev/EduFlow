import React, { useState, useEffect } from 'react';
import { Users, CalendarCheck, CreditCard, BookOpen, Download } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { LoadingState } from '../../components/ui/LoadingState';
import { reportsService } from '../../services/reports.service';
import type { DashboardOverview, MonthlyMetric } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const ReportsPage: React.FC = () => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [metrics, setMetrics] = useState<MonthlyMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [ov, met] = await Promise.all([
          reportsService.getOverview(),
          reportsService.getMonthlyMetrics(),
        ]);
        setOverview(ov);
        setMetrics(met);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !overview) return <LoadingState message="Generating institutional intelligence report..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Analytics & Reports"
        description="Comprehensive quarterly reporting across enrollment velocity, attendance ratios, and fiscal health."
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => alert('Exporting PDF/CSV report generated from service data...')}
          >
            Export Comprehensive Report
          </Button>
        }
      />

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Student Growth Rate"
          value={`+${overview.recentStudentsGrowth}%`}
          description="Consistent term-over-term intake"
          icon={<Users className="w-5 h-5" />}
          iconColor="indigo"
        />
        <StatCard
          title="Institution Attendance"
          value={`${overview.avgAttendanceRate}%`}
          description="High engagement benchmark"
          icon={<CalendarCheck className="w-5 h-5" />}
          iconColor="emerald"
        />
        <StatCard
          title="Monthly Recurring Gross"
          value={formatCurrency(overview.monthlyRevenue)}
          description="Tuition & lab fees"
          icon={<CreditCard className="w-5 h-5" />}
          iconColor="amber"
        />
        <StatCard
          title="Active Syllabi"
          value={overview.activeCourses}
          description="Accredited degree tracks"
          icon={<BookOpen className="w-5 h-5" />}
          iconColor="sky"
        />
      </div>

      {/* Deep Dive Section 1: Monthly Attendance & Enrollment Trajectory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Compliance Trends (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.map((m) => (
              <div key={m.month} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">{m.month}</span>
                  <span className="text-emerald-600">{m.attendance}% compliance</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${m.attendance}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.map((m) => (
              <div key={m.month} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">{m.month}</span>
                  <span className="text-indigo-600 font-bold">{formatCurrency(m.revenue)}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${(m.revenue / 30000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Course Domain Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Curriculum Enrollment Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-xs text-slate-500 font-medium">Software Engineering & Web</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">42%</p>
              <p className="text-[11px] text-emerald-600 mt-0.5">Highest demand segment</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-xs text-slate-500 font-medium">Data Science & AI</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">31%</p>
              <p className="text-[11px] text-indigo-600 mt-0.5">Fastest growing</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-xs text-slate-500 font-medium">UI/UX & Mobile Tech</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">27%</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Consistent cohort fill</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
