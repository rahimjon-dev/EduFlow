import React, { useState, useEffect, useCallback } from 'react';
import { Save, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { LoadingState } from '../../components/ui/LoadingState';
import { attendanceService } from '../../services/attendance.service';
import { groupsService } from '../../services/groups.service';
import { coursesService } from '../../services/courses.service';
import type { AttendanceRecord, AttendanceStatus, AttendanceSummary, Group, Course } from '../../types';

export const AttendancePage: React.FC = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedDate, setSelectedDate] = useState('2024-03-04');

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary>({
    present: 0,
    absent: 0,
    late: 0,
    sick: 0,
    total: 0,
    percentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load initial courses and groups
  useEffect(() => {
    const init = async () => {
      try {
        const [cList, gList] = await Promise.all([
          coursesService.getAll(),
          groupsService.getAll(),
        ]);
        setCourses(cList);
        setGroups(gList);
        if (cList.length > 0) setSelectedCourseId(cList[0].id);
        if (gList.length > 0) setSelectedGroupId(gList[0].id);
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, []);

  const loadAttendance = useCallback(async () => {
    if (!selectedGroupId || !selectedDate) return;
    try {
      setLoading(true);
      setSaveSuccess(false);
      const recs = await attendanceService.getByGroupAndDate(selectedGroupId, selectedDate);
      setRecords(recs);
      const summ = await attendanceService.getSummary(recs);
      setSummary(summ);
    } finally {
      setLoading(false);
    }
  }, [selectedGroupId, selectedDate]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const handleStatusChange = async (recordId: string, newStatus: AttendanceStatus) => {
    const updated = records.map((r) => (r.id === recordId ? { ...r, status: newStatus } : r));
    setRecords(updated);
    const summ = await attendanceService.getSummary(updated);
    setSummary(summ);
  };

  const handleRemarksChange = (recordId: string, remarks: string) => {
    setRecords((prev) => prev.map((r) => (r.id === recordId ? { ...r, remarks } : r)));
  };

  const handleMarkAll = async (status: AttendanceStatus) => {
    const updated = records.map((r) => ({ ...r, status }));
    setRecords(updated);
    const summ = await attendanceService.getSummary(updated);
    setSummary(summ);
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      await attendanceService.saveBatch(records);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const filteredGroups = selectedCourseId
    ? groups.filter((g) => g.courseId === selectedCourseId)
    : groups;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('attendance.title')}
        description={t('attendance.desc')}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMarkAll('PRESENT')}
            >
              {t('attendance.markAllPresent')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Save className="w-4 h-4" />}
              isLoading={saving}
              onClick={handleSaveAll}
            >
              {saveSuccess ? t('attendance.savedSuccessfully') : t('attendance.saveAttendance')}
            </Button>
          </div>
        }
      />

      {/* Selectors Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label={t('attendance.selectCourse')}
          value={selectedCourseId}
          onChange={(e) => {
            setSelectedCourseId(e.target.value);
            const firstGroup = groups.find((g) => g.courseId === e.target.value);
            if (firstGroup) setSelectedGroupId(firstGroup.id);
          }}
          options={courses.map((c) => ({ value: c.id, label: c.title }))}
        />

        <Select
          label={t('attendance.selectGroup')}
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          options={filteredGroups.map((g) => ({ value: g.id, label: `${g.name} (${g.room})` }))}
        />

        <Input
          label={t('attendance.sessionDate')}
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Summary KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t('common.present')}</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-emerald-600">{summary.present}</span>
            <span className="text-xs text-slate-400">{t('common.students')}</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t('common.late')}</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-amber-600">{summary.late}</span>
            <span className="text-xs text-slate-400">{t('common.students')}</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t('common.absent')}</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-rose-600">{summary.absent}</span>
            <span className="text-xs text-slate-400">{t('common.students')}</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t('attendance.sickExcused')}</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-sky-600">{summary.sick}</span>
            <span className="text-xs text-slate-400">{t('common.students')}</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t('attendance.sessionRate')}</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-indigo-600">{summary.percentage}%</span>
            <span className="text-xs text-emerald-600 font-semibold">{t('attendance.sessionRateLabel')}</span>
          </div>
        </div>
      </div>

      {/* Attendance Sheet Table */}
      {loading ? (
        <LoadingState message={t('attendance.loadingCohort')} />
      ) : records.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
          {t('attendance.noStudentsInCohort')}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('students.studentName')}</TableHead>
              <TableHead>{t('attendance.attendanceStatus')}</TableHead>
              <TableHead>{t('attendance.remarks')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => {
              const status = record.status;
              return (
                <TableRow key={record.id}>
                  <TableCell>
                    <p className="text-xs font-semibold text-slate-900">{record.studentName || record.studentId}</p>
                    <p className="text-[11px] text-slate-500">ID: {record.studentId}</p>
                  </TableCell>
                  <TableCell>
                    <div className="inline-flex items-center rounded-lg border border-slate-200 p-1 bg-slate-50 gap-1">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(record.id, 'PRESENT')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                          status === 'PRESENT'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> {t('common.present')}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(record.id, 'LATE')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                          status === 'LATE'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" /> {t('common.late')}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(record.id, 'ABSENT')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                          status === 'ABSENT'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" /> {t('common.absent')}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(record.id, 'SICK')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                          status === 'SICK'
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
                        }`}
                      >
                        <AlertCircle className="w-3.5 h-3.5" /> {t('common.sick')}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <input
                      type="text"
                      placeholder={t('attendance.remarksPlaceholder')}
                      value={record.remarks || ''}
                      onChange={(e) => handleRemarksChange(record.id, e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-200 px-3 py-1.5 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
