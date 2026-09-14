import { mockGroups } from '../mocks/groups.mock';
import type { Group, GroupFilters } from '../types';
import { simulateLatency } from './api/apiClient';

class GroupsService {
  private groups: Group[] = [...mockGroups];

  async getAll(filters?: GroupFilters): Promise<Group[]> {
    await simulateLatency(200);

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
    await simulateLatency(150);
    const group = this.groups.find((g) => g.id === id);
    if (!group) {
      throw new Error(`Group with ID ${id} not found`);
    }
    return { ...group };
  }

  async create(groupData: Omit<Group, 'id' | 'studentsCount'>): Promise<Group> {
    await simulateLatency(250);
    const newGroup: Group = {
      ...groupData,
      id: `grp-${Date.now()}`,
      studentsCount: 0,
      studentIds: [],
    };
    this.groups.unshift(newGroup);
    return newGroup;
  }

  async update(id: string, updates: Partial<Group>): Promise<Group> {
    await simulateLatency(200);
    const index = this.groups.findIndex((g) => g.id === id);
    if (index === -1) {
      throw new Error(`Group with ID ${id} not found`);
    }
    this.groups[index] = { ...this.groups[index], ...updates };
    return { ...this.groups[index] };
  }

  async delete(id: string): Promise<boolean> {
    await simulateLatency(200);
    this.groups = this.groups.filter((g) => g.id !== id);
    return true;
  }
}

export const groupsService = new GroupsService();
