export interface DashboardOverview {
  totalStudents: number;
  totalTeachers: number;
  activeCourses: number;
  activeGroups: number;
  monthlyRevenue: number;
  avgAttendanceRate: number;
  recentStudentsGrowth: number; // percentage e.g. +12.5%
}

export interface ActivityItem {
  id: string;
  type: 'STUDENT_ENROLLED' | 'PAYMENT_RECEIVED' | 'ATTENDANCE_MARKED' | 'EXAM_SCHEDULED' | 'GRADE_POSTED';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

export interface MonthlyMetric {
  month: string;
  students: number;
  revenue: number;
  attendance: number;
}
