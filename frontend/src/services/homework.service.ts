import { mockHomeworks } from '../data/academic';
import type { Homework } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { simulateLatency } from './api/apiClient';

class HomeworkService {
  private homeworks: Homework[] = loadFromStorage('homework', mockHomeworks);

  private save() {
    saveToStorage('homework', this.homeworks);
  }

  async getAll(groupId?: string, courseId?: string): Promise<Homework[]> {
    await simulateLatency(180);
    let result = [...this.homeworks];
    if (groupId) {
      result = result.filter((h) => h.groupId === groupId);
    }
    if (courseId) {
      result = result.filter((h) => h.courseId === courseId);
    }
    return result;
  }

  async getById(id: string): Promise<Homework> {
    await simulateLatency(150);
    const hw = this.homeworks.find((h) => h.id === id);
    if (!hw) throw new Error('Homework not found');
    return { ...hw };
  }

  async create(data: Omit<Homework, 'id' | 'submissionsCount'>): Promise<Homework> {
    await simulateLatency(250);
    const newHw: Homework = {
      ...data,
      id: `hw-${Date.now()}`,
      submissionsCount: 0,
    };
    this.homeworks.unshift(newHw);
    this.save();
    return newHw;
  }

  async update(id: string, updates: Partial<Homework>): Promise<Homework> {
    await simulateLatency(200);
    const idx = this.homeworks.findIndex((h) => h.id === id);
    if (idx === -1) throw new Error('Homework not found');
    this.homeworks[idx] = { ...this.homeworks[idx], ...updates };
    return { ...this.homeworks[idx] };
  }

  async delete(id: string): Promise<boolean> {
    await simulateLatency(200);
    this.homeworks = this.homeworks.filter((h) => h.id !== id);
    return true;
  }
}

export const homeworkService = new HomeworkService();
