import React, { useState, useEffect } from 'react';
import { Users, CalendarCheck, CreditCard, BookOpen, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from '../../i18n';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { LoadingState } from '../../components/ui/LoadingState';
import { reportsService } from '../../services/reports.service';
import type { DashboardOverview, MonthlyMetric } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
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

  if (loading || !overview) return <LoadingState message={t('reports.loadingReports')} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('reports.title')}
        description={t('reports.desc')}
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => toast.success(t('reports.exportStarted'))}
          >
            {t('reports.exportReport')}
          </Button>
        }
      />

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('reports.studentGrowthRate')}
          value={`+${overview.recentStudentsGrowth}%`}
          description={t('reports.studentGrowthDesc')}
          icon={<Users className="w-5 h-5" />}
          iconColor="indigo"
        />
        <StatCard
          title={t('reports.attendanceCompliance')}
          value={`${overview.avgAttendanceRate}%`}
          description={t('reports.attendanceDesc')}
          icon={<CalendarCheck className="w-5 h-5" />}
          iconColor="emerald"
        />
        <StatCard
          title={t('reports.monthlyRevenueGross')}
          value={formatCurrency(overview.monthlyRevenue)}
          description={t('reports.monthlyRevenueDesc')}
          icon={<CreditCard className="w-5 h-5" />}
          iconColor="amber"
        />
        <StatCard
          title={t('reports.activeSyllabi')}
          value={overview.activeCourses}
          description={t('reports.activeSyllabiDesc')}
          icon={<BookOpen className="w-5 h-5" />}
          iconColor="sky"
        />
      </div>

      {/* Deep Dive Section 1: Monthly Attendance & Enrollment Trajectory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('reports.attendanceTrends')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.map((m) => (
              <div key={m.month} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">{m.month}</span>
                  <span className="text-emerald-600">{m.attendance}% {t('reports.compliance')}</span>
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
            <CardTitle>{t('reports.revenueGrowth')}</CardTitle>
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
          <CardTitle>{t('reports.distribution')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-xs text-slate-500 font-medium">{t('reports.domainSoftware')}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">42%</p>
              <p className="text-[11px] text-emerald-600 mt-0.5">{t('reports.domainSoftwareDesc')}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-xs text-slate-500 font-medium">{t('reports.domainData')}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">31%</p>
              <p className="text-[11px] text-indigo-600 mt-0.5">{t('reports.domainDataDesc')}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-xs text-slate-500 font-medium">{t('reports.domainDesign')}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">27%</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{t('reports.domainDesignDesc')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
