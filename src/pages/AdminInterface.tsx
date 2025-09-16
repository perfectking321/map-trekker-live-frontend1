import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import BusMap from '@/components/Map/BusMap';
import { BusStopsGeoJSON } from '@/services/api';
import { 
  ArrowLeft, 
  Shield, 
  Bus, 
  Route as RouteIcon, 
  AlertTriangle,
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  MapPin
} from 'lucide-react';

interface FleetBus {
  id: string;
  route: string;
  driver: string;
  status: 'active' | 'idle' | 'delayed' | 'maintenance';
  location: [number, number];
  crowdLevel: 'low' | 'medium' | 'high';
  lastUpdate: string;
}

const AdminInterface = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fleetData, setFleetData] = useState<FleetBus[]>([]);
  const [selectedBus, setSelectedBus] = useState<FleetBus | null>(null);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    adminId: '',
    password: ''
  });

  // Mock bus stops data
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
    if (isLoggedIn) {
      // Mock fleet data
      setFleetData([
        {
          id: 'BUS001',
          route: 'Route 42A',
          driver: 'John Smith',
          status: 'active',
          location: [12.9716, 77.5946],
          crowdLevel: 'medium',
          lastUpdate: '2 min ago'
        },
        {
          id: 'BUS002',
          route: 'Route 15B',
          driver: 'Sarah Johnson',
          status: 'delayed',
          location: [12.9279, 77.6412],
          crowdLevel: 'high',
          lastUpdate: '1 min ago'
        },
        {
          id: 'BUS003',
          route: 'Route 42A',
          driver: 'Mike Wilson',
          status: 'idle',
          location: [12.9698, 77.5773],
          crowdLevel: 'low',
          lastUpdate: '5 min ago'
        }
      ]);
    }
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Django backend admin authentication
    setIsLoggedIn(true);
    toast({
      title: "Admin Login Successful",
      description: "Welcome to the admin dashboard!",
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setFleetData([]);
    setSelectedBus(null);
    toast({
      title: "Logged Out",
      description: "Admin session ended.",
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'delayed': return 'destructive';
      case 'idle': return 'secondary';
      case 'maintenance': return 'outline';
      default: return 'secondary';
    }
  };

  const getCrowdBadgeVariant = (level: string) => {
    switch (level) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'secondary';
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="absolute top-4 left-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Shield className="h-6 w-6" />
              Admin Login
            </CardTitle>
            <CardDescription>
              Access the fleet management dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminId">Admin ID</Label>
                <Input
                  id="adminId"
                  type="text"
                  placeholder="Enter your admin ID"
                  value={loginData.adminId}
                  onChange={(e) => setLoginData({...loginData, adminId: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Access Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Admin Dashboard
            </h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <Tabs defaultValue="fleet" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="fleet">Fleet Monitor</TabsTrigger>
            <TabsTrigger value="routes">Route Optimization</TabsTrigger>
            <TabsTrigger value="alerts">Predictive Alerts</TabsTrigger>
            <TabsTrigger value="insights">Data Insights</TabsTrigger>
          </TabsList>

          {/* Fleet Monitoring */}
          <TabsContent value="fleet" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-250px)]">
              {/* Fleet Status Sidebar */}
              <div className="lg:col-span-1 space-y-4 lg:max-h-full lg:overflow-y-auto">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Fleet Status</CardTitle>
                    <CardDescription>Real-time bus monitoring</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {fleetData.map((bus) => (
                      <div 
                        key={bus.id} 
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedBus?.id === bus.id ? 'border-primary bg-accent' : 'border-border'
                        }`}
                        onClick={() => setSelectedBus(bus)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-sm">{bus.id}</p>
                            <p className="text-xs text-muted-foreground">{bus.route}</p>
                          </div>
                          <Badge variant={getStatusBadgeVariant(bus.status)} className="text-xs">
                            {bus.status}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Driver:</span>
                            <span className="text-xs">{bus.driver}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Crowd:</span>
                            <Badge variant={getCrowdBadgeVariant(bus.crowdLevel)} className="text-xs">
                              {bus.crowdLevel}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{bus.lastUpdate}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {selectedBus && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Bus Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <h3 className="font-semibold">{selectedBus.id}</h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Route:</span>
                            <span>{selectedBus.route}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Driver:</span>
                            <span>{selectedBus.driver}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant={getStatusBadgeVariant(selectedBus.status)}>
                              {selectedBus.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Fleet Map */}
              <div className="lg:col-span-3 relative">
                <BusMap
                  busStops={busStops}
                  center={[12.9716, 77.5946]}
                  zoom={13}
                />
                
                <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Bus className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Fleet Overview</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Active:</span>
                      <span className="text-success">{fleetData.filter(b => b.status === 'active').length}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Delayed:</span>
                      <span className="text-destructive">{fleetData.filter(b => b.status === 'delayed').length}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Idle:</span>
                      <span className="text-muted-foreground">{fleetData.filter(b => b.status === 'idle').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Route Optimization */}
          <TabsContent value="routes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RouteIcon className="h-5 w-5" />
                    Route Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border border-border rounded-lg">
                      <h4 className="font-medium mb-2">Route 42A</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Efficiency:</span>
                          <span className="text-success">87%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Avg Delay:</span>
                          <span className="text-warning">5 min</span>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline">
                      Optimize Route
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">On-time Performance</span>
                      <span className="text-sm font-medium">82%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Fleet Utilization</span>
                      <span className="text-sm font-medium">91%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Fuel Efficiency</span>
                      <span className="text-sm font-medium">6.2 km/l</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Passenger Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Peak Hours</span>
                      <span className="text-sm font-medium">8-10 AM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Busiest Route</span>
                      <span className="text-sm font-medium">Route 42A</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Occupancy</span>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Predictive Alerts */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Active Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border-l-4 border-l-destructive bg-destructive/5 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm">Route 15B Delay</h4>
                      <Badge variant="destructive" className="text-xs">High</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Predicted 15-minute delay due to traffic congestion</p>
                    <p className="text-xs text-muted-foreground mt-1">ETA: 2 min ago</p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-l-warning bg-warning/5 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm">Maintenance Required</h4>
                      <Badge variant="secondary" className="text-xs">Medium</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">BUS003 scheduled for maintenance in 2 days</p>
                    <p className="text-xs text-muted-foreground mt-1">Due: Dec 15</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Delay Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Route 42A</span>
                      <Badge variant="default" className="text-xs">On Time</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Route 15B</span>
                      <Badge variant="destructive" className="text-xs">+12 min</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Route 7C</span>
                      <Badge variant="secondary" className="text-xs">+3 min</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Data Insights */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="h-5 w-5" />
                    Daily Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Passengers Today</span>
                    <span className="text-sm font-medium">2,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Revenue</span>
                    <span className="text-sm font-medium">₹14,235</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Trips Completed</span>
                    <span className="text-sm font-medium">156</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Peak Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Best Route</span>
                    <span className="text-sm font-medium">Route 42A</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Best Driver</span>
                    <span className="text-sm font-medium">John Smith</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Efficiency</span>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Buses</span>
                    <span className="text-sm font-medium text-success">12/15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">System Uptime</span>
                    <span className="text-sm font-medium text-success">99.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Data Quality</span>
                    <span className="text-sm font-medium text-success">98.5%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Alerts Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Critical</span>
                    <span className="text-sm font-medium text-destructive">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Warnings</span>
                    <span className="text-sm font-medium text-warning">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Resolved</span>
                    <span className="text-sm font-medium text-success">24</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminInterface;