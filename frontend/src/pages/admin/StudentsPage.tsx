import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Edit2, Trash2, Eye, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchInput } from '../../components/common/SearchInput';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { StudentModal } from '../../features/students/StudentModal';
import { studentsService } from '../../services/students.service';
import { coursesService } from '../../services/courses.service';
import { groupsService } from '../../services/groups.service';
import type { Student, StudentStatus, Course, Group } from '../../types';
import { getInitials } from '../../utils/formatters';
import { useTranslation } from '../../i18n';

export const StudentsPage: React.FC = () => {
  const { t } = useTranslation();
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StudentStatus | 'ALL'>('ALL');
  const [groupFilter, setGroupFilter] = useState<string>('ALL');
  const [courseFilter, setCourseFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const pageSize = 8;

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await studentsService.getAll({
        search: search || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        groupId: groupFilter !== 'ALL' ? groupFilter : undefined,
        courseId: courseFilter !== 'ALL' ? courseFilter : undefined,
        page,
        pageSize,
      });
      setStudents(res.data);
      setTotalPages(res.totalPages || 1);
      setTotalStudents(res.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, groupFilter, courseFilter, page]);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [cList, gList] = await Promise.all([
          coursesService.getAll(),
          groupsService.getAll(),
        ]);
        setCourses(cList);
        setGroups(gList);
      } catch (err) {
        console.error('Failed to load courses or groups:', err);
      }
    };
    loadMetadata();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleCreateOrUpdate = async (data: any) => {
    if (editingStudent) {
      await studentsService.update(editingStudent.id, data);
    } else {
      await studentsService.create(data);
    }
    fetchStudents();
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;
    try {
      setDeleteLoading(true);
      await studentsService.delete(studentToDelete.id);
      setDeleteConfirmOpen(false);
      setStudentToDelete(null);
      fetchStudents();
    } finally {
      setDeleteLoading(false);
    }
  };

  const getCourseName = (cId: string) => {
    return courses.find((c) => c.id === cId)?.title || 'General Curriculum';
  };

  const getGroupName = (gId: string) => {
    return groups.find((g) => g.id === gId)?.name || 'Unassigned';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('students.title')}
        description={t('students.desc')}
        actions={
          <Button
            variant="primary"
            leftIcon={<UserPlus className="w-4 h-4" />}
            onClick={() => {
              setEditingStudent(null);
              setModalOpen(true);
            }}
          >
            {t('students.addStudent')}
          </Button>
        }
      />

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder={t('students.searchPlaceholder')}
          className="w-full md:w-80"
        />

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-1">
            <Filter className="w-3.5 h-3.5" /> {t('common.filter')}:
          </div>

          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(1);
            }}
            options={[
              { value: 'ALL', label: t('common.allStatuses') },
              { value: 'ACTIVE', label: t('common.active') },
              { value: 'INACTIVE', label: t('common.inactive') },
              { value: 'GRADUATED', label: t('common.graduated') },
              { value: 'SUSPENDED', label: t('common.suspended') },
            ]}
            className="w-40 text-xs py-1.5"
          />

          <Select
            value={groupFilter}
            onChange={(e) => {
              setGroupFilter(e.target.value);
              setPage(1);
            }}
            options={[
              { value: 'ALL', label: t('students.allCohorts') },
              ...groups.map((g) => ({ value: g.id, label: g.name })),
            ]}
            className="w-44 text-xs py-1.5"
          />

          <Select
            value={courseFilter}
            onChange={(e) => {
              setCourseFilter(e.target.value);
              setPage(1);
            }}
            options={[
              { value: 'ALL', label: t('students.allCourses') },
              ...courses.map((c) => ({ value: c.id, label: c.title })),
            ]}
            className="w-48 text-xs py-1.5"
          />
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <LoadingState message={t('students.loadingStudents')} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchStudents} />
      ) : students.length === 0 ? (
        <EmptyState
          title={t('students.noStudents')}
          description={t('students.noStudentsDesc')}
          actionText={t('common.clearFilters')}
          onAction={() => {
            setSearch('');
            setStatusFilter('ALL');
            setGroupFilter('ALL');
            setCourseFilter('ALL');
            setPage(1);
          }}
        />
      ) : (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('students.studentName')}</TableHead>
                <TableHead>{t('students.courseAndCohort')}</TableHead>
                <TableHead>{t('students.contact')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead>{t('students.enrollmentDate')}</TableHead>
                <TableHead className="text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {student.avatar ? (
                        <img
                          src={student.avatar}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                          {getInitials(`${student.firstName} ${student.lastName}`)}
                        </div>
                      )}
                      <div>
                        <p
                          className="text-xs font-semibold text-slate-900 hover:text-indigo-600 cursor-pointer"
                          onClick={() => navigate(`/admin/students/${student.id}`)}
                        >
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-[11px] text-slate-500">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs font-medium text-slate-800">{getCourseName(student.courseId)}</p>
                    <p className="text-[11px] text-slate-500">{getGroupName(student.groupId)}</p>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">{student.phone}</TableCell>
                  <TableCell>
                    <StatusBadge status={student.status} size="sm" />
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{student.enrollmentDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => navigate(`/admin/students/${student.id}`)}
                        title={t('common.view')}
                      >
                        <Eye className="w-4 h-4 text-slate-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setEditingStudent(student);
                          setModalOpen(true);
                        }}
                        title={t('common.edit')}
                      >
                        <Edit2 className="w-4 h-4 text-slate-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-rose-50 hover:text-rose-600"
                        onClick={() => {
                          setStudentToDelete(student);
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

          {/* Pagination bar */}
          <div className="flex items-center justify-between px-2 pt-2 text-xs text-slate-500">
            <p>
              {t('common.showing')} <span className="font-semibold text-slate-800">{students.length}</span> {t('common.of')}{' '}
              <span className="font-semibold text-slate-800">{totalStudents}</span> {t('common.students')}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
              >
                {t('common.previous')}
              </Button>
              <span className="text-xs font-semibold px-2">
                {t('common.page')} {page} {t('common.of')} {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                {t('common.next')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <StudentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingStudent}
        courses={courses}
        groups={groups}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title={t('students.deleteConfirmTitle')}
        message={t('students.deleteConfirmDesc')}
        confirmText={t('common.delete')}
        isLoading={deleteLoading}
      />
    </div>
  );
};
