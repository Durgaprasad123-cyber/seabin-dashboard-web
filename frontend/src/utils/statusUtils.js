/**
 * Utility functions for levels, status badges, and color themes (SEA GUARDIANS Theme)
 */

/**
 * Returns color classes based on level (trash or water) percentage
 * 0–49%   -> Sea Guardians Turquoise/Teal
 * 50–79%  -> Soft Amber / Orange
 * 80–100% -> Soft Rose Red
 */
export const getLevelColorClass = (level = 0) => {
  const num = Number(level) || 0;

  if (num >= 80) {
    return {
      bar: 'bg-gradient-to-r from-rose-500 to-red-600',
      text: 'text-rose-700',
      bgLight: 'bg-rose-50',
      border: 'border-rose-200',
      badge: 'bg-rose-100/80 text-rose-800 border-rose-200',
      label: 'Critical',
      iconColor: 'text-rose-600',
    };
  }

  if (num >= 50) {
    return {
      bar: 'bg-gradient-to-r from-amber-400 to-orange-500',
      text: 'text-amber-700',
      bgLight: 'bg-amber-50',
      border: 'border-amber-200',
      badge: 'bg-amber-100/80 text-amber-800 border-amber-200',
      label: 'Warning',
      iconColor: 'text-amber-600',
    };
  }

  return {
    bar: 'bg-gradient-to-r from-teal-500 to-ocean-600',
    text: 'text-teal-700',
    bgLight: 'bg-teal-50',
    border: 'border-teal-200',
    badge: 'bg-teal-100/90 text-teal-800 border-teal-200',
    label: 'Normal',
    iconColor: 'text-teal-600',
  };
};

/**
 * Returns badge styling props for ONLINE vs OFFLINE status
 */
export const getStatusBadgeProps = (status = 'OFFLINE') => {
  const isOnline = String(status).toUpperCase() === 'ONLINE';

  if (isOnline) {
    return {
      label: 'ONLINE',
      bgClass: 'bg-teal-50/90 text-teal-800 border border-teal-200',
      dotClass: 'bg-teal-500 pulse-teal',
    };
  }

  return {
    label: 'OFFLINE',
    bgClass: 'bg-rose-50/90 text-rose-800 border border-rose-200',
    dotClass: 'bg-rose-500',
  };
};
