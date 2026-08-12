import React from 'react';
import { MapPin } from 'lucide-react';

const LocationCard = ({ city = 'Unknown City', locationName = 'Unspecified Location', latitude = 0, longitude = 0 }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-glass transition-all hover:shadow-glass-md">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location Details</h3>
          <p className="text-xs font-semibold text-navy-900">Geographic Deployment</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">Site Name</span>
          <p className="text-base font-bold text-navy-900">{locationName}</p>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">City</span>
          <p className="text-sm font-bold text-teal-700">{city}</p>
        </div>

        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Latitude</span>
            <span className="font-mono font-semibold text-slate-800">{Number(latitude).toFixed(4)}</span>
          </div>
          <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Longitude</span>
            <span className="font-mono font-semibold text-slate-800">{Number(longitude).toFixed(4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
