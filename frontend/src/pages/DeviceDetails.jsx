import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchDeviceById, fetchDeviceReadings } from '../services/deviceService';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import LevelCard from '../components/dashboard/LevelCard';
import StatusCard from '../components/dashboard/StatusCard';
import LocationCard from '../components/dashboard/LocationCard';
import LastUpdated from '../components/dashboard/LastUpdated';
import StatusBadge from '../components/common/StatusBadge';
import { formatDateTime } from '../utils/formatUtils';
import { ArrowLeft, History, Cpu, MapPin, RefreshCw } from 'lucide-react';

const DeviceDetails = () => {
  const { deviceId } = useParams();
  const navigate = useNavigate();

  const [device, setDevice] = useState(null);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [deviceData, readingsData] = await Promise.all([
        fetchDeviceById(deviceId),
        fetchDeviceReadings(deviceId, 30),
      ]);
      setDevice(deviceData);
      setReadings(readingsData || []);
    } catch (err) {
      console.error(`Error loading details for ${deviceId}:`, err);
      setError(err.message || 'Failed to load device details');
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading && !device) {
    return <Loading message={`Fetching telemetry for ${deviceId}...`} />;
  }

  if (error && !device) {
    return <ErrorMessage message={error} onRetry={loadData} />;
  }

  if (!device) {
    return (
      <div className="space-y-4">
        <Link to="/dashboard/devices" className="inline-flex items-center gap-2 text-xs font-bold text-teal-700">
          <ArrowLeft className="w-4 h-4" /> Back to Devices Directory
        </Link>
        <ErrorMessage message={`SeaBin device ${deviceId} not found.`} />
      </div>
    );
  }

  const {
    city = 'Unknown City',
    locationName = 'Unspecified Location',
    latitude = 0,
    longitude = 0,
    status = 'OFFLINE',
    lastSeen,
    latestReading = {},
  } = device;

  const trashLevel = latestReading?.trashLevel ?? 0;
  const waterLevel = latestReading?.innerBinWaterLevel ?? 0;

  return (
    <div className="space-y-8">
      {/* Top Header Navigation */}
      <div>
        <button
          onClick={() => navigate('/dashboard/devices')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-navy-900 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Devices Directory
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-glass">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-navy-900 text-teal-400 rounded-2xl shadow-glow-teal border border-teal-500/30">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-navy-900 font-mono tracking-tight">{device.deviceId}</h1>
                <StatusBadge status={status} size="lg" />
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>{locationName}, <strong className="text-navy-900">{city}</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Console</span>
          </button>
        </div>
      </div>

      {/* Grid of Key Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <LevelCard type="trash" level={trashLevel} />
        <LevelCard type="water" level={waterLevel} />
        <StatusCard status={status} lastSeen={lastSeen} />
        <LastUpdated timestamp={lastSeen} onRefresh={loadData} isRefreshing={loading} />
      </div>

      {/* Location Details & History Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <LocationCard
            city={city}
            locationName={locationName}
            latitude={latitude}
            longitude={longitude}
          />
        </div>

        {/* Historical Sensor Readings Log Table */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-glass space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-extrabold text-navy-900">Telemetry History Logs</h3>
            </div>
            <span className="text-xs text-slate-500 font-semibold">Last {readings.length} readings</span>
          </div>

          {readings.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No historical readings recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="pb-3 px-3">Timestamp</th>
                    <th className="pb-3 px-3">Trash Level</th>
                    <th className="pb-3 px-3">Water Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {readings.map((r, idx) => (
                    <tr key={r.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 text-slate-700 font-mono font-medium">
                        {formatDateTime(r.timestamp)}
                      </td>
                      <td className="py-2.5 px-3 font-bold">
                        <span className={r.trashLevel >= 80 ? 'text-rose-700' : r.trashLevel >= 50 ? 'text-amber-700' : 'text-teal-700'}>
                          {r.trashLevel}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold">
                        <span className={r.innerBinWaterLevel >= 80 ? 'text-rose-700' : r.innerBinWaterLevel >= 50 ? 'text-amber-700' : 'text-teal-700'}>
                          {r.innerBinWaterLevel}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceDetails;
