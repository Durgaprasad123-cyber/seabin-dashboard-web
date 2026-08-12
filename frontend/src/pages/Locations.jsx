import React, { useState, useEffect, useCallback } from 'react';
import { fetchLocations } from '../services/locationService';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import LocationCard from '../components/locations/LocationCard';
import { MapPin, RefreshCw } from 'lucide-react';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLocations();
      setLocations(data || []);
    } catch (err) {
      console.error('Error loading locations:', err);
      setError(err.message || 'Failed to load deployment locations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  if (loading && locations.length === 0) {
    return <Loading message="Aggregating city deployment metrics..." />;
  }

  if (error && locations.length === 0) {
    return <ErrorMessage message={error} onRetry={loadLocations} />;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-glass">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-teal-600" />
            <h1 className="text-2xl font-black text-navy-900 tracking-tight">Deployment Locations</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Dynamically aggregated SeaBin metrics across {locations.length} active deployment hub cities
          </p>
        </div>
        <button
          onClick={loadLocations}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Locations</span>
        </button>
      </div>

      {/* City Stats Grid */}
      {locations.length === 0 ? (
        <EmptyState
          title="No Location Data Available"
          description="Cities are dynamically populated when SeaBin devices send telemetry data."
          onRetry={loadLocations}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((locStats) => (
            <LocationCard key={locStats.city} locationStats={locStats} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Locations;
