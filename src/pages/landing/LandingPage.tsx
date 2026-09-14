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
  ChevronRight
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Users className="w-6 h-6 text-indigo-400" />,
      title: 'Student & Teacher Management',
      desc: 'Centralized profiles, cohort assignments, attendance records, and academic progress tracking in one unified directory.',
    },
    {
      icon: <CalendarCheck className="w-6 h-6 text-emerald-400" />,
      title: 'Real-Time Attendance Tracking',
      desc: 'Single-click attendance logging with statuses for Present, Late, Absent, and Sick plus automatic monthly percentage summaries.',
    },
    {
      icon: <Clock className="w-6 h-6 text-sky-400" />,
      title: 'Smart Timetable Scheduling',
      desc: 'Interactive daily and weekly calendar views preventing classroom double-booking and simplifying faculty schedules.',
    },
    {
      icon: <CreditCard className="w-6 h-6 text-amber-400" />,
      title: 'Tuition & Payment Management',
      desc: 'Automated invoice generation, payment status tracking (Paid, Pending, Overdue), and transparent parent receipts.',
    },
    {
      icon: <Award className="w-6 h-6 text-purple-400" />,
      title: 'Examinations, Grades & Homework',
      desc: 'Comprehensive gradebooks, automated GPA/letter grades, exam schedules, and online homework submission workflows.',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-rose-400" />,
      title: 'Actionable Reporting & Analytics',
      desc: 'In-depth institution analytics on student enrollment velocity, attendance trends, course popularity, and revenue health.',
    },
  ];

  const roles = [
    {
      role: 'ADMIN',
      title: 'Administrators',
      icon: <Shield className="w-8 h-8 text-indigo-400" />,
      desc: 'Total oversight of courses, batches, staff allocations, tuition billing, and institutional analytics.',
      highlights: ['Full CRUD data control', 'Revenue & fee analytics', 'Course curriculum design'],
      bg: 'from-indigo-500/10 to-transparent border-indigo-500/20'
    },
    {
      role: 'TEACHER',
      title: 'Teachers & Faculty',
      icon: <BookOpen className="w-8 h-8 text-emerald-400" />,
      desc: 'Streamlined daily workflow for checking attendance, grading tests, publishing homework, and monitoring timetables.',
      highlights: ['Interactive roll-call', 'Assignment grader', 'Direct schedule views'],
      bg: 'from-emerald-500/10 to-transparent border-emerald-500/20'
    },
    {
      role: 'STUDENT',
      title: 'Students',
      icon: <GraduationCap className="w-8 h-8 text-sky-400" />,
      desc: 'Personal academic hub with class schedules, assignment deadlines, exam grades, and attendance tracking.',
      highlights: ['Timetable at a glance', 'Homework submissions', 'Report cards'],
      bg: 'from-sky-500/10 to-transparent border-sky-500/20'
    },
    {
      role: 'PARENT',
      title: 'Parents & Guardians',
      icon: <HeartHandshake className="w-8 h-8 text-purple-400" />,
      desc: 'Stay informed with real-time insight into your children’s attendance records, grades, and tuition invoices.',
      highlights: ['Multi-child overview', 'Instant attendance alerts', 'Online fee payments'],
      bg: 'from-purple-500/10 to-transparent border-purple-500/20'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-indigo-500/30">
      {/* Top Navigation */}
      <header className="fixed top-0 inset-x-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-105">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">EduFlow</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link to="/admin/dashboard">
              <button className="px-5 py-2.5 bg-white text-slate-900 text-sm font-semibold rounded-full hover:bg-slate-100 transition-colors shadow-lg shadow-white/10 flex items-center gap-2">
                Live Demo <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Next-Generation Education SaaS Architecture
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-8">
            Manage Education. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-sky-400">
              Simplify Everything.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            EduFlow helps educational centers manage students, teachers, courses, attendance, schedules,
            and academic progress from one cohesive, high-performance platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link to="/admin/dashboard">
              <button className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-full transition-all shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] flex items-center gap-2">
                Explore Admin Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link to="/login">
              <button className="h-14 px-8 bg-white/5 hover:bg-white/10 text-white text-base font-semibold rounded-full border border-white/10 transition-all backdrop-blur-md">
                Role-Based Portals
              </button>
            </Link>
          </div>

          {/* Interactive UI Mock Preview */}
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-20 pointer-events-none" />
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-2 shadow-2xl shadow-indigo-500/10 overflow-hidden transform perspective-1000 rotate-x-12 scale-100 origin-bottom transition-transform duration-700 hover:rotate-x-0">
              <div className="rounded-xl overflow-hidden border border-white/5 bg-slate-950 p-4 text-left">
                {/* Fake window top bar */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-3 text-xs font-medium text-slate-500">EduFlow — Administrative Console</span>
                  </div>
                  <div className="text-[11px] font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    Active Session
                  </div>
                </div>

                {/* Sample Metrics inside mock */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    { title: 'Total Enrolled', val: '148', sub: '+12.8% this term', color: 'emerald' },
                    { title: 'Active Teachers', val: '14', sub: '10 Active cohorts', color: 'slate' },
                    { title: 'Avg Attendance', val: '94.2%', sub: 'High compliance', color: 'indigo' },
                    { title: 'Revenue', val: '$28,450', sub: '8 Invoices pending', color: 'purple' },
                  ].map((s, i) => (
                    <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 backdrop-blur-sm">
                      <p className="text-[11px] font-medium text-slate-400 mb-1">{s.title}</p>
                      <p className="text-2xl font-bold text-white mb-1">{s.val}</p>
                      <span className={`text-[10px] font-semibold text-${s.color}-400`}>{s.sub}</span>
                    </div>
                  ))}
                </div>

                {/* Sample table preview */}
                <div className="bg-white/5 rounded-xl border border-white/5 p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-white">Recent Enrollments</p>
                    <span className="text-xs text-indigo-400 flex items-center gap-1 cursor-pointer hover:text-indigo-300">View Directory <ChevronRight className="w-3 h-3" /></span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: 'Sophia Martinez', course: 'Full-Stack Web Development' },
                      { name: 'Ava Anderson', course: 'Applied Data Science & AI' },
                      { name: 'Marcus Johnson', course: 'UI/UX Design Masterclass' },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                        <div>
                          <p className="text-sm font-medium text-slate-200">{row.name}</p>
                          <p className="text-xs text-slate-500">{row.course}</p>
                        </div>
                        <span className="text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Active</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-3">Comprehensive Capabilities</h2>
            <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
              Everything Your Academy Needs
            </p>
            <p className="text-base text-slate-400">
              Built with an API-ready modular service layer for straightforward backend synchronization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-default"
              >
                <div className="w-12 h-12 bg-slate-900 rounded-xl border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-24 relative overflow-hidden bg-slate-900 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold uppercase tracking-widest text-purple-400 mb-3">Multi-Tenant Portals</h2>
            <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
              Designed for Every Stakeholder
            </p>
            <p className="text-base text-slate-400">
              Role-specific views provide focused experiences for administrators, faculty, learners, and families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((r, i) => (
              <div key={i} className={`p-8 rounded-3xl bg-gradient-to-b ${r.bg} border flex flex-col backdrop-blur-sm`}>
                <div className="mb-6">{r.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{r.title}</h3>
                <p className="text-sm text-slate-400 mb-8 leading-relaxed flex-1">{r.desc}</p>
                <ul className="space-y-3 pt-6 border-t border-white/10">
                  {r.highlights.map((h, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
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
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/30 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            Ready to Experience Modern Education Management?
          </h2>
          <p className="text-lg text-indigo-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            Jump directly into the fully functioning frontend demo. Explore student management, attendance rolls,
            gradebooks, and reports right now.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/admin/dashboard">
              <button className="h-14 px-8 bg-white hover:bg-slate-100 text-slate-900 text-base font-bold rounded-full transition-all shadow-xl shadow-white/10">
                Open Admin Dashboard
              </button>
            </Link>
            <Link to="/login">
              <button className="h-14 px-8 bg-white/10 hover:bg-white/20 text-white text-base font-bold rounded-full border border-white/20 transition-all backdrop-blur-md">
                Log In to Portals
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-slate-950 py-12 border-t border-white/10 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-white font-bold">
            <GraduationCap className="w-5 h-5 text-indigo-500" />
            <span>EduFlow SaaS Foundation</span>
          </div>
          <p className="text-slate-500 text-center md:text-left">
            © 2024–2026 EduFlow Systems Inc. Premium Frontend Architecture.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-slate-400 hover:text-white transition-colors">Portal Login</Link>
            <Link to="/admin/dashboard" className="text-slate-400 hover:text-white transition-colors">Admin Console</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
