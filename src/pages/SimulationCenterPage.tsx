import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Sliders, 
  Truck, 
  TrendingUp, 
  ShieldAlert, 
  Play, 
  RotateCcw, 
  Sparkles, 
  PackageCheck,
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  MapPin,
  Compass,
  Radio,
  Crosshair,
  Navigation,
  Stethoscope,
  Activity,
  Droplet,
  Clock,
  Filter,
  Info,
  RefreshCw
} from 'lucide-react';
import { calculateHaversineDistance, formatDistance, getGoogleMapsDirectionsUrl } from '../services/nearbyHospitalsService';
import { ResourceStatus, ResourceCategory } from '../types/hospitalResource';

// --- SIMULATION DATA TYPES ---
interface SimulatedResourceItem {
  id: string;
  name: string;
  category: ResourceCategory;
  total: number;
  available: number;
  unit: string;
  status: ResourceStatus;
}

interface SimulatedDoctor {
  id: string;
  name: string;
  specialty: string;
  status: ResourceStatus;
  nextAvailability: string;
}

interface SimulatedHospital {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distanceMeters: number;
  distanceFormatted: string;
  specialties: string[];
  treatments: string[];
  resources: SimulatedResourceItem[];
  doctors: SimulatedDoctor[];
  lastUpdatedMinutesAgo: number;
  googleMapsUrl: string;
}

// --- CUSTOM MAP ICONS FOR SIMULATION ---
const createSimulatedUserIcon = () => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
      <defs>
        <filter id="sim-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#a855f7" flood-opacity="0.8"/>
        </filter>
      </defs>
      <circle cx="20" cy="20" r="18" fill="#a855f7" fill-opacity="0.3" class="animate-ping"/>
      <path d="M20 0C10.059 0 2 8.059 2 18c0 13.5 18 30 18 30s18-16.5 18-30C38 8.059 29.941 0 20 0z" fill="#c084fc" filter="url(#sim-glow)"/>
      <circle cx="20" cy="18" r="10" fill="#0f172a"/>
      <circle cx="20" cy="18" r="5" fill="#e9d5ff"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-simulated-user-pin',
    html: svgString,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -46],
  });
};

const createSimulatedHospitalIcon = (status: ResourceStatus, isSelected?: boolean) => {
  const color = status === 'AVAILABLE' ? '#10b981' : 
                status === 'LIMITED' ? '#f59e0b' : 
                status === 'NOT_AVAILABLE' ? '#f43f5e' : '#94a3b8';

  const size = isSelected ? 42 : 36;
  const height = isSelected ? 52 : 46;
  const borderStroke = isSelected ? '#a855f7' : '#0f172a';

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
    className: `custom-sim-hospital-pin ${isSelected ? 'marker-selected' : ''}`,
    html: svgString,
    iconSize: [size, height],
    iconAnchor: [size / 2, height],
    popupAnchor: [0, -height + 4],
  });
};

// Map Fly-To controller helper
const MapViewController: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom = 12 }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 1.2 });
  }, [center[0], center[1], zoom, map]);
  return null;
};

// --- GEOCODING UTILITY ---
async function geocodeLocation(locationText: string): Promise<{ lat: number; lng: number; displayName: string } | null> {
  const clean = locationText.trim();
  if (!clean) return null;

  // Lat, Lng numeric format check
  const latLngMatch = clean.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
  if (latLngMatch) {
    return {
      lat: parseFloat(latLngMatch[1]),
      lng: parseFloat(latLngMatch[3]),
      displayName: `Coordinates: ${latLngMatch[1]}, ${latLngMatch[3]}`,
    };
  }

  // Pre-configured dictionary for instant response on standard demo queries
  const presets: Record<string, { lat: number; lng: number; displayName: string }> = {
    'whitefield': { lat: 12.9698, lng: 77.7499, displayName: 'Whitefield, Bengaluru, Karnataka, India' },
    'whitefield, bengaluru': { lat: 12.9698, lng: 77.7499, displayName: 'Whitefield, Bengaluru, Karnataka, India' },
    'koramangala': { lat: 12.9352, lng: 77.6245, displayName: 'Koramangala, Bengaluru, Karnataka, India' },
    'koramangala, bengaluru': { lat: 12.9352, lng: 77.6245, displayName: 'Koramangala, Bengaluru, Karnataka, India' },
    'electronic city': { lat: 12.8399, lng: 77.6770, displayName: 'Electronic City, Bengaluru, Karnataka, India' },
    'electronic city, bengaluru': { lat: 12.8399, lng: 77.6770, displayName: 'Electronic City, Bengaluru, Karnataka, India' },
    'indiranagar': { lat: 12.9784, lng: 77.6408, displayName: 'Indiranagar, Bengaluru, Karnataka, India' },
    'indiranagar, bengaluru': { lat: 12.9784, lng: 77.6408, displayName: 'Indiranagar, Bengaluru, Karnataka, India' },
    'hebbal': { lat: 13.0358, lng: 77.5970, displayName: 'Hebbal, Bengaluru, Karnataka, India' },
    'hebbal, bengaluru': { lat: 13.0358, lng: 77.5970, displayName: 'Hebbal, Bengaluru, Karnataka, India' },
    'bengaluru': { lat: 12.9716, lng: 77.5946, displayName: 'Bengaluru, Karnataka, India' },
    'mumbai': { lat: 19.0760, lng: 72.8777, displayName: 'Mumbai, Maharashtra, India' },
    'delhi': { lat: 28.6139, lng: 77.2090, displayName: 'New Delhi, Delhi, India' },
    'new york': { lat: 40.7128, lng: -74.0060, displayName: 'New York City, NY, USA' },
  };

  const key = clean.toLowerCase();
  if (presets[key]) {
    return presets[key];
  }

  // Live OSM Nominatim Geocoding lookup
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(clean)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          displayName: data[0].display_name,
        };
      }
    }
  } catch (e) {
    console.warn('Geocoding API error:', e);
  }

  // Fallback coords
  return {
    lat: 12.9698,
    lng: 77.7499,
    displayName: `${clean} (Simulated Location)`,
  };
}

