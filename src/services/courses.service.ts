import { mockCourses } from '../mocks/courses.mock';
import type { Course, CourseFilters } from '../types';
import { simulateLatency } from './api/apiClient';

class CoursesService {
  private courses: Course[] = [...mockCourses];

  async getAll(filters?: CourseFilters): Promise<Course[]> {
    await simulateLatency(200);

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
    await simulateLatency(150);
    const course = this.courses.find((c) => c.id === id);
    if (!course) {
      throw new Error(`Course with ID ${id} not found`);
    }
    return { ...course };
  }

  async create(courseData: Omit<Course, 'id' | 'createdAt'>): Promise<Course> {
    await simulateLatency(250);
    const newCourse: Course = {
      ...courseData,
      id: `crs-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      enrolledStudentsCount: 0,
    };
    this.courses.unshift(newCourse);
    return newCourse;
  }

  async update(id: string, updates: Partial<Course>): Promise<Course> {
    await simulateLatency(200);
    const index = this.courses.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Course with ID ${id} not found`);
    }
    this.courses[index] = { ...this.courses[index], ...updates };
    return { ...this.courses[index] };
  }

  async delete(id: string): Promise<boolean> {
    await simulateLatency(200);
    this.courses = this.courses.filter((c) => c.id !== id);
    return true;
  }
}

export const coursesService = new CoursesService();
