import { useState, useEffect, useRef, useCallback } from 'react';
import { UserLocation, GeolocationState } from '../types/nearbyHospital';
import { calculateHaversineDistance } from '../services/nearbyHospitalsService';

export interface ExtendedGeolocationState extends GeolocationState {
  movementThresholdMeters: number;
  lastSearchedLocation: UserLocation | null;
  needsHospitalRefresh: boolean;
}

export function useUserLocation(initialThresholdMeters: number = 250) {
  const [geoState, setGeoState] = useState<ExtendedGeolocationState>({
    userLocation: null,
    locationPermission: 'prompt',
    isLocating: false,
    isLiveTracking: false,
    error: null,
    movementThresholdMeters: initialThresholdMeters,
    lastSearchedLocation: null,
    needsHospitalRefresh: false,
  });

  const watchIdRef = useRef<number | null>(null);
  const lastPositionRef = useRef<UserLocation | null>(null);
  const lastSearchedRef = useRef<UserLocation | null>(null);
  const thresholdRef = useRef<number>(initialThresholdMeters);

  // Keep thresholdRef in sync with state
  useEffect(() => {
    thresholdRef.current = geoState.movementThresholdMeters;
  }, [geoState.movementThresholdMeters]);

  // Check initial permission status if available in browser
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoState(prev => ({
        ...prev,
        locationPermission: 'unsupported',
        error: 'Geolocation is not supported by your browser.',
      }));
      return;
    }

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'geolocation' as PermissionName })
        .then(result => {
          setGeoState(prev => ({
            ...prev,
            locationPermission: result.state as GeolocationState['locationPermission'],
          }));

          result.onchange = () => {
            setGeoState(prev => ({
              ...prev,
              locationPermission: result.state as GeolocationState['locationPermission'],
            }));
          };
        })
        .catch(() => {
          // Ignore permissions query errors on unsupported browsers
        });
    }
  }, []);

  const handleGeolocationError = useCallback((err: GeolocationPositionError) => {
    let errorMessage = 'An unknown error occurred while retrieving your location.';
    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMessage = 'Location access was denied. Please enable location permission in your browser settings to find nearby hospitals.';
        break;
      case err.POSITION_UNAVAILABLE:
        errorMessage = 'Location information is unavailable. Please check your GPS or network connection.';
        break;
      case err.TIMEOUT:
        errorMessage = 'Location request timed out. Please try refreshing your location.';
        break;
    }

    setGeoState(prev => ({
      ...prev,
      isLocating: false,
      isLiveTracking: false,
      error: errorMessage,
      errorCode: err.code,
      locationPermission: err.code === err.PERMISSION_DENIED ? 'denied' : prev.locationPermission,
    }));
  }, []);

  // One-time request for user's REAL current location
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser.',
      }));
      return;
    }

    setGeoState(prev => ({
      ...prev,
      isLocating: true,
      error: null,
    }));

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      position => {
        const newLocation: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          timestamp: position.timestamp,
        };

        lastPositionRef.current = newLocation;
        lastSearchedRef.current = newLocation;

        setGeoState(prev => ({
          ...prev,
          userLocation: newLocation,
          lastSearchedLocation: newLocation,
          needsHospitalRefresh: true,
          locationPermission: 'granted',
          isLocating: false,
          isLiveTracking: false,
          error: null,
        }));
      },
      err => handleGeolocationError(err),
      options
    );
  }, [handleGeolocationError]);

  // Stop watching live position
  const stopLiveTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setGeoState(prev => ({
      ...prev,
      isLiveTracking: false,
    }));
  }, []);

  // Start watching live position with configurable movement threshold check for hospital refresh
  const startLiveTracking = useCallback(() => {
    if (!navigator.geolocation) return;

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    setGeoState(prev => ({
      ...prev,
      isLiveTracking: true,
      error: null,
    }));

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 5000,
    };

    const watchId = navigator.geolocation.watchPosition(
      position => {
        const newLocation: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          timestamp: position.timestamp,
        };

        // Calculate distance moved from last searched location
        let shouldRefreshHospitals = false;
        const lastSearched = lastSearchedRef.current;

        if (!lastSearched) {
          shouldRefreshHospitals = true;
          lastSearchedRef.current = newLocation;
        } else {
          const distanceMovedFromSearch = calculateHaversineDistance(
            lastSearched.latitude,
            lastSearched.longitude,
            newLocation.latitude,
            newLocation.longitude
          );

          if (distanceMovedFromSearch >= thresholdRef.current) {
            shouldRefreshHospitals = true;
            lastSearchedRef.current = newLocation;
          }
        }

        lastPositionRef.current = newLocation;

        setGeoState(prev => ({
          ...prev,
          userLocation: newLocation,
          lastSearchedLocation: lastSearchedRef.current,
          needsHospitalRefresh: shouldRefreshHospitals ? true : prev.needsHospitalRefresh,
          locationPermission: 'granted',
          isLocating: false,
          error: null,
        }));
      },
      err => handleGeolocationError(err),
      options
    );

    watchIdRef.current = watchId;
  }, [handleGeolocationError]);

  const setMovementThreshold = useCallback((thresholdMeters: number) => {
    setGeoState(prev => ({
      ...prev,
      movementThresholdMeters: thresholdMeters,
    }));
  }, []);

  const acknowledgeHospitalRefresh = useCallback(() => {
    setGeoState(prev => ({
      ...prev,
      needsHospitalRefresh: false,
    }));
  }, []);

  // Clean up watcher on component unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    ...geoState,
    requestLocation,
    startLiveTracking,
    stopLiveTracking,
    setMovementThreshold,
    acknowledgeHospitalRefresh,
  };
}

