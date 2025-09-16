
import axios from 'axios';
import mockData from '../data.json';

export interface BusStopProperties {
  name: string;
  osm_id: string;
  highway?: string;
  [key: string]: any;
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

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = 'https://warner-qld-yamaha-briefly.trycloudflare.com';
  }

  // Set the API base URL
  setBaseURL(url: string) {
    this.baseURL = url;
  }

  // Fetch all bus stops - Updated to handle different response formats
  async getBusStops(): Promise<BusStopsGeoJSON> {
    try {
      console.log('Fetching bus stops from:', `${this.baseURL}/api/all-highways/`);
      const response = await axios.get(`${this.baseURL}/api/all-highways/`);
      console.log('Raw API Response:', response.data);
      
      // Check if response is already in GeoJSON format
      if (response.data && response.data.type === 'FeatureCollection') {
        return response.data;
      }
      
      // If response is an array of bus stops, convert to GeoJSON
      if (Array.isArray(response.data)) {
        return this.convertToGeoJSON(response.data);
      }
      
      // If response has a different structure, try to extract the data
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return this.convertToGeoJSON(response.data.data);
      }
      
      console.warn('Invalid API response structure:', response.data);
      return this.getMockBusStops();
      
    } catch (error) {
      console.error('Error fetching bus stops:', error);
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('URL:', error.config?.url);
      }
      
      return this.getMockBusStops();
    }
  }

  // Convert API response to GeoJSON format
  private convertToGeoJSON(data: any[]): BusStopsGeoJSON {
    const features = data.map((item, index) => {
      let coordinates: [number, number];
      let name: string;
      let osm_id: string;
      let highway: string;

      if (item.geometry && typeof item.geometry === 'string') {
        const pointString = item.geometry.split(';')[1];
        const coords = pointString.replace('POINT (', '').replace(')', '').split(' ');
        coordinates = [parseFloat(coords[0]), parseFloat(coords[1])];
      } else {
        coordinates = [77.4126, 23.2599];
      }

      name = item.properties.name || `Bus Stop ${item.id}`;
      osm_id = item.id.toString();
      highway = item.properties.highway || 'primary';

      return {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates
        },
        properties: {
          name,
          osm_id,
          highway
        }
      };
    });

    return {
      type: 'FeatureCollection',
      features
    };
  }

  // Search bus stops by name
  async searchBusStops(query: string): Promise<BusStopsGeoJSON> {
    try {
      const response = await axios.get(`${this.baseURL}/api/all-highways/`, {
        params: { search: query }
      });
      
      if (response.data && response.data.type === 'FeatureCollection') {
        return response.data;
      }
      
      if (Array.isArray(response.data)) {
        return this.convertToGeoJSON(response.data);
      }
      
      const mockData = this.getMockBusStops();
      const filtered = {
        ...mockData,
        features: mockData.features.filter(feature => 
          feature.properties.name.toLowerCase().includes(query.toLowerCase())
        )
      };
      return filtered;
    } catch (error) {
      console.error('Error searching bus stops:', error);
      
      const mockData = this.getMockBusStops();
      const filtered = {
        ...mockData,
        features: mockData.features.filter(feature => 
          feature.properties.name.toLowerCase().includes(query.toLowerCase())
        )
      };
      return filtered;
    }
  }

  // Filter bus stops by highway
  async filterBusStops(highway?: string): Promise<BusStopsGeoJSON> {
    try {
      const params: any = {};
      if (highway) params.highway = highway;
      
      const response = await axios.get(`${this.baseURL}/api/all-highways/`, {
        params
      });
      
      if (response.data && response.data.type === 'FeatureCollection') {
        return response.data;
      }
      
      if (Array.isArray(response.data)) {
        return this.convertToGeoJSON(response.data);
      }
      
      return this.getMockBusStops();
    } catch (error) {
      console.error('Error filtering bus stops:', error);
      return this.getMockBusStops();
    }
  }

  // Fetch bus stops for a specific city/area
  async getBusStopsByLocation(city: string = 'bhopal'): Promise<BusStopsGeoJSON> {
    try {
      console.log(`Fetching bus stops for ${city} from:`, `${this.baseURL}/api/all-highways/`);
      const response = await axios.get(`${this.baseURL}/api/all-highways/`, {
        params: { city: city.toLowerCase() }
      });
      console.log('API Response:', response.data);
      
      if (response.data && response.data.type === 'FeatureCollection') {
        return response.data;
      }
      
      if (Array.isArray(response.data)) {
        return this.convertToGeoJSON(response.data);
      }
      
      console.warn('Invalid API response structure:', response.data);
      return this.getMockBusStops();
      
    } catch (error) {
      console.error(`Error fetching bus stops for ${city}:`, error);
      return this.getMockBusStops();
    }
  }

  // Mock data for development/demo
  private getMockBusStops(): BusStopsGeoJSON {
    return this.convertToGeoJSON(mockData.bus_stops.features);
  }
}

export default new ApiService();
