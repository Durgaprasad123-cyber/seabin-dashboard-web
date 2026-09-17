import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import BinFullAlertModal from '../common/BinFullAlertModal';
import { useDevices } from '../../hooks/useDevices';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Real-time telemetry device monitoring for alerts across the application
  const { devices } = useDevices(15000);
  const [dismissedDeviceIds, setDismissedDeviceIds] = useState([]);
  const [showAlertModal, setShowAlertModal] = useState(false);

  // Identify all devices that currently meet or exceed the FULL threshold (≥ 80%)
  const fullDevices = devices.filter(
    (device) => (device.latestReading?.trashLevel ?? 0) >= 80
  );

  useEffect(() => {
    if (fullDevices.length === 0) {
      // If no devices are full, reset dismissal list and close modal
      setDismissedDeviceIds([]);
      setShowAlertModal(false);
      return;
    }

    const currentFullDeviceIds = fullDevices.map((d) => d.deviceId);

    // Reset dismissal memory for devices that are no longer full
    setDismissedDeviceIds((prev) => prev.filter((id) => currentFullDeviceIds.includes(id)));

    // Check if there are any full devices that have not been dismissed yet
    const hasUndismissedFullDevice = fullDevices.some(
      (device) => !dismissedDeviceIds.includes(device.deviceId)
    );

    if (hasUndismissedFullDevice) {
      setShowAlertModal(true);
    }
  }, [devices]);

  const handleDismissAlert = () => {
    // Add all currently full devices to the dismissed list
    const currentlyFullIds = fullDevices.map((d) => d.deviceId);
    setDismissedDeviceIds((prev) => Array.from(new Set([...prev, ...currentlyFullIds])));
    setShowAlertModal(false);
  };

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

      {/* Bin Full Alert Popup Modal */}
      {showAlertModal && fullDevices.length > 0 && (
        <BinFullAlertModal
          fullDevices={fullDevices}
          onDismiss={handleDismissAlert}
          onClose={handleDismissAlert}
        />
      )}
    </div>
  );
};

export default Layout;

