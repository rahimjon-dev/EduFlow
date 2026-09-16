import { mockCourses } from '../data/courses';
import type { Course, CourseFilters } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { apiClient, simulateLatency } from './api/apiClient';

class CoursesService {
  private courses: Course[] = loadFromStorage('courses', mockCourses);

  private save() {
    saveToStorage('courses', this.courses);
  }

  async getAll(filters?: CourseFilters): Promise<Course[]> {
    try {
      const apiCourses = await apiClient.get<any[]>('/courses');
      if (Array.isArray(apiCourses) && apiCourses.length > 0) {
        const mapped: Course[] = apiCourses.map((c) => ({
          id: c.id,
          title: c.name || c.title || 'Kurs',
          description: c.description || 'Zamonaviy amaliy dasturlash va texnologiyalar kursi',
          duration: '12 Hafta',
          price: Number(c.price) || 1200000,
          teacherId: c.groups?.[0]?.teacherId || 'tch-1',
          status: 'ACTIVE',
          category: 'Development',
          enrolledStudentsCount: c.groups?.reduce((acc: number, g: any) => acc + (g._count?.students || 0), 0) || 10,
          createdAt: c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : '2026-01-01',
        }));

        let result = [...mapped];
        if (filters?.search) {
          const q = filters.search.toLowerCase();
          result = result.filter(
            (c) =>
              c.title.toLowerCase().includes(q) ||
              c.description.toLowerCase().includes(q) ||
              c.category.toLowerCase().includes(q)
          );
        }
        return result;
      }
    } catch {
      // Fallback
    }

    await simulateLatency(150);
    let result = [...this.courses];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    if (filters?.status && filters.status !== 'ALL') {
      result = result.filter((c) => c.status === filters.status);
    }

    if (filters?.category) {
      result = result.filter((c) => c.category === filters.category);
    }

    if (filters?.teacherId) {
      result = result.filter((c) => c.teacherId === filters.teacherId);
    }

    return result;
  }

  async getById(id: string): Promise<Course> {
    try {
      const c = await apiClient.get<any>(`/courses/${id}`);
      if (c && c.id) {
        return {
          id: c.id,
          title: c.name || c.title || 'Kurs',
          description: c.description || 'Zamonaviy amaliy dasturlash va texnologiyalar kursi',
          duration: '12 Hafta',
          price: Number(c.price) || 1200000,
          teacherId: c.groups?.[0]?.teacherId || 'tch-1',
          status: 'ACTIVE',
          category: 'Development',
          enrolledStudentsCount: 15,
          createdAt: c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : '2026-01-01',
        };
      }
    } catch {
      // Fallback
    }

    await simulateLatency(100);
    const course = this.courses.find((c) => c.id === id) || this.courses[0];
    if (!course) {
      throw new Error(`Course with ID ${id} not found`);
    }
    return { ...course };
  }

  async create(courseData: Omit<Course, 'id' | 'createdAt'>): Promise<Course> {
    try {
      const created = await apiClient.post<any>('/courses', {
        name: courseData.title,
        price: courseData.price,
      });
      if (created && created.id) {
        return {
          ...courseData,
          id: created.id,
          createdAt: new Date().toISOString().split('T')[0],
          enrolledStudentsCount: 0,
        };
      }
    } catch {
      // Fallback
    }

    await simulateLatency(200);
    const newCourse: Course = {
      ...courseData,
      id: `crs-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      enrolledStudentsCount: 0,
    };
    this.courses.unshift(newCourse);
    this.save();
    return newCourse;
  }

  async update(id: string, updates: Partial<Course>): Promise<Course> {
    try {
      await apiClient.patch(`/courses/${id}`, {
        ...(updates.title ? { name: updates.title } : {}),
        ...(updates.price !== undefined ? { price: updates.price } : {}),
      });
    } catch {
      // Fallback
    }

    await simulateLatency(150);
    const index = this.courses.findIndex((c) => c.id === id);
    if (index === -1) {
      return { ...this.courses[0], ...updates };
    }
    this.courses[index] = { ...this.courses[index], ...updates };
    this.save();
    return { ...this.courses[index] };
  }

  async delete(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/courses/${id}`);
    } catch {
      // Fallback
    }

    await simulateLatency(150);
    this.courses = this.courses.filter((c) => c.id !== id);
    this.save();
    return true;
  }
}

export const coursesService = new CoursesService();
