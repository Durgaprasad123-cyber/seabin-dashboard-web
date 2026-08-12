import React from 'react';
import { useDevices } from '../hooks/useDevices';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import DeviceCard from '../components/devices/DeviceCard';
import DeviceGrid from '../components/devices/DeviceGrid';
import { Cpu, Signal, AlertTriangle, Flame, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const { devices, loading, error, refetch } = useDevices(15000);

  if (loading && devices.length === 0) {
    return <Loading message="Connecting to SEA GUARDIANS Telemetry Network..." />;
  }

  if (error && devices.length === 0) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  // Calculate summary metrics dynamically
  const totalDevices = devices.length;
  const onlineDevices = devices.filter((d) => d.status === 'ONLINE').length;
  const offlineDevices = devices.filter((d) => d.status !== 'ONLINE').length;
  const criticalDevices = devices.filter(
    (d) => (d.latestReading?.trashLevel ?? 0) >= 80 || (d.latestReading?.innerBinWaterLevel ?? 0) >= 80
  );

  const recentlyActiveDevices = [...devices]
    .sort((a, b) => new Date(b.lastSeen || 0) - new Date(a.lastSeen || 0))
    .slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-glass">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">System Overview</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Real-time telemetry and capacity alerts for deployed SeaBins</p>
        </div>
        <button
          onClick={refetch}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Glass KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Devices */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 shadow-glass flex items-center justify-between transition-all hover:shadow-glass-md">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Devices</span>
            <span className="text-3xl font-black text-navy-900 tracking-tight mt-1 block">
              {totalDevices < 10 ? `0${totalDevices}` : totalDevices}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 mt-1 block">Active SeaBins</span>
          </div>
          <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200/80 text-teal-600">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        {/* Online Devices */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 shadow-glass flex items-center justify-between transition-all hover:shadow-glass-md">
          <div>
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">Online</span>
            <span className="text-3xl font-black text-teal-900 tracking-tight mt-1 block">
              {onlineDevices < 10 ? `0${onlineDevices}` : onlineDevices}
            </span>
            <span className="text-[11px] font-semibold text-teal-600 mt-1 block">Communicating</span>
          </div>
          <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200/80 text-teal-600">
            <Signal className="w-6 h-6" />
          </div>
        </div>

        {/* Offline Devices */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 shadow-glass flex items-center justify-between transition-all hover:shadow-glass-md">
          <div>
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">Offline</span>
            <span className="text-3xl font-black text-rose-800 tracking-tight mt-1 block">
              {offlineDevices < 10 ? `0${offlineDevices}` : offlineDevices}
            </span>
            <span className="text-[11px] font-semibold text-rose-600 mt-1 block">Timeout Exceeded</span>
          </div>
          <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200/80 text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Critical Devices */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 shadow-glass flex items-center justify-between transition-all hover:shadow-glass-md">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Critical (≥80%)</span>
            <span className="text-3xl font-black text-amber-800 tracking-tight mt-1 block">
              {criticalDevices.length < 10 ? `0${criticalDevices.length}` : criticalDevices.length}
            </span>
            <span className="text-[11px] font-semibold text-amber-600 mt-1 block">High Capacity</span>
          </div>
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 text-amber-600">
            <Flame className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Critical Alerts Section (if any exist) */}
      {criticalDevices.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-rose-700">
            <Flame className="w-5 h-5" />
            <h2 className="text-base font-extrabold text-navy-900">Critical Capacity Alerts</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {criticalDevices.map((device) => (
              <DeviceCard key={device.deviceId || device.id} device={device} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Active Devices Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-navy-900">Recently Active SeaBins</h2>
          <span className="text-xs font-semibold text-slate-500">Auto-polling 15s</span>
        </div>

        {totalDevices === 0 ? (
          <EmptyState
            title="No SeaBin Devices Registered"
            description="Send telemetry from an ESP32 device to test automatic registration!"
            onRetry={refetch}
          />
        ) : (
          <DeviceGrid devices={recentlyActiveDevices} />
        )}
      </section>
    </div>
  );
};

export default Dashboard;
