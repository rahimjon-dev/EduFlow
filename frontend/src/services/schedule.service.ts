import { mockScheduleSessions } from '../data/schedule';
import type { ClassSession, DayOfWeek, ScheduleFilters } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { apiClient, simulateLatency } from './api/apiClient';

class ScheduleService {
  private sessions: ClassSession[] = loadFromStorage('schedule', mockScheduleSessions);

  private save() {
    saveToStorage('schedule', this.sessions);
  }

  async getAll(filters?: ScheduleFilters): Promise<ClassSession[]> {
    try {
      const apiGroups = await apiClient.get<any[]>('/groups');
      if (Array.isArray(apiGroups) && apiGroups.length > 0) {
        const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        apiGroups.forEach((g, idx) => {
          const exists = this.sessions.some((s) => s.groupId === g.id);
          if (!exists) {
            const day = days[idx % days.length];
            this.sessions.push({
              id: `sch-${g.id.slice(0, 4)}-${idx}`,
              courseId: g.courseId,
              courseTitle: g.course?.name || 'Dasturlash',
              groupId: g.id,
              groupName: g.name,
              teacherId: g.teacherId || 'tch-1',
              teacherName: g.teacher?.fullName || "O'qituvchi",
              room: 'Xona 204 (IT Lab)',
              dayOfWeek: day,
              startTime: '18:30',
              endTime: '20:30',
              colorTag: idx % 3 === 0 ? 'indigo' : (idx % 3 === 1 ? 'emerald' : 'amber'),
              type: 'LECTURE',
            });
          }
        });
        this.save();
      }
    } catch {
      // Fallback
    }

    await simulateLatency(150);
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