// --- DETERMINISTIC SIMULATED HOSPITAL GENERATOR ---
function generateSimulatedHospitals(userLat: number, userLng: number): SimulatedHospital[] {
  // Generate 5 deterministic hospitals spaced around user position
  const hospitalTemplates = [
    {
      idSuffix: 'citycare',
      namePrefix: 'CityCare Superspecialty Hospital',
      latOffset: 0.015,
      lngOffset: 0.012,
      addressSuffix: 'Main Healthcare Avenue',
      specialties: ['Urology', 'Cardiology', 'Emergency Medicine', 'Nephrology'],
      treatments: ['Kidney stone surgery', 'Angioplasty', 'Trauma Care', 'Dialysis'],
      baseIcu: 20, availIcu: 4,
      baseOt: 5, availOt: 0, // OT Unavailable!
      baseOPlus: 30, availOPlus: 12,
      baseOMinus: 15, availOMinus: 0, // O- Blood Unavailable!
      baseVentilator: 10, availVentilator: 2,
      baseDialysis: 8, availDialysis: -1, // UNKNOWN (-1)
      urologistAvailable: 'AVAILABLE' as ResourceStatus,
      cardiologistAvailable: 'AVAILABLE' as ResourceStatus,
    },
    {
      idSuffix: 'stjude',
      namePrefix: 'St. Jude Regional Medical Center',
      latOffset: -0.018,
      lngOffset: -0.014,
      addressSuffix: 'Health Plaza Sector 4',
      specialties: ['Urology', 'Orthopedics', 'General Surgery'],
      treatments: ['Kidney stone surgery', 'Fracture Repair', 'Appendectomy'],
      baseIcu: 15, availIcu: 0, // ICU Unavailable!
      baseOt: 4, availOt: 2,
      baseOPlus: 25, availOPlus: 0, // O+ Blood Unavailable!
      baseOMinus: 10, availOMinus: 4,
      baseVentilator: 8, availVentilator: 1,
      baseDialysis: 6, availDialysis: 2,
      urologistAvailable: 'LIMITED' as ResourceStatus,
      cardiologistAvailable: 'NOT_AVAILABLE' as ResourceStatus,
    },
    {
      idSuffix: 'apex',
      namePrefix: 'Apex Heart & Surgical Institute',
      latOffset: 0.022,
      lngOffset: -0.020,
      addressSuffix: 'Ring Road Bypass',
      specialties: ['Cardiology', 'Cardiothoracic Surgery', 'Urology'],
      treatments: ['Bypass Surgery', 'Angioplasty', 'Kidney stone surgery'],
      baseIcu: 30, availIcu: 12,
      baseOt: 8, availOt: 4,
      baseOPlus: 40, availOPlus: 22,
      baseOMinus: 20, availOMinus: 8,
      baseVentilator: 15, availVentilator: 6,
      baseDialysis: 10, availDialysis: 5,
      urologistAvailable: 'AVAILABLE' as ResourceStatus,
      cardiologistAvailable: 'AVAILABLE' as ResourceStatus,
    },
    {
      idSuffix: 'community',
      namePrefix: 'Northside Community Clinic & Hospital',
      latOffset: -0.025,
      lngOffset: 0.024,
      addressSuffix: 'Suburban Medical Link',
      specialties: ['General Medicine', 'Pediatrics'],
      treatments: ['Outpatient Care', 'Fever Management'],
      baseIcu: 5, availIcu: 1,
      baseOt: 2, availOt: 0,
      baseOPlus: 10, availOPlus: 2,
      baseOMinus: 5, availOMinus: 0,
      baseVentilator: 3, availVentilator: 0,
      baseDialysis: 0, availDialysis: 0,
      urologistAvailable: 'NOT_AVAILABLE' as ResourceStatus,
      cardiologistAvailable: 'NOT_AVAILABLE' as ResourceStatus,
    },
    {
      idSuffix: 'metro',
      namePrefix: 'Metropolitan Emergency Hospital',
      latOffset: 0.032,
      lngOffset: 0.035,
      addressSuffix: 'Central Expressway Junction',
      specialties: ['Trauma', 'Emergency Medicine', 'Urology', 'Cardiology'],
      treatments: ['Kidney stone surgery', 'Trauma Resuscitation', 'Dialysis'],
      baseIcu: 25, availIcu: 8,
      baseOt: 6, availOt: 3,
      baseOPlus: 35, availOPlus: 18,
      baseOMinus: 15, availOMinus: 5,
      baseVentilator: 12, availVentilator: 4,
      baseDialysis: 8, availDialysis: 3,
      urologistAvailable: 'AVAILABLE' as ResourceStatus,
      cardiologistAvailable: 'AVAILABLE' as ResourceStatus,
    },
  ];

  return hospitalTemplates.map(tpl => {
    const hospLat = userLat + tpl.latOffset;
    const hospLng = userLng + tpl.lngOffset;
    const distMeters = calculateHaversineDistance(userLat, userLng, hospLat, hospLng);

    const resources: SimulatedResourceItem[] = [
      {
        id: `${tpl.idSuffix}-icu`,
        name: 'ICU Bed',
        category: 'BED',
        total: tpl.baseIcu,
        available: tpl.availIcu,
        unit: 'beds',
        status: tpl.availIcu === 0 ? 'NOT_AVAILABLE' : tpl.availIcu <= 2 ? 'LIMITED' : 'AVAILABLE',
      },
      {
        id: `${tpl.idSuffix}-ot`,
        name: 'Operation Theatre',
        category: 'OT',
        total: tpl.baseOt,
        available: tpl.availOt,
        unit: 'theatres',
        status: tpl.availOt === 0 ? 'NOT_AVAILABLE' : tpl.availOt <= 1 ? 'LIMITED' : 'AVAILABLE',
      },
      {
        id: `${tpl.idSuffix}-o-plus`,
        name: 'O+ Blood',
        category: 'BLOOD',
        total: tpl.baseOPlus,
        available: tpl.availOPlus,
        unit: 'units',
        status: tpl.availOPlus === 0 ? 'NOT_AVAILABLE' : tpl.availOPlus <= 3 ? 'LIMITED' : 'AVAILABLE',
      },
      {
        id: `${tpl.idSuffix}-o-minus`,
        name: 'O- Blood',
        category: 'BLOOD',
        total: tpl.baseOMinus,
        available: tpl.availOMinus,
        unit: 'units',
        status: tpl.availOMinus === 0 ? 'NOT_AVAILABLE' : tpl.availOMinus <= 2 ? 'LIMITED' : 'AVAILABLE',
      },
      {
        id: `${tpl.idSuffix}-ventilator`,
        name: 'Ventilator',
        category: 'EQUIPMENT',
        total: tpl.baseVentilator,
        available: tpl.availVentilator,
        unit: 'machines',
        status: tpl.availVentilator === 0 ? 'NOT_AVAILABLE' : tpl.availVentilator <= 2 ? 'LIMITED' : 'AVAILABLE',
      },
      {
        id: `${tpl.idSuffix}-dialysis`,
        name: 'Dialysis Machine',
        category: 'EQUIPMENT',
        total: tpl.baseDialysis,
        available: tpl.availDialysis,
        unit: 'machines',
        status: tpl.availDialysis === -1 ? 'UNKNOWN' : tpl.availDialysis === 0 ? 'NOT_AVAILABLE' : tpl.availDialysis <= 2 ? 'LIMITED' : 'AVAILABLE',
      },
    ];

    const doctors: SimulatedDoctor[] = [
      {
        id: `${tpl.idSuffix}-dr-rahul`,
        name: 'Dr. Rahul Sharma',
        specialty: 'Urologist',
        status: tpl.urologistAvailable,
        nextAvailability: tpl.urologistAvailable === 'AVAILABLE' ? 'Today, 4:00 PM' : 'Tomorrow, 10:00 AM',
      },
      {
        id: `${tpl.idSuffix}-dr-priya`,
        name: 'Dr. Priya Nair',
        specialty: 'Cardiologist',
        status: tpl.cardiologistAvailable,
        nextAvailability: tpl.cardiologistAvailable === 'AVAILABLE' ? 'Today, 2:30 PM' : 'Next week',
      },
    ];

    return {
      id: `sim-hosp-${tpl.idSuffix}`,
      name: tpl.namePrefix,
      address: `${tpl.addressSuffix}, near ${userLat.toFixed(2)}, ${userLng.toFixed(2)}`,
      lat: hospLat,
      lng: hospLng,
      distanceMeters: distMeters,
      distanceFormatted: formatDistance(distMeters),
      specialties: tpl.specialties,
      treatments: tpl.treatments,
      resources,
      doctors,
      lastUpdatedMinutesAgo: 10,
      googleMapsUrl: getGoogleMapsDirectionsUrl(hospLat, hospLng, tpl.namePrefix, { latitude: userLat, longitude: userLng, accuracy: 0, timestamp: Date.now() }),
    };
  });
}

