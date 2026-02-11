import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BusStopsGeoJSON, BusStopFeature, BusRoutePath } from '@/services/api';
import { LiveBus } from '@/types/bus';
import 'leaflet-routing-machine'; // Add this import for routing functionality
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Add this for routing styles

// Fix for default markers in Leaflet with Webpack
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- Custom Icons ---
const busIcon = L.icon({
  iconUrl: '/images/bus-icon.png', // Corrected path
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const userIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div class="relative">
      <div class="w-4 h-4 bg-blue-500 rounded-full shadow-lg border-2 border-white"></div>
      <div class="absolute -inset-2 rounded-full bg-blue-500/30 animate-ping"></div>
    </div>
  `,
});

const busStopIcon = L.divIcon({
  className: 'bus-stop-marker',
  html: `<div class="w-3 h-3 bg-success border-2 border-green-600 shadow-md"></div>`,
});


interface BusMapProps {
  busStops: BusStopsGeoJSON;
  liveBuses: LiveBus[];
  userLocation: { lat: number; lng: number } | null;
  busRoutes: BusRoutePath[]; // Add busRoutes to props
  onBusStopSelect?: (busStop: BusStopFeature) => void;
}

const BusMap: React.FC<BusMapProps> = ({ busStops, liveBuses, userLocation, busRoutes, onBusStopSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const liveBusLayerRef = useRef<L.LayerGroup | null>(null);
  const userLayerRef = useRef<L.LayerGroup | null>(null);
  // Add a ref for the routing control instance
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  // Initialize map and optionally routing
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        zoomControl: false,
      }).setView([12.8239, 80.0423], 13); // Default view

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);
      
      markersLayerRef.current = L.layerGroup().addTo(map);
      liveBusLayerRef.current = L.layerGroup().addTo(map);
      userLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Initialize routing control to address the type error
      // This part assumes you intend to use leaflet-routing-machine.
      // If not, the error is likely in another file that uses BusMap.tsx
      // and incorrectly configures routing.
      if (typeof L.Routing !== 'undefined') {
        routingControlRef.current = L.Routing.control({
          waypoints: [], // Start with empty waypoints
          router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1'
          }),
          // The fix for the error: ensure all LineOptions properties are present
          altLineOptions: {
            styles: [
              { color: 'black', opacity: 0.15, weight: 9 },
              { color: 'white', opacity: 0.8, weight: 6 },
              { color: 'blue', opacity: 1, weight: 2 }
            ],
            // These properties were missing and caused the TypeScript error
            extendToWaypoints: true,
            missingRouteTolerance: 10
          },
          showAlternatives: true,
          routeWhileDragging: true,
          fitSelectedRoutes: true,
          // Set to false if you want to hide the default routing UI
          // show: false,
        }).addTo(map);
      }
    }

    return () => {
      // Cleanup routing control
      if (routingControlRef.current) {
        mapInstanceRef.current?.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
      // Cleanup map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount

  // Update bus stop markers
  useEffect(() => {
    if (!markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    busStops.features.forEach((feature) => {
      if (feature.geometry.type === 'Point') {
        const [lng, lat] = feature.geometry.coordinates;
        const marker = L.marker([lat, lng], { icon: busStopIcon })
          .bindPopup(`<b>${feature.properties.name}</b>`)
          .on('click', () => onBusStopSelect?.(feature));
        markersLayerRef.current?.addLayer(marker);
      }
    });
  }, [busStops, onBusStopSelect]);

  // Update live bus markers (now driven by liveBuses prop)
  useEffect(() => {
    if (!liveBusLayerRef.current) return;
    liveBusLayerRef.current.clearLayers();

    liveBuses.forEach(bus => {
      const [lng, lat] = bus.location;
      const marker = L.marker([lat, lng], { icon: busIcon })
        .bindPopup(`<b>Route:</b> ${bus.routeId}<br><b>Crowd:</b> ${bus.crowdLevel}`);
      liveBusLayerRef.current?.addLayer(marker);
    });
  }, [liveBuses]);

  // Update user location marker
  useEffect(() => {
    if (!userLayerRef.current) return;
    userLayerRef.current.clearLayers();

    if (userLocation) {
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(userLayerRef.current);
    }
  }, [userLocation]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg border border-border" />
      
      {/* Restored Map Legend */}
      <div className="pointer-events-none absolute top-3 left-3 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
          </div>
          <span className="text-xs">Your Location</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <img src="/images/bus-icon.png" alt="Bus" className="w-4 h-4" />
          <span className="text-xs">Live Buses</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-success border-2 border-green-600"></div>
          <span className="text-xs">Bus Stops</span>
        </div>
      </div>

      <style>{`
        .user-location-marker, .bus-stop-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper { background: hsl(var(--card)) !important; border: 1px solid hsl(var(--border)) !important; }
        .leaflet-popup-content { margin: 12px !important; }
        .leaflet-popup-tip { background: hsl(var(--card)) !important; }
        .leaflet-control-zoom a { background: hsl(var(--card)) !important; border: 1px solid hsl(var(--border)) !important; color: hsl(var(--foreground)) !important; }
        .leaflet-control-zoom a:hover { background: hsl(var(--accent)) !important; }
      `}</style>
    </div>
  );
};

export default BusMap;
