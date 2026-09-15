import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Edit2, Trash2, BookOpen, Users, Calendar, MapPin } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchInput } from '../../components/common/SearchInput';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { GroupModal } from '../../features/groups/GroupModal';
import { groupsService } from '../../services/groups.service';
import { coursesService } from '../../services/courses.service';
import { teachersService } from '../../services/teachers.service';
import type { Group, Course, Teacher } from '../../types';
import { useTranslation } from '../../i18n';

export const GroupsPage: React.FC = () => {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<Group[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const data = await groupsService.getAll({
        search: search || undefined,
      });
      setGroups(data);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [cList, tList] = await Promise.all([
          coursesService.getAll(),
          teachersService.getAll(),
        ]);
        setCourses(cList);
        setTeachers(tList);
      } catch (e) {
        console.error(e);
      }
    };
    loadMetadata();
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleSave = async (data: any) => {
    if (editingGroup) {
      await groupsService.update(editingGroup.id, data);
    } else {
      await groupsService.create(data);
    }
    fetchGroups();
  };

  const handleDelete = async () => {
    if (!groupToDelete) return;
    try {
      setDeleteLoading(true);
      await groupsService.delete(groupToDelete.id);
      setDeleteConfirmOpen(false);
      setGroupToDelete(null);
      fetchGroups();
    } finally {
      setDeleteLoading(false);
    }
  };

  const getCourseTitle = (cId: string) => {
    return courses.find((c) => c.id === cId)?.title || t('groups.course');
  };

  const getTeacherName = (tId: string) => {
    const tMember = teachers.find((tch) => tch.id === tId);
    return tMember ? `${tMember.firstName} ${tMember.lastName}` : t('groups.teacher');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('groups.title')}
        description={t('groups.desc')}
        actions={
          <Button
            variant="primary"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            onClick={() => {
              setEditingGroup(null);
              setModalOpen(true);
            }}
          >
            {t('groups.addGroup')}
          </Button>
        }
      />

      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-soft flex items-center justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t('groups.searchPlaceholder')}
          className="w-full sm:w-80"
        />
        <span className="text-xs text-slate-500 hidden sm:inline">
          {t('common.all')}: <strong className="text-slate-800">{groups.length}</strong> {t('common.groups')}
        </span>
      </div>

      {loading ? (
        <LoadingState message={t('groups.loadingGroups')} />
      ) : groups.length === 0 ? (
        <EmptyState
          title={t('groups.noGroups')}
          description={t('groups.noGroupsDesc')}
          actionText={t('groups.addGroup')}
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card key={group.id} hover className="flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{group.name}</CardTitle>
                    <p className="text-xs font-medium text-indigo-600 mt-1 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {getCourseTitle(group.courseId)}
                    </p>
                  </div>
                  <StatusBadge status={group.status} size="sm" />
                </div>
              </CardHeader>

              <CardContent className="space-y-2.5 pt-0 text-xs text-slate-600">
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium">{group.schedule}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{t('groups.room')}: <strong>{group.room}</strong></span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <span>{t('groups.teacher')}: <strong className="text-slate-800">{getTeacherName(group.teacherId)}</strong></span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {group.studentsCount} / {group.capacity}
                  </span>
                </div>
              </CardContent>

              <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setEditingGroup(group);
                    setModalOpen(true);
                  }}
                >
                  {t('common.edit')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-rose-50 text-rose-600"
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setGroupToDelete(group);
                    setDeleteConfirmOpen(true);
                  }}
                >
                  {t('common.delete')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <GroupModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        initialData={editingGroup}
        courses={courses}
        teachers={teachers}
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title={t('groups.deleteConfirmTitle')}
        message={t('groups.deleteConfirmDesc')}
        confirmText={t('common.delete')}
        isLoading={deleteLoading}
      />
    </div>
  );
};
