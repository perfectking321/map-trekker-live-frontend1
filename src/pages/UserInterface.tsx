import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import BusMap from '@/components/Map/BusMap';
import { BusStopsGeoJSON, BusStopFeature } from '@/services/api';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Clock, 
  Users, 
  Bell, 
  Route,
  Bus
} from 'lucide-react';

const UserInterface = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedStop, setSelectedStop] = useState<BusStopFeature | null>(null);
  const [destinationStop, setDestinationStop] = useState<BusStopFeature | null>(null);
  const [notifications, setNotifications] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [nearbyBuses, setNearbyBuses] = useState<Array<{
    id: string;
    route: string;
    crowdLevel: 'low' | 'medium' | 'high';
    eta: number;
    distance: number;
  }>>([]);
  
  // Mock bus stops data for demo
  const [busStops] = useState<BusStopsGeoJSON>({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [77.5946, 12.9716] },
        properties: { name: 'MG Road Bus Stop', osm_id: 'mock_001', highway: 'primary' }
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [77.6412, 12.9279] },
        properties: { name: 'Koramangala Bus Terminal', osm_id: 'mock_002', highway: 'secondary' }
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [77.5773, 12.9698] },
        properties: { name: 'Brigade Road Junction', osm_id: 'mock_003', highway: 'primary' }
      }
    ]
  });

  useEffect(() => {
    // Mock nearby buses data
    setNearbyBuses([
      { id: 'BUS001', route: 'Route 42A', crowdLevel: 'low', eta: 5, distance: 0.8 },
      { id: 'BUS002', route: 'Route 15B', crowdLevel: 'medium', eta: 12, distance: 1.2 },
      { id: 'BUS003', route: 'Route 42A', crowdLevel: 'high', eta: 8, distance: 0.5 }
    ]);
  }, []);

  const handleBusStopSelect = (busStop: BusStopFeature) => {
    setSelectedStop(busStop);
  };

  const setAsDestination = (busStop: BusStopFeature) => {
    setDestinationStop(busStop);
    // Mock ETA calculation
    setEstimatedTime(Math.floor(Math.random() * 20) + 5);
    toast({
      title: "Destination Set",
      description: `Navigation to ${busStop.properties.name}`,
    });
  };

  const toggleNotifications = (enabled: boolean) => {
    setNotifications(enabled);
    toast({
      title: enabled ? "Notifications Enabled" : "Notifications Disabled",
      description: enabled ? "You'll receive arrival alerts" : "Arrival alerts turned off",
    });
  };

  const getCrowdBadgeColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Bus Tracker</h1>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <Switch 
              checked={notifications}
              onCheckedChange={toggleNotifications}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 lg:max-h-full lg:overflow-y-auto">
            
            {/* Navigation Card */}
            {destinationStop && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Navigation className="h-5 w-5" />
                    Navigation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium text-sm">Destination</span>
                    </div>
                    <p className="text-sm">{destinationStop.properties.name}</p>
                    {estimatedTime && (
                      <div className="flex items-center gap-1 mt-2">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs text-muted-foreground">
                          ETA: {estimatedTime} min
                        </span>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => {
                      setDestinationStop(null);
                      setEstimatedTime(null);
                    }}
                    className="w-full"
                  >
                    Clear Route
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Nearby Buses */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bus className="h-5 w-5" />
                  Nearby Buses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {nearbyBuses.map((bus) => (
                  <div key={bus.id} className="p-3 border border-border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{bus.route}</p>
                        <p className="text-xs text-muted-foreground">{bus.id}</p>
                      </div>
                      <Badge variant={getCrowdBadgeColor(bus.crowdLevel)} className="text-xs">
                        {bus.crowdLevel}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{bus.distance} km away</span>
                      <span>{bus.eta} min ETA</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Selected Stop Details */}
            {selectedStop && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Bus Stop Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-semibold">{selectedStop.properties.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Highway: {selectedStop.properties.highway || 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: {selectedStop.properties.osm_id}
                    </p>
                  </div>
                  <Button 
                    onClick={() => setAsDestination(selectedStop)}
                    className="w-full"
                    size="sm"
                  >
                    <Route className="h-4 w-4 mr-2" />
                    Navigate Here
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Notifications Settings */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Arrival Alerts</CardTitle>
                <CardDescription className="text-sm">
                  Get notified when your bus approaches
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications" className="text-sm">
                    Enable Notifications
                  </Label>
                  <Switch 
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={toggleNotifications}
                  />
                </div>
                {notifications && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">5 min warning</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">2 min warning</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Arrival alert</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-3 relative">
            <BusMap
              busStops={busStops}
              onBusStopSelect={handleBusStopSelect}
              center={[12.9716, 77.5946]}
              zoom={13}
            />
            
            {/* Map Overlay Info */}
            <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live Tracking</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {nearbyBuses.length} buses nearby
              </p>
            </div>

            {/* ETA Display */}
            {estimatedTime && destinationStop && (
              <div className="absolute bottom-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-semibold">ETA: {estimatedTime} min</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  To {destinationStop.properties.name}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserInterface;