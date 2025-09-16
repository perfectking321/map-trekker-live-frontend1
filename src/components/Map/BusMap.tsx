import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BusStopsGeoJSON, BusStopFeature } from '@/services/api';

// Fix for default markers in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface BusMapProps {
  busStops: BusStopsGeoJSON;
  onBusStopSelect?: (busStop: BusStopFeature) => void;
  center?: [number, number];
  zoom?: number;
}

const BusMap: React.FC<BusMapProps> = ({ 
  busStops, 
  onBusStopSelect,
  center = [12.9716, 77.5946], // Default to Bangalore
  zoom = 13
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const geolocationWatchIdRef = useRef<number | null>(null);
  const [selectedStop, setSelectedStop] = useState<BusStopFeature | null>(null);
  const hasAutoCenteredRef = useRef<boolean>(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map with dark theme
    const map = L.map(mapRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: false,
      attributionControl: true
    });

    // Add zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Use light theme tiles instead of dark
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: 'abc',
      maxZoom: 19
    }).addTo(map);

    // Create layers
    const markersLayer = L.layerGroup().addTo(map);
    const userLayer = L.layerGroup().addTo(map);
    
    mapInstanceRef.current = map;
    markersLayerRef.current = markersLayer;
    userLayerRef.current = userLayer;

    return () => {
      if (geolocationWatchIdRef.current !== null) {
        navigator.geolocation.clearWatch(geolocationWatchIdRef.current);
        geolocationWatchIdRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Setup geolocation tracking
  useEffect(() => {
    if (!mapInstanceRef.current || !userLayerRef.current) return;

    if (!('geolocation' in navigator)) {
      return;
    }

    const createOrUpdateUserMarker = (lat: number, lng: number) => {
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div class="relative">
            <div class="w-4 h-4 bg-blue-500 rounded-full shadow-lg border-2 border-white"></div>
            <div class="absolute -inset-2 rounded-full bg-blue-500/30 animate-ping"></div>
          </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      if (!userMarkerRef.current) {
        userMarkerRef.current = L.marker([lat, lng], { icon: userIcon, interactive: false });
        userLayerRef.current.addLayer(userMarkerRef.current);
      } else {
        userMarkerRef.current.setLatLng([lat, lng]);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        createOrUpdateUserMarker(latitude, longitude);
        if (mapInstanceRef.current && !hasAutoCenteredRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], Math.max(mapInstanceRef.current.getZoom(), 15));
          hasAutoCenteredRef.current = true;
        }
      },
      () => {
        // Silent fail
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
    );

    geolocationWatchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        createOrUpdateUserMarker(latitude, longitude);
      },
      () => {
        // Silent fail
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => {
      if (geolocationWatchIdRef.current !== null) {
        navigator.geolocation.clearWatch(geolocationWatchIdRef.current);
        geolocationWatchIdRef.current = null;
      }
    };
  }, []);

  // Update markers when bus stops change
  useEffect(() => {
    if (!markersLayerRef.current || !busStops.features.length) return;

    // Clear existing markers
    markersLayerRef.current.clearLayers();

    // Create custom bus stop icon as green square box
    const busStopIcon = L.divIcon({
      className: 'bus-stop-marker',
      html: `
        <div class="w-3 h-3 bg-success border-2 border-green-600 shadow-md" style="box-shadow: 0 0 0 2px rgba(0,0,0,0.05);"></div>
      `,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });

    // Add markers for each bus stop
    busStops.features.forEach((feature) => {
      if (feature.geometry.type === 'Point') {
        const [lng, lat] = feature.geometry.coordinates;
        
        const marker = L.marker([lat, lng], { icon: busStopIcon })
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold text-foreground">${feature.properties.name}</h3>
              <p class="text-sm text-muted-foreground">Highway: ${feature.properties.highway || 'N/A'}</p>
              <p class="text-xs text-muted-foreground">ID: ${feature.properties.osm_id}</p>
            </div>
          `)
          .on('click', () => {
            setSelectedStop(feature);
            onBusStopSelect?.(feature);
          });

        markersLayerRef.current?.addLayer(marker);
      }
    });

    // Fit bounds to show all markers if there are any
    if (busStops.features.length > 0 && markersLayerRef.current) {
      const layers = markersLayerRef.current.getLayers();
      if (layers.length > 0) {
        const group = L.featureGroup(layers);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [20, 20] });
        }
      }
    }
  }, [busStops, onBusStopSelect]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg shadow-lg border border-border overflow-hidden"
      />
      {/* Map Legend Overlay */}
      <div className="pointer-events-none absolute top-3 left-3 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative">
            <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
            <div className="absolute -inset-2 rounded-full bg-blue-500/30 animate-ping"></div>
          </div>
          <span className="text-xs">User location</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <img src="/images/bus-icon.png" alt="Bus" className="w-4 h-4" />
          <span className="text-xs">Nearby buses</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-success border-2 border-green-600"></div>
          <span className="text-xs">Bus stands</span>
        </div>
      </div>
      <style>{`
        .bus-stop-marker {
          background: transparent !important;
          border: none !important;
        }
        .user-location-marker { background: transparent !important; border: none !important; }
        .leaflet-popup-content-wrapper {
          background: hsl(var(--card)) !important;
          border: 1px solid hsl(var(--border)) !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
        }
        .leaflet-popup-tip {
          background: hsl(var(--card)) !important;
          border: 1px solid hsl(var(--border)) !important;
        }
        .leaflet-control-zoom a {
          background: hsl(var(--card)) !important;
          border: 1px solid hsl(var(--border)) !important;
          color: hsl(var(--foreground)) !important;
        }
        .leaflet-control-zoom a:hover {
          background: hsl(var(--accent)) !important;
        }
      `}</style>
    </div>
  );
};

export default BusMap;