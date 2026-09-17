import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Award, BookMarked, CreditCard, CheckCircle2, BookOpen } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { LoadingState } from '../../components/ui/LoadingState';
import { gradesService } from '../../services/grades.service';
import { homeworkService } from '../../services/homework.service';
import { scheduleService } from '../../services/schedule.service';
import type { Grade, Homework, ClassSession } from '../../types';

import { useAuth } from '../../app/providers';

export const StudentDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [gList, hwList, schList] = await Promise.all([
          gradesService.getAll(),
          homeworkService.getAll(),
          scheduleService.getAll({ dayOfWeek: 'Monday' }),
        ]);
        setGrades(gList);
        setHomeworks(hwList);
        setClasses(schList.slice(0, 2));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingState message={t('common.loading')} />;

  const displayName = currentUser?.name || 'Talaba';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Salom, {displayName}! 👋</h1>
          <p className="text-sm text-slate-300 mt-1">Bugungi darslar va harakatlar</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Mening kurslarim"
          value="4 ta"
          icon={<BookMarked className="w-5 h-5" />}
          iconColor="indigo"
        />
        <StatCard
          title="Dars jadvali"
          value="Bugun 3 ta dars"
          icon={<Calendar className="w-5 h-5" />}
          iconColor="amber"
        />
        <StatCard
          title="Vazifalar"
          value="2 ta"
          icon={<BookOpen className="w-5 h-5" />}
          iconColor="emerald"
        />
        <StatCard
          title="Natijalar"
          value="Yaxshi"
          icon={<Award className="w-5 h-5" />}
          iconColor="sky"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Keyingi darslar
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/student/schedule')}>
                Barchasi
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">EN</div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">Ingliz tili</p>
                    <p className="text-[11px] text-slate-400">09:00 - 10:30 • Xona 201</p>
                  </div>
                </div>
                <Button size="sm" className="bg-indigo-600">Boshlash</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">MA</div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">Matematika</p>
                    <p className="text-[11px] text-slate-400">11:00 - 12:30 • Xona 105</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">Kutish</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">IT</div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">Dasturlash</p>
                    <p className="text-[11px] text-slate-400">14:00 - 15:30 • Xona 302</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">Kutish</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Promotional Banner */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl p-6 text-white relative overflow-hidden h-full flex flex-col justify-center min-h-[300px]">
            <div className="relative z-10 max-w-[200px]">
              <h3 className="text-2xl font-bold leading-tight drop-shadow-md">Katta orzular<br/>kichik qadamlar<br/>bilan boshlanadi!</h3>
            </div>
            <img src="/images/auth-student.png" alt="Student" className="absolute -right-6 -bottom-6 w-48 opacity-100 drop-shadow-2xl" />
          </div>
        </div>
      </div>

      {/* Recent Grade Transcripts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2 text-white">
            <Award className="w-5 h-5 text-indigo-400" />
            {t('portal.recentTranscripts')}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/student/grades')}>
            {t('portal.fullReportCard')}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {grades.map((grd) => (
              <div key={grd.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                <div>
                  <p className="font-bold text-slate-200">{grd.examTitle}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">{grd.courseTitle} • {grd.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-indigo-400 text-sm">{grd.percentage}%</span>
                  <span className="px-2.5 py-0.5 rounded-md font-bold text-xs bg-indigo-500/20 text-indigo-400">
                    {grd.letterGrade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
