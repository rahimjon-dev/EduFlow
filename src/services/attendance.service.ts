import { mockAttendanceRecords } from '../data/attendance';
import { mockStudents } from '../data/students';
import type { AttendanceRecord, AttendanceStatus, AttendanceSummary } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { simulateLatency } from './api/apiClient';

class AttendanceService {
  private records: AttendanceRecord[] = loadFromStorage('attendance', mockAttendanceRecords);

  private save() {
    saveToStorage('attendance', this.records);
  }

  async getByGroupAndDate(groupId: string, date: string): Promise<AttendanceRecord[]> {
    await simulateLatency(200);

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
    await simulateLatency(100);
    const idx = this.records.findIndex((r) => r.id === id);
    if (idx !== -1) {
      this.records[idx].status = status;
      if (remarks !== undefined) {
        this.records[idx].remarks = remarks;
      }
      return { ...this.records[idx] };
    }
    throw new Error('Attendance record not found');
  }

  async saveBatch(recordsToUpdate: AttendanceRecord[]): Promise<AttendanceRecord[]> {
    await simulateLatency(250);
    recordsToUpdate.forEach((updated) => {
      const idx = this.records.findIndex((r) => r.id === updated.id);
      if (idx !== -1) {
        this.records[idx] = { ...this.records[idx], ...updated };
      } else {
        this.records.push(updated);
    this.save();
      }
    });
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
    await simulateLatency(200);
    const studentRecords = this.records.filter((r) => r.studentId === studentId);
    const summary = await this.getSummary(studentRecords);
    return { records: studentRecords, summary };
  }
}

export const attendanceService = new AttendanceService();
