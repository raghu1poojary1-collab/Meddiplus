import React, { useState } from 'react';
import { SupplyNetworkMap } from '../components/map/SupplyNetworkMap';
import { FindHospitalsPanel } from '../components/map/FindHospitalsPanel';
import { useMedFlow } from '../context/MedFlowContext';
import { NearbyHospital } from '../types/nearbyHospital';
import { useUserLocation } from '../hooks/useUserLocation';
import { 
  Building2, 
  Map, 
  Filter, 
  Sparkles, 
  ArrowRightLeft, 
  Clock, 
  ShieldAlert,
  X,
  Compass,
  Navigation,
  Layers,
  Radio
} from 'lucide-react';

export const RegionalMapPage: React.FC = () => {
  const { facilities, inventory, recommendations, selectedFacilityId, setSelectedFacilityId } = useMedFlow();

  const [sidebarTab, setSidebarTab] = useState<'find' | 'network'>('find');
  const [searchRadius, setSearchRadius] = useState<number>(10);
  const [movementThreshold, setMovementThreshold] = useState<number>(250);
  const [nearbyHospitals, setNearbyHospitals] = useState<NearbyHospital[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const {
    userLocation,
    isLocating,
    isLiveTracking,
    error,
    requestLocation,
    startLiveTracking,
    stopLiveTracking,
    setMovementThreshold: setHookThreshold,
  } = useUserLocation(movementThreshold);

  const selectedFacility = facilities.find(f => f.id === selectedFacilityId);
  const selectedInv = selectedFacility ? inventory.filter(i => i.facilityId === selectedFacility.id) : [];
  const pendingRecs = recommendations.filter(r => r.status === 'pending');

  const handleRadiusChange = (radius: number) => {
    setSearchRadius(radius);
  };

  const handleThresholdChange = (threshold: number) => {
    setMovementThreshold(threshold);
    setHookThreshold(threshold);
  };

  const handleToggleLiveTracking = () => {
    if (isLiveTracking) {
      stopLiveTracking();
    } else if (userLocation) {
      startLiveTracking();
    } else {
      requestLocation();
      startLiveTracking();
    }
  };

  const handleFindHospitalsClick = () => {
    setSidebarTab('find');
    if (!userLocation) {
      requestLocation();
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Map className="w-6 h-6 text-cyan-400" />
            Live Geospatial Healthcare & Hospital Proximity Map
          </h2>
          <p className="text-xs text-slate-400">
            Real-time GPS device tracking of live user location, nearby emergency hospitals, and regional healthcare supply transfers directly on Leaflet.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Main "Find Hospitals Near Me" Quick Button */}
          <button
            onClick={handleFindHospitalsClick}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
              sidebarTab === 'find' && userLocation
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-950/60 ring-2 ring-cyan-400/50'
                : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/60'
            }`}
          >
            <Navigation className="w-4 h-4 text-cyan-200 animate-pulse" />
            <span>📍 Find Hospitals Near Me</span>
          </button>

          <div className="px-3 py-2 rounded-xl glass-panel text-xs text-slate-300 border border-slate-800 flex items-center gap-2 font-mono hidden md:flex">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Active Transfers: <strong>{pendingRecs.length}</strong></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Leaflet Map Component (3 Columns) */}
        <div className="lg:col-span-3">
          <SupplyNetworkMap
            height="640px"
            userLocation={userLocation}
            nearbyHospitals={nearbyHospitals}
            selectedHospitalId={selectedHospitalId}
            onHospitalSelect={hosp => setSelectedHospitalId(hosp.id)}
            isLocating={isLocating}
            isLiveTracking={isLiveTracking}
            searchRadius={searchRadius}
            onRadiusChange={handleRadiusChange}
            onRequestLocation={requestLocation}
            onToggleLiveTracking={handleToggleLiveTracking}
            locationError={error}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />
        </div>

        {/* Right Sidebar Control Drawer (1 Column) */}
        <div className="space-y-4">
          {/* Tab Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setSidebarTab('find')}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                sidebarTab === 'find'
                  ? 'bg-gradient-to-r from-cyan-950 to-slate-900 text-cyan-300 border border-cyan-700/60 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>📍 Nearby Hospitals</span>
            </button>

            <button
              onClick={() => setSidebarTab('network')}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                sidebarTab === 'network'
                  ? 'bg-gradient-to-r from-cyan-950 to-slate-900 text-cyan-300 border border-cyan-700/60 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4 text-purple-400" />
              <span>Regional Routes</span>
            </button>
          </div>

          {/* TAB 1: Find Hospitals Panel */}
          {sidebarTab === 'find' && (
            <FindHospitalsPanel
              userLocation={userLocation}
              isLocating={isLocating}
              isLiveTracking={isLiveTracking}
              error={error}
              onRequestLocation={requestLocation}
              onToggleLiveTracking={handleToggleLiveTracking}
              searchRadius={searchRadius}
              onRadiusChange={handleRadiusChange}
              movementThreshold={movementThreshold}
              onMovementThresholdChange={handleThresholdChange}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onHospitalsLoaded={hospitals => {
                setNearbyHospitals(hospitals);
              }}
              onHospitalSelect={hospital => {
                setSelectedHospitalId(hospital.id);
              }}
              selectedHospitalId={selectedHospitalId}
            />
          )}

          {/* TAB 2: Regional Network & Transfer Inspector */}
          {sidebarTab === 'network' && (
            <div className="space-y-4">
              {/* Active Transfer Recommendations Cards */}
              <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <ArrowRightLeft className="w-4 h-4 text-purple-400" />
                  Active Transfer Routes ({pendingRecs.length})
                </h3>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {pendingRecs.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">No active transfer routes on map</p>
                  ) : (
                    pendingRecs.map(rec => (
                      <div key={rec.id} className="p-3 rounded-lg bg-slate-900 border border-cyan-800/50 text-xs space-y-2">
                        <div className="flex items-center justify-between text-cyan-300 font-bold">
                          <span>{rec.medicineName}</span>
                          <span className="font-mono text-white">{rec.recommendedTransferUnits} units</span>
                        </div>
                        <div className="text-[11px] text-slate-300 space-y-0.5 font-mono">
                          <div>From: <strong className="text-emerald-400">{rec.donorFacilityName}</strong></div>
                          <div>To: <strong className="text-rose-400">{rec.recipientFacilityName}</strong></div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800">
                          <span>Transit: {rec.donorTravelTimeHours} hrs</span>
                          <span className="text-emerald-400">Risk: {rec.recipientPreTransferRisk}% → {rec.recipientPostTransferRisk}%</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Selected Facility Quick Drawer */}
              {selectedFacility ? (
                <div className="glass-panel p-4 rounded-xl border border-cyan-500/40 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-cyan-400" />
                      {selectedFacility.name}
                    </h3>
                    <button
                      onClick={() => setSelectedFacilityId(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1">
                    <div>Type: <span className="text-white font-medium">{selectedFacility.type}</span></div>
                    <div>Location: <span className="text-slate-400">{selectedFacility.location}</span></div>
                    <div>Contact: <span className="font-mono text-cyan-400">{selectedFacility.contactPhone}</span></div>
                    <div>Overall Risk: 
                      <span className={`ml-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        selectedFacility.status === 'critical' ? 'bg-rose-950 text-rose-300' :
                        selectedFacility.status === 'warning' ? 'bg-amber-950 text-amber-300' :
                        'bg-emerald-950 text-emerald-300'
                      }`}>
                        {selectedFacility.status} ({selectedFacility.riskScore}%)
                      </span>
                    </div>
                  </div>

                  <h4 className="text-[11px] font-bold text-slate-400 uppercase font-mono pt-2 border-t border-slate-800">
                    Inventory Breakdown
                  </h4>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedInv.map(item => (
                      <div key={item.medicineId} className="p-2 rounded bg-slate-900 border border-slate-800 text-xs">
                        <div className="flex justify-between font-semibold text-slate-200">
                          <span>{item.medicineName}</span>
                          <span className="font-mono text-cyan-400">{item.currentStock} units</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                          <span>Daily: {item.dailyConsumption}/day</span>
                          <span className={item.daysUntilStockout <= 7 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                            {item.daysUntilStockout} days left
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="glass-panel p-4 rounded-xl border border-slate-800 text-center text-xs text-slate-400 py-8 space-y-2">
                  <Building2 className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>Click any facility pin on the map to inspect its real-time inventory and supplier details.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


