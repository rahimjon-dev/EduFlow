import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  onRetry,
}) => {
  const { t } = useTranslation();
  const eTitle = title || t('common.noData');
  const eMessage = message || '';

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-rose-50/50 rounded-xl border border-rose-200/80">
      <div className="h-12 w-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h4 className="text-base font-semibold text-slate-900 mb-1">{eTitle}</h4>
      {eMessage && <p className="text-xs text-rose-700/80 max-w-sm mb-5 leading-relaxed">{eMessage}</p>}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RefreshCw className="h-4 w-4" />}>
          {t('common.retry')}
        </Button>
      )}
    </div>
  );
};
