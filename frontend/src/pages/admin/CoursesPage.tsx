import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Edit2, Trash2, Clock, Users, LayoutGrid, List } from 'lucide-react';
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
import { CourseModal } from '../../features/courses/CourseModal';
import { coursesService } from '../../services/courses.service';
import { teachersService } from '../../services/teachers.service';
import type { Course, CourseStatus, Teacher } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useTranslation } from '../../i18n';

export const CoursesPage: React.FC = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CourseStatus | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await coursesService.getAll({
        search: search || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
      });
      setCourses(data);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, categoryFilter]);

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const tList = await teachersService.getAll();
        setTeachers(tList);
      } catch (e) {
        console.error(e);
      }
    };
    loadTeachers();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSave = async (data: any) => {
    if (editingCourse) {
      await coursesService.update(editingCourse.id, data);
    } else {
      await coursesService.create(data);
    }
    fetchCourses();
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;
    try {
      setDeleteLoading(true);
      await coursesService.delete(courseToDelete.id);
      setDeleteConfirmOpen(false);
      setCourseToDelete(null);
      fetchCourses();
    } finally {
      setDeleteLoading(false);
    }
  };

  const getTeacherName = (tId: string) => {
    const tMember = teachers.find((tch) => tch.id === tId);
    return tMember ? `${tMember.firstName} ${tMember.lastName}` : t('courses.instructor');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('courses.title')}
        description={t('courses.desc')}
        actions={
          <Button
            variant="primary"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            onClick={() => {
              setEditingCourse(null);
              setModalOpen(true);
            }}
          >
            {t('courses.addCourse')}
          </Button>
        }
      />

      {/* Filter and View Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t('courses.searchPlaceholder')}
          className="w-full md:w-80"
        />

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            options={[
              { value: 'ALL', label: t('common.allStatuses') },
              { value: 'ACTIVE', label: t('common.active') },
              { value: 'UPCOMING', label: t('common.upcoming') },
              { value: 'ARCHIVED', label: t('common.archived') },
            ]}
            className="w-40 text-xs py-1.5"
          />

          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'ALL', label: t('courses.allCategories') },
              { value: 'Software Engineering', label: 'Software Engineering' },
              { value: 'Data & AI', label: 'Data & AI' },
              { value: 'Computer Science', label: 'Computer Science' },
              { value: 'Design', label: 'Design' },
              { value: 'Cloud & DevOps', label: 'Cloud & DevOps' },
              { value: 'Mobile Development', label: 'Mobile' },
            ]}
            className="w-44 text-xs py-1.5"
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
        <LoadingState message={t('courses.loadingCourses')} />
      ) : courses.length === 0 ? (
        <EmptyState
          title={t('courses.noCourses')}
          description={t('courses.noCoursesDesc')}
          actionText={t('common.clearFilters')}
          onAction={() => {
            setSearch('');
            setStatusFilter('ALL');
            setCategoryFilter('ALL');
          }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} hover className="flex flex-col justify-between overflow-hidden">
              {/* Course Thumbnail */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-3 right-3">
                  <StatusBadge status={course.status} size="sm" />
                </div>
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                  {course.category}
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-base line-clamp-1">{course.title}</CardTitle>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                  {course.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-3 pt-0 text-xs">
                <div className="flex items-center justify-between text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                    {formatCurrency(course.price)}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span>{t('courses.instructor')}: <strong className="text-slate-700">{getTeacherName(course.teacherId)}</strong></span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {course.enrolledStudentsCount || 0} / {course.maxStudents || 30}
                  </span>
                </div>
              </CardContent>

              <div className="px-5 py-3 bg-white/5 border-t border-white/10 flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setEditingCourse(course);
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
                    setCourseToDelete(course);
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
              <TableHead>{t('courses.courseTitle')}</TableHead>
              <TableHead>{t('courses.category')}</TableHead>
              <TableHead>{t('courses.duration')}</TableHead>
              <TableHead>{t('courses.tuition')}</TableHead>
              <TableHead>{t('courses.instructor')}</TableHead>
              <TableHead>{t('common.students')}</TableHead>
              <TableHead>{t('common.status')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{course.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{course.description}</p>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-slate-600">{course.category}</TableCell>
                <TableCell className="text-xs text-slate-600">{course.duration}</TableCell>
                <TableCell className="text-xs font-bold text-slate-900">{formatCurrency(course.price)}</TableCell>
                <TableCell className="text-xs text-slate-700">{getTeacherName(course.teacherId)}</TableCell>
                <TableCell className="text-xs text-slate-600">
                  {course.enrolledStudentsCount || 0} / {course.maxStudents || 30}
                </TableCell>
                <TableCell>
                  <StatusBadge status={course.status} size="sm" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingCourse(course);
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
                        setCourseToDelete(course);
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

      <CourseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        initialData={editingCourse}
        teachers={teachers}
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title={t('courses.deleteConfirmTitle')}
        message={t('courses.deleteConfirmDesc')}
        confirmText={t('common.delete')}
        isLoading={deleteLoading}
      />
    </div>
  );
};
