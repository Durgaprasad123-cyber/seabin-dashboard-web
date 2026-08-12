import React from 'react';
import { Building2, Cpu, Signal, AlertTriangle } from 'lucide-react';

const LocationCard = ({ locationStats }) => {
  if (!locationStats) return null;

  const {
    city = 'Unknown City',
    totalDevices = 0,
    onlineDevices = 0,
    offlineDevices = 0,
  } = locationStats;

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-glass flex flex-col justify-between hover:border-teal-300 transition-all hover:shadow-glass-md">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-200 text-teal-700">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-navy-900">{city}</h3>
              <span className="text-xs text-slate-500 font-medium">Deployment Hub</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full border border-slate-200/80 text-xs font-semibold text-slate-700">
            <Cpu className="w-3.5 h-3.5 text-teal-600" />
            <span>{totalDevices} {totalDevices === 1 ? 'SeaBin' : 'SeaBins'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 bg-teal-50/80 border border-teal-200/80 rounded-xl flex items-center gap-3">
            <Signal className="w-4 h-4 text-teal-700 shrink-0" />
            <div>
              <span className="text-[11px] text-teal-800 font-semibold block uppercase tracking-wider">Online</span>
              <span className="text-lg font-black text-teal-950">{onlineDevices}</span>
            </div>
          </div>

          <div className="p-3 bg-rose-50/80 border border-rose-200/80 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
            <div>
              <span className="text-[11px] text-rose-800 font-semibold block uppercase tracking-wider">Offline</span>
              <span className="text-lg font-black text-rose-950">{offlineDevices}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
