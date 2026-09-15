export type CourseStatus = 'ACTIVE' | 'UPCOMING' | 'ARCHIVED';

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g., "12 Weeks", "6 Months"
  price: number;
  teacherId: string;
  status: CourseStatus;
  category: string;
  maxStudents?: number;
  enrolledStudentsCount?: number;
  thumbnail?: string;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  tags?: string[];
  createdAt: string;
}

export interface CourseFilters {
  search?: string;
  category?: string;
  status?: CourseStatus | 'ALL';
  teacherId?: string;
}
