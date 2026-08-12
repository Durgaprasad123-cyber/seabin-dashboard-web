import React from 'react';
import ProgressBar from '../common/ProgressBar';
import { Trash2, Droplets } from 'lucide-react';
import { getLevelColorClass } from '../../utils/statusUtils';

const LevelCard = ({ type = 'trash', level = 0, title }) => {
  const isTrash = type === 'trash';
  const displayTitle = title || (isTrash ? 'Trash Level' : 'Inner Bin Water Level');
  const Icon = isTrash ? Trash2 : Droplets;
  const styleInfo = getLevelColorClass(level);

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-glass relative overflow-hidden transition-all hover:shadow-glass-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${styleInfo.bgLight} ${styleInfo.border} border`}>
            <Icon className={`w-5 h-5 ${styleInfo.iconColor}`} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{displayTitle}</h3>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${styleInfo.badge}`}>
              {styleInfo.label}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className={`text-3xl font-black tracking-tight ${styleInfo.text}`}>
            {level}%
          </span>
        </div>
      </div>

      <ProgressBar value={level} showPercentage={false} size="lg" />

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
        <span>Capacity Threshold</span>
        <span className="font-semibold text-navy-900">{level >= 80 ? 'Requires Action' : level >= 50 ? 'Moderate' : 'Optimal'}</span>
      </div>
    </div>
  );
};

export default LevelCard;
