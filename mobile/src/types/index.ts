export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
}

export interface Student {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  course: string;
  group: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PAYMENT_PENDING';
  attendanceRate: number;
  balance: number;
  avatar?: string;
}

export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subjects: string[];
  groupsCount: number;
  rating: number;
  avatar?: string;
}

export interface Group {
  id: string;
  name: string;
  courseName: string;
  teacherName: string;
  studentsCount: number;
  schedule: string;
  room: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: AttendanceStatus;
  groupName: string;
  time?: string;
}

export interface GradeItem {
  id: string;
  subject: string;
  topic: string;
  score: number;
  maxScore: number;
  date: string;
  teacherName: string;
  feedback?: string;
}

export interface HomeworkItem {
  id: string;
  title: string;
  subject: string;
  groupName: string;
  deadline: string;
  description: string;
  submissionsCount?: number;
  totalStudents?: number;
  status?: 'PENDING' | 'SUBMITTED' | 'GRADED';
  score?: number;
}

export interface PaymentRecord {
  id: string;
  studentName: string;
  amount: number;
  date: string;
  type: 'TUITION' | 'EXAM' | 'OTHER';
  status: 'PAID' | 'PENDING' | 'OVERDUE';
}

export interface DashboardStats {
  totalStudents: number;
  activeTeachers: number;
  activeGroups: number;
  monthlyRevenue: number;
  attendanceToday: number;
}
