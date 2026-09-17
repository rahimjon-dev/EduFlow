import { mockHomeworks } from '../data/academic';
import type { Homework } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { apiClient, simulateLatency } from './api/apiClient';

class HomeworkService {
  private homeworks: Homework[] = loadFromStorage('homework', mockHomeworks);

  private save() {
    saveToStorage('homework', this.homeworks);
  }

  async getAll(groupId?: string, courseId?: string): Promise<Homework[]> {
    try {
      const apiHomeworks = await apiClient.get<any[]>('/homework', {
        ...(groupId ? { groupId } : {}),
      });

      if (Array.isArray(apiHomeworks) && apiHomeworks.length > 0) {
        const mapped: Homework[] = apiHomeworks.map((hw) => ({
          id: hw.id,
          title: hw.title,
          description: hw.description || 'Vazifani o‘z vaqtida topshiring',
          courseId: hw.group?.courseId || courseId || 'crs-1',
          courseTitle: hw.group?.course?.name || 'Dasturlash Kursi',
          groupId: hw.groupId,
          groupName: hw.group?.name || 'Guruh',
          teacherId: hw.group?.teacherId || 'tch-1',
          teacherName: hw.group?.teacher?.fullName || "O'qituvchi",
          dueDate: hw.dueDate ? new Date(hw.dueDate).toISOString().split('T')[0] : '2026-03-01',
          maxPoints: 100,
          status: 'ACTIVE',
          submissionsCount: 5,
          totalStudents: 15,
        }));

        // Merge with local list
        mapped.forEach((m) => {
          const idx = this.homeworks.findIndex((x) => x.id === m.id);
          if (idx !== -1) {
            this.homeworks[idx] = m;
          } else {
            this.homeworks.push(m);
          }
        });
        this.save();

        let result = [...mapped];
        if (courseId) {
          result = result.filter((h) => h.courseId === courseId);
        }
        return result;
      }
    } catch {
      // Fallback
    }

    await simulateLatency(150);
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
    try {
      const hw = await apiClient.get<any>(`/homework/${id}`);
      if (hw && hw.id) {
        return {
          id: hw.id,
          title: hw.title,
          description: hw.description || 'Vazifani o‘z vaqtida topshiring',
          courseId: hw.group?.courseId || 'crs-1',
          courseTitle: hw.group?.course?.name || 'Dasturlash Kursi',
          groupId: hw.groupId,
          groupName: hw.group?.name || 'Guruh',
          teacherId: hw.group?.teacherId || 'tch-1',
          teacherName: hw.group?.teacher?.fullName || "O'qituvchi",
          dueDate: hw.dueDate ? new Date(hw.dueDate).toISOString().split('T')[0] : '2026-03-01',
          maxPoints: 100,
          status: 'ACTIVE',
          submissionsCount: 5,
          totalStudents: 15,
        };
      }
    } catch {
      // Fallback
    }

    await simulateLatency(100);
    const hw = this.homeworks.find((h) => h.id === id);
    if (!hw) throw new Error('Homework not found');
    return { ...hw };
  }

  async create(data: Omit<Homework, 'id' | 'submissionsCount'>): Promise<Homework> {
    try {
      const created = await apiClient.post<any>('/homework', {
        title: data.title,
        description: data.description || '',
        groupId: data.groupId,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : new Date(Date.now() + 7 * 86400000).toISOString(),
      });

      if (created && created.id) {
        const newHw: Homework = {
          ...data,
          id: created.id,
          submissionsCount: 0,
        };
        this.homeworks.unshift(newHw);
        this.save();
        return newHw;
      }
    } catch {
      // Fallback
    }

    await simulateLatency(200);
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
    try {
      await apiClient.patch(`/homework/${id}`, {
        ...(updates.title ? { title: updates.title } : {}),
        ...(updates.description !== undefined ? { description: updates.description } : {}),
        ...(updates.dueDate ? { dueDate: new Date(updates.dueDate).toISOString() } : {}),
      });
    } catch {
      // Fallback
    }

    await simulateLatency(150);
    const idx = this.homeworks.findIndex((h) => h.id === id);
    if (idx === -1) throw new Error('Homework not found');
    this.homeworks[idx] = { ...this.homeworks[idx], ...updates };
    this.save();
    return { ...this.homeworks[idx] };
  }

  async delete(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/homework/${id}`);
    } catch {
      // Fallback
    }

    await simulateLatency(150);
    this.homeworks = this.homeworks.filter((h) => h.id !== id);
    this.save();
    return true;
  }
}

export const homeworkService = new HomeworkService();
