import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchDevices } from '../services/deviceService';

/**
 * Custom hook to fetch all devices with automatic configurable polling.
 * @param {number} pollIntervalMs - Polling interval in ms (default 15,000ms = 15s)
 */
export const useDevices = (pollIntervalMs = 15000) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const timerRef = useRef(null);

  const loadDevices = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const data = await fetchDevices();
      setDevices(data || []);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError(err.message || 'Failed to load device telemetry');
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDevices(true);

    if (pollIntervalMs > 0) {
      timerRef.current = setInterval(() => {
        loadDevices(false);
      }, pollIntervalMs);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [loadDevices, pollIntervalMs]);

  return {
    devices,
    loading,
    error,
    refetch: () => loadDevices(false),
    lastUpdated,
  };
};

export default useDevices;
