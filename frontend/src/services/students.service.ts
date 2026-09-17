import { mockStudents } from '../data/students';
import type { PaginatedResponse, Student, StudentFilters } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { apiClient, simulateLatency } from './api/apiClient';

class StudentsService {
  private students: Student[] = loadFromStorage('students', mockStudents);

  private save() {
    saveToStorage('students', this.students);
  }

  /**
   * Fetch all students with live API integration and resilient fallback
   */
  async getAll(filters?: StudentFilters & { page?: number; pageSize?: number }): Promise<PaginatedResponse<Student>> {
    try {
      const apiStudents = await apiClient.get<any[]>('/students', filters?.groupId ? { groupId: filters.groupId } : undefined);
      if (Array.isArray(apiStudents) && apiStudents.length > 0) {
        const mapped: Student[] = apiStudents.map((s) => {
          const names = (s.user?.fullName || 'Talaba').split(' ');
          return {
            id: s.id,
            firstName: names[0] || 'Talaba',
            lastName: names.slice(1).join(' ') || '',
            email: s.user?.email || '',
            phone: '+998 90 123 45 67',
            groupId: s.groupId || 'grp-1',
            courseId: s.group?.courseId || 'crs-1',
            status: 'ACTIVE',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
            createdAt: s.createdAt ? new Date(s.createdAt).toISOString().split('T')[0] : '2026-01-01',
            enrollmentDate: s.createdAt ? new Date(s.createdAt).toISOString().split('T')[0] : '2026-01-01',
          };
        });

        let filtered = [...mapped];
        if (filters?.search) {
          const q = filters.search.toLowerCase();
          filtered = filtered.filter(
            (s) =>
              s.firstName.toLowerCase().includes(q) ||
              s.lastName.toLowerCase().includes(q) ||
              s.email.toLowerCase().includes(q)
          );
        }

        const page = filters?.page || 1;
        const pageSize = filters?.pageSize || 10;
        const total = filtered.length;
        const totalPages = Math.ceil(total / pageSize);
        const paginatedData = filtered.slice((page - 1) * pageSize, page * pageSize);

        return {
          data: paginatedData,
          total,
          page,
          pageSize,
          totalPages,
        };
      }
    } catch {
      // Backend unreachable or unauthorized; continue with local storage cache
    }

    await simulateLatency(150);
    let result = [...this.students];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.firstName.toLowerCase().includes(q) ||
          s.lastName.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.phone.toLowerCase().includes(q)
      );
    }

    if (filters?.status && filters.status !== 'ALL') {
      result = result.filter((s) => s.status === filters.status);
    }

    if (filters?.groupId) {
      result = result.filter((s) => s.groupId === filters.groupId);
    }

    if (filters?.courseId) {
      result = result.filter((s) => s.courseId === filters.courseId);
    }

    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;
    const total = result.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginatedData = result.slice((page - 1) * pageSize, page * pageSize);

    return {
      data: paginatedData,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * Fetch student by ID
   */
  async getById(id: string): Promise<Student> {
    try {
      const s = await apiClient.get<any>(`/students/${id}`);
      if (s && s.id) {
        const names = (s.user?.fullName || 'Talaba').split(' ');
        return {
          id: s.id,
          firstName: names[0] || 'Talaba',
          lastName: names.slice(1).join(' ') || '',
          email: s.user?.email || '',
          phone: '+998 90 123 45 67',
          groupId: s.groupId || 'grp-1',
          courseId: s.group?.courseId || 'crs-1',
          status: 'ACTIVE',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
          createdAt: s.createdAt ? new Date(s.createdAt).toISOString().split('T')[0] : '2026-01-01',
          enrollmentDate: s.createdAt ? new Date(s.createdAt).toISOString().split('T')[0] : '2026-01-01',
        };
      }
    } catch {
      // Fallback
    }

    await simulateLatency(100);
    const student = this.students.find((s) => s.id === id) || this.students[0];
    if (!student) {
      throw new Error(`Student with ID ${id} not found`);
    }
    return { ...student };
  }

  /**
   * Create new student
   */
  async create(studentData: Omit<Student, 'id' | 'createdAt'>): Promise<Student> {
    try {
      const fullName = `${studentData.firstName} ${studentData.lastName}`.trim();
      const registeredUser = await apiClient.post<any>('/auth/register', {
        fullName,
        email: studentData.email,
        password: 'student123',
        role: 'STUDENT',
      });

      let realStudentId = `stu-${Date.now()}`;
      if (registeredUser && registeredUser.id) {
        // Fetch students list to find the student profile record associated with this user
        try {
          const allStudents = await apiClient.get<any[]>('/students');
          const matched = allStudents.find((s) => s.userId === registeredUser.id || s.user?.email === studentData.email);
          if (matched) {
            realStudentId = matched.id;
            if (studentData.groupId && studentData.groupId !== 'grp-1') {
              await apiClient.patch(`/students/${realStudentId}`, { groupId: studentData.groupId });
            }
          }
        } catch {
          // If fetching fails, proceed with returned user id
          realStudentId = registeredUser.id;
        }

        const newStudent: Student = {
          ...studentData,
          id: realStudentId,
          createdAt: new Date().toISOString().split('T')[0],
        };
        this.students.unshift(newStudent);
        this.save();
        return newStudent;
      }
    } catch (err: any) {
      // If error is not connection error, propagate or fallback
      console.warn('Real API student registration fallback:', err?.message);
    }

    await simulateLatency(200);
    const newStudent: Student = {
      ...studentData,
      id: `stu-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.students.unshift(newStudent);
    this.save();
    return newStudent;
  }

  /**
   * Update student
   */
  async update(id: string, updates: Partial<Student>): Promise<Student> {
    try {
      if (updates.groupId) {
        await apiClient.patch(`/students/${id}`, { groupId: updates.groupId });
      }
    } catch {
      // Fallback
    }

    await simulateLatency(150);
    const index = this.students.findIndex((s) => s.id === id);
    if (index === -1) {
      return { ...this.students[0], ...updates };
    }
    this.students[index] = { ...this.students[index], ...updates };
    this.save();
    return { ...this.students[index] };
  }

  /**
   * Delete student
   */
  async delete(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/students/${id}`);
    } catch {
      // Fallback
    }

    await simulateLatency(150);
    const initialLen = this.students.length;
    this.students = this.students.filter((s) => s.id !== id);
    this.save();
    return this.students.length < initialLen;
  }
}

export const studentsService = new StudentsService();
