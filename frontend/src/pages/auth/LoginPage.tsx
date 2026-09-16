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
  const [email, setEmail] = useState('admin@admin.edu');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleQuickSelect = (r: UserRole, defaultEmail: string) => {
    setSelectedRole(r);
    setEmail(defaultEmail);
    const passwords: Record<UserRole, string> = {
      ADMIN: 'admin123',
      TEACHER: 'teacher123',
      STUDENT: 'student123',
      PARENT: 'parent123',
    };
    setPassword(passwords[r] || 'admin123');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login({ email, password, rememberMe, role: selectedRole });

      const redirects: Record<UserRole, string> = {
        ADMIN: '/admin/dashboard',
        TEACHER: '/teacher/dashboard',
        STUDENT: '/student/dashboard',
        PARENT: '/parent/dashboard',
      };
      navigate(redirects[selectedRole]);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans relative">
      {/* Top right language switcher */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <LanguageSwitcher variant="navbar" />
      </div>

      {/* Left Form Section */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md py-8">
          {/* Header */}
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 transition-transform group-hover:scale-105">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">EduFlow</span>
          </Link>
          
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">{t('auth.signInTitle')}</h2>
          <p className="text-sm text-slate-500 mb-8">
            {t('auth.signInSubtitle')}
          </p>

          {/* Quick Demo Role Switcher */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                {t('auth.selectPersona')}
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleQuickSelect('ADMIN', 'admin@admin.edu')}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all duration-200 ${
                  selectedRole === 'ADMIN'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600'
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Shield className={`w-5 h-5 shrink-0 mt-0.5 ${selectedRole === 'ADMIN' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div>
                  <p className={`text-sm font-semibold ${selectedRole === 'ADMIN' ? 'text-indigo-900' : 'text-slate-700'}`}>{t('roles.admin')}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Director level</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickSelect('TEACHER', 'anvar@oqituvchi.edu')}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all duration-200 ${
                  selectedRole === 'TEACHER'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <BookOpen className={`w-5 h-5 shrink-0 mt-0.5 ${selectedRole === 'TEACHER' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <p className={`text-sm font-semibold ${selectedRole === 'TEACHER' ? 'text-emerald-900' : 'text-slate-700'}`}>{t('roles.teacher')}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Faculty access</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickSelect('STUDENT', 'ali@oquvchi.edu')}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all duration-200 ${
                  selectedRole === 'STUDENT'
                    ? 'border-sky-600 bg-sky-50/50 shadow-sm ring-1 ring-sky-600'
                    : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <GraduationCap className={`w-5 h-5 shrink-0 mt-0.5 ${selectedRole === 'STUDENT' ? 'text-sky-600' : 'text-slate-400'}`} />
                <div>
                  <p className={`text-sm font-semibold ${selectedRole === 'STUDENT' ? 'text-sky-900' : 'text-slate-700'}`}>{t('roles.student')}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Learner portal</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickSelect('PARENT', 'ziyoda@otaona.edu')}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all duration-200 ${
                  selectedRole === 'PARENT'
                    ? 'border-purple-600 bg-purple-50/50 shadow-sm ring-1 ring-purple-600'
                    : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <HeartHandshake className={`w-5 h-5 shrink-0 mt-0.5 ${selectedRole === 'PARENT' ? 'text-purple-600' : 'text-slate-400'}`} />
                <div>
                  <p className={`text-sm font-semibold ${selectedRole === 'PARENT' ? 'text-purple-900' : 'text-slate-700'}`}>{t('roles.parent')}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Family portal</p>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-rose-50/80 border border-rose-200 rounded-xl text-sm font-medium text-rose-800 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Input
                label={t('auth.email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@eduflow.edu"
                required
                className="bg-slate-50/50 focus:bg-white transition-colors"
              />

              <Input
                label={t('auth.password')}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-slate-50/50 focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2.5 text-slate-600 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-0 transition-shadow cursor-pointer"
                  />
                </div>
                <span className="group-hover:text-slate-900 transition-colors">{t('auth.rememberMe')}</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); toast('In mock mode: simply click Sign In!', { icon: '👋' }); }} className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                {t('auth.forgotPassword')}
              </a>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold shadow-md shadow-indigo-600/20"
              size="lg"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {t('auth.signInButton')} {selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()}
            </Button>
          </form>

          <p className="mt-10 text-center text-sm text-slate-500">
            {t('auth.dontHaveAccount')}{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              {t('auth.registerHere')}
            </Link>
          </p>
        </div>
      </div>

      {/* Right Image/Branding Section */}
      <div className="hidden lg:block lg:flex-1 relative w-full h-full overflow-hidden bg-slate-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
            alt="Students collaborating" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-indigo-900/60 to-slate-900/20" />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-sky-500/20 blur-3xl" />

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center px-12 lg:px-20 text-center">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center mb-8 shadow-2xl">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            The Operating System for Modern Education
          </h3>
          <p className="text-lg text-indigo-100/90 max-w-lg mx-auto leading-relaxed mb-12">
            Empower your entire institution with a unified platform designed to streamline administration, enhance teaching, and accelerate student success.
          </p>
          
          <div className="flex items-center gap-4 text-sm font-medium text-white/80 bg-white/5 backdrop-blur-sm border border-white/10 px-6 py-3 rounded-full">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Secure</span>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Fast</span>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Reliable</span>
          </div>
        </div>
      </div>
    </div>
  );
};
