import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, Edit2, Trash2, Mail, Phone, BookOpen, Layers, LayoutGrid, List } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchInput } from '../../components/common/SearchInput';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { TeacherModal } from '../../features/teachers/TeacherModal';
import { teachersService } from '../../services/teachers.service';
import type { Teacher, TeacherStatus } from '../../types';
import { getInitials } from '../../utils/formatters';
import { useTranslation } from '../../i18n';

export const TeachersPage: React.FC = () => {
  const { t } = useTranslation();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TeacherStatus | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await teachersService.getAll({
        search: search || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      setTeachers(data);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleSave = async (data: any) => {
    if (editingTeacher) {
      await teachersService.update(editingTeacher.id, data);
    } else {
      await teachersService.create(data);
    }
    fetchTeachers();
  };

  const handleDelete = async () => {
    if (!teacherToDelete) return;
    try {
      setDeleteLoading(true);
      await teachersService.delete(teacherToDelete.id);
      setDeleteConfirmOpen(false);
      setTeacherToDelete(null);
      fetchTeachers();
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('teachers.title')}
        description={t('teachers.desc')}
        actions={
          <Button
            variant="primary"
            leftIcon={<UserPlus className="w-4 h-4" />}
            onClick={() => {
              setEditingTeacher(null);
              setModalOpen(true);
            }}
          >
            {t('teachers.addTeacher')}
          </Button>
        }
      />

      {/* Filter and View bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t('teachers.searchPlaceholder')}
          className="w-full sm:w-80"
        />

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            options={[
              { value: 'ALL', label: t('common.allStatuses') },
              { value: 'ACTIVE', label: t('common.active') },
              { value: 'ON_LEAVE', label: t('common.onLeave') },
              { value: 'INACTIVE', label: t('common.inactive') },
            ]}
            className="w-40 text-xs py-1.5"
          />

          <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-slate-50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'table' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState message={t('teachers.loadingTeachers')} />
      ) : teachers.length === 0 ? (
        <EmptyState
          title={t('teachers.noTeachers')}
          description={t('teachers.noTeachersDesc')}
          actionText={t('common.clearFilters')}
          onAction={() => {
            setSearch('');
            setStatusFilter('ALL');
          }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <Card key={teacher.id} hover className="flex flex-col justify-between">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    {teacher.avatar ? (
                      <img
                        src={teacher.avatar}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                        {getInitials(`${teacher.firstName} ${teacher.lastName}`)}
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-sm">
                        {teacher.firstName} {teacher.lastName}
                      </CardTitle>
                      <p className="text-xs text-indigo-600 font-medium mt-0.5">{teacher.specialization}</p>
                    </div>
                  </div>
                  <StatusBadge status={teacher.status} size="sm" />
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-0 text-xs text-slate-600">
                <p className="line-clamp-2 text-slate-500 leading-relaxed">{teacher.bio || 'Academic instructor and mentor.'}</p>
                
                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{teacher.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-slate-700 font-medium">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>{teacher.courses.length} {t('common.courses')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>{teacher.groups.length} {t('common.groups')}</span>
                  </div>
                </div>
              </CardContent>

              <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setEditingTeacher(teacher);
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
                    setTeacherToDelete(teacher);
                    setDeleteConfirmOpen(true);
                  }}
                >
                  {t('common.delete')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('teachers.teacherName')}</TableHead>
              <TableHead>{t('teachers.specialization')}</TableHead>
              <TableHead>{t('teachers.email')} / {t('teachers.phone')}</TableHead>
              <TableHead>{t('common.status')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {teacher.avatar ? (
                      <img src={teacher.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {getInitials(`${teacher.firstName} ${teacher.lastName}`)}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{teacher.firstName} {teacher.lastName}</p>
                      <p className="text-[11px] text-slate-500">{teacher.qualification || 'Faculty Member'}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs font-medium text-slate-800">{teacher.specialization}</TableCell>
                <TableCell className="text-xs text-slate-600">{teacher.email}</TableCell>
                <TableCell>
                  <StatusBadge status={teacher.status} size="sm" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingTeacher(teacher);
                        setModalOpen(true);
                      }}
                      title={t('common.edit')}
                    >
                      <Edit2 className="w-4 h-4 text-slate-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-rose-50 hover:text-rose-600"
                      onClick={() => {
                        setTeacherToDelete(teacher);
                        setDeleteConfirmOpen(true);
                      }}
                      title={t('common.delete')}
                    >
                      <Trash2 className="w-4 h-4 text-rose-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <TeacherModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        initialData={editingTeacher}
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title={t('teachers.deleteConfirmTitle')}
        message={t('teachers.deleteConfirmDesc')}
        confirmText={t('common.delete')}
        isLoading={deleteLoading}
      />
    </div>
  );
};
