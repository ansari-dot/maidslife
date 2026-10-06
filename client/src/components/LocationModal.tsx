import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X, Check, Crosshair, Loader2, Home, Briefcase, Tag, ChevronDown, ChevronUp, Clock, AlertTriangle } from 'lucide-react';

export interface LocationData {
  city: 'Dubai' | 'Abu Dhabi' | 'Sharjah' | string;
  area: string;
  address: string;
  lat: number;
  lng: number;
  countryCode?: string;
  buildingName?: string;
  apartmentNo?: string;
  floorNo?: string;
  streetNo?: string;
  label?: 'Home' | 'Office' | 'Other';
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (loc: LocationData) => void;
  currentLocation?: LocationData;
}

const EMIRATE_LOCATIONS = {
  Dubai: {
    center: { lat: 25.1972, lng: 55.2744 }, // Downtown Dubai / Business Bay
    popularAreas: [
      'Downtown Dubai',
      'Business Bay',
      'Dubai Marina',
      'Jumeirah Lakes Towers (JLT)',
      'Palm Jumeirah',
      'Jumeirah Village Circle (JVC)',
      'Al Barsha',
      'Dubai Hills Estate',
      'Arabian Ranches',
      'Deira & Bur Dubai',
    ],
  },
  'Abu Dhabi': {
    center: { lat: 24.4539, lng: 54.3773 }, // Abu Dhabi City
    popularAreas: [
      'Al Reem Island',
      'Corniche Area',
      'Yas Island',
      'Al Raha Beach',
      'Khalifa City',
      'Saadiyat Island',
      'Al Maryah Island',
    ],
  },
  Sharjah: {
    center: { lat: 25.3463, lng: 55.4209 }, // Sharjah Center
    popularAreas: [
      'Al Majaz',
      'Al Nahda (Sharjah)',
      'Al Taawun',
      'University City',
      'Al Qasimia',
      'Muwaileh',
      'Al Khan',
    ],
  },
};

