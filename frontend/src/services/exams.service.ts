import { mockExams } from '../data/academic';
import type { Exam } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { apiClient, simulateLatency } from './api/apiClient';

class ExamsService {
  private exams: Exam[] = loadFromStorage('exams', mockExams);

  private save() {
    saveToStorage('exams', this.exams);
  }

  async getAll(courseId?: string, groupId?: string): Promise<Exam[]> {
    try {
      const apiGroups = await apiClient.get<any[]>('/groups');
      if (Array.isArray(apiGroups) && apiGroups.length > 0) {
        // If we have live groups, ensure at least one exam per group exists in the list
        apiGroups.forEach((g, idx) => {
          const exists = this.exams.some((e) => e.groupId === g.id);
          if (!exists) {
            this.exams.push({
              id: `ex-${g.id.slice(0, 4)}-${idx}`,
              title: `${g.name} - Oraliq Imtihon`,
              courseId: g.courseId,
              courseTitle: g.course?.name || 'Dasturlash Kursi',
              groupId: g.id,
              groupName: g.name,
              date: new Date(Date.now() + (idx + 1) * 7 * 86400000).toISOString().split('T')[0],
              time: '14:00 - 16:00',
              durationMinutes: 120,
              totalMarks: 100,
              passingMarks: 60,
              room: 'Xona 204 (IT Lab)',
              status: 'UPCOMING',
            });
          }
        });
        this.save();
      }
    } catch {
      // Fallback
    }

    await simulateLatency(150);
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
    this.save();
    return newExam;
  }

  async update(id: string, updates: Partial<Exam>): Promise<Exam> {
    await simulateLatency(200);
    const idx = this.exams.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Exam not found');
    this.exams[idx] = { ...this.exams[idx], ...updates };
    this.save();
    return { ...this.exams[idx] };
  }

  async delete(id: string): Promise<boolean> {
    await simulateLatency(200);
    this.exams = this.exams.filter((e) => e.id !== id);
    this.save();
    return true;
  }
}

export const examsService = new ExamsService();
