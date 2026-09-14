import { mockStudents } from '../data/students';
import type { PaginatedResponse, Student, StudentFilters } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { simulateLatency } from './api/apiClient';

class StudentsService {
  private students: Student[] = loadFromStorage('students', mockStudents);

  private save() {
    saveToStorage('students', this.students);
  }

  /**
   * Fetch all students with optional filtering and pagination
   * Ready for replacement: return apiClient.get<PaginatedResponse<Student>>('/students', filters);
   */
  async getAll(filters?: StudentFilters & { page?: number; pageSize?: number }): Promise<PaginatedResponse<Student>> {
    await simulateLatency(200);

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
    await simulateLatency(150);
    const student = this.students.find((s) => s.id === id);
    if (!student) {
      throw new Error(`Student with ID ${id} not found`);
    }
    return { ...student };
  }

  /**
   * Create new student
   */
  async create(studentData: Omit<Student, 'id' | 'createdAt'>): Promise<Student> {
    await simulateLatency(250);
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
    await simulateLatency(200);
    const index = this.students.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Student with ID ${id} not found`);
    }
    this.students[index] = { ...this.students[index], ...updates };
    this.save();
    return { ...this.students[index] };
  }

  /**
   * Delete student
   */
  async delete(id: string): Promise<boolean> {
    await simulateLatency(200);
    const initialLen = this.students.length;
    this.students = this.students.filter((s) => s.id !== id);
    return this.students.length < initialLen;
  }
}

export const studentsService = new StudentsService();
