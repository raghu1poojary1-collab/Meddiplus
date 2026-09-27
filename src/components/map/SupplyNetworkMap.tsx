import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ArrowRight, 
  Sparkles, 
  Pill, 
  ExternalLink,
  ShieldAlert,
  Compass,
  MapPin,
  Layers,
  Navigation,
  Crosshair,
  Radio,
  RefreshCw
} from 'lucide-react';
import { useMedFlow } from '../../context/MedFlowContext';
import { Facility, TransferRecommendation } from '../../types/medflow';
import { UserLocation, NearbyHospital } from '../../types/nearbyHospital';
import { UserLocationMarker } from './UserLocationMarker';
import { NearbyHospitalMarker } from './NearbyHospitalMarker';

// Create custom colored markers using SVG icons
const createCustomIcon = (status: Facility['status']) => {
  const color = status === 'critical' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#10b981';
  const pulseClass = status === 'critical' ? 'critical-pulse-marker' : '';

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.6"/>
      </filter>
      <path d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 28 18 28s18-14.5 18-28C36 8.059 27.941 0 18 0z" fill="${color}" filter="url(#shadow)"/>
      <circle cx="18" cy="18" r="12" fill="#0f172a"/>
      <path d="M18 10v16M10 18h16" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>
    </svg>
  `;

  return L.divIcon({
    className: `custom-map-pin ${pulseClass}`,
    html: svgString,
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -42],
  });
};

interface MapProps {
  height?: string;
  showDetailsDrawer?: boolean;
  userLocation?: UserLocation | null;
  nearbyHospitals?: NearbyHospital[];
  selectedHospitalId?: string | null;
  onHospitalSelect?: (hospital: NearbyHospital) => void;
  isLocating?: boolean;
  isSearching?: boolean;
  isLiveTracking?: boolean;
  searchRadius?: number;
  onRadiusChange?: (radius: number) => void;
  onRequestLocation?: () => void;
  onToggleLiveTracking?: () => void;
  locationError?: string | null;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

export const SupplyNetworkMap: React.FC<MapProps> = ({ 
  height = '640px',
  userLocation,
  nearbyHospitals = [],
  selectedHospitalId,
  onHospitalSelect,
  isLocating = false,
  isSearching = false,
  isLiveTracking = false,
  searchRadius = 10,
  onRadiusChange,
  onRequestLocation,
  onToggleLiveTracking,
  locationError,
  searchQuery = '',
  onSearchQueryChange,
}) => {
  const { facilities, inventory, recommendations, setSelectedFacilityId } = useMedFlow();
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [activeLayer, setActiveLayer] = useState<'both' | 'regional' | 'nearby'>('both');
  const [centerCount, setCenterCount] = useState<number>(0);

  // Map center coordinates (User Location or fallback center)
  const defaultCenter: [number, number] = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : [40.735, -73.97];

  const pendingRecs = recommendations.filter(r => r.status === 'pending');

  const handleCenterOnMe = () => {
    if (userLocation) {
      setCenterCount(prev => prev + 1);
    } else if (onRequestLocation) {
      onRequestLocation();
    }
  };

  const quickSearchChips = [
    { label: 'All', query: '' },
    { label: '🩺 Kidney Stone Surgery', query: 'Kidney stone operation' },
    { label: '🩸 O+ Blood', query: 'O+ blood' },
    { label: '🛏️ ICU Beds', query: 'ICU Bed' },
    { label: '💨 Ventilators', query: 'Ventilator' },
    { label: '💊 Paracetamol', query: 'Paracetamol' },
    { label: '👨‍⚕️ Urologist', query: 'Urologist' },
  ];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl glass-panel">
      {/* Top Map Control & Search Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] space-y-2 pointer-events-none">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Left Status Controls */}
          <div className="pointer-events-auto flex flex-wrap items-center gap-2">
            {/* Live Location Status Indicator */}
            <div className="flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs shadow-lg">
              {locationError ? (
                <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> 🔴 Location Unavailable
                </span>
              ) : isLiveTracking ? (
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> 🟢 Live Location Active
                </span>
              ) : userLocation ? (
                <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span> 📍 GPS Fix Acquired
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-slate-600"></span> ⚪ Live Location Off
                </span>
              )}
            </div>

            {/* Quick "📍 Find Hospitals Near Me" / Live GPS toggle button */}
            <button
              onClick={() => {
                if (!userLocation && onRequestLocation) {
                  onRequestLocation();
                } else if (onToggleLiveTracking) {
                  onToggleLiveTracking();
                }
              }}
              disabled={isLocating}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                isLiveTracking
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400/50'
              }`}
            >
              {isLocating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Locating...</span>
                </>
              ) : (
                <>
                  <Radio className={`w-3.5 h-3.5 ${isLiveTracking ? 'animate-pulse text-emerald-400' : ''}`} />
                  <span>{userLocation ? (isLiveTracking ? 'Live Tracking On' : 'Enable Live Tracking') : '📍 Find Hospitals Near Me'}</span>
                </>
              )}
            </button>

            {/* 🎯 Center on Me Button */}
            {userLocation && (
              <button
                onClick={handleCenterOnMe}
                className="px-3 py-1.5 rounded-xl bg-slate-950/90 hover:bg-slate-900 text-cyan-300 border border-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg"
                title="Center map on your location"
              >
                <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                <span>🎯 Center on Me</span>
              </button>
            )}
          </div>

          {/* Right Controls: Search Radius & Layers */}
          <div className="pointer-events-auto flex flex-wrap items-center gap-2">
            {/* Radius Selector */}
            {userLocation && onRadiusChange && (
              <div className="flex items-center gap-1 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-800 text-xs shadow-lg font-mono">
                <span className="text-[10px] text-slate-400 hidden sm:inline">Radius:</span>
                {[5, 10, 20].map(r => (
                  <button
                    key={r}
                    onClick={() => onRadiusChange(r)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                      searchRadius === r
                        ? 'bg-cyan-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {r} km
                  </button>
                ))}
              </div>
            )}

            {/* Map Layers Toggle */}
            <div className="flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 text-xs shadow-lg font-mono">
              <span className="text-[10px] text-slate-400 px-1.5 hidden md:flex items-center gap-1">
                <Layers className="w-3 h-3 text-cyan-400" /> Layer:
              </span>
              {[
                { id: 'both', label: 'All' },
                { id: 'regional', label: 'Regional' },
                { id: 'nearby', label: `Nearby (${nearbyHospitals.length})` },
              ].map(layer => (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id as any)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    activeLayer === layer.id
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {layer.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Medical Requirement Search Bar & Quick Chips Overlay */}
        <div className="pointer-events-auto flex flex-col gap-1.5 bg-slate-950/95 backdrop-blur-md p-2.5 rounded-2xl border border-cyan-800/60 shadow-2xl max-w-2xl">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchQueryChange?.(e.target.value)}
              placeholder="Search medical requirement (e.g. Kidney stone operation, O+ blood, ICU Bed, Paracetamol, Urologist)..."
              className="w-full bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchQueryChange?.('')}
                className="text-xs text-slate-400 hover:text-white px-1.5"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Search Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-[10px] font-mono">
            <span className="text-slate-400 shrink-0">Quick Search:</span>
            {quickSearchChips.map(chip => (
              <button
                key={chip.label}
                onClick={() => onSearchQueryChange?.(chip.query)}
                className={`px-2 py-0.5 rounded-lg border shrink-0 transition-all ${
                  searchQuery.toLowerCase() === chip.query.toLowerCase()
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold shadow'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Marker Status Legend relative to search query */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-800/80 pt-1">
            <span>Map Marker Color = Search Availability:</span>
            <div className="flex items-center gap-2 font-bold">
              <span className="text-emerald-400">🟢 Available</span>
              <span className="text-amber-400">🟡 Limited</span>
              <span className="text-rose-400">🔴 Unavailable</span>
              <span className="text-slate-400">⚪ Unknown</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Dynamic Feedback Banner */}
      <div className="absolute bottom-4 left-4 z-[1000] pointer-events-none max-w-sm">
        <div className="pointer-events-auto bg-slate-950/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-xs shadow-2xl flex items-center gap-2 font-mono">
          {isLocating ? (
            <span className="flex items-center gap-2 text-cyan-300 font-semibold animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              📍 Getting your location...
            </span>
          ) : isSearching ? (
            <span className="flex items-center gap-2 text-cyan-300 font-semibold animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              🏥 Finding nearby hospitals...
            </span>
          ) : nearbyHospitals.length > 0 ? (
            <span className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ✓ {nearbyHospitals.length} hospitals found nearby ({searchRadius} km)
            </span>
          ) : userLocation ? (
            <div className="flex flex-col gap-1 text-amber-300">
              <span>No hospitals found within {searchRadius} km.</span>
              {onRadiusChange && (
                <button
                  onClick={() => onRadiusChange(searchRadius === 5 ? 10 : searchRadius === 10 ? 20 : 50)}
                  className="text-[10px] text-cyan-300 hover:underline font-bold text-left"
                >
                  [Expand Search Radius to {searchRadius === 5 ? '10' : searchRadius === 10 ? '20' : '50'} km]
                </button>
              )}
            </div>
          ) : (
            <span className="text-slate-400">
              Click <strong>📍 Find Hospitals Near Me</strong> to search nearby facilities via real GPS.
            </span>
          )}
        </div>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height, width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 1. User Location Marker & Accuracy Circle */}
        {userLocation && (
          <UserLocationMarker
            userLocation={userLocation}
            autoCenterOnce={true}
            centerCount={centerCount}
          />
        )}

        {/* 2. Discovered Nearby Hospitals Markers */}
        {(activeLayer === 'both' || activeLayer === 'nearby') &&
          nearbyHospitals.map(hosp => (
            <NearbyHospitalMarker
              key={hosp.id}
              hospital={hosp}
              isSelected={selectedHospitalId === hosp.id}
              onSelect={onHospitalSelect}
              searchQuery={searchQuery}
            />
          ))}

        {/* 3. Regional MedFlow Facility Markers */}
        {(activeLayer === 'both' || activeLayer === 'regional') &&
          facilities.map(facility => {
            const facInventory = inventory.filter(i => i.facilityId === facility.id);
            const criticalItems = facInventory.filter(i => i.status === 'critical');

            return (
              <Marker
                key={facility.id}
                position={[facility.lat, facility.lng]}
                icon={createCustomIcon(facility.status)}
                eventHandlers={{
                  click: () => {
                    setSelectedFacility(facility);
                    setSelectedFacilityId(facility.id);
                  },
                }}
              >
                <Popup className="medflow-map-popup">
                  <div className="p-1 w-72 text-slate-100">
                    <div className="flex items-start justify-between border-b border-slate-800 pb-2 mb-2">
                      <div>
                        <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-cyan-400" />
                          {facility.name}
                        </h4>
                        <p className="text-[11px] text-slate-400">{facility.location}</p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          facility.status === 'critical'
                            ? 'bg-rose-950 text-rose-300 border border-rose-700'
                            : facility.status === 'warning'
                            ? 'bg-amber-950 text-amber-300 border border-amber-700'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        }`}
                      >
                        {facility.status} ({facility.riskScore}%)
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs mb-3">
                      <div className="flex justify-between text-slate-300">
                        <span>Monitored Medicines:</span>
                        <span className="font-mono text-white">{facInventory.length} items</span>
                      </div>
                      {criticalItems.length > 0 && (
                        <div className="flex justify-between text-rose-400 font-semibold bg-rose-950/40 p-1 rounded border border-rose-900">
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Critical Stockouts:
                          </span>
                          <span className="font-mono">{criticalItems.length} items</span>
                        </div>
                      )}
                      {facInventory.map(item => (
                        <div
                          key={item.medicineId}
                          className="flex justify-between items-center text-[11px] py-0.5 border-b border-slate-800/60"
                        >
                          <span className="text-slate-300">{item.medicineName}</span>
                          <span className="font-mono text-slate-400">
                            {item.currentStock} units ({item.daysUntilStockout}d left)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* 4. Animated Polyline Transfer Connections */}
        {(activeLayer === 'both' || activeLayer === 'regional') &&
          pendingRecs.map(rec => {
            const recipient = facilities.find(f => f.id === rec.recipientFacilityId);
            const donor = facilities.find(f => f.id === rec.donorFacilityId);

            if (!recipient || !donor) return null;

            const polylineCoords: [number, number][] = [
              [donor.lat, donor.lng],
              [recipient.lat, recipient.lng],
            ];

            return (
              <React.Fragment key={rec.id}>
                <Polyline
                  positions={polylineCoords}
                  pathOptions={{
                    color: '#38bdf8',
                    weight: 4,
                    opacity: 0.85,
                    dashArray: '8, 8',
                  }}
                  className="animated-transfer-line"
                >
                  <Tooltip sticky permanent direction="center" className="transfer-tooltip">
                    <div className="glass-panel p-2 rounded-lg text-xs font-semibold text-slate-100 flex items-center gap-2 border border-cyan-500/50 shadow-lg">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>
                        {donor.name.split(' ')[0]} ➔ {recipient.name.split(' ')[0]}
                      </span>
                      <span className="bg-cyan-950 text-cyan-300 font-mono px-1.5 py-0.5 rounded border border-cyan-800">
                        {rec.recommendedTransferUnits} {rec.medicineName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({rec.donorTravelTimeHours}h transit)
                      </span>
                    </div>
                  </Tooltip>
                </Polyline>
              </React.Fragment>
            );
          })}
      </MapContainer>
    </div>
  );
};


