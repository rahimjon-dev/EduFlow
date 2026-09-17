import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Shield, BookOpen, HeartHandshake, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../app/providers';
import type { UserRole } from '../../types';
import { useTranslation } from '../../i18n';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleQuickSelect = (r: UserRole) => {
    setSelectedRole(r);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Login, telefon yoki emailni kiriting');
      return;
    }
    if (!password) {
      setError('Parolni kiriting');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const isExplicitAdmin = (trimmedEmail.toLowerCase() === 'admin' || trimmedEmail.toLowerCase() === 'admin@eduflow.uz' || trimmedEmail.toLowerCase() === 'admin@eduflow.edu') && password === '0603';
      const targetRole: UserRole = isExplicitAdmin ? 'ADMIN' : selectedRole;

      const loggedInRole = await login({ email: trimmedEmail, password, rememberMe, role: targetRole });

      const redirects: Record<UserRole, string> = {
        ADMIN: '/admin/dashboard',
        TEACHER: '/teacher/dashboard',
        STUDENT: '/student/dashboard',
        PARENT: '/parent/dashboard',
      };
      const finalRole = (loggedInRole || targetRole) as UserRole;
      navigate(redirects[finalRole] || '/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Kirishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex font-sans relative items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/dashboard-bg.jpg)' }}
    >
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] z-0 pointer-events-none"></div>

      {/* Top right language switcher */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <LanguageSwitcher variant="navbar" />
      </div>

      <div className="w-full max-w-5xl bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex overflow-hidden min-h-[600px] z-10 relative">
        {/* Left Form Section */}
        <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center">
          {/* Header */}
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">EduFlow</span>
          </Link>
          
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Tizimga kirish</h2>
          <p className="text-sm text-slate-400 mb-6">Hisobingiz orqali davom eting</p>

          {/* Role Tabs: Only TEACHER, STUDENT, PARENT (Admin enters via default login: admin / 0603) */}
          <div className="flex p-1 bg-black/30 rounded-lg mb-6 border border-white/5">
            {(['TEACHER', 'STUDENT', 'PARENT'] as UserRole[]).map((r) => {
              const labels = {
                ADMIN: 'Admin',
                TEACHER: "O'qituvchi",
                STUDENT: "O'quvchi",
                PARENT: 'Ota-ona'
              };
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleQuickSelect(r)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    selectedRole === r
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {labels[r]}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50/80 border border-rose-200 rounded-xl text-sm font-medium text-rose-800 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Telefon raqami yoki email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-400 text-sm">📞</span>
                  </div>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    placeholder="Login, telefon yoki email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Parol</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-400 text-sm">🔒</span>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    placeholder="Parolni kiriting..."
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs mt-4">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-white/20 bg-black/20 text-indigo-500 focus:ring-indigo-500"
                />
                <span>Meni eslab qol</span>
              </label>
              <a href="#forgot" className="text-indigo-600 font-semibold hover:text-indigo-700">
                Parolni unutdingizmi?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 mt-2"
              isLoading={loading}
            >
              Kirish
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-xs"><span className="px-2 bg-slate-900/40 text-slate-400 rounded-full">yoki</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="flex items-center justify-center gap-2 w-full h-10 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-white hover:bg-white/10 transition-colors">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                Google
              </button>
              <button type="button" className="flex items-center justify-center gap-2 w-full h-10 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-white hover:bg-white/10 transition-colors">
                <img src="https://www.svgrepo.com/show/475688/telegram-color.svg" alt="Telegram" className="w-4 h-4" />
                Telegram
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            Hisobingiz yo'qmi?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Ro'yxatdan o'ting
            </Link>
          </p>
        </div>

        {/* Right Image/Branding Section */}
        <div className="hidden lg:flex lg:flex-1 relative w-full h-full bg-indigo-900/20 border-l border-white/10 items-center justify-center p-12 overflow-hidden">
          <div className="absolute top-10 right-10 text-right">
             <h3 className="text-2xl font-bold text-indigo-200" style={{fontFamily: "'Caveat', cursive", transform: 'rotate(-5deg)'}}>
               Orzularingga<br/>birga erishamiz!
             </h3>
          </div>
          
          <img 
            src="/images/auth-student.png" 
            alt="Student" 
            className="w-full max-w-sm object-contain relative z-10"
          />
          <div className="absolute bottom-0 w-[120%] h-48 bg-indigo-600 rounded-t-[100%] blur-3xl opacity-20"></div>
        </div>
      </div>
    </div>
  );
};
