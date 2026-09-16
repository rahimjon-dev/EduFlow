import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layout
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProtectedRoute } from './providers';

// Public Pages
import { LandingPage } from '../pages/landing/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ConnectionStatusPage } from '../pages/status/ConnectionStatusPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/DashboardPage';
import { StudentsPage } from '../pages/admin/StudentsPage';
import { StudentDetailsPage } from '../pages/admin/StudentDetailsPage';
import { TeachersPage } from '../pages/admin/TeachersPage';
import { CoursesPage } from '../pages/admin/CoursesPage';
import { GroupsPage } from '../pages/admin/GroupsPage';
import { AttendancePage } from '../pages/admin/AttendancePage';
import { SchedulePage } from '../pages/admin/SchedulePage';
import { PaymentsPage } from '../pages/admin/PaymentsPage';
import { ExamsPage } from '../pages/admin/ExamsPage';
import { GradesPage } from '../pages/admin/GradesPage';
import { HomeworkPage } from '../pages/admin/HomeworkPage';
import { ReportsPage } from '../pages/admin/ReportsPage';
import { SettingsPage } from '../pages/admin/SettingsPage';

// Teacher Pages
import { TeacherDashboardPage } from '../pages/teacher/TeacherDashboardPage';
import { TeacherGroupsPage } from '../pages/teacher/TeacherGroupsPage';

// Student Pages
import { StudentDashboardPage } from '../pages/student/StudentDashboardPage';

// Parent Pages
import { ParentDashboardPage } from '../pages/parent/ParentDashboardPage';
import { ParentChildrenPage } from '../pages/parent/ParentChildrenPage';

export const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/status',
    element: <ConnectionStatusPage />,
  },
  {
    path: '/connection-status',
    element: <ConnectionStatusPage />,
  },

  // Protected Admin Application Routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '', element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'students', element: <StudentsPage /> },
      { path: 'students/:id', element: <StudentDetailsPage /> },
      { path: 'teachers', element: <TeachersPage /> },
      { path: 'courses', element: <CoursesPage /> },
      { path: 'groups', element: <GroupsPage /> },
      { path: 'attendance', element: <AttendancePage /> },
      { path: 'schedule', element: <SchedulePage /> },
      { path: 'payments', element: <PaymentsPage /> },
      { path: 'exams', element: <ExamsPage /> },
      { path: 'grades', element: <GradesPage /> },
      { path: 'homework', element: <HomeworkPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },

  // Protected Teacher Application Routes
  {
    path: '/teacher',
    element: (
      <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '', element: <Navigate to="/teacher/dashboard" replace /> },
      { path: 'dashboard', element: <TeacherDashboardPage /> },
      { path: 'groups', element: <TeacherGroupsPage /> },
      { path: 'attendance', element: <AttendancePage /> },
      { path: 'schedule', element: <SchedulePage /> },
      { path: 'grades', element: <GradesPage /> },
      { path: 'homework', element: <HomeworkPage /> },
    ],
  },

  // Protected Student Application Routes
  {
    path: '/student',
    element: (
      <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '', element: <Navigate to="/student/dashboard" replace /> },
      { path: 'dashboard', element: <StudentDashboardPage /> },
      { path: 'schedule', element: <SchedulePage /> },
      { path: 'attendance', element: <AttendancePage /> },
      { path: 'grades', element: <GradesPage /> },
      { path: 'homework', element: <HomeworkPage /> },
      { path: 'payments', element: <PaymentsPage /> },
    ],
  },

  // Protected Parent Application Routes
  {
    path: '/parent',
    element: (
      <ProtectedRoute allowedRoles={['PARENT', 'ADMIN']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '', element: <Navigate to="/parent/dashboard" replace /> },
      { path: 'dashboard', element: <ParentDashboardPage /> },
      { path: 'children', element: <ParentChildrenPage /> },
      { path: 'attendance', element: <AttendancePage /> },
      { path: 'grades', element: <GradesPage /> },
      { path: 'payments', element: <PaymentsPage /> },
    ],
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
