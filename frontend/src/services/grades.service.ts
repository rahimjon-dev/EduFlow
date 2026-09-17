import { mockGrades } from '../data/academic';
import type { Grade } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { apiClient, simulateLatency } from './api/apiClient';

class GradesService {
  private grades: Grade[] = loadFromStorage('grades', mockGrades);

  private save() {
    saveToStorage('grades', this.grades);
  }

  private calculateGrade(score: number, maxScore: number = 100) {
    const percentage = Math.round((score / maxScore) * 100);
    let letterGrade: Grade['letterGrade'] = 'F';
    if (percentage >= 95) letterGrade = 'A+';
    else if (percentage >= 85) letterGrade = 'A';
    else if (percentage >= 80) letterGrade = 'B+';
    else if (percentage >= 70) letterGrade = 'B';
    else if (percentage >= 60) letterGrade = 'C';
    else if (percentage >= 50) letterGrade = 'D';
    return { percentage, letterGrade };
  }

  async getAll(studentId?: string, courseId?: string): Promise<Grade[]> {
    try {
      const apiGrades = await apiClient.get<any[]>('/grades', {
        ...(studentId ? { studentId } : {}),
        ...(courseId ? { courseId } : {}),
      });

      if (Array.isArray(apiGrades) && apiGrades.length > 0) {
        const mapped: Grade[] = apiGrades.map((g) => {
          const { percentage, letterGrade } = this.calculateGrade(g.score, 100);
          return {
            id: g.id,
            studentId: g.studentId,
            studentName: g.student?.user?.fullName || 'Talaba',
            courseId: g.courseId || 'crs-1',
            courseTitle: g.course?.name || 'Kurs',
            examId: `ex-${g.id.slice(0, 4)}`,
            examTitle: g.subject || 'Oraliq Imtihon',
            score: g.score,
            maxScore: 100,
            percentage,
            letterGrade,
            date: g.createdAt ? new Date(g.createdAt).toISOString().split('T')[0] : '2026-02-15',
            feedback: "Muvaffaqiyatli topshirildi",
          };
        });

        // Merge with local list
        mapped.forEach((m) => {
          const idx = this.grades.findIndex((x) => x.id === m.id);
          if (idx !== -1) {
            this.grades[idx] = m;
          } else {
            this.grades.push(m);
          }
        });
        this.save();
        return mapped;
      }
    } catch {
      // Fallback
    }

    await simulateLatency(150);
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
    try {
      const created = await apiClient.post<any>('/grades', {
        studentId: data.studentId,
        score: Math.min(100, Math.max(0, data.score)),
        subject: data.examTitle || 'Imtihon',
        courseId: data.courseId || undefined,
      });

      if (created && created.id) {
        const { percentage, letterGrade } = this.calculateGrade(created.score || data.score, data.maxScore || 100);
        const gradeObj: Grade = {
          ...data,
          id: created.id,
          studentName: created.student?.user?.fullName || data.studentName,
          percentage,
          letterGrade,
        };
        this.grades.unshift(gradeObj);
        this.save();
        return gradeObj;
      }
    } catch {
      // Fallback
    }

    await simulateLatency(150);
    const { percentage, letterGrade } = this.calculateGrade(data.score, data.maxScore);
    const newGrade: Grade = {
      ...data,
      id: `grd-${Date.now()}`,
      percentage,
      letterGrade,
    };
    this.grades.unshift(newGrade);
    this.save();
    return newGrade;
  }

  async update(id: string, updates: Partial<Grade>): Promise<Grade> {
    try {
      await apiClient.patch(`/grades/${id}`, {
        ...(updates.score !== undefined ? { score: updates.score } : {}),
        ...(updates.examTitle ? { subject: updates.examTitle } : {}),
        ...(updates.courseId ? { courseId: updates.courseId } : {}),
      });
    } catch {
      // Fallback
    }

    await simulateLatency(100);
    const idx = this.grades.findIndex((g) => g.id === id);
    if (idx === -1) throw new Error('Grade not found');
    const updated = { ...this.grades[idx], ...updates };
    if (updates.score !== undefined) {
      const { percentage, letterGrade } = this.calculateGrade(updated.score, updated.maxScore);
      updated.percentage = percentage;
      updated.letterGrade = letterGrade;
    }
    this.grades[idx] = updated;
    this.save();
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/grades/${id}`);
    } catch {
      // Fallback
    }

    await simulateLatency(100);
    this.grades = this.grades.filter((g) => g.id !== id);
    this.save();
    return true;
  }
}

export const gradesService = new GradesService();
