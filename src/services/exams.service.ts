import { mockExams } from '../mocks/academic.mock';
import type { Exam } from '../types';
import { simulateLatency } from './api/apiClient';

class ExamsService {
  private exams: Exam[] = [...mockExams];

  async getAll(courseId?: string, groupId?: string): Promise<Exam[]> {
    await simulateLatency(180);
    let result = [...this.exams];
    if (courseId) {
      result = result.filter((e) => e.courseId === courseId);
    }
    if (groupId) {
      result = result.filter((e) => e.groupId === groupId);
    }
    return result;
  }

  async getById(id: string): Promise<Exam> {
    await simulateLatency(150);
    const exam = this.exams.find((e) => e.id === id);
    if (!exam) throw new Error('Exam not found');
    return { ...exam };
  }

  async create(data: Omit<Exam, 'id'>): Promise<Exam> {
    await simulateLatency(250);
    const newExam: Exam = { ...data, id: `ex-${Date.now()}` };
    this.exams.unshift(newExam);
    return newExam;
  }

  async update(id: string, updates: Partial<Exam>): Promise<Exam> {
    await simulateLatency(200);
    const idx = this.exams.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Exam not found');
    this.exams[idx] = { ...this.exams[idx], ...updates };
    return { ...this.exams[idx] };
  }

  async delete(id: string): Promise<boolean> {
    await simulateLatency(200);
    this.exams = this.exams.filter((e) => e.id !== id);
    return true;
  }
}

export const examsService = new ExamsService();
