import { mockTeachers } from '../mocks/teachers.mock';
import type { Teacher, TeacherFilters } from '../types';
import { simulateLatency } from './api/apiClient';

class TeachersService {
  private teachers: Teacher[] = [...mockTeachers];

  async getAll(filters?: TeacherFilters): Promise<Teacher[]> {
    await simulateLatency(200);

    let result = [...this.teachers];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.firstName.toLowerCase().includes(q) ||
          t.lastName.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q) ||
          t.specialization.toLowerCase().includes(q)
      );
    }

    if (filters?.status && filters.status !== 'ALL') {
      result = result.filter((t) => t.status === filters.status);
    }

    if (filters?.specialization) {
      result = result.filter((t) => t.specialization.toLowerCase().includes(filters.specialization!.toLowerCase()));
    }

    return result;
  }

  async getById(id: string): Promise<Teacher> {
    await simulateLatency(150);
    const teacher = this.teachers.find((t) => t.id === id);
    if (!teacher) {
      throw new Error(`Teacher with ID ${id} not found`);
    }
    return { ...teacher };
  }

  async create(teacherData: Omit<Teacher, 'id'>): Promise<Teacher> {
    await simulateLatency(250);
    const newTeacher: Teacher = {
      ...teacherData,
      id: `tch-${Date.now()}`,
    };
    this.teachers.unshift(newTeacher);
    return newTeacher;
  }

  async update(id: string, updates: Partial<Teacher>): Promise<Teacher> {
    await simulateLatency(200);
    const index = this.teachers.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Teacher with ID ${id} not found`);
    }
    this.teachers[index] = { ...this.teachers[index], ...updates };
    return { ...this.teachers[index] };
  }

  async delete(id: string): Promise<boolean> {
    await simulateLatency(200);
    this.teachers = this.teachers.filter((t) => t.id !== id);
    return true;
  }
}

export const teachersService = new TeachersService();
