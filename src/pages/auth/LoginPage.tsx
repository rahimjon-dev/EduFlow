import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Shield, BookOpen, HeartHandshake, ArrowRight } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../app/providers';
import type { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@eduflow.edu');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleQuickSelect = (r: UserRole, defaultEmail: string) => {
    setSelectedRole(r);
    setEmail(defaultEmail);
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <GraduationCap className="w-7 h-7" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">EduFlow</span>
        </Link>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Sign in to your account</h2>
        <p className="text-xs text-slate-500 mt-1">
          Select a role below for instant frontend authentication simulation.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-soft-lg rounded-2xl border border-slate-200 sm:px-8">
          {/* Quick Demo Role Switcher */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Select Demo Persona
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleRoleQuickSelect('ADMIN', 'admin@eduflow.edu')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  selectedRole === 'ADMIN'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-1 ring-indigo-600'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <p className="text-xs font-semibold">Admin</p>
                  <p className="text-[10px] text-slate-500">Full control</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickSelect('TEACHER', 'marcus.chen@eduflow.edu')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  selectedRole === 'TEACHER'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-semibold">Teacher</p>
                  <p className="text-[10px] text-slate-500">Classes & grades</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickSelect('STUDENT', 'alex.wright@example.com')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  selectedRole === 'STUDENT'
                    ? 'border-sky-600 bg-sky-50/70 text-sky-900 ring-1 ring-sky-600'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-sky-600 shrink-0" />
                <div>
                  <p className="text-xs font-semibold">Student</p>
                  <p className="text-[10px] text-slate-500">Schedule & work</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickSelect('PARENT', 'robert.wright@example.com')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  selectedRole === 'PARENT'
                    ? 'border-purple-600 bg-purple-50/70 text-purple-900 ring-1 ring-purple-600'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <HeartHandshake className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <p className="text-xs font-semibold">Parent</p>
                  <p className="text-[10px] text-slate-500">Child & tuition</p>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@eduflow.edu"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Remember me
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('In mock mode: simply click Sign In!'); }} className="text-indigo-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In as {selectedRole}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
