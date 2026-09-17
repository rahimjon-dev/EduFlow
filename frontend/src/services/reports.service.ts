import { mockDashboardOverview, mockMonthlyMetrics, mockRecentActivities } from '../data/dashboard';
import type { ActivityItem, DashboardOverview, MonthlyMetric } from '../types';
import { apiClient, simulateLatency } from './api/apiClient';

class ReportsService {
  async getOverview(): Promise<DashboardOverview> {
    try {
      const [students, teachers, courses, payments] = await Promise.all([
        apiClient.get<any[]>('/students'),
        apiClient.get<any[]>('/teachers'),
        apiClient.get<any[]>('/courses'),
        apiClient.get<any[]>('/payments'),
      ]);

      const monthlyRevenue = Array.isArray(payments)
        ? payments.filter((p) => p.status === 'PAID').reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
        : mockDashboardOverview.monthlyRevenue;

      return {
        ...mockDashboardOverview,
        totalStudents: Array.isArray(students) ? students.length : mockDashboardOverview.totalStudents,
        totalTeachers: Array.isArray(teachers) ? teachers.length : mockDashboardOverview.totalTeachers,
        activeCourses: Array.isArray(courses) ? courses.length : mockDashboardOverview.activeCourses,
        monthlyRevenue: monthlyRevenue || mockDashboardOverview.monthlyRevenue,
      };
    } catch {
      // Fallback
    }

    await simulateLatency(150);
    return { ...mockDashboardOverview };
  }

  async getRecentActivities(): Promise<ActivityItem[]> {
    await simulateLatency(120);
    return [...mockRecentActivities];
  }

  async getMonthlyMetrics(): Promise<MonthlyMetric[]> {
    await simulateLatency(150);
    return [...mockMonthlyMetrics];
  }
}

export const reportsService = new ReportsService();
