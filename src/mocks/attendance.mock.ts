import type { AttendanceRecord } from '../types';

export const mockAttendanceRecords: AttendanceRecord[] = [
  // grp-1 records
  { id: 'att-1', studentId: 'stu-1', groupId: 'grp-1', date: '2024-03-04', status: 'PRESENT', studentName: 'Alexander Wright' },
  { id: 'att-2', studentId: 'stu-2', groupId: 'grp-1', date: '2024-03-04', status: 'PRESENT', studentName: 'Sophia Martinez' },
  { id: 'att-3', studentId: 'stu-3', groupId: 'grp-1', date: '2024-03-04', status: 'LATE', remarks: 'Arrived 15 min late due to transit', studentName: 'Liam Johnson' },
  { id: 'att-4', studentId: 'stu-4', groupId: 'grp-1', date: '2024-03-04', status: 'PRESENT', studentName: 'Emma Davis' },
  { id: 'att-5', studentId: 'stu-5', groupId: 'grp-1', date: '2024-03-04', status: 'ABSENT', remarks: 'Unexcused absence', studentName: 'Lucas Kim' },
  { id: 'att-6', studentId: 'stu-6', groupId: 'grp-1', date: '2024-03-04', status: 'PRESENT', studentName: 'Olivia Wilson' },
  { id: 'att-7', studentId: 'stu-7', groupId: 'grp-1', date: '2024-03-04', status: 'SICK', remarks: 'Flu, doctor note provided', studentName: 'Noah Taylor' },

  // Previous session
  { id: 'att-8', studentId: 'stu-1', groupId: 'grp-1', date: '2024-02-28', status: 'PRESENT', studentName: 'Alexander Wright' },
  { id: 'att-9', studentId: 'stu-2', groupId: 'grp-1', date: '2024-02-28', status: 'PRESENT', studentName: 'Sophia Martinez' },
  { id: 'att-10', studentId: 'stu-3', groupId: 'grp-1', date: '2024-02-28', status: 'PRESENT', studentName: 'Liam Johnson' },
  { id: 'att-11', studentId: 'stu-4', groupId: 'grp-1', date: '2024-02-28', status: 'PRESENT', studentName: 'Emma Davis' },
  { id: 'att-12', studentId: 'stu-5', groupId: 'grp-1', date: '2024-02-28', status: 'PRESENT', studentName: 'Lucas Kim' },
  { id: 'att-13', studentId: 'stu-6', groupId: 'grp-1', date: '2024-02-28', status: 'LATE', studentName: 'Olivia Wilson' },
  { id: 'att-14', studentId: 'stu-7', groupId: 'grp-1', date: '2024-02-28', status: 'PRESENT', studentName: 'Noah Taylor' },

  // grp-2 records
  { id: 'att-15', studentId: 'stu-8', groupId: 'grp-2', date: '2024-03-05', status: 'PRESENT', studentName: 'Ava Anderson' },
  { id: 'att-16', studentId: 'stu-9', groupId: 'grp-2', date: '2024-03-05', status: 'PRESENT', studentName: 'Ethan Thomas' },
  { id: 'att-17', studentId: 'stu-10', groupId: 'grp-2', date: '2024-03-05', status: 'PRESENT', studentName: 'Isabella Jackson' },
  { id: 'att-18', studentId: 'stu-11', groupId: 'grp-2', date: '2024-03-05', status: 'LATE', studentName: 'Mason White' },

  // grp-3 records
  { id: 'att-19', studentId: 'stu-12', groupId: 'grp-3', date: '2024-03-04', status: 'PRESENT', studentName: 'Mia Harris' },
  { id: 'att-20', studentId: 'stu-13', groupId: 'grp-3', date: '2024-03-04', status: 'PRESENT', studentName: 'James Martin' },
  { id: 'att-21', studentId: 'stu-14', groupId: 'grp-3', date: '2024-03-04', status: 'SICK', studentName: 'Harper Thompson' },
];
