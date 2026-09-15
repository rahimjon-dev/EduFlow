import React, { useState, useEffect } from 'react';
import { CalendarCheck, Clock, XCircle, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { LoadingState } from '../../components/ui/LoadingState';
import { attendanceService } from '../../services/attendance.service';
import { useAuth } from '../../app/providers';
import type { AttendanceRecord, AttendanceSummary } from '../../types';

export const StudentAttendancePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // In a real app, use the actual student ID (for parent, they'd select which child, or use a default)
        // Here we mock with 'stu-1' for demonstration.
        const studentId = currentUser?.role === 'PARENT' ? 'stu-1' : (currentUser?.id || 'stu-1');
        const data = await attendanceService.getStudentAttendance(studentId);
        setRecords(data.records);
        setSummary(data.summary);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentUser]);

  if (loading) return <LoadingState message="Loading attendance records..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance History"
        description="View your detailed attendance records and overall compliance rate."
      />

      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            title="Present"
            value={summary.present.toString()}
            icon={<CalendarCheck className="w-5 h-5" />}
            iconColor="emerald"
          />
          <StatCard
            title="Late"
            value={summary.late.toString()}
            icon={<Clock className="w-5 h-5" />}
            iconColor="amber"
          />
          <StatCard
            title="Absent"
            value={summary.absent.toString()}
            icon={<XCircle className="w-5 h-5" />}
            iconColor="rose"
          />
          <StatCard
            title="Excused / Sick"
            value={summary.sick.toString()}
            icon={<AlertCircle className="w-5 h-5" />}
            iconColor="sky"
          />
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                  No attendance records found.
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium text-slate-900">{record.date}</TableCell>
                  <TableCell>
                    {record.status === 'PRESENT' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700">
                        <CalendarCheck className="w-3.5 h-3.5" /> Present
                      </span>
                    )}
                    {record.status === 'LATE' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700">
                        <Clock className="w-3.5 h-3.5" /> Late
                      </span>
                    )}
                    {record.status === 'ABSENT' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700">
                        <XCircle className="w-3.5 h-3.5" /> Absent
                      </span>
                    )}
                    {record.status === 'SICK' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-50 text-sky-700">
                        <AlertCircle className="w-3.5 h-3.5" /> Sick / Excused
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {record.remarks || '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
