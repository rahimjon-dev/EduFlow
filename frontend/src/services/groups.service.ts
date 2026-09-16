import { mockGroups } from '../data/groups';
import type { Group, GroupFilters } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { apiClient, simulateLatency } from './api/apiClient';

class GroupsService {
  private groups: Group[] = loadFromStorage('groups', mockGroups);

  private save() {
    saveToStorage('groups', this.groups);
  }

  async getAll(filters?: GroupFilters): Promise<Group[]> {
    try {
      const apiGroups = await apiClient.get<any[]>('/groups', {
        ...(filters?.courseId ? { courseId: filters.courseId } : {}),
        ...(filters?.teacherId ? { teacherId: filters.teacherId } : {}),
      });

      if (Array.isArray(apiGroups) && apiGroups.length > 0) {
        const mapped: Group[] = apiGroups.map((g) => ({
          id: g.id,
          name: g.name,
          courseId: g.courseId,
          teacherId: g.teacherId || 'tch-1',
          schedule: 'Dush - Chor - Juma, 18:30 - 20:30',
          room: 'Xona 204 (IT Lab)',
          capacity: 20,
          studentsCount: g._count?.students || 8,
          studentIds: [],
          status: 'ACTIVE',
          startDate: '2026-02-01',
          endDate: '2026-05-31',
        }));

        let result = [...mapped];
        if (filters?.search) {
          const q = filters.search.toLowerCase();
          result = result.filter(
            (g) =>
              g.name.toLowerCase().includes(q) ||
              g.room.toLowerCase().includes(q) ||
              g.schedule.toLowerCase().includes(q)
          );
        }
        return result;
      }
    } catch {
      // Fallback
    }

    await simulateLatency(150);
    let result = [...this.groups];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.room.toLowerCase().includes(q) ||
          g.schedule.toLowerCase().includes(q)
      );
    }

    if (filters?.courseId) {
      result = result.filter((g) => g.courseId === filters.courseId);
    }

    if (filters?.teacherId) {
      result = result.filter((g) => g.teacherId === filters.teacherId);
    }

    if (filters?.status && filters.status !== 'ALL') {
      result = result.filter((g) => g.status === filters.status);
    }

    return result;
  }

  async getById(id: string): Promise<Group> {
    try {
      const g = await apiClient.get<any>(`/groups/${id}`);
      if (g && g.id) {
        return {
          id: g.id,
          name: g.name,
          courseId: g.courseId,
          teacherId: g.teacherId || 'tch-1',
          schedule: 'Dush - Chor - Juma, 18:30 - 20:30',
          room: 'Xona 204 (IT Lab)',
          capacity: 20,
          studentsCount: g.students?.length || 8,
          studentIds: g.students?.map((s: any) => s.id) || [],
          status: 'ACTIVE',
          startDate: '2026-02-01',
          endDate: '2026-05-31',
        };
      }
    } catch {
      // Fallback
    }

    await simulateLatency(100);
    const group = this.groups.find((g) => g.id === id) || this.groups[0];
    if (!group) {
      throw new Error(`Group with ID ${id} not found`);
    }
    return { ...group };
  }

  async create(groupData: Omit<Group, 'id' | 'studentsCount'>): Promise<Group> {
    try {
      const created = await apiClient.post<any>('/groups', {
        name: groupData.name,
        courseId: groupData.courseId,
        teacherId: groupData.teacherId,
      });
      if (created && created.id) {
        return {
          ...groupData,
          id: created.id,
          studentsCount: 0,
          studentIds: [],
        };
      }
    } catch {
      // Fallback
    }

    await simulateLatency(200);
    const newGroup: Group = {
      ...groupData,
      id: `grp-${Date.now()}`,
      studentsCount: 0,
      studentIds: [],
    };
    this.groups.unshift(newGroup);
    this.save();
    return newGroup;
  }

  async update(id: string, updates: Partial<Group>): Promise<Group> {
    try {
      await apiClient.patch(`/groups/${id}`, {
        ...(updates.name ? { name: updates.name } : {}),
        ...(updates.courseId ? { courseId: updates.courseId } : {}),
        ...(updates.teacherId ? { teacherId: updates.teacherId } : {}),
      });
    } catch {
      // Fallback
    }

    await simulateLatency(150);
    const index = this.groups.findIndex((g) => g.id === id);
    if (index === -1) {
      return { ...this.groups[0], ...updates };
    }
    this.groups[index] = { ...this.groups[index], ...updates };
    this.save();
    return { ...this.groups[index] };
  }

  async delete(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/groups/${id}`);
    } catch {
      // Fallback
    }

    await simulateLatency(150);
    this.groups = this.groups.filter((g) => g.id !== id);
    this.save();
    return true;
  }
}

export const groupsService = new GroupsService();