const getValidCity = (cityStr?: string): 'Dubai' | 'Abu Dhabi' | 'Sharjah' => {
  if (!cityStr) return 'Dubai';
  if (cityStr.includes('Abu Dhabi')) return 'Abu Dhabi';
  if (cityStr.includes('Sharjah')) return 'Sharjah';
  return 'Dubai';
};

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  currentLocation,
}) => {
  const initialCity = getValidCity(currentLocation?.city);
  const cityData = EMIRATE_LOCATIONS[initialCity] || EMIRATE_LOCATIONS['Dubai'];

  const [selectedCity, setSelectedCity] = useState<'Dubai' | 'Abu Dhabi' | 'Sharjah'>(initialCity);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedArea, setSelectedArea] = useState(
    currentLocation?.area || cityData.popularAreas[0]
  );
  const [customAddress, setCustomAddress] = useState(
    currentLocation?.address || `${selectedArea}, ${selectedCity}, UAE`
  );
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>(
    currentLocation?.lat && currentLocation?.lng
      ? { lat: currentLocation.lat, lng: currentLocation.lng }
      : cityData.center
  );

  // Dynamic Country Code from Map Geocoding
  const [detectedCountryCode, setDetectedCountryCode] = useState<string>(currentLocation?.countryCode || 'ae');

  // Out of Service Area state
  const [isOutOfServiceArea, setIsOutOfServiceArea] = useState(false);

  // Building & Apartment Detailed Address States
  const [buildingName, setBuildingName] = useState(currentLocation?.buildingName || '');
  const [apartmentNo, setApartmentNo] = useState(currentLocation?.apartmentNo || '');
  const [floorNo, setFloorNo] = useState(currentLocation?.floorNo || '');
  const [streetNo, setStreetNo] = useState(currentLocation?.streetNo || '');
  const [addressLabel, setAddressLabel] = useState<'Home' | 'Office' | 'Other'>(currentLocation?.label || 'Home');
  const [showDetailsForm, setShowDetailsForm] = useState(false);

  // Saved Addresses & Recent Searches
  const [savedAddresses, setSavedAddresses] = useState<LocationData[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [showAreasDropdown, setShowAreasDropdown] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const searchTimeoutRef = useRef<any>(null);
  const autoDetectedRef = useRef(false);

  // Load Saved Addresses, Recent Searches & Auto-detect GPS on open
  useEffect(() => {
    if (!isOpen) return;

    try {
      const saved = localStorage.getItem('maidslife_saved_addresses');
      if (saved) setSavedAddresses(JSON.parse(saved));
      const recents = localStorage.getItem('maidslife_recent_searches');
      if (recents) setRecentSearches(JSON.parse(recents));
    } catch (e) {
      console.warn('LocalStorage parse error:', e);
    }

    // Auto GPS Detect on initial load if user hasn't explicitly chosen a coordinate
    if (!autoDetectedRef.current && !currentLocation?.lat && navigator.geolocation) {
      autoDetectedRef.current = true;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          if (leafletMapRef.current) {
            leafletMapRef.current.setView([latitude, longitude], 16);
          }
          reverseGeocode(latitude, longitude);
        },
        () => {},
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [isOpen]);

  // Load Leaflet Map dynamically
  useEffect(() => {
    if (!isOpen) return;

    const loadLeaflet = async () => {
      if (!(window as any).L) {
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        if (!document.getElementById('leaflet-js')) {
          const script = document.createElement('script');
          script.id = 'leaflet-js';
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          document.head.appendChild(script);

          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }
      }

      setTimeout(() => {
        initMap();
      }, 150);
    };

    loadLeaflet();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [isOpen]);

  const initMap = () => {
    const L = (window as any).L;
    if (!L || !mapContainerRef.current) return;

    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [coordinates.lat, coordinates.lng],
      zoom: 15,
      zoomControl: false,
    });

    // Reliable Google Maps Tile Layer (Real Google Maps visual style - NO API KEY REQUIRED)
    const googleTileLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      attribution: '&copy; Google Maps',
    }).addTo(map);

    // Automatic fallback to OpenStreetMap if Google tiles are restricted by webview policy
    googleTileLayer.on('tileerror', () => {
      if (!map._osmFallbackAdded) {
        map._osmFallbackAdded = true;
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap',
        }).addTo(map);
      }
    });

    leafletMapRef.current = map;
    tileLayerRef.current = googleTileLayer;

    // Trigger sequential Leaflet size recalculations for 100% mobile map rendering
    const forceResize = () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.invalidateSize(true);
      }
    };
    setTimeout(forceResize, 100);
    setTimeout(forceResize, 350);
    setTimeout(forceResize, 700);

    // Reverse Geocoding via 100% Free OpenStreetMap Nominatim API on drag end
    map.on('moveend', () => {
      const center = map.getCenter();
      setCoordinates({ lat: center.lat, lng: center.lng });
      reverseGeocode(center.lat, center.lng);
    });
  };

  // 100% Free Reverse Geocoding Call (Nominatim API - NO API KEY)
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      setIsGeocoding(true);
      const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;

      const res = await fetch(geocodeUrl, { headers: { 'Accept-Language': 'en' } });
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const road = addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood || '';
        const suburb = addr.suburb || addr.neighbourhood || addr.city_district || addr.quarter || '';
        const city = addr.city || addr.state || addr.county || selectedCity;
        const countryCode = (addr.country_code || 'ae').toLowerCase();
        const country = (addr.country || data.display_name || '').toLowerCase();

        setDetectedCountryCode(countryCode);

        // Check if location is inside UAE boundaries (Dubai, Abu Dhabi, Sharjah)
        const isUAE = countryCode === 'ae' || country.includes('united arab emirates') || country.includes('uae');
        const isCoordInUAE = lat >= 22.5 && lat <= 26.5 && lng >= 51.0 && lng <= 56.8;
        const isOut = !isUAE || !isCoordInUAE;

        setIsOutOfServiceArea(isOut);

        const displayArea = suburb || road || selectedArea;
        const displayFull = data.display_name
          ? data.display_name.split(',').slice(0, 3).join(',')
          : `${displayArea}, ${city}, UAE`;

        setSelectedArea(displayArea);
        setCustomAddress(displayFull);
      }
    } catch (err) {
      console.warn('Reverse geocoding error:', err);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Real Live Search API (Nominatim Places Search)
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ' UAE'
        )}&countrycodes=ae&limit=5`;

        const res = await fetch(searchUrl, { headers: { 'Accept-Language': 'en' } });
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data || []);
        }
      } catch (err) {
        console.warn('Search geocoding error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  // Select Search Suggestion Result
  const handleSelectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const displayName = result.display_name.split(',').slice(0, 3).join(',');

    const countryCode = (result.address?.country_code || '').toLowerCase();
    const country = (result.address?.country || displayName || '').toLowerCase();
    const isUAE = countryCode === 'ae' || country.includes('united arab emirates') || country.includes('uae');
    const isCoordInUAE = lat >= 22.5 && lat <= 26.5 && lng >= 51.0 && lng <= 56.8;

    setIsOutOfServiceArea(!isUAE || !isCoordInUAE);

    setCoordinates({ lat, lng });
    setCustomAddress(displayName);
    const namePart = result.name || result.display_name.split(',')[0];
    setSelectedArea(namePart);

    // Save to Recent Searches
    if (searchQuery.trim()) {
      const updated = [searchQuery.trim(), ...recentSearches.filter((q) => q !== searchQuery.trim())].slice(0, 5);
      setRecentSearches(updated);
      try {
        localStorage.setItem('maidslife_recent_searches', JSON.stringify(updated));
      } catch (e) {}
    }

    setSearchQuery('');
    setSearchResults([]);

    if (leafletMapRef.current) {
      leafletMapRef.current.setView([lat, lng], 16);
    }
  };

  // Handle "Set my location" GPS Button
  const handleSetMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setCoordinates({ lat: latitude, lng: longitude });

        if (leafletMapRef.current) {
          leafletMapRef.current.setView([latitude, longitude], 17);
        }

        reverseGeocode(latitude, longitude);
      },
      (err) => {
        setIsLocating(false);
        alert('Could not fetch GPS location. Please check browser permissions.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleConfirm = () => {
    if (isOutOfServiceArea) return;

    // Construct rich formatted full address string
    let baseAddr = customAddress || `${selectedArea}, ${selectedCity}, UAE`;
    const detailsArray = [];
    if (apartmentNo) detailsArray.push(`Apt/Villa ${apartmentNo}`);
    if (floorNo) detailsArray.push(`Floor ${floorNo}`);
    if (buildingName) detailsArray.push(buildingName);
    if (streetNo) detailsArray.push(streetNo);

    let fullFormattedAddress = baseAddr;
    if (detailsArray.length > 0) {
      fullFormattedAddress = `[${addressLabel}] ${detailsArray.join(', ')} - ${baseAddr}`;
    }

    const loc: LocationData = {
      city: selectedCity,
      area: selectedArea,
      address: fullFormattedAddress,
      lat: coordinates.lat,
      lng: coordinates.lng,
      countryCode: detectedCountryCode || 'ae',
      buildingName,
      apartmentNo,
      floorNo,
      streetNo,
      label: addressLabel,
    };

    localStorage.setItem('maidslife_selected_location', JSON.stringify(loc));
    onSelectLocation(loc);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white sm:bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full h-full sm:h-[660px] sm:max-w-[850px] sm:max-h-[92vh] bg-white rounded-none sm:rounded-[24px] shadow-2xl overflow-hidden flex flex-col">

        {/* ── FULL SCREEN MAP CANVAS (OFFICIAL GOOGLE MAPS TILES) ── */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-slate-100">
          <div
            ref={mapContainerRef}
            className="w-full h-full bg-slate-100"
            style={{ width: '100%', height: '100%', minHeight: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* ── CENTER PIN TOOLTIP & MARKER OVERLAY (EXACT JUSTLIFE DESIGN) ── */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-20 pointer-events-none flex flex-col items-center select-none">
            {/* Tooltip Badge */}
            {isOutOfServiceArea ? (
              <div className="bg-[#DC2626] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md mb-1.5 flex items-center gap-1.5 whitespace-nowrap animate-pulse">
                <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
                <span>We do not service this area yet</span>
              </div>
            ) : (
              <div className="bg-[#4A4A4A] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md mb-1.5 flex items-center gap-1.5 whitespace-nowrap">
                {isGeocoding ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0094FF]" />
                    <span>Updating address...</span>
                  </>
                ) : (
                  <span>Move the map to set the exact position</span>
                )}
              </div>
            )}

            {/* Teardrop Location Pin Icon (Exact Screenshot) */}
            <div className="relative flex flex-col items-center drop-shadow-[0_4px_12px_rgba(255,23,68,0.45)]">
              <svg
                width="38"
                height="46"
                viewBox="0 0 44 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 0C9.84974 0 0 9.84974 0 22C0 36.5 22 52 22 52C22 52 44 36.5 44 22C44 9.84974 34.1503 0 22 0Z"
                  fill={isOutOfServiceArea ? '#DC2626' : '#FF1744'}
                />
                <circle cx="22" cy="20" r="7" fill="white" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── TOP FLOATING SEARCH BAR (EXACT SCREENSHOT DESIGN) ── */}
        <div className="absolute top-4 left-4 right-4 z-30 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-slate-100 px-4 py-2 flex items-center gap-3 flex-1 min-w-0 h-13">
              <MapPin className="w-5 h-5 text-slate-900 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onFocus={() => setShowAreasDropdown(true)}
                placeholder="Search for area, street name, landmark..."
                className="w-full bg-transparent text-slate-800 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none min-w-0"
              />
              {isSearching && (
                <Loader2 className="w-4 h-4 text-[#0094FF] animate-spin shrink-0" />
              )}
            </div>

            {/* Close Button X */}
            <button
              type="button"
              onClick={onClose}
              className="w-11 h-11 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-slate-100 text-slate-600 hover:text-slate-900 flex items-center justify-center shrink-0 transition cursor-pointer active:scale-95"
              title="Close Modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Autocomplete Search Suggestions */}
          {searchResults.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-56 overflow-y-auto mt-1">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSearchResult(item)}
                  className="w-full text-left p-3 hover:bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-800 flex items-center gap-2.5 transition cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#0094FF] shrink-0" />
                  <span className="truncate">{item.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── FLOATING GPS TARGET BUTTON (EXACT SCREENSHOT BOTTOM RIGHT) ── */}
        <div className="absolute bottom-24 right-4 z-20 flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={handleSetMyLocation}
            disabled={isLocating}
            className="w-12 h-12 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-[#0094FF] hover:bg-slate-50 transition cursor-pointer active:scale-95 select-none"
            title="Set My Location"
          >
            <Crosshair className={`w-6 h-6 text-[#0094FF] ${isLocating ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* ── BOTTOM CONFIRMATION SHEET (EXACT SCREENSHOT DESIGN) ── */}
        <div className="absolute bottom-4 left-4 right-4 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col gap-3">
          
          {/* Out of Service Area Warning Banner */}
          {isOutOfServiceArea && (
            <div className="bg-amber-50 border border-amber-300/80 rounded-xl p-3 flex items-start gap-2 text-amber-900 text-xs font-bold animate-in fade-in duration-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-amber-950 text-xs">We are not servicing this area yet</p>
                <p className="text-[11px] text-amber-800 font-medium leading-relaxed mt-0.5">
                  We currently service <strong>Dubai</strong>, <strong>Abu Dhabi</strong>, and <strong>Sharjah</strong> in the UAE. Please drag the map pin inside our service area.
                </p>
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isOutOfServiceArea}
            className={`w-full py-3.5 rounded-full font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 shrink-0 ${
              isOutOfServiceArea
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 shadow-none'
                : 'bg-[#FFE699] hover:bg-[#FFDF80] text-[#0C3352] active:scale-95 cursor-pointer'
            }`}
          >
            {isOutOfServiceArea ? 'Location Out of Service Area' : 'Confirm Pin Location'}
          </button>
        </div>

      </div>
    </div>
  );
};
