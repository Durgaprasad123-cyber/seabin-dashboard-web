import React from 'react';
import { Loader2, Waves } from 'lucide-react';

const Loading = ({ message = 'Loading SeaBin telemetry data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[300px] text-center">
      <div className="relative flex items-center justify-center mb-4">
        <div className="absolute inset-0 bg-teal-200/60 rounded-full blur-xl animate-pulse"></div>
        <div className="p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 relative z-10 shadow-glass">
          <Waves className="w-8 h-8 text-teal-600 animate-bounce" />
        </div>
      </div>
      <div className="flex items-center gap-2 text-navy-900 font-medium text-sm">
        <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Loading;
