import React from 'react';
import { Menu, Waves, Radio } from 'lucide-react';

const Navbar = ({ onOpenSidebar, title = 'Dashboard' }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/75 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 shadow-xs">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="p-2 text-slate-500 hover:text-navy-900 rounded-xl hover:bg-slate-100 lg:hidden transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white/80 backdrop-blur-md p-1.5 px-2 rounded-xl border border-slate-200/80 shadow-xs hidden sm:flex items-center justify-center">
              <img
                src="/logo.svg"
                alt="SeaGuardians Logo"
                className="h-6 w-auto object-contain"
                style={{ filter: 'none', opacity: 1 }}
              />
            </div>
            <h2 className="text-lg font-extrabold text-navy-900 tracking-tight">{title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50/90 border border-teal-200 text-xs font-semibold text-teal-800 shadow-xs">
            <Radio className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
            <span>Live Telemetry Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
