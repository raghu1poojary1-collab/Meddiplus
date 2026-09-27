import React, { useEffect, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Star, 
  Navigation, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Info,
  Stethoscope,
  Activity,
  Droplet
} from 'lucide-react';
import { NearbyHospital } from '../../types/nearbyHospital';
import { evaluateHospitalResourceSearch } from '../../services/resourceSearchService';
import { ResourceStatus } from '../../types/hospitalResource';

// Create custom hospital icon for nearby discovered hospitals matching search query status
const createNearbyHospitalIcon = (status: ResourceStatus, isSelected?: boolean) => {
  const color = status === 'AVAILABLE' ? '#10b981' : 
                status === 'LIMITED' ? '#f59e0b' : 
                status === 'NOT_AVAILABLE' ? '#f43f5e' : '#94a3b8';
  
  const size = isSelected ? 42 : 36;
  const height = isSelected ? 52 : 46;
  const borderStroke = isSelected ? '#38bdf8' : '#0f172a';

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${height}" viewBox="0 0 36 46">
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.6"/>
      </filter>
      <path d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 28 18 28s18-14.5 18-28C36 8.059 27.941 0 18 0z" fill="${color}" stroke="${borderStroke}" stroke-width="${isSelected ? 2.5 : 1}" filter="url(#shadow)"/>
      <circle cx="18" cy="18" r="11" fill="#0f172a"/>
      <path d="M18 10.5v15M10.5 18h15" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>
    </svg>
  `;

  return L.divIcon({
    className: `custom-nearby-hospital-pin ${isSelected ? 'marker-selected' : ''}`,
    html: svgString,
    iconSize: [size, height],
    iconAnchor: [size / 2, height],
    popupAnchor: [0, -height + 4],
  });
};

interface NearbyHospitalMarkerProps {
  hospital: NearbyHospital;
  isSelected?: boolean;
  onSelect?: (hospital: NearbyHospital) => void;
  searchQuery?: string;
}

export const NearbyHospitalMarker: React.FC<NearbyHospitalMarkerProps> = ({
  hospital,
  isSelected,
  onSelect,
  searchQuery = '',
}) => {
  const markerRef = useRef<L.Marker | null>(null);
  const map = useMap();

  const searchResult = evaluateHospitalResourceSearch(hospital.id, hospital.name, searchQuery);

  useEffect(() => {
    if (isSelected && markerRef.current) {
      markerRef.current.openPopup();
      map.flyTo([hospital.lat, hospital.lng], Math.max(map.getZoom(), 14), {
        animate: true,
        duration: 0.8,
      });
    }
  }, [isSelected, hospital.lat, hospital.lng, map]);

  return (
    <Marker
      ref={markerRef}
      position={[hospital.lat, hospital.lng]}
      icon={createNearbyHospitalIcon(searchResult.overallStatus, isSelected)}
      eventHandlers={{
        click: () => onSelect?.(hospital),
      }}
    >
      <Popup className="medflow-map-popup">
        <div className="p-1.5 w-80 text-slate-100 space-y-2 max-h-[480px] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-2">
            <div>
              <h4 className="font-bold text-sm text-white flex items-center gap-1.5 leading-snug">
                <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
                {hospital.name}
              </h4>
              <span className="text-[10px] font-semibold text-cyan-300 font-mono">
                📍 {hospital.distanceFormatted} away
              </span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase font-mono shrink-0 border ${
                searchResult.overallStatus === 'AVAILABLE'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : searchResult.overallStatus === 'LIMITED'
                  ? 'bg-amber-950 text-amber-300 border-amber-700'
                  : searchResult.overallStatus === 'NOT_AVAILABLE'
                  ? 'bg-rose-950 text-rose-300 border-rose-700'
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
            >
              {searchResult.overallStatus === 'AVAILABLE' ? '🟢 Available' :
               searchResult.overallStatus === 'LIMITED' ? '🟡 Limited' :
               searchResult.overallStatus === 'NOT_AVAILABLE' ? '🔴 Unavailable' : '⚪ Unknown'}
            </span>
          </div>

          {/* User Requested Requirement Context Banner */}
          {searchQuery && (
            <div className="p-2 rounded-lg bg-slate-900 border border-cyan-800/60 text-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-cyan-300 font-mono">
                <span>Search Query: "{searchQuery}"</span>
                {searchResult.matchedProcedureName && (
                  <span className="text-amber-400 font-semibold">[{searchResult.matchedProcedureName}]</span>
                )}
              </div>
            </div>
          )}

          {/* Address & Basic Info */}
          <div className="text-[11px] text-slate-300 space-y-1">
            <div className="flex items-start gap-1 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>{hospital.address}</span>
            </div>
            {hospital.phoneNumber && (
              <div className="flex items-center gap-1.5 text-cyan-300 font-mono">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <a href={`tel:${hospital.phoneNumber}`} className="hover:underline">
                  {hospital.phoneNumber}
                </a>
              </div>
            )}
          </div>

          {/* 🔴 ALWAYS VISIBLE SECTION 1: Currently Unavailable Resources */}
          <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-900/80 space-y-1">
            <h5 className="text-[11px] font-bold text-rose-300 uppercase font-mono flex items-center gap-1 border-b border-rose-900/60 pb-1">
              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              🔴 Currently Unavailable
            </h5>
            {searchResult.unavailableResources.length === 0 ? (
              <p className="text-[10px] text-slate-400">No reported stockouts for this search query.</p>
            ) : (
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {searchResult.unavailableResources.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-[11px] text-rose-200 font-mono">
                    <span className="flex items-center gap-1">
                      ❌ {item.name}
                    </span>
                    <span className="font-bold">0/{item.total} {item.unit || ''}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 🟢 SECTION 2: Currently Available Resources */}
          <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-900/60 space-y-1">
            <h5 className="text-[11px] font-bold text-emerald-300 uppercase font-mono flex items-center gap-1 border-b border-emerald-900/60 pb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              🟢 Currently Available
            </h5>
            <div className="space-y-1 max-h-28 overflow-y-auto">
              {searchResult.availableResources.slice(0, 5).map(item => (
                <div key={item.id} className="flex items-center justify-between text-[11px] text-emerald-200 font-mono">
                  <span className="flex items-center gap-1">
                    ✓ {item.name}
                  </span>
                  <span className="font-bold text-emerald-400">{item.available}/{item.total} {item.unit || ''}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 🟡 SECTION 3: Limited Resources (if any) */}
          {searchResult.limitedResources.length > 0 && (
            <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-900/60 space-y-1">
              <h5 className="text-[11px] font-bold text-amber-300 uppercase font-mono flex items-center gap-1 border-b border-amber-900/60 pb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                🟡 Limited Availability
              </h5>
              <div className="space-y-1">
                {searchResult.limitedResources.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-[11px] text-amber-200 font-mono">
                    <span className="flex items-center gap-1">
                      ⚠️ {item.name}
                    </span>
                    <span className="font-bold text-amber-400">{item.available} remaining</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DATA FRESHNESS BANNER (MANDATORY REQUIREMENT) */}
          <div className={`p-2 rounded-lg text-[10px] font-mono border flex items-center justify-between ${
            searchResult.isOutdated 
              ? 'bg-amber-950/40 border-amber-800 text-amber-300' 
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <span className="flex items-center gap-1">
              {searchResult.isOutdated ? '⚠️ Data may be outdated' : '🟢 Verified Live Data'}
            </span>
            <span className="font-bold">{searchResult.timeAgoFormatted}</span>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-800 flex justify-end">
            <a
              href={hospital.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <Navigation className="w-3.5 h-3.5" />
              Get Directions
            </a>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};


