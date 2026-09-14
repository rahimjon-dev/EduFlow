import { mockGrades } from '../mocks/academic.mock';
import type { Grade } from '../types';
import { simulateLatency } from './api/apiClient';

class GradesService {
  private grades: Grade[] = [...mockGrades];

  async getAll(studentId?: string, courseId?: string): Promise<Grade[]> {
    await simulateLatency(180);
    let result = [...this.grades];
    if (studentId) {
      result = result.filter((g) => g.studentId === studentId);
    }
    if (courseId) {
      result = result.filter((g) => g.courseId === courseId);
    }
    return result;
  }

  async recordGrade(data: Omit<Grade, 'id' | 'percentage' | 'letterGrade'>): Promise<Grade> {
    await simulateLatency(200);
    const percentage = Math.round((data.score / data.maxScore) * 100);
    let letterGrade: Grade['letterGrade'] = 'F';
    if (percentage >= 95) letterGrade = 'A+';
    else if (percentage >= 85) letterGrade = 'A';
    else if (percentage >= 80) letterGrade = 'B+';
    else if (percentage >= 70) letterGrade = 'B';
    else if (percentage >= 60) letterGrade = 'C';
    else if (percentage >= 50) letterGrade = 'D';

    const newGrade: Grade = {
      ...data,
      id: `grd-${Date.now()}`,
      percentage,
      letterGrade,
    };
    this.grades.unshift(newGrade);
    return newGrade;
  }
}

export const gradesService = new GradesService();
