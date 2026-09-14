export type TeacherStatus = 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  courses: string[]; // course IDs
  groups: string[];  // group IDs
  status: TeacherStatus;
  avatar?: string;
  bio?: string;
  joinDate: string;
  qualification?: string;
  experienceYears?: number;
}

export interface TeacherFilters {
  search?: string;
  specialization?: string;
  status?: TeacherStatus | 'ALL';
}
