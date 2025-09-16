
export interface LiveBus {
  id: string;
  route: string;
  currentLocation: [number, number]; // [lat, lng]
  destination: string;
  nextStop: string;
  etaToNextStop: number; // minutes
  crowdLevel: 'low' | 'medium' | 'high';
  speed: number; // km/h
  direction: number; // degrees
  lastUpdated: Date;
}

export interface BusRoute {
  id: string;
  name: string;
  stops: Array<{
    id: string;
    name: string;
    location: [number, number];
    order: number;
  }>;
  path: [number, number][]; // Route coordinates
}
