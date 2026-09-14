import type { ActivityItem, DashboardOverview, MonthlyMetric } from '../types';

export const mockDashboardOverview: DashboardOverview = {
  totalStudents: 148,
  totalTeachers: 14,
  activeCourses: 8,
  activeGroups: 12,
  monthlyRevenue: 28450,
  avgAttendanceRate: 94.2,
  recentStudentsGrowth: 12.8,
};

export const mockRecentActivities: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'STUDENT_ENROLLED',
    title: 'New Student Enrollment',
    description: 'Sophia Martinez registered for Modern Full-Stack Web Development',
    timestamp: '15 minutes ago',
    user: 'Registrar Staff',
  },
  {
    id: 'act-2',
    type: 'PAYMENT_RECEIVED',
    title: 'Tuition Payment Confirmed',
    description: '$1,200 payment received from Sophia Martinez (INV-2024-002)',
    timestamp: '1 hour ago',
    user: 'Finance System',
  },
  {
    id: 'act-3',
    type: 'ATTENDANCE_MARKED',
    title: 'Attendance Sheet Submitted',
    description: 'Eleanor Vance submitted attendance for FSW-Cohort-24A (14 students)',
    timestamp: '2 hours ago',
    user: 'Eleanor Vance',
  },
  {
    id: 'act-4',
    type: 'GRADE_POSTED',
    title: 'Grades Published',
    description: 'Dr. Sarah Jenkins published grades for Quiz 1: Discrete Math',
    timestamp: '4 hours ago',
    user: 'Dr. Sarah Jenkins',
  },
  {
    id: 'act-5',
    type: 'EXAM_SCHEDULED',
    title: 'New Exam Scheduled',
    description: 'Midterm: React & State Architecture set for March 20 in Lab Alpha',
    timestamp: 'Yesterday',
    user: 'Academic Office',
  },
];

export const mockMonthlyMetrics: MonthlyMetric[] = [
  { month: 'Oct', students: 95, revenue: 18200, attendance: 91.5 },
  { month: 'Nov', students: 108, revenue: 21500, attendance: 92.4 },
  { month: 'Dec', students: 114, revenue: 22800, attendance: 90.2 },
  { month: 'Jan', students: 126, revenue: 24900, attendance: 93.8 },
  { month: 'Feb', students: 139, revenue: 26800, attendance: 94.0 },
  { month: 'Mar', students: 148, revenue: 28450, attendance: 94.2 },
];
