import React, { useState, useEffect, useRef } from 'react';
import { 
  Navigation, 
  MapPin, 
  Compass, 
  RefreshCw, 
  Activity, 
  Radio, 
  ShieldAlert, 
  Phone, 
  Star, 
  Clock, 
  Building2, 
  Filter, 
  ExternalLink,
  ChevronRight,
  Sliders
} from 'lucide-react';
import { useUserLocation } from '../../hooks/useUserLocation';
import { getNearbyHospitals } from '../../services/nearbyHospitalsService';
import { NearbyHospital, UserLocation } from '../../types/nearbyHospital';
import { useMedFlow } from '../../context/MedFlowContext';
import { evaluateHospitalResourceSearch } from '../../services/resourceSearchService';
import { HospitalResourceItem } from '../../types/hospitalResource';

interface FindHospitalsPanelProps {
  onHospitalsLoaded?: (hospitals: NearbyHospital[]) => void;
  onHospitalSelect?: (hospital: NearbyHospital) => void;
  selectedHospitalId?: string | null;
  searchRadius?: number;
  onRadiusChange?: (radius: number) => void;
  userLocation?: UserLocation | null;
  isLocating?: boolean;
  isLiveTracking?: boolean;
  error?: string | null;
  onRequestLocation?: () => void;
  onToggleLiveTracking?: () => void;
  movementThreshold?: number;
  onMovementThresholdChange?: (threshold: number) => void;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}


