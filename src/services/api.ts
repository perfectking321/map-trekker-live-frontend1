import axios from 'axios';

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
      return this.getMockBhopalBusStops(); // Use Bhopal data as fallback
      
    } catch (error) {
      console.error('Error fetching bus stops:', error);
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('URL:', error.config?.url);
      }
      // Return Bhopal mock data for development
      return this.getMockBhopalBusStops();
    }
  }

  // Convert API response to GeoJSON format
  private convertToGeoJSON(data: any[]): BusStopsGeoJSON {
    const features = data.map((item, index) => {
      // Try to extract coordinates and name from different possible structures
      let coordinates: [number, number];
      let name: string;
      let osm_id: string;
      let highway: string;

      // Handle different API response structures
      if (item.coordinates) {
        coordinates = [item.coordinates.lng || item.coordinates.longitude, item.coordinates.lat || item.coordinates.latitude];
      } else if (item.lat && item.lng) {
        coordinates = [item.lng, item.lat];
      } else if (item.latitude && item.longitude) {
        coordinates = [item.longitude, item.latitude];
      } else {
        // Default to Bhopal center if no coordinates
        coordinates = [77.4126, 23.2599];
      }

      name = item.name || item.stop_name || item.title || `Bus Stop ${index + 1}`;
      osm_id = item.osm_id || item.id || `api_${index}`;
      highway = item.highway || item.road_type || 'primary';

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
      
      return this.getMockBhopalBusStops();
    } catch (error) {
      console.error('Error searching bus stops:', error);
      // Filter Bhopal mock data for development
      const mockData = this.getMockBhopalBusStops();
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
      
      return this.getMockBhopalBusStops();
    } catch (error) {
      console.error('Error filtering bus stops:', error);
      return this.getMockBhopalBusStops();
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
      return this.getMockBhopalBusStops();
      
    } catch (error) {
      console.error(`Error fetching bus stops for ${city}:`, error);
      return this.getMockBhopalBusStops();
    }
  }

  // Mock data for development/demo - Now returns Bhopal data
  private getMockBusStops(): BusStopsGeoJSON {
    return this.getMockBhopalBusStops();
  }

  // Mock data for Bhopal area
  private getMockBhopalBusStops(): BusStopsGeoJSON {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [77.4126, 23.2599] // Bhopal coordinates
          },
          properties: {
            name: 'New Market Bus Stand',
            osm_id: 'bhopal_001',
            highway: 'primary'
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [77.3910, 23.2156]
          },
          properties: {
            name: 'Habibganj Railway Station',
            osm_id: 'bhopal_002',
            highway: 'trunk'
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [77.4285, 23.2728]
          },
          properties: {
            name: 'MP Nagar Bus Stop',
            osm_id: 'bhopal_003',
            highway: 'secondary'
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [77.4014, 23.2470]
          },
          properties: {
            name: 'Bhopal Junction Railway Station',
            osm_id: 'bhopal_004',
            highway: 'primary'
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [77.4367, 23.2156]
          },
          properties: {
            name: 'ISBT Bhopal',
            osm_id: 'bhopal_005',
            highway: 'trunk'
          }
        }
      ]
    };
  }
}

export default new ApiService();
