
import { LiveBus, BusRoute } from '@/types/bus';

class BusSimulationService {
  private buses: Map<string, LiveBus> = new Map();
  private routes: BusRoute[] = [];
  private simulationInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeBhopalRoutes();
    this.initializeBuses();
  }

  private initializeBhopalRoutes() {
    this.routes = [
      {
        id: 'route_1',
        name: 'New Market - MP Nagar',
        stops: [
          { id: 'stop_1', name: 'New Market Bus Stand', location: [23.2599, 77.4126], order: 1 },
          { id: 'stop_2', name: 'Bhopal Junction', location: [23.2470, 77.4014], order: 2 },
          { id: 'stop_3', name: 'MP Nagar Bus Stop', location: [23.2728, 77.4285], order: 3 }
        ],
        path: [
          [23.2599, 77.4126],
          [23.2550, 77.4100],
          [23.2500, 77.4050],
          [23.2470, 77.4014],
          [23.2500, 77.4100],
          [23.2600, 77.4200],
          [23.2728, 77.4285]
        ]
      },
      {
        id: 'route_2',
        name: 'Habibganj - ISBT',
        stops: [
          { id: 'stop_4', name: 'Habibganj Railway Station', location: [23.2156, 77.3910], order: 1 },
          { id: 'stop_5', name: 'ISBT Bhopal', location: [23.2156, 77.4367], order: 2 }
        ],
        path: [
          [23.2156, 77.3910],
          [23.2156, 77.4000],
          [23.2156, 77.4200],
          [23.2156, 77.4367]
        ]
      }
    ];
  }

  private initializeBuses() {
    const busData: Omit<LiveBus, 'lastUpdated'>[] = [
      {
        id: 'BUS_001',
        route: 'New Market - MP Nagar',
        currentLocation: [23.2599, 77.4126],
        destination: 'MP Nagar Bus Stop',
        nextStop: 'Bhopal Junction',
        etaToNextStop: 8,
        crowdLevel: 'medium',
        speed: 25,
        direction: 45
      },
      {
        id: 'BUS_002',
        route: 'New Market - MP Nagar',
        currentLocation: [23.2500, 77.4050],
        destination: 'MP Nagar Bus Stop',
        nextStop: 'MP Nagar Bus Stop',
        etaToNextStop: 12,
        crowdLevel: 'high',
        speed: 20,
        direction: 60
      },
      {
        id: 'BUS_003',
        route: 'Habibganj - ISBT',
        currentLocation: [23.2156, 77.4000],
        destination: 'ISBT Bhopal',
        nextStop: 'ISBT Bhopal',
        etaToNextStop: 15,
        crowdLevel: 'low',
        speed: 30,
        direction: 90
      }
    ];

    busData.forEach(bus => {
      this.buses.set(bus.id, { ...bus, lastUpdated: new Date() });
    });
  }

  startSimulation(callback: (buses: LiveBus[]) => void) {
    if (this.simulationInterval) return;

    this.simulationInterval = setInterval(() => {
      this.updateBusPositions();
      callback(Array.from(this.buses.values()));
    }, 3000); // Update every 3 seconds

    // Initial callback
    callback(Array.from(this.buses.values()));
  }

  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  private updateBusPositions() {
    this.buses.forEach((bus, busId) => {
      // Simple simulation: move bus slightly along route
      const route = this.routes.find(r => r.name === bus.route);
      if (!route) return;

      // Move bus position slightly (simulate movement)
      const [lat, lng] = bus.currentLocation;
      const newLat = lat + (Math.random() - 0.5) * 0.001; // Small random movement
      const newLng = lng + (Math.random() - 0.5) * 0.001;

      // Update ETA (decrease by 1 minute, reset if reaches 0)
      let newEta = bus.etaToNextStop - 1;
      if (newEta <= 0) {
        newEta = Math.floor(Math.random() * 15) + 5; // Random ETA between 5-20 minutes
      }

      // Randomly update crowd level
      const crowdLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
      const newCrowdLevel = Math.random() > 0.8 ? 
        crowdLevels[Math.floor(Math.random() * crowdLevels.length)] : 
        bus.crowdLevel;

      this.buses.set(busId, {
        ...bus,
        currentLocation: [newLat, newLng],
        etaToNextStop: newEta,
        crowdLevel: newCrowdLevel,
        lastUpdated: new Date()
      });
    });
  }

  getBuses(): LiveBus[] {
    return Array.from(this.buses.values());
  }

  getBusById(id: string): LiveBus | undefined {
    return this.buses.get(id);
  }

  getRoutes(): BusRoute[] {
    return this.routes;
  }
}

export default new BusSimulationService();
