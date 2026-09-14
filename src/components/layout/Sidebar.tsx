import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  Layers,
  CalendarCheck,
  Calendar,
  CreditCard,
  FileCheck2,
  Award,
  BookMarked,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import type { UserRole } from '../../types';
import { useTranslation } from '../../i18n';

interface SidebarProps {
  role: UserRole;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  collapsed,
  onToggleCollapse,
  onCloseMobile,
}) => {
  const location = useLocation();
  const { t } = useTranslation();

  const getNavSections = (): NavSection[] => {
    switch (role) {
      case 'TEACHER':
        return [
          {
            items: [
              { label: t('nav.dashboard'), href: '/teacher/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
            ],
          },
          {
            title: t('nav.teaching'),
            items: [
              { label: t('nav.myGroups'), href: '/teacher/groups', icon: <Layers className="w-5 h-5" /> },
              { label: t('nav.attendance'), href: '/teacher/attendance', icon: <CalendarCheck className="w-5 h-5" /> },
              { label: t('nav.schedule'), href: '/teacher/schedule', icon: <Calendar className="w-5 h-5" /> },
              { label: t('nav.grades'), href: '/teacher/grades', icon: <Award className="w-5 h-5" /> },
              { label: t('nav.homework'), href: '/teacher/homework', icon: <BookMarked className="w-5 h-5" /> },
            ],
          },
        ];

      case 'STUDENT':
        return [
          {
            items: [
              { label: t('nav.dashboard'), href: '/student/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
            ],
          },
          {
            title: t('nav.academics'),
            items: [
              { label: t('nav.mySchedule'), href: '/student/schedule', icon: <Calendar className="w-5 h-5" /> },
              { label: t('nav.attendance'), href: '/student/attendance', icon: <CalendarCheck className="w-5 h-5" /> },
              { label: t('nav.gradesAndExams'), href: '/student/grades', icon: <Award className="w-5 h-5" /> },
              { label: t('nav.homework'), href: '/student/homework', icon: <BookMarked className="w-5 h-5" /> },
              { label: t('nav.tuitionAndFees'), href: '/student/payments', icon: <CreditCard className="w-5 h-5" /> },
            ],
          },
        ];

      case 'PARENT':
        return [
          {
            items: [
              { label: t('nav.dashboard'), href: '/parent/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
            ],
          },
          {
            title: t('nav.familyPortal'),
            items: [
              { label: t('nav.childrenOverview'), href: '/parent/children', icon: <Users className="w-5 h-5" /> },
              { label: t('nav.attendanceRecords'), href: '/parent/attendance', icon: <CalendarCheck className="w-5 h-5" /> },
              { label: t('nav.reportCards'), href: '/parent/grades', icon: <Award className="w-5 h-5" /> },
              { label: t('nav.tuitionPayments'), href: '/parent/payments', icon: <CreditCard className="w-5 h-5" /> },
            ],
          },
        ];

      case 'ADMIN':
      default:
        return [
          {
            items: [
              { label: t('nav.dashboard'), href: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
            ],
          },
          {
            title: t('nav.management'),
            items: [
              { label: t('nav.students'), href: '/admin/students', icon: <Users className="w-5 h-5" /> },
              { label: t('nav.teachers'), href: '/admin/teachers', icon: <UserCheck className="w-5 h-5" /> },
              { label: t('nav.courses'), href: '/admin/courses', icon: <BookOpen className="w-5 h-5" /> },
              { label: t('nav.groups'), href: '/admin/groups', icon: <Layers className="w-5 h-5" /> },
            ],
          },
          {
            title: t('nav.academic'),
            items: [
              { label: t('nav.attendance'), href: '/admin/attendance', icon: <CalendarCheck className="w-5 h-5" /> },
              { label: t('nav.schedule'), href: '/admin/schedule', icon: <Calendar className="w-5 h-5" /> },
              { label: t('nav.exams'), href: '/admin/exams', icon: <FileCheck2 className="w-5 h-5" /> },
              { label: t('nav.grades'), href: '/admin/grades', icon: <Award className="w-5 h-5" /> },
              { label: t('nav.homework'), href: '/admin/homework', icon: <BookMarked className="w-5 h-5" /> },
            ],
          },
          {
            title: t('nav.finance'),
            items: [
              { label: t('nav.payments'), href: '/admin/payments', icon: <CreditCard className="w-5 h-5" /> },
            ],
          },
          {
            title: t('nav.analytics'),
            items: [
              { label: t('nav.reports'), href: '/admin/reports', icon: <BarChart3 className="w-5 h-5" /> },
            ],
          },
          {
            title: t('nav.system'),
            items: [
              { label: t('nav.settings'), href: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
            ],
          },
        ];
    }
  };

  const sections = getNavSections();

  return (
    <aside
      className={cn(
        'relative flex flex-col bg-white border-r border-slate-200 transition-all duration-300 select-none z-30 h-full',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
        <NavLink to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-indigo-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">EduFlow</span>
              <span className="text-[11px] font-medium text-indigo-600 uppercase tracking-widest mt-1">{t('common.platform')}</span>
            </div>
          )}
        </NavLink>

        {/* Collapse button for desktop */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {section.title && !collapsed && (
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== '/admin/dashboard' &&
                  item.href !== '/teacher/dashboard' &&
                  item.href !== '/student/dashboard' &&
                  item.href !== '/parent/dashboard' &&
                  location.pathname.startsWith(item.href));

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={onCloseMobile}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={cn('shrink-0 transition-colors', isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600')}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="truncate">{item.label}</span>}

                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-r-full" />
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer / Current Role indication */}
      <div className="p-3 border-t border-slate-100">
        <div
          className={cn(
            'flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-200/60',
            collapsed ? 'justify-center' : ''
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
            {role[0]}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate">Role: {role}</p>
              <p className="text-[11px] text-slate-500 truncate">SaaS Workspace</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
