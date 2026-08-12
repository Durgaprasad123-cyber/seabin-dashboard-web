import React, { useState } from 'react';
import { useDevices } from '../hooks/useDevices';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import DeviceGrid from '../components/devices/DeviceGrid';
import { Search, Cpu, RefreshCw } from 'lucide-react';

const Devices = () => {
  const { devices, loading, error, refetch } = useDevices(15000);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  if (loading && devices.length === 0) {
    return <Loading message="Loading registered SeaBins..." />;
  }

  if (error && devices.length === 0) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  // Filter devices dynamically based on search term & status
  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.locationName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ONLINE' && device.status === 'ONLINE') ||
      (statusFilter === 'OFFLINE' && device.status !== 'ONLINE');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-glass">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-teal-600" />
            <h1 className="text-2xl font-black text-navy-900 tracking-tight">Devices Directory</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Monitor and manage all deployed SeaBins ({filteredDevices.length} of {devices.length} active)
          </p>
        </div>
        <button
          onClick={refetch}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Controls: Search Bar & Filter Buttons */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Device ID, City, or Site Name..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-slate-200/80 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all shadow-xs"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 p-1 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-xs">
          {['ALL', 'ONLINE', 'OFFLINE'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === filter
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100/70'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Devices Grid */}
      {filteredDevices.length === 0 ? (
        <EmptyState
          title={devices.length === 0 ? 'No SeaBin Devices Registered' : 'No Devices Match Filters'}
          description={
            devices.length === 0
              ? 'ESP32 devices automatically register when sending telemetry data.'
              : 'Try adjusting your search keywords or status filter.'
          }
          onRetry={refetch}
        />
      ) : (
        <DeviceGrid devices={filteredDevices} />
      )}
    </div>
  );
};

export default Devices;
