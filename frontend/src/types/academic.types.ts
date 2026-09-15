export type ExamStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type HomeworkStatus = 'ACTIVE' | 'SUBMITTED' | 'GRADED' | 'OVERDUE';
export type SubmissionStatus = 'PENDING' | 'GRADED' | 'RESUBMIT';

export interface Exam {
  id: string;
  title: string;
  courseId: string;
  courseTitle: string;
  groupId: string;
  groupName: string;
  date: string;
  time: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  room: string;
  status: ExamStatus;
}

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  examId: string;
  examTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  date: string;
  feedback?: string;
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseTitle: string;
  groupId: string;
  groupName: string;
  teacherId: string;
  teacherName: string;
  dueDate: string;
  maxPoints: number;
  status: HomeworkStatus;
  submissionsCount?: number;
  totalStudents?: number;
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  status: SubmissionStatus;
  score?: number;
  maxScore: number;
  feedback?: string;
  submissionText?: string;
}
