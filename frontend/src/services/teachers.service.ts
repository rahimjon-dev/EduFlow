import { mockTeachers } from '../data/teachers';
import type { Teacher, TeacherFilters } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { apiClient, simulateLatency } from './api/apiClient';

class TeachersService {
  private teachers: Teacher[] = loadFromStorage('teachers', mockTeachers);

  private save() {
    saveToStorage('teachers', this.teachers);
  }

  async getAll(filters?: TeacherFilters): Promise<Teacher[]> {
    try {
      const apiTeachers = await apiClient.get<any[]>('/teachers');
      if (Array.isArray(apiTeachers) && apiTeachers.length > 0) {
        const mapped: Teacher[] = apiTeachers.map((t) => {
          const names = (t.fullName || "O'qituvchi").split(' ');
          return {
            id: t.id,
            firstName: names[0] || "O'qituvchi",
            lastName: names.slice(1).join(' ') || '',
            email: t.email,
            phone: '+998 90 987 65 43',
            specialization: t.taughtGroups?.[0]?.course?.name || 'Full-Stack Dasturlash',
            courses: t.taughtGroups?.map((g: any) => g.courseId) || ['crs-1'],
            groups: t.taughtGroups?.map((g: any) => g.id) || ['grp-1'],
            status: 'ACTIVE',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            joinDate: t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : '2025-09-01',
          };
        });

        let result = [...mapped];
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
        return result;
      }
    } catch {
      // Fallback to storage
    }

    await simulateLatency(150);
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
    try {
      const t = await apiClient.get<any>(`/teachers/${id}`);
      if (t && t.id) {
        const names = (t.fullName || "O'qituvchi").split(' ');
        return {
          id: t.id,
          firstName: names[0] || "O'qituvchi",
          lastName: names.slice(1).join(' ') || '',
          email: t.email,
          phone: '+998 90 987 65 43',
          specialization: t.taughtGroups?.[0]?.course?.name || 'Full-Stack Dasturlash',
          courses: t.taughtGroups?.map((g: any) => g.courseId) || ['crs-1'],
          groups: t.taughtGroups?.map((g: any) => g.id) || ['grp-1'],
          status: 'ACTIVE',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          joinDate: t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : '2025-09-01',
        };
      }
    } catch {
      // Fallback
    }

    await simulateLatency(100);
    const teacher = this.teachers.find((t) => t.id === id) || this.teachers[0];
    if (!teacher) {
      throw new Error(`Teacher with ID ${id} not found`);
    }
    return { ...teacher };
  }

  async create(teacherData: Omit<Teacher, 'id'>): Promise<Teacher> {
    try {
      const created = await apiClient.post<any>('/teachers', {
        fullName: `${teacherData.firstName} ${teacherData.lastName}`,
        email: teacherData.email,
        password: 'teacher123',
      });
      if (created && created.id) {
        return {
          ...teacherData,
          id: created.id,
        };
      }
    } catch {
      // Fallback
    }

    await simulateLatency(200);
    const newTeacher: Teacher = {
      ...teacherData,
      id: `tch-${Date.now()}`,
    };
    this.teachers.unshift(newTeacher);
    this.save();
    return newTeacher;
  }

  async update(id: string, updates: Partial<Teacher>): Promise<Teacher> {
    try {
      await apiClient.patch(`/teachers/${id}`, {
        ...(updates.firstName || updates.lastName ? { fullName: `${updates.firstName || ''} ${updates.lastName || ''}`.trim() } : {}),
        ...(updates.email ? { email: updates.email } : {}),
      });
    } catch {
      // Fallback
    }

    await simulateLatency(150);
    const index = this.teachers.findIndex((t) => t.id === id);
    if (index === -1) {
      return { ...this.teachers[0], ...updates };
    }
    this.teachers[index] = { ...this.teachers[index], ...updates };
    this.save();
    return { ...this.teachers[index] };
  }

  async delete(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/teachers/${id}`);
    } catch {
      // Fallback
    }

    await simulateLatency(150);
    this.teachers = this.teachers.filter((t) => t.id !== id);
    this.save();
    return true;
  }
}

export const teachersService = new TeachersService();
