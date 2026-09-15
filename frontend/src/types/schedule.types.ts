export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface ClassSession {
  id: string;
  courseId: string;
  courseTitle: string;
  groupId: string;
  groupName: string;
  teacherId: string;
  teacherName: string;
  room: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "09:00"
  endTime: string;   // "10:30"
  colorTag?: string; // tailwind color token e.g. "indigo", "emerald", "amber"
  type?: 'LECTURE' | 'LAB' | 'WORKSHOP' | 'EXAM';
}

export interface ScheduleFilters {
  teacherId?: string;
  groupId?: string;
  dayOfWeek?: DayOfWeek | 'ALL';
}
