import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, MapPin, User, Layers } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { LoadingState } from '../../components/ui/LoadingState';
import { scheduleService } from '../../services/schedule.service';
import type { ClassSession, DayOfWeek } from '../../types';

export const SchedulePage: React.FC = () => {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'weekly' | 'daily'>('weekly');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true);
      const data = await scheduleService.getAll();
      setSessions(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const colorStyles: Record<string, string> = {
    indigo: 'bg-indigo-50/80 border-indigo-200 text-indigo-900 border-l-4 border-l-indigo-600',
    emerald: 'bg-emerald-50/80 border-emerald-200 text-emerald-900 border-l-4 border-l-emerald-600',
    violet: 'bg-violet-50/80 border-violet-200 text-violet-900 border-l-4 border-l-violet-600',
    amber: 'bg-amber-50/80 border-amber-200 text-amber-900 border-l-4 border-l-amber-600',
    rose: 'bg-rose-50/80 border-rose-200 text-rose-900 border-l-4 border-l-rose-600',
    teal: 'bg-teal-50/80 border-teal-200 text-teal-900 border-l-4 border-l-teal-600',
    sky: 'bg-sky-50/80 border-sky-200 text-sky-900 border-l-4 border-l-sky-600',
  };

  const renderClassCard = (session: ClassSession) => {
    const cardColor = colorStyles[session.colorTag || 'indigo'] || colorStyles.indigo;
    return (
      <div
        key={session.id}
        className={`p-3.5 rounded-xl border shadow-2xs transition-all hover:shadow-soft ${cardColor}`}
      >
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="text-xs font-bold truncate">{session.courseTitle}</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/80 shrink-0">
            {session.type || 'LECTURE'}
          </span>
        </div>

        <div className="space-y-1 text-xs text-slate-700">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{session.startTime} – {session.endTime}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{session.room}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{t('schedule.cohort')}: {session.groupName}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 pt-1 border-t border-slate-200/50">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{session.teacherName}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('schedule.title')}
        description={t('schedule.desc')}
        actions={
          <div className="inline-flex rounded-lg border border-slate-200 p-1 bg-white shadow-2xs">
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'weekly' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('schedule.weeklyOverview')}
            </button>
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'daily' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('schedule.dailyView')}
            </button>
          </div>
        }
      />

      {loading ? (
        <LoadingState message={t('schedule.loadingSchedule')} />
      ) : viewMode === 'weekly' ? (
        /* Weekly Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {days.map((day) => {
            const daySessions = sessions.filter((s) => s.dayOfWeek === day);
            const dayName = t(`schedule.days.${day}`) || day;
            return (
              <div key={day} className="flex flex-col bg-slate-50/70 rounded-2xl border border-slate-200/80 p-3 min-h-[400px]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 mb-3 px-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">{dayName}</span>
                  <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {daySessions.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {daySessions.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-xs text-slate-400 italic">
                      {t('schedule.noClasses')}
                    </div>
                  ) : (
                    daySessions.map(renderClassCard)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Daily View */
        <div className="space-y-6">
          {/* Day selection tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {days.map((day) => {
              const dayName = t(`schedule.days.${day}`) || day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    selectedDay === day
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {dayName}
                </button>
              );
            })}
          </div>

          {/* Daily Schedule List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                {t('schedule.classesScheduledFor')} {t(`schedule.days.${selectedDay}`) || selectedDay}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sessions.filter((s) => s.dayOfWeek === selectedDay).length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  {t('schedule.noClasses')}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sessions
                    .filter((s) => s.dayOfWeek === selectedDay)
                    .map(renderClassCard)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
