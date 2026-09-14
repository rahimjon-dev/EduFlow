import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Users,
  CalendarCheck,
  Clock,
  CreditCard,
  Award,
  BarChart3,
  Shield,
  BookOpen,
  HeartHandshake,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useTranslation } from '../../i18n';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const features = [
    {
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      title: 'Student & Teacher Management',
      desc: 'Centralized profiles, cohort assignments, attendance records, and academic progress tracking in one unified directory.',
    },
    {
      icon: <CalendarCheck className="w-6 h-6 text-emerald-600" />,
      title: 'Real-Time Attendance Tracking',
      desc: 'Single-click attendance logging with statuses for Present, Late, Absent, and Sick plus automatic monthly percentage summaries.',
    },
    {
      icon: <Clock className="w-6 h-6 text-sky-600" />,
      title: 'Smart Timetable Scheduling',
      desc: 'Interactive daily and weekly calendar views preventing classroom double-booking and simplifying faculty schedules.',
    },
    {
      icon: <CreditCard className="w-6 h-6 text-amber-600" />,
      title: 'Tuition & Payment Management',
      desc: 'Automated invoice generation, payment status tracking (Paid, Pending, Overdue), and transparent parent receipts.',
    },
    {
      icon: <Award className="w-6 h-6 text-purple-600" />,
      title: 'Examinations, Grades & Homework',
      desc: 'Comprehensive gradebooks, automated GPA/letter grades, exam schedules, and online homework submission workflows.',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-rose-600" />,
      title: 'Actionable Reporting & Analytics',
      desc: 'In-depth institution analytics on student enrollment velocity, attendance trends, course popularity, and revenue health.',
    },
  ];

  const roles = [
    {
      role: 'ADMIN',
      title: 'Administrators',
      icon: <Shield className="w-6 h-6 text-indigo-600" />,
      desc: 'Total oversight of courses, batches, staff allocations, tuition billing, and institutional analytics.',
      highlights: ['Full CRUD data control', 'Revenue & fee analytics', 'Course curriculum design'],
    },
    {
      role: 'TEACHER',
      title: 'Teachers & Faculty',
      icon: <BookOpen className="w-6 h-6 text-emerald-600" />,
      desc: 'Streamlined daily workflow for checking attendance, grading tests, publishing homework, and monitoring timetables.',
      highlights: ['Interactive roll-call', 'Assignment grader', 'Direct schedule views'],
    },
    {
      role: 'STUDENT',
      title: 'Students',
      icon: <GraduationCap className="w-6 h-6 text-sky-600" />,
      desc: 'Personal academic hub with class schedules, assignment deadlines, exam grades, and attendance tracking.',
      highlights: ['Timetable at a glance', 'Homework submissions', 'Report cards'],
    },
    {
      role: 'PARENT',
      title: 'Parents & Guardians',
      icon: <HeartHandshake className="w-6 h-6 text-purple-600" />,
      desc: 'Stay informed with real-time insight into your children’s attendance records, grades, and tuition invoices.',
      highlights: ['Multi-child overview', 'Instant attendance alerts', 'Online fee payments'],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">EduFlow</span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="navbar" />
            <Link to="/login">
              <Button variant="ghost" size="sm">
                {t('auth.signInHere')}
              </Button>
            </Link>
            <Link to="/admin/dashboard">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                {t('landing.getStarted')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-xs font-semibold text-indigo-700 mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Generation Education SaaS Architecture
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
            {t('landing.heroTitle')}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            {t('landing.heroSubtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/admin/dashboard">
              <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-4 h-4" />}>
                {t('landing.exploreAdmin')}
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                {t('landing.signInRole')}
              </Button>
            </Link>
          </div>

          {/* Interactive UI Mock Preview */}
          <div className="relative mx-auto max-w-4xl rounded-2xl border border-slate-200/90 bg-white p-2 shadow-soft-lg">
            <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-900/5 p-4 text-left">
              {/* Fake window top bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-xs font-medium text-slate-500">EduFlow — Administrative Console</span>
                </div>
                <div className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Active Session: Director Eleanor Vance
                </div>
              </div>

              {/* Sample Metrics inside mock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <p className="text-[11px] font-medium text-slate-500">Total Enrolled</p>
                  <p className="text-xl font-bold text-slate-900">148 Students</p>
                  <span className="text-[10px] text-emerald-600 font-semibold">+12.8% this term</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <p className="text-[11px] font-medium text-slate-500">Active Teachers</p>
                  <p className="text-xl font-bold text-slate-900">14 Faculty</p>
                  <span className="text-[10px] text-slate-400">10 Active cohorts</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <p className="text-[11px] font-medium text-slate-500">Avg Attendance</p>
                  <p className="text-xl font-bold text-emerald-600">94.2%</p>
                  <span className="text-[10px] text-emerald-600 font-semibold">High compliance</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <p className="text-[11px] font-medium text-slate-500">Tuition Collected</p>
                  <p className="text-xl font-bold text-indigo-600">$28,450</p>
                  <span className="text-[10px] text-slate-400">8 Invoices pending</span>
                </div>
              </div>

              {/* Sample table preview */}
              <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-800">Recent Enrolled Students</p>
                  <span className="text-[11px] text-indigo-600 font-medium">View Directory →</span>
                </div>
                <div className="text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                    <span>Sophia Martinez — Full-Stack Web Development</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-semibold">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                    <span>Ava Anderson — Applied Data Science & AI</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-semibold">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">{t('landing.featuresTitle')}</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('landing.featuresSubtitle')}
            </p>
            <p className="text-sm text-slate-500 mt-3">
              Built with an API-ready modular service layer for straightforward backend synchronization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 hover:shadow-soft transition-all"
              >
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs w-fit mb-4">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">{t('landing.rolesTitle')}</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('landing.rolesSubtitle')}
            </p>
            <p className="text-sm text-slate-500 mt-3">
              Role-specific views provide focused experiences for administrators, faculty, learners, and families.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((r, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft flex flex-col">
                <div className="p-3 rounded-xl bg-slate-100 w-fit mb-4">{r.icon}</div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{r.title}</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{r.desc}</p>
                <ul className="space-y-2 mt-auto pt-4 border-t border-slate-100 text-xs text-slate-700">
                  {r.highlights.map((h, hIdx) => (
                    <li key={hIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20 bg-indigo-600 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            {t('landing.ctaTitle')}
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 max-w-xl mx-auto mb-8 leading-relaxed">
            {t('landing.ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/admin/dashboard">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 border-white shadow-sm">
                {t('landing.openAdmin')}
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-indigo-300 text-white hover:bg-indigo-700">
                {t('landing.signInRole')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span>EduFlow SaaS Foundation</span>
          </div>
          <p>© 2024–2026 EduFlow Systems Inc. {t('landing.footer')}</p>
          <div className="flex items-center gap-4">
            <LanguageSwitcher variant="footer" />
            <Link to="/login" className="hover:text-white transition-colors">{t('auth.signInHere')}</Link>
            <Link to="/admin/dashboard" className="hover:text-white transition-colors">Admin Console</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
