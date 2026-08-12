import React from 'react';
import { getStatusBadgeProps } from '../../utils/statusUtils';

const StatusBadge = ({ status = 'OFFLINE', showDot = true, size = 'md' }) => {
  const badge = getStatusBadgeProps(status);

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs font-semibold'
    : size === 'lg'
    ? 'px-3 py-1 text-xs font-bold'
    : 'px-2.5 py-1 text-xs font-semibold';

  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-2 h-2' : 'w-2 h-2';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${badge.bgClass} ${sizeClasses} shadow-sm backdrop-blur-sm`}>
      {showDot && (
        <span className={`rounded-full ${badge.dotClass} ${dotSize}`} />
      )}
      <span>{badge.label}</span>
    </span>
  );
};

export default StatusBadge;
