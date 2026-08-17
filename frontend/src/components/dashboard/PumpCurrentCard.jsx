import React from 'react';
import { Gauge } from 'lucide-react';
import { formatCurrent } from '../../utils/formatUtils';

const PumpCurrentCard = ({ label = 'Pump Current', value, subtext = 'Motor Current' }) => {
  const formattedValue = formatCurrent(value);
  const isAvailable = value !== null && value !== undefined && value !== '' && !isNaN(Number(value));

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-glass transition-all hover:shadow-glass-md flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700">
          <Gauge className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</h3>
          <p className="text-xs font-semibold text-navy-900">{subtext}</p>
        </div>
      </div>

      <div className="text-right">
        <span className={`text-2xl sm:text-3xl font-black tracking-tight ${isAvailable ? 'text-navy-900 font-mono' : 'text-slate-400'}`}>
          {formattedValue}
        </span>
      </div>
    </div>
  );
};

export default PumpCurrentCard;
