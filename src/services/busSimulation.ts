
import { LiveBus, BusRoute, BusStop } from '../types/bus';
import rawBusStops from '../data.json';

const activeBuses = new Map<string, LiveBus>();
const busRoutes: BusRoute[] = [];
let simulationInterval: NodeJS.Timeout | null = null;

const allBusStops: BusStop[] = rawBusStops.bus_stops.features.map((feature: any) => {
  const [lng, lat] = feature.geometry.replace('SRID=4326;POINT (', '').replace(')', '').split(' ').map(Number);
  return {
    id: feature.id.toString(),
    name: feature.properties.name || 'Unnamed Stop',
    location: [lng, lat],
  };
});

function initializeRoutes() {
  if (busRoutes.length > 0) return;

  const route1Stops = ['1', '31', '32', '33', '34', '35'].map(id => allBusStops.find(s => s.id === id)!);
  busRoutes.push({
    id: 'route-1',
    name: 'SRM University Loop',
    stops: route1Stops,
    path: route1Stops.map(s => s.location),
  });

  const route2Stops = ['2', '16', '17', '47', '48'].map(id => allBusStops.find(s => s.id === id)!);
  busRoutes.push({
    id: 'route-2',
    name: 'Tambaram Station Run',
    stops: route2Stops,
    path: route2Stops.map(s => s.location),
  });
}

function simulateBusMovement(bus: LiveBus) {
  const route = busRoutes.find(r => r.id === bus.routeId);
  if (!route) return;

  const nextStop = route.stops[bus.nextStopIndex];
  if (!nextStop) {
    bus.nextStopIndex = 0; // Loop back to the start
    return;
  }
  const [busLng, busLat] = bus.location;
  const [stopLng, stopLat] = nextStop.location;

  if (Math.abs(busLat - stopLat) < 0.0001 && Math.abs(busLng - stopLng) < 0.0001) {
    bus.nextStopIndex = (bus.nextStopIndex + 1) % route.stops.length;
  } else {
    const moveFactor = 0.1;
    bus.location = [
      busLng + (stopLng - busLng) * moveFactor,
      busLat + (stopLat - busLat) * moveFactor,
    ];
  }
}

function updateBusPositions() {
  activeBuses.forEach(simulateBusMovement);
}

function initializeDefaultBuses() {
  if (activeBuses.size > 0) return;

  // Start a bus on Route 1
  const route1 = busRoutes[0];
  const bus1: LiveBus = {
    id: 'default-bus-1',
    routeId: route1.id,
    location: [...route1.stops[0].location],
    speed: 40,
    nextStopIndex: 1,
    crowdLevel: 'low',
  };
  activeBuses.set(bus1.id, bus1);

  // Start a bus on Route 2
  const route2 = busRoutes[1];
  const bus2: LiveBus = {
    id: 'default-bus-2',
    routeId: route2.id,
    location: [...route2.stops[2].location], // Start at a different stop
    speed: 35,
    nextStopIndex: 3,
    crowdLevel: 'medium',
  };
  activeBuses.set(bus2.id, bus2);
}

export function startBusSimulation(driverId: string, routeId: string) {
  const route = busRoutes.find(r => r.id === routeId);
  if (!route) throw new Error('Route not found');

  const newBus: LiveBus = {
    id: driverId,
    routeId,
    location: [...route.stops[0].location],
    speed: 30,
    nextStopIndex: 1,
    crowdLevel: 'low',
  };

  activeBuses.set(driverId, newBus);
}

export function stopBusSimulation(driverId: string) {
  activeBuses.delete(driverId);
}

export function updateCrowdLevel(driverId: string, crowdLevel: 'low' | 'medium' | 'high') {
  const bus = activeBuses.get(driverId);
  if (bus) {
    bus.crowdLevel = crowdLevel;
  }
}

export function getAvailableRoutes(): BusRoute[] {
  return busRoutes;
}

export function getLiveBuses(): LiveBus[] {
  return Array.from(activeBuses.values());
}

// Initialize and start the simulation
(function start() {
  initializeRoutes();
  initializeDefaultBuses();
  if (!simulationInterval) {
    simulationInterval = setInterval(updateBusPositions, 2000);
  }
})();
