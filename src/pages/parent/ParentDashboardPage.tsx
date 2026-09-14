import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CalendarCheck, Award, CreditCard, HeartHandshake, ArrowRight, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { LoadingState } from '../../components/ui/LoadingState';
import { studentsService } from '../../services/students.service';
import { gradesService } from '../../services/grades.service';
import { attendanceService } from '../../services/attendance.service';
import { paymentsService } from '../../services/payments.service';
import type { Student, Grade, AttendanceSummary, Payment } from '../../types';
import { formatCurrency, getInitials } from '../../utils/formatters';

export const ParentDashboardPage: React.FC = () => {
  const [child, setChild] = useState<Student | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [attSummary, setAttSummary] = useState<AttendanceSummary | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadParentData = async () => {
      try {
        setLoading(true);
        // Load demo child: Alexander Wright (stu-1)
        const [stu, grd, att, pay] = await Promise.all([
          studentsService.getById('stu-1'),
          gradesService.getAll('stu-1'),
          attendanceService.getStudentAttendance('stu-1'),
          paymentsService.getAll({ studentId: 'stu-1' }),
        ]);

        setChild(stu);
        setGrades(grd);
        setAttSummary(att.summary);
        setPayments(pay);
      } finally {
        setLoading(false);
      }
    };
    loadParentData();
  }, []);

  if (loading || !child) return <LoadingState message="Loading family portal..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Family & Guardian Portal"
        description="Monitor your children's educational progress, attendance records, and tuition payments."
      />

      {/* Child Profile Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {child.avatar ? (
            <img src={child.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-100" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-bold text-xl flex items-center justify-center">
              {getInitials(`${child.firstName} ${child.lastName}`)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{child.firstName} {child.lastName}</h2>
              <StatusBadge status={child.status} size="sm" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Grade Level: Undergraduate Cohort 24A • ID: {child.id}</p>
            <p className="text-xs text-indigo-600 font-medium mt-1">Course: Modern Full-Stack Web Development</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/parent/attendance')}
          >
            Attendance History
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/parent/grades')}
          >
            View Report Card
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Attendance Compliance"
          value={`${attSummary?.percentage || 96}%`}
          description="Consistently on-time"
          icon={<CalendarCheck className="w-5 h-5" />}
          iconColor="emerald"
        />
        <StatCard
          title="Academic Performance"
          value="A+ (96%)"
          description="Top percentile in class"
          icon={<Award className="w-5 h-5" />}
          iconColor="indigo"
        />
        <StatCard
          title="Tuition Balance"
          value="$0.00"
          description="All dues cleared"
          icon={<CreditCard className="w-5 h-5" />}
          iconColor="sky"
        />
      </div>

      {/* Two columns: Recent Grades and Tuition Receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Latest Exam Grades
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/parent/grades')}>
              Full Transcripts
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {grades.map((g) => (
              <div key={g.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{g.examTitle}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{g.feedback || 'Excellent comprehension'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-600 text-sm">{g.score} / {g.maxScore}</span>
                  <span className="px-2 py-0.5 rounded font-bold text-xs bg-indigo-100 text-indigo-700">
                    {g.letterGrade}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              Tuition Receipts & Billing
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/parent/payments')}>
              Payment History
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {payments.map((p) => (
              <div key={p.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{p.invoiceNumber}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{p.date} • {p.paymentType}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">{formatCurrency(p.amount)}</span>
                  <StatusBadge status={p.status} size="sm" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