export const FindHospitalsPanel: React.FC<FindHospitalsPanelProps> = ({
  onHospitalsLoaded,
  onHospitalSelect,
  selectedHospitalId,
  searchRadius: externalRadius = 10,
  onRadiusChange,
  userLocation: externalLocation,
  isLocating: externalLocating,
  isLiveTracking: externalLiveTracking,
  error: externalError,
  onRequestLocation,
  onToggleLiveTracking,
  movementThreshold: externalThreshold = 250,
  onMovementThresholdChange,
  searchQuery = '',
  onSearchQueryChange,
}) => {
  const hookLocation = useUserLocation(externalThreshold);

  const userLocation = externalLocation !== undefined ? externalLocation : hookLocation.userLocation;
  const isLocating = externalLocating !== undefined ? externalLocating : hookLocation.isLocating;
  const isLiveTracking = externalLiveTracking !== undefined ? externalLiveTracking : hookLocation.isLiveTracking;
  const error = externalError !== undefined ? externalError : hookLocation.error;
  const requestLocation = onRequestLocation || hookLocation.requestLocation;
  const startLiveTracking = hookLocation.startLiveTracking;
  const stopLiveTracking = hookLocation.stopLiveTracking;

  const { facilities } = useMedFlow();

  const [searchRadius, setSearchRadius] = useState<number>(externalRadius);
  const [movementThreshold, setMovementThreshold] = useState<number>(externalThreshold);
  const [nearbyHospitals, setNearbyHospitals] = useState<NearbyHospital[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'AVAILABLE' | 'LIMITED' | 'NOT_AVAILABLE' | 'UNKNOWN'>('all');
  const [expandedHospitalId, setExpandedHospitalId] = useState<string | null>(null);

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (externalRadius !== undefined) setSearchRadius(externalRadius);
  }, [externalRadius]);

  const handleRadiusSelect = (radius: number) => {
    setSearchRadius(radius);
    onRadiusChange?.(radius);
  };

  const handleThresholdSelect = (threshold: number) => {
    setMovementThreshold(threshold);
    onMovementThresholdChange?.(threshold);
    hookLocation.setMovementThreshold(threshold);
  };

  // Fetch nearby hospitals when user location changes or radius changes
  useEffect(() => {
    if (!userLocation) return;

    let isMounted = true;
    setIsSearching(true);

    getNearbyHospitals(
      userLocation.latitude,
      userLocation.longitude,
      searchRadius,
      facilities
    )
      .then(hospitals => {
        if (isMounted) {
          setNearbyHospitals(hospitals);
          onHospitalsLoaded?.(hospitals);
          setIsSearching(false);
          hookLocation.acknowledgeHospitalRefresh();
        }
      })
      .catch(err => {
        console.error('Error finding nearby hospitals:', err);
        if (isMounted) setIsSearching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userLocation?.latitude, userLocation?.longitude, searchRadius, facilities, hookLocation.needsHospitalRefresh]);

  // Auto-scroll to selected hospital card when selected on map
  useEffect(() => {
    if (selectedHospitalId && cardRefs.current[selectedHospitalId]) {
      cardRefs.current[selectedHospitalId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
      setExpandedHospitalId(selectedHospitalId);
    }
  }, [selectedHospitalId]);

  // Evaluate each hospital against search query
  const evaluatedHospitals = nearbyHospitals.map(hosp => ({
    hospital: hosp,
    resourceSearch: evaluateHospitalResourceSearch(hosp.id, hosp.name, searchQuery),
  }));

  const filteredEvaluatedHospitals = evaluatedHospitals.filter(item => {
    if (statusFilter === 'all') return true;
    return item.resourceSearch.overallStatus === statusFilter;
  });

  return (
    <div className="space-y-4">
      {/* 1. Header & Location Controls Card */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h3 className="font-extrabold text-white text-sm tracking-tight">
              Find Hospitals Near Me
            </h3>
          </div>
          {userLocation && (
            <span className="flex items-center gap-1 text-[10px] text-cyan-300 font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              GPS Active
            </span>
          )}
        </div>

        {/* Permission Request Prompt */}
        {!userLocation && (
          <div className="space-y-3 py-2 text-center">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-slate-200">📍 Real Device Geolocation Required</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                MedFlow AI needs your location to find nearby emergency hospitals, medical centers, and clinics based on your exact latitude and longitude.
              </p>
            </div>

            <button
              onClick={requestLocation}
              disabled={isLocating}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all disabled:opacity-50"
            >
              {isLocating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                  <span>Obtaining GPS Location...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  <span>📍 Find Hospitals Near Me</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Error / Permission Denied Message */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300 space-y-1.5 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-rose-200">Location Access Issue</p>
              <p className="text-[11px] text-rose-300/90 leading-relaxed">{error}</p>
              <p className="text-[10px] text-slate-400 font-mono pt-1">
                Tip: Allow location access in your browser location popup to use your device GPS.
              </p>
            </div>
          </div>
        )}

        {/* Location Info Header & Controls when Location is Granted */}
        {userLocation && (
          <div className="space-y-3">
            {/* User GPS Telemetry Panel */}
            <div className="p-3 rounded-lg bg-slate-900/90 border border-cyan-800/50 space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono">
                <span className="text-slate-400">📍 Device Position:</span>
                <span className="text-cyan-300 font-bold">
                  {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span className="text-slate-400">Accuracy:</span>
                <span className="text-emerald-400 font-bold">± {userLocation.accuracy} meters</span>
              </div>
            </div>

            {/* Controls Bar: Refresh & Live Location Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={requestLocation}
                disabled={isLocating}
                className="flex-1 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-cyan-400' : ''}`} />
                <span>Refresh Location</span>
              </button>

              <button
                onClick={onToggleLiveTracking || (isLiveTracking ? stopLiveTracking : startLiveTracking)}
                className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  isLiveTracking
                    ? 'bg-rose-950/80 border-rose-700 text-rose-300 hover:bg-rose-900/80'
                    : 'bg-cyan-950/80 border-cyan-700 text-cyan-300 hover:bg-cyan-900/80'
                }`}
              >
                <Radio className={`w-3.5 h-3.5 ${isLiveTracking ? 'animate-pulse text-rose-400' : ''}`} />
                <span>{isLiveTracking ? '⏹ Stop Live GPS' : '📡 Live Location'}</span>
              </button>
            </div>

            {/* Configurable Search Radius Options */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 flex items-center gap-1 font-mono">
                  <Filter className="w-3 h-3 text-cyan-400" /> Search Radius:
                </span>
                <span className="text-cyan-300 font-bold font-mono">{searchRadius} km</span>
              </div>

              <div className="grid grid-cols-4 gap-1 font-mono text-xs">
                {[5, 10, 20, 50].map(r => (
                  <button
                    key={r}
                    onClick={() => handleRadiusSelect(r)}
                    className={`py-1 rounded-lg text-center font-bold transition-all ${
                      searchRadius === r
                        ? 'bg-cyan-600 text-white shadow border border-cyan-400/60'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {r} km
                  </button>
                ))}
              </div>
            </div>

            {/* Search Availability Filter Tabs */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs font-mono">
              <span className="text-slate-400 text-[10px]">Filter by Search Status:</span>
              <div className="grid grid-cols-5 gap-1 text-[10px]">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'AVAILABLE', label: '🟢 Avail' },
                  { id: 'LIMITED', label: '🟡 Limit' },
                  { id: 'NOT_AVAILABLE', label: '🔴 Unavail' },
                  { id: 'UNKNOWN', label: '⚪ Unk' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id as any)}
                    className={`py-1 px-1 rounded-lg text-center font-bold transition-all truncate ${
                      statusFilter === tab.id
                        ? 'bg-cyan-600 text-white shadow'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Sorted Nearby Hospitals List */}
      {userLocation && (
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Building2 className="w-4 h-4 text-emerald-400" />
              Nearby Facilities ({filteredEvaluatedHospitals.length})
            </h3>
            {isSearching && (
              <span className="text-[10px] text-cyan-400 font-mono animate-pulse flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> Searching...
              </span>
            )}
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredEvaluatedHospitals.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs space-y-2">
                <Building2 className="w-8 h-8 text-slate-600 mx-auto" />
                <p>No hospitals match your filter within {searchRadius} km.</p>
                <button
                  onClick={() => handleRadiusSelect(searchRadius === 5 ? 10 : searchRadius === 10 ? 20 : 50)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-700 text-cyan-300 font-bold text-xs hover:bg-cyan-900 transition-all shadow"
                >
                  Expand Search Radius ({searchRadius === 5 ? '10' : searchRadius === 10 ? '20' : '50'} km)
                </button>
              </div>
            ) : (
              filteredEvaluatedHospitals.map(({ hospital: hosp, resourceSearch: searchRes }) => {
                const isSelected = selectedHospitalId === hosp.id;
                const isExpanded = expandedHospitalId === hosp.id || isSelected;

                return (
                  <div
                    key={hosp.id}
                    ref={el => (cardRefs.current[hosp.id] = el)}
                    onClick={() => {
                      onHospitalSelect?.(hosp);
                      setExpandedHospitalId(prev => prev === hosp.id ? null : hosp.id);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-950/60 ring-1 ring-cyan-400/50'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-xs text-white flex items-center gap-1">
                          🏥 {hosp.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate max-w-[170px]">{hosp.address}</span>
                        </p>
                      </div>

                      <div className="text-right shrink-0 space-y-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-950 text-emerald-300 border border-emerald-700 block">
                          📍 {hosp.distanceFormatted}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase font-mono block border ${
                            searchRes.overallStatus === 'AVAILABLE'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                              : searchRes.overallStatus === 'LIMITED'
                              ? 'bg-amber-950 text-amber-300 border-amber-700'
                              : searchRes.overallStatus === 'NOT_AVAILABLE'
                              ? 'bg-rose-950 text-rose-300 border-rose-700'
                              : 'bg-slate-900 text-slate-400 border-slate-700'
                          }`}
                        >
                          {searchRes.overallStatus === 'AVAILABLE' ? '🟢 Available' :
                           searchRes.overallStatus === 'LIMITED' ? '🟡 Limited' :
                           searchRes.overallStatus === 'NOT_AVAILABLE' ? '🔴 Unavailable' : '⚪ Unknown'}
                        </span>
                      </div>
                    </div>

                    {/* 🔴 MANDATORY SECTION: Currently Unavailable Resources */}
                    <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-900/80 space-y-1">
                      <h5 className="text-[10px] font-bold text-rose-300 uppercase font-mono flex items-center justify-between">
                        <span>🔴 Currently Unavailable</span>
                        <span className="text-rose-400 font-semibold">{searchRes.unavailableResources.length} items</span>
                      </h5>
                      {searchRes.unavailableResources.length === 0 ? (
                        <p className="text-[10px] text-slate-400 font-mono">No stockouts reported for query</p>
                      ) : (
                        <div className="space-y-0.5 text-[10px] font-mono text-rose-200">
                          {searchRes.unavailableResources.slice(0, 3).map((res: HospitalResourceItem) => (
                            <div key={res.id} className="flex justify-between">
                              <span>❌ {res.name}</span>
                              <span className="font-bold">0/{res.total} {res.unit || ''}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 🟢 Currently Available Preview */}
                    <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-900/60 space-y-1 text-[10px] font-mono">
                      <h5 className="font-bold text-emerald-300 uppercase flex items-center justify-between">
                        <span>🟢 Currently Available</span>
                        <span className="text-emerald-400">{searchRes.availableResources.length} items</span>
                      </h5>
                      <div className="space-y-0.5 text-emerald-200">
                        {searchRes.availableResources.slice(0, 3).map((res: HospitalResourceItem) => (
                          <div key={res.id} className="flex justify-between">
                            <span>✓ {res.name}</span>
                            <span className="font-bold text-emerald-400">{res.available}/{res.total} {res.unit || ''}</span>
                          </div>
                        ))}
                      </div>
                    </div>


                    {/* Data Freshness Metrics */}
                    <div className={`p-1.5 rounded text-[10px] font-mono flex items-center justify-between border ${
                      searchRes.isOutdated 
                        ? 'bg-amber-950/40 border-amber-800 text-amber-300' 
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}>
                      <span>{searchRes.isOutdated ? '⚠️ Data may be outdated' : '🟢 Verified Live Data'}</span>
                      <span className="font-bold">{searchRes.timeAgoFormatted}</span>
                    </div>

                    {/* Directions link */}
                    <div className="flex items-center justify-end pt-1 border-t border-slate-800/80">
                      <a
                        href={hosp.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] flex items-center gap-1 transition-all shadow"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Get Directions</span>
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};


