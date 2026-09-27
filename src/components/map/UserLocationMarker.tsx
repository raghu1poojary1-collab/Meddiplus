import React, { useEffect, useRef } from 'react';
import { Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { UserLocation } from '../../types/nearbyHospital';

// Create animated cyan/blue pin for User Location
const createUserLocationIcon = () => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
      <defs>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0284c7" flood-opacity="0.8"/>
        </filter>
      </defs>
      <circle cx="20" cy="20" r="18" fill="#0284c7" fill-opacity="0.3" class="animate-ping"/>
      <path d="M20 0C10.059 0 2 8.059 2 18c0 13.5 18 30 18 30s18-16.5 18-30C38 8.059 29.941 0 20 0z" fill="#0ea5e9" filter="url(#glow)"/>
      <circle cx="20" cy="18" r="10" fill="#0f172a"/>
      <circle cx="20" cy="18" r="5" fill="#38bdf8"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-user-location-pin',
    html: svgString,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -46],
  });
};

interface UserLocationMarkerProps {
  userLocation: UserLocation;
  autoCenterOnce?: boolean;
  centerCount?: number;
}

export const UserLocationMarker: React.FC<UserLocationMarkerProps> = ({
  userLocation,
  autoCenterOnce = true,
  centerCount = 0,
}) => {
  const map = useMap();
  const initialCenteredRef = useRef<boolean>(false);
  const prevCenterCountRef = useRef<number>(centerCount);

  // Center on initial location acquisition
  useEffect(() => {
    if (autoCenterOnce && userLocation && !initialCenteredRef.current) {
      initialCenteredRef.current = true;
      map.flyTo([userLocation.latitude, userLocation.longitude], 13, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [userLocation, autoCenterOnce, map]);

  // Center explicitly when user clicks "Center on Me"
  useEffect(() => {
    if (centerCount > prevCenterCountRef.current && userLocation) {
      prevCenterCountRef.current = centerCount;
      map.flyTo([userLocation.latitude, userLocation.longitude], 14, {
        animate: true,
        duration: 1.0,
      });
    }
  }, [centerCount, userLocation, map]);

  return (
    <>
      {/* Accuracy Circle */}
      <Circle
        center={[userLocation.latitude, userLocation.longitude]}
        radius={userLocation.accuracy}
        pathOptions={{
          color: '#38bdf8',
          fillColor: '#0284c7',
          fillOpacity: 0.18,
          weight: 2,
          dashArray: '4, 6',
        }}
      />

      {/* User Location Marker */}
      <Marker
        position={[userLocation.latitude, userLocation.longitude]}
        icon={createUserLocationIcon()}
        zIndexOffset={1000}
      >
        <Popup className="medflow-map-popup">
          <div className="p-2 w-64 text-slate-100 space-y-1.5">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></span>
              <h4 className="font-bold text-sm text-cyan-300">📍 You Are Here</h4>
            </div>
            <div className="text-xs space-y-1 font-mono text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Latitude:</span>
                <span className="text-white font-semibold">{userLocation.latitude.toFixed(5)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Longitude:</span>
                <span className="text-white font-semibold">{userLocation.longitude.toFixed(5)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">GPS Accuracy:</span>
                <span className="text-cyan-400 font-semibold">± {userLocation.accuracy} meters</span>
              </div>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800 text-right">
                Updated: {new Date(userLocation.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  );
};