// Evaluate requirement match & status for a simulated hospital
function evaluateSimulatedRequirement(
  hospital: SimulatedHospital,
  requirement: string
): {
  overallStatus: ResourceStatus;
  matchReasons: string[];
  availableList: string[];
  limitedList: string[];
  unavailableList: string[];
  unknownList: string[];
} {
  const req = requirement.toLowerCase().trim();
  const matchReasons: string[] = [];

  const availableList: string[] = [];
  const limitedList: string[] = [];
  const unavailableList: string[] = [];
  const unknownList: string[] = [];

  // Match specialties & treatments
  if (req) {
    if (hospital.treatments.some(t => t.toLowerCase().includes(req) || req.includes(t.toLowerCase()))) {
      matchReasons.push(`✓ Treats ${requirement}`);
    }
    if (hospital.specialties.some(s => s.toLowerCase().includes(req) || req.includes(s.toLowerCase()))) {
      matchReasons.push(`✓ ${hospital.specialties[0]} Department Active`);
    }
  }

  // Doctor match
  const matchedDoctor = hospital.doctors.find(d => 
    !req || d.specialty.toLowerCase().includes(req) || req.includes(d.specialty.toLowerCase())
  );

  if (matchedDoctor) {
    if (matchedDoctor.status === 'AVAILABLE') {
      matchReasons.push(`✓ ${matchedDoctor.specialty} available (${matchedDoctor.name})`);
    } else if (matchedDoctor.status === 'LIMITED') {
      matchReasons.push(`⚠️ ${matchedDoctor.specialty} limited availability`);
    } else if (matchedDoctor.status === 'NOT_AVAILABLE') {
      matchReasons.push(`❌ ${matchedDoctor.specialty} currently unavailable`);
    }
  }

  // Categorize resources
  hospital.resources.forEach(res => {
    const isRelevant = !req || 
      res.name.toLowerCase().includes(req) || 
      req.includes(res.name.toLowerCase()) || 
      res.category.toLowerCase().includes(req);

    if (res.status === 'UNKNOWN') {
      unknownList.push(`${res.name} — Data unavailable`);
    } else if (res.status === 'NOT_AVAILABLE' || res.available === 0) {
      unavailableList.push(`❌ ${res.name} — 0/${res.total} ${res.unit} available`);
    } else if (res.status === 'LIMITED') {
      limitedList.push(`⚠️ ${res.name} — ${res.available}/${res.total} ${res.unit} remaining`);
      if (isRelevant) matchReasons.push(`⚠️ ${res.name} limited`);
    } else {
      availableList.push(`✓ ${res.name} — ${res.available}/${res.total} ${res.unit} available`);
      if (isRelevant) matchReasons.push(`✓ ${res.name} available`);
    }
  });

  // Calculate overall status for requirement
  let overallStatus: ResourceStatus = 'AVAILABLE';

  if (req) {
    if (matchedDoctor && matchedDoctor.status === 'NOT_AVAILABLE') {
      overallStatus = 'NOT_AVAILABLE';
    } else if (unavailableList.length > 2) {
      overallStatus = 'NOT_AVAILABLE';
    } else if (limitedList.length > 0 || (matchedDoctor && matchedDoctor.status === 'LIMITED')) {
      overallStatus = 'LIMITED';
    } else if (availableList.length > 0) {
      overallStatus = 'AVAILABLE';
    } else {
      overallStatus = 'UNKNOWN';
    }
  } else {
    if (unavailableList.length > 2) {
      overallStatus = 'LIMITED';
    }
  }

  return {
    overallStatus,
    matchReasons: matchReasons.length > 0 ? matchReasons : ['✓ General Emergency Healthcare Available'],
    availableList,
    limitedList,
    unavailableList,
    unknownList,
  };
}

