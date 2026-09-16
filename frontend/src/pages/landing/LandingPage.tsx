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
      icon: <Users className="w-6 h-6 text-indigo-700" />,
      title: 'Student & Teacher Management',
      desc: 'Centralized profiles, cohort assignments, attendance records, and academic progress tracking in one unified directory.',
      bgClass: 'bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:bg-slate-900/60 hover:border-white/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)]',
      iconClass: 'bg-white/5 border border-white/10 text-white',
    },
    {
      icon: <CalendarCheck className="w-6 h-6 text-emerald-700" />,
      title: 'Real-Time Attendance Tracking',
      desc: 'Single-click attendance logging with statuses for Present, Late, Absent, and Sick plus automatic monthly percentage summaries.',
      bgClass: 'bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:bg-slate-900/60 hover:border-white/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)]',
      iconClass: 'bg-white/5 border border-white/10 text-white',
    },
    {
      icon: <Clock className="w-6 h-6 text-sky-700" />,
      title: 'Smart Timetable Scheduling',
      desc: 'Interactive daily and weekly calendar views preventing classroom double-booking and simplifying faculty schedules.',
      bgClass: 'bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:bg-slate-900/60 hover:border-white/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)]',
      iconClass: 'bg-white/5 border border-white/10 text-white',
    },
    {
      icon: <CreditCard className="w-6 h-6 text-amber-700" />,
      title: 'Tuition & Payment Management',
      desc: 'Automated invoice generation, payment status tracking (Paid, Pending, Overdue), and transparent parent receipts.',
      bgClass: 'bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:bg-slate-900/60 hover:border-white/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)]',
      iconClass: 'bg-white/5 border border-white/10 text-white',
    },
    {
      icon: <Award className="w-6 h-6 text-purple-700" />,
      title: 'Examinations, Grades & Homework',
      desc: 'Comprehensive gradebooks, automated GPA/letter grades, exam schedules, and online homework submission workflows.',
      bgClass: 'bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:bg-slate-900/60 hover:border-white/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)]',
      iconClass: 'bg-white/5 border border-white/10 text-white',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-rose-700" />,
      title: 'Actionable Reporting & Analytics',
      desc: 'In-depth institution analytics on student enrollment velocity, attendance trends, course popularity, and revenue health.',
      bgClass: 'bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:bg-slate-900/60 hover:border-white/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)]',
      iconClass: 'bg-white/5 border border-white/10 text-white',
    },
  ];

  const roles = [
    {
      role: 'ADMIN',
      title: 'Administrators',
      desc: 'Total oversight of courses, batches, staff allocations, tuition billing, and institutional analytics.',
      icon: <Shield className="w-6 h-6 text-indigo-600" />,
      highlights: ['Full CRUD data control', 'Revenue & fee analytics', 'Course curriculum design'],
      bgClass: 'bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-white/30',
      iconClass: 'bg-white/5 border border-white/10 text-indigo-400',
      highlightIconClass: 'text-emerald-400',
    },
    {
      role: 'TEACHER',
      title: 'Teachers & Faculty',
      desc: 'Streamlined daily workflow for checking attendance, grading tests, publishing homework, and monitoring timetables.',
      icon: <BookOpen className="w-6 h-6 text-emerald-600" />,
      highlights: ['Interactive roll-call', 'Assignment grader', 'Direct schedule views'],
      bgClass: 'bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-white/30',
      iconClass: 'bg-white/5 border border-white/10 text-emerald-400',
      highlightIconClass: 'text-emerald-400',
    },
    {
      role: 'STUDENT',
      title: 'Students',
      desc: 'Personal academic hub with class schedules, assignment deadlines, exam grades, and attendance tracking.',
      icon: <GraduationCap className="w-6 h-6 text-sky-600" />,
      highlights: ['Timetable at a glance', 'Homework submissions', 'Report cards'],
      bgClass: 'bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-white/30',
      iconClass: 'bg-white/5 border border-white/10 text-sky-400',
      highlightIconClass: 'text-emerald-400',
    },
    {
      role: 'PARENT',
      title: 'Parents & Guardians',
      desc: 'Stay informed with real-time insight into your children’s attendance records, grades, and tuition invoices.',
      icon: <HeartHandshake className="w-6 h-6 text-purple-600" />,
      highlights: ['Multi-child overview', 'Instant attendance alerts', 'Online fee payments'],
      bgClass: 'bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-white/30',
      iconClass: 'bg-white/5 border border-white/10 text-purple-400',
      highlightIconClass: 'text-emerald-400',
    },
  ];

  return (
    <div className="min-h-screen font-sans text-slate-200 relative">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/dashboard-bg.jpg)' }}
      >
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"></div>
      </div>
      
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900/30 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-sm shadow-indigo-900/20 border border-indigo-500/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">EduFlow</span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="navbar" />
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10">
                {t('auth.signInHere')}
              </Button>
            </Link>
            <Link to="/admin/dashboard">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />} className="bg-indigo-600 hover:bg-indigo-500 text-white border-none">
                {t('landing.getStarted')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-left">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
                Ta'lim —<br/>kelajak sari<br/>eng yaxshi yo'l!
              </h1>
              <p className="text-lg text-slate-300 max-w-lg mb-8 leading-relaxed">
                EduFlow — o'quv markazlari uchun zamonaviy boshqaruv platformasi. O'quv jarayonini soddalashtiring, bolalarning rivojlanishini kuzating.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link to="/admin/dashboard">
                  <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-indigo-500/30 rounded-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Boshlash
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto rounded-full font-semibold text-slate-200 hover:bg-white/10 hover:text-white">
                    Biz bilan bog'lanish
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex-1 relative">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl opacity-50 z-0"></div>
              <img src="/images/landing-hero.png" alt="Students" className="w-full h-auto max-w-lg mx-auto relative z-10 object-contain drop-shadow-2xl" />
              
              {/* Floating badges */}
              <div className="absolute top-10 right-10 bg-slate-900/60 backdrop-blur-md p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/10 transform rotate-6 z-20 animate-bounce" style={{animationDuration: '3s'}}>
                <span className="text-indigo-400 font-bold text-sm">Bilim — kuch!</span>
              </div>
            </div>
          </div>

          {/* Floating Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 relative z-20">
            <div className="p-6 flex flex-col gap-3 hover:-translate-y-1 transition-transform bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">Oson boshqaruv</h3>
                <p className="text-xs text-slate-400 mt-1">Barcha jarayonlar bir joyda</p>
              </div>
            </div>
            <div className="p-6 flex flex-col gap-3 hover:-translate-y-1 transition-transform bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400 border border-sky-500/30">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">Onlayn darslar</h3>
                <p className="text-xs text-slate-400 mt-1">Zamonaviy formatda</p>
              </div>
            </div>
            <div className="p-6 flex flex-col gap-3 hover:-translate-y-1 transition-transform bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">Natija kuzatish</h3>
                <p className="text-xs text-slate-400 mt-1">Rivojlanishni tahlil qiling</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative overflow-hidden">
        {/* Decorative Blurred Blobs for Glassmorphism Effect */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-sky-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">{t('landing.featuresTitle')}</h2>
            <p className="text-3xl font-extrabold text-white tracking-tight">
              {t('landing.featuresSubtitle')}
            </p>
            <p className="text-sm text-slate-300 mt-3">
              Built with an API-ready modular service layer for straightforward backend synchronization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className={`p-6 rounded-3xl hover:-translate-y-1 transition-all duration-300 ${f.bgClass}`}
              >
                <div className={`p-3 rounded-2xl w-fit mb-5 flex items-center justify-center ${f.iconClass}`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="pt-24 pb-20 relative overflow-hidden border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">{t('landing.rolesTitle')}</h2>
            <p className="text-3xl font-extrabold text-white tracking-tight">
              {t('landing.rolesSubtitle')}
            </p>
            <p className="text-sm text-slate-300 mt-3">
              Role-specific views provide focused experiences for administrators, faculty, learners, and families.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((r, i) => (
              <div key={i} className={`p-6 rounded-[20px] flex flex-col hover:-translate-y-1 transition-all duration-300 ${r.bgClass}`}>
                <div className={`p-3 rounded-2xl w-fit mb-5 flex items-center justify-center ${r.iconClass}`}>
                  {r.icon}
                </div>
                <h3 className="text-[17px] font-extrabold text-white mb-2">{r.title}</h3>
                <p className="text-[13px] text-slate-300 mb-6 leading-relaxed flex-1">{r.desc}</p>
                <ul className="space-y-3 mt-auto pt-5 border-t border-white/10 text-[12px] text-slate-200">
                  {r.highlights.map((h, hIdx) => (
                    <li key={hIdx} className="flex items-center gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${r.highlightIconClass}`} />
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
      <section className="py-20 bg-slate-900/60 backdrop-blur-xl border-y border-white/10 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            {t('landing.ctaTitle')}
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 max-w-xl mx-auto mb-8 leading-relaxed">
            {t('landing.ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/admin/dashboard">
              <Button size="lg" className="bg-indigo-600 text-white hover:bg-indigo-500 border-none shadow-[0_8px_30px_rgb(99,102,241,0.2)]">
                {t('landing.openAdmin')}
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 !bg-transparent">
                {t('landing.signInRole')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-slate-950/80 backdrop-blur-xl text-slate-400 py-12 text-xs border-t border-white/10">
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
