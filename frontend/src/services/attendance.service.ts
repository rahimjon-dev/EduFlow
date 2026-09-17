import { mockAttendanceRecords } from '../data/attendance';
import { mockStudents } from '../data/students';
import type { AttendanceRecord, AttendanceStatus, AttendanceSummary } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { apiClient, simulateLatency } from './api/apiClient';

class AttendanceService {
  private records: AttendanceRecord[] = loadFromStorage('attendance', mockAttendanceRecords);

  private save() {
    saveToStorage('attendance', this.records);
  }

  async getByGroupAndDate(groupId: string, date: string): Promise<AttendanceRecord[]> {
    try {
      const apiRecords = await apiClient.get<any[]>('/attendance', { groupId, date });
      if (Array.isArray(apiRecords) && apiRecords.length > 0) {
        const mapped: AttendanceRecord[] = apiRecords.map((r) => ({
          id: r.id,
          studentId: r.studentId,
          studentName: r.student?.user?.fullName || 'Talaba',
          groupId: r.student?.groupId || groupId,
          date: r.date ? new Date(r.date).toISOString().split('T')[0] : date,
          status: (r.status as AttendanceStatus) || 'PRESENT',
        }));

        // Merge with local cache
        mapped.forEach((m) => {
          const idx = this.records.findIndex((r) => r.id === m.id);
          if (idx !== -1) {
            this.records[idx] = m;
          } else {
            this.records.push(m);
          }
        });
        this.save();
        return mapped;
      }
    } catch {
      // Backend error or offline, fallback to local cache
    }

    await simulateLatency(150);

    const existing = this.records.filter((r) => r.groupId === groupId && r.date === date);

    if (existing.length > 0) {
      return existing;
    }

    // If no existing record for this group and date, initialize with group's students as PRESENT
    const groupStudents = mockStudents.filter((s) => s.groupId === groupId);
    const initialRecords: AttendanceRecord[] = groupStudents.map((s) => ({
      id: `att-${Date.now()}-${s.id}`,
      studentId: s.id,
      studentName: `${s.firstName} ${s.lastName}`,
      groupId,
      date,
      status: 'PRESENT',
    }));

    this.records.push(...initialRecords);
    this.save();
    return initialRecords;
  }

  async updateRecord(id: string, status: AttendanceStatus, remarks?: string): Promise<AttendanceRecord> {
    try {
      const updated = await apiClient.patch<any>(`/attendance/${id}`, {
        status: status === 'SICK' ? 'ABSENT' : status,
      });
      if (updated && updated.id) {
        const mapped: AttendanceRecord = {
          id: updated.id,
          studentId: updated.studentId,
          studentName: updated.student?.user?.fullName || 'Talaba',
          groupId: updated.student?.groupId || 'grp-1',
          date: updated.date ? new Date(updated.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          status: (updated.status as AttendanceStatus) || status,
          remarks,
        };
        const idx = this.records.findIndex((r) => r.id === id);
        if (idx !== -1) {
          this.records[idx] = mapped;
        } else {
          this.records.push(mapped);
        }
        this.save();
        return mapped;
      }
    } catch {
      // Fallback
    }

    await simulateLatency(100);
    const idx = this.records.findIndex((r) => r.id === id);
    if (idx !== -1) {
      this.records[idx].status = status;
      if (remarks !== undefined) {
        this.records[idx].remarks = remarks;
      }
      this.save();
      return { ...this.records[idx] };
    }
    throw new Error('Attendance record not found');
  }

  async saveBatch(recordsToUpdate: AttendanceRecord[]): Promise<AttendanceRecord[]> {
    for (const item of recordsToUpdate) {
      try {
        if (item.id.startsWith('att-')) {
          await apiClient.post('/attendance', {
            studentId: item.studentId,
            date: item.date,
            status: item.status === 'SICK' ? 'ABSENT' : item.status,
          });
        } else {
          await apiClient.patch(`/attendance/${item.id}`, {
            status: item.status === 'SICK' ? 'ABSENT' : item.status,
            date: item.date,
          });
        }
      } catch {
        // Fallback for individual item
      }
    }

    await simulateLatency(150);
    recordsToUpdate.forEach((updated) => {
      const idx = this.records.findIndex((r) => r.id === updated.id);
      if (idx !== -1) {
        this.records[idx] = { ...this.records[idx], ...updated };
      } else {
        this.records.push(updated);
      }
    });
    this.save();
    return recordsToUpdate;
  }

  async getSummary(records: AttendanceRecord[]): Promise<AttendanceSummary> {
    const present = records.filter((r) => r.status === 'PRESENT').length;
    const absent = records.filter((r) => r.status === 'ABSENT').length;
    const late = records.filter((r) => r.status === 'LATE').length;
    const sick = records.filter((r) => r.status === 'SICK').length;
    const total = records.length;
    const percentage = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 0;

    return {
      present,
      absent,
      late,
      sick,
      total,
      percentage,
    };
  }

  async getStudentAttendance(studentId: string): Promise<{ records: AttendanceRecord[]; summary: AttendanceSummary }> {
    try {
      const [apiRecords, stats] = await Promise.all([
        apiClient.get<any[]>('/attendance', { studentId }),
        apiClient.get<any>(`/attendance/stats/${studentId}`),
      ]);

      if (Array.isArray(apiRecords)) {
        const records: AttendanceRecord[] = apiRecords.map((r) => ({
          id: r.id,
          studentId: r.studentId,
          studentName: r.student?.user?.fullName || 'Talaba',
          groupId: r.student?.groupId || 'grp-1',
          date: r.date ? new Date(r.date).toISOString().split('T')[0] : '2026-02-15',
          status: (r.status as AttendanceStatus) || 'PRESENT',
        }));

        const summary: AttendanceSummary = {
          present: stats?.present ?? records.filter((r) => r.status === 'PRESENT').length,
          absent: stats?.absent ?? records.filter((r) => r.status === 'ABSENT').length,
          late: stats?.late ?? records.filter((r) => r.status === 'LATE').length,
          sick: records.filter((r) => r.status === 'SICK').length,
          total: stats?.total ?? records.length,
          percentage: stats?.percentage ?? (records.length > 0 ? Math.round(((stats?.present || 0) / (stats?.total || 1)) * 100) : 100),
        };

        return { records, summary };
      }
    } catch {
      // Fallback
    }

    await simulateLatency(150);
    const studentRecords = this.records.filter((r) => r.studentId === studentId);
    const summary = await this.getSummary(studentRecords);
    return { records: studentRecords, summary };
  }
}

export const attendanceService = new AttendanceService();
