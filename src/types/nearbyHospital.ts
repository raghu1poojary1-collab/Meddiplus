export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number; // in meters
  timestamp: number;
}

export interface NearbyHospital {
  id: string;
  name: string;
  type: 'Hospital' | 'Emergency Hospital' | 'Medical Center' | 'Clinic';
  address: string;
  lat: number;
  lng: number;
  distanceMeters: number; // calculated via Haversine formula
  distanceFormatted: string; // e.g., "850 m" or "3.4 km"
  rating?: number;
  userRatingsTotal?: number;
  isOpenNow?: boolean;
  phoneNumber?: string;
  googleMapsUrl: string;
  source: 'Overpass OSM' | 'Google Places' | 'Regional System';
}

export interface GeolocationState {
  userLocation: UserLocation | null;
  locationPermission: 'prompt' | 'granted' | 'denied' | 'unsupported';
  isLocating: boolean;
  isLiveTracking: boolean;
  error: string | null;
  errorCode?: number;
}

export interface NearbySearchOptions {
  radiusKm: number; // Default 10km
  facilityType: 'all' | 'hospital' | 'clinic' | 'emergency';
}
