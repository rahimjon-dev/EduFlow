import { mockScheduleSessions } from '../data/schedule';
import type { ClassSession, DayOfWeek, ScheduleFilters } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { simulateLatency } from './api/apiClient';

class ScheduleService {
  private sessions: ClassSession[] = loadFromStorage('schedule', mockScheduleSessions);

  private save() {
    saveToStorage('schedule', this.sessions);
  }

  async getAll(filters?: ScheduleFilters): Promise<ClassSession[]> {
    await simulateLatency(180);
    let result = [...this.sessions];

    if (filters?.dayOfWeek && filters.dayOfWeek !== 'ALL') {
      result = result.filter((s) => s.dayOfWeek === filters.dayOfWeek);
    }

    if (filters?.teacherId) {
      result = result.filter((s) => s.teacherId === filters.teacherId);
    }

    if (filters?.groupId) {
      result = result.filter((s) => s.groupId === filters.groupId);
    }

    return result;
  }

  async getByDay(day: DayOfWeek): Promise<ClassSession[]> {
    return this.getAll({ dayOfWeek: day });
  }

  async create(sessionData: Omit<ClassSession, 'id'>): Promise<ClassSession> {
    await simulateLatency(200);
    const newSession: ClassSession = {
      ...sessionData,
      id: `sch-${Date.now()}`,
    };
    this.sessions.push(newSession);
    this.save();
    return newSession;
  }
}

export const scheduleService = new ScheduleService();
