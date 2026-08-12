import React from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import { formatRelativeTime, formatDateTime } from '../../utils/formatUtils';

const LastUpdated = ({ timestamp, onRefresh, isRefreshing = false }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-glass flex items-center justify-between transition-all hover:shadow-glass-md">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Last Updated</h3>
          <p className="text-base font-extrabold text-navy-900">{formatRelativeTime(timestamp)}</p>
          <span className="text-[11px] text-slate-400 font-medium block">{formatDateTime(timestamp)}</span>
        </div>
      </div>

      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200/80 active:scale-95 disabled:opacity-50"
          title="Refresh Telemetry"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`} />
        </button>
      )}
    </div>
  );
};

export default LastUpdated;
