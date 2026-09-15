import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Card } from '../ui/Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number; // e.g. 12.5 for +12.5%, -3.2 for -3.2%
  changeLabel?: string;
  icon: React.ReactNode;
  iconColor?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'purple';
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel = 'vs last month',
  icon,
  iconColor = 'indigo',
  description,
}) => {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    sky: 'bg-sky-50 text-sky-600 border-sky-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  const isPositive = change !== undefined && change >= 0;

  return (
    <Card hover className="p-5 sm:p-6 relative">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        <div className={cn('p-2.5 rounded-xl border flex items-center justify-center', colorMap[iconColor])}>
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{value}</span>
      </div>

      {(change !== undefined || description) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {change !== undefined && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded-md',
                isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              )}
            >
              {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {Math.abs(change)}%
            </span>
          )}
          <span className="text-slate-500">{description || changeLabel}</span>
        </div>
      )}
    </Card>
  );
};
