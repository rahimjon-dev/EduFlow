export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'SICK';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  groupId: string;
  date: string; // ISO format YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
  recordedBy?: string;
  studentName?: string;
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  sick: number;
  total: number;
  percentage: number;
}

export interface AttendanceFilter {
  groupId: string;
  date: string;
  courseId?: string;
}
