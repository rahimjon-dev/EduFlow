import React from 'react';
import { Badge, type BadgeProps } from '../ui/Badge';
import { useTranslation } from '../../i18n';

export interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, size = 'md' }) => {
  const { t } = useTranslation();
  const normalized = status.toUpperCase();

  let variant: BadgeProps['variant'] = 'neutral';

  switch (normalized) {
    case 'ACTIVE':
    case 'PRESENT':
    case 'PAID':
    case 'COMPLETED':
    case 'GRADED':
    case 'CLEARED':
      variant = 'success';
      break;

    case 'PENDING':
    case 'LATE':
    case 'UPCOMING':
    case 'ONGOING':
      variant = 'warning';
      break;

    case 'ABSENT':
    case 'OVERDUE':
    case 'SUSPENDED':
    case 'CANCELLED':
    case 'FAIL':
      variant = 'danger';
      break;

    case 'SICK':
    case 'ON_LEAVE':
    case 'SUBMITTED':
      variant = 'info';
      break;

    case 'GRADUATED':
      variant = 'purple';
      break;

    case 'INACTIVE':
    case 'ARCHIVED':
    default:
      variant = 'neutral';
      break;
  }

  const getTranslatedText = (raw: string) => {
    const keyMap: Record<string, string> = {
      ACTIVE: 'common.active',
      INACTIVE: 'common.inactive',
      GRADUATED: 'common.graduated',
      SUSPENDED: 'common.suspended',
      PRESENT: 'common.present',
      ABSENT: 'common.absent',
      LATE: 'common.late',
      SICK: 'common.sick',
      PAID: 'common.paid',
      PENDING: 'common.pending',
      OVERDUE: 'common.overdue',
      COMPLETED: 'common.completed',
      UPCOMING: 'common.upcoming',
      ARCHIVED: 'common.archived',
      CLEARED: 'common.cleared',
      GRADED: 'common.graded',
      SUBMITTED: 'common.submitted',
      ON_LEAVE: 'common.onLeave',
      CANCELLED: 'common.cancelled',
      FAIL: 'common.fail',
      ONGOING: 'common.ongoing',
    };

    const translationKey = keyMap[normalized];
    if (translationKey) {
      const translated = t(translationKey);
      if (translated && !translated.startsWith('common.')) {
        return translated;
      }
    }

    return raw.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <Badge variant={variant} size={size} dot className={className}>
      {getTranslatedText(status)}
    </Badge>
  );
};
