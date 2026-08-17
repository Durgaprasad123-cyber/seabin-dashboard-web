import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import ProgressBar from '../common/ProgressBar';
import { formatRelativeTime } from '../../utils/formatUtils';
import { getPumpStateBadgeProps } from '../../utils/statusUtils';
import { MapPin, ArrowRight, Trash2, Droplets } from 'lucide-react';

const DeviceCard = ({ device }) => {
  const navigate = useNavigate();

  if (!device) return null;

  const {
    deviceId = 'SEABIN-000',
    city = 'Unknown City',
    locationName = 'Unspecified Location',
    status = 'OFFLINE',
    lastSeen,
    latestReading = {},
  } = device;

  const trashLevel = latestReading?.trashLevel ?? 0;
  const waterLevel = latestReading?.innerBinWaterLevel ?? 0;
  const pumpState = latestReading?.pumpState ?? null;
  const pumpInfo = getPumpStateBadgeProps(pumpState);

  const handleCardClick = () => {
    navigate(`/dashboard/device/${deviceId}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white/80 hover:bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 hover:border-teal-400 shadow-glass transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-glass-md hover:-translate-y-0.5"
    >
      <div>
        {/* Header: Device ID & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-mono font-extrabold text-base text-navy-900 group-hover:text-teal-700 transition-colors">
            {deviceId}
          </span>
          <StatusBadge status={status} size="sm" />
        </div>

        {/* Location Info */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
          <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span className="truncate">{locationName}, <strong className="text-slate-800 font-semibold">{city}</strong></span>
        </div>

        {/* Progress Bars Container */}
        <div className="space-y-3 mb-4 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-[11px] font-medium text-slate-500">
              <Trash2 className="w-3 h-3 text-slate-400" />
              <span>Trash Level</span>
            </div>
            <ProgressBar value={trashLevel} size="sm" />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1 text-[11px] font-medium text-slate-500">
              <Droplets className="w-3 h-3 text-slate-400" />
              <span>Water Level</span>
            </div>
            <ProgressBar value={waterLevel} size="sm" />
          </div>

          {pumpState && (
            <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Pump Mode</span>
              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${pumpInfo.badgeClass}`}>
                {pumpInfo.shortLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Updated {formatRelativeTime(lastSeen)}</span>
        <span className="inline-flex items-center gap-1 font-bold text-teal-700 group-hover:translate-x-1 transition-transform">
          View Device <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};

export default DeviceCard;
