import { mockDashboardOverview, mockMonthlyMetrics, mockRecentActivities } from '../mocks/dashboard.mock';
import type { ActivityItem, DashboardOverview, MonthlyMetric } from '../types';
import { simulateLatency } from './api/apiClient';

class ReportsService {
  async getOverview(): Promise<DashboardOverview> {
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
