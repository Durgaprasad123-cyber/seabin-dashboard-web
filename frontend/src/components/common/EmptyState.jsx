import React from 'react';
import { Waves, RefreshCw } from 'lucide-react';

const EmptyState = ({
  title = 'No SeaBin devices found',
  description = 'No active telemetry data has been received yet.',
  onRetry = null,
  actionLabel = 'Refresh Data',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white/75 backdrop-blur-md rounded-2xl border border-slate-200/80 my-4 shadow-glass">
      <div className="p-4 bg-teal-50 rounded-full border border-teal-200 text-teal-600 mb-4 shadow-inner">
        <Waves className="w-10 h-10" />
      </div>
      <h3 className="text-lg font-bold text-navy-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
