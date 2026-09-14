import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  Check,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Shield,
  BookOpen,
  GraduationCap,
  HeartHandshake,
} from 'lucide-react';
import type { User, UserRole } from '../../types';
import { getInitials } from '../../utils/formatters';
import { useTranslation } from '../../i18n';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

interface NavbarProps {
  currentUser: User;
  onRoleChange: (newRole: UserRole) => void;
  onOpenMobileMenu: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onRoleChange,
  onOpenMobileMenu,
  onLogout,
}) => {
  const { t } = useTranslation();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const roleRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: { role: UserRole; label: string; desc: string; icon: React.ReactNode; path: string }[] = [
    { role: 'ADMIN', label: t('roles.admin'), desc: t('roles.adminDesc'), icon: <Shield className="w-4 h-4 text-indigo-600" />, path: '/admin/dashboard' },
    { role: 'TEACHER', label: t('roles.teacher'), desc: t('roles.teacherDesc'), icon: <BookOpen className="w-4 h-4 text-emerald-600" />, path: '/teacher/dashboard' },
    { role: 'STUDENT', label: t('roles.student'), desc: t('roles.studentDesc'), icon: <GraduationCap className="w-4 h-4 text-sky-600" />, path: '/student/dashboard' },
    { role: 'PARENT', label: t('roles.parent'), desc: t('roles.parentDesc'), icon: <HeartHandshake className="w-4 h-4 text-purple-600" />, path: '/parent/dashboard' },
  ];

  const handleSelectRole = (r: UserRole, path: string) => {
    onRoleChange(r);
    setRoleDropdownOpen(false);
    navigate(path);
  };

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Exam Scheduled', text: 'Midterm: React & State Architecture is on Mar 20', time: '10m ago' },
    { id: 2, title: 'Payment Confirmed', text: 'Sophia Martinez paid tuition invoice $1,200', time: '1h ago' },
    { id: 3, title: 'Attendance Notice', text: 'FSW-Cohort-24A attendance marked for today', time: '2h ago' },
  ]);

  const handleMarkAllRead = () => {
    setNotifications([]);
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left section: mobile hamburger & search input */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative hidden sm:block w-64 md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder={t('common.quickSearch')}
            className="w-full bg-slate-100/70 hover:bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>
      </div>

      {/* Right section: Language switcher, Role switcher, notifications, profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Multi-language Selector (UZ, RU, EN) */}
        <LanguageSwitcher variant="navbar" />

        {/* Role Switcher Menu */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="hidden md:inline text-slate-500">{t('roles.viewAs')}</span>
            <span className="text-indigo-700">{currentUser.role}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-soft-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t('roles.switchRole')}</p>
                <p className="text-xs text-slate-500">{t('roles.previewRole')}</p>
              </div>
              <div className="p-1">
                {roles.map((item) => (
                  <button
                    key={item.role}
                    onClick={() => handleSelectRole(item.role, item.path)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-md bg-slate-100">{item.icon}</div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{item.label}</p>
                        <p className="text-[11px] text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                    {currentUser.role === item.role && (
                      <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-soft-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Notifications</h4>
                {notifications.length > 0 && (
                  <span onClick={handleMarkAllRead} className="text-[11px] text-indigo-600 hover:underline cursor-pointer font-medium">Mark all read</span>
                )}
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
                    <Bell className="w-6 h-6 text-slate-300" />
                    <p>No new notifications</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors">
                      <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-tight">{n.text}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 mx-0.5" />

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center">
                {getInitials(currentUser.name)}
              </div>
            )}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-tight">{currentUser.name}</span>
              <span className="text-[11px] text-slate-500 leading-none">{currentUser.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-soft-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
              </div>
              <div className="p-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate('/admin/settings');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  {t('nav.settings')}
                </button>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onLogout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  {t('auth.signOut')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
