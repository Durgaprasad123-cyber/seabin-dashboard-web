import React from 'react';
import { getPumpStateBadgeProps } from '../../utils/statusUtils';
import { Zap, Activity } from 'lucide-react';

const PumpStateCard = ({ pumpState }) => {
  const info = getPumpStateBadgeProps(pumpState);

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-glass transition-all hover:shadow-glass-md flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${info.bgClass}`}>
            <Zap className={`w-5 h-5 ${info.iconColor}`} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pump State</h3>
            <p className="text-xs font-semibold text-navy-900">Operational Mode</p>
          </div>
        </div>
      </div>

      <div className="my-2">
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-extrabold text-sm border ${info.badgeClass}`}>
          <span className={`w-2 h-2 rounded-full ${info.dotClass}`} />
          {info.label}
        </span>
      </div>

      <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 text-xs text-slate-600 flex items-center gap-2">
        <Activity className={`w-4 h-4 ${info.iconColor}`} />
        <span className="truncate">
          {pumpState === 'COLLECTION'
            ? 'Active waste & debris suction'
            : pumpState === 'DRAINAGE'
            ? 'Releasing filtered bin water'
            : 'No pump telemetry reported'}
        </span>
      </div>
    </div>
  );
};

export default PumpStateCard;
