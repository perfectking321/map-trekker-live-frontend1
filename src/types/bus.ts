/**
 * Represents a single bus stop, with a unique ID, name, and geographic location.
 */
export interface BusStop {
  id: string;
  name: string;
  location: [number, number]; // [longitude, latitude]
}

/**
 * Defines a bus route, including its name, an ordered list of stops, and the geographic path.
 */
export interface BusRoute {
  id: string;
  name: string;
  stops: BusStop[];
  path: [number, number][]; // A list of coordinates [lng, lat] that form the route's path.
}

/**
 * Represents the real-time data of an active bus.
 */
export interface LiveBus {
  id: string; // Unique ID for the bus, can be linked to the driver.
  routeId: string;
  location: [number, number]; // Current [longitude, latitude]
  speed: number; // Speed in km/h, used for ETA calculations.
  nextStopIndex: number; // The index of the next stop in the BusRoute's stops array.
  crowdLevel: 'low' | 'medium' | 'high'; // Crowd level reported by the driver.
}
