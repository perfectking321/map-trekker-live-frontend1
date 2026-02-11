import axios from 'axios';
import mockData from '../data.json';

export interface BusStopProperties {
  name: string;
  osm_id: string;
  highway?: string;
}

export interface BusStopFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: BusStopProperties;
}

export interface BusStopsGeoJSON {
  type: 'FeatureCollection';
  features: BusStopFeature[];
}

export interface BusRoutePath {
  id: string;
  name: string;
  path: [number, number][]; // A list of coordinates [lng, lat]
}

class ApiService {
  private baseURL: string;

  constructor() {
    // The API endpoint is currently unreachable.
    // We will default to using mock data.
    this.baseURL = 'https://warner-qld-yamaha-briefly.trycloudflare.com';
  }

  setBaseURL(url: string) {
    this.baseURL = url;
    // In a real scenario, we might try to reconnect or re-fetch data here.
  }

  // Helper to convert raw data (from JSON file) to GeoJSON
  private convertToGeoJSON(data: Array<{
    id: number | string;
    geometry: string;
    properties: { name?: string; highway?: string };
  }>): BusStopsGeoJSON {
    const features: BusStopFeature[] = data.map((item) => {
      let coordinates: [number, number] = [0, 0];
      // The geometry string from the JSON is in WKT format
      if (item.geometry && typeof item.geometry === 'string') {
        const pointString = item.geometry.split(';')[1].trim();
        const coords = pointString.replace('POINT (', '').replace(')', '').split(' ');
        coordinates = [parseFloat(coords[0]), parseFloat(coords[1])];
      }

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates,
        },
        properties: {
          name: item.properties.name || `Bus Stop ${item.id}`,
          osm_id: item.id.toString(),
          highway: item.properties.highway || 'primary',
        },
      };
    });

    return {
      type: 'FeatureCollection',
      features,
    };
  }
  
  // Mock data for development/demo
  private getMockBusStops(): BusStopsGeoJSON {
    // The structure in data.json is slightly different
    return this.convertToGeoJSON(mockData.bus_stops.features);
  }

  private getMockBusRoutes(): BusRoutePath[] {
    return mockData.bus_routes.map(route => ({
      ...route,
      path: route.path.map(coord => [coord[0], coord[1]] as [number, number])
    }));
  }

  // --- PUBLIC METHODS ---
  // All methods now reliably fall back to mock data.

  async getBusStops(): Promise<BusStopsGeoJSON> {
    console.log("Using mock data for bus stops.");
    return this.getMockBusStops();
  }

  async getBusRoutes(): Promise<BusRoutePath[]> {
    console.log("Using mock data for bus routes.");
    return this.getMockBusRoutes();
  }

  async searchBusStops(query: string): Promise<BusStopsGeoJSON> {
    console.log(`Searching mock data for: ${query}`);
    const mock = this.getMockBusStops();
    if (!query) return mock;

    const filteredFeatures = mock.features.filter(feature =>
      feature.properties.name.toLowerCase().includes(query.toLowerCase())
    );

    return { ...mock, features: filteredFeatures };
  }

  async filterBusStops(highway?: string): Promise<BusStopsGeoJSON> {
    console.log(`Filtering mock data by highway: ${highway}`);
    const mock = this.getMockBusStops();
    if (!highway) return mock;

    const filteredFeatures = mock.features.filter(feature =>
      feature.properties.highway === highway
    );

    return { ...mock, features: filteredFeatures };
  }

  async getBusStopsByLocation(city: string = 'bhopal'): Promise<BusStopsGeoJSON> {
    console.log(`Using mock data for location: ${city}`);
    return this.getMockBusStops();
  }
}

export default new ApiService();
