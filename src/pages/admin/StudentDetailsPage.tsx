import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
  Clock,
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { studentsService } from '../../services/students.service';
import { coursesService } from '../../services/courses.service';
import { groupsService } from '../../services/groups.service';
import { attendanceService } from '../../services/attendance.service';
import { gradesService } from '../../services/grades.service';
import { paymentsService } from '../../services/payments.service';
import { homeworkService } from '../../services/homework.service';
import type {
  Student,
  Course,
  Group,
  AttendanceRecord,
  AttendanceSummary,
  Grade,
  Payment,
  Homework,
} from '../../types';
import { formatCurrency, getInitials } from '../../utils/formatters';

export const StudentDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [student, setStudent] = useState<Student | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [attendance, setAttendance] = useState<{ records: AttendanceRecord[]; summary: AttendanceSummary } | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError('');
        const stu = await studentsService.getById(id);
        setStudent(stu);

        const [c, g, att, grd, pay, hw] = await Promise.all([
          stu.courseId ? coursesService.getById(stu.courseId).catch(() => null) : null,
          stu.groupId ? groupsService.getById(stu.groupId).catch(() => null) : null,
          attendanceService.getStudentAttendance(stu.id),
          gradesService.getAll(stu.id),
          paymentsService.getAll({ studentId: stu.id }),
          homeworkService.getAll(stu.groupId),
        ]);

        setCourse(c);
        setGroup(g);
        setAttendance(att);
        setGrades(grd);
        setPayments(pay);
        setHomeworks(hw);
      } catch (err: any) {
        setError(err.message || 'Failed to load student details');
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  if (loading) return <LoadingState message={t('students.loadingDetails')} />;
  if (error || !student) {
    return <ErrorState message={error || t('common.noData')} onRetry={() => navigate('/admin/students')} />;
  }

  const tabs = [
    { id: 'overview', label: t('students.tabOverview') },
    { id: 'attendance', label: t('students.tabAttendance'), count: attendance?.summary.total || 0 },
    { id: 'grades', label: t('students.tabGrades'), count: grades.length },
    { id: 'homework', label: t('students.tabHomework'), count: homeworks.length },
    { id: 'payments', label: t('students.tabPayments'), count: payments.length },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${student.firstName} ${student.lastName}`}
        description={`${t('students.studentId')}: ${student.id} • ${t('students.enrolledOn')} ${student.enrollmentDate}`}
        breadcrumbs={[
          { label: t('common.students'), href: '/admin/students' },
          { label: `${student.firstName} ${student.lastName}` },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/admin/students')}
          >
            {t('students.backToDirectory')}
          </Button>
        }
      />

      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {student.avatar ? (
            <img
              src={student.avatar}
              alt=""
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-md"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white font-bold text-2xl flex items-center justify-center">
              {getInitials(`${student.firstName} ${student.lastName}`)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900">{student.firstName} {student.lastName}</h2>
              <StatusBadge status={student.status} size="sm" />
            </div>
            <p className="text-xs text-slate-500 mt-1">{student.email} • {student.phone}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
              <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-medium">
                {course ? course.title : t('students.noCourseAssigned')}
              </span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-medium">
                {t('schedule.cohort')}: {group ? group.name : t('students.unassigned')}
              </span>
            </div>
          </div>
        </div>

        {/* Quick stats badges */}
        <div className="grid grid-cols-3 gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 text-center">
          <div className="px-2">
            <p className="text-[11px] text-slate-400 font-medium">{t('nav.attendance')}</p>
            <p className="text-lg font-bold text-emerald-600">{attendance?.summary.percentage ?? 95}%</p>
          </div>
          <div className="px-2">
            <p className="text-[11px] text-slate-400 font-medium">{t('students.examsTaken')}</p>
            <p className="text-lg font-bold text-indigo-600">{grades.length}</p>
          </div>
          <div className="px-2">
            <p className="text-[11px] text-slate-400 font-medium">{t('students.feesBalance')}</p>
            <p className="text-lg font-bold text-slate-900">$0.00</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('students.personalDetails')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-24">{t('teachers.email')}:</span>
                <span className="text-slate-900 font-medium">{student.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-24">{t('teachers.phone')}:</span>
                <span className="text-slate-900 font-medium">{student.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-24">{t('students.dateOfBirth')}:</span>
                <span className="text-slate-900 font-medium">{student.dateOfBirth || '2004-06-12'}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-24">{t('students.address')}:</span>
                <span className="text-slate-900 font-medium">{student.address || '742 Evergreen Terrace'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-24">{t('students.enrolledOn')}:</span>
                <span className="text-slate-900 font-medium">{student.enrollmentDate}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('students.guardianRecord')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-28">{t('students.guardianName')}:</span>
                <span className="text-slate-900 font-medium">{student.parentName || 'Robert Wright'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-28">{t('students.guardianPhone')}:</span>
                <span className="text-slate-900 font-medium">{student.parentPhone || '+1 (555) 911-2201'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-28">{t('students.guardianEmail')}:</span>
                <span className="text-slate-900 font-medium">{student.parentEmail || 'guardian@example.com'}</span>
              </div>
              {student.notes && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-slate-500 font-medium mb-1">{t('students.advisorNotes')}:</p>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                    {student.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'attendance' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('students.recordedAttendance')}</CardTitle>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                {t('common.present')}: {attendance?.summary.present || 0}
              </span>
              <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-semibold">
                {t('common.late')}: {attendance?.summary.late || 0}
              </span>
              <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-semibold">
                {t('common.absent')}: {attendance?.summary.absent || 0}
              </span>
            </div>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('common.date')}</TableHead>
                <TableHead>{t('schedule.cohort')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead>{t('students.remarksNote')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance?.records.map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell className="text-xs font-semibold text-slate-800">{rec.date}</TableCell>
                  <TableCell className="text-xs text-slate-600">{group?.name || rec.groupId}</TableCell>
                  <TableCell>
                    <StatusBadge status={rec.status} size="sm" />
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{rec.remarks || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {activeTab === 'grades' && (
        <Card>
          <CardHeader>
            <CardTitle>{t('students.transcriptScores')}</CardTitle>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('grades.examEvaluation')}</TableHead>
                <TableHead>{t('courses.title')}</TableHead>
                <TableHead>{t('grades.numericScore')}</TableHead>
                <TableHead>{t('grades.percentage')}</TableHead>
                <TableHead>{t('students.letterGrade')}</TableHead>
                <TableHead>{t('grades.facultyFeedback')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((grd) => (
                <TableRow key={grd.id}>
                  <TableCell className="text-xs font-semibold text-slate-900">{grd.examTitle}</TableCell>
                  <TableCell className="text-xs text-slate-600">{grd.courseTitle}</TableCell>
                  <TableCell className="text-xs font-semibold">{grd.score} / {grd.maxScore}</TableCell>
                  <TableCell className="text-xs text-indigo-600 font-bold">{grd.percentage}%</TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700">
                      {grd.letterGrade}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{grd.feedback || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {activeTab === 'homework' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {homeworks.map((hw) => (
            <Card key={hw.id} className="p-4">
              <div className="flex items-start justify-between">
                <h4 className="text-xs font-bold text-slate-900">{hw.title}</h4>
                <StatusBadge status={hw.status} size="sm" />
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{hw.description}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100">
                <span>{t('homework.due')}: {hw.dueDate}</span>
                <span>{t('homework.maxPoints')}: {hw.maxPoints} {t('homework.points')}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'payments' && (
        <Card>
          <CardHeader>
            <CardTitle>{t('students.invoiceRecords')}</CardTitle>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('payments.invoiceNumber')}</TableHead>
                <TableHead>{t('common.date')}</TableHead>
                <TableHead>{t('courses.category')}</TableHead>
                <TableHead>{t('payments.amount')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-xs font-mono font-semibold text-slate-800">{p.invoiceNumber}</TableCell>
                  <TableCell className="text-xs text-slate-500">{p.date}</TableCell>
                  <TableCell className="text-xs text-slate-600">{p.paymentType}</TableCell>
                  <TableCell className="text-xs font-bold text-slate-900">{formatCurrency(p.amount)}</TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} size="sm" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};
