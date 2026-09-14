import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, MapPin, CalendarCheck } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LoadingState } from '../../components/ui/LoadingState';
import { groupsService } from '../../services/groups.service';
import type { Group } from '../../types';

export const TeacherGroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await groupsService.getAll();
        setGroups(data.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingState message="Loading your teaching cohorts..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Assigned Student Groups"
        description="Review class rosters, schedules, and start attendance roll-calls for your cohorts."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group) => (
          <Card key={group.id} hover className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">{group.name}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {group.schedule}
                </p>
              </div>
              <StatusBadge status={group.status} size="sm" />
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Room: <strong>{group.room}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <strong>{group.studentsCount}</strong> students enrolled
              </span>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<CalendarCheck className="w-3.5 h-3.5" />}
                onClick={() => navigate('/teacher/attendance')}
              >
                Roll-Call
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
