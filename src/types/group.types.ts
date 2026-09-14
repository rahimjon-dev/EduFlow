export type GroupStatus = 'ACTIVE' | 'UPCOMING' | 'COMPLETED';

export interface Group {
  id: string;
  name: string;
  courseId: string;
  teacherId: string;
  studentsCount: number;
  schedule: string; // e.g., "Mon, Wed 10:00 - 11:30 AM"
  room: string;
  status: GroupStatus;
  startDate: string;
  endDate: string;
  studentIds?: string[];
  capacity: number;
}

export interface GroupFilters {
  search?: string;
  courseId?: string;
  teacherId?: string;
  status?: GroupStatus | 'ALL';
}
