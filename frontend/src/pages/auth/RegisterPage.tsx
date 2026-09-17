import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../app/providers';
import type { UserRole } from '../../types';
import { useTranslation } from '../../i18n';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.trim()) newErrors.email = 'Email address is required';
    if (!password) newErrors.password = 'Password is required';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await login({ email, role });
      const redirects: Record<UserRole, string> = {
        ADMIN: '/admin/dashboard',
        TEACHER: '/teacher/dashboard',
        STUDENT: '/student/dashboard',
        PARENT: '/parent/dashboard',
      };
      navigate(redirects[role]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex font-sans relative bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/dashboard-bg.jpg)' }}
    >
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] z-0 pointer-events-none"></div>

      {/* Top right language switcher */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <LanguageSwitcher variant="navbar" />
      </div>

      {/* Left Form Section */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 z-10 relative">
        <div className="mx-auto w-full max-w-sm lg:max-w-md py-12 px-8 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          {/* Header */}
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 transition-transform group-hover:scale-105">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">EduFlow</span>
          </Link>
          
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">{t('auth.createAccount')}</h2>
          <p className="text-sm text-slate-400 mb-8">
            Join the unified educational ecosystem today.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <Input
                label={t('auth.fullName')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName}
                placeholder="e.g. Eleanor Vance"
                required
                className="bg-black/20 border-white/10 text-white placeholder-slate-500 focus:bg-black/30 transition-colors"
              />

              <Input
                label={t('auth.email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="name@eduflow.edu"
                required
                className="bg-black/20 border-white/10 text-white placeholder-slate-500 focus:bg-black/30 transition-colors"
              />

              <Select
                label={t('auth.primaryRole')}
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                options={[
                  { value: 'STUDENT', label: `${t('roles.student')} - Classes & grades` },
                  { value: 'TEACHER', label: `${t('roles.teacher')} - Classes & students` },
                  { value: 'PARENT', label: `${t('roles.parent')} - Child progress` },
                ]}
                className="bg-black/20 border-white/10 text-white focus:bg-black/30 transition-colors"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t('auth.password')}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  placeholder="••••••••"
                  required
                  className="bg-black/20 border-white/10 text-white placeholder-slate-500 focus:bg-black/30 transition-colors"
                />

                <Input
                  label={t('auth.confirmPassword')}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                  placeholder="••••••••"
                  required
                  className="bg-black/20 border-white/10 text-white placeholder-slate-500 focus:bg-black/30 transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold shadow-md shadow-indigo-600/20"
                size="lg"
                isLoading={loading}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                {t('auth.registerButton')}
              </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-slate-400">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              {t('auth.signInHere')}
            </Link>
          </p>
        </div>
      </div>

      {/* Right Image/Branding Section */}
      <div className="hidden lg:block lg:flex-1 relative w-full h-full overflow-hidden bg-slate-900 border-l border-white/10 z-10">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop" 
            alt="Students collaborating" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-indigo-900/60 to-slate-900/20" />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 -ml-24 -mt-24 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 -mr-24 -mb-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center px-12 lg:px-20 text-center">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center mb-8 shadow-2xl">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Secure, Modular, Powerful.
          </h3>
          <p className="text-lg text-indigo-100/90 max-w-lg mx-auto leading-relaxed mb-12">
            Register your institution today and gain access to industry-leading educational management tools that drive real results.
          </p>
          
          <div className="flex items-center gap-4 text-sm font-medium text-white/80 bg-white/5 backdrop-blur-sm border border-white/10 px-6 py-3 rounded-full">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Easy Setup</span>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Role-Based</span>
          </div>
        </div>
      </div>
    </div>
  );
};
