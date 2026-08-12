import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/') return 'SEA GUARDIANS Overview';
    if (path.startsWith('/dashboard/device/')) return 'SeaBin Device Details';
    if (path === '/dashboard/devices') return 'SeaBin Devices Directory';
    if (path === '/dashboard/locations') return 'Locations & Cities';
    return 'SEA GUARDIANS Monitoring System';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5FAFB] via-[#EDF6F8] to-[#F0FAF9] text-slate-800 flex">
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} title={getPageTitle()} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
