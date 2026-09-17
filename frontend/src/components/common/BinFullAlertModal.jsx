import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertOctagon, X, ArrowRight } from 'lucide-react';
import { formatDateTime, formatCurrent } from '../../utils/formatUtils';

/**
 * Bin Full Alert Modal (Enterprise Operations SCADA Theme)
 * Minimalist, technical operations alert modal for critical SeaBin capacity events.
 * Displays real-time device telemetry with clean two-column operational layout.
 */
const BinFullAlertModal = ({ fullDevices = [], onClose, onDismiss }) => {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (selectedIndex >= fullDevices.length) {
      setSelectedIndex(0);
    }
  }, [fullDevices.length, selectedIndex]);

  if (!fullDevices || fullDevices.length === 0) {
    return null;
  }

  const activeDevice = fullDevices[selectedIndex] || fullDevices[0];
  const {
    deviceId,
    city = 'Unknown City',
    locationName = 'Unspecified Location',
    status = 'OFFLINE',
    lastSeen,
    latestReading = {},
  } = activeDevice;

  const trashLevel = latestReading?.trashLevel ?? 0;
  const innerBinWaterLevel = latestReading?.innerBinWaterLevel ?? 0;
  const pumpState = latestReading?.pumpState ?? null;
  const motorCurrent1 = latestReading?.motorCurrent1 ?? null;
  const motorCurrent2 = latestReading?.motorCurrent2 ?? null;
  const alertTime = latestReading?.timestamp || lastSeen;

  const isOnline = String(status).toUpperCase() === 'ONLINE';

  const handleNavigateToConsole = () => {
    if (onDismiss) onDismiss();
    else if (onClose) onClose();
    navigate(`/dashboard/device/${deviceId}`);
  };

  const handleDismiss = () => {
    if (onDismiss) onDismiss();
    else if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-300 overflow-hidden text-slate-900 my-6 transform transition-all">
        
        {/* Top Dark Enterprise Control Bar */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="text-xs font-mono font-bold tracking-wider text-rose-400 uppercase">
              CRITICAL ALERT
            </span>
          </div>
          <button
            onClick={handleDismiss}
            title="Dismiss"
            className="text-slate-400 hover:text-white p-1 rounded transition-colors focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Operational Alert Header Banner */}
        <div className="bg-rose-50/90 border-b border-rose-200/80 px-5 py-2.5 flex items-center justify-between text-xs">
          <span className="font-bold text-rose-900 uppercase tracking-wide text-[11px]">
            BIN CAPACITY THRESHOLD EXCEEDED
          </span>
          {fullDevices.length > 1 && (
            <span className="text-[10px] font-mono font-bold bg-rose-200/80 text-rose-900 px-2 py-0.5 rounded border border-rose-300">
              {fullDevices.length} AFFECTED
            </span>
          )}
        </div>

        {/* Affected Devices Selector (Shown when >1 full bin exists) */}
        {fullDevices.length > 1 && (
          <div className="bg-slate-100/90 border-b border-slate-200 px-5 py-2 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
              SELECT DEVICE:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {fullDevices.map((dev, idx) => {
                const devTrash = dev.latestReading?.trashLevel ?? 0;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={dev.deviceId || dev.id || idx}
                    onClick={() => setSelectedIndex(idx)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <span>{dev.deviceId}</span>
                    <span className={isSelected ? 'text-rose-300' : 'text-rose-700'}>
                      {devTrash}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Body Content */}
        <div className="p-5 space-y-4">
          
          {/* Section 1: Device Identifier & Location */}
          <div className="flex items-start justify-between pb-3.5 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-black font-mono tracking-tight text-slate-900">
                  {deviceId}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  {status}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600 mt-1">
                {locationName} • <strong className="text-slate-800 font-semibold">{city}</strong>
              </p>
            </div>
          </div>

          {/* Section 2: Trash Capacity Operational Visualization */}
          <div className="space-y-1.5 py-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              TRASH CAPACITY
            </span>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-rose-700">{trashLevel}%</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded">
                CRITICAL
              </span>
            </div>
            {/* Slim technical progress bar */}
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-rose-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, trashLevel))}%` }}
              />
            </div>
          </div>

          {/* Section 3: Two-Column Operational Telemetry Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 pt-3.5 border-t border-slate-200 text-xs">
            {/* Water Level */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                WATER LEVEL
              </span>
              <span className="text-sm font-semibold font-mono text-slate-900 mt-0.5 block">
                {innerBinWaterLevel}%
              </span>
            </div>

            {/* Pump State */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                PUMP STATE
              </span>
              <span className="text-sm font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5">
                {pumpState ? (
                  <>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      String(pumpState).toUpperCase() === 'COLLECTION' ? 'bg-teal-500' : 'bg-sky-500'
                    }`} />
                    {pumpState}
                  </>
                ) : (
                  <span className="text-slate-400">N/A</span>
                )}
              </span>
            </div>

            {/* Motor Current 1 */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                MOTOR CURRENT 1
              </span>
              <span className="text-sm font-semibold font-mono text-slate-900 mt-0.5 block">
                {formatCurrent(motorCurrent1)}
              </span>
            </div>

            {/* Motor Current 2 */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                MOTOR CURRENT 2
              </span>
              <span className="text-sm font-semibold font-mono text-slate-900 mt-0.5 block">
                {formatCurrent(motorCurrent2)}
              </span>
            </div>
          </div>

          {/* Section 4: Last Telemetry Timestamp */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              LAST TELEMETRY
            </span>
            <span className="font-mono text-slate-700 font-medium text-[11px]">
              {alertTime ? formatDateTime(alertTime) : 'N/A'}
            </span>
          </div>

        </div>

        {/* Enterprise Action Footer */}
        <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={handleDismiss}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors shadow-xs active:scale-95"
          >
            Dismiss Alert
          </button>

          <button
            onClick={handleNavigateToConsole}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-950 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs active:scale-95"
          >
            <span>View Device</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BinFullAlertModal;
