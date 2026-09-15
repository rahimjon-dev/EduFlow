export type StudentStatus = 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'SUSPENDED';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  groupId: string;
  courseId: string;
  status: StudentStatus;
  avatar?: string;
  createdAt: string;
  // Extended profile fields
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  enrollmentDate: string;
  notes?: string;
}

export interface StudentFilters {
  search?: string;
  groupId?: string;
  courseId?: string;
  status?: StudentStatus | 'ALL';
}
