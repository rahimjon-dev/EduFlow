import React from 'react';
import { Inbox } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
}) => {
  const { t } = useTranslation();
  const tTitle = title || t('common.noData');
  const tDesc = description || '';

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
      <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        {icon || <Inbox className="h-6 w-6" />}
      </div>
      <h4 className="text-base font-semibold text-slate-900 mb-1">{tTitle}</h4>
      {tDesc && <p className="text-xs text-slate-500 max-w-sm mb-5 leading-relaxed">{tDesc}</p>}
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
