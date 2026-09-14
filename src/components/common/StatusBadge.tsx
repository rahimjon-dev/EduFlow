import React from 'react';
import { Badge, type BadgeProps } from '../ui/Badge';

export interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, size = 'md' }) => {
  const normalized = status.toUpperCase();

  let variant: BadgeProps['variant'] = 'neutral';

  switch (normalized) {
    case 'ACTIVE':
    case 'PRESENT':
    case 'PAID':
    case 'COMPLETED':
    case 'GRADED':
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

  const formatText = (text: string) => {
    return text.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <Badge variant={variant} size={size} dot className={className}>
      {formatText(status)}
    </Badge>
  );
};
