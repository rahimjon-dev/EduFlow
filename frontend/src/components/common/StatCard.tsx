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
    indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    sky: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  const isPositive = change !== undefined && change >= 0;

  return (
    <Card hover className="p-5 sm:p-6 relative">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <div className={cn('p-2.5 rounded-xl border flex items-center justify-center', colorMap[iconColor])}>
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{value}</span>
      </div>

      {(change !== undefined || description) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {change !== undefined && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded-md',
                isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              )}
            >
              {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {Math.abs(change)}%
            </span>
          )}
          <span className="text-slate-400">{description || changeLabel}</span>
        </div>
      )}
    </Card>
  );
};
