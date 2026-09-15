import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../../i18n';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchInput } from '../../components/common/SearchInput';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { gradesService } from '../../services/grades.service';
import type { Grade } from '../../types';

export const GradesPage: React.FC = () => {
  const { t } = useTranslation();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchGrades = useCallback(async () => {
    try {
      setLoading(true);
      const data = await gradesService.getAll();
      setGrades(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  const filtered = grades.filter((g) => {
    const q = search.toLowerCase();
    return (
      g.studentName.toLowerCase().includes(q) ||
      g.courseTitle.toLowerCase().includes(q) ||
      g.examTitle.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('grades.title')}
        description={t('grades.desc')}
      />

      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-soft flex items-center justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t('grades.searchPlaceholder')}
          className="w-full sm:w-80"
        />
        <span className="text-xs text-slate-500 hidden sm:inline">
          {t('grades.recorded')}: <strong className="text-slate-800">{filtered.length}</strong> {t('grades.gradesCount')}
        </span>
      </div>

      {loading ? (
        <LoadingState message={t('grades.loadingGrades')} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={t('grades.noGrades')}
          description={t('grades.noGradesDesc')}
          actionText={t('common.clearFilters')}
          onAction={() => setSearch('')}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('students.studentName')}</TableHead>
              <TableHead>{t('grades.courseSubject')}</TableHead>
              <TableHead>{t('grades.examEvaluation')}</TableHead>
              <TableHead>{t('grades.numericScore')}</TableHead>
              <TableHead>{t('grades.percentage')}</TableHead>
              <TableHead>{t('grades.grade')}</TableHead>
              <TableHead>{t('grades.facultyFeedback')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((g) => (
              <TableRow key={g.id}>
                <TableCell>
                  <p className="text-xs font-semibold text-slate-900">{g.studentName}</p>
                  <p className="text-[11px] text-slate-400">ID: {g.studentId}</p>
                </TableCell>
                <TableCell className="text-xs text-slate-700">{g.courseTitle}</TableCell>
                <TableCell className="text-xs font-medium text-slate-800">{g.examTitle}</TableCell>
                <TableCell className="text-xs font-semibold text-slate-900">
                  {g.score} / {g.maxScore}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${Math.min(g.percentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-800">{g.percentage}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {g.letterGrade}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-slate-500 max-w-xs truncate">
                  {g.feedback || 'Good work.'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
