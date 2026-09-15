import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CalendarCheck } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LoadingState } from '../../components/ui/LoadingState';
import { studentsService } from '../../services/students.service';
import type { Student } from '../../types';
import { getInitials } from '../../utils/formatters';

export const ParentChildrenPage: React.FC = () => {
  const { t } = useTranslation();
  const [children, setChildren] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Load demo children for Robert Wright
        const res = await studentsService.getAll({ pageSize: 5 });
        setChildren(res.data.slice(0, 2));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingState message={t('portal.loadingChildren')} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('portal.childrenTitle')}
        description={t('portal.childrenDesc')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map((child) => (
          <Card key={child.id} hover className="p-6">
            <div className="flex items-center gap-4">
              {child.avatar ? (
                <img src={child.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-100" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-bold text-xl flex items-center justify-center">
                  {getInitials(`${child.firstName} ${child.lastName}`)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{child.firstName} {child.lastName}</h3>
                  <StatusBadge status={child.status} size="sm" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{child.email}</p>
                <p className="text-xs text-slate-500">{child.phone}</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>Full-Stack Web Dev</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
                <span>96% {t('portal.attendance')}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/parent/attendance')}
              >
                {t('portal.attendance')}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/parent/grades')}
              >
                {t('portal.reportCard')}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
