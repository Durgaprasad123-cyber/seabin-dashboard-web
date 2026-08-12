import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Cpu, MapPin, Shield, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Devices', path: '/dashboard/devices', icon: Cpu },
    { name: 'Locations', path: '/dashboard/locations', icon: MapPin },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-navy-950/20 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white/75 backdrop-blur-md border-r border-slate-200/80 z-50 flex flex-col transition-transform duration-300 ease-in-out shadow-glass ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* SEA GUARDIANS Branding Header */}
        <div className="p-4 px-5 border-b border-slate-200/70 flex items-center justify-between min-h-[72px]">
          <div className="bg-white/80 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-center">
            <img
              src="/logo.svg"
              alt="SeaGuardians Logo"
              className="h-9 w-auto object-contain"
              style={{ filter: 'none', opacity: 1 }}
            />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-navy-900 rounded-lg hover:bg-slate-100 lg:hidden shrink-0 ml-2"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <p className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Navigation</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-teal-50/90 text-teal-950 font-bold border border-teal-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-navy-900 hover:bg-white/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Info Card */}
        <div className="p-4 m-4 rounded-xl bg-teal-50/80 border border-teal-200/70 text-xs text-slate-700">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2 h-2 rounded-full bg-teal-500 pulse-teal" />
            <span className="font-bold text-navy-900">SeaBin IoT Fleet</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Real-time automated ocean debris telemetry network.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
