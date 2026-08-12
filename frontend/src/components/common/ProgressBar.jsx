import React from 'react';
import { getLevelColorClass } from '../../utils/statusUtils';

const ProgressBar = ({ value = 0, label, showPercentage = true, size = 'md' }) => {
  const percentage = Math.min(100, Math.max(0, Number(value) || 0));
  const styleInfo = getLevelColorClass(percentage);

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2.5';

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-medium">
          {label && <span className="text-navy-900 font-semibold">{label}</span>}
          {showPercentage && (
            <span className={`font-bold ${styleInfo.text}`}>
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-200/80 rounded-full overflow-hidden ${heightClass} border border-slate-300/40 p-0.5 shadow-inner`}>
        <div
          className={`${styleInfo.bar} ${heightClass} rounded-full transition-all duration-700 ease-out shadow-sm`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