// --- MAIN SIMULATION CENTER COMPONENT ---
export const SimulationCenterPage: React.FC = () => {
  // Location simulation state
  const [locationInput, setLocationInput] = useState<string>('Whitefield, Bengaluru');
  const [simulatedCoords, setSimulatedCoords] = useState<{ lat: number; lng: number; displayName: string }>({
    lat: 12.9698,
    lng: 77.7499,
    displayName: 'Whitefield, Bengaluru, Karnataka, India',
  });
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);

  // Search radius & requirement
  const [searchRadius, setSearchRadius] = useState<number>(10);
  const [medicalRequirement, setMedicalRequirement] = useState<string>('Kidney stone surgery');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);

  // Hospitals & Disruption simulation state
  const [hospitals, setHospitals] = useState<SimulatedHospital[]>([]);
  const [disruptionState, setDisruptionState] = useState<{
    stockDropPct: number;
    demandSpikePct: number;
    supplierDelayDays: number;
  }>({
    stockDropPct: 0,
    demandSpikePct: 0,
    supplierDelayDays: 0,
  });

  // Scenario Walkthrough state
  const [activeScenarioStep, setActiveScenarioStep] = useState<number>(1);
  const [isScenarioRunning, setIsScenarioRunning] = useState<boolean>(false);

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // 1. Initial & Geocoding Location change handler
  const handleApplyLocation = async (locStr: string = locationInput) => {
    setIsGeocoding(true);
    setGeocodingError(null);

    const geoResult = await geocodeLocation(locStr);
    if (geoResult) {
      setSimulatedCoords(geoResult);
      setLocationInput(locStr);
      setIsGeocoding(false);
    } else {
      setGeocodingError('Location not found. Try entering a more specific city or address.');
      setIsGeocoding(false);
    }
  };

  // 2. Generate/re-calculate simulated hospitals when location or disruption changes
  useEffect(() => {
    const rawHospitals = generateSimulatedHospitals(simulatedCoords.lat, simulatedCoords.lng);

    // Apply active disruption state to hospital resource counts
    const mutatedHospitals = rawHospitals.map(hosp => {
      const updatedResources = hosp.resources.map(res => {
        let avail = res.available;
        if (avail === -1) return res; // Unknown stays unknown

        // Apply Stock Drop %
        if (disruptionState.stockDropPct > 0) {
          avail = Math.max(0, Math.floor(avail * (1 - disruptionState.stockDropPct / 100)));
        }

        // Apply Demand Spike %
        if (disruptionState.demandSpikePct > 0) {
          avail = Math.max(0, Math.floor(avail * (1 - disruptionState.demandSpikePct / 100)));
        }

        // Apply Supplier Delay
        if (disruptionState.supplierDelayDays >= 5 && res.category === 'MEDICINE') {
          avail = Math.max(0, avail - 5);
        }

        const newStatus: ResourceStatus = avail === 0 ? 'NOT_AVAILABLE' : avail <= 2 ? 'LIMITED' : 'AVAILABLE';

        return {
          ...res,
          available: avail,
          status: newStatus,
        };
      });

      return {
        ...hosp,
        resources: updatedResources,
      };
    });

    setHospitals(mutatedHospitals);
  }, [simulatedCoords.lat, simulatedCoords.lng, disruptionState]);

  // Filter hospitals by selected search radius
  const filteredHospitals = hospitals.filter(h => h.distanceMeters <= searchRadius * 1000);

  // Prebuilt Crisis & Recovery Scenario step handler
  const handleLaunchScenario = () => {
    setIsScenarioRunning(true);
    setActiveScenarioStep(1);
    setDisruptionState({ stockDropPct: 0, demandSpikePct: 0, supplierDelayDays: 0 });

    setTimeout(() => {
      setActiveScenarioStep(2);
      setDisruptionState({ stockDropPct: 0, demandSpikePct: 0, supplierDelayDays: 5 });
    }, 3000);

    setTimeout(() => {
      setActiveScenarioStep(3);
      setDisruptionState({ stockDropPct: 60, demandSpikePct: 40, supplierDelayDays: 5 });
    }, 6000);

    setTimeout(() => {
      setActiveScenarioStep(4);
      // Recovery step
      setDisruptionState({ stockDropPct: 0, demandSpikePct: 0, supplierDelayDays: 0 });
      setIsScenarioRunning(false);
    }, 10000);
  };

  const handleResetScenario = () => {
    setIsScenarioRunning(false);
    setActiveScenarioStep(1);
    setDisruptionState({ stockDropPct: 0, demandSpikePct: 0, supplierDelayDays: 0 });
  };

  // Synchronized card scrolling
  useEffect(() => {
    if (selectedHospitalId && cardRefs.current[selectedHospitalId]) {
      cardRefs.current[selectedHospitalId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedHospitalId]);

  return (
    <div className="space-y-6 pb-8">
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-purple-400" />
            Healthcare Disruption & Location Simulation Center
          </h2>
          <p className="text-xs text-slate-400">
            Simulate custom user locations, test hospital resource matching, and trigger supply chain disruptions in real-time.
          </p>
        </div>

        {/* 🧪 MANDATORY SIMULATION MODE WARNING BANNER */}
        <div className="px-3.5 py-2 rounded-xl bg-purple-950/80 border border-purple-700 text-purple-200 text-xs font-mono font-bold flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
          <span>🧪 SIMULATION MODE ACTIVE</span>
        </div>
      </div>

      {/* 1. SIMULATED CURRENT LOCATION INPUT & CONTROLS */}
      <div className="glass-panel p-5 rounded-2xl border border-purple-500/40 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-purple-400" />
            <h3 className="font-extrabold text-white text-sm">🧪 Simulated Current Location</h3>
          </div>
          <span className="text-xs font-mono text-purple-300 bg-purple-950 px-2.5 py-1 rounded-lg border border-purple-800">
            Current Coords: {simulatedCoords.lat.toFixed(4)}, {simulatedCoords.lng.toFixed(4)}
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={locationInput}
              onChange={e => setLocationInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleApplyLocation()}
              placeholder="Enter city, locality, landmark or address (e.g. Whitefield, Bengaluru)..."
              className="w-full bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-400 font-medium pr-10"
            />
            {isGeocoding && (
              <RefreshCw className="w-4 h-4 text-purple-400 animate-spin absolute right-3 top-3" />
            )}
          </div>

          <button
            onClick={() => handleApplyLocation()}
            disabled={isGeocoding}
            className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-950/50 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Apply Location</span>
          </button>
        </div>

        {/* Preset Location Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-[11px]">
          <span className="text-slate-400 shrink-0">Quick Preset:</span>
          {[
            'Whitefield, Bengaluru',
            'Koramangala, Bengaluru',
            'Electronic City, Bengaluru',
            'Indiranagar, Bengaluru',
            'Hebbal, Bengaluru',
            'Mumbai',
            'Delhi',
            'New York',
          ].map(loc => (
            <button
              key={loc}
              onClick={() => handleApplyLocation(loc)}
              className={`px-2.5 py-1 rounded-lg border shrink-0 transition-all ${
                locationInput.toLowerCase() === loc.toLowerCase()
                  ? 'bg-purple-950 text-purple-300 border-purple-500 font-bold'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              📍 {loc}
            </button>
          ))}
        </div>

        {geocodingError && (
          <p className="text-xs text-rose-400 font-mono bg-rose-950/40 p-2 rounded border border-rose-900">
            ⚠️ {geocodingError}
          </p>
        )}
      </div>

      {/* 2. SEARCH RADIUS & MEDICAL REQUIREMENT INPUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Medical Requirement Input */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
          <label className="font-bold text-white text-xs flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-cyan-400" />
            Medical Requirement (Natural Language)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={medicalRequirement}
              onChange={e => setMedicalRequirement(e.target.value)}
              placeholder="e.g. Kidney stone surgery, Heart surgery, Need ICU bed, Need O+ blood..."
              className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono">
            <span className="text-slate-400 shrink-0">Examples:</span>
            {['Kidney stone surgery', 'Need ICU bed', 'Need O+ blood', 'Heart surgery', 'Need dialysis'].map(req => (
              <button
                key={req}
                onClick={() => setMedicalRequirement(req)}
                className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 hover:bg-slate-800 border border-slate-800 shrink-0"
              >
                {req}
              </button>
            ))}
          </div>
        </div>

        {/* Radius Selector */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-purple-400" />
              Search Radius Selector
            </label>
            <span className="font-mono text-purple-300 font-bold">{searchRadius} km</span>
          </div>

          <div className="grid grid-cols-4 gap-2 font-mono text-xs">
            {[5, 10, 20, 50].map(r => (
              <button
                key={r}
                onClick={() => setSearchRadius(r)}
                className={`py-2 rounded-xl font-bold transition-all text-center ${
                  searchRadius === r
                    ? 'bg-purple-600 text-white shadow border border-purple-400'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. SIMULATED MAP & SYNCHRONIZED HOSPITAL CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Leaflet Map (2 Columns) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl glass-panel h-[520px]">
            {/* Top Map Overlay */}
            <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between pointer-events-none">
              <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs shadow-lg flex items-center gap-2 font-mono">
                <span className="text-purple-300 font-bold">📍 Simulated Location:</span>
                <span className="text-white truncate max-w-[200px]">{simulatedCoords.displayName}</span>
              </div>

              <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs shadow-lg flex items-center gap-2 font-mono">
                <span className="text-slate-400">Marker Legend:</span>
                <span className="text-emerald-400">🟢 Avail</span>
                <span className="text-amber-400">🟡 Limit</span>
                <span className="text-rose-400">🔴 Unavail</span>
              </div>
            </div>

            <MapContainer
              center={[simulatedCoords.lat, simulatedCoords.lng]}
              zoom={12}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapViewController center={[simulatedCoords.lat, simulatedCoords.lng]} zoom={12} />

              {/* 📍 Simulated User Marker */}
              <Marker
                position={[simulatedCoords.lat, simulatedCoords.lng]}
                icon={createSimulatedUserIcon()}
                zIndexOffset={1000}
              >
                <Popup className="medflow-map-popup">
                  <div className="p-2 w-60 font-mono text-xs text-purple-300 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping"></span>
                      📍 Simulated Current Location
                    </div>
                    <div>{simulatedCoords.displayName}</div>
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                      Coords: {simulatedCoords.lat.toFixed(4)}, {simulatedCoords.lng.toFixed(4)}
                    </div>
                  </div>
                </Popup>
              </Marker>

              {/* 🏥 Simulated Hospital Markers */}
              {filteredHospitals.map(hosp => {
                const reqEval = evaluateSimulatedRequirement(hosp, medicalRequirement);
                return (
                  <Marker
                    key={hosp.id}
                    position={[hosp.lat, hosp.lng]}
                    icon={createSimulatedHospitalIcon(reqEval.overallStatus, selectedHospitalId === hosp.id)}
                    eventHandlers={{
                      click: () => setSelectedHospitalId(hosp.id),
                    }}
                  >
                    <Popup className="medflow-map-popup">
                      <div className="p-2 w-72 text-slate-100 space-y-2 font-mono text-xs">
                        <div className="font-bold text-white flex justify-between border-b border-slate-800 pb-1">
                          <span>🏥 {hosp.name}</span>
                          <span className="text-cyan-300">{hosp.distanceFormatted}</span>
                        </div>
                        <div className="text-[11px] text-slate-300 space-y-1">
                          <div>Requirement: <strong className="text-cyan-300">"{medicalRequirement}"</strong></div>
                          {reqEval.matchReasons.map((reason, idx) => (
                            <div key={idx} className="text-emerald-400">{reason}</div>
                          ))}
                        </div>
                        <div className="text-[10px] text-purple-300 pt-1 border-t border-slate-800 flex justify-between">
                          <span>🧪 Simulated Data</span>
                          <span>Updated {hosp.lastUpdatedMinutesAgo} mins ago</span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>

        {/* Hospital Resource List (1 Column) */}
        <div className="space-y-4">
          <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-xs uppercase font-mono flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-purple-400" />
                Simulated Nearby Hospitals ({filteredHospitals.length})
              </h3>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {filteredHospitals.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs space-y-2">
                  <Building2 className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>No hospitals found within {searchRadius} km of this simulated location.</p>
                  <button
                    onClick={() => setSearchRadius(searchRadius === 5 ? 10 : searchRadius === 10 ? 20 : 50)}
                    className="px-3 py-1 rounded-lg bg-purple-950 border border-purple-700 text-purple-300 font-bold text-xs"
                  >
                    Expand Search Radius ({searchRadius === 5 ? '10' : searchRadius === 10 ? '20' : '50'} km)
                  </button>
                </div>
              ) : (
                filteredHospitals.map(hosp => {
                  const reqEval = evaluateSimulatedRequirement(hosp, medicalRequirement);
                  const isSelected = selectedHospitalId === hosp.id;

                  return (
                    <div
                      key={hosp.id}
                      ref={el => (cardRefs.current[hosp.id] = el)}
                      onClick={() => setSelectedHospitalId(hosp.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 font-mono text-xs ${
                        isSelected
                          ? 'bg-slate-900 border-purple-500 shadow-lg shadow-purple-950/60 ring-1 ring-purple-400/50'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2">
                        <div>
                          <h4 className="font-bold text-white text-xs">🏥 {hosp.name}</h4>
                          <span className="text-[10px] text-cyan-300">📍 {hosp.distanceFormatted} away</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                            reqEval.overallStatus === 'AVAILABLE'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                              : reqEval.overallStatus === 'LIMITED'
                              ? 'bg-amber-950 text-amber-300 border-amber-700'
                              : reqEval.overallStatus === 'NOT_AVAILABLE'
                              ? 'bg-rose-950 text-rose-300 border-rose-700'
                              : 'bg-slate-900 text-slate-400 border-slate-700'
                          }`}
                        >
                          {reqEval.overallStatus === 'AVAILABLE' ? '🟢 Available' :
                           reqEval.overallStatus === 'LIMITED' ? '🟡 Limited' :
                           reqEval.overallStatus === 'NOT_AVAILABLE' ? '🔴 Unavailable' : '⚪ Unknown'}
                        </span>
                      </div>

                      {/* Requirement Match Reasons */}
                      <div className="space-y-0.5 text-[10px]">
                        {reqEval.matchReasons.map((reason, idx) => (
                          <div key={idx} className="text-cyan-300 font-semibold">{reason}</div>
                        ))}
                      </div>

                      {/* 🔴 MANDATORY SECTION: Currently Unavailable Resources */}
                      <div className="p-2 rounded bg-rose-950/40 border border-rose-900/60 space-y-1">
                        <span className="text-[10px] font-bold text-rose-300 uppercase block">
                          🔴 CURRENTLY UNAVAILABLE ({reqEval.unavailableList.length})
                        </span>
                        {reqEval.unavailableList.length === 0 ? (
                          <span className="text-[10px] text-slate-400">No reported stockouts</span>
                        ) : (
                          <div className="space-y-0.5 text-[10px] text-rose-200">
                            {reqEval.unavailableList.slice(0, 3).map((item, i) => (
                              <div key={i}>{item}</div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 🟢 CURRENTLY AVAILABLE */}
                      <div className="p-2 rounded bg-emerald-950/30 border border-emerald-900/60 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-300 uppercase block">
                          🟢 CURRENTLY AVAILABLE ({reqEval.availableList.length})
                        </span>
                        <div className="space-y-0.5 text-[10px] text-emerald-200">
                          {reqEval.availableList.slice(0, 3).map((item, i) => (
                            <div key={i}>{item}</div>
                          ))}
                        </div>
                      </div>

                      {/* ⚪ UNKNOWN SECTION */}
                      {reqEval.unknownList.length > 0 && (
                        <div className="p-2 rounded bg-slate-900/60 border border-slate-800 space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">
                            ⚪ AVAILABILITY UNKNOWN
                          </span>
                          <div className="text-[10px] text-slate-400">
                            {reqEval.unknownList.join(', ')}
                          </div>
                        </div>
                      )}

                      {/* Footer Info */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800 pt-1.5">
                        <span>Simulated Data • Updated {hosp.lastUpdatedMinutesAgo}m ago</span>
                        <a
                          href={hosp.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="text-cyan-400 hover:underline font-bold"
                        >
                          Directions ➔
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. PREBUILT CRISIS SCENARIO WALKTHROUGH */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/50 bg-gradient-to-r from-slate-950 via-purple-950/40 to-slate-950 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-950 text-purple-300 border border-purple-700 flex items-center gap-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Prebuilt Live Demo Walkthrough
            </span>
            <h3 className="text-lg font-bold text-white">Full-Spectrum Crisis & Recovery Simulation</h3>
            <p className="text-xs text-slate-400">
              Simulates a 5-day supplier failure, regional stockout spike, AI alternative hospital matching, and emergency transfer recovery.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLaunchScenario}
              disabled={isScenarioRunning}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isScenarioRunning ? 'Scenario Running...' : 'Launch Live Demo Scenario'}</span>
            </button>
            <button
              onClick={handleResetScenario}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
              title="Reset Scenario"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Scenario Timeline Progress Visualizer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
          <div className={`p-3 rounded-xl border transition-all ${
            activeScenarioStep === 1 ? 'bg-purple-950/80 border-purple-500 shadow-lg' : 'bg-slate-900/60 border-slate-800 opacity-70'
          }`}>
            <div className="text-slate-400 mb-1">Step 1: Baseline</div>
            <div className="font-sans font-bold text-white">Normal Stock</div>
            <p className="text-[11px] font-sans text-slate-400 mt-1">All hospitals report available resources.</p>
          </div>

          <div className={`p-3 rounded-xl border transition-all ${
            activeScenarioStep === 2 ? 'bg-amber-950/80 border-amber-500 shadow-lg' : 'bg-slate-900/60 border-slate-800 opacity-70'
          }`}>
            <div className="text-slate-400 mb-1">Step 2: +3 Seconds</div>
            <div className="font-sans font-bold text-white">Supplier Failure</div>
            <p className="text-[11px] font-sans text-slate-400 mt-1">5-day delivery delay reported across routes.</p>
          </div>

          <div className={`p-3 rounded-xl border transition-all ${
            activeScenarioStep === 3 ? 'bg-rose-950/80 border-rose-500 shadow-lg' : 'bg-slate-900/60 border-slate-800 opacity-70'
          }`}>
            <div className="text-slate-400 mb-1">Step 3: +6 Seconds</div>
            <div className="font-sans font-bold text-white">Critical Stock Drop</div>
            <p className="text-[11px] font-sans text-slate-400 mt-1">-60% inventory drop. ICU & blood turn 🔴 Unavailable.</p>
          </div>

          <div className={`p-3 rounded-xl border transition-all ${
            activeScenarioStep === 4 ? 'bg-emerald-950/80 border-emerald-500 shadow-lg' : 'bg-slate-900/60 border-slate-800 opacity-70'
          }`}>
            <div className="text-slate-400 mb-1">Step 4: +10 Seconds</div>
            <div className="font-sans font-bold text-white">Emergency Transfer</div>
            <p className="text-[11px] font-sans text-slate-400 mt-1">Alternative hospitals matched and stock recovered 🟢.</p>
          </div>
        </div>
      </div>

      {/* 5. MANUAL DISRUPTION CONTROLS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tool 1: Supplier Delay */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <Truck className="w-4 h-4 text-amber-400" />
            Simulate Supplier Delay
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Delay Duration (Days):</label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 3, 5, 8].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDisruptionState(prev => ({ ...prev, supplierDelayDays: d }))}
                    className={`py-1.5 rounded text-xs font-mono font-bold ${
                      disruptionState.supplierDelayDays === d ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}
                  >
                    +{d}d
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setDisruptionState(prev => ({ ...prev, supplierDelayDays: prev.supplierDelayDays === 5 ? 0 : 5 }))}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
            >
              {disruptionState.supplierDelayDays > 0 ? 'Clear Supplier Delay' : 'Apply Supplier Delay (+5 Days)'}
            </button>
          </div>
        </div>

        {/* Tool 2: Demand Spike */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Simulate Demand Spike
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Demand Surge Increase (%):</label>
              <input
                type="range"
                min="0"
                max="80"
                step="20"
                value={disruptionState.demandSpikePct}
                onChange={e => setDisruptionState(prev => ({ ...prev, demandSpikePct: Number(e.target.value) }))}
                className="w-full accent-cyan-400"
              />
              <div className="text-right font-mono text-cyan-400 font-bold text-xs">
                +{disruptionState.demandSpikePct}% Consumption
              </div>
            </div>

            <button
              onClick={() => setDisruptionState(prev => ({ ...prev, demandSpikePct: prev.demandSpikePct > 0 ? 0 : 40 }))}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
            >
              {disruptionState.demandSpikePct > 0 ? 'Reset Demand Spike' : 'Trigger Demand Spike (+40%)'}
            </button>
          </div>
        </div>

        {/* Tool 3: Stock Drop */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Simulate Inventory Drop
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Stock Reduction Percentage (%):</label>
              <input
                type="range"
                min="0"
                max="80"
                step="20"
                value={disruptionState.stockDropPct}
                onChange={e => setDisruptionState(prev => ({ ...prev, stockDropPct: Number(e.target.value) }))}
                className="w-full accent-rose-500"
              />
              <div className="text-right font-mono text-rose-400 font-bold text-xs">
                -{disruptionState.stockDropPct}% Inventory Drop
              </div>
            </div>

            <button
              onClick={() => setDisruptionState(prev => ({ ...prev, stockDropPct: prev.stockDropPct > 0 ? 0 : 50 }))}
              className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs shadow-md shadow-rose-500/20 transition-all"
            >
              {disruptionState.stockDropPct > 0 ? 'Reset Inventory Drop' : 'Reduce Stock (-50%)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
