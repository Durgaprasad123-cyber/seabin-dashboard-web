import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { Activity, Signal, AlertTriangle } from 'lucide-react';

const StatusCard = ({ status = 'OFFLINE', lastSeen }) => {
  const isOnline = String(status).toUpperCase() === 'ONLINE';

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-glass transition-all hover:shadow-glass-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            isOnline ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
            {isOnline ? <Signal className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Status</h3>
            <p className="text-xs font-semibold text-navy-900">ESP32 Telemetry</p>
          </div>
        </div>

        <StatusBadge status={status} size="lg" />
      </div>

      <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 text-xs text-slate-600 flex items-center gap-2">
        <Activity className={`w-4 h-4 ${isOnline ? 'text-teal-600' : 'text-rose-600'}`} />
        <span>
          {isOnline ? 'Communicating normally' : 'Timeout exceeded threshold'}
        </span>
      </div>
    </div>
  );
};

export default StatusCard;
